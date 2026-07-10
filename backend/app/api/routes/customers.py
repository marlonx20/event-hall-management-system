from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud import customer as customer_crud
from app.dependencies.database import get_db
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerRead, CustomerUpdate

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.post(
    "",
    response_model=CustomerRead,
    status_code=status.HTTP_201_CREATED,
)
def create_customer(
    customer_data: CustomerCreate,
    db: Annotated[Session, Depends(get_db)],
) -> Customer:
    return customer_crud.create_customer(db, customer_data)


@router.get("", response_model=list[CustomerRead])
def get_customers(
    db: Annotated[Session, Depends(get_db)],
) -> list[Customer]:
    return customer_crud.get_customers(db)


@router.get("/{customer_id}", response_model=CustomerRead)
def get_customer(
    customer_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> Customer:
    customer = customer_crud.get_customer(db, customer_id)

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    return customer


@router.put("/{customer_id}", response_model=CustomerRead)
def update_customer(
    customer_id: int,
    customer_data: CustomerUpdate,
    db: Annotated[Session, Depends(get_db)],
) -> Customer:
    customer = customer_crud.get_customer(db, customer_id)

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    return customer_crud.update_customer(
        db,
        customer,
        customer_data,
    )
