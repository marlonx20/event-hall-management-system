from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.photo import Photo


def create_photo(
    db: Session,
    photo_data: dict[str, object],
) -> Photo:
    photo = Photo(**photo_data)

    db.add(photo)
    db.flush()

    return photo


def get_photo(
    db: Session,
    photo_id: int,
) -> Photo | None:
    return db.get(Photo, photo_id)


def get_photos(db: Session) -> list[Photo]:
    statement = select(Photo).order_by(
        Photo.is_favorite.desc(),
        Photo.created_at.desc(),
    )

    return list(db.scalars(statement).all())


def update_favorite(
    photo: Photo,
    is_favorite: bool,
) -> Photo:
    photo.is_favorite = is_favorite
    return photo


def delete_photo(
    db: Session,
    photo: Photo,
) -> None:
    db.delete(photo)
