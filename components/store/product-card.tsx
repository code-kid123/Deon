import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { QuickAdd, PriceTag } from "@/components/store/quick-add";
import type { CatalogProduct } from "@/lib/catalog/catalog-repository";
import { mockColorHex } from "@/lib/mock/catalog";
import { cn } from "@/lib/utils";

/**
 * Editorial product card: full-bleed image, hover zoom, quick-add size pills and
 * live bag state. Links to the product page so it stays a real destination.
 */
export function ProductCard({
  product,
  priority = false
}: {
  product: CatalogProduct;
  priority?: boolean;
}) {
  const soldOut = product.stockTotal === 0;
  const lowStock = !soldOut && product.stockTotal <= 6;
  const discounted =
    product.compareAtMinor !== null &&
    product.priceMinor !== null &&
    product.compareAtMinor > product.priceMinor;

  const colors = Array.from(
    new Set(product.variants.map((v) => v.color).filter((c): c is string => Boolean(c)))
  );

  return (
    <article className="group relative flex flex-col">
      <Link
        href={`/shop/${product.slug}`}
        className="relative block overflow-hidden bg-noir focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        aria-label={`${product.name}${soldOut ? " — sold out" : ""}`}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          {product.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0].url}
              alt={product.images[0].alt ?? product.name}
              loading={priority ? "eager" : "lazy"}
              className={cn(
                "h-full w-full object-cover transition-all duration-[900ms] ease-luxe",
                "group-hover:scale-[1.06]",
                soldOut && "opacity-55 saturate-[0.4]"
              )}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-bone/[0.03] font-serif text-[0.625rem] uppercase tracking-[0.3em] text-bone/25">
              DEON
            </div>
          )}

          {/* Bottom scrim so quick-add stays legible over photography. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-noir via-noir/60 to-transparent opacity-90" />

          <div className="absolute left-4 top-4 flex flex-col items-start gap-1.5">
            {soldOut ? <Badge variant="muted">Sold out</Badge> : null}
            {!soldOut && discounted ? <Badge variant="solid">Sale</Badge> : null}
            {lowStock && !discounted ? <Badge variant="outline">{product.stockTotal} left</Badge> : null}
            {product.compareAtMinor !== null && discounted && !soldOut ? (
              <Badge variant="outline">
                {Math.round(((product.priceMinor ?? 0) / product.compareAtMinor) * 100)}% of RRP
              </Badge>
            ) : null}
          </div>
        </div>
      </Link>

      {!soldOut ? <QuickAdd product={product} /> : null}

      <div className="flex flex-1 flex-col gap-2 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-base leading-snug">
            <Link href={`/shop/${product.slug}`} className="transition-colors hover:text-gold">
              {product.name}
            </Link>
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {colors.length > 0 ? (
            <ul className="flex items-center gap-1.5" aria-label="Available colours">
              {colors.slice(0, 4).map((color) => (
                <li
                  key={color}
                  title={color}
                  className="h-2.5 w-2.5 rounded-full border border-bone/25"
                  style={{ backgroundColor: mockColorHex(product, color) ?? "transparent" }}
                >
                  <span className="sr-only">{color}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <span className="font-sans text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
            {colors.length > 1 ? `${colors.length} colours` : (colors[0] ?? "Ready to ship")}
          </span>
        </div>

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <PriceTag minor={product.priceMinor} currency={product.currency} />
          {discounted ? (
            <span className="font-sans text-xs text-muted-foreground line-through">
              <PriceTag minor={product.compareAtMinor} currency={product.currency} />
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}