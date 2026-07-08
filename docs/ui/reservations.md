# Reservation UI

## Purpose

The reservation module is the central place for managing event bookings.

Users can:

- View upcoming reservations.
- Create new reservations.
- Edit reservations.
- Register payments.
- View financial information.
- View customer information.
- Add internal notes.
- View special customer requirements.

---

## Reservation List

The left panel displays a summary card for every reservation.

Each card shows:

- Customer name
- Event date
- Total price
- Deposit paid
- Remaining balance
- Reservation status

Statuses:

- Confirmed
- Pending
- Cancelled

Reservations are ordered by event date.

---

## Reservation Detail

When a reservation is selected, the detail panel displays:

### Customer

- Name
- Phone

### Event

- Date
- Time
- Event type
- Number of guests

### Financial Information

- Total price
- Deposit paid
- Remaining balance

Remaining balance is always calculated automatically.

Formula:

Remaining = Total Price - Total Paid

The remaining balance is never entered manually.

---

## Payments

Each reservation contains a payment history.

Every payment stores:

- Date
- Amount
- Payment method
- Reference (optional)

Users can register additional payments at any time.

---

## Additional Information

Each reservation includes:

### Special Requirements

Information requested by the customer.

Examples:

- Pink tablecloths
- Bounce house
- Dessert table

### Internal Notes

Private notes visible only to salon staff.

Examples:

- Customer is cousin of a friend.
- Call one week before the event.
- Customer requested flexibility on arrival time.

---

## Customer Creation

If the customer does not exist:

Create Reservation

↓

New Customer

↓

Save Customer

↓

Return automatically to Reservation

The reservation creation process continues without losing entered information.

---

## Business Rules

Only one active reservation is allowed per day.

Cancelled reservations free the date.

The remaining balance is always calculated automatically.