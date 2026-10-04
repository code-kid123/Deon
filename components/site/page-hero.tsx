import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared editorial page header: eyebrow, serif display title, optional standfirst,
 * and a breadcrumb. Used by every inner page so the vertical rhythm stays constant.
 */
export function PageHero({
  eyebrow,
  title,
  standfirst,
  breadcrumb,
  children,
  className,
  align = "start"
}: {
  eyebrow?: string;
  title: string;
  standfirst?: string;
  breadcrumb?: { href: string; label: string }[];
  children?: ReactNode;
  className?: string;
  align?: "start" | "center";
}) {
  return (
    <header
      className={cn(
        "relative overflow-hidden border-b border-bone/10",
        align === "center" ? "text-center" : "",
        className
      )}
    >
      <div className="grain absolute inset-0 opacity-40" aria-hidden />

      <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-20 pt-16 sm:px-8 lg:px-12 lg:pb-28 lg:pt-24">
        {breadcrumb?.length ? (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
              {breadcrumb.map((crumb, index) => (
                <li key={crumb.href} className="flex items-center gap-1.5">
                  {index > 0 ? (
                    <ChevronRight className="h-3 w-3 opacity-50" aria-hidden />
                  ) : null}
                  {index === breadcrumb.length - 1 ? (
                    <span className="text-bone/70">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="transition-colors hover:text-gold">
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div
          className={cn(
            "flex flex-col gap-6",
            align === "center" && "items-center"
          )}
        >
          {eyebrow ? (
            <p className="eyebrow animate-fade-up">
              <span className="mr-3 inline-block h-px w-8 translate-y-[-0.25em] bg-gold" aria-hidden />
              {eyebrow}
            </p>
          ) : null}

          <h1
            className={cn(
              "max-w-[18ch] font-serif text-display-sm animate-fade-up",
              align === "center" && "mx-auto",
              "[animation-delay:80ms]"
            )}
          >
            {title}
          </h1>

          {standfirst ? (
            <p
              className={cn(
                "max-w-2xl font-sans text-base leading-relaxed text-muted-foreground animate-fade-up",
                align === "center" && "mx-auto text-center",
                "[animation-delay:160ms]"
              )}
            >
              {standfirst}
            </p>
          ) : null}

          {children ? (
            <div className={cn("mt-4 flex flex-wrap gap-3", align === "center" && "justify-center")}>
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

/** Standard page body container. */
export function PageBody({
  children,
  className,
  id
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={cn("mx-auto w-full max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12", className)}
    >
      {children}
    </div>
  );
}