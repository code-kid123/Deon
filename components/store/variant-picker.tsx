"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Minus, Plus, Ruler, ShoppingBag } from "lucide-react";
import { buttonClassName } from "@/components/ui/button";
import { SizeGuideDialog } from "@/components/store/size-guide-dialog";
import { useCartStore } from "@/store/cart-store";
import { useUiStore, formatDisplayMoney } from "@/store/ui-store";
import { sortSizes } from "@/lib/catalog/size-guide";
import { cn } from "@/lib/utils";

export type PdpVariant = {
  id: string;
  sku: string;
  size: string | null;
  color: string | null;
  priceMinor: number;
  compareAtMinor: number | null;
  stock: number;
};

export function VariantPicker({
  productId,
  slug,
  productName,
  currency,
  variants,
  galleryImageUrl
}: {
  productId: string;
  slug: string;
  productName: string;
  currency: string;
  variants: PdpVariant[];
  galleryImageUrl: string | null;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const display = useUiStore((state) => state.currency);

  const sizes = useMemo(
    () =>
      sortSizes(Array.from(new Set(variants.map((v) => v.size).filter((s): s is string => Boolean(s))))),
    [variants]
  );
  const colors = useMemo(
    () => Array.from(new Set(variants.map((v) => v.color).filter((c): c is string => Boolean(c)))),
    [variants]
  );

  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] ?? null);
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  const matching = useMemo(
    () =>
      variants.filter(
        (v) =>
          (selectedSize === null || v.size === selectedSize) &&
          (selectedColor === null || v.color === selectedColor)
      ),
    [variants, selectedSize, selectedColor]
  );

  const variant = matching.length === 1 ? matching[0] : null;
  const maxStock = variant?.stock ?? 0;
  const soldOut = matching.length > 0 && maxStock === 0;
  const needsChoice = matching.length > 1;
  const unavailable = matching.length === 0;

  const sizeAvailability = useMemo(() => {
    const map = new Map<string, number>();
    for (const size of sizes) {
      map.set(
        size,
        variants
          .filter((v) => v.size === size && (!selectedColor || v.color === selectedColor))
          .reduce((sum, v) => sum + v.stock, 0)
      );
    }
    return map;
  }, [sizes, variants, selectedColor]);

  function handleAdd() {
    if (!variant) return;
    addItem(
      {
        productId,
        variantId: variant.id,
        slug,
        name: productName,
        sku: variant.sku,
        size: variant.size,
        color: variant.color,
        imageUrl: galleryImageUrl,
        unitPriceMinor: variant.priceMinor,
        currency,
        maxStock: variant.stock,
        quantity
      },
      quantity
    );
    setAdded(true);
    setQuantity(1);
    window.setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div className="flex flex-col gap-8">
      {variant ? (
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="font-serif text-2xl tabular-nums text-bone">
            {formatDisplayMoney(variant.priceMinor, display, currency)}
          </span>
          {variant.compareAtMinor !== null && variant.compareAtMinor > variant.priceMinor ? (
            <span className="font-sans text-sm tabular-nums text-bone/35 line-through">
              {formatDisplayMoney(variant.compareAtMinor, display, currency)}
            </span>
          ) : null}
          {display === "USD" ? (
            <span className="w-full font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
              Indicative · charged in NGN at checkout
            </span>
          ) : null}
        </div>
      ) : null}

      {colors.length > 0 ? (
        <fieldset className="flex flex-col gap-3">
          <legend className="eyebrow">Colour</legend>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const selected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "border px-4 py-2 font-sans text-xs uppercase tracking-[0.12em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold",
                    selected
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-bone/12 text-bone/65 hover:border-bone/35 hover:text-bone"
                  )}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {sizes.length > 0 ? (
        <fieldset className="flex flex-col gap-3">
          <legend className="flex w-full items-center justify-between gap-4">
            <span className="eyebrow">Size</span>
            <span className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="link-underline inline-flex items-center gap-1.5 font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-bone/60 transition-colors hover:text-gold focus-visible:outline-none"
              >
                <Ruler className="h-3 w-3" aria-hidden />
                Guide
              </button>
              <Link
                href="/shop/size-guide"
                className="link-underline font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-bone/60 transition-colors hover:text-gold"
              >
                Full chart
              </Link>
            </span>
          </legend>

          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const stock = sizeAvailability.get(size) ?? 0;
              const outOfStock = stock === 0;
              const selected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => outOfStock && !selected ? undefined : setSelectedSize(size)}
                  disabled={outOfStock && !selected}
                  className={cn(
                    "relative min-w-14 border px-4 py-2.5 font-sans text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold",
                    selected
                      ? "border-gold bg-gold text-noir"
                      : "border-bone/12 text-bone/80 hover:border-bone/35",
                    outOfStock &&
                      !selected &&
                      "cursor-not-allowed border-bone/[0.06] text-bone/25 hover:border-bone/[0.06]"
                  )}
                >
                  {size}
                  {outOfStock ? <span className="sr-only"> (out of stock)</span> : null}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <SizeGuideDialog open={guideOpen} onClose={() => setGuideOpen(false)} />

      <div className="flex flex-col gap-3">
        {unavailable ? (
          <p className="font-sans text-sm text-gold">That combination is archived. Try another size or colour.</p>
        ) : needsChoice ? (
          <p className="font-sans text-sm text-muted-foreground">Choose a size and colour to continue.</p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          {variant && !soldOut ? (
            <div className="flex items-center justify-between border border-bone/12 sm:w-40 sm:justify-start">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-12 w-12 items-center justify-center text-bone/70 transition-colors hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Minus className="h-3.5 w-3.5" aria-hidden />
              </button>
              <span className="font-sans text-sm tabular-nums text-bone" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={quantity >= maxStock}
                onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                className="flex h-12 w-12 items-center justify-center text-bone/70 transition-colors hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
          ) : null}

          <button
            type="button"
            disabled={!variant || soldOut}
            onClick={handleAdd}
            className={cn(
              buttonClassName({ size: "lg" }),
              "h-12 flex-1 justify-center gap-2.5 disabled:opacity-40"
            )}
          >
            {added ? (
              <>
                <Check className="h-4 w-4" aria-hidden />
                Added to bag
              </>
            ) : soldOut ? (
              "Sold out"
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" aria-hidden />
                Add to bag
              </>
            )}
          </button>
        </div>

        {soldOut ? (
          <p className="font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-gold">
            This size has sold out
          </p>
        ) : null}
        {variant && variant.stock > 0 && variant.stock <= 3 ? (
          <p className="font-sans text-xs text-muted-foreground">Only {variant.stock} left in this size</p>
        ) : null}
      </div>
    </div>
  );
}