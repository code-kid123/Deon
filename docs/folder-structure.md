# Folder Structure

Modular, feature-first layout. Business logic lives in `lib/services`,
state in `store`, and UI in feature folders under `components`.

```
atelier/
├─ app/                              # Next.js App Router (routes = URLs)
│  ├─ (marketing)/                   # public-facing, SEO-indexed routes
│  │  ├─ page.tsx                    #   home
│  │  ├─ shop/page.tsx               #   catalog w/ filter + sort state
│  │  ├─ shop/[slug]/page.tsx        #   PDP: gallery, size variant picker
│  │  ├─ academy/page.tsx            #   course catalog
│  │  ├─ academy/[slug]/page.tsx     #   course detail + curriculum + tiers
│  │  ├─ consultations/page.tsx      #   Calendly landing
│  │  ├─ mentorship/page.tsx         #   tiers, success stories
│  │  ├─ mentorship/apply/page.tsx   #   intake form (conditional redirect)
│  │  └─ about/page.tsx
│  ├─ account/                       # post-auth: orders, enrollments, profile
│  ├─ checkout/                      # checkout flow (or /checkout server actions)
│  ├─ (auth)/                        # login / signup (Supabase auth)
│  ├─ api/
│  │  ├─ webhooks/
│  │  │  ├─ paystack/route.ts        # payment automation (Phase 1)
│  │  │  └─ calendly/route.ts        # booking sync (Phase 1)
│  │  ├─ ai/
│  │  │  └─ chat/route.ts            # streaming assistant (Phase 4)
│  │  └─ checkout/
│  │     └─ initialize/route.ts      # order + Paystack init
│  ├─ layout.tsx
│  ├─ globals.css
│  └─ not-found.tsx
│
├─ components/
│  ├─ ui/                            # shadcn primitives (button, dialog, sheet…)
│  ├─ layout/                        # navbar, footer, announcement bar
│  ├─ product/                       # product-card, gallery, variant-picker, size-guide
│  ├─ cart/                          # cart-button, cart-drawer (Phase 1)
│  ├─ course/                        # course-card, curriculum, tier-card
│  ├─ checkout/                      # address form, payment button, receipt
│  ├─ booking/                       # consultation hero, calendly embed, confirmation
│  ├─ ai/                            # chat-widget, message-bubble, quick-replies
│  ├─ forms/                         # mentorship application, newsletter
│  └─ providers.tsx                  # client providers (themes, toasts)
│
├─ store/
│  └─ cart-store.ts                  # Zustand cart + persist (Phase 1)
│
├─ hooks/
│  ├─ use-has-hydrated.ts            # SSG/SSR hydration guard (Phase 1)
│  └─ use-debounce.ts
│
├─ lib/
│  ├─ supabase/
│  │  ├─ config.ts                   # env constants (Phase 1)
│  │  ├─ admin.ts                    # service-role client (Phase 1)
│  │  ├─ server.ts                   # cookie SSR client (Phase 1)
│  │  └─ database.types.ts           # generated via `npm run db:types`
│  ├─ payments/
│  │  └─ paystack.ts                 # init/verify/signature + types (Phase 1)
│  ├─ services/
│  │  ├─ order-fulfillment.ts        # webhook fulfilment automations (Phase 1)
│  │  ├─ telegram.ts                 # invite link lifecycle (Phase 1)
│  │  └─ email.ts                    # transactional email (Phase 2/3)
│  ├─ types/
│  │  └─ cart.ts                     # cart item contracts (Phase 1)
│  ├─ constants.ts                   # pricing tiers, brand copy
│  ├─ money.ts                       # minor-unit formatting (Phase 1)
│  └─ utils.ts                       # cn(), slugify(), generateReference() (Phase 1)
│
├─ prisma/
│  └─ schema.prisma                  # canonical data model (Phase 1)
│
├─ supabase/
│  └─ migrations/
│     └─ 0001_init.sql               # applied to the real database (Phase 1)
│
├─ docs/
│  ├─ architecture.md
│  ├─ folder-structure.md
│  └─ implementation-plan.md
│
├─ public/                           # static assets
├─ .env.example
├─ next.config.ts
├─ tailwind.config.ts
├─ tsconfig.json
└─ package.json
```

## Rules of thumb

1. **Server vs client**: pages/route handlers are server by default; mark
   interactive leaves with `"use client"`.
2. **Data access**: `lib/services/*` are the only places that call Supabase for
   writes; pages compose them. No inline `.from()` in components.
3. **State**: transient, per-user UI state (cart) lives in Zustand; anything
   that must survive the client (orders, enrollments) lives in Postgres.
4. **Money**: integers (`*_minor`) end-to-end; only `lib/money.ts` formats.
5. **i18n-ready**: copy in `lib/constants.ts`, not scattered across markup.