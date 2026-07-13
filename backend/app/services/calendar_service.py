from sqlalchemy.orm import Session

from app.crud import reservation as reservation_crud
from app.crud import task as task_crud
from app.models.reservation import Reservation
from app.models.task import Task
from app.schemas.calendar import CalendarDay, CalendarMonth
from app.services import reservation_service


def build_calendar_month(
    year: int,
    month: int,
    reservations: list[Reservation],
    tasks: list[Task],
    db: Session,
) -> CalendarMonth:
    calendar: dict = {}

    for reservation in reservations:
        reservation_date = reservation.event_date

        if reservation_date not in calendar:
            calendar[reservation_date] = CalendarDay(
                date=reservation_date,
                reservations=[],
                tasks=[],
            )

        calendar[reservation_date].reservations.append(
            reservation_service.build_reservation_response(
                db,
                reservation,
            )
        )

    for task in tasks:
        if task.due_date is None:
            continue

        if task.due_date not in calendar:
            calendar[task.due_date] = CalendarDay(
                date=task.due_date,
                reservations=[],
                tasks=[],
            )

        calendar[task.due_date].tasks.append(task)

    return CalendarMonth(
        year=year,
        month=month,
        days=sorted(
            calendar.values(),
            key=lambda day: day.date,
        ),
    )


def get_calendar_month(
    db: Session,
    year: int,
    month: int,
) -> CalendarMonth:
    reservations = reservation_crud.get_reservations_by_month(
        db,
        year,
        month,
    )

    tasks = task_crud.get_tasks_by_month(
        db,
        year,
        month,
    )

    return build_calendar_month(
        year,
        month,
        reservations,
        tasks,
        db,
    )
