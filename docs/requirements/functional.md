# Functional Requirements

| Field | Value |
|-------|-------|
| Version | 1.0 |
| Status | Draft |
| Last Updated | 2026-07-04 |
| Author | Marlon Emanuel Calvillo Álvarez |

---

# 1. Introduction

This document defines the functional requirements of the Event Hall Management System.

Each requirement describes a specific capability that the system must provide.

---

# 2. Reservation Management

### FR-001 - Create Reservation

The system shall allow the owner to create a new reservation.

---

### FR-002 - Edit Reservation

The system shall allow the owner to edit an existing reservation.

---

### FR-003 - Cancel Reservation

The system shall allow the owner to cancel a reservation without permanently deleting its information.

---

### FR-004 - Reservation Status

The system shall allow the owner to update the reservation status.

Possible statuses include:

- Inquiry
- Interested
- Hall Visit Scheduled
- Waiting for Deposit
- Reserved
- Confirmed
- Completed
- Cancelled

---

### FR-005 - Calendar View

The system shall display all reservations in a calendar view.

---

### FR-006 - Availability Check

The system shall indicate whether a selected date is available.

---

# 3. Customer Management

### FR-007 - Register Customer

The system shall allow the owner to register customer information.

---

### FR-008 - Customer History

The system shall display previous reservations associated with a customer.

---

### FR-009 - Contact Information

The system shall store customer contact information including phone number and preferred communication method.

---

# 4. Payment Management

### FR-010 - Register Deposit

The system shall allow the owner to register the initial deposit.

---

### FR-011 - Register Payments

The system shall allow the owner to register additional payments.

---

### FR-012 - Remaining Balance

The system shall automatically calculate the remaining balance.

---

### FR-013 - Payment History

The system shall keep a history of all payments associated with a reservation.

---

# 5. Event Management

### FR-014 - Event Details

The system shall store event date, schedule and event type.

---

### FR-015 - Customer Requirements

The system shall store special customer requirements.

Examples include:

- Tablecloth color
- Bouncy castle
- Catering
- Decoration requests

---

### FR-016 - Internal Notes

The system shall allow the owner to store internal notes for each reservation.

---

# 6. Reminder Management

### FR-017 - General Reminders

The system shall allow the owner to create general reminders unrelated to a reservation.

Examples include:

- Repair restroom
- Buy chairs
- Replace dishes

---

### FR-018 - Reservation Tasks

The system shall allow the owner to create tasks associated with a reservation.

---

# 7. Quick Actions

### FR-019 - Quick Messages

The system shall provide predefined messages that can be copied quickly.

Examples include:

- WhatsApp response
- Facebook response
- Bank account information
- Hall location

---

### FR-020 - Quick Access to Media

The system shall provide quick access to photos, prices and promotional information for sharing with customers.

---

# 8. Dashboard

### FR-021 - Upcoming Events

The dashboard shall display upcoming events.

---

### FR-022 - Pending Payments

The dashboard shall display reservations with pending balances.

---

### FR-023 - Pending Reminders

The dashboard shall display pending reminders and maintenance tasks.