from sqlalchemy.orm import Session

from app.crud import payment as payment_crud
from app.crud import reservation as reservation_crud
from app.models.payment import Payment, PaymentConcept
from app.models.reservation import Reservation, ReservationStatus
from app.schemas.payment import PaymentCreate
from app.services.billing_service import calculate_remaining_balance


def register_payment(
    db: Session,
    reservation: Reservation,
    payment_data: PaymentCreate,
) -> Payment:
    remaining_balance = calculate_remaining_balance(
        db,
        reservation,
    )

    if reservation.status == ReservationStatus.CANCELLED:
        raise ValueError("Cannot register a payment for a cancelled reservation")

    if reservation.status == ReservationStatus.FINISHED:
        raise ValueError("Cannot register a payment for a finished reservation")

    if reservation.status == ReservationStatus.PENDING and payment_data.concept in {
        PaymentConcept.EXTRA_HOURS,
        PaymentConcept.DAMAGES,
    }:
        raise ValueError("Extra hours and damage payments require a confirmed reservation")

    existing_payments = payment_crud.get_payments_by_reservation(
        db,
        reservation.id,
    )

    has_deposit = any(payment.concept == PaymentConcept.DEPOSIT for payment in existing_payments)

    if payment_data.concept == PaymentConcept.DEPOSIT and has_deposit:
        raise ValueError("A deposit has already been registered for this reservation")

    if payment_data.amount > remaining_balance:
        raise ValueError("Payment amount exceeds remaining balance")

    if (
        payment_data.concept == PaymentConcept.FINAL_PAYMENT
        and payment_data.amount != remaining_balance
    ):
        raise ValueError("Final payment must cover the entire remaining balance")

    should_confirm = reservation.status == ReservationStatus.PENDING and payment_data.concept in {
        PaymentConcept.DEPOSIT,
        PaymentConcept.FINAL_PAYMENT,
    }

    if should_confirm:
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

        if should_confirm:
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
