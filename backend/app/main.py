from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api.routes.backups import router as backups_router
from app.api.routes.calendar import router as calendar_router
from app.api.routes.customers import router as customers_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.payments import router as payments_router
from app.api.routes.photos import router as photos_router
from app.api.routes.quick_message import router as quick_message_router
from app.api.routes.reservations import router as reservations_router
from app.api.routes.tasks import router as tasks_router
from app.api.routes.venue import router as venue_router
from app.core.paths import PHOTOS_DIRECTORY, PROJECT_ROOT, ensure_storage_directories
from app.db.init_db import create_db
from app.services.backup_service import apply_pending_restore

FRONTEND_DIST_DIRECTORY = PROJECT_ROOT / "frontend" / "dist"

FRONTEND_ASSETS_DIRECTORY = FRONTEND_DIST_DIRECTORY / "assets"

FRONTEND_INDEX_FILE = FRONTEND_DIST_DIRECTORY / "index.html"


ensure_storage_directories()


@asynccontextmanager
async def lifespan(
    app: FastAPI,
):
    apply_pending_restore()
    create_db()

    yield


app = FastAPI(
    title="Event Hall Management System API",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(backups_router)
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


app.mount(
    "/storage/photos",
    StaticFiles(
        directory=PHOTOS_DIRECTORY,
    ),
    name="photos",
)


if FRONTEND_ASSETS_DIRECTORY.exists():
    app.mount(
        "/assets",
        StaticFiles(
            directory=FRONTEND_ASSETS_DIRECTORY,
        ),
        name="frontend-assets",
    )


@app.get(
    "/{full_path:path}",
    include_in_schema=False,
)
def serve_frontend(
    full_path: str,
):
    if not FRONTEND_INDEX_FILE.exists():
        return {
            "detail": (
                "Frontend build not found. Run 'npm run build' inside the frontend directory."
            )
        }

    requested_path = FRONTEND_DIST_DIRECTORY / full_path

    if full_path and requested_path.is_file() and FRONTEND_DIST_DIRECTORY in requested_path.parents:
        return FileResponse(
            requested_path,
        )

    return FileResponse(
        FRONTEND_INDEX_FILE,
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
