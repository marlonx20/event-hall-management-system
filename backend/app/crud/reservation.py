from datetime import UTC, date, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.constants import DEFAULT_VENUE_ID
from app.models.reservation import (
    CancellationReason,
    Reservation,
    ReservationStatus,
)
from app.schemas.reservation import ReservationCreate, ReservationUpdate


def create_reservation(
    db: Session,
    reservation_data: ReservationCreate,
) -> Reservation:
    reservation = Reservation(
        venue_id=DEFAULT_VENUE_ID,
        **reservation_data.model_dump(),
    )

    db.add(reservation)
    db.commit()
    db.refresh(reservation)

    return reservation


def get_reservations(db: Session) -> list[Reservation]:
    statement = select(Reservation).order_by(Reservation.event_date)
    return list(db.scalars(statement).all())


def get_reservation(
    db: Session,
    reservation_id: int,
) -> Reservation | None:
    return db.get(Reservation, reservation_id)


def get_confirmed_reservation_by_date(
    db: Session,
    event_date: date,
    excluded_reservation_id: int | None = None,
) -> Reservation | None:
    statement = select(Reservation).where(
        Reservation.event_date == event_date,
        Reservation.status == ReservationStatus.CONFIRMED,
    )

    if excluded_reservation_id is not None:
        statement = statement.where(
            Reservation.id != excluded_reservation_id,
        )

    return db.scalar(statement)


def cancel_other_pending_reservations(
    db: Session,
    confirmed_reservation: Reservation,
) -> None:
    statement = select(Reservation).where(
        Reservation.event_date == confirmed_reservation.event_date,
        Reservation.status == ReservationStatus.PENDING,
        Reservation.id != confirmed_reservation.id,
    )

    pending_reservations = db.scalars(statement).all()
    cancelled_at = datetime.now(UTC)

    for reservation in pending_reservations:
        reservation.status = ReservationStatus.CANCELLED
        reservation.cancelled_at = cancelled_at
        reservation.cancellation_reason = CancellationReason.ANOTHER_RESERVATION_CONFIRMED


def update_reservation(
    db: Session,
    reservation: Reservation,
    reservation_data: ReservationUpdate,
) -> Reservation:
    for field, value in reservation_data.model_dump().items():
        setattr(reservation, field, value)

    db.commit()
    db.refresh(reservation)

    return reservation
