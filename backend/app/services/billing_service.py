from decimal import Decimal

from sqlalchemy.orm import Session

from app.crud import payment as payment_crud
from app.models.reservation import Reservation


def calculate_remaining_balance(
    db: Session,
    reservation: Reservation,
) -> Decimal:
    total_paid = payment_crud.get_total_paid(
        db,
        reservation.id,
    )

    extra_charge = reservation.extra_charge or Decimal("0")
    damage_charge = reservation.damage_charge or Decimal("0")

    return reservation.total_price + extra_charge + damage_charge - total_paid
