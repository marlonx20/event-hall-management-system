# Database Design

## Business Rules

- The system manages one venue in version 1.
- A venue can have many reservations.
- Only one active reservation is allowed per day.
- Cancelled reservations do not block the date.
- Cancelled reservations must remain stored for historical reference.
- A customer can have many reservations.
- A reservation belongs to one customer.
- A reservation can have many payments.
- The remaining balance is never stored manually.
- The remaining balance is calculated as: total price minus total paid.
- A task may have a due date.
- A task may be assigned to a person using a simple text field.
- Customer comments are created after an event and shown in the customer profile.

---

## Allowed Values

### Reservation Status

- Pending
- Confirmed
- Finished
- Cancelled

### Payment Method

- Cash
- Transfer

### Task Status

- Pending
- In Progress
- Completed

Cancelled tasks are deleted instead of stored.

## Entities

### Venue

Represents the event hall.

Fields:

- id
- name
- address
- capacity
- base_price
- phone_numbers
- facebook_url
- bank_account_info
-quick_message

---

### Customer

Represents a customer.

Fields:

- id
- full_name
- phone_number
- preferred_contact_method
- notes

---

### Reservation

Represents an event reservation.

Fields:

- id
- venue_id
- customer_id
- event_date
- start_time
- end_time
- event_type
- guest_count
- has_bouncy_castle
- total_price
- status
- special_requirements
- internal_notes
- final_comments
- extra_hours
- extra_charge
- damage_description
- damage_charge

---

### Payment

Represents a payment made for a reservation.

Fields:

- id
- reservation_id
- payment_date
- amount
- method
- reference

---

### Task

Represents a salon task.

Fields:

- id
- title
- description
- due_date
- status
- assigned_to
- notes

---

---

## Relationships

### Venue to Reservation

A venue can have many reservations.

Each reservation belongs to one venue.

### Customer to Reservation

A customer can have many reservations.

Each reservation belongs to one customer.

### Reservation to Payment

A reservation can have many payments.

Each payment belongs to one reservation.

### Venue to Task

A venue can have many tasks.

Each task belongs to one venue.