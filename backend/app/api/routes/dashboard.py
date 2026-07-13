from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.schemas.dashboard import DashboardRead
from app.services import dashboard_service

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("", response_model=DashboardRead)
def get_dashboard(
    db: Annotated[Session, Depends(get_db)],
) -> DashboardRead:
    return dashboard_service.get_dashboard(
        db,
        date.today(),
    )
