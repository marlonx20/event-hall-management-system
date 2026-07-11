from sqlalchemy import select

import app.models.customer as _customer
import app.models.payment as _payment
import app.models.reservation as _reservation
import app.models.task as _task
import app.models.venue as _venue
from app.core.constants import DEFAULT_VENUE_ID
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.venue import Venue

__all__ = [
    "_customer",
    "_payment",
    "_reservation",
    "_task",
    "_venue",
]


def create_default_venue() -> None:
    with SessionLocal() as db:
        venue = db.scalar(select(Venue).where(Venue.id == DEFAULT_VENUE_ID))

        if venue is not None:
            return

        venue = Venue(
            id=DEFAULT_VENUE_ID,
            name="Salón Loryan",
            capacity=80,
            base_price=2600,
        )

        db.add(venue)
        db.commit()


def create_db() -> None:
    Base.metadata.create_all(bind=engine)
    create_default_venue()
