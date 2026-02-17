from unittest.mock import AsyncMock, MagicMock, patch

from app.routes.pingboard import check_service, run_all_checks


async def test_get_services(client, mock_pool):
    mock_pool.fetch.return_value = [
        {
            "id": 1,
            "name": "Test Service",
            "url": "https://example.com",
            "is_active": True,
            "total_checks": 10,
            "uptime_percentage": 99.0,
            "avg_response_time": 150.0,
            "first_check": "2025-01-01T00:00:00",
            "last_check": "2025-01-02T00:00:00",
            "latest_status": "up",
            "recent_response_times": [120, 130, 150, 140, 160],
        }
    ]

    response = await client.get("/api/pingboard/services")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Test Service"
    assert data[0]["latest_status"] == "up"
    assert data[0]["recent_response_times"] == [120, 130, 150, 140, 160]


async def test_get_service_checks(client, mock_pool):
    mock_pool.fetch.return_value = [
        {
            "id": 1,
            "service_id": 1,
            "status_code": 200,
            "response_time": 120,
            "status": "up",
            "error_message": None,
            "checked_at": "2025-01-01T00:05:00",
        }
    ]

    response = await client.get("/api/pingboard/1/checks")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["status"] == "up"


async def test_get_service_checks_custom_limit(client, mock_pool):
    mock_pool.fetch.return_value = []

    response = await client.get("/api/pingboard/1/checks?limit=10")
    assert response.status_code == 200

    # Verify limit was passed to the query
    call_args = mock_pool.fetch.call_args[0]
    assert call_args[2] == 10


async def test_check_service_up():
    service = {"id": 1, "url": "https://example.com"}

    # Mock response from from aiohttp ClientSession object call to monitored service
    mock_response = AsyncMock()
    mock_response.status = 200
    mock_response.read = AsyncMock()
    mock_response.__aenter__ = AsyncMock(return_value=mock_response)
    mock_response.__aexit__ = AsyncMock(return_value=False)

    # Mock aiohttp ClientSession object that calls monitored service
    mock_session = AsyncMock()
    mock_session.get = MagicMock(return_value=mock_response)
    mock_session.__aenter__ = AsyncMock(return_value=mock_session)
    mock_session.__aexit__ = AsyncMock(return_value=False)

    with patch("app.routes.pingboard.aiohttp.ClientSession", return_value=mock_session):
        result = await check_service(service)

    service_id, status_code, response_time, status, error = result
    assert service_id == 1
    assert status_code == 200
    assert status == "up"
    assert error is None


async def test_check_service_slow():
    service = {"id": 1, "url": "https://example.com"}

    # Mock response from from aiohttp ClientSession object call to monitored service
    mock_response = AsyncMock()
    mock_response.status = 200
    mock_response.read = AsyncMock()
    mock_response.__aenter__ = AsyncMock(return_value=mock_response)
    mock_response.__aexit__ = AsyncMock(return_value=False)

    # Mock aiohttp ClientSession object that calls monitored service
    mock_session = AsyncMock()
    mock_session.get = MagicMock(return_value=mock_response)
    mock_session.__aenter__ = AsyncMock(return_value=mock_session)
    mock_session.__aexit__ = AsyncMock(return_value=False)

    # Use patched ClientSession and time.monotonic calls to mimic api call that took 3 seconds
    with (
            patch("app.routes.pingboard.time.monotonic", side_effect=[0,3]),
            patch("app.routes.pingboard.aiohttp.ClientSession", return_value=mock_session)
        ):
            result = await check_service(service)

    service_id, status_code, response_time, status, error = result
    assert service_id == 1
    assert status_code == 200
    assert response_time == 3000
    assert status == "slow"
    assert error is None


async def test_check_service_down_on_error():
    service = {"id": 1, "url": "https://down.example.com"}

    mock_session = AsyncMock()
    mock_session.get = MagicMock(side_effect=Exception("Connection refused"))
    mock_session.__aenter__ = AsyncMock(return_value=mock_session)
    mock_session.__aexit__ = AsyncMock(return_value=False)

    with patch("app.routes.pingboard.aiohttp.ClientSession", return_value=mock_session):
        result = await check_service(service)

    service_id, status_code, response_time, status, error = result
    assert service_id == 1
    assert status_code is None
    assert status == "down"
    assert "Connection refused" in error

async def test_run_all_checks(mock_pool):
    mock_pool.fetch.return_value = [{},{},{}]

    up_service_result = (1, 200, 150, "up", None)
    slow_service_result = (2, 200, 5000, "slow", None)
    down_service_result = (3, None, 10150, "down", "Server did not respond")

    mocked_check_service_results = [
        up_service_result,
        slow_service_result,
        down_service_result
    ]

    mock_check_service = AsyncMock(side_effect=mocked_check_service_results)

    with patch("app.routes.pingboard.check_service", mock_check_service):
        await run_all_checks()

    num_params = len(up_service_result)
    start = 1
    end = start + num_params

    # Verify that database insert query arranged the check results correctly
    for expected_result in mocked_check_service_results:
        assert expected_result == mock_pool.execute.call_args[0][start:end]
        start = end
        end = start + num_params

