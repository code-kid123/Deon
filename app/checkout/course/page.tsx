import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/academy/academy-repository";
import { CourseCheckoutForm } from "@/components/academy/course-checkout-form";
import { buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Enrol",
  robots: { index: false, follow: false }
};

type SearchParams = Promise<{ course?: string; tier?: string }>;

export default async function CourseCheckoutPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const { course: courseSlug, tier: tierId } = await searchParams;

  if (!courseSlug || !tierId) {
    return (
      <Frame eyebrow="Academy" title="Choose a tier">
        <p className="font-sans text-sm leading-relaxed text-muted-foreground">
          No course or tier was selected. Pick a tier from the course page to continue — every tier
          carries the full curriculum, and community access is granted the moment payment clears.
        </p>
        <Link href="/academy" className={cn(buttonClassName(), "mt-8")}>
          Browse courses
        </Link>
      </Frame>
    );
  }

  const course = await getCourseBySlug(courseSlug);

  if (!course) notFound();

  const tier = course.tiers.find((t) => t.id === tierId);

  if (!tier) {
    return (
      <Frame eyebrow="Academy" title="That tier is no longer available">
        <p className="font-sans text-sm leading-relaxed text-muted-foreground">
          The tier you selected is no longer on sale for {course.title}. Availability changes as each
          cohort fills.
        </p>
        <Link href={`/academy/${course.slug}`} className={cn(buttonClassName(), "mt-8")}>
          Back to {course.title}
        </Link>
      </Frame>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8 lg:py-20">
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex items-center gap-2 font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground"
      >
        <Link href="/academy" className="transition-colors hover:text-gold">
          Academy
        </Link>
        <span aria-hidden className="text-bone/20">
          /
        </span>
        <Link href={`/academy/${course.slug}`} className="transition-colors hover:text-gold">
          {course.title}
        </Link>
        <span aria-hidden className="text-bone/20">
          /
        </span>
        <span className="text-bone">Enrol</span>
      </nav>

      <header className="mb-12 flex flex-col gap-4">
        <p className="eyebrow">Secure enrolment</p>
        <h1 className="font-serif text-4xl leading-[1.05] sm:text-5xl">Enrol in {course.title}</h1>
        <p className="max-w-xl font-sans text-sm leading-relaxed text-muted-foreground">
          Your Telegram community invite is generated automatically once payment clears — it admits one
          person and expires in 24 hours.
        </p>
      </header>

      <CourseCheckoutForm
        courseSlug={course.slug}
        courseTitle={course.title}
        tierId={tier.id}
        tierName={tier.name}
        priceMinor={tier.priceMinor}
        currency={course.currency}
        tierFeatures={tier.features}
      />
    </div>
  );
}

function Frame({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8 lg:py-28">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mb-4 mt-3 font-serif text-4xl leading-[1.05] sm:text-5xl">{title}</h1>
      {children}
    </div>
  );
}