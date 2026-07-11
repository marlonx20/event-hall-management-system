from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.models.reservation import Reservation
from app.schemas.payment import PaymentCreate


def create_payment(
    db: Session,
    reservation: Reservation,
    payment_data: PaymentCreate,
) -> Payment:
    payment = Payment(
        reservation_id=reservation.id,
        **payment_data.model_dump(),
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment


def get_payments_by_reservation(
    db: Session,
    reservation_id: int,
) -> list[Payment]:
    statement = (
        select(Payment)
        .where(Payment.reservation_id == reservation_id)
        .order_by(Payment.payment_date, Payment.id)
    )

    return list(db.scalars(statement).all())


def get_total_paid(
    db: Session,
    reservation_id: int,
) -> Decimal:
    statement = select(func.coalesce(func.sum(Payment.amount), 0)).where(
        Payment.reservation_id == reservation_id
    )

    total = db.scalar(statement)

    return Decimal(total)
