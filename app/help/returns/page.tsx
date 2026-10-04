import type { Metadata } from "next";
import Link from "next/link";
import { PageBody, PageHero } from "@/components/site/page-hero";
import { buttonClassName } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Returns & alterations",
  description:
    "DEON's alteration policy, returns window and what happens to made-to-measure pieces."
};

const ALTERATIONS = [
  "Complimentary for life on every ready-to-wear piece, regardless of when you bought it.",
  "Bring the garment to the atelier in Lagos. Remote clients can send it to a tailor we trust — we will coordinate.",
  "Typical turnaround is 5–7 working days; a second fitting is included if needed.",
  "We can take in, let out, shorten and re-hem. We cannot change a shoulder line on a structured piece."
];

const RETURNS = [
  "14 calendar days from delivery for ready-to-wear, unworn with tags attached.",
  "Sale items are returnable on the same terms, but are not exchangeable for a different size if the run is archived.",
  "Made-to-measure is final sale once the first fitting is approved — the fit has already been agreed with you.",
  "Refunds go back to the original payment method within 5–10 working days of the piece reaching us."
];

export default function ReturnsPage() {
  return (
    <>
      <PageHero
        eyebrow="Client care"
        title="Returns & alterations"
        standfirst="We make clothes to be kept, not returned. That said — if something is wrong, we would much rather fix it than argue about it."
        breadcrumb={[{ href: "/", label: "Home" }, { href: "/help/returns", label: "Returns" }]}
      />

      <PageBody>
        <div className="grid gap-12 lg:grid-cols-2">
          <section className="flex flex-col gap-5">
            <h2 className="font-serif text-3xl">Alterations</h2>
            <ul className="flex flex-col gap-3">
              {ALTERATIONS.map((item) => (
                <li key={item} className="flex items-start gap-3 font-sans text-sm leading-relaxed text-bone/80">
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-sans text-sm leading-relaxed text-muted-foreground">
              Not sure what you need? Book a consultation and we will tell you honestly — including when
              the fit is already right.
            </p>
            <Link href="/consultations#book" className={cn(buttonClassName(), "w-fit")}>
              Book a fitting
            </Link>
          </section>

          <section className="flex flex-col gap-5">
            <h2 className="font-serif text-3xl">Returns</h2>
            <ul className="flex flex-col gap-3">
              {RETURNS.map((item) => (
                <li key={item} className="flex items-start gap-3 font-sans text-sm leading-relaxed text-bone/80">
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-sans text-sm leading-relaxed text-muted-foreground">
              Anything else — email{" "}
              <a href={`mailto:${BRAND.email}`} className="link-underline text-gold">
                {BRAND.email}
              </a>{" "}
              with your order reference and we will answer within one working day.
            </p>
          </section>
        </div>
      </PageBody>
    </>
  );
}