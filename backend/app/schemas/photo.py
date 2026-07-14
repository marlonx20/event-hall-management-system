from datetime import datetime

from pydantic import BaseModel


class PhotoRead(BaseModel):
    id: int
    original_name: str
    content_type: str
    is_favorite: bool
    created_at: datetime
    url: str


class PhotoFavoriteUpdate(BaseModel):
    is_favorite: bool
