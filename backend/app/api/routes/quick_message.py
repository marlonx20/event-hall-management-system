from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.constants import DEFAULT_VENUE_ID
from app.crud import quick_message as quick_message_crud
from app.dependencies.database import get_db
from app.models.quick_message import QuickMessage
from app.schemas.quick_message import (
    QuickMessageCreate,
    QuickMessageRead,
    QuickMessageUpdate,
)
from app.services import quick_message_service

router = APIRouter(
    prefix="/quick-messages",
    tags=["Quick Messages"],
)


@router.post(
    "",
    response_model=QuickMessageRead,
    status_code=status.HTTP_201_CREATED,
)
def create_quick_message(
    message_data: QuickMessageCreate,
    db: Annotated[Session, Depends(get_db)],
) -> QuickMessage:
    return quick_message_service.create_quick_message(
        db,
        message_data,
    )


@router.get(
    "",
    response_model=list[QuickMessageRead],
)
def get_quick_messages(
    db: Annotated[Session, Depends(get_db)],
) -> list[QuickMessage]:
    return quick_message_crud.get_quick_messages(
        db,
        DEFAULT_VENUE_ID,
    )


@router.get(
    "/{message_id}",
    response_model=QuickMessageRead,
)
def get_quick_message(
    message_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> QuickMessage:
    quick_message = quick_message_crud.get_quick_message(
        db,
        message_id,
    )

    if quick_message is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quick message not found",
        )

    return quick_message


@router.put(
    "/{message_id}",
    response_model=QuickMessageRead,
)
def update_quick_message(
    message_id: int,
    message_data: QuickMessageUpdate,
    db: Annotated[Session, Depends(get_db)],
) -> QuickMessage:
    quick_message = quick_message_crud.get_quick_message(
        db,
        message_id,
    )

    if quick_message is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quick message not found",
        )

    return quick_message_service.update_quick_message(
        db,
        quick_message,
        message_data,
    )


@router.delete(
    "/{message_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_quick_message(
    message_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> Response:
    quick_message = quick_message_crud.get_quick_message(
        db,
        message_id,
    )

    if quick_message is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quick message not found",
        )

    quick_message_service.delete_quick_message(
        db,
        quick_message,
    )

    return Response(status_code=status.HTTP_204_NO_CONTENT)
