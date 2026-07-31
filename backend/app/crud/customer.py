from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate


def create_customer(
    db: Session,
    customer_data: CustomerCreate,
) -> Customer:
    customer = Customer(**customer_data.model_dump())

    db.add(customer)
    db.flush()

    return customer


def get_customers(db: Session) -> list[Customer]:
    statement = select(Customer).order_by(Customer.full_name)
    return list(db.scalars(statement).all())


def search_customers(
    db: Session,
    query: str,
) -> list[Customer]:
    normalized_query = query.strip()

    if not normalized_query:
        return []

    search_pattern = f"%{normalized_query}%"

    statement = (
        select(Customer)
        .where(
            or_(
                Customer.full_name.ilike(search_pattern),
                Customer.phone_number.ilike(search_pattern),
                Customer.messenger_user_name.ilike(search_pattern),
            )
        )
        .order_by(
            Customer.full_name,
            Customer.id,
        )
        .limit(10)
    )

    return list(db.scalars(statement).all())


def get_customer(
    db: Session,
    customer_id: int,
) -> Customer | None:
    return db.get(Customer, customer_id)


def update_customer(
    customer: Customer,
    customer_data: CustomerUpdate,
) -> Customer:
    update_data = customer_data.model_dump()

    for field, value in update_data.items():
        setattr(customer, field, value)

    return customer
