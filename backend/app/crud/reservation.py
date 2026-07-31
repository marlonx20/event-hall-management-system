from datetime import UTC, date, datetime

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.reservation import CancellationReason, Reservation, ReservationStatus
from app.utils.date_utils import get_next_month_start


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


def search_reservations(
    db: Session,
    query: str,
) -> list[Reservation]:
    normalized_query = query.strip()

    if not normalized_query:
        return []

    search_pattern = f"%{normalized_query}%"

    statement = (
        select(Reservation)
        .join(
            Customer,
            Reservation.customer_id == Customer.id,
        )
        .where(
            or_(
                Customer.full_name.ilike(search_pattern),
                Customer.phone_number.ilike(search_pattern),
                Reservation.event_type.ilike(search_pattern),
            )
        )
        .order_by(
            Reservation.event_date.desc(),
            Reservation.start_time.desc(),
        )
        .limit(20)
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


def restore_auto_cancelled_reservations(
    db: Session,
    event_date: date,
) -> None:
    statement = select(Reservation).where(
        Reservation.event_date == event_date,
        Reservation.status == ReservationStatus.CANCELLED,
        Reservation.cancellation_reason == CancellationReason.ANOTHER_RESERVATION_CONFIRMED,
    )

    cancelled_reservations = db.scalars(statement).all()

    for reservation in cancelled_reservations:
        reservation.status = ReservationStatus.PENDING
        reservation.cancelled_at = None
        reservation.cancellation_reason = None


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


def get_reservations_by_month(
    db: Session,
    year: int,
    month: int,
) -> list[Reservation]:
    month_start = date(year, month, 1)
    next_month_start = get_next_month_start(year, month)

    statement = (
        select(Reservation)
        .where(
            Reservation.event_date >= month_start,
            Reservation.event_date < next_month_start,
        )
        .order_by(
            Reservation.event_date,
            Reservation.start_time,
        )
    )

    return list(db.scalars(statement).all())


def get_reservations_by_customer(
    db: Session,
    customer_id: int,
) -> list[Reservation]:
    statement = (
        select(Reservation)
        .where(
            Reservation.customer_id == customer_id,
        )
        .order_by(
            Reservation.event_date.desc(),
            Reservation.start_time.desc(),
            Reservation.id.desc(),
        )
    )

    return list(db.scalars(statement).all())
