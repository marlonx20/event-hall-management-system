from fastapi import APIRouter, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse

from app.services.backup_service import BackupValidationError, create_backup, schedule_restore

router = APIRouter(
    prefix="/backups",
    tags=["Backups"],
)


@router.post(
    "",
    response_class=FileResponse,
    status_code=status.HTTP_200_OK,
)
def create_backup_file() -> FileResponse:
    try:
        backup_path = create_backup()
    except FileNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(error),
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No fue posible crear el respaldo.",
        ) from error

    return FileResponse(
        path=backup_path,
        media_type="application/zip",
        filename=backup_path.name,
    )


@router.post(
    "/restore",
    status_code=status.HTTP_202_ACCEPTED,
)
async def restore_backup(
    backup_file: UploadFile = File(...),
) -> dict[str, object]:
    filename = backup_file.filename or "respaldo.zip"

    if not filename.lower().endswith(".zip"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selecciona un archivo ZIP de respaldo.",
        )

    try:
        file_content = await backup_file.read()
        backup_info = schedule_restore(file_content)
    except BackupValidationError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No fue posible preparar la restauración.",
        ) from error
    finally:
        await backup_file.close()

    return {
        "message": (
            "El respaldo fue validado. Reinicia la aplicación para completar la restauración."
        ),
        "restart_required": True,
        "backup_filename": filename,
        "backup_created_at": backup_info.get("created_at"),
    }
