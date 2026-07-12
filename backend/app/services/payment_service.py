from decimal import Decimal

from sqlalchemy.orm import Session

from app.crud import payment as payment_crud
from app.crud import reservation as reservation_crud
from app.models.payment import Payment, PaymentConcept
from app.models.reservation import Reservation, ReservationStatus
from app.schemas.payment import PaymentCreate


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


def register_payment(
    db: Session,
    reservation: Reservation,
    payment_data: PaymentCreate,
) -> Payment:
    remaining_balance = calculate_remaining_balance(
        db,
        reservation,
    )

    if payment_data.amount > remaining_balance:
        raise ValueError("Payment amount exceeds remaining balance")

    if reservation.status == ReservationStatus.CANCELLED:
        raise ValueError("Cannot register a payment for a cancelled reservation")

    if reservation.status == ReservationStatus.FINISHED:
        raise ValueError("Cannot register a payment for a finished reservation")

    if (
        payment_data.concept == PaymentConcept.DEPOSIT
        and reservation.status == ReservationStatus.PENDING
    ):
        confirmed_reservation = reservation_crud.get_confirmed_reservation_by_date(
            db,
            reservation.event_date,
            excluded_reservation_id=reservation.id,
        )

        if confirmed_reservation is not None:
            raise ValueError("Another reservation is already confirmed for this date")

    try:
        payment = payment_crud.create_payment(
            db,
            reservation,
            payment_data,
        )

        if (
            payment_data.concept == PaymentConcept.DEPOSIT
            and reservation.status == ReservationStatus.PENDING
        ):
            reservation.status = ReservationStatus.CONFIRMED

            reservation_crud.cancel_other_pending_reservations(
                db,
                reservation,
            )

        db.commit()
        db.refresh(payment)
        db.refresh(reservation)

        return payment

    except Exception:
        db.rollback()
        raise
