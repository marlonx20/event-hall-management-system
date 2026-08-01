from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse

from app.services.backup_service import create_backup

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
