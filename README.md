# BookingShip Marketplace

Production-ready monorepo for a yacht and boat rental marketplace inspired by Boatsetter, GetMyBoat, Click&Boat, and Sailo.

## Stack
- **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS, React Query
- **Backend:** NestJS, TypeScript, WebSockets, JWT auth
- **DB:** PostgreSQL + Prisma ORM
- **Payments:** Stripe (PaymentIntent + refunds + deposits)
- **Maps:** Google Maps Places + map embeds
- **Realtime:** Socket.IO gateway for trip lifecycle notifications

## Monorepo Layout
- `apps/api`: NestJS backend with booking engine, notifications, payments, and admin endpoints.
- `apps/web`: Next.js frontend marketplace and dashboards.
- `docs/architecture.md`: marketplace architecture, scaling and best practices.

## Key Product Features
- Full-vessel charter booking and per-seat booking.
- Automatic trip confirmation when seats reach vessel capacity.
- Availability and conflict prevention with transactional locking.
- Multi-role model: customer, owner/operator, admin.
- Search and filters: location, date, people, boat type, pricing, captain.
- Reviews and trust layer.
- Stripe payment, deposit and refund support.
- Real-time notifications and 24h trip reminders.

## Quick Start
```bash
# API
cd apps/api
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev

# Web
cd apps/web
npm install
npm run dev
```

## Environment Variables
Use `.env.example` files under each app as template.
