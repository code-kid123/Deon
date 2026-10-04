import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { PageBody, PageHero } from "@/components/site/page-hero";
import { CourseCard } from "@/components/academy/course-card";
import { buttonClassName } from "@/components/ui/button";
import { listCourses } from "@/lib/academy/academy-repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Academy",
  description:
    "Fashion courses from working designers — ready-to-wear design, personal styling and building a label. Tiered access and instant private community entry."
};

export default async function AcademyPage() {
  // Falls back to the mock catalogue when Supabase is unreachable.
  const courses = await listCourses();

  return (
    <>
      <PageHero
        eyebrow="The DEON Academy"
        title="Learn the craft, not just the trend."
        standfirst="Every course ends where it should: inside a private community with people who are also doing the work. Same curriculum in every tier — what changes is how much access and support you get."
        breadcrumb={[{ href: "/", label: "Home" }, { href: "/academy", label: "Academy" }]}
      >
        <Link href="/consultations#book" className={buttonClassName({ size: "lg" })}>
          Talk to a stylist
        </Link>
        <Link href="/mentorship" className={buttonClassName({ size: "lg", variant: "outline" })}>
          Mentorship programme
        </Link>
      </PageHero>

      <PageBody>
        {courses.length === 0 ? (
          <div className="border border-dashed border-bone/15 px-8 py-24 text-center">
            <h2 className="font-serif text-2xl">No courses published yet</h2>
            <p className="mx-auto mt-3 max-w-md font-sans text-sm text-muted-foreground">
              The next intake opens soon. Join the private list in the footer and you will hear first.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {courses.map((course, index) => (
              <CourseCard key={course.id} course={course} feature={index === 0} />
            ))}
          </div>
        )}

        {/* Community + mentorship callout */}
        <div className="mt-16 flex flex-col gap-7 border border-gold/25 bg-gold/[0.04] p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
          <div className="flex items-start gap-4">
            <Sparkles className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden />
            <div className="flex flex-col gap-2">
              <p className="font-serif text-2xl leading-snug lg:text-3xl">
                Instant Telegram community access on every enrolment.
              </p>
              <p className="max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
                A single-use invite, issued the moment your payment clears. Critique requests, restock
                notice and studio drops happen there first — and the mentorship tier adds direct time
                with the creative director on top.
              </p>
            </div>
          </div>
          <Link href="/mentorship" className={buttonClassName({ variant: "outline", size: "lg" })}>
            Compare tiers
          </Link>
        </div>
      </PageBody>
    </>
  );
}