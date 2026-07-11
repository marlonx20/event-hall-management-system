from app.schemas.reservation import (
    ReservationCreate,
    ReservationUpdate,
)
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.constants import DEFAULT_VENUE_ID
from app.models.reservation import Reservation


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


def get_reservations(
    db: Session,
) -> list[Reservation]:
    statement = select(Reservation).order_by(Reservation.event_date)

    return list(db.scalars(statement).all())


def get_reservation(
    db: Session,
    reservation_id: int,
) -> Reservation | None:
    return db.get(Reservation, reservation_id)


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
