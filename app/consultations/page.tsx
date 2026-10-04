import type { Metadata } from "next";
import { ArrowUpRight, Check, Clock, Sparkles } from "lucide-react";
import { PageBody, PageHero } from "@/components/site/page-hero";
import { CalendlyEmbed } from "@/components/consultations/calendly-embed";
import { Badge } from "@/components/ui/badge";
import { buttonClassName } from "@/components/ui/button";
import { MOCK_EDITORIAL } from "@/lib/mock/catalog";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Style consultations",
  description:
    "One-to-one styling with the DEON studio — wardrobe audits, capsule architecture and private studio visits in Lagos. Book against a real calendar."
};

const SERVICES = [
  {
    name: "Signature session",
    duration: "60 min",
    price: "₦120,000",
    summary:
      "A deep-dive on one occasion or a full wardrobe reset, over video with a shared look board.",
    includes: [
      "Pre-session style profile and reference brief",
      "Live video call with a stylist",
      "Written summary with outfit formulas",
      "Two weeks of follow-up on WhatsApp"
    ]
  },
  {
    name: "Wardrobe architecture",
    duration: "90 min",
    price: "₦180,000",
    summary:
      "For clients building a capsule from scratch, or untangling a closet that stopped working.",
    includes: [
      "Everything in the signature session",
      "Capsule plan mapped to your real life and budget",
      "Shop-by-shop list with alternates",
      "Recorded walkthrough of key pieces"
    ]
  },
  {
    name: "Atelier visit",
    duration: "In person",
    price: "From ₦250,000",
    summary:
      "A studio appointment in Lagos with fittings, fabric conversation and a look built on your body.",
    includes: [
      "Private studio time and refreshments",
      "Fit assessment across three looks",
      "Alteration and tailoring plan",
      "Priority follow-up for three months"
    ]
  }
];

const PREP = [
  "Photographs of a few outfits you currently love and a few you never wear",
  "Your rough measurements, or a tape if you have one",
    "A sentence on what is actually bothering you — fit, colour, or nothing to wear"
];

export default function ConsultationsPage() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL ?? null;

  return (
    <>
      <PageHero
        eyebrow="Consultations"
        title="One-to-one, with a real stylist."
        standfirst="Booking a session is the fastest way to get unstuck. Choose the format that fits the problem, then pick a time — you get a calendar invite and a preparation note immediately."
        breadcrumb={[{ href: "/", label: "Home" }, { href: "/consultations", label: "Consultations" }]}
      />

      {/* Service tiers */}
      <PageBody>
        <ul className="grid gap-px bg-bone/[0.07] md:grid-cols-3">
          {SERVICES.map((service, index) => (
            <li key={service.name} className="flex flex-col gap-6 bg-noir p-8 lg:p-9">
              <div className="flex items-start justify-between gap-3">
                <span className="font-serif text-2xl tabular-nums text-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Badge variant="outline" className="gap-1.5">
                  <Clock className="h-3 w-3" aria-hidden />
                  {service.duration}
                </Badge>
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="font-serif text-2xl leading-tight">{service.name}</h2>
                <p className="font-serif text-xl text-gold">{service.price}</p>
                <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                  {service.summary}
                </p>
              </div>

              <ul className="flex flex-1 flex-col gap-2.5">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 font-sans text-sm text-bone/85">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>

              <a href="#book" className={cn(buttonClassName({ variant: "outline" }), "w-full")}>
                Book this
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          * Every session includes complimentary alterations on any ready-to-wear you order afterwards.
          Prices are in NGN; the USD view in the header is indicative.
        </p>
      </PageBody>

      {/* Booking */}
      <section id="book" className="scroll-mt-header border-y border-bone/10 bg-noir">
        <div className="mx-auto w-full max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <div className="flex flex-col gap-7">
              <div className="flex flex-col gap-4">
                <p className="eyebrow">Book a session</p>
                <h2 className="max-w-[16ch] font-serif text-display-sm">
                  Pick a <span className="italic text-gold">real</span> time.
                </h2>
                <p className="max-w-lg font-sans text-sm leading-relaxed text-muted-foreground">
                  Times are shown in your local timezone. Every booking is confirmed automatically and
                  logged to your record, so follow-ups never fall through the cracks.
                </p>
              </div>

              <div className="flex flex-col gap-4 border border-bone/12 p-6">
                <p className="eyebrow">Bring with you</p>
                <ul className="flex flex-col gap-2.5">
                  {PREP.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 font-sans text-sm leading-relaxed text-bone/80"
                    >
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <figure className="relative aspect-[4/3] overflow-hidden">
                {MOCK_EDITORIAL.consultations ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={MOCK_EDITORIAL.consultations.url}
                    alt={MOCK_EDITORIAL.consultations.alt}
                    className="h-full w-full object-cover"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-noir/70 to-transparent" />
              </figure>
            </div>

            <div className="lg:pt-2">
              <CalendlyEmbed url={calendlyUrl} bookingType="STYLE_CONSULTATION" />
            </div>
          </div>
        </div>
      </section>

      {/* Group critique CTA */}
      <PageBody>
        <div className="flex flex-col items-center gap-6 border border-gold/25 bg-gold/[0.04] p-10 text-center lg:p-14">
          <Sparkles className="h-6 w-6 text-gold" strokeWidth={1.25} aria-hidden />
          <h2 className="max-w-[22ch] font-serif text-3xl leading-tight lg:text-4xl">
            Group critique is free on every academy tier.
          </h2>
          <p className="max-w-xl font-sans text-sm leading-relaxed text-muted-foreground">
            Monthly open crit for anyone enrolled in a course or mentorship tier. Bring a look, a
            pattern or a pricing problem and get it torn apart kindly by people who sew.
          </p>
          <a href="/academy" className={buttonClassName({ size: "lg" })}>
            Enrol to join
          </a>
        </div>
      </PageBody>
    </>
  );
}