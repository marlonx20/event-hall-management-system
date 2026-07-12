from datetime import time
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Numeric, String, Text, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.reservation import Reservation
    from app.models.task import Task


class Venue(Base):
    __tablename__ = "venues"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    # General information
    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    address: Mapped[str | None] = mapped_column(
        String(300),
        nullable=True,
    )

    phone: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    capacity: Mapped[int] = mapped_column(
        nullable=False,
        default=80,
    )

    opening_time: Mapped[time | None] = mapped_column(
        Time,
        nullable=True,
    )

    closing_time: Mapped[time | None] = mapped_column(
        Time,
        nullable=True,
    )

    # Social media and contact
    facebook_url: Mapped[str | None] = mapped_column(
        String(300),
        nullable=True,
    )

    whatsapp_number: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    instagram_url: Mapped[str | None] = mapped_column(
        String(300),
        nullable=True,
    )

    website_url: Mapped[str | None] = mapped_column(
        String(300),
        nullable=True,
    )

    # Prices
    base_price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
        default=Decimal("2600.00"),
    )

    bouncy_castle_cost: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
        default=Decimal("200.00"),
    )

    extra_hour_price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
        default=Decimal("0.00"),
    )

    # Banking information
    bank_name: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    bank_account_holder: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    bank_account_number: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    bank_clabe: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    # Frequently used messages
    facebook_response_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    banking_information_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    location_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    venue_rules_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    payment_reminder_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    thank_you_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    general_notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    reservations: Mapped[list["Reservation"]] = relationship(
        back_populates="venue",
    )

    tasks: Mapped[list["Task"]] = relationship(
        back_populates="venue",
        cascade="all, delete-orphan",
    )
