from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[3]

BACKEND_DIRECTORY = PROJECT_ROOT / "backend"
STORAGE_DIRECTORY = PROJECT_ROOT / "storage"

DATABASE_FILE = BACKEND_DIRECTORY / "event_hall.db"

PHOTOS_DIRECTORY = STORAGE_DIRECTORY / "photos"
PAYMENT_RECEIPTS_DIRECTORY = STORAGE_DIRECTORY / "payment_receipts"

BACKUPS_DIRECTORY = STORAGE_DIRECTORY / "backups"
REPORTS_DIRECTORY = STORAGE_DIRECTORY / "reports"
PENDING_RESTORE_FILE = STORAGE_DIRECTORY / "pending_restore.zip"


def ensure_storage_directories() -> None:
    for directory in (
        STORAGE_DIRECTORY,
        PHOTOS_DIRECTORY,
        PAYMENT_RECEIPTS_DIRECTORY,
        BACKUPS_DIRECTORY,
        REPORTS_DIRECTORY,
    ):
        directory.mkdir(parents=True, exist_ok=True)
