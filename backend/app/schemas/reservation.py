from datetime import date, datetime, time
from decimal import Decimal

from pydantic import BaseModel, Field

from app.models.reservation import CancellationReason, ReservationStatus


class ReservationBase(BaseModel):
    customer_id: int
    event_date: date
    start_time: time
    end_time: time | None = None
    event_type: str | None = None
    guest_count: int | None = Field(default=None, ge=1)
    has_bouncy_castle: bool = False
    total_price: Decimal = Field(gt=0, decimal_places=2)
    status: ReservationStatus = ReservationStatus.PENDING
    special_requirements: str | None = None
    internal_notes: str | None = None


class ReservationCreate(ReservationBase):
    pass


class ReservationRead(ReservationBase):
    id: int
    venue_id: int
    final_comments: str | None = None
    extra_hours: Decimal | None = None
    extra_charge: Decimal | None = None
    damage_description: str | None = None
    damage_charge: Decimal | None = None

    model_config = {"from_attributes": True}

    cancelled_at: datetime | None = None
    cancellation_reason: CancellationReason | None = None

    amount_paid: Decimal = Decimal("0.00")
    remaining_balance: Decimal = Decimal("0.00")


class ReservationUpdate(ReservationBase):
    pass
