from sqlalchemy.orm import Session

from app.core.constants import DEFAULT_VENUE_ID
from app.crud import quick_message as quick_message_crud
from app.models.quick_message import QuickMessage
from app.schemas.quick_message import (
    QuickMessageCreate,
    QuickMessageUpdate,
)


def create_quick_message(
    db: Session,
    message_data: QuickMessageCreate,
) -> QuickMessage:
    create_data: dict[str, object] = message_data.model_dump()
    create_data["venue_id"] = DEFAULT_VENUE_ID

    try:
        quick_message = quick_message_crud.create_quick_message(
            db,
            create_data,
        )

        db.commit()
        db.refresh(quick_message)

        return quick_message

    except Exception:
        db.rollback()
        raise


def update_quick_message(
    db: Session,
    quick_message: QuickMessage,
    message_data: QuickMessageUpdate,
) -> QuickMessage:
    update_data: dict[str, object] = message_data.model_dump(
        exclude_unset=True,
    )

    try:
        updated_message = quick_message_crud.update_quick_message(
            quick_message,
            update_data,
        )

        db.commit()
        db.refresh(updated_message)

        return updated_message

    except Exception:
        db.rollback()
        raise


def delete_quick_message(
    db: Session,
    quick_message: QuickMessage,
) -> None:
    try:
        quick_message_crud.delete_quick_message(
            db,
            quick_message,
        )

        db.commit()

    except Exception:
        db.rollback()
        raise
