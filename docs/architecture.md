# System Architecture

## High-level view

```
                          ┌──────────────────────────────┐
                          │         Next.js (App Router)  │
   Browser ─────────────► │  SSR pages · RSC · Client UI  │
   Chatbot widget ◄─────► │  AI assistant (streaming)     │
                          └──────┬───────────┬────────────┘
                                 │           │
                        Server Actions /      │
                        Route Handlers        │
                          │  │  │             │
        ┌─────────────────┘  │  └───────────┐ │
        ▼                    ▼              ▼ ▼
┌──────────────┐   ┌────────────────┐  ┌────────────┐
│   Supabase   │   │ Paystack API   │  │ Anthropic  │
│  PostgreSQL  │ ◄─┤ webhooks +     │  │  / OpenAI  │
│  (RLS+auth)  │   │ redirect flow  │  └────────────┘
│              │   └────────────────┘
│  Telegram    │◄── bot API: create/revoke invite links
│  Bot API     │
└──────────────┘

External ===> platform
  Calendly webhook ──► /api/webhooks/calendly ──► consultation_bookings (sync)
  Paystack webhook ──► /api/webhooks/paystack ──► fulfillment automations
```

## Key decisions

### Money representation — integer minor units
All amounts are stored as `*_minor` integer columns (kobo for NGN, cents for
USD). This maps 1:1 onto Paystack's payloads (`amount` is always the smallest
currency unit), avoids float rounding entirely, and is what Stripe-style
processors expect. Display formatting lives in `lib/money.ts`.

### Schema canonical source
`prisma/schema.prisma` is the canonical data model and doubles as living
documentation. Runtime access uses the Supabase JS client against the mirrored
schema in `supabase/migrations/0001_init.sql`. Two consequences:

- Every column name in SQL is `snake_case`; JS code reads/writes snake_case.
- ID types differ on purpose: Prisma documents `cuid()` strings; Postgres uses
  `uuid` + `gen_random_uuid()`. You may later `prisma db pull` to regenerate a
  Prisma client from Supabase if you want typed access.

### Webhook-driven automation (Paystack)
Checkout pipeline:

1. Server creates an `orders` row (`status = PENDING`) whose `reference` is also
   used as the Paystack reference, then calls `POST /transaction/initialize`.
   Course/mentorship/consultation purchases store their context in
   `orders.metadata` (`course_id`, `tier_id`, `app_id`, `booking_id`).
2. Customer pays; Paystack redirects back to the success URL AND sends
   `charge.success` to `/api/webhooks/paystack`.
3. The webhook verifies the HMAC-SHA512 `x-paystack-signature`, records the
   transaction (idempotency key = `payment_transactions.reference`), marks the
   order `PAID` (or `already-paid`), and fulfils by order type:

| Order type   | Fulfilment                                                              |
| ------------ | ----------------------------------------------------------------------- |
| `CART`       | Decrement `product_variants.stock`; mark `FULFILLED` (or `PARTIALLY_FULFILLED` on shortfall) |
| `COURSE`     | Upsert an `enrollments` row (ACTIVE), generate one-time Telegram invite link, email the link |
| `MENTORSHIP` | Set `mentorship_applications.status = PAID`                             |
| `CONSULTATION`| Stamp `consultation_bookings.payment_reference`                        |

Failure returns HTTP 500 so Paystack retries (at-least-once delivery); the
idempotency guard makes redelivery safe. A redirect fallback also verifies the
transaction end-point before showing the receipt page.

### Telegram membership automation
Single-use private-community invites are generated with the Bot API
(`createChatInviteLink`, `member_limit = 1`, 24h expiry) and stored on the
enrollment. If Telegram is unavailable the enrollment is created as `PENDING`
and completed by a retry job — never block the payment confirmation on
Telegram. Revoke after use (`revokeChatInviteLink`) for true single-use.

### Consultation sync (Calendly)
An inline Calendly widget handles availability in the browser. Calendly
webhooks (`invitee.created`, `invitee.canceled`) upsert rows into
`consultation_bookings` keyed by `calendly_event_uuid`. The same table holds
optional payment references for paid consultation tiers.

### AI assistant
`app/api/ai/chat/route.ts` streams Anthropic responses. System prompt is
grounded in: brand history, styling/fabric/occasion advice, size guidance, and
site navigation. Navigation intents return structured links
(`/shop/[slug]`, `/academy/[slug]`, `/consultations`) so the widget can render
clickable product/course cards.

### Security & RLS
- Supabase service-role client (`lib/supabase/admin.ts`) is used only in
  privileged paths (webhooks, order fulfillment).
- User-facing reads go through `lib/supabase/server.ts` (cookie auth) and the
  browser anon key.
- Baseline RLS: anon may `SELECT` published catalog rows only; every other
  table is locked down. Per-user policies (own orders, own enrollments) are
  added in Phase 2/3 at auth time.

## Database {tables}

- `users` · `courses` · `course_tiers` · `course_modules` · `course_lessons`
- `enrollments` · `product_categories` → `categories` · `products` · `product_images` · `product_variants`
- `orders` · `order_items` · `payment_transactions`
- `mentorship_tiers` · `mentorship_applications` · `consultation_bookings`

Enums: `order_type`, `order_status`, `enrollment_status`, `booking_*`,
`course_status`, `product_status`, `variant_status`, `mentorship_application_status`,
and user `role`/`status`.

## Deployment

- Vercel: Next.js edge/node functions, env vars for Supabase/Paystack/Telegram/Anthropic.
- Supabase: migrations via `supabase db push`; keep RLS on.
- Secrets never in client bundles — only `NEXT_PUBLIC_*` values are exposed.