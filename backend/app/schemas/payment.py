from datetime import date
from decimal import Decimal

from pydantic import BaseModel, Field

from app.models.payment import PaymentConcept, PaymentMethod


class PaymentCreate(BaseModel):
    amount: Decimal = Field(gt=0, decimal_places=2)
    payment_date: date = Field(default_factory=date.today)
    method: PaymentMethod
    concept: PaymentConcept
    reference: str | None = None


class PaymentRead(PaymentCreate):
    id: int
    reservation_id: int

    model_config = {"from_attributes": True}
