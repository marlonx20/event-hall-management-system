# API Design

This document defines the public API exposed by the backend.

The API is designed around business use cases instead of database tables.

---

# General Rules

- The API uses REST.
- All data is exchanged as JSON.
- Every resource has a unique identifier.
- The frontend never calculates business logic.
- Business rules are implemented by the backend.

---

# Reservation

## Get Reservations

GET /reservations

Returns a list of reservations.

---

## Get Reservation

GET /reservations/{id}

Returns complete reservation information.

---

## Create Reservation

POST /reservations

Creates a new reservation.

Business Rules:

- Only one active reservation per day.
- Customer must exist.
- Total price must be greater than zero.

---

## Update Reservation

PUT /reservations/{id}

Updates reservation information.

---

## Cancel Reservation

PUT /reservations/{id}/cancel

Business Rules:

- Reservation status becomes Cancelled.
- The reservation date becomes available again.
- Reservation history is preserved.

---

## Finish Reservation

PUT /reservations/{id}/finish

Registers the final event information.

Information:

- Final comments
- Extra hours
- Extra charge
- Damage description
- Damage charge

Business Rules:

- Reservation status becomes Finished.

---

# Payments

## Register Payment

POST /reservations/{id}/payments

Creates a payment for a reservation.

Business Rules:

- Payment amount must be greater than zero.
- Remaining balance is recalculated automatically.

---

## Get Payments

GET /reservations/{id}/payments

Returns payment history.

---

# Customers

## Get Customers

GET /customers

Returns customer list.

---

## Get Customer

GET /customers/{id}

Returns customer profile.

Includes:

- Customer information
- Reservation history

---

## Create Customer

POST /customers

Creates a customer.

---

## Update Customer

PUT /customers/{id}

Updates customer information.

---

# Calendar

## Monthly Calendar

GET /calendar/{year}/{month}

Returns:

- Reservation status for every day.
- Salon tasks for every day.

---

# Tasks

## Get Tasks

GET /tasks

Returns salon tasks.

---

## Create Task

POST /tasks

Creates a task.

---

## Update Task

PUT /tasks/{id}

Updates a task.

---

## Delete Task

DELETE /tasks/{id}

Deletes a task.

Business Rule:

Completed tasks remain stored.

Cancelled tasks are deleted.

---

# Venue

## Get Venue

GET /venue

Returns salon information.

---

## Update Venue

PUT /venue

Updates:

- Hall information
- Contact information
- Base price
- Quick message