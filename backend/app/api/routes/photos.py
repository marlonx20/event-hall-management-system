from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    Response,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.crud import photo as photo_crud
from app.dependencies.database import get_db
from app.schemas.photo import PhotoFavoriteUpdate, PhotoRead
from app.services import photo_service

router = APIRouter(
    prefix="/photos",
    tags=["Photos"],
)


@router.post(
    "",
    response_model=PhotoRead,
    status_code=status.HTTP_201_CREATED,
)
async def upload_photo(
    db: Annotated[Session, Depends(get_db)],
    photo_file: Annotated[UploadFile, File()],
) -> PhotoRead:
    content_type = photo_file.content_type

    if content_type is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The file has no content type",
        )

    try:
        file_content = await photo_file.read()

        photo = photo_service.save_photo(
            db=db,
            original_name=photo_file.filename or "photo",
            content_type=content_type,
            file_content=file_content,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error
    finally:
        await photo_file.close()

    return photo_service.build_photo_response(photo)


@router.get("", response_model=list[PhotoRead])
def get_photos(
    db: Annotated[Session, Depends(get_db)],
) -> list[PhotoRead]:
    photos = photo_crud.get_photos(db)

    return [photo_service.build_photo_response(photo) for photo in photos]


@router.put(
    "/{photo_id}/favorite",
    response_model=PhotoRead,
)
def update_photo_favorite(
    photo_id: int,
    favorite_data: PhotoFavoriteUpdate,
    db: Annotated[Session, Depends(get_db)],
) -> PhotoRead:
    photo = photo_crud.get_photo(
        db,
        photo_id,
    )

    if photo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found",
        )

    updated_photo = photo_service.update_photo_favorite(
        db,
        photo,
        favorite_data.is_favorite,
    )

    return photo_service.build_photo_response(updated_photo)


@router.delete(
    "/{photo_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_photo(
    photo_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> Response:
    photo = photo_crud.get_photo(
        db,
        photo_id,
    )

    if photo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found",
        )

    photo_service.delete_photo(
        db,
        photo,
    )

    return Response(status_code=status.HTTP_204_NO_CONTENT)
