from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.quick_message import QuickMessage


def create_quick_message(
    db: Session,
    message_data: dict[str, object],
) -> QuickMessage:
    quick_message = QuickMessage(**message_data)

    db.add(quick_message)
    db.flush()

    return quick_message


def get_quick_message(
    db: Session,
    message_id: int,
) -> QuickMessage | None:
    return db.get(QuickMessage, message_id)


def get_quick_messages(
    db: Session,
    venue_id: int,
) -> list[QuickMessage]:
    statement = (
        select(QuickMessage)
        .where(QuickMessage.venue_id == venue_id)
        .order_by(
            QuickMessage.display_order,
            QuickMessage.title,
            QuickMessage.id,
        )
    )

    return list(db.scalars(statement).all())


def update_quick_message(
    quick_message: QuickMessage,
    update_data: dict[str, object],
) -> QuickMessage:
    for field, value in update_data.items():
        setattr(quick_message, field, value)

    return quick_message


def delete_quick_message(
    db: Session,
    quick_message: QuickMessage,
) -> None:
    db.delete(quick_message)
