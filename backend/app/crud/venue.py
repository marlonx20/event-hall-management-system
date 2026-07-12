from sqlalchemy.orm import Session

from app.models.venue import Venue
from app.schemas.venue import VenueUpdate


def get_venue(
    db: Session,
    venue_id: int,
) -> Venue | None:
    return db.get(Venue, venue_id)


def update_venue(
    db: Session,
    venue: Venue,
    venue_data: VenueUpdate,
) -> Venue:
    for field, value in venue_data.model_dump().items():
        setattr(venue, field, value)

    db.commit()
    db.refresh(venue)

    return venue
