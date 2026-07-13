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
    status: ReservationStatus = ReservationStatus.PENDING
    special_requirements: str | None = None
    internal_notes: str | None = None


class ReservationCreate(ReservationBase):
    pass


class ReservationUpdate(BaseModel):
    customer_id: int | None = None
    event_date: date | None = None
    start_time: time | None = None
    end_time: time | None = None
    event_type: str | None = None
    guest_count: int | None = Field(default=None, ge=1)
    has_bouncy_castle: bool | None = None
    special_requirements: str | None = None
    internal_notes: str | None = None

    extra_hours: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=5,
        decimal_places=2,
    )

    damage_description: str | None = None

    damage_charge: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=10,
        decimal_places=2,
    )


class ReservationFinish(BaseModel):
    final_comments: str | None = None


class ReservationRead(ReservationBase):
    id: int
    venue_id: int
    total_price: Decimal

    final_comments: str | None = None
    extra_hours: Decimal | None = None
    extra_charge: Decimal | None = None
    damage_description: str | None = None
    damage_charge: Decimal | None = None

    cancelled_at: datetime | None = None
    cancellation_reason: CancellationReason | None = None

    amount_paid: Decimal = Decimal("0.00")
    remaining_balance: Decimal = Decimal("0.00")

    model_config = {"from_attributes": True}
