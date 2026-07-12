from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.routes.customers import router as customers_router
from app.api.routes.payments import router as payments_router
from app.api.routes.reservations import router as reservations_router
from app.api.routes.venue import router as venue_router
from app.db.init_db import create_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db()
    yield


app = FastAPI(
    title="Event Hall Management System API",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(customers_router)
app.include_router(payments_router)
app.include_router(reservations_router)
app.include_router(venue_router)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
