from datetime import time
from decimal import Decimal

from pydantic import BaseModel, Field


class VenueBase(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    address: str | None = Field(default=None, max_length=300)
    phone: str | None = Field(default=None, max_length=30)
    capacity: int = Field(ge=1)

    opening_time: time | None = None
    closing_time: time | None = None

    facebook_url: str | None = Field(default=None, max_length=300)
    whatsapp_number: str | None = Field(default=None, max_length=30)
    instagram_url: str | None = Field(default=None, max_length=300)
    website_url: str | None = Field(default=None, max_length=300)

    base_price: Decimal = Field(ge=0, max_digits=10, decimal_places=2)
    bouncy_castle_cost: Decimal = Field(
        ge=0,
        max_digits=10,
        decimal_places=2,
    )
    extra_hour_price: Decimal = Field(
        ge=0,
        max_digits=10,
        decimal_places=2,
    )

    bank_name: str | None = Field(default=None, max_length=100)
    bank_account_holder: str | None = Field(default=None, max_length=150)
    bank_account_number: str | None = Field(default=None, max_length=50)
    bank_clabe: str | None = Field(default=None, max_length=30)

    facebook_response_message: str | None = None
    banking_information_message: str | None = None
    location_message: str | None = None
    venue_rules_message: str | None = None
    payment_reminder_message: str | None = None
    thank_you_message: str | None = None
    general_notes: str | None = None


class VenueUpdate(VenueBase):
    pass


class VenueRead(VenueBase):
    id: int

    model_config = {"from_attributes": True}
