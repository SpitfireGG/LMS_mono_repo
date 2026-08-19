# Payments & wishlist

Course checkout with three payment methods — **Stripe** (hosted), **Payoneer**
(hosted) and **Card** (number / expiry / security code on our own form) — plus a
per-user wishlist.

Both providers are optional at runtime. With no credentials the API runs in
**sandbox mode**: the flow is complete and testable end to end, settled from the
payment status page instead of a live processor.

## Setup

1. Copy `backend/.env.example` to `backend/.env` and fill in what you have.
2. Apply the schema: `npm run prisma:migrate` (or `npx prisma migrate deploy`).
3. Start the API — `npm run dev` — and the frontend from the repo root.

### Stripe

| Variable | Where it comes from |
| --- | --- |
| `STRIPE_SECRET_KEY` | Dashboard → Developers → API keys |
| `STRIPE_PUBLISHABLE_KEY` | same page; served to the browser via `/api/payments/config` |
| `STRIPE_WEBHOOK_SECRET` | Dashboard → Developers → Webhooks → signing secret |

Point the webhook endpoint at `POST /api/payments/webhook/stripe` and subscribe
to `checkout.session.completed`, `checkout.session.expired`,
`checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`,
`payment_intent.succeeded`, `payment_intent.payment_failed` and `charge.refunded`.

Locally: `stripe listen --forward-to localhost:4000/api/payments/webhook/stripe`.

### Payoneer

Payoneer Checkout (Open Payment Platform) credentials come from merchant
onboarding: `PAYONEER_MERCHANT_CODE`, `PAYONEER_API_KEY`, and `PAYONEER_API_BASE`
(`https://api.sandbox.oscato.com` for sandbox). Register
`POST /api/payments/webhook/payoneer` as the notification URL; set
`PAYONEER_NOTIFICATION_SECRET` to have those callbacks signature-checked.

### Card payments and PCI scope

The card form collects the number, expiry and security code, and the API
validates them (Luhn, expiry, brand-aware CVC length) before anything is
charged. **Only the brand, last four digits and expiry are ever persisted** — the
PAN and CVC are never written to the database or the logs.

Handling a raw PAN on your own server puts you in PCI-DSS SAQ D scope, and
Stripe rejects raw card numbers unless the account is approved for it. So with
live keys the API expects `paymentMethodId` — a token created in the browser
with Stripe.js — and returns a clear error if raw details arrive instead. Set
`PAYMENTS_ALLOW_RAW_CARD=true` only if the account really is PCI approved.

Sandbox mode accepts raw details directly and mirrors the familiar test numbers:

| Number | Outcome |
| --- | --- |
| `4242 4242 4242 4242` | approved |
| `4000 0000 0000 0002` | declined |
| `4000 0000 0000 9995` | insufficient funds |
| `4000 0000 0000 0127` | wrong security code |

## API

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/payments/config` | public | Methods available to the checkout page |
| `POST` | `/api/payments/checkout` | user | Start a payment for a course |
| `GET` | `/api/payments` | user | My payment history |
| `GET` | `/api/payments/:id` | owner | One payment |
| `POST` | `/api/payments/:id/refresh` | owner | Re-read status from the provider |
| `POST` | `/api/payments/:id/sandbox` | owner | Settle in sandbox mode only |
| `POST` | `/api/payments/webhook/stripe` | signature | Stripe events |
| `POST` | `/api/payments/webhook/payoneer` | signature | Payoneer notifications |
| `GET` | `/api/wishlist` | user | Saved courses |
| `GET` | `/api/wishlist/ids` | user | Course ids, for the heart buttons |
| `POST` | `/api/wishlist` | user | Save a course |
| `DELETE` | `/api/wishlist/:courseId` | user | Remove one |
| `DELETE` | `/api/wishlist/all` | user | Clear the list |

A successful payment creates the `Enrollment`, bumps the course's student count
and drops the course from the wishlist — all inside one transaction, and
idempotent, so a webhook replay and the status-page refresh can't double-enrol.

## Frontend routes

- `/courses/[slug]` — course detail, with *Checkout* and *Add to wishlist*
- `/checkout/[slug]` — method picker and card form
- `/checkout/status?payment=<id>` — receipt / retry, polls until settled
- `/wishlist` — saved courses

`/checkout/status` is a static route, so it takes precedence over
`/checkout/[slug]`; a course slugged exactly `status` would be unreachable
there.
