# GoSafe — Bus Booking Platform

A full-stack bus ticket booking platform for India, built with **Next.js 16**, **React 19**, **Prisma 7**, and **Tailwind CSS 4**.

Search routes, pick seats from a live seat map, pay online, and receive a PDF e-ticket by email and WhatsApp. Includes an AI support assistant, live bus tracking, customer accounts, and an operator-ready database schema.

**Live demo:** [https://go-safe-iota.vercel.app](https://go-safe-iota.vercel.app)

---

## Features

- **Route search** — search by source, destination, and date with filters for bus type, price, time, and amenities.
- **Interactive seat map** — lower/upper decks, seater/sleeper layouts, live availability, and 10-minute seat holds.
- **Booking flow** — passenger details, GST calculation, optional travel insurance (₹19/seat), and offer codes.
- **Payments** — Stripe Checkout and Razorpay orders, with signature-verified webhooks and idempotent payment records.
- **E-tickets** — server-generated PDF tickets with boarding/dropping points, downloadable from the confirmation page.
- **Notifications** — ticket delivery via Resend (email) and Twilio (WhatsApp/SMS).
- **Accounts** — credentials-based auth with NextAuth v5, signup, login, and "My Bookings".
- **AI support assistant** — Gemini-powered chat that can look up bookings, resend tickets, and cancel bookings after OTP verification.
- **Live tracking** — public tracking page with simulated live bus positions.
- **PWA** — installable app with manifest and service worker.
- **SEO** — metadata, Open Graph, JSON-LD, sitemap, robots, and canonical URLs.
- **Dark mode** — system-aware theme with a manual toggle.
- **API hardening** — per-route rate limiting, CORS, CSP/security headers, and request size limits.
- **Optional observability** — Sentry error tracking and PostHog analytics.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, Lucide icons |
| Database | SQLite via Prisma 7 + libSQL adapter (local file or Turso) |
| Auth | NextAuth.js v5 (credentials) |
| Payments | Stripe, Razorpay |
| Email | Resend |
| Messaging | Twilio (WhatsApp + SMS) |
| AI | Vercel AI SDK + Google Gemini |
| PDF | pdf-lib |
| Validation | Zod |
| Cache | Redis (optional, in-memory fallback) |
| Testing | Vitest |

---

## Getting Started

### Prerequisites

- Node.js **20.9+**
- npm
- A database: local SQLite file (default) or a [Turso](https://turso.tech) database

### 1. Install

```bash
git clone https://github.com/pankaj-q/GoSafe.git
cd GoSafe
npm install
```

`postinstall` runs `prisma generate` automatically.

### 2. Configure environment

```bash
cp .env.example .env
```

At minimum, set:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="<openssl rand -base64 48>"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="<your-key>"
```

See [Environment Variables](#environment-variables) for the full list.

### 3. Set up the database

```bash
# Apply migrations to the local SQLite database
npx prisma migrate dev

# Seed demo cities, routes, buses, schedules, and seats
npm run db:seed
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values you need.

### Required

| Variable | Description |
|---|---|
| `DATABASE_URL` | SQLite file URL (`file:./prisma/dev.db`) or Turso libSQL URL |
| `TURSO_AUTH_TOKEN` | Required when `DATABASE_URL`/`TURSO_DATABASE_URL` points to Turso |
| `NEXTAUTH_SECRET` | Session signing secret, at least 32 characters |
| `NEXTAUTH_URL` | Public app URL, e.g. `https://gosafe.in` |
| `GEMINI_API_KEY` | Required in production for the AI assistant |

### Payments

| Variable | Description |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...` or `sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook secret |
| `PAYMENTS_DEMO_MODE` | `true` to complete bookings with mock payments when no gateway keys are set |

> **Demo mode:** with `PAYMENTS_DEMO_MODE=true`, clicking **Pay** skips the real gateway and confirms the booking immediately. Use this only for testing. Never enable it on a live storefront.

### Email / SMS / OAuth / Optional

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Resend API key for ticket emails |
| `RESEND_FROM_EMAIL` | Verified sender address |
| `RESEND_FROM_NAME` | Sender display name |
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_WHATSAPP_FROM` | WhatsApp sender, e.g. `whatsapp:+14155238886` |
| `TWILIO_SMS_FROM` | SMS sender number |
| `GOOGLE_CLIENT_ID` | Optional Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Optional Google OAuth client secret |
| `CORS_ORIGINS` | Comma-separated allowed origins for the API |
| `GEMINI_MODEL` | Gemini model override (default: `gemini-2.5-flash`) |
| `REDIS_URL` | Optional Redis URL for shared caching |
| `SENTRY_DSN` | Optional Sentry DSN |
| `NEXT_PUBLIC_POSTHOG_KEY` | Optional PostHog project key |
| `NEXT_PUBLIC_POSTHOG_HOST` | Optional PostHog host |

---

## Database

The Prisma schema lives in [`prisma/schema.prisma`](prisma/schema.prisma). It covers:

- Cities, routes, operators, buses, amenities, and bus images
- Schedules, boarding/dropping points, and seats
- Bookings, passengers, payments, and webhook events
- Users, insurance plans, chat sessions, and support OTPs

### Local SQLite

```env
DATABASE_URL="file:./prisma/dev.db"
```

```bash
npx prisma migrate dev     # apply migrations
npm run db:seed            # seed demo data
npx prisma studio          # inspect data (optional)
```

### Turso / libSQL

```env
TURSO_DATABASE_URL="libsql://your-db.turso.io"
TURSO_AUTH_TOKEN="<token>"
```

The app uses `@prisma/adapter-libsql`, so the same schema works against a local file or Turso. See [`DEPLOYMENT.md`](DEPLOYMENT.md) for the full production setup.

> `src/generated/prisma` is generated and gitignored. `npm install` and `npm run build` regenerate it automatically.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Generate Prisma Client and build for production |
| `npm start` | Start the production server |
| `npm run db:migrate` | Apply pending migrations (`prisma migrate deploy`) |
| `npm run db:seed` / `npm run seed` | Seed the database |
| `npm test` | Run the Vitest suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |

---

## Project Structure

```text
src/
├── app/                    # App Router pages and API routes
│   ├── api/                # Search, bookings, payments, auth, chat, webhooks
│   ├── booking/            # Seat selection and checkout
│   ├── confirmation/       # Booking confirmation and e-ticket
│   ├── search/             # Search results
│   ├── my-bookings/        # Customer bookings
│   ├── track/              # Live bus tracking
│   └── ...                 # Static/content pages (help, terms, privacy, etc.)
├── components/             # Shared UI components
├── lib/                    # Prisma, auth, payments, email, SMS, PDF, cache, SEO
├── generated/prisma/       # Generated Prisma Client (gitignored)
└── proxy.ts                # API rate limiting + CORS middleware
prisma/
├── schema.prisma           # Data model
├── migrations/             # SQL migrations
└── seed.ts                 # Demo data
```

---

## API Overview

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/search` | Search routes and available buses |
| `GET` | `/api/tracking` | Live bus tracking data |
| `GET` | `/api/schedules/[scheduleId]/seats` | Seat map and availability |
| `POST` / `DELETE` | `/api/holds` | Hold or release seats |
| `POST` | `/api/bookings` | Create a booking and payment record |
| `GET` | `/api/bookings/[id]` | Look up a booking |
| `GET` | `/api/bookings/[id]/ticket` | Download the PDF e-ticket |
| `POST` | `/api/bookings/confirm` | Confirm a booking after payment |
| `GET` | `/api/bookings/user` | Bookings for the signed-in user |
| `POST` | `/api/stripe/checkout` | Create a Stripe Checkout session |
| `POST` | `/api/razorpay/order` | Create a Razorpay order |
| `POST` | `/api/payments` | Verify and capture a payment |
| `POST` | `/api/webhooks/stripe` | Stripe webhook handler |
| `POST` | `/api/webhooks/razorpay` | Razorpay webhook handler |
| `POST` | `/api/chat` | AI support assistant (streaming) |
| `POST` | `/api/auth/signup` | Create an account |
| `*` | `/api/auth/[...nextauth]` | NextAuth handlers |

API routes are rate-limited in [`src/proxy.ts`](src/proxy.ts): auth requests are limited to 10/min, writes to 30/min, and reads to 120/min per IP. Webhooks are exempt because they are signature-verified.

---

## Payments

The booking flow supports two gateways:

- **Stripe** — creates a Checkout Session and confirms via `/api/webhooks/stripe`.
- **Razorpay** — creates an order and confirms via `/api/webhooks/razorpay` or `/api/payments`.

Both use idempotency keys and verify webhook signatures. When gateway keys are missing:

- In development, payments run in mock mode automatically.
- In production, set `PAYMENTS_DEMO_MODE=true` to allow the flow to complete with mock payments.

### Webhook URLs

```text
Stripe:   https://your-domain.com/api/webhooks/stripe
Razorpay: https://your-domain.com/api/webhooks/razorpay
```

For local Stripe testing:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## AI Support Assistant

The chat endpoint (`/api/chat`) uses Google Gemini through the Vercel AI SDK. It is grounded in a curated knowledge base and can perform real actions with tools:

- Look up a booking by reference code and phone number
- Resend a ticket
- Cancel a booking (after OTP verification)
- Request an OTP by SMS

Set `GEMINI_API_KEY` to enable it. The assistant is available from the floating widget on the site.

---

## Testing

```bash
npm test
```

Tests use Vitest and currently cover utility functions such as currency/date formatting and reference code generation.

---

## Deployment

The recommended stack is **Vercel + Turso**.

1. Create a Turso database.
2. Apply the migration SQL and seed data.
3. Import the repo into Vercel.
4. Add the environment variables from `.env.example`.
5. Deploy.

Full step-by-step instructions, including webhook setup and a Docker/VPS alternative, are in [`DEPLOYMENT.md`](DEPLOYMENT.md).

---

## Security Notes

- Environment variables are validated at startup; production fails fast if required values are missing.
- Webhooks verify gateway signatures before processing.
- API routes are rate-limited and protected by CORS rules.
- Security headers (CSP, HSTS, X-Frame-Options, etc.) are configured in `next.config.ts`.
- Support actions that change bookings require an OTP sent to the registered phone number.
- Never commit `.env` files or real gateway keys.

---

## License

This project is proprietary. All rights reserved.
