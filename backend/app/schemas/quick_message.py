from datetime import datetime

from pydantic import BaseModel, Field


class QuickMessageCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=150,
    )
    content: str = Field(min_length=1)
    display_order: int = Field(default=0, ge=0)


class QuickMessageUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=150,
    )
    content: str | None = Field(
        default=None,
        min_length=1,
    )
    display_order: int | None = Field(
        default=None,
        ge=0,
    )


class QuickMessageRead(BaseModel):
    id: int
    venue_id: int
    title: str
    content: str
    display_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
