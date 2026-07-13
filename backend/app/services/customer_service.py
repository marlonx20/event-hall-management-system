from sqlalchemy.orm import Session

from app.crud import customer as customer_crud
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate


def create_customer(
    db: Session,
    customer_data: CustomerCreate,
) -> Customer:
    try:
        customer = customer_crud.create_customer(
            db,
            customer_data,
        )

        db.commit()
        db.refresh(customer)

        return customer

    except Exception:
        db.rollback()
        raise


def update_customer(
    db: Session,
    customer: Customer,
    customer_data: CustomerUpdate,
) -> Customer:
    try:
        updated_customer = customer_crud.update_customer(
            customer,
            customer_data,
        )

        db.commit()
        db.refresh(updated_customer)

        return updated_customer

    except Exception:
        db.rollback()
        raise
