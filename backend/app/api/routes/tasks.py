from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.crud import task as task_crud
from app.dependencies.database import get_db
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate
from app.services import task_service

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"],
)


@router.post(
    "",
    response_model=TaskRead,
    status_code=status.HTTP_201_CREATED,
)
def create_task(
    task_data: TaskCreate,
    db: Annotated[Session, Depends(get_db)],
) -> Task:
    return task_service.create_task(
        db,
        task_data,
    )


@router.get("", response_model=list[TaskRead])
def get_tasks(
    db: Annotated[Session, Depends(get_db)],
    due_date: date | None = None,
) -> list[Task]:
    return task_crud.get_tasks(
        db,
        due_date,
    )


@router.get("/{task_id}", response_model=TaskRead)
def get_task(
    task_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> Task:
    task = task_crud.get_task(
        db,
        task_id,
    )

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return task


@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Annotated[Session, Depends(get_db)],
) -> Task:
    task = task_crud.get_task(
        db,
        task_id,
    )

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return task_service.update_task(
        db,
        task,
        task_data,
    )


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_task(
    task_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> Response:
    task = task_crud.get_task(
        db,
        task_id,
    )

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    task_service.delete_task(
        db,
        task,
    )

    return Response(status_code=status.HTTP_204_NO_CONTENT)
