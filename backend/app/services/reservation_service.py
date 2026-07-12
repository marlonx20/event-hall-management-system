from decimal import Decimal

from sqlalchemy.orm import Session

from app.core.constants import DEFAULT_VENUE_ID
from app.crud import payment as payment_crud
from app.crud import reservation as reservation_crud
from app.crud import venue as venue_crud
from app.models.reservation import Reservation, ReservationStatus
from app.schemas.reservation import (
    ReservationCreate,
    ReservationRead,
)


def calculate_total_price(
    has_bouncy_castle: bool,
    venue_id: int,
    db: Session,
) -> Decimal:
    venue = venue_crud.get_venue(
        db,
        venue_id,
    )

    if venue is None:
        raise ValueError("Venue configuration not found")

    total_price = venue.base_price

    if not has_bouncy_castle:
        total_price -= venue.bouncy_castle_cost

    return total_price


def prepare_reservation_create(
    db: Session,
    reservation_data: ReservationCreate,
) -> dict[str, object]:
    total_price = calculate_total_price(
        reservation_data.has_bouncy_castle,
        DEFAULT_VENUE_ID,
        db,
    )

    reservation_dict: dict[str, object] = reservation_data.model_dump()

    reservation_dict["venue_id"] = DEFAULT_VENUE_ID
    reservation_dict["total_price"] = total_price

    return reservation_dict


def build_reservation_response(
    db: Session,
    reservation: Reservation,
) -> ReservationRead:
    amount_paid = payment_crud.get_total_paid(
        db,
        reservation.id,
    )

    extra_charge = reservation.extra_charge or Decimal("0")
    damage_charge = reservation.damage_charge or Decimal("0")

    remaining_balance = reservation.total_price + extra_charge + damage_charge - amount_paid

    reservation_response = ReservationRead.model_validate(
        reservation,
    )

    return reservation_response.model_copy(
        update={
            "amount_paid": amount_paid,
            "remaining_balance": remaining_balance,
        }
    )


def build_reservation_list_response(
    db: Session,
    reservations: list[Reservation],
) -> list[ReservationRead]:
    return [
        build_reservation_response(
            db,
            reservation,
        )
        for reservation in reservations
    ]


def cancel_reservation(
    db: Session,
    reservation: Reservation,
) -> Reservation:
    if reservation.status == ReservationStatus.CANCELLED:
        raise ValueError("Reservation is already cancelled")

    if reservation.status == ReservationStatus.FINISHED:
        raise ValueError("A finished reservation cannot be cancelled")

    try:
        cancelled_reservation = reservation_crud.cancel_reservation_manually(
            db,
            reservation,
        )

        db.commit()
        db.refresh(cancelled_reservation)

        return cancelled_reservation

    except Exception:
        db.rollback()
        raise
