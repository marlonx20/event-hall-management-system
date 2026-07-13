from sqlalchemy.orm import Session

from app.core.constants import DEFAULT_VENUE_ID
from app.crud import task as task_crud
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate


def create_task(
    db: Session,
    task_data: TaskCreate,
) -> Task:
    create_data: dict[str, object] = task_data.model_dump()
    create_data["venue_id"] = DEFAULT_VENUE_ID

    try:
        task = task_crud.create_task(
            db,
            create_data,
        )

        db.commit()
        db.refresh(task)

        return task
    except Exception:
        db.rollback()
        raise


def update_task(
    db: Session,
    task: Task,
    task_data: TaskUpdate,
) -> Task:
    update_data: dict[str, object] = task_data.model_dump(
        exclude_unset=True,
    )

    try:
        updated_task = task_crud.update_task(
            task,
            update_data,
        )

        db.commit()
        db.refresh(updated_task)

        return updated_task
    except Exception:
        db.rollback()
        raise


def delete_task(
    db: Session,
    task: Task,
) -> None:
    try:
        task_crud.delete_task(
            db,
            task,
        )
        db.commit()
    except Exception:
        db.rollback()
        raise
