import time
import asyncio

import aiohttp
from fastapi import APIRouter, Query

from ..db import get_pool

router = APIRouter(
    prefix="/api/pingboard"
)


@router.get("/services")
async def get_services() -> list[dict]:
    pool = await get_pool()
    q = """SELECT ms.*,
                COUNT(sc.id) as total_checks,
                AVG(CASE WHEN NOT sc.status = 'down' THEN 1 ELSE 0 END) * 100 as uptime_percentage,
                AVG(sc.response_time) as avg_response_time,
                MIN(sc.checked_at) as first_check,
                MAX(sc.checked_at) as last_check,
                (SELECT status FROM service_checks
                 WHERE service_id = ms.id
                 ORDER BY checked_at DESC LIMIT 1) as latest_status,
                (SELECT checked_at FROM service_checks
                 WHERE service_id = ms.id AND status = 'down'
                 ORDER BY checked_at DESC LIMIT 1) as last_outage,
                (SELECT array_agg(rt ORDER BY ca)
                 FROM (SELECT response_time as rt, checked_at as ca
                       FROM service_checks
                       WHERE service_id = ms.id AND status != 'down'
                       ORDER BY checked_at DESC LIMIT 24) sub) as recent_response_times
            FROM monitored_services ms
            LEFT JOIN service_checks sc ON ms.id = sc.service_id
            WHERE ms.is_active = true
            GROUP BY ms.id
            ORDER BY ms.id"""
    rows = await pool.fetch(q)
    return [dict(r) for r in rows]


@router.get("/{service_id}/checks")
async def get_service_checks(service_id: int, limit: int = Query(default=50)) -> list[dict]:
    pool = await get_pool()
    q = """SELECT * FROM service_checks
            WHERE service_id = $1
            ORDER BY checked_at DESC
            LIMIT $2"""
    rows = await pool.fetch(q, service_id, limit)
    return [dict(r) for r in rows]


async def check_service(service: dict) -> tuple[int, int | None, int, str, str | None]:
    start_time = time.monotonic()

    print(f"Checking: {service['url']}")

    try:
        timeout = aiohttp.ClientTimeout(total=10)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(
                service["url"],
                headers={"User-Agent": "API-Monitor/1.0"},
            ) as response:
                await response.read()
                response_time = int((time.monotonic() - start_time) * 1000)

                print(f"Response status: {response.status}")

                status = "up"
                if response_time > 2000:
                    status = "slow"
                if response.status >= 400:
                    status = "down"

                return (service["id"], response.status, response_time, status, None)

    except Exception as error:
        response_time = int((time.monotonic() - start_time) * 1000)
        print(f"Check failed, fetch error details: {error}")
        return (service["id"], None, response_time, "down", str(error))


async def run_all_checks() -> None:
    pool = await get_pool()
    rows = await pool.fetch("SELECT * FROM monitored_services WHERE is_active = true")
    services = [dict(row) for row in rows]
    results = await asyncio.gather(*(check_service(s) for s in services))

    if not results:
        return

    params = []
    value_rows = []
    for i, (service_id, status_code, response_time, status, error_message) in enumerate(results):
        offset = i * 5
        value_rows.append(f"(${offset+1}, ${offset+2}, ${offset+3}, ${offset+4}, ${offset+5})")
        params.extend([service_id, status_code, response_time, status, error_message])

    query = f"""INSERT INTO service_checks
         (service_id, status_code, response_time, status, error_message)
         VALUES {', '.join(value_rows)}"""
    await pool.execute(query, *params)
