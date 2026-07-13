from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.schemas.calendar import CalendarMonth
from app.services import calendar_service

router = APIRouter(
    prefix="/calendar",
    tags=["Calendar"],
)


@router.get(
    "",
    response_model=CalendarMonth,
)
def get_calendar(
    year: int,
    month: int,
    db: Annotated[Session, Depends(get_db)],
) -> CalendarMonth:
    return calendar_service.get_calendar_month(
        db,
        year,
        month,
    )
