from pydantic import BaseModel, Field


class CustomerBase(BaseModel):
    full_name: str

    phone_number: str | None = Field(
        default=None,
        max_length=20,
    )

    preferred_contact_method: str

    messenger_user_name: str | None = Field(
        default=None,
        max_length=255,
    )

    notes: str | None = None


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(CustomerBase):
    pass


class CustomerRead(CustomerBase):
    id: int

    model_config = {"from_attributes": True}
