from sqlalchemy.orm import Session

from app.crud import venue as venue_crud
from app.models.venue import Venue
from app.schemas.venue import VenueUpdate


def update_venue(
    db: Session,
    venue: Venue,
    venue_data: VenueUpdate,
) -> Venue:
    try:
        updated_venue = venue_crud.update_venue(
            venue,
            venue_data,
        )

        db.commit()
        db.refresh(updated_venue)

        return updated_venue

    except Exception:
        db.rollback()
        raise
