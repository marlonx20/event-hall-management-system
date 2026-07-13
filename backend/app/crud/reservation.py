from datetime import UTC, date, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.reservation import (
    CancellationReason,
    Reservation,
    ReservationStatus,
)


def create_reservation(
    db: Session,
    reservation_data: dict[str, object],
) -> Reservation:
    reservation = Reservation(**reservation_data)

    db.add(reservation)
    db.commit()
    db.refresh(reservation)

    return reservation


def get_reservations(
    db: Session,
) -> list[Reservation]:
    statement = select(Reservation).order_by(
        Reservation.event_date,
        Reservation.start_time,
    )

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
    update_data: dict[str, object],
) -> Reservation:
    for field, value in update_data.items():
        setattr(reservation, field, value)

    db.commit()
    db.refresh(reservation)

    return reservation


def cancel_reservation_manually(
    db: Session,
    reservation: Reservation,
) -> Reservation:
    reservation.status = ReservationStatus.CANCELLED
    reservation.cancelled_at = datetime.now(UTC)
    reservation.cancellation_reason = CancellationReason.MANUAL

    return reservation


def finish_reservation(
    reservation: Reservation,
    final_comments: str | None,
) -> Reservation:
    reservation.final_comments = final_comments
    reservation.status = ReservationStatus.FINISHED

    return reservation
