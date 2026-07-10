import app.models.customer as _customer
import app.models.payment as _payment
import app.models.reservation as _reservation
import app.models.venue as _venue
from app.db.base import Base
from app.db.session import engine

__all__ = ["_customer", "_payment", "_reservation", "_venue"]


def create_db() -> None:
    Base.metadata.create_all(bind=engine)
