from fastapi import FastAPI
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from .routes import pingboard, link, shorten
from .routes.pingboard import run_all_checks
from .db import get_pool, close_pool
from contextlib import asynccontextmanager

scheduler = AsyncIOScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await get_pool()
    scheduler.add_job(run_all_checks, CronTrigger(minute=5))
    scheduler.start()
    yield
    scheduler.shutdown()
    await close_pool()

app = FastAPI(lifespan=lifespan)

app.include_router(pingboard.router)
app.include_router(link.router)
app.include_router(shorten.router)


@app.get("/api/ping")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}

