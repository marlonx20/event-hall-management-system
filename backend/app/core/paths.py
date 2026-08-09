import os
import sys
from pathlib import Path


def _get_project_root() -> Path:
    if getattr(
        sys,
        "frozen",
        False,
    ):
        meipass = getattr(
            sys,
            "_MEIPASS",
            None,
        )

        if meipass:
            return Path(meipass)

        return (
            Path(
                sys.executable,
            )
            .resolve()
            .parent
        )

    return Path(__file__).resolve().parents[3]


PROJECT_ROOT = _get_project_root()


def _get_application_data_directory() -> Path:
    if sys.platform == "darwin":
        return Path.home() / "Library" / "Application Support" / "SalonDeEventosManager"

    if os.name == "nt":
        local_app_data = os.environ.get(
            "LOCALAPPDATA",
        )

        if local_app_data:
            return Path(local_app_data) / "SalonDeEventosManager"

        return Path.home() / "AppData" / "Local" / "SalonDeEventosManager"

    xdg_data_home = os.environ.get(
        "XDG_DATA_HOME",
    )

    if xdg_data_home:
        return Path(xdg_data_home) / "SalonDeEventosManager"

    return Path.home() / ".local" / "share" / "SalonDeEventosManager"


APP_DATA_DIRECTORY = _get_application_data_directory()

DATABASE_FILE = APP_DATA_DIRECTORY / "event_hall.db"

STORAGE_DIRECTORY = APP_DATA_DIRECTORY / "storage"

PHOTOS_DIRECTORY = STORAGE_DIRECTORY / "photos"

PAYMENT_RECEIPTS_DIRECTORY = STORAGE_DIRECTORY / "payment_receipts"

BACKUPS_DIRECTORY = STORAGE_DIRECTORY / "backups"

REPORTS_DIRECTORY = STORAGE_DIRECTORY / "reports"

PENDING_RESTORE_FILE = STORAGE_DIRECTORY / "pending_restore.zip"


def ensure_storage_directories() -> None:
    directories = (
        APP_DATA_DIRECTORY,
        STORAGE_DIRECTORY,
        PHOTOS_DIRECTORY,
        PAYMENT_RECEIPTS_DIRECTORY,
        BACKUPS_DIRECTORY,
        REPORTS_DIRECTORY,
    )

    for directory in directories:
        directory.mkdir(
            parents=True,
            exist_ok=True,
        )
