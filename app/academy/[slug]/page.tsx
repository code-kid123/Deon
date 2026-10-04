import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Check, ChevronDown, PlayCircle, Sparkles } from "lucide-react";
import { getCourseBySlug, formatDuration, formatLessonDuration } from "@/lib/academy/academy-repository";
import { formatMoney } from "@/lib/money";
import { Badge } from "@/components/ui/badge";
import { buttonClassName } from "@/components/ui/button";
import { PageBody } from "@/components/site/page-hero";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course not found" };

  return {
    title: course.title,
    description: course.subtitle ?? course.description ?? undefined
  };
}

export default async function CoursePage({ params }: { params: Params }) {
  const { slug } = await params;
  // Falls back to the mock catalogue when Supabase is unreachable.
  const course = await getCourseBySlug(slug);

  if (!course) notFound();

  const purchasable = course.tiers.filter((tier) => tier.priceMinor >= 0);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
      <nav aria-label="Breadcrumb" className="mb-10">
        <ol className="flex flex-wrap items-center gap-2 font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
          <li>
            <Link href="/" className="transition-colors hover:text-gold">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/academy" className="transition-colors hover:text-gold">
              Academy
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-bone/70">{course.title}</li>
        </ol>
      </nav>

      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="flex flex-col gap-12">
          <header className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              {course.featured ? <Badge variant="solid">Flagship</Badge> : null}
              <Badge variant="secondary">{course.moduleCount} modules</Badge>
              <Badge variant="secondary">{course.lessonCount} lessons</Badge>
              <Badge variant="secondary">{formatDuration(course.durationSeconds)}</Badge>
            </div>

            <h1 className="max-w-[16ch] font-serif text-display-sm">{course.title}</h1>

            {course.subtitle ? (
              <p className="max-w-2xl font-serif text-xl italic leading-snug text-gold">
                {course.subtitle}
              </p>
            ) : null}
          </header>

          {course.coverImage ? (
            <figure className="relative aspect-[16/9] overflow-hidden bg-bone/[0.03]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={course.coverImage} alt={course.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-noir/60 to-transparent" />
            </figure>
          ) : null}

          {course.description ? (
            <section className="flex flex-col gap-4">
              <h2 className="eyebrow">About this course</h2>
              <p className="max-w-2xl whitespace-pre-line font-sans text-sm leading-relaxed text-muted-foreground">
                {course.description}
              </p>
            </section>
          ) : null}

          <section className="flex flex-col gap-5">
            <h2 className="eyebrow">Curriculum</h2>

            {course.modules.length === 0 ? (
              <p className="font-sans text-sm text-muted-foreground">
                The curriculum for this course is being finalised.
              </p>
            ) : (
              <ol className="flex flex-col gap-2.5">
                {course.modules.map((module, moduleIndex) => (
                  <li key={module.id} className="border border-bone/10">
                    <details className="group" open={moduleIndex === 0}>
                      <summary className="flex cursor-pointer list-none items-center gap-4 p-5 font-sans focus-visible:outline-none">
                        <span className="font-serif text-lg tabular-nums text-gold">
                          {String(moduleIndex + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 font-medium">{module.title}</span>
                        <span className="font-sans text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                          {module.lessons.length} lessons
                        </span>
                        <ChevronDown
                          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180"
                          aria-hidden
                        />
                      </summary>

                      <ul className="border-t border-bone/10">
                        {module.lessons.map((lesson) => (
                          <li
                            key={lesson.id}
                            className="flex items-center gap-3 border-b border-bone/[0.06] px-5 py-3.5 last:border-b-0"
                          >
                            <PlayCircle
                              className="h-4 w-4 shrink-0 text-muted-foreground"
                              strokeWidth={1.25}
                              aria-hidden
                            />
                            <span className="flex-1 font-sans text-sm">{lesson.title}</span>
                            {lesson.isPreview ? <Badge variant="outline">Preview</Badge> : null}
                            <span className="font-sans text-xs tabular-nums text-muted-foreground">
                              {formatLessonDuration(lesson.durationSeconds)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        {/* Tier sidebar */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-bone/10 bg-noir p-7">
            <h2 className="font-serif text-xl">Choose your tier</h2>
            <p className="mt-2 font-sans text-xs leading-relaxed text-muted-foreground">
              The full curriculum in every tier. What changes is access and support.
            </p>

            {purchasable.length === 0 ? (
              <p className="mt-6 font-sans text-sm text-muted-foreground">
                Enrolment for this course is currently closed.
              </p>
            ) : (
              <ul className="mt-6 flex flex-col gap-3">
                {purchasable.map((tier, index) => (
                  <li key={tier.id}>
                    <Link
                      href={`/checkout/course?course=${course.slug}&tier=${tier.id}`}
                      className="group flex flex-col gap-3 border border-bone/12 p-5 transition-all duration-400 hover:border-gold/45 hover:bg-gold/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-medium">{tier.name}</span>
                        <span className="font-serif text-lg tabular-nums text-gold">
                          {tier.priceMinor === 0
                            ? "Free"
                            : formatMoney(tier.priceMinor, course.currency)}
                        </span>
                      </div>

                      {tier.features.length > 0 ? (
                        <ul className="flex flex-col gap-2">
                          {tier.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex gap-2 font-sans text-xs leading-relaxed text-muted-foreground"
                            >
                              <Check className="mt-0.5 h-3 w-3 shrink-0 text-gold" aria-hidden />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      <span className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-bone/60 transition-colors group-hover:text-gold">
                        Enrol with {tier.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 flex items-start gap-2.5 border-t border-bone/10 pt-5">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden />
              <p className="font-sans text-[0.6875rem] leading-relaxed text-muted-foreground">
                On payment you receive a single-use, private Telegram invite. It expires in 24 hours and
                admits one person — please do not share it.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <PageBody className="max-w-none px-0 pt-20">
        <div className="flex flex-col items-center gap-6 border border-bone/10 px-8 py-12 text-center">
          <h2 className="max-w-[24ch] font-serif text-2xl leading-tight">
            Not sure which tier fits how you learn?
          </h2>
          <p className="max-w-lg font-sans text-sm text-muted-foreground">
            Tell us your goals in a short call and we will point you at the right one — including telling
            you when the cheaper tier is genuinely enough.
          </p>
          <Link href="/consultations#book" className={buttonClassName()}>
            Book a 15-minute call
          </Link>
        </div>
      </PageBody>
    </div>
  );
}