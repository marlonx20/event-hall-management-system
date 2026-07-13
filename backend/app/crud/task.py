from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.task import Task
from app.utils.date_utils import get_next_month_start


def create_task(
    db: Session,
    task_data: dict[str, object],
) -> Task:
    task = Task(**task_data)

    db.add(task)
    db.flush()

    return task


def get_task(
    db: Session,
    task_id: int,
) -> Task | None:
    return db.get(Task, task_id)


def get_tasks(
    db: Session,
    due_date: date | None = None,
) -> list[Task]:
    statement = select(Task)

    if due_date is not None:
        statement = statement.where(Task.due_date == due_date)

    statement = statement.order_by(
        Task.due_date,
        Task.id,
    )

    return list(db.scalars(statement).all())


def update_task(
    task: Task,
    update_data: dict[str, object],
) -> Task:
    for field, value in update_data.items():
        setattr(task, field, value)

    return task


def delete_task(
    db: Session,
    task: Task,
) -> None:
    db.delete(task)


def get_tasks_by_month(
    db: Session,
    year: int,
    month: int,
) -> list[Task]:
    month_start = date(year, month, 1)
    next_month_start = get_next_month_start(year, month)

    statement = (
        select(Task)
        .where(
            Task.due_date >= month_start,
            Task.due_date < next_month_start,
        )
        .order_by(
            Task.due_date,
            Task.id,
        )
    )

    return list(db.scalars(statement).all())
