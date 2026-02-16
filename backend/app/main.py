from fastapi import FastAPI
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from .routes import pingboard, link, shorten, node_sweep
from .routes.pingboard import run_all_checks
from .routes.node_sweep import reap_stale_games
from .db import get_pool, close_pool
from contextlib import asynccontextmanager

scheduler = AsyncIOScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await get_pool()
    scheduler.add_job(run_all_checks, CronTrigger(minute=5))
    scheduler.add_job(reap_stale_games, IntervalTrigger(minutes=5))
    scheduler.start()
    yield
    scheduler.shutdown()
    await close_pool()

app = FastAPI(lifespan=lifespan)

app.include_router(pingboard.router)
app.include_router(link.router)
app.include_router(shorten.router)
app.include_router(node_sweep.router)


@app.get("/api/ping")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}

