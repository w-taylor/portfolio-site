import uuid
import random
import string
import asyncio

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from ..game.models import GameState, Grid
from ..game.logic import process_probe, validate_placement, get_invalidated_cells
from ..game.bot import NodeSweepBot
from ..db import get_pool

router = APIRouter()


@router.get("/api/node-sweep/stats")
async def get_stats():
    pool = await get_pool()
    row = await pool.fetchrow("""
        SELECT
            COUNT(*) AS total_games,
            COUNT(*) FILTER (WHERE mode = 'bot' AND winner = 'opponent') AS bot_wins,
            COUNT(*) FILTER (WHERE mode = 'bot') AS bot_games,
            ROUND(AVG(total_probes) FILTER (WHERE winner IS NOT NULL))::int AS avg_probes
        FROM node_sweep_games
    """)
    bot_winrate = round(row["bot_wins"] / row["bot_games"], 2) if row["bot_games"] else None
    return {
        "total_games": row["total_games"],
        "bot_winrate": bot_winrate,
        "avg_probes_to_win": row["avg_probes"],
    }


MAX_GAMES = 20
games: dict[str, GameState] = {}
game_codes: dict[str, str] = {}


def generate_code(length: int = 5) -> str:
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=length))


async def save_finished_game(state: GameState) -> None:
    try:
        pool = await get_pool()
        await pool.execute(
            """INSERT INTO node_sweep_games (game_id, mode, winner, total_probes)
               VALUES ($1, $2, $3, $4)""",
            state.game_id, state.mode, state.winner, state.total_probes,
        )
    except Exception as e:
        print(f"Failed to save game: {e}")


async def send_json(ws: WebSocket, data: dict) -> None:
    try:
        await ws.send_json(data)
    except Exception:
        pass


def probe_to_dict(probe) -> dict:
    result = {"row": probe.row, "col": probe.col, "hit": probe.hit}
    if probe.hit:
        result["is_server"] = probe.is_server
    else:
        result["distance"] = probe.distance
    return result


async def handle_bot_turn(state: GameState, player_ws: WebSocket) -> None:
    await asyncio.sleep(random.uniform(0.5, 1.0))

    bot = state.bot
    row, col = bot.choose_probe()
    probe = process_probe(state.grids["p1"], row, col)
    state.total_probes += 1
    bot.record_probe(row, col, probe.hit, probe.distance)

    result = probe_to_dict(probe)

    if probe.hit and not probe.is_server:
        result["invalidated"] = get_invalidated_cells(state.grids["p1"], row, col)

    await send_json(player_ws, {"type": "opponent_probed", **result})

    if probe.hit and probe.is_server:
        state.winner = "opponent"
        state.phase = "finished"
        await send_json(player_ws, {"type": "game_over", "winner": "opponent"})
        await save_finished_game(state)
        return

    state.current_turn = "p1"
    await send_json(player_ws, {"type": "turn_start", "your_turn": True})


async def handle_message(ws: WebSocket, player: str, data: dict, state: GameState) -> None:
    msg_type = data.get("type")

    if msg_type == "place_nodes":
        positions = data.get("positions", [])
        server_index = data.get("server_index", 0)

        error = validate_placement(positions, server_index)
        if error:
            await send_json(ws, {"type": "error", "message": error})
            return

        grid = Grid(
            nodes=[(r, c) for r, c in positions],
            server_index=server_index,
        )
        state.grids[player] = grid
        state.placed[player] = True
        await send_json(ws, {"type": "nodes_placed"})

        if state.mode == "bot" and player == "p1":
            bot = state.bot
            bot_positions, bot_server = bot.place_nodes()
            state.grids["p2"] = Grid(
                nodes=[(r, c) for r, c in bot_positions],
                server_index=bot_server,
            )
            state.placed["p2"] = True

        if state.placed.get("p1") and state.placed.get("p2"):
            state.phase = "playing"
            state.current_turn = "p1"
            await send_json(state.ws_connections["p1"], {"type": "turn_start", "your_turn": True})
            if "p2" in state.ws_connections:
                await send_json(state.ws_connections["p2"], {"type": "turn_start", "your_turn": False})

    elif msg_type == "probe":
        if state.phase != "playing":
            await send_json(ws, {"type": "error", "message": "Game is not in playing phase"})
            return
        if state.current_turn != player:
            await send_json(ws, {"type": "error", "message": "Not your turn"})
            return

        row = data.get("row")
        col = data.get("col")
        if row is None or col is None:
            await send_json(ws, {"type": "error", "message": "Missing row or col"})
            return
        if not (0 <= row < 6 and 0 <= col < 6):
            await send_json(ws, {"type": "error", "message": "Out of bounds"})
            return

        opponent = "p2" if player == "p1" else "p1"
        opponent_grid = state.grids.get(opponent)
        if not opponent_grid:
            await send_json(ws, {"type": "error", "message": "Opponent grid not ready"})
            return

        if (row, col) in opponent_grid.probed:
            await send_json(ws, {"type": "error", "message": "Cell already probed"})
            return

        probe = process_probe(opponent_grid, row, col)
        state.total_probes += 1
        result = probe_to_dict(probe)

        if probe.hit and not probe.is_server:
            result["invalidated"] = get_invalidated_cells(opponent_grid, row, col)

        await send_json(ws, {"type": "probe_result", **result})

        if opponent in state.ws_connections:
            await send_json(state.ws_connections[opponent], {"type": "opponent_probed", **result})

        if probe.hit and probe.is_server:
            state.winner = "you" if player == "p1" else "opponent"
            state.phase = "finished"
            await send_json(ws, {"type": "game_over", "winner": "you"})
            if opponent in state.ws_connections:
                opponent_winner = "opponent"
                await send_json(state.ws_connections[opponent], {"type": "game_over", "winner": opponent_winner})
            await save_finished_game(state)
            return

        if state.mode == "bot" and player == "p1":
            await handle_bot_turn(state, ws)
        else:
            state.current_turn = opponent
            await send_json(ws, {"type": "turn_start", "your_turn": False})
            if opponent in state.ws_connections:
                await send_json(state.ws_connections[opponent], {"type": "turn_start", "your_turn": True})


@router.websocket("/ws/node-sweep")
async def node_sweep_ws(ws: WebSocket):
    await ws.accept()
    game_id = None
    player = None

    try:
        while True:
            data = await ws.receive_json()
            msg_type = data.get("type")

            if msg_type == "create_game":
                if len(games) >= MAX_GAMES:
                    await send_json(ws, {"type": "error", "message": "Server is full, try again later"})
                    await ws.close()
                    return
                mode = data.get("mode", "bot")
                game_id = str(uuid.uuid4())
                state = GameState(game_id=game_id, mode=mode)
                player = "p1"
                state.ws_connections["p1"] = ws
                state.placed = {"p1": False, "p2": False}

                if mode == "bot":
                    state.bot = NodeSweepBot()
                    state.phase = "setup"
                    games[game_id] = state
                    await send_json(ws, {
                        "type": "game_created",
                        "game_id": game_id,
                        "game_code": None,
                        "player": "p1",
                    })
                else:
                    code = generate_code()
                    state.game_code = code
                    state.phase = "waiting"
                    games[game_id] = state
                    game_codes[code] = game_id
                    await send_json(ws, {
                        "type": "game_created",
                        "game_id": game_id,
                        "game_code": code,
                        "player": "p1",
                    })

            elif msg_type == "join_game":
                code = data.get("game_code", "").strip().upper()
                if code not in game_codes:
                    await send_json(ws, {"type": "error", "message": "Invalid game code"})
                    continue

                game_id = game_codes[code]
                state = games.get(game_id)
                if not state or state.phase != "waiting":
                    await send_json(ws, {"type": "error", "message": "Game not available"})
                    continue

                player = "p2"
                state.ws_connections["p2"] = ws
                state.phase = "setup"
                await send_json(ws, {
                    "type": "game_joined",
                    "game_id": game_id,
                    "player": "p2",
                })
                await send_json(state.ws_connections["p1"], {"type": "opponent_joined"})

            elif game_id and game_id in games:
                await handle_message(ws, player, data, games[game_id])

    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        if game_id and game_id in games:
            state = games[game_id]
            if player and player in state.ws_connections:
                del state.ws_connections[player]
            # Notify remaining opponent of disconnection
            if state.phase != "finished":
                opponent = "p2" if player == "p1" else "p1"
                if opponent in state.ws_connections:
                    await send_json(state.ws_connections[opponent], {"type": "opponent_disconnected"})
            # Clean up game if no connections remain, or if game is now unplayable
            if not state.ws_connections or state.phase == "finished":
                games.pop(game_id, None)
                if state.game_code:
                    game_codes.pop(state.game_code, None)
