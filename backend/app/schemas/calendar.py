from datetime import date

from pydantic import BaseModel

from app.schemas.reservation import ReservationRead
from app.schemas.task import TaskRead


class CalendarDay(BaseModel):
    date: date
    reservations: list[ReservationRead]
    tasks: list[TaskRead]


class CalendarMonth(BaseModel):
    year: int
    month: int
    days: list[CalendarDay]
