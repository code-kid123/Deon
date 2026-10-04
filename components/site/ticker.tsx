import { TICKER_ITEMS } from "@/lib/brand";

/**
 * Infinite marquee of house promises. Duplicated once so the -50% translate loops
 * seamlessly; the copy is decorative so it is hidden from assistive tech.
 */
export function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="relative overflow-hidden border-y border-bone/10 bg-noir py-4">
      <div className="marquee-track" aria-hidden>
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-8 whitespace-nowrap px-8 font-sans text-[0.625rem] uppercase tracking-[0.22em] text-bone/50"
          >
            {item}
            <span className="h-1 w-1 rotate-45 bg-gold/60" />
          </span>
        ))}
      </div>
    </div>
  );
}