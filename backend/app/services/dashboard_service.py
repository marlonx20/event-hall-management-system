from datetime import date
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.payment import Payment
from app.models.reservation import Reservation, ReservationStatus
from app.models.task import Task, TaskStatus
from app.schemas.dashboard import (
    DashboardRead,
    DashboardReservation,
    DashboardTask,
)
from app.services.billing_service import calculate_remaining_balance


def build_dashboard_reservation(
    db: Session,
    reservation: Reservation,
) -> DashboardReservation:
    customer_name = db.scalar(
        select(Customer.full_name).where(
            Customer.id == reservation.customer_id,
        )
    )

    return DashboardReservation(
        id=reservation.id,
        customer_name=customer_name or "Cliente desconocido",
        event_date=reservation.event_date,
        start_time=reservation.start_time,
        event_type=reservation.event_type,
        status=reservation.status,
        remaining_balance=calculate_remaining_balance(
            db,
            reservation,
        ),
    )


def build_dashboard_task(task: Task) -> DashboardTask:
    return DashboardTask(
        id=task.id,
        title=task.title,
        due_date=task.due_date,
        assigned_to=task.assigned_to,
        status=task.status,
    )


def get_dashboard(
    db: Session,
    today: date,
) -> DashboardRead:
    today_events_statement = (
        select(Reservation)
        .where(
            Reservation.event_date == today,
            Reservation.status != ReservationStatus.CANCELLED,
        )
        .order_by(Reservation.start_time)
    )

    today_tasks_statement = (
        select(Task)
        .where(
            Task.due_date == today,
            Task.status != TaskStatus.COMPLETED,
        )
        .order_by(Task.id)
    )

    upcoming_events_statement = (
        select(Reservation)
        .where(
            Reservation.event_date > today,
            Reservation.status == ReservationStatus.CONFIRMED,
        )
        .order_by(
            Reservation.event_date,
            Reservation.start_time,
        )
        .limit(5)
    )

    upcoming_tasks_statement = (
        select(Task)
        .where(
            Task.due_date > today,
            Task.status != TaskStatus.COMPLETED,
        )
        .order_by(
            Task.due_date,
            Task.id,
        )
        .limit(5)
    )

    pending_reservations_statement = (
        select(Reservation)
        .where(
            Reservation.status == ReservationStatus.PENDING,
            Reservation.event_date >= today,
        )
        .order_by(
            Reservation.event_date,
            Reservation.start_time,
        )
    )

    month_start = date(today.year, today.month, 1)

    monthly_income_statement = select(func.coalesce(func.sum(Payment.amount), 0)).where(
        Payment.payment_date >= month_start,
        Payment.payment_date <= today,
    )

    today_events = list(db.scalars(today_events_statement).all())
    today_tasks = list(db.scalars(today_tasks_statement).all())
    upcoming_events = list(db.scalars(upcoming_events_statement).all())
    upcoming_tasks = list(db.scalars(upcoming_tasks_statement).all())
    pending_reservations = list(db.scalars(pending_reservations_statement).all())

    today_pending_payments = [
        reservation
        for reservation in today_events
        if calculate_remaining_balance(db, reservation) > Decimal("0")
    ]

    monthly_income = Decimal(db.scalar(monthly_income_statement) or 0)

    return DashboardRead(
        today_events=[build_dashboard_reservation(db, reservation) for reservation in today_events],
        today_tasks=[build_dashboard_task(task) for task in today_tasks],
        upcoming_events=[
            build_dashboard_reservation(db, reservation) for reservation in upcoming_events
        ],
        upcoming_tasks=[build_dashboard_task(task) for task in upcoming_tasks],
        pending_reservations=[
            build_dashboard_reservation(db, reservation) for reservation in pending_reservations
        ],
        today_pending_payments=[
            build_dashboard_reservation(db, reservation) for reservation in today_pending_payments
        ],
        monthly_income=monthly_income,
    )
