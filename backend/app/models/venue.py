from typing import TYPE_CHECKING

from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.reservation import Reservation
    from app.models.task import Task


class Venue(Base):
    __tablename__ = "venues"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    address: Mapped[str | None] = mapped_column(String(255), nullable=True)
    capacity: Mapped[int | None] = mapped_column(Integer, nullable=True)
    base_price: Mapped[int | None] = mapped_column(Integer, nullable=True)

    phone_numbers: Mapped[str | None] = mapped_column(String(255), nullable=True)
    facebook_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    bank_account_info: Mapped[str | None] = mapped_column(Text, nullable=True)
    quick_message: Mapped[str | None] = mapped_column(Text, nullable=True)

    reservations: Mapped[list["Reservation"]] = relationship(
        back_populates="venue",
    )

    tasks: Mapped[list["Task"]] = relationship(
        back_populates="venue",
        cascade="all, delete-orphan",
    )
