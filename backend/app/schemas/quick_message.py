from datetime import datetime

from pydantic import BaseModel, Field


class QuickMessageCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=150,
    )

    content: str = Field(
        min_length=1,
    )

    is_favorite: bool = False


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

    is_favorite: bool | None = None


class QuickMessageRead(BaseModel):
    id: int
    venue_id: int
    title: str
    content: str
    is_favorite: bool
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True,
    }
