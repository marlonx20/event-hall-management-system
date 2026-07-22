from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes.calendar import router as calendar_router
from app.api.routes.customers import router as customers_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.payments import router as payments_router
from app.api.routes.photos import router as photos_router
from app.api.routes.quick_message import router as quick_message_router
from app.api.routes.reservations import router as reservations_router
from app.api.routes.tasks import router as tasks_router
from app.api.routes.venue import router as venue_router
from app.db.init_db import create_db
from app.services.photo_service import PHOTOS_DIRECTORY


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db()
    yield


app = FastAPI(
    title="Event Hall Management System API",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(calendar_router)
app.include_router(customers_router)
app.include_router(dashboard_router)
app.include_router(payments_router)
app.include_router(photos_router)
app.include_router(quick_message_router)
app.include_router(reservations_router)
app.include_router(tasks_router)
app.include_router(venue_router)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


PHOTOS_DIRECTORY.mkdir(parents=True, exist_ok=True)


app.mount(
    "/storage/photos",
    StaticFiles(directory=PHOTOS_DIRECTORY),
    name="photos",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
