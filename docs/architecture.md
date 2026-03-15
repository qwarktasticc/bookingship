# BookingShip Architecture

## Marketplace Patterns (Boatsetter/GetMyBoat/Click&Boat/Sailo inspired)

1. **Supply-demand role separation**: owner inventory workflows are isolated from customer search/booking flows.
2. **Trust layer**: verified profiles, post-trip reviews, captain inclusion visibility, and audit-ready booking statuses.
3. **Real-time lifecycle**: bookings emit participant notifications, with seat-fill auto-confirmation.
4. **Flexible fulfillment**: one inventory model supports both full charter and seat-based participation.
5. **Revenue control**: deposit-based checkout and refund orchestration through Stripe.

## High-Level Design

- **Frontend (Next.js)**
  - SSR search and listing pages for SEO and conversion.
  - Dynamic booking flow with immediate availability checks.
  - Role-specific dashboards (customer, owner, admin).

- **Backend (NestJS)**
  - Modular domains (`boats`, `bookings`, `payments`, `notifications`, `search`).
  - Transactional booking service prevents overbooking.
  - WebSocket gateway delivers real-time trip and booking events.

- **Data Layer (PostgreSQL + Prisma)**
  - Trip-centered model with seat counters.
  - Composite indexes on high-frequency filter and timeline fields.
  - Unique trip constraint per boat and timeslot.

## Booking Engine Rules

1. **Full charter** reserves all seats and rejects partially-booked trips.
2. **Seat booking** increments `bookedSeats`; rejects request if capacity is exceeded.
3. **Trip confirmation trigger** when `bookedSeats == seatCapacity`:
   - set trip status to `CONFIRMED`
   - notify all participants in real time and persist notifications
4. **Conflict prevention** via overlap query in a single DB transaction.

## Scalability and Global Expansion

- Pagination and selective includes for API reads.
- Add Redis for:
  - query response caching (search results by geohash/date/filter key)
  - websocket fanout and reminder jobs
- Partition large booking/notification tables by month when scale requires.
- Queue async tasks (email/SMS/push/reminders) with BullMQ.
- CDN-backed media storage for boat photos and itinerary assets.
- Region-ready deployment (read replicas + multi-region edge on frontend).

## Security & Compliance

- JWT auth with role-based guards.
- Stripe hosted payment methods (PCI scope reduction).
- PII minimization + audit logs for disputes/refunds.
- Rate limiting and bot mitigation at API gateway.
