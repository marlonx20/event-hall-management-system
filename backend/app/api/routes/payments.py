from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud import payment as payment_crud
from app.crud import reservation as reservation_crud
from app.dependencies.database import get_db
from app.models.payment import Payment
from app.schemas.payment import PaymentCreate, PaymentRead
from app.services import payment_service

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

    try:
        return payment_service.register_payment(
            db,
            reservation,
            payment_data,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


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
