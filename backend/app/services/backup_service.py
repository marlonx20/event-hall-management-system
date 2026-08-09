from __future__ import annotations

import json
import shutil
import sqlite3
import tempfile
from datetime import UTC, datetime
from pathlib import Path, PurePosixPath
from zipfile import ZIP_DEFLATED, BadZipFile, ZipFile

from app.core.paths import (
    BACKUPS_DIRECTORY,
    DATABASE_FILE,
    PAYMENT_RECEIPTS_DIRECTORY,
    PENDING_RESTORE_FILE,
    PHOTOS_DIRECTORY,
)

APPLICATION_NAME = "Event Hall Management System"
APPLICATION_VERSION = "0.1.0"
BACKUP_FORMAT_VERSION = 1

BACKUP_INFO_PATH = "backup_info.json"
BACKUP_DATABASE_PATH = "database/event_hall.db"

MAX_RESTORE_FILE_SIZE = 2 * 1024 * 1024 * 1024


class BackupValidationError(ValueError):
    pass


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
            (
                PurePosixPath(
                    archive_directory,
                )
                / PurePosixPath(
                    relative_path.as_posix(),
                )
            ),
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
                    BACKUP_DATABASE_PATH,
                )

                photo_count = _add_directory_to_zip(
                    archive,
                    PHOTOS_DIRECTORY,
                    "storage/photos",
                )

                receipt_count = _add_directory_to_zip(
                    archive,
                    PAYMENT_RECEIPTS_DIRECTORY,
                    "storage/payment_receipts",
                )

                backup_info = {
                    "application": APPLICATION_NAME,
                    "application_version": APPLICATION_VERSION,
                    "backup_format_version": BACKUP_FORMAT_VERSION,
                    "created_at": created_at.isoformat(),
                    "database": "SQLite",
                    "contents": {
                        "database": BACKUP_DATABASE_PATH,
                        "photos": photo_count,
                        "payment_receipts": receipt_count,
                    },
                }

                archive.writestr(
                    BACKUP_INFO_PATH,
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


def _is_safe_archive_path(
    archive_path: str,
) -> bool:
    path = PurePosixPath(
        archive_path,
    )

    if path.is_absolute():
        return False

    return ".." not in path.parts


def _read_backup_info(
    archive: ZipFile,
) -> dict[str, object]:
    try:
        raw_info = archive.read(
            BACKUP_INFO_PATH,
        )
    except KeyError as error:
        raise BackupValidationError(
            "El archivo no contiene backup_info.json.",
        ) from error

    try:
        backup_info = json.loads(
            raw_info.decode("utf-8"),
        )
    except (
        UnicodeDecodeError,
        json.JSONDecodeError,
    ) as error:
        raise BackupValidationError(
            "backup_info.json no es válido.",
        ) from error

    if not isinstance(
        backup_info,
        dict,
    ):
        raise BackupValidationError(
            "La información del respaldo no es válida.",
        )

    if backup_info.get("application") != APPLICATION_NAME:
        raise BackupValidationError(
            "El archivo no pertenece a esta aplicación.",
        )

    if (
        backup_info.get(
            "backup_format_version",
        )
        != BACKUP_FORMAT_VERSION
    ):
        raise BackupValidationError(
            "La versión del respaldo no es compatible.",
        )

    return backup_info


def _validate_sqlite_database(
    database_path: Path,
) -> None:
    connection = sqlite3.connect(
        database_path,
    )

    try:
        result = connection.execute(
            "PRAGMA integrity_check;",
        ).fetchone()
    finally:
        connection.close()

    if result is None or result[0] != "ok":
        raise BackupValidationError(
            "La base de datos del respaldo está dañada.",
        )


def validate_backup(
    backup_path: Path,
) -> dict[str, object]:
    if not backup_path.exists():
        raise BackupValidationError(
            "El archivo de respaldo no existe.",
        )

    if backup_path.stat().st_size <= 0:
        raise BackupValidationError(
            "El archivo de respaldo está vacío.",
        )

    if backup_path.stat().st_size > MAX_RESTORE_FILE_SIZE:
        raise BackupValidationError(
            "El archivo de respaldo es demasiado grande.",
        )

    try:
        with ZipFile(
            backup_path,
            mode="r",
        ) as archive:
            names = archive.namelist()

            if not all(_is_safe_archive_path(name) for name in names):
                raise BackupValidationError(
                    "El respaldo contiene rutas no seguras.",
                )

            backup_info = _read_backup_info(
                archive,
            )

            if BACKUP_DATABASE_PATH not in names:
                raise BackupValidationError(
                    "El respaldo no contiene la base de datos.",
                )

            bad_file = archive.testzip()

            if bad_file is not None:
                raise BackupValidationError(
                    "El respaldo está dañado.",
                )

            with tempfile.TemporaryDirectory() as temporary_directory:
                temporary_path = Path(
                    temporary_directory,
                )

                database_path = temporary_path / "event_hall.db"

                with archive.open(
                    BACKUP_DATABASE_PATH,
                ) as source:
                    with database_path.open(
                        "wb",
                    ) as destination:
                        shutil.copyfileobj(
                            source,
                            destination,
                        )

                _validate_sqlite_database(
                    database_path,
                )

            return backup_info

    except BadZipFile as error:
        raise BackupValidationError(
            "El archivo seleccionado no es un ZIP válido.",
        ) from error


def schedule_restore(
    file_content: bytes,
) -> dict[str, object]:
    if not file_content:
        raise BackupValidationError(
            "El archivo de respaldo está vacío.",
        )

    if len(file_content) > MAX_RESTORE_FILE_SIZE:
        raise BackupValidationError(
            "El archivo de respaldo es demasiado grande.",
        )

    PENDING_RESTORE_FILE.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    temporary_file = PENDING_RESTORE_FILE.with_suffix(
        ".tmp",
    )

    try:
        temporary_file.write_bytes(
            file_content,
        )

        backup_info = validate_backup(
            temporary_file,
        )

        temporary_file.replace(
            PENDING_RESTORE_FILE,
        )

        return backup_info

    except Exception:
        if temporary_file.exists():
            temporary_file.unlink()

        raise


def _extract_backup_to_directory(
    backup_path: Path,
    destination: Path,
) -> None:
    with ZipFile(
        backup_path,
        mode="r",
    ) as archive:
        for member in archive.infolist():
            if not _is_safe_archive_path(
                member.filename,
            ):
                raise BackupValidationError(
                    "El respaldo contiene rutas no seguras.",
                )

            target_path = destination / Path(
                *PurePosixPath(
                    member.filename,
                ).parts,
            )

            if member.is_dir():
                target_path.mkdir(
                    parents=True,
                    exist_ok=True,
                )
                continue

            target_path.parent.mkdir(
                parents=True,
                exist_ok=True,
            )

            with archive.open(
                member,
            ) as source:
                with target_path.open(
                    "wb",
                ) as target:
                    shutil.copyfileobj(
                        source,
                        target,
                    )


def _replace_directory(
    source_directory: Path,
    destination_directory: Path,
) -> None:
    if destination_directory.exists():
        shutil.rmtree(
            destination_directory,
        )

    destination_directory.mkdir(
        parents=True,
        exist_ok=True,
    )

    if not source_directory.exists():
        return

    for source_path in source_directory.rglob("*"):
        relative_path = source_path.relative_to(
            source_directory,
        )

        target_path = destination_directory / relative_path

        if source_path.is_dir():
            target_path.mkdir(
                parents=True,
                exist_ok=True,
            )
        elif source_path.is_file():
            target_path.parent.mkdir(
                parents=True,
                exist_ok=True,
            )

            shutil.copy2(
                source_path,
                target_path,
            )


def apply_pending_restore() -> bool:
    if not PENDING_RESTORE_FILE.exists():
        return False

    validate_backup(
        PENDING_RESTORE_FILE,
    )

    safety_backup = create_backup()

    try:
        with tempfile.TemporaryDirectory() as temporary_directory:
            temporary_path = Path(
                temporary_directory,
            )

            _extract_backup_to_directory(
                PENDING_RESTORE_FILE,
                temporary_path,
            )

            restored_database = temporary_path / "database" / "event_hall.db"

            restored_photos = temporary_path / "storage" / "photos"

            restored_receipts = temporary_path / "storage" / "payment_receipts"

            _validate_sqlite_database(
                restored_database,
            )

            database_temp = DATABASE_FILE.with_suffix(
                ".restore.tmp",
            )

            shutil.copy2(
                restored_database,
                database_temp,
            )

            _replace_directory(
                restored_photos,
                PHOTOS_DIRECTORY,
            )

            _replace_directory(
                restored_receipts,
                PAYMENT_RECEIPTS_DIRECTORY,
            )

            database_temp.replace(
                DATABASE_FILE,
            )

        PENDING_RESTORE_FILE.unlink()

        return True

    except Exception as error:
        raise RuntimeError(
            "No fue posible aplicar la restauración. "
            f"Se creó un respaldo de seguridad en: {safety_backup}"
        ) from error
