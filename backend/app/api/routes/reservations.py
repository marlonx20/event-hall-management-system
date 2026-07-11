from typing import Annotated

from app.schemas.reservation import (
    ReservationCreate,
    ReservationRead,
    ReservationUpdate,
)
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud import customer as customer_crud
from app.crud import reservation as reservation_crud
from app.dependencies.database import get_db
from app.models.reservation import Reservation

router = APIRouter(
    prefix="/reservations",
    tags=["Reservations"],
)


@router.post(
    "",
    response_model=ReservationRead,
    status_code=status.HTTP_201_CREATED,
)
def create_reservation(
    reservation_data: ReservationCreate,
    db: Annotated[Session, Depends(get_db)],
) -> Reservation:
    customer = customer_crud.get_customer(
        db,
        reservation_data.customer_id,
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    existing_reservation = reservation_crud.get_active_reservation_by_date(
        db,
        reservation_data.event_date,
    )

    if existing_reservation is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An active reservation already exists for this date",
        )

    return reservation_crud.create_reservation(
        db,
        reservation_data,
    )


@router.get("", response_model=list[ReservationRead])
def get_reservations(
    db: Annotated[Session, Depends(get_db)],
) -> list[Reservation]:
    return reservation_crud.get_reservations(db)


@router.get("/{reservation_id}", response_model=ReservationRead)
def get_reservation(
    reservation_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> Reservation:
    reservation = reservation_crud.get_reservation(
        db,
        reservation_id,
    )

    if reservation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reservation not found",
        )

    return reservation


@router.put("/{reservation_id}", response_model=ReservationRead)
def update_reservation(
    reservation_id: int,
    reservation_data: ReservationUpdate,
    db: Annotated[Session, Depends(get_db)],
) -> Reservation:
    reservation = reservation_crud.get_reservation(
        db,
        reservation_id,
    )

    if reservation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reservation not found",
        )

    customer = customer_crud.get_customer(
        db,
        reservation_data.customer_id,
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    existing_reservation = reservation_crud.get_active_reservation_by_date(
        db,
        reservation_data.event_date,
        excluded_reservation_id=reservation.id,
    )

    if existing_reservation is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An active reservation already exists for this date",
        )

    return reservation_crud.update_reservation(
        db,
        reservation,
        reservation_data,
    )
