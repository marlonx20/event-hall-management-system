from datetime import date, time
from decimal import Decimal

from pydantic import BaseModel

from app.models.reservation import ReservationStatus
from app.models.task import TaskStatus


class DashboardReservation(BaseModel):
    id: int
    customer_name: str
    event_date: date
    start_time: time
    event_type: str | None
    status: ReservationStatus
    remaining_balance: Decimal


class DashboardTask(BaseModel):
    id: int
    title: str
    due_date: date
    assigned_to: str | None
    status: TaskStatus


class DashboardRead(BaseModel):
    today_events: list[DashboardReservation]
    today_tasks: list[DashboardTask]

    upcoming_events: list[DashboardReservation]
    upcoming_tasks: list[DashboardTask]

    pending_reservations: list[DashboardReservation]
    today_pending_payments: list[DashboardReservation]

    monthly_income: Decimal
