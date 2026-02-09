import asyncpg
import os

pool: asyncpg.Pool | None = None

async def get_pool() -> asyncpg.Pool:
    global pool
    if pool is None:
        pool = await asyncpg.create_pool(
            host=os.getenv("DB_HOST", "db"),
            port=int(os.getenv("DB_PORT", 5432)),
            user=os.getenv("DB_USER", os.getenv("POSTGRES_USER")),
            password=os.getenv("DB_PASSWORD", os.getenv("POSTGRES_PASSWORD")),
            database=os.getenv("DB_NAME", os.getenv("POSTGRES_DB")),
            min_size=2,
            max_size=10,
        )
    return pool

async def close_pool() -> None:
    global pool
    if pool:
        await pool.close()
        pool = None
