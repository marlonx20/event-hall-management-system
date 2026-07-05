# System Architecture

| Field | Value |
|-------|-------|
| Version | 1.0 |
| Status | Draft |
| Last Updated | 2026-07-04 |
| Author | Marlon Emanuel Calvillo Álvarez |

---

# 1. Purpose

This document describes the high-level architecture of the Event Hall Management System.

Its purpose is to define how the different components of the application interact with each other before implementation begins.

---

# 2. Architecture Style

The application will follow a Client–Server architecture.

The frontend and backend will be independent applications that communicate through a REST API.

```
Browser
     │
     ▼
Frontend (React)
     │
HTTP / JSON
     │
     ▼
Backend (FastAPI)
     │
SQLAlchemy
     │
     ▼
PostgreSQL
```

---

# 3. Main Components

The system is composed of four main components.

## Frontend

Responsible for:

- User Interface
- Forms
- Calendar
- Dashboard
- Communication with the API

---

## Backend

Responsible for:

- Business logic
- Authentication
- Data validation
- Payment calculations
- Reservation management
- Reminder management

---

## Database

Responsible for storing:

- Customers
- Reservations
- Payments
- Reminders
- Notes
- Event information

---

## File Storage

Initially, the system will not store uploaded files.

Future versions may include:

- Customer contracts
- Payment receipts
- Event photographs

---

# 4. Communication

Communication between frontend and backend will use REST over HTTP.

The API will exchange information using JSON.

---

# 5. Authentication

The first version will include a single administrator account.

Future versions may support multiple users with different roles.

---

# 6. Deployment

During development:

- Frontend and backend will run locally.

Future deployment may use:

- Docker
- VPS
- Cloud hosting

---

# 7. Future Scalability

The architecture should support future features such as:

- Multiple event halls.
- Multiple users.
- Public website.
- Customer portal.
- Mobile application.