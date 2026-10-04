# Atelier — Fashion House & Academy Platform

Modern commerce + education platform: ready-to-wear store, online academy with
Telegram-gated community access, consultations (Calendly-synced), a mentorship
program, and an AI fashion assistant.

## Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn UI, Lucide
- **Backend**: Next.js Route Handlers / Server Actions
- **Database**: Supabase (PostgreSQL) via `@supabase/supabase-js` and `@supabase/ssr`
- **Schema**: canonical model in `prisma/schema.prisma`, applied to Supabase via `supabase/migrations/0001_init.sql`
- **Payments**: Paystack (initalize + webhook-driven fulfillment)
- **State**: Zustand with `persist` for the cart
- **AI**: Anthropic SDK streaming assistant

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Link Supabase and push the migration
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npm run db:migrate

# 3. Generate typed database helpers (optional but recommended)
npm run db:types

# 4. Configure environment
cp .env.example .env.local   # fill in keys

# 5. Run
npm run dev
```

## Module map

| Module            | Status      | Key paths                                                            |
| ----------------- | ----------- | -------------------------------------------------------------------- |
| Academy           | Phase 1 sdg  | `prisma/schema.prisma`, `lib/services/order-fulfillment.ts`, `lib/services/telegram.ts` |
| Consultation      | Phase 1 sdg  | `app/api/webhooks/calendly/route.ts`                                  |
| Mentorship        | Phase 1 sdg  | `prisma/schema.prisma`, `lib/services/order-fulfillment.ts`           |
| RTW Store         | Phase 1 sdg  | `store/cart-store.ts`, `components/cart/*`                            |
| AI assistant      | Planned      | `app/api/ai/chat/route.ts` (Phase 4)                                  |

See `docs/implementation-plan.md` for the full roadmap.