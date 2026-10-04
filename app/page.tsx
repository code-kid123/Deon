import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  GraduationCap,
  MoveUpRight,
  Sparkles
} from "lucide-react";
import { buttonClassName } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/store/product-card";
import { Ticker } from "@/components/site/ticker";
import { OpenAiButton } from "@/components/ai/open-ai-button";
import { listProducts } from "@/lib/catalog/catalog-repository";
import { listCourses, formatDuration } from "@/lib/academy/academy-repository";
import { MOCK_EDITORIAL } from "@/lib/mock/catalog";
import { formatMoney } from "@/lib/money";
import { BRAND } from "@/lib/brand";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Both reads fall back to mock data when Supabase is unreachable, so the
  // homepage is always fully rendered on a fresh clone.
  const [{ products }, courses] = await Promise.all([
    listProducts({ sort: "newest" }),
    listCourses()
  ]);

  const featured = products.slice(0, 8);
  const hero = MOCK_EDITORIAL.hero;

  return (
    <>
      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative overflow-hidden" aria-labelledby="hero-heading">
        <div className="grid min-h-[calc(100dvh-6rem)] grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Copy */}
          <div className="relative flex flex-col justify-center px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
            <p className="eyebrow animate-fade-up">
              Ready-to-wear &middot; Academy &middot; Consultations
            </p>

            <h1
              id="hero-heading"
              className="mt-7 max-w-[14ch] font-serif text-display-md font-normal leading-[0.95] animate-fade-up"
              style={{ animationDelay: "80ms" }}
            >
              High Fashion
              <br />
              <span className="italic text-sheen">&amp;</span> Contemporary
              <br />
              Mastery
            </h1>

            <p
              className="mt-8 max-w-xl font-sans text-base leading-relaxed text-muted-foreground animate-fade-up"
              style={{ animationDelay: "160ms" }}
            >
              Crafted ready-to-wear collections, bespoke styling consultations, and accredited
              fashion education — built in Lagos, made to be kept.
            </p>

            <div
              className="mt-11 flex flex-wrap items-center gap-4 animate-fade-up"
              style={{ animationDelay: "240ms" }}
            >
              <Link href="#collection" className={buttonClassName({ size: "lg" })}>
                Explore Collection
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link
                href="/academy"
                className={buttonClassName({ size: "lg", variant: "outline" })}
              >
                Join the Academy
              </Link>
            </div>

            <dl
              className="mt-16 grid max-w-lg grid-cols-3 gap-6 border-t border-bone/10 pt-8 animate-fade-up"
              style={{ animationDelay: "320ms" }}
            >
              {[
                { value: "2019", label: "Founded" },
                { value: "04", label: "Collections" },
                { value: "1:1", label: "Mentorship" }
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <dt className="font-serif text-3xl leading-none text-bone">{stat.value}</dt>
                  <dd className="font-sans text-[0.625rem] uppercase tracking-[0.18em] text-muted-foreground">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Image wall */}
          <div className="relative grid grid-cols-4 grid-rows-6 gap-px bg-bone/[0.06]">
            {/* Primary portrait */}
            <figure className="relative col-span-4 row-span-4 overflow-hidden">
              {hero[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={hero[0].url}
                  alt={hero[0].alt}
                  className="h-full w-full object-cover"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/10 to-transparent" />
              <figcaption className="absolute bottom-6 left-6 font-sans text-[0.625rem] uppercase tracking-[0.2em] text-bone/50">
                {BRAND.atelier} &middot; Collection IV
              </figcaption>
            </figure>

            {/* Secondary detail crops */}
            {[hero[1], hero[2]].map((image, index) =>
              image ? (
                <figure
                  key={image.url}
                  className={`relative col-span-2 row-span-2 overflow-hidden ${
                    index === 0 ? "col-start-1" : "col-start-3"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="h-full w-full object-cover opacity-90 transition-transform duration-[900ms] ease-luxe hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir/60 to-transparent" />
                </figure>
              ) : null
            )}

            {/* Statement cell */}
            <div className="col-span-4 row-span-2 flex flex-col justify-center gap-2 bg-noir px-6 py-5 sm:px-8">
              <p className="font-sans text-[0.5625rem] uppercase tracking-[0.28em] text-gold">
                Small batch
              </p>
              <p className="max-w-[34ch] font-serif text-lg leading-snug text-bone/85 sm:text-xl">
                Fewer than 200 pieces per style. Restocked, never reproduced.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Ticker />

      {/* ─────────────────── Ready-to-wear showcase ─────────────────── */}
      <section
        id="collection"
        className="scroll-mt-header mx-auto w-full max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
        aria-labelledby="collection-heading"
      >
        <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <p className="eyebrow">Collection IV</p>
            <h2 id="collection-heading" className="max-w-[16ch] font-serif text-display-sm">
              Ready-to-wear, made to be <span className="italic text-gold">kept</span>.
            </h2>
          </div>
          <Link
            href="/shop"
            className="link-underline w-fit gap-2 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-gold"
          >
            Shop all {products.length} pieces
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </header>

        <div className="grid grid-cols-2 gap-x-5 gap-y-14 lg:grid-cols-4">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>

        {featured.length === 0 ? (
          <p className="py-20 text-center font-sans text-sm text-muted-foreground">
            The next collection is being photographed. Check back shortly.
          </p>
        ) : null}
      </section>

      {/* ───────────────────────── Academy bento ───────────────────────── */}
      <section
        id="academy"
        className="scroll-mt-header border-y border-bone/10 bg-noir"
        aria-labelledby="academy-heading"
      >
        <div className="mx-auto w-full max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <header className="mb-16 flex max-w-3xl flex-col gap-5">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-4 w-4 text-gold" strokeWidth={1.5} aria-hidden />
              <p className="eyebrow">The DEON Academy</p>
            </div>
            <h2 id="academy-heading" className="font-serif text-display-sm">
              Accredited fashion education, taught by the people who make it.
            </h2>
            <p className="max-w-2xl font-sans text-base leading-relaxed text-muted-foreground">
              Three flagship programmes, each ending where it should: inside a private community of
              people who are also doing the work.
            </p>
          </header>

          {/* Bento grid: first card spans two columns and carries the image. */}
          <ul className="grid grid-cols-1 gap-px bg-bone/[0.07] md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => {
              const featured = index === 0;
              return (
                <li
                  key={course.id}
                  className={featured ? "group relative md:col-span-2 lg:col-span-2" : "group relative"}
                >
                  <Link
                    href={`/academy/${course.slug}`}
                    className="flex h-full flex-col gap-6 bg-noir p-7 transition-colors duration-500 hover:bg-bone/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold lg:p-9"
                  >
                    {featured && course.coverImage ? (
                      <div className="relative aspect-[16/10] overflow-hidden bg-bone/[0.03]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={course.coverImage}
                          alt={course.title}
                          className="h-full w-full object-cover opacity-80 transition-all duration-[900ms] ease-luxe group-hover:scale-105 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-noir/80 to-transparent" />
                        <Badge variant="solid" className="absolute left-5 top-5">
                          Flagship
                        </Badge>
                      </div>
                    ) : null}

                    <div className="flex flex-1 flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="max-w-[20ch] font-serif text-xl leading-tight transition-colors group-hover:text-gold lg:text-2xl">
                          {course.title}
                        </h3>
                        <MoveUpRight
                          className="h-4 w-4 shrink-0 text-bone/25 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold"
                          strokeWidth={1.25}
                          aria-hidden
                        />
                      </div>

                      {course.subtitle ? (
                        <p className="font-sans text-sm text-muted-foreground">{course.subtitle}</p>
                      ) : null}

                      {/* Curriculum highlight badges */}
                      <ul className="flex flex-wrap gap-1.5">
                        <Badge variant="secondary">{course.moduleCount} modules</Badge>
                        <Badge variant="secondary">{course.lessonCount} lessons</Badge>
                        <Badge variant="secondary">{formatDuration(course.durationSeconds)}</Badge>
                        {course.tiers.slice(0, 2).map((tier) => (
                          <Badge key={tier.id} variant="outline">
                            {tier.name}
                          </Badge>
                        ))}
                      </ul>

                      {course.lowestPriceMinor !== null ? (
                        <p className="mt-auto pt-4 font-sans text-sm">
                          <span className="text-muted-foreground">From </span>
                          <span className="font-medium text-gold">
                            {formatMoney(course.lowestPriceMinor, course.currency)}
                          </span>
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Value proposition callout */}
          <div className="mt-12 flex flex-col gap-6 border border-gold/25 bg-gold/[0.04] p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
            <div className="flex items-start gap-4">
              <Sparkles className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden />
              <p className="max-w-2xl font-serif text-2xl leading-snug lg:text-3xl">
                Instant Telegram community access &amp; direct designer mentorship upon enrolment.
              </p>
            </div>
            <Link
              href="/academy"
              className={buttonClassName({ variant: "outline", size: "lg" })}
            >
              Browse the academy
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────── Mentorship & consultations split ─────────────── */}
      <section
        id="consultations"
        className="scroll-mt-header mx-auto w-full max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
        aria-labelledby="services-heading"
      >
        <h2 id="services-heading" className="sr-only">
          Mentorship and private consultations
        </h2>

        <div className="grid gap-px bg-bone/[0.07] lg:grid-cols-2">
          {/* Mentorship */}
          <article className="group relative flex flex-col overflow-hidden bg-noir">
            <div className="relative aspect-[16/10] overflow-hidden">
              {MOCK_EDITORIAL.mentorship ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={MOCK_EDITORIAL.mentorship.url}
                  alt={MOCK_EDITORIAL.mentorship.alt}
                  className="h-full w-full object-cover opacity-70 transition-all duration-[900ms] ease-luxe group-hover:scale-105 group-hover:opacity-85"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/40 to-transparent" />
            </div>

            <div className="flex flex-1 flex-col gap-6 p-8 lg:p-10">
              <Badge variant="outline">For designers</Badge>
              <h3 className="max-w-[16ch] font-serif text-3xl leading-tight lg:text-4xl">
                Mentorship for people building an actual label.
              </h3>
              <p className="max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
                A bounded programme with real expectations. Apply with your experience, portfolio and
                goals — we review, then you either activate a tier or get a clear answer with notes.
                We would rather say no than take your money quietly.
              </p>

              <ul className="flex flex-col gap-2.5">
                {[
                  "Direct critique from the creative director",
                  "Production, pricing and wholesale strategy",
                  "Portfolio and lookbook review",
                  "Clear go / no-go at the end of each cycle"
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 font-sans text-sm text-bone/80">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap gap-3 pt-4">
                <Link href="/mentorship" className={buttonClassName()}>
                  Apply for mentorship
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
                <Link href="/mentorship" className={buttonClassName({ variant: "ghost" })}>
                  See tiers
                </Link>
              </div>
            </div>
          </article>

          {/* Consultations */}
          <article className="group relative flex flex-col overflow-hidden bg-noir">
            <div className="relative aspect-[16/10] overflow-hidden">
              {MOCK_EDITORIAL.consultations ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={MOCK_EDITORIAL.consultations.url}
                  alt={MOCK_EDITORIAL.consultations.alt}
                  className="h-full w-full object-cover opacity-70 transition-all duration-[900ms] ease-luxe group-hover:scale-105 group-hover:opacity-85"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/40 to-transparent" />
            </div>

            <div className="flex flex-1 flex-col gap-6 p-8 lg:p-10">
              <Badge variant="outline">Private</Badge>
              <h3 className="max-w-[16ch] font-serif text-3xl leading-tight lg:text-4xl">
                One-to-one styling, booked against a real calendar.
              </h3>
              <p className="max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
                Sixty to ninety minutes with a stylist, over video or at the Lagos atelier. You leave
                with a written summary and outfit formulas you will actually use.
              </p>

              <ul className="grid gap-2.5 sm:grid-cols-2">
                {[
                  ["Signature session", "60 min · ₦120,000"],
                  ["Wardrobe architecture", "90 min · ₦180,000"],
                  ["Atelier visit", "Lagos · from ₦250,000"],
                  ["Group critique", "Monthly · free on tier 2"]
                ].map(([label, meta]) => (
                  <li
                    key={label}
                    className="flex flex-col gap-1 border border-bone/10 px-4 py-3 transition-colors hover:border-gold/30"
                  >
                    <span className="font-sans text-sm">{label}</span>
                    <span className="font-sans text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                      {meta}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap gap-3 pt-4">
                <Link href="/consultations#book" className={buttonClassName()}>
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                  Book a session
                </Link>
                <Link href="/consultations" className={buttonClassName({ variant: "ghost" })}>
                  What to expect
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ───────────────────────── AI stylist anchor ───────────────────────── */}
      <section
        id="ai-stylist"
        className="scroll-mt-header relative overflow-hidden border-y border-bone/10 bg-noir"
        aria-labelledby="ai-heading"
      >
        <div className="grain absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto flex w-full max-w-[1400px] flex-col items-center px-5 py-24 text-center sm:px-8 lg:px-12 lg:py-32">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 text-gold">
            <Sparkles className="h-6 w-6" strokeWidth={1.25} aria-hidden />
          </span>

          <h2 id="ai-heading" className="mt-8 max-w-[18ch] font-serif text-display-sm">
            A stylist in your pocket, at <span className="italic text-gold">any hour</span>.
          </h2>

          <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted-foreground">
            Ask DEON AI for styling tips, sizing help, course detail or what to book. Trained on the
            house collection and the academy curriculum — not on generic fashion advice.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <OpenAiButton />
            <Link href="/consultations" className={buttonClassName({ size: "lg", variant: "outline" })}>
              Prefer a human stylist?
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}