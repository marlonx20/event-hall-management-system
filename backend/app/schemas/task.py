from datetime import date

from pydantic import BaseModel, Field

from app.models.task import TaskStatus


class TaskBase(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    description: str | None = None
    due_date: date | None = None
    status: TaskStatus = TaskStatus.PENDING
    assigned_to: str | None = Field(default=None, max_length=100)
    notes: str | None = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(TaskBase):
    pass


class TaskRead(TaskBase):
    id: int
    venue_id: int

    model_config = {"from_attributes": True}
