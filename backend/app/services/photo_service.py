from pathlib import Path
from uuid import uuid4

from sqlalchemy.orm import Session

from app.core.constants import DEFAULT_VENUE_ID
from app.crud import photo as photo_crud
from app.models.photo import Photo
from app.schemas.photo import PhotoRead

PROJECT_ROOT = Path(__file__).resolve().parents[3]
PHOTOS_DIRECTORY = PROJECT_ROOT / "storage" / "photos"

ALLOWED_CONTENT_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

MAX_PHOTO_SIZE = 10 * 1024 * 1024


def ensure_photos_directory() -> None:
    PHOTOS_DIRECTORY.mkdir(
        parents=True,
        exist_ok=True,
    )


def build_photo_response(photo: Photo) -> PhotoRead:
    return PhotoRead(
        id=photo.id,
        original_name=photo.original_name,
        content_type=photo.content_type,
        is_favorite=photo.is_favorite,
        created_at=photo.created_at,
        url=f"/storage/photos/{photo.filename}",
    )


def save_photo(
    db: Session,
    original_name: str,
    content_type: str,
    file_content: bytes,
) -> Photo:
    extension = ALLOWED_CONTENT_TYPES.get(content_type)

    if extension is None:
        raise ValueError("Only JPEG, PNG and WebP images are allowed")

    if not file_content:
        raise ValueError("The uploaded photo is empty")

    if len(file_content) > MAX_PHOTO_SIZE:
        raise ValueError("The photo cannot exceed 10 MB")

    ensure_photos_directory()

    filename = f"{uuid4().hex}{extension}"
    file_path = PHOTOS_DIRECTORY / filename

    try:
        file_path.write_bytes(file_content)

        photo = photo_crud.create_photo(
            db,
            {
                "venue_id": DEFAULT_VENUE_ID,
                "filename": filename,
                "original_name": original_name,
                "content_type": content_type,
                "is_favorite": False,
            },
        )

        db.commit()
        db.refresh(photo)

        return photo

    except Exception:
        db.rollback()

        if file_path.exists():
            file_path.unlink()

        raise


def update_photo_favorite(
    db: Session,
    photo: Photo,
    is_favorite: bool,
) -> Photo:
    try:
        updated_photo = photo_crud.update_favorite(
            photo,
            is_favorite,
        )

        db.commit()
        db.refresh(updated_photo)

        return updated_photo

    except Exception:
        db.rollback()
        raise


def delete_photo(
    db: Session,
    photo: Photo,
) -> None:
    file_path = PHOTOS_DIRECTORY / photo.filename

    try:
        photo_crud.delete_photo(
            db,
            photo,
        )

        db.commit()

        if file_path.exists():
            file_path.unlink()

    except Exception:
        db.rollback()
        raise
