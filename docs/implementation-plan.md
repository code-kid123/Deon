# Implementation Plan

Vertical slices > horizontal layers. Every phase ships something usable and
leaves the schema clean behind it. No phase blocks the next; Phase 1 is
already scaffolded in this repo.

## Phase 1 — Foundation: schema, payments, cart state (scaffolded)
**Deliverables**
- Canonical `prisma/schema.prisma` + `supabase/migrations/0001_init.sql`
- `/api/webhooks/paystack` with HMAC verification + idempotent fulfillment
- `/api/webhooks/calendly` booking capture stub
- Order fulfillment automations (stock decrement, enrollment + Telegram invite,
  mentorship activation, consultation payment stamp)
- Zustand persisted cart with hydration guard + cart drawer UI
- Supabase admin/SSR clients, Paystack client, money utilities
- `docs/{architecture,folder-structure,implementation-plan}.md`

**Exit criteria**: `npm run typecheck` passes; webhook replays are ignored;
duplicate `charge.success` events create one enrollment/order.

## Phase 2 — RTW Store (vertical slice #1)
- Catalog pages with category/size/availability filters (`?category=&size=`),
  server-side sort.
- PDP: image gallery, size variant selector, max-stock clamping, size guide.
- Checkout: create order → `transaction/initialize` → success/error pages.
- Server-side cart re-validation against `product_variants.stock` at checkout.
- Stock decrement lands in Phase 1 fulfillment (already provisioned).

**Exit criteria**: a guest can add a size variant, pay, and see paid stock decremented.

## Phase 3 — Academy + Consultations
- Course catalog cards, curriculum breakdown, tier pricing, sample lessons.
- Enrollment confirmation page showing the one-time Telegram invite (from the
  `enrollments` row the webhook created), with email fallback.
- Login/auth (Supabase Auth + `@supabase/ssr`), account pages for orders and
  enrollments; RLS per-user policies.
- Consultation landing with inline Calendly embed + confirmation UI; webhook
  updates already capture bookings.

**Exit criteria**: a paid student reaches the private Telegram community with a
single-use link; a booked consult appears in the dashboard.

## Phase 4 — AI Fashion Assistant
- `/api/ai/chat` streaming Anthropic responses (tool/structured navigation).
- Floating branded widget with conversational styling advice anchored to the
  catalog (`/shop`, `/academy` links inline).
- Prompt-injection guardrails (ignore requests to reveal system prompt),
  rate limiting, conversation persistence (optional).

**Exit criteria**: assistant gives styling advice and links to real products/courses.

## Phase 5 — Mentorship Program
- Program landing: curriculum, tiers, success stories, expectations.
- Intake form: experience level, portfolio links, goals → creates a
  `mentorship_applications` row.
- Conditional redirect: APPROVED-tier → direct Paystack payment
  (`metadata.app_id`); interview tier → Calendly booking.

**Exit criteria**: applicant's payment flips their application to `PAID`.

## Phase 6 — Operations & Hardening
- Admin surface: order management, refund (Paystack refund endpoint + webhook
  `refund.processed`), enrollment revocation (Telegram link revoke), stock ops.
- Email: receipt + invite delivery (Resend), Paystack `transfer` vs `charge`
  handling, webhook observability (status board).

**Exit criteria**: support can refund, revoke access, and restock without code.

## Phase 7 — SEO, Performance, Launch
- Metadata / OG images, sitemap, canonical slugs, ISR for catalog.
- Edge caching, image optimization, Lighthouse ≥ 90.
- Paystack live keys, rate-limit protection, error telemetry (Sentry).

## Non-negotiables
1. Payments: verify signatures, treat webhooks as at-least-once, never trust
   client-sent totals (recompute from DB).
2. Money: integer minor units everywhere.
3. Access: one-time Telegram links, revoke on refund.
4. No secrets in client bundles; only `NEXT_PUBLIC_*`.