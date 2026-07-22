from decimal import Decimal

from sqlalchemy.orm import Session

from app.core.constants import DEFAULT_VENUE_ID
from app.crud import reservation as reservation_crud
from app.crud import venue as venue_crud
from app.models.reservation import Reservation, ReservationStatus
from app.schemas.reservation import (
    ReservationCreate,
    ReservationFinish,
    ReservationRead,
    ReservationUpdate,
)
from app.services.billing_service import calculate_remaining_balance


def calculate_total_price(
    db: Session,
    has_bouncy_castle: bool,
    venue_id: int,
) -> Decimal:
    venue = venue_crud.get_venue(
        db,
        venue_id,
    )

    if venue is None:
        raise ValueError("Venue configuration not found")

    total_price = venue.base_price

    if not has_bouncy_castle:
        total_price -= venue.bouncy_castle_cost

    return total_price


def prepare_reservation_create(
    db: Session,
    reservation_data: ReservationCreate,
) -> dict[str, object]:
    total_price = calculate_total_price(
        db=db,
        has_bouncy_castle=reservation_data.has_bouncy_castle,
        venue_id=DEFAULT_VENUE_ID,
    )

    reservation_dict: dict[str, object] = reservation_data.model_dump()

    reservation_dict["venue_id"] = DEFAULT_VENUE_ID
    reservation_dict["total_price"] = total_price

    return reservation_dict


def build_reservation_response(
    db: Session,
    reservation: Reservation,
) -> ReservationRead:
    remaining_balance = calculate_remaining_balance(
        db,
        reservation,
    )

    total_charges = (
        reservation.total_price
        + (reservation.extra_charge or Decimal("0"))
        + (reservation.damage_charge or Decimal("0"))
    )

    amount_paid = total_charges - remaining_balance

    reservation_response = ReservationRead.model_validate(
        reservation,
    )

    return reservation_response.model_copy(
        update={
            "amount_paid": amount_paid,
            "remaining_balance": remaining_balance,
        },
    )


def build_reservation_list_response(
    db: Session,
    reservations: list[Reservation],
) -> list[ReservationRead]:
    return [
        build_reservation_response(
            db,
            reservation,
        )
        for reservation in reservations
    ]


def update_reservation(
    db: Session,
    reservation: Reservation,
    reservation_data: ReservationUpdate,
) -> Reservation:
    if reservation.status == ReservationStatus.CANCELLED:
        raise ValueError(
            "A cancelled reservation cannot be updated",
        )

    if reservation.status == ReservationStatus.FINISHED:
        raise ValueError(
            "A finished reservation cannot be updated",
        )

    update_data: dict[str, object] = reservation_data.model_dump(
        exclude_unset=True,
    )

    has_bouncy_castle = update_data.get(
        "has_bouncy_castle",
    )

    if has_bouncy_castle is not None:
        update_data["total_price"] = calculate_total_price(
            db=db,
            has_bouncy_castle=bool(
                has_bouncy_castle,
            ),
            venue_id=reservation.venue_id,
        )

    if "extra_hours" in update_data:
        venue = venue_crud.get_venue(
            db,
            reservation.venue_id,
        )

        if venue is None:
            raise ValueError(
                "Venue configuration not found",
            )

        extra_hours = update_data["extra_hours"]

        if extra_hours is None:
            update_data["extra_hours"] = Decimal("0.00")

            update_data["extra_charge"] = Decimal("0.00")
        else:
            update_data["extra_charge"] = Decimal(str(extra_hours)) * venue.extra_hour_price

    proposed_extra_charge = Decimal(
        str(
            update_data.get(
                "extra_charge",
                reservation.extra_charge or Decimal("0"),
            )
        )
    )

    proposed_damage_charge = Decimal(
        str(
            update_data.get(
                "damage_charge",
                reservation.damage_charge or Decimal("0"),
            )
        )
    )

    current_remaining_balance = calculate_remaining_balance(
        db,
        reservation,
    )

    total_paid = (
        reservation.total_price
        + (reservation.extra_charge or Decimal("0"))
        + (reservation.damage_charge or Decimal("0"))
        - current_remaining_balance
    )

    proposed_total_price = Decimal(
        str(
            update_data.get(
                "total_price",
                reservation.total_price,
            )
        )
    )

    proposed_total = proposed_total_price + proposed_extra_charge + proposed_damage_charge

    if proposed_total < total_paid:
        raise ValueError(
            "Additional charges cannot be reduced below the amount already paid",
        )

    try:
        return reservation_crud.update_reservation(
            db,
            reservation,
            update_data,
        )
    except Exception:
        db.rollback()
        raise


def cancel_reservation(
    db: Session,
    reservation: Reservation,
) -> Reservation:
    if reservation.status == ReservationStatus.CANCELLED:
        raise ValueError(
            "Reservation is already cancelled",
        )

    if reservation.status == ReservationStatus.FINISHED:
        raise ValueError(
            "A finished reservation cannot be cancelled",
        )

    try:
        cancelled_reservation = reservation_crud.cancel_reservation_manually(
            db,
            reservation,
        )

        db.commit()
        db.refresh(
            cancelled_reservation,
        )

        return cancelled_reservation

    except Exception:
        db.rollback()
        raise


def finish_reservation(
    db: Session,
    reservation: Reservation,
    finish_data: ReservationFinish,
) -> Reservation:
    if reservation.status != ReservationStatus.CONFIRMED:
        raise ValueError(
            "Only confirmed reservations can be finished",
        )

    remaining_balance = calculate_remaining_balance(
        db,
        reservation,
    )

    if remaining_balance != Decimal("0.00"):
        raise ValueError(
            "Reservation cannot be finished until the balance is fully paid",
        )

    try:
        finished_reservation = reservation_crud.finish_reservation(
            reservation=reservation,
            final_comments=(finish_data.final_comments),
        )

        db.commit()
        db.refresh(
            finished_reservation,
        )

        return finished_reservation

    except Exception:
        db.rollback()
        raise
