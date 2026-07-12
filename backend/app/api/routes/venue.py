from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.constants import DEFAULT_VENUE_ID
from app.crud import venue as venue_crud
from app.dependencies.database import get_db
from app.models.venue import Venue
from app.schemas.venue import VenueRead, VenueUpdate

router = APIRouter(
    prefix="/venue",
    tags=["Venue"],
)


@router.get("", response_model=VenueRead)
def get_venue(
    db: Annotated[Session, Depends(get_db)],
) -> Venue:
    venue = venue_crud.get_venue(
        db,
        DEFAULT_VENUE_ID,
    )

    if venue is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venue not found",
        )

    return venue


@router.put("", response_model=VenueRead)
def update_venue(
    venue_data: VenueUpdate,
    db: Annotated[Session, Depends(get_db)],
) -> Venue:
    venue = venue_crud.get_venue(
        db,
        DEFAULT_VENUE_ID,
    )

    if venue is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venue not found",
        )

    return venue_crud.update_venue(
        db,
        venue,
        venue_data,
    )
