import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/brand";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-32 text-center sm:px-8 lg:py-44">
      <p className="eyebrow">Error 404</p>

      <p className="mt-8 font-serif text-[clamp(5rem,22vw,12rem)] font-medium leading-[0.8] tracking-tight text-sheen">
        404
      </p>

      <h1 className="mt-10 max-w-[18ch] font-serif text-3xl leading-tight sm:text-4xl">
        This page has been taken off the floor.
      </h1>

      <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
        The link you followed does not exist any more. Here is everything that does.
      </p>

      <nav aria-label="Suggested pages" className="mt-10 w-full">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="link-underline font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-bone/75 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonClassName({ size: "lg" })}>
          Back to home
        </Link>
        <Link href="/shop" className={buttonClassName({ size: "lg", variant: "outline" })}>
          Browse the collection
        </Link>
      </div>
    </div>
  );
}