from __future__ import annotations

import json
import sqlite3
import tempfile
from datetime import UTC, datetime
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

from app.core.paths import (
    BACKUPS_DIRECTORY,
    DATABASE_FILE,
    PAYMENT_RECEIPTS_DIRECTORY,
    PHOTOS_DIRECTORY,
)

APPLICATION_NAME = "Event Hall Management System"
APPLICATION_VERSION = "0.1.0"
BACKUP_FORMAT_VERSION = 1


def _create_database_snapshot(
    destination: Path,
) -> None:
    if not DATABASE_FILE.exists():
        raise FileNotFoundError(
            f"Database file not found: {DATABASE_FILE}",
        )

    destination.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    source_connection = sqlite3.connect(
        DATABASE_FILE,
    )
    destination_connection = sqlite3.connect(
        destination,
    )

    try:
        source_connection.backup(
            destination_connection,
        )
    finally:
        destination_connection.close()
        source_connection.close()


def _add_directory_to_zip(
    archive: ZipFile,
    source_directory: Path,
    archive_directory: str,
) -> int:
    if not source_directory.exists():
        return 0

    added_files = 0

    for file_path in source_directory.rglob("*"):
        if not file_path.is_file():
            continue

        relative_path = file_path.relative_to(
            source_directory,
        )

        archive.write(
            file_path,
            Path(
                archive_directory,
            )
            / relative_path,
        )

        added_files += 1

    return added_files


def create_backup() -> Path:
    BACKUPS_DIRECTORY.mkdir(
        parents=True,
        exist_ok=True,
    )

    created_at = datetime.now(UTC)
    timestamp = created_at.strftime(
        "%Y-%m-%d_%H-%M-%S",
    )

    backup_filename = f"Salon_Backup_{timestamp}.zip"
    backup_path = BACKUPS_DIRECTORY / backup_filename

    try:
        with tempfile.TemporaryDirectory() as temporary_directory:
            temporary_path = Path(
                temporary_directory,
            )

            database_snapshot_path = temporary_path / "event_hall.db"

            _create_database_snapshot(
                database_snapshot_path,
            )

            with ZipFile(
                backup_path,
                mode="w",
                compression=ZIP_DEFLATED,
                compresslevel=9,
            ) as archive:
                archive.write(
                    database_snapshot_path,
                    "database/event_hall.db",
                )

                photo_count = _add_directory_to_zip(
                    archive,
                    PHOTOS_DIRECTORY,
                    "storage/photos",
                )

                receipt_count = _add_directory_to_zip(
                    archive,
                    PAYMENT_RECEIPTS_DIRECTORY,
                    ("storage/payment_receipts"),
                )

                backup_info = {
                    "application": (APPLICATION_NAME),
                    "application_version": (APPLICATION_VERSION),
                    "backup_format_version": (BACKUP_FORMAT_VERSION),
                    "created_at": (created_at.isoformat()),
                    "database": "SQLite",
                    "contents": {
                        "database": ("database/event_hall.db"),
                        "photos": photo_count,
                        "payment_receipts": (receipt_count),
                    },
                }

                archive.writestr(
                    "backup_info.json",
                    json.dumps(
                        backup_info,
                        ensure_ascii=False,
                        indent=2,
                    ),
                )

        return backup_path

    except Exception:
        if backup_path.exists():
            backup_path.unlink()

        raise
