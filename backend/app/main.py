from contextlib import asynccontextmanager

from app.db.init_db import create_db
from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db()
    yield


app = FastAPI(
    title="Event Hall Management System API",
    version="0.1.0",
    lifespan=lifespan,
)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}