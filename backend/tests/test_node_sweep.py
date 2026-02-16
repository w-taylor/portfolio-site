import time
import pytest

from unittest.mock import AsyncMock, patch
from app.game.models import Grid, GameState
from app.game.logic import manhattan_distance, nearest_unrevealed_distance, process_probe, validate_placement, get_invalidated_cells
from app.game.bot import NodeSweepBot
from app.main import app
from tests.conftest import noop_lifespan


# --- Pure logic tests ---

class TestManhattanDistance:
    def test_same_cell(self):
        assert manhattan_distance(0, 0, 0, 0) == 0

    def test_adjacent(self):
        assert manhattan_distance(0, 0, 0, 1) == 1
        assert manhattan_distance(0, 0, 1, 0) == 1

    def test_diagonal(self):
        assert manhattan_distance(0, 0, 1, 1) == 2

    def test_distant(self):
        assert manhattan_distance(0, 0, 5, 5) == 10

    def test_symmetric(self):
        assert manhattan_distance(1, 2, 4, 5) == manhattan_distance(4, 5, 1, 2)


class TestProcessProbe:
    def test_miss_returns_distance(self):
        grid = Grid(nodes=[(0, 0), (2, 2), (4, 4)], server_index=0)
        probe = process_probe(grid, 3, 3)
        assert probe.hit is False
        assert probe.distance == 2  # distance to (2,2) or (4,4)

    def test_hit_decoy(self):
        grid = Grid(nodes=[(0, 0), (2, 2), (4, 4)], server_index=0)
        probe = process_probe(grid, 2, 2)
        assert probe.hit is True
        assert probe.is_server is False

    def test_hit_server(self):
        grid = Grid(nodes=[(0, 0), (2, 2), (4, 4)], server_index=0)
        probe = process_probe(grid, 0, 0)
        assert probe.hit is True
        assert probe.is_server is True

    def test_probe_recorded_in_grid(self):
        grid = Grid(nodes=[(0, 0), (2, 2), (4, 4)], server_index=0)
        process_probe(grid, 3, 3)
        assert (3, 3) in grid.probed

    def test_distance_excludes_revealed_nodes(self):
        grid = Grid(nodes=[(0, 0), (5, 5), (3, 3)], server_index=0)
        # Reveal (3, 3) first
        process_probe(grid, 3, 3)
        # Distance should ignore revealed (3,3)
        probe = process_probe(grid, 3, 4)
        assert probe.hit is False
        # Nearest unrevealed: (5,5) at distance 3, or (0,0) at distance 7
        assert probe.distance == 3

    def test_invalidated_cells_after_decoy_hit(self):
        grid = Grid(nodes=[(0, 0), (2, 2), (5, 5)], server_index=0)
        # Probe a cell closest to (2,2)
        process_probe(grid, 2, 3)  # distance 1 to (2,2)
        # Probe a cell equidistant to (2,2) and (0,0)
        process_probe(grid, 1, 1)  # distance 2 to both (0,0) and (2,2)
        # Now hit the decoy at (2,2)
        process_probe(grid, 2, 2)
        invalidated = get_invalidated_cells(grid, 2, 2)
        # (2,3) was nearest to (2,2) at dist 1, now nearest unrevealed is (5,5) at dist 5 — invalidated
        assert [2, 3] in invalidated
        # (1,1) was dist 2 to both (0,0) and (2,2), nearest unrevealed (0,0) is still dist 2 — NOT invalidated
        assert [1, 1] not in invalidated


class TestValidatePlacement:
    def test_valid(self):
        assert validate_placement([[0, 0], [1, 1], [2, 2]], 0) is None

    def test_wrong_count(self):
        assert validate_placement([[0, 0], [1, 1]], 0) is not None
        assert validate_placement([[0, 0], [1, 1], [2, 2], [3, 3]], 0) is not None

    def test_invalid_server_index(self):
        assert validate_placement([[0, 0], [1, 1], [2, 2]], 3) is not None
        assert validate_placement([[0, 0], [1, 1], [2, 2]], -1) is not None

    def test_out_of_bounds(self):
        assert validate_placement([[0, 0], [1, 1], [6, 0]], 0) is not None

    def test_duplicate(self):
        assert validate_placement([[0, 0], [0, 0], [1, 1]], 0) is not None


class TestNodeSweepBot:
    def test_place_nodes(self):
        bot = NodeSweepBot()
        positions, server_idx = bot.place_nodes()
        assert len(positions) == 3
        assert 0 <= server_idx <= 2
        # All positions in bounds
        for r, c in positions:
            assert 0 <= r < 6
            assert 0 <= c < 6

    def test_choose_probe_returns_valid_cell(self):
        bot = NodeSweepBot()
        r, c = bot.choose_probe()
        assert 0 <= r < 6
        assert 0 <= c < 6

    def test_choose_probe_avoids_already_probed(self):
        bot = NodeSweepBot()
        # Probe all but one cell
        for r in range(6):
            for c in range(6):
                if (r, c) != (5, 5):
                    bot.probed.add((r, c))
        r, c = bot.choose_probe()
        assert (r, c) == (5, 5)

    def test_record_probe_miss_adds_clue(self):
        bot = NodeSweepBot()
        bot.record_probe(2, 3, False, 4)
        assert (2, 3) in bot.probed
        assert len(bot.clues) == 1

    def test_record_probe_hit_no_clue(self):
        bot = NodeSweepBot()
        bot.record_probe(2, 3, True, None)
        assert (2, 3) in bot.probed
        assert len(bot.clues) == 0


# --- WebSocket integration tests ---

@pytest.fixture
def mock_pool_ws():
    pool = AsyncMock()
    pool.execute = AsyncMock()
    with (
        patch("app.routes.link.get_pool", return_value=pool),
        patch("app.routes.shorten.get_pool", return_value=pool),
        patch("app.routes.pingboard.get_pool", return_value=pool),
        patch("app.routes.node_sweep.get_pool", return_value=pool),
    ):
        yield pool


@pytest.fixture
def ws_client(mock_pool_ws):
    from starlette.testclient import TestClient
    app.router.lifespan_context = noop_lifespan
    yield TestClient(app)


class TestWebSocket:
    def test_create_bot_game(self, ws_client):
        with ws_client.websocket_connect("/ws/node-sweep") as ws:
            ws.send_json({"type": "create_game", "mode": "bot"})
            data = ws.receive_json()
            assert data["type"] == "game_created"
            assert data["player"] == "p1"
            assert data["game_code"] is None

    def test_bot_game_full_flow(self, ws_client):
        with ws_client.websocket_connect("/ws/node-sweep") as ws:
            # Create game
            ws.send_json({"type": "create_game", "mode": "bot"})
            data = ws.receive_json()
            assert data["type"] == "game_created"

            # Place nodes
            ws.send_json({
                "type": "place_nodes",
                "positions": [[0, 0], [1, 1], [2, 2]],
                "server_index": 0,
            })
            data = ws.receive_json()
            assert data["type"] == "nodes_placed"

            # Should get turn_start
            data = ws.receive_json()
            assert data["type"] == "turn_start"
            assert data["your_turn"] is True

    def test_probe_invalid_before_playing(self, ws_client):
        with ws_client.websocket_connect("/ws/node-sweep") as ws:
            ws.send_json({"type": "create_game", "mode": "bot"})
            ws.receive_json()  # game_created

            # Try to probe before placing
            ws.send_json({"type": "probe", "row": 0, "col": 0})
            data = ws.receive_json()
            assert data["type"] == "error"

    def test_create_game_server_full(self, ws_client):
        from app.routes.node_sweep import games, MAX_GAMES

        # Pre-fill games dict with MAX_GAMES dummy entries
        dummy_ids = []
        for i in range(MAX_GAMES):
            gid = f"dummy-{i}"
            games[gid] = GameState(game_id=gid, mode="bot")
            dummy_ids.append(gid)

        try:
            with ws_client.websocket_connect("/ws/node-sweep") as ws:
                ws.send_json({"type": "create_game", "mode": "bot"})
                data = ws.receive_json()
                assert data["type"] == "error"
                assert "Server is full" in data["message"]

                # Connection should be closed by server
                with pytest.raises(Exception):
                    ws.receive_json()
        finally:
            for gid in dummy_ids:
                games.pop(gid, None)

    def test_join_rate_limit(self, ws_client):
        from app.routes.node_sweep import join_failures, MAX_JOIN_FAILURES

        test_hash = "test-rate-limit-hash"
        now = time.time()
        join_failures[test_hash] = [now - i for i in range(MAX_JOIN_FAILURES)]

        try:
            with patch("app.routes.node_sweep.hash_ip", return_value=test_hash):
                with ws_client.websocket_connect("/ws/node-sweep") as ws:
                    ws.send_json({
                        "type": "join_game",
                        "game_code": "BADCODE",
                    })
                    data = ws.receive_json()
                    assert data["type"] == "error"
                    assert "Too many failed attempts" in data["message"]

                    # Connection should be closed by server
                    with pytest.raises(Exception):
                        ws.receive_json()
        finally:
            join_failures.pop(test_hash, None)

    def test_bot_game_to_completion(self, ws_client, mock_pool_ws):
        with ws_client.websocket_connect("/ws/node-sweep") as ws:
            # Create bot game
            ws.send_json({"type": "create_game", "mode": "bot"})
            data = ws.receive_json()
            assert data["type"] == "game_created"

            # Place nodes
            ws.send_json({
                "type": "place_nodes",
                "positions": [[0, 0], [1, 1], [2, 2]],
                "server_index": 0,
            })
            data = ws.receive_json()
            assert data["type"] == "nodes_placed"

            data = ws.receive_json()
            assert data["type"] == "turn_start"
            assert data["your_turn"] is True

            # Probe every cell until game ends
            game_over = False
            for row in range(6):
                if game_over:
                    break
                for col in range(6):
                    if game_over:
                        break

                    ws.send_json({"type": "probe", "row": row, "col": col})
                    data = ws.receive_json()

                    # Could be probe_result or error (already probed by overlap)
                    if data["type"] == "error":
                        continue

                    assert data["type"] == "probe_result"

                    # Check if we won
                    if data.get("hit") and data.get("is_server"):
                        data = ws.receive_json()
                        assert data["type"] == "game_over"
                        assert data["winner"] == "you"
                        game_over = True
                        continue

                    # Bot's turn — read opponent_probed then turn_start (or game_over)
                    data = ws.receive_json()
                    assert data["type"] == "opponent_probed"

                    if data.get("hit") and data.get("is_server"):
                        data = ws.receive_json()
                        assert data["type"] == "game_over"
                        assert data["winner"] == "opponent"
                        game_over = True
                        continue

                    data = ws.receive_json()
                    assert data["type"] == "turn_start"
                    assert data["your_turn"] is True

            assert game_over, "Game should have ended within 36 probes"
            mock_pool_ws.execute.assert_called_once()

    def test_multiplayer_join_flow(self, ws_client):
        with ws_client.websocket_connect("/ws/node-sweep") as ws1:
            # Player 1 creates multiplayer game
            ws1.send_json({"type": "create_game", "mode": "multiplayer"})
            data = ws1.receive_json()
            assert data["type"] == "game_created"
            assert data["player"] == "p1"
            game_code = data["game_code"]
            assert game_code is not None

            # Player 2 joins with the game code
            with ws_client.websocket_connect("/ws/node-sweep") as ws2:
                ws2.send_json({"type": "join_game", "game_code": game_code})

                # P2 gets game_joined
                data = ws2.receive_json()
                assert data["type"] == "game_joined"
                assert data["player"] == "p2"

                # P1 gets opponent_joined
                data = ws1.receive_json()
                assert data["type"] == "opponent_joined"

                # Both place nodes
                ws1.send_json({
                    "type": "place_nodes",
                    "positions": [[0, 0], [1, 1], [2, 2]],
                    "server_index": 0,
                })
                data = ws1.receive_json()
                assert data["type"] == "nodes_placed"

                ws2.send_json({
                    "type": "place_nodes",
                    "positions": [[3, 3], [4, 4], [5, 5]],
                    "server_index": 0,
                })
                data = ws2.receive_json()
                assert data["type"] == "nodes_placed"

                # Both should receive turn_start after both placed
                data = ws2.receive_json()
                assert data["type"] == "turn_start"

                data = ws1.receive_json()
                assert data["type"] == "turn_start"
                assert data["your_turn"] is True
