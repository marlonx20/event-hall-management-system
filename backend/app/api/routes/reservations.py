from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud import customer as customer_crud
from app.crud import reservation as reservation_crud
from app.crud import venue as venue_crud
from app.dependencies.database import get_db
from app.schemas.reservation import (
    ReservationCreate,
    ReservationFinish,
    ReservationRead,
    ReservationUpdate,
)
from app.services import reservation_service

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
) -> ReservationRead:
    customer = customer_crud.get_customer(
        db,
        reservation_data.customer_id,
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    venue = venue_crud.get_venue(
        db,
        1,
    )

    if venue is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Venue configuration not found",
        )

    existing_reservation = reservation_crud.get_confirmed_reservation_by_date(
        db,
        reservation_data.event_date,
    )

    if existing_reservation is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A confirmed reservation already exists for this date",
        )

    reservation_dict = reservation_service.prepare_reservation_create(
        db,
        reservation_data,
    )

    reservation = reservation_crud.create_reservation(
        db,
        reservation_dict,
    )

    return reservation_service.build_reservation_response(
        db,
        reservation,
    )


@router.get("", response_model=list[ReservationRead])
def get_reservations(
    db: Annotated[Session, Depends(get_db)],
) -> list[ReservationRead]:
    reservations = reservation_crud.get_reservations(db)

    return reservation_service.build_reservation_list_response(
        db,
        reservations,
    )


@router.get("/{reservation_id}", response_model=ReservationRead)
def get_reservation(
    reservation_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> ReservationRead:
    reservation = reservation_crud.get_reservation(
        db,
        reservation_id,
    )

    if reservation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reservation not found",
        )

    return reservation_service.build_reservation_response(
        db,
        reservation,
    )


@router.put("/{reservation_id}", response_model=ReservationRead)
def update_reservation(
    reservation_id: int,
    reservation_data: ReservationUpdate,
    db: Annotated[Session, Depends(get_db)],
) -> ReservationRead:
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

    existing_reservation = reservation_crud.get_confirmed_reservation_by_date(
        db,
        reservation_data.event_date,
        excluded_reservation_id=reservation.id,
    )

    if existing_reservation is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A confirmed reservation already exists for this date",
        )

    updated_reservation = reservation_crud.update_reservation(
        db,
        reservation,
        reservation_data,
    )

    return reservation_service.build_reservation_response(
        db,
        updated_reservation,
    )


@router.put(
    "/{reservation_id}/cancel",
    response_model=ReservationRead,
)
def cancel_reservation(
    reservation_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> ReservationRead:
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
        cancelled_reservation = reservation_service.cancel_reservation(
            db,
            reservation,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error

    return reservation_service.build_reservation_response(
        db,
        cancelled_reservation,
    )


@router.put(
    "/{reservation_id}/finish",
    response_model=ReservationRead,
)
def finish_reservation(
    reservation_id: int,
    finish_data: ReservationFinish,
    db: Annotated[Session, Depends(get_db)],
) -> ReservationRead:
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
        finished_reservation = reservation_service.finish_reservation(
            db,
            reservation,
            finish_data,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error

    return reservation_service.build_reservation_response(
        db,
        finished_reservation,
    )
