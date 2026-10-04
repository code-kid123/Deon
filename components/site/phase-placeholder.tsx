import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";

/**
 * Temporary landing surface for modules that are scheduled but not built yet, so
 * navigation never links to a 404. Delete alongside the phase that implements it.
 */
export function PhasePlaceholder({
  phase,
  title,
  description,
  whatIsNext
}: {
  phase: string;
  title: string;
  description: string;
  whatIsNext: string[];
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{phase}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-4 text-base text-muted-foreground">{description}</p>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        What ships in this phase
      </h2>
      <ul className="mt-4 flex flex-col gap-2">
        {whatIsNext.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-muted-foreground">
            <span aria-hidden>&bull;</span>
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/shop" className={buttonClassName()}>
          Shop the collection
        </Link>
        <Link href="/" className={buttonClassName({ variant: "outline" })}>
          Back home
        </Link>
      </div>
    </div>
  );
}
