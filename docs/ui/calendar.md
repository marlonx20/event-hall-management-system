# Calendar UI

## Purpose

The calendar allows the owner to quickly identify reservation availability, confirmed dates, pending reservations, cancelled reservations and salon tasks.

## Main Rules

- The calendar uses a monthly view by default.
- The system supports only one active reservation per day.
- Cancelled reservations do not block the date.
- Cancelled reservations remain visible only as historical records.
- Days with salon tasks must show a task icon even if there is no reservation.

## Visual States

- Available: no active reservation.
- Pending: reservation exists but is not confirmed.
- Confirmed: reservation is confirmed.
- Cancelled: a reservation existed but was cancelled; the date is available.
- Task icon: the day has salon tasks or reminders.

## Month Navigation

The calendar must allow moving to:

- Previous month.
- Next month.

Weekly and daily views are not required for the first version.

## Day Selection Behavior

When selecting a day with an active reservation:

- Show the reservation summary.
- Allow opening the full reservation details.
- Show salon tasks for that date separately.

When selecting an available day:

- Show that the day is available.
- Show salon tasks and reminders for that date.
- Allow creating a new reservation.

When selecting a day with a cancelled reservation:

- Show that the day is available.
- Show the cancelled reservation history.
- Allow creating a new reservation.