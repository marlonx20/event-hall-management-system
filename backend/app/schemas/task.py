from datetime import date

from pydantic import BaseModel, Field

from app.models.task import TaskStatus


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    description: str | None = None
    due_date: date | None = None
    assigned_to: str | None = Field(default=None, max_length=100)
    notes: str | None = None


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=150)
    description: str | None = None
    due_date: date | None = None
    status: TaskStatus | None = None
    assigned_to: str | None = Field(default=None, max_length=100)
    notes: str | None = None


class TaskRead(BaseModel):
    id: int
    venue_id: int
    title: str
    description: str | None
    due_date: date | None
    status: TaskStatus
    assigned_to: str | None
    notes: str | None

    model_config = {"from_attributes": True}
