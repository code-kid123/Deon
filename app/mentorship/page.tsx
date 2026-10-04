import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, Minus } from "lucide-react";
import { PageBody, PageHero } from "@/components/site/page-hero";
import { buttonClassName } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MOCK_EDITORIAL } from "@/lib/mock/catalog";
import { formatMoney } from "@/lib/money";

export const metadata: Metadata = {
  title: "Mentorship",
  description:
    "A bounded mentorship programme for designers ready to build an actual label. Direct critique, production and wholesale strategy, and a clear answer at the end of every cycle."
};

const TIERS = [
  {
    name: "Studio",
    priceMinor: 8500000,
    duration: "3 months",
    summary: "For designers building their first real collection.",
    includes: [
      "Monthly group critique (6 sessions)",
      "Production and costing review, twice",
      "Collection plan reviewed line by line",
      "Private Telegram channel",
      "Portfolio feedback within 48h"
    ],
    excludes: ["One-to-one sessions", "Lookbook review"]
  },
  {
    name: "Atelier",
    priceMinor: 21000000,
    duration: "6 months",
    featured: true,
    summary: "Our full programme, with direct time in the room.",
    includes: [
      "Everything in Studio",
      "12 one-to-one sessions with the creative director",
      "Two lookbooks reviewed and critiqued",
      "Wholesale and pricing strategy session",
      "In-person fitting and production visit",
      "Referrals to buyers and press we trust"
    ],
    excludes: []
  },
  {
    name: "Residency",
    priceMinor: 45000000,
    duration: "12 months",
    summary: "A year embedded in the DEON atelier.",
    includes: [
      "Everything in Atelier",
      "A dedicated workbench in the atelier",
      "Monthly collection drop with shared revenue",
      "First look at every DEON sample before release",
      "Portfolio shoot at the end of the year"
    ],
    excludes: []
  }
];

const STAGES = [
  {
    step: "01",
    title: "Apply",
    body: "Tell us your experience level, send a portfolio link and describe what you are trying to build. Fifteen minutes of writing is enough."
  },
  {
    step: "02",
    title: "Review",
    body: "We read every application ourselves. If it is a fit you hear from us within five working days — if it is not, you get a clear no with notes on why."
  },
  {
    step: "03",
    title: "Pay, or don't",
    body: "No obligation at the review stage. If you accept a tier we issue the invoice, and the programme starts at the next intake date."
  }
];

export default function MentorshipPage() {
  return (
    <>
      <PageHero
        eyebrow="For designers"
        title="Mentorship for people building an actual label."
        standfirst="This is not a course subscription. It is a bounded programme with real expectations on both sides, run by the same people who cut and sell the DEON collection."
        breadcrumb={[{ href: "/", label: "Home" }, { href: "/mentorship", label: "Mentorship" }]}
      >
        <Link href="/mentorship#apply" className={buttonClassName({ size: "lg" })}>
          Start an application
        </Link>
        <Link href="/academy" className={buttonClassName({ size: "lg", variant: "outline" })}>
          Or take a course first
        </Link>
      </PageHero>

      {/* Process */}
      <PageBody>
        <div className="grid gap-px bg-bone/[0.07] md:grid-cols-3">
          {STAGES.map((stage) => (
            <article key={stage.step} className="flex flex-col gap-4 bg-noir p-8 lg:p-10">
              <span className="font-serif text-3xl text-gold">{stage.step}</span>
              <h2 className="font-serif text-2xl leading-tight">{stage.title}</h2>
              <p className="font-sans text-sm leading-relaxed text-muted-foreground">{stage.body}</p>
            </article>
          ))}
        </div>
      </PageBody>

      {/* Image + honesty */}
      <section className="border-y border-bone/10 bg-noir">
        <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-12 lg:py-28">
          <figure className="relative aspect-[4/3] overflow-hidden">
            {MOCK_EDITORIAL.mentorship ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={MOCK_EDITORIAL.mentorship.url}
                alt={MOCK_EDITORIAL.mentorship.alt}
                className="h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-noir/70 to-transparent" />
          </figure>

          <div className="flex flex-col gap-6">
            <p className="eyebrow">The honest part</p>
            <h2 className="max-w-[16ch] font-serif text-3xl leading-tight lg:text-4xl">
              We would rather turn you down.
            </h2>
            <p className="max-w-lg font-sans text-sm leading-relaxed text-muted-foreground">
              Mentorship only works when the mentee is already making things. Most applications we
              decline are not about talent — they are about timing. If you are still building your
              first collection, take the course instead; it costs less and it is built for exactly that
              stage.
            </p>
            <p className="max-w-lg font-sans text-sm leading-relaxed text-muted-foreground">
              We take on six designers a year. That number is set by how much critique we can give
              properly, not by how much we could sell.
            </p>
            <Link
              href="/academy"
              className="link-underline w-fit gap-1.5 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-gold"
            >
              See the courses instead
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <PageBody className="border-b border-bone/10">
        <header className="mb-14 flex max-w-2xl flex-col gap-4">
          <p className="eyebrow">Tiers</p>
          <h2 className="font-serif text-display-sm">
            Three levels of <span className="italic text-gold">involvement</span>.
          </h2>
          <p className="font-sans text-sm leading-relaxed text-muted-foreground">
            Every tier includes the private Telegram channel and direct critique. What changes is how
            much of your time we can hold.
          </p>
        </header>

        <ul className="grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <li
              key={tier.name}
              className={`flex flex-col gap-6 border p-7 transition-colors duration-500 hover:border-gold/35 ${
                tier.featured ? "border-gold/40 bg-gold/[0.04]" : "border-bone/12"
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-2xl">{tier.name}</h3>
                  {tier.featured ? <Badge variant="solid">Most chosen</Badge> : null}
                </div>
                <p className="font-sans text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
                  {tier.duration}
                </p>
                <p className="mt-1 font-serif text-3xl tabular-nums text-gold">
                  {formatMoney(tier.priceMinor, "NGN")}
                </p>
                <p className="font-sans text-sm text-muted-foreground">{tier.summary}</p>
              </div>

              <ul className="flex flex-col gap-2.5">
                {tier.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 font-sans text-sm text-bone/85">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" aria-hidden />
                    {item}
                  </li>
                ))}
                {tier.excludes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 font-sans text-sm text-bone/35">
                    <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href={`/consultations#book?tier=${tier.name.toLowerCase()}`}
                className={cn(
                  buttonClassName({ variant: tier.featured ? "default" : "outline" }),
                  "mt-auto w-full"
                )}
              >
                Apply for {tier.name}
              </Link>
            </li>
          ))}
        </ul>
      </PageBody>

      {/* Application trigger */}
      <PageBody id="apply" className="scroll-mt-header">
        <div className="flex flex-col gap-8 border border-gold/25 bg-gold/[0.04] p-8 lg:p-12">
          <div className="flex flex-col gap-4">
            <p className="eyebrow">Applications</p>
            <h2 className="max-w-[20ch] font-serif text-3xl leading-tight lg:text-4xl">
              The next intake closes at the end of the month.
            </h2>
            <p className="max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
              Six places, reviewed by the creative director and one senior designer. You will hear from
              us either way.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/consultations#book?tier=mentorship" className={buttonClassName({ size: "lg" })}>
              Start your application
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <Link href="/academy" className={buttonClassName({ size: "lg", variant: "outline" })}>
              Not ready — show me the courses
            </Link>
          </div>
        </div>
      </PageBody>
    </>
  );
}