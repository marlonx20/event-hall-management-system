from decimal import Decimal

from sqlalchemy.orm import Session

from app.crud import payment as payment_crud
from app.models.reservation import Reservation
from app.schemas.reservation import ReservationRead


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

    reservation_response = ReservationRead.model_validate(reservation)

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
    return [build_reservation_response(db, reservation) for reservation in reservations]
