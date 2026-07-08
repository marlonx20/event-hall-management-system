# Domain Model

This document defines the main business entities of the Event Hall Management System.

---

# Customer

Represents a person who rents the event hall.

Responsibilities:

- Store customer information.
- Keep reservation history.
- Store internal customer notes.
- Store post-event comments.

---

# Reservation

Represents a reservation for one event.

Responsibilities:

- Store event information.
- Store reservation status.
- Link a customer.
- Track payments.
- Store internal notes.
- Store special customer requirements.

---

# Payment

Represents one payment made by a customer.

Responsibilities:

- Store payment amount.
- Store payment date.
- Store payment method.
- Store optional payment reference.

---

# Task

Represents a salon task.

Examples:

- Wash tablecloths.
- Buy disposable plates.
- Pay electricity.
- Repair bathroom.

A task may optionally have a due date.

---

# Customer Comment

Represents internal comments about customer behavior after an event.

Examples:

- Left the bathroom dirty.
- Paid on time.
- Broke two plates.
- Stayed one extra hour.

These comments are visible only to salon staff.

---

# Reminder

Represents a reminder for the salon.

Examples:

- Renew business permit.
- Pay taxes.
- Buy decorations.

Reminders may optionally have a date.