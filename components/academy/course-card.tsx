import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDuration, type CourseSummary } from "@/lib/academy/academy-repository";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

/**
 * Bento course card. `feature` renders the larger, image-led variant used for the
 * first card in the grid.
 */
export function CourseCard({
  course,
  feature = false
}: {
  course: CourseSummary;
  feature?: boolean;
}) {
  return (
    <article className={cn("group relative flex h-full", feature && "lg:col-span-2")}>
      <Link
        href={`/academy/${course.slug}`}
        className={cn(
          "relative flex w-full flex-col overflow-hidden border border-bone/10 bg-noir transition-all duration-500 ease-luxe",
          "hover:border-gold/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
          feature ? "flex-row lg:min-h-[26rem]" : "flex-row"
        )}
      >
        {/* Image panel */}
        <div
          className={cn(
            "relative overflow-hidden bg-noir",
            feature ? "w-full shrink-0 lg:w-1/2" : "w-2/5 shrink-0"
          )}
        >
          <div className={cn("relative h-full w-full", feature ? "aspect-[16/10] lg:aspect-auto" : "aspect-[3/4]")}>
            {course.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={course.coverImage}
                alt={course.title}
                loading="lazy"
                className="h-full w-full object-cover opacity-75 transition-all duration-[900ms] ease-luxe group-hover:scale-105 group-hover:opacity-95"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-serif text-[0.625rem] uppercase tracking-[0.3em] text-bone/20">
                DEON Academy
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/25 to-transparent" />
          </div>

          {course.featured ? (
            <div className="absolute left-4 top-4 flex gap-1.5">
              <Badge variant="solid">Flagship</Badge>
            </div>
          ) : null}
        </div>

        {/* Content panel */}
        <div className={cn("flex flex-1 flex-col gap-4 p-6 lg:p-8", feature && "lg:justify-center lg:p-10")}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h3
                className={cn(
                  "max-w-[22ch] font-serif leading-tight transition-colors duration-300 group-hover:text-gold",
                  feature ? "text-2xl lg:text-3xl" : "text-lg lg:text-xl"
                )}
              >
                {course.title}
              </h3>
              {course.subtitle ? (
                <p className="max-w-[34ch] font-sans text-sm text-muted-foreground">
                  {course.subtitle}
                </p>
              ) : null}
            </div>
            <ArrowUpRight
              className="h-4 w-4 shrink-0 text-bone/25 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold"
              strokeWidth={1.25}
              aria-hidden
            />
          </div>

          <ul className="flex flex-wrap gap-1.5">
            <Badge variant="secondary">{course.moduleCount} modules</Badge>
            <Badge variant="secondary">{course.lessonCount} lessons</Badge>
            <Badge variant="secondary">{formatDuration(course.durationSeconds)}</Badge>
          </ul>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
            {course.lowestPriceMinor !== null ? (
              <p className="font-sans text-sm">
                <span className="text-muted-foreground">From </span>
                <span className="font-medium text-gold">
                  {formatMoney(course.lowestPriceMinor, course.currency)}
                </span>
              </p>
            ) : (
              <p className="font-sans text-[0.625rem] uppercase tracking-[0.18em] text-muted-foreground">
                Enrolment closed
              </p>
            )}

            <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-bone/70 transition-colors group-hover:text-gold">
              {course.tiers.length} {course.tiers.length === 1 ? "tier" : "tiers"}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}