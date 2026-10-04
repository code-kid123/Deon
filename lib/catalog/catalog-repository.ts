import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/mock/catalog";

type Row = Record<string, unknown>;

export type CatalogCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  parentId: string | null;
};

export type CatalogVariant = {
  id: string;
  sku: string;
  size: string | null;
  color: string | null;
  priceMinor: number | null;
  compareAtMinor: number | null;
  stock: number;
  status: string;
};

export type CatalogImage = {
  id: string;
  url: string;
  alt: string | null;
  position: number;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  currency: string;
  categoryId: string | null;
  highlights: unknown[] | null;
  care: unknown[] | null;
  status: string;
  priceMinor: number | null;
  compareAtMinor: number | null;
  stockTotal: number;
  variants: CatalogVariant[];
  images: CatalogImage[];
};

export type CatalogFilters = {
  categoryId?: string;
  q?: string;
  sizes?: string[];
  colors?: string[];
  onlyInStock?: boolean;
  sort?: "newest" | "price-asc" | "price-desc";
};

export type CatalogListResult = {
  products: CatalogProduct[];
  categories: CatalogCategory[];
  total: number;
  sizes: string[];
  colors: string[];
};

export function db(): SupabaseClient {
  return supabaseAdmin();
}

/**
 * True when Supabase is configured and reachable. Every read path falls back to the
 * mock catalogue when this is false, so the storefront still renders a full front-end
 * without a database.
 */
let databaseAvailable: boolean | null = null;

async function canQuery(): Promise<boolean> {
  if (databaseAvailable !== null) return databaseAvailable;
  try {
    const { error } = await db().from("categories").select("id").limit(1);
    databaseAvailable = !error;
  } catch {
    databaseAvailable = false;
  }
  return databaseAvailable;
}

export function mockCatalog(filterOverrides: {
  sizes?: string[];
  colors?: string[];
  onlyInStock?: boolean;
} = {}): CatalogProduct[] {
  let products = MOCK_PRODUCTS;

  const needsVariantMatch = Boolean(filterOverrides.sizes?.length || filterOverrides.colors?.length);
  if (needsVariantMatch) {
    products = products
      .map((product) => ({
        ...product,
        variants: product.variants.filter((v) => {
          if (filterOverrides.sizes?.length && (v.size === null || !filterOverrides.sizes.includes(v.size))) {
            return false;
          }
          if (filterOverrides.colors?.length && (v.color === null || !filterOverrides.colors.includes(v.color))) {
            return false;
          }
          return true;
        })
      }))
      .filter((product) => product.variants.length > 0);
  }

  if (filterOverrides.onlyInStock) {
    products = products.filter((p) => p.stockTotal > 0);
  }

  return products;
}

export async function listCategories(): Promise<CatalogCategory[]> {
  if (!(await canQuery())) return MOCK_CATEGORIES;

  const { data, error } = await db()
    .from("categories")
    .select("id, slug, name, description, parent_id")
    .order("name", { ascending: true });

  if (error) throw new Error(`catalog.listCategories: ${error.message}`);
  return (data ?? []).map((row) => {
    const r = row as unknown as {
      id: string;
      slug: string;
      name: string;
      description: string | null;
      parent_id: string | null;
    };
    return {
      id: r.id,
      slug: r.slug,
      name: r.name,
      description: r.description,
      parentId: r.parent_id
    };
  });
}

async function fetchVariants(productIds: string[]): Promise<Map<string, CatalogVariant[]>> {
  if (productIds.length === 0) return new Map();
  const { data, error } = await db()
    .from("product_variants")
    .select("id, product_id, sku, size, color, price_minor, compare_at_price_minor, stock, status")
    .in("product_id", productIds);

  if (error) throw new Error(`catalog.fetchVariants: ${error.message}`);

  const byProduct = new Map<string, CatalogVariant[]>();
  for (const row of (data ?? []) as Row[]) {
    const v = row as unknown as {
      id: string;
      product_id: string;
      sku: string;
      size: string | null;
      color: string | null;
      price_minor: number | null;
      compare_at_price_minor: number | null;
      stock: number;
      status: string;
    };
    const list = byProduct.get(v.product_id) ?? [];
    list.push({
      id: v.id,
      sku: v.sku,
      size: v.size,
      color: v.color,
      priceMinor: v.price_minor,
      compareAtMinor: v.compare_at_price_minor,
      stock: v.stock,
      status: v.status
    });
    byProduct.set(v.product_id, list);
  }
  return byProduct;
}

async function fetchImages(productIds: string[]): Promise<Map<string, CatalogImage[]>> {
  if (productIds.length === 0) return new Map();
  const { data, error } = await db()
    .from("product_images")
    .select("id, product_id, url, alt, position")
    .in("product_id", productIds)
    .order("position", { ascending: true });

  if (error) throw new Error(`catalog.fetchImages: ${error.message}`);

  const byProduct = new Map<string, CatalogImage[]>();
  for (const row of (data ?? []) as Row[]) {
    const img = row as unknown as {
      id: string;
      product_id: string;
      url: string;
      alt: string | null;
      position: number;
    };
    const list = byProduct.get(img.product_id) ?? [];
    list.push({ id: img.id, url: img.url, alt: img.alt, position: img.position });
    byProduct.set(img.product_id, list);
  }
  return byProduct;
}

export type CatalogCategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  parent_id: string | null;
};

export async function listProducts(filters: CatalogFilters = {}): Promise<CatalogListResult> {
  if (!(await canQuery())) return mockListResult(filters);

  let query = db()
    .from("products")
    .select("id, slug, name, description, currency, category_id, highlights, care, created_at")
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: false });

  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }
  if (filters.q) {
    query = query.ilike("name", `%${filters.q}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(`catalog.listProducts: ${error.message}`);

  const productIds = (data ?? []).map((row) => (row as Row).id as string);
  const [variantMap, imageMap] = await Promise.all([
    fetchVariants(productIds),
    fetchImages(productIds)
  ]);

  const products: CatalogProduct[] = (data ?? []).map((row) => {
    const r = row as unknown as {
      id: string;
      slug: string;
      name: string;
      description: string | null;
      currency: string;
      category_id: string | null;
      highlights: unknown[] | null;
      care: unknown[] | null;
      created_at: string;
    };
    const pid = r.id;
    const activeVariants = (variantMap.get(pid) ?? []).filter((v) => v.status === "ACTIVE");
    const variants = activeVariants.filter((v) => {
      if (filters.sizes?.length && (v.size === null || !filters.sizes.includes(v.size))) {
        return false;
      }
      if (filters.colors?.length && (v.color === null || !filters.colors.includes(v.color))) {
        return false;
      }
      return true;
    });
    const images = imageMap.get(pid) ?? [];

    const priced = variants.filter((v) => v.stock > 0 && v.priceMinor !== null);
    const priceMinor = priced.length
      ? Math.min(...priced.map((v) => v.priceMinor as number))
      : null;
    const compared = priced.filter((v) => v.compareAtMinor !== null);
    const compareAtMinor = compared.length
      ? Math.min(...compared.map((v) => v.compareAtMinor as number))
      : null     ;

    return {
      id: pid,
      slug: r.slug,
      name: r.name,
      description: r.description,
      currency: r.currency,
      categoryId: r.category_id,
      highlights: r.highlights,
      care: r.care,
      status: "ACTIVE",
      priceMinor,
      compareAtMinor,
      stockTotal: variants.reduce((sum, v) => sum + v.stock, 0),
      variants,
      images
    };
  });

  // Facets are derived from the *unfiltered* catalogue so the option lists do not
  // collapse to the single value the shopper just clicked.
  const facetsSource =
    filters.sizes?.length || filters.colors?.length
      ? products.length === 0
        ? []
        : await facetSourceFor(productIds, variantMap)
      : products;

  const requiresVariantMatch = Boolean(filters.sizes?.length || filters.colors?.length);

  const matched = requiresVariantMatch ? products.filter((p) => p.variants.length > 0) : products;

  let sorted: CatalogProduct[];
  if (filters.sort === "price-asc") {
    sorted = [...matched].sort((a, b) => (a.priceMinor ?? 0) - (b.priceMinor ?? 0));
  } else if (filters.sort === "price-desc") {
    sorted = [...matched].sort((a, b) => (b.priceMinor ?? 0) - (a.priceMinor ?? 0));
  } else {
    sorted = matched;
  }

  const filtered = filters.onlyInStock ? sorted.filter((p) => p.stockTotal > 0) : sorted;

  const sizes = Array.from(
    new Set(
      facetsSource.flatMap((p) => p.variants.map((v) => v.size).filter((s): s is string => s !== null))
    )
  ).sort();
  const colors = Array.from(
    new Set(
      facetsSource.flatMap((p) => p.variants.map((v) => v.color).filter((c): c is string => c !== null))
    )
  ).sort();

  const categories = await listCategories();

  return {
    products: filtered,
    categories,
    total: filtered.length,
    sizes,
    colors
  };
}

/**
 * Assembles the same `CatalogListResult` shape from mock data, including the facet
 * lists, so `/shop` renders identically whether or not Supabase is configured.
 */
function mockListResult(filters: CatalogFilters): CatalogListResult {
  let products = mockCatalog({
    sizes: filters.sizes,
    colors: filters.colors,
    onlyInStock: filters.onlyInStock
  });

  if (filters.categoryId) {
    products = products.filter((p) => p.categoryId === filters.categoryId);
  }
  if (filters.q) {
    const needle = filters.q.toLowerCase();
    products = products.filter((p) => p.name.toLowerCase().includes(needle));
  }

  if (filters.sort === "price-asc") {
    products = [...products].sort((a, b) => (a.priceMinor ?? 0) - (b.priceMinor ?? 0));
  } else if (filters.sort === "price-desc") {
    products = [...products].sort((a, b) => (b.priceMinor ?? 0) - (a.priceMinor ?? 0));
  }

  const sizes = Array.from(
    new Set(MOCK_PRODUCTS.flatMap((p) => p.variants.map((v) => v.size).filter((s): s is string => s !== null)))
  ).sort();
  const colors = Array.from(
    new Set(MOCK_PRODUCTS.flatMap((p) => p.variants.map((v) => v.color).filter((c): c is string => c !== null)))
  ).sort();

  return {
    products,
    categories: MOCK_CATEGORIES,
    total: products.length,
    sizes,
    colors
  };
}

/**
 * Builds facet-only product shells (no images) so size/colour options stay stable
 * while the shopper has a size or colour filter applied.
 */
async function facetSourceFor(
  productIds: string[],
  variantMap: Map<string, CatalogVariant[]>
): Promise<CatalogProduct[]> {
  return productIds.map((id) => {
    const variants = (variantMap.get(id) ?? []).filter((v) => v.status === "ACTIVE");
    return {
      id,
      slug: "",
      name: "",
      description: null,
      currency: "NGN",
      categoryId: null,
      highlights: null,
      care: null,
      status: "ACTIVE",
      priceMinor: null,
      compareAtMinor: null,
      stockTotal: variants.reduce((sum, v) => sum + (v.stock ?? 0), 0),
      variants,
      images: []
    };
  });
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | null> {
  if (!(await canQuery())) {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }

  const { data, error } = await db()
    .from("products")
    .select("id, slug, name, description, currency, category_id, highlights, care, created_at")
    .eq("slug", slug)
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (error) throw new Error(`catalog.getProductBySlug: ${error.message}`);
  if (!data) return null;

  const row = data as unknown as {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    currency: string;
    category_id: string | null;
    highlights: unknown[] | null;
    care: unknown[] | null;
    created_at: string;
  };

  const [variantMap, imageMap] = await Promise.all([
    fetchVariants([row.id]),
    fetchImages([row.id])
  ]);

  const variants = (variantMap.get(row.id) ?? []).filter((v) => v.status === "ACTIVE");
  const images = imageMap.get(row.id) ?? [];

  const priced = variants.filter((v) => v.stock > 0 && v.priceMinor !== null);
  const priceMinor = priced.length
    ? Math.min(...priced.map((v) => v.priceMinor as number))
    : null;
  const compared = priced.filter((v) => v.compareAtMinor !== null);
  const compareAtMinor = compared.length
    ? Math.min(...compared.map((v) => v.compareAtMinor as number))
    : null;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    currency: row.currency,
    categoryId: row.category_id,
    highlights: row.highlights,
    care: row.care,
    status: "ACTIVE",
    priceMinor,
    compareAtMinor,
    stockTotal: variants.reduce((sum, v) => sum + v.stock, 0),
    variants,
    images
  };
}

export type CheckoutLine = {
  variantId: string;
  productId: string;
  productSlug: string;
  productName: string;
  sku: string;
  size: string | null;
  color: string | null;
  unitPriceMinor: number;
  stock: number;
  currency: string;
  imageUrl: string | null;
};

/**
 * Re-prices a cart against the mock catalogue when no database is configured.
 *
 * This keeps the demo path honest: quantities are still validated against mock
 * stock, and the browser still only ever sends `{ variantId, quantity }` — no price
 * is ever trusted from the client.
 */
function mockCheckoutLines(
  requested: { variantId: string; quantity: number }[]
): CheckoutLineResult {
  const lines: CheckoutLine[] = [];
  const seen = new Set<string>();

  for (const item of requested) {
    if (seen.has(item.variantId)) {
      return {
        ok: false,
        reason: "unavailable",
        variantId: item.variantId,
        message: "An item in your bag is listed more than once. Please review your bag."
      };
    }
    seen.add(item.variantId);

    const product = MOCK_PRODUCTS.find((p) => p.variants.some((v) => v.id === item.variantId));
    if (!product) {
      return {
        ok: false,
        reason: "unavailable",
        variantId: item.variantId,
        message: "An item in your bag is no longer available. Please review your bag."
      };
    }

    const variant = product.variants.find((v) => v.id === item.variantId)!;

    if (item.quantity <= 0) continue;

    if (variant.stock < item.quantity) {
      return {
        ok: false,
        reason: "out-of-stock",
        variantId: variant.id,
        message:
          variant.stock === 0
            ? `${product.name} (${variant.size ?? variant.sku}) just sold out.`
            : `Only ${variant.stock} left of ${product.name} (${variant.size ?? variant.sku}).`
      };
    }

    lines.push({
      variantId: variant.id,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      unitPriceMinor: variant.priceMinor ?? product.priceMinor ?? 0,
      stock: variant.stock,
      currency: product.currency,
      imageUrl: product.images[0]?.url ?? null
    });
  }

  if (lines.length === 0) {
    return { ok: false, reason: "unavailable", message: "Your bag is empty." };
  }

  return { ok: true, lines };
}

export type CheckoutLineResult =
  | { ok: true; lines: CheckoutLine[] }
  | { ok: false; reason: "unavailable" | "out-of-stock"; message: string; variantId?: string };

/**
 * Re-prices a set of variant ids straight from the database.
 *
 * Checkout MUST call this instead of trusting the client cart: the browser only
 * sends `{ variantId, quantity }`, and every price, name, sku and stock figure
 * below is read from `products` / `product_variants` at request time.
 */
export async function getCheckoutLines(
  requested: { variantId: string; quantity: number }[]
): Promise<CheckoutLineResult> {
  if (requested.length === 0) {
    return { ok: false, reason: "unavailable", message: "Your cart is empty." };
  }

  if (!(await canQuery())) return mockCheckoutLines(requested);

  const { data: variantRows, error: variantError } = await db()
    .from("product_variants")
    .select("id, product_id, sku, size, color, price_minor, stock, status")
    .in(
      "id",
      requested.map((r) => r.variantId)
    );

  if (variantError) {
    throw new Error(`catalog.getCheckoutLines: ${variantError.message}`);
  }

  const variants = variantRows as unknown as {
    id: string;
    product_id: string;
    sku: string;
    size: string | null;
    color: string | null;
    price_minor: number;
    stock: number;
    status: string;
  }[];

  if (variants.length !== requested.length) {
    const found = new Set(variants.map((v) => v.id));
    const missing = requested.find((r) => !found.has(r.variantId));
    return {
      ok: false,
      reason: "unavailable",
      variantId: missing?.variantId,
      message: "An item in your cart is no longer available. Please review your cart."
    };
  }

  const productIds = Array.from(new Set(variants.map((v) => v.product_id)));

  const { data: productRows, error: productError } = await db()
    .from("products")
    .select("id, slug, name, currency, status")
    .in("id", productIds);

  if (productError) {
    throw new Error(`catalog.getCheckoutLines.products: ${productError.message}`);
  }

  const products = new Map(
    (productRows as unknown as {
      id: string;
      slug: string;
      name: string;
      currency: string;
      status: string;
    }[]).map((p) => [p.id, p])
  );

  const imageMap = await fetchImages(productIds);

  const quantityByVariant = new Map(requested.map((r) => [r.variantId, r.quantity]));

  const lines: CheckoutLine[] = [];

  for (const variant of variants) {
    if (variant.status !== "ACTIVE") {
      return {
        ok: false,
        reason: "unavailable",
        variantId: variant.id,
        message: "An item in your cart is no longer available. Please review your cart."
      };
    }

    const product = products.get(variant.product_id);
    if (!product || product.status !== "ACTIVE") {
      return {
        ok: false,
        reason: "unavailable",
        variantId: variant.id,
        message: "An item in your cart is no longer available. Please review your cart."
      };
    }

    const quantity = quantityByVariant.get(variant.id) ?? 0;

    if (quantity <= 0) {
      continue;
    }

    if (variant.stock < quantity) {
      return {
        ok: false,
        reason: "out-of-stock",
        variantId: variant.id,
        message:
          variant.stock === 0
            ? `${product.name} (${variant.size ?? variant.sku}) just sold out.`
            : `Only ${variant.stock} left of ${product.name} (${variant.size ?? variant.sku}).`
      };
    }

    const images = imageMap.get(variant.product_id) ?? [];

    lines.push({
      variantId: variant.id,
      productId: variant.product_id,
      productSlug: product.slug,
      productName: product.name,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      unitPriceMinor: variant.price_minor,
      stock: variant.stock,
      currency: product.currency,
      imageUrl: images.length ? images[0].url : null
    });
  }

  if (lines.length === 0) {
    return { ok: false, reason: "unavailable", message: "Your cart is empty." };
  }

  return { ok: true, lines };
}
