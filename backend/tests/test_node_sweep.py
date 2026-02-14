import pytest
from unittest.mock import AsyncMock, patch

from app.game.models import Grid, GameState
from app.game.logic import manhattan_distance, nearest_unrevealed_distance, process_probe, validate_placement, get_invalidated_cells
from app.game.bot import NodeSweepBot


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


class TestWebSocket:
    @pytest.mark.anyio
    async def test_create_bot_game(self, mock_pool_ws):
        from contextlib import asynccontextmanager
        from httpx import ASGITransport, AsyncClient
        from app.main import app

        @asynccontextmanager
        async def noop_lifespan(app):
            yield

        app.router.lifespan_context = noop_lifespan

        from starlette.testclient import TestClient
        client = TestClient(app)

        with client.websocket_connect("/ws/node-sweep") as ws:
            ws.send_json({"type": "create_game", "mode": "bot"})
            data = ws.receive_json()
            assert data["type"] == "game_created"
            assert data["player"] == "p1"
            assert data["game_code"] is None

    @pytest.mark.anyio
    async def test_bot_game_full_flow(self, mock_pool_ws):
        from contextlib import asynccontextmanager
        from app.main import app

        @asynccontextmanager
        async def noop_lifespan(app):
            yield

        app.router.lifespan_context = noop_lifespan

        from starlette.testclient import TestClient
        client = TestClient(app)

        with client.websocket_connect("/ws/node-sweep") as ws:
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

    @pytest.mark.anyio
    async def test_probe_invalid_before_playing(self, mock_pool_ws):
        from contextlib import asynccontextmanager
        from app.main import app

        @asynccontextmanager
        async def noop_lifespan(app):
            yield

        app.router.lifespan_context = noop_lifespan

        from starlette.testclient import TestClient
        client = TestClient(app)

        with client.websocket_connect("/ws/node-sweep") as ws:
            ws.send_json({"type": "create_game", "mode": "bot"})
            ws.receive_json()  # game_created

            # Try to probe before placing
            ws.send_json({"type": "probe", "row": 0, "col": 0})
            data = ws.receive_json()
            assert data["type"] == "error"
