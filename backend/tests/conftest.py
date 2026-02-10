from contextlib import asynccontextmanager
from unittest.mock import AsyncMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@asynccontextmanager
async def noop_lifespan(app):
    yield


@pytest.fixture
def mock_pool():
    pool = AsyncMock()
    with (
        patch("app.routes.link.get_pool", return_value=pool),
        patch("app.routes.shorten.get_pool", return_value=pool),
        patch("app.routes.pingboard.get_pool", return_value=pool),
    ):
        yield pool


@pytest.fixture
async def client(mock_pool):
    app.router.lifespan_context = noop_lifespan
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
