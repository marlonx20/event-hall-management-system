from pydantic import BaseModel


class CustomerBase(BaseModel):
    full_name: str
    phone_number: str | None = None
    preferred_contact_method: str
    messenger_user_name: str | None = None
    notes: str | None = None


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(CustomerBase):
    pass


class CustomerRead(CustomerBase):
    id: int

    model_config = {"from_attributes": True}
