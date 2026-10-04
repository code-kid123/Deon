import type { Metadata } from "next";
import Link from "next/link";
import { PageBody, PageHero } from "@/components/site/page-hero";
import { buttonClassName } from "@/components/ui/button";
import { SIZE_GROUPS, type SizeRow } from "@/lib/catalog/size-guide";

export const metadata: Metadata = {
  title: "Size guide",
  description:
    "DEON's house block: garment measurements by size, how to measure yourself, and UK/US/EU equivalents."
};

const HOW_TO_MEASURE = [
  {
    step: "01",
    title: "Bust and underbust",
    body: "Measure around the fullest part of your bust, keeping the tape level all the way round and not pulled tight. The underbust is taken directly beneath the bust line, snug."
  },
  {
    step: "02",
    title: "Waist",
    body: "Measure at your natural waist — the narrowest point above the hip bone, usually just above the navel. Breathe out normally, do not suck in."
  },
  {
    step: "03",
    title: "Hip",
    body: "Stand with feet together and measure around the fullest point of your seat, roughly 20cm below the natural waist. Keep the tape level."
  },
  {
    step: "04",
    title: "Shoulder and sleeve",
    body: "Shoulder is measured across the back, seam to seam where the sleeve joins. For sleeve, bend your elbow slightly and measure shoulder to just past the wrist bone."
  }
];

function SizeTable({ rows }: { rows: SizeRow[] }) {
  const isFootwear = rows[0]?.bust === "—";

  return (
    <div className="overflow-x-auto border border-bone/10">
      <table className="w-full min-w-[40rem] border-collapse">
        <thead>
          <tr className="border-b border-bone/10">
            <th
              scope="col"
              className="p-4 text-left font-sans text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              DEON
            </th>
            <th
              scope="col"
              className="p-4 text-center font-sans text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              UK
            </th>
            <th
              scope="col"
              className="p-4 text-center font-sans text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              US
            </th>
            <th
              scope="col"
              className="p-4 text-center font-sans text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              EU
            </th>
            {!isFootwear ? (
              <>
                <th
                  scope="col"
                  className="p-4 text-center font-sans text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-gold"
                >
                  Bust
                </th>
                <th
                  scope="col"
                  className="p-4 text-center font-sans text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-gold"
                >
                  Waist
                </th>
                <th
                  scope="col"
                  className="p-4 text-center font-sans text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-gold"
                >
                  Hip
                </th>
              </>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.size} className="border-b border-bone/[0.06] last:border-b-0">
              <th scope="row" className="p-4 text-left font-serif text-base font-normal text-bone">
                {row.size}
              </th>
              <td className="p-4 text-center font-sans text-sm tabular-nums text-bone/70">{row.uk}</td>
              <td className="p-4 text-center font-sans text-sm tabular-nums text-bone/70">{row.us}</td>
              <td className="p-4 text-center font-sans text-sm tabular-nums text-bone/70">{row.eu}</td>
              {!isFootwear ? (
                <>
                  <td className="p-4 text-center font-sans text-sm tabular-nums text-bone/75">
                    {row.bust}
                  </td>
                  <td className="p-4 text-center font-sans text-sm tabular-nums text-bone/75">
                    {row.waist}
                  </td>
                  <td className="p-4 text-center font-sans text-sm tabular-nums text-bone/75">{row.hip}</td>
                </>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SizeGuidePage() {
  return (
    <>
      <PageHero
        eyebrow="Client care"
        title="Size guide"
        standfirst="Our house block runs close through the shoulder with room through the hip. Between sizes, take the larger one — and remember every ready-to-wear piece includes complimentary alterations for life."
        breadcrumb={[
          { href: "/", label: "Home" },
          { href: "/shop", label: "Collection" },
          { href: "/shop/size-guide", label: "Size guide" }
        ]}
      >
        <Link href="/shop" className={buttonClassName({ size: "lg", variant: "outline" })}>
          Back to the collection
        </Link>
        <Link href="/consultations#book" className={buttonClassName({ size: "lg" })}>
          Get measured with a stylist
        </Link>
      </PageHero>

      <PageBody>
        <div className="flex flex-col gap-20">
          {SIZE_GROUPS.map((group) => (
            <section key={group.id} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="font-serif text-3xl">{group.label}</h2>
                <p className="max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
                  {group.description}
                </p>
              </div>
              <SizeTable rows={group.rows} />
              <p className="font-sans text-xs leading-relaxed text-muted-foreground">
                Garments are drafted with 4–6cm of ease depending on the piece; outerwear carries more,
                second-skins carry less. Measurements are body measurements unless a garment length is
                named.
              </p>
            </section>
          ))}
        </div>

        <section className="mt-24 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="eyebrow">How to measure</h2>
            <p className="max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
              Use a soft tape over light clothing. Stand relaxed and keep the tape level — a sagging tape
              is the single most common reason a measurement is wrong.
            </p>
          </div>

          <div className="grid gap-px bg-bone/[0.07] sm:grid-cols-2">
            {HOW_TO_MEASURE.map((item) => (
              <article key={item.step} className="flex flex-col gap-3 bg-noir p-7">
                <span className="font-serif text-2xl text-gold">{item.step}</span>
                <h3 className="font-serif text-xl">{item.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </article>
            ))}
          </div>

          <p className="max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
            Still unsure? Ask the AI stylist for a recommendation, or book a session and we will measure
            you properly.
          </p>
        </section>
      </PageBody>
    </>
  );
}