import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageBody, PageHero } from "@/components/site/page-hero";
import { buttonClassName } from "@/components/ui/button";
import { MOCK_EDITORIAL } from "@/lib/mock/catalog";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About",
  description:
    "DEON is a luxury ready-to-wear house and fashion academy built in Lagos — small batches, real finishing, and education taught by working designers."
};

const PILLARS = [
  {
    title: "Small batch, always",
    body: "Fewer than 200 pieces per style. When a run sells out it is archived, not reproduced. Scarcity here is a consequence of how we make, not a marketing device."
  },
  {
    title: "Finished by hand",
    body: "Pick-stitched lapels, hand-rolled hems, saddle-stitched leather. The hours that do not photograph are the ones that make a garment worth keeping."
  },
  {
    title: "Taught, not sold",
    body: "Every course is built from what we actually do in the atelier. If a technique does not survive contact with a real production run, it does not make it into the curriculum."
  },
  {
    title: "One studio floor",
    body: "Collection, academy and consultations share the same people and the same room. What you learn is what you can see being made the same week."
  }
];

const TIMELINE = [
  { year: "2019", event: "Founded as a two-person atelier in Ikoyi, cutting only for private clients." },
  { year: "2021", event: "First ready-to-wear collection. 60 pieces, four styles, sold entirely to friends and family." },
  { year: "2023", event: "The DEON Academy launches with Ready-to-Wear Design Foundations." },
  { year: "2025", event: "Collection IV, the full course catalogue, and the private Telegram community." }
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="The house"
        title="We make slowly, and we teach what we learn making it."
        standfirst="DEON is a ready-to-wear house, an academy and a styling studio sharing one atelier in Lagos. Same hands, same floor, same standards — whether a piece is for you or for a student."
      >
        <Link href="/shop" className={buttonClassName({ size: "lg" })}>
          Explore the collection
        </Link>
        <Link href="/academy" className={buttonClassName({ size: "lg", variant: "outline" })}>
          Join the academy
        </Link>
      </PageHero>

      {/* Atelier image */}
      <section className="border-b border-bone/10">
        <div className="mx-auto w-full max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12">
          <figure className="relative aspect-[21/9] overflow-hidden bg-noir">
            {MOCK_EDITORIAL.atelier ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={MOCK_EDITORIAL.atelier.url}
                alt={MOCK_EDITORIAL.atelier.alt}
                className="h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-noir/70 via-transparent to-transparent" />
            <figcaption className="absolute bottom-6 left-6 font-sans text-[0.625rem] uppercase tracking-[0.2em] text-bone/60">
              The atelier floor — {BRAND.atelier}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Pillars */}
      <PageBody>
        <div className="grid gap-px bg-bone/[0.07] md:grid-cols-2">
          {PILLARS.map((pillar, index) => (
            <article key={pillar.title} className="flex flex-col gap-4 bg-noir p-8 lg:p-10">
              <span className="font-sans text-[0.625rem] tabular-nums tracking-widest text-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="max-w-[16ch] font-serif text-2xl leading-tight lg:text-3xl">
                {pillar.title}
              </h2>
              <p className="max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
                {pillar.body}
              </p>
            </article>
          ))}
        </div>
      </PageBody>

      {/* Timeline */}
      <PageBody className="border-t border-bone/10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
          <div className="flex flex-col gap-4">
            <p className="eyebrow">Since {BRAND.founded}</p>
            <h2 className="max-w-[14ch] font-serif text-3xl leading-tight lg:text-4xl">
              How we got here.
            </h2>
          </div>

          <ol className="flex flex-col">
            {TIMELINE.map((entry) => (
              <li
                key={entry.year}
                className="grid grid-cols-[5rem_1fr] gap-6 border-t border-bone/10 py-6 first:border-t-0 first:pt-0"
              >
                <span className="font-serif text-xl text-gold">{entry.year}</span>
                <p className="font-sans text-sm leading-relaxed text-bone/75">{entry.event}</p>
              </li>
            ))}
          </ol>
        </div>
      </PageBody>

      {/* CTA */}
      <PageBody className="border-t border-bone/10">
        <div className="flex flex-col items-center gap-7 border border-gold/25 bg-gold/[0.04] px-8 py-14 text-center">
          <h2 className="max-w-[20ch] font-serif text-3xl leading-tight lg:text-4xl">
            Come and see how it is actually made.
          </h2>
          <p className="max-w-xl font-sans text-sm leading-relaxed text-muted-foreground">
            Book a session in the studio, or start with a course and work up to a fitting. Either way
            you end up on the same floor.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/consultations#book" className={buttonClassName({ size: "lg" })}>
              Book a studio session
            </Link>
            <Link
              href="/academy"
              className={buttonClassName({ size: "lg", variant: "outline" })}
            >
              See the courses
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </PageBody>
    </>
  );
}