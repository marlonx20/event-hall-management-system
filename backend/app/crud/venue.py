from sqlalchemy.orm import Session

from app.models.venue import Venue
from app.schemas.venue import VenueUpdate


def get_venue(
    db: Session,
    venue_id: int,
) -> Venue | None:
    return db.get(Venue, venue_id)


def update_venue(
    venue: Venue,
    venue_data: VenueUpdate,
) -> Venue:
    update_data = venue_data.model_dump()

    for field, value in update_data.items():
        setattr(venue, field, value)

    return venue
