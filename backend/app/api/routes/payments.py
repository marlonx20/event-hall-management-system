from decimal import Decimal
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud import payment as payment_crud
from app.crud import reservation as reservation_crud
from app.dependencies.database import get_db
from app.models.payment import Payment
from app.schemas.payment import PaymentCreate, PaymentRead

router = APIRouter(
    prefix="/reservations/{reservation_id}/payments",
    tags=["Payments"],
)


@router.post(
    "",
    response_model=PaymentRead,
    status_code=status.HTTP_201_CREATED,
)
def create_payment(
    reservation_id: int,
    payment_data: PaymentCreate,
    db: Annotated[Session, Depends(get_db)],
) -> Payment:
    reservation = reservation_crud.get_reservation(
        db,
        reservation_id,
    )

    if reservation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reservation not found",
        )

    total_paid = payment_crud.get_total_paid(
        db,
        reservation_id,
    )

    remaining_balance = (
        reservation.total_price
        + (reservation.extra_charge or Decimal("0"))
        + (reservation.damage_charge or Decimal("0"))
        - total_paid
    )

    if payment_data.amount > remaining_balance:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Payment amount exceeds remaining balance",
        )

    return payment_crud.create_payment(
        db,
        reservation,
        payment_data,
    )


@router.get("", response_model=list[PaymentRead])
def get_payments(
    reservation_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> list[Payment]:
    reservation = reservation_crud.get_reservation(
        db,
        reservation_id,
    )

    if reservation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reservation not found",
        )

    return payment_crud.get_payments_by_reservation(
        db,
        reservation_id,
    )
