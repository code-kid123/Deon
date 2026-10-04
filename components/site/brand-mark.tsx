import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The DEON wordmark. Serif, ultra-wide tracking, with a hairline rule that reads as
 * a couture label. `size` controls the display treatment only.
 */
export function BrandMark({
  size = "md",
  className,
  onDark = true
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="DEON — home"
      className={cn(
        "group flex shrink-0 flex-col leading-none",
        onDark ? "text-bone" : "text-noir",
        className
      )}
    >
      <span
        className={cn(
          "font-serif font-medium uppercase leading-none tracking-[0.42em]",
          size === "lg" && "text-3xl sm:text-4xl",
          size === "md" && "text-xl sm:text-[1.4rem]",
          size === "sm" && "text-base"
        )}
      >
        DEON
      </span>
      <span
        className={cn(
          "mt-1 block h-px w-full origin-left scale-x-100 transition-transform duration-500 ease-luxe group-hover:scale-x-50",
          onDark ? "bg-gold/60" : "bg-gold-deep"
        )}
      />
    </Link>
  );
}