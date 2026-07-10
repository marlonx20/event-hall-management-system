from datetime import date, time
from decimal import Decimal
from enum import StrEnum
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Date, Enum, ForeignKey, Numeric, String, Text, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.customer import Customer
    from app.models.payment import Payment
    from app.models.venue import Venue


class ReservationStatus(StrEnum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    FINISHED = "finished"
    CANCELLED = "cancelled"


class Reservation(Base):
    __tablename__ = "reservations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    venue_id: Mapped[int] = mapped_column(
        ForeignKey("venues.id"),
        nullable=False,
    )
    customer_id: Mapped[int] = mapped_column(
        ForeignKey("customers.id"),
        nullable=False,
    )

    event_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time | None] = mapped_column(Time, nullable=True)

    event_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    guest_count: Mapped[int | None] = mapped_column(nullable=True)
    has_bouncy_castle: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    total_price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )
    status: Mapped[ReservationStatus] = mapped_column(
        Enum(
            ReservationStatus,
            name="reservation_status",
            native_enum=False,
        ),
        nullable=False,
        default=ReservationStatus.PENDING,
    )

    special_requirements: Mapped[str | None] = mapped_column(Text, nullable=True)
    internal_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    final_comments: Mapped[str | None] = mapped_column(Text, nullable=True)
    extra_hours: Mapped[Decimal | None] = mapped_column(
        Numeric(5, 2),
        nullable=True,
    )
    extra_charge: Mapped[Decimal | None] = mapped_column(
        Numeric(10, 2),
        nullable=True,
    )
    damage_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    damage_charge: Mapped[Decimal | None] = mapped_column(
        Numeric(10, 2),
        nullable=True,
    )

    customer: Mapped["Customer"] = relationship(
        back_populates="reservations",
    )
    venue: Mapped["Venue"] = relationship(
        back_populates="reservations",
    )

    payments: Mapped[list["Payment"]] = relationship(
        back_populates="reservation",
        cascade="all, delete-orphan",
    )
