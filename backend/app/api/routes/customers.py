from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.crud import customer as customer_crud
from app.crud import reservation as reservation_crud
from app.dependencies.database import get_db
from app.models.customer import Customer
from app.schemas.customer import (
    CustomerCreate,
    CustomerRead,
    CustomerUpdate,
)
from app.schemas.reservation import ReservationRead
from app.services import (
    customer_service,
    reservation_service,
)

router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
)


@router.post(
    "",
    response_model=CustomerRead,
    status_code=status.HTTP_201_CREATED,
)
def create_customer(
    customer_data: CustomerCreate,
    db: Annotated[Session, Depends(get_db)],
) -> Customer:
    return customer_service.create_customer(
        db,
        customer_data,
    )


@router.get(
    "",
    response_model=list[CustomerRead],
)
def get_customers(
    db: Annotated[Session, Depends(get_db)],
) -> list[Customer]:
    return customer_crud.get_customers(db)


@router.get(
    "/search",
    response_model=list[CustomerRead],
)
def search_customers(
    q: Annotated[
        str,
        Query(
            min_length=1,
            max_length=100,
        ),
    ],
    db: Annotated[Session, Depends(get_db)],
) -> list[Customer]:
    return customer_crud.search_customers(
        db,
        q,
    )


@router.get(
    "/{customer_id}/reservations",
    response_model=list[ReservationRead],
)
def get_customer_reservations(
    customer_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> list[ReservationRead]:
    customer = customer_crud.get_customer(
        db,
        customer_id,
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    reservations = reservation_crud.get_reservations_by_customer(
        db,
        customer_id,
    )

    return reservation_service.build_reservation_list_response(
        db,
        reservations,
    )


@router.get(
    "/{customer_id}",
    response_model=CustomerRead,
)
def get_customer(
    customer_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> Customer:
    customer = customer_crud.get_customer(
        db,
        customer_id,
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    return customer


@router.put(
    "/{customer_id}",
    response_model=CustomerRead,
)
def update_customer(
    customer_id: int,
    customer_data: CustomerUpdate,
    db: Annotated[Session, Depends(get_db)],
) -> Customer:
    customer = customer_crud.get_customer(
        db,
        customer_id,
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    return customer_service.update_customer(
        db,
        customer,
        customer_data,
    )
