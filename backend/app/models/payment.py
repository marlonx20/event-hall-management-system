from datetime import date
from decimal import Decimal
from enum import StrEnum
from typing import TYPE_CHECKING

from sqlalchemy import Date, ForeignKey, Numeric, String
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.model.reservation import Reservation


class PaymentMethod(StrEnum):
    CASH = "cash"
    TRANSFER = "transfer"


class PaymentConcept(StrEnum):
    DEPOSIT = "deposit"
    SETTLEMENT = "settlement"
    EXTRA_HOURS = "extra_hours"
    DAMAGES = "damages"
    OTHER = "other"


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    reservation_id: Mapped[int] = mapped_column(
        ForeignKey("reservations.id"),
        nullable=False,
        index=True,
    )

    amount: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    payment_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        default=date.today,
    )

    method: Mapped[PaymentMethod] = mapped_column(
        SqlEnum(
            PaymentMethod,
            name="payment_method",
            native_enum=False,
        ),
        nullable=False,
    )

    concept: Mapped[PaymentConcept] = mapped_column(
        SqlEnum(
            PaymentConcept,
            name="payment_concept",
            native_enum=False,
        ),
        nullable=False,
    )

    reference: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )


reservation: Mapped["Reservation"] = relationship(
    back_populates="payments",
)
