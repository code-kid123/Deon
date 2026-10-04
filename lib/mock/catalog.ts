import type {
  CatalogCategory,
  CatalogImage,
  CatalogProduct,
  CatalogVariant
} from "@/lib/catalog/catalog-repository";

/**
 * Editorial mock catalogue.
 *
 * The storefront queries Supabase first and falls back to this dataset when the
 * database is unreachable, so `localhost:3000` always renders a complete, on-brand
 * front-end. Variant ids are stable UUIDs so server actions that validate id shape
 * (`startCourseCheckout`, `startCheckout`) behave identically against mock and live data.
 */

const img = (id: string, url: string, alt: string, position = 0): CatalogImage => ({
  id,
  url,
  alt,
  position
});

const UNSPLASH = (id: string, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

export const MOCK_CATEGORIES: CatalogCategory[] = [
  {
    id: "c1111111-1111-4111-8111-111111111111",
    slug: "outerwear",
    name: "Outerwear",
    description: "Coats, trenches and tailoring built to last a decade.",
    parentId: null
  },
  {
    id: "c2222222-2222-4222-8222-222222222222",
    slug: "tailoring",
    name: "Tailoring",
    description: "Structured suiting and separates in DEON house cloth.",
    parentId: null
  },
  {
    id: "c3333333-3333-4333-8333-333333333333",
    slug: "dresses",
    name: "Dresses",
    description: "Occasion pieces cut on the bias and finished by hand.",
    parentId: null
  },
  {
    id: "c4444444-4444-4444-8444-444444444444",
    slug: "essentials",
    name: "Essentials",
    description: "The permanent collection — re-worn, never replaced.",
    parentId: null
  }
];

const SIZE_RUN = ["XS", "S", "M", "L", "XL"];

type Seed = {
  id: string;
  slug: string;
  name: string;
  description: string;
  categoryId: string;
  priceMinor: number;
  compareAtMinor?: number;
  highlights: string[];
  care: string[];
  images: [string, string][];
  sizes?: string[];
  colors: { name: string; hex: string }[];
  stockPerSize?: number;
  soldOut?: boolean;
};

const SEEDS: Seed[] = [
  {
    id: "a1000000-0000-4000-8000-000000000001",
    slug: "obsidian-double-face-trench",
    name: "Obsidian Double-Face Trench",
    description:
      "Our signature coat in a double-face wool-cashmere cloth that needs no lining. Cut long and lean with a storm flap, throat latch and hand-finished raglan sleeves. Fully canvassed so it holds its line for years.",
    categoryId: "c1111111-1111-4111-8111-111111111111",
    priceMinor: 145000000,
    compareAtMinor: 172000000,
    highlights: [
      "Double-face Italian wool-cashmere, milled in Biella",
      "Fully canvassed and hand-set sleeve heads",
      "Unlined construction — the inside is as clean as the outside",
      "Complimentary alterations for life"
    ],
    care: ["Dry clean only", "Brush along the nap after wear", "Store on a broad hanger"],
    images: [
      [UNSPLASH("photo-1539109136881-3be0616acf4b"), "Model wearing the Obsidian trench in the studio"],
      [UNSPLASH("photo-1485462537746-965f33f7f6a7"), "Close detail of the double-face cloth and raglan sleeve"]
    ],
    colors: [
      { name: "Obsidian", hex: "#0B0B0C" },
      { name: "Oyster", hex: "#E5DFD7" }
    ],
    stockPerSize: 4
  },
  {
    id: "a1000000-0000-4000-8000-000000000002",
    slug: "bone-column-dress",
    name: "Bone Column Dress",
    description:
      "A floor-skimming column in heavy crepe, cut on the true bias so it moves with you rather than around you. Low back, hidden side zip, and a hand-rolled hem.",
    categoryId: "c3333333-3333-4333-8333-333333333333",
    priceMinor: 68000000,
    highlights: [
      "Jacquard crepe, 290gsm",
      "True bias cut with French seams throughout",
      "Hand-rolled hem",
      "Made to measure available"
    ],
    care: ["Cold hand wash", "Dry flat in shade", "Steam, never press"],
    images: [
      [UNSPLASH("photo-1566174053879-31528523f8ae"), "Bone column dress worn in full length"],
      [UNSPLASH("photo-1594633312681-425c7b97ccd1"), "Detail of the hand-rolled hem and crepe drape"]
    ],
    colors: [
      { name: "Bone", hex: "#F7F5F0" },
      { name: "Noir", hex: "#0B0B0C" }
    ],
    stockPerSize: 6
  },
  {
    id: "a1000000-0000-4000-8000-000000000003",
    slug: "atelier-suit-noir",
    name: "Atelier Suit — Noir",
    description:
      "Single-breasted, two-button, sharp shoulder. Drafted from our house block and finished with a half-canvas chest and pick-stitched lapel. Sold as a complete suit.",
    categoryId: "c2222222-2222-4222-8222-222222222222",
    priceMinor: 92000000,
    highlights: [
      "Super 130s wool from Vitale Barberis Canonico",
      "Half-canvas chest, pick-stitched lapel",
      "Includes jacket and trousers",
      "Alterations included"
    ],
    care: ["Dry clean sparingly", "Brush after each wear", "Rest 24h between wears"],
    images: [
      [UNSPLASH("photo-1509319117193-57bab727e09d"), "Atelier suit jacket, three-quarter view"],
      [UNSPLASH("photo-1591047139829-d91aecb6caea"), "Lapel and shoulder detail"]
    ],
    colors: [
      { name: "Noir", hex: "#0B0B0C" },
      { name: "Slate", hex: "#4A4F55" }
    ],
    stockPerSize: 5
  },
  {
    id: "a1000000-0000-4000-8000-000000000004",
    slug: "merino-crew-bone",
    name: "Merino Crew — Bone",
    description:
      "The permanent collection starts here. A fine-gauge extra-fine merino crew, knitted in a single run and fully fashioned so there are no side seams.",
    categoryId: "c4444444-4444-4444-8444-444444444444",
    priceMinor: 28500000,
    highlights: [
      "Extra-fine 19.5 micron merino",
      "Fully fashioned — no side seams",
      "Single-run knit in a closed mill",
      "Machine washable on wool cycle"
    ],
    care: ["Wool cycle, cold", "Dry flat", "Do not tumble dry"],
    images: [
      [UNSPLASH("photo-1521572163474-6864f9cf17ab"), "Bone merino crew, studio still life"],
      [UNSPLASH("photo-1479064555552-3ef4979f8908"), "Knit gauge and rib detail"]
    ],
    colors: [
      { name: "Bone", hex: "#F7F5F0" },
      { name: "Camel", hex: "#C5A880" },
      { name: "Noir", hex: "#0B0B0C" }
    ],
    stockPerSize: 12
  },
  {
    id: "a1000000-0000-4000-8000-000000000005",
    slug: "silk-slip-skirt",
    name: "Silk Slip Skirt",
    description:
      "Bias-cut silk charmeuse with a fixed elasticated waist and a side-slit finished with a hand-rolled stitch. Sits at the natural waist.",
    categoryId: "c3333333-3333-4333-8333-333333333333",
    priceMinor: 34000000,
    highlights: ["19mm silk charmeuse", "Hand-rolled side slit", "Fixed elastic waist", "Colour-matched to Bone Column Dress"],
    care: ["Dry clean only", "Store flat or on a hanger", "Cool iron on reverse"],
    images: [
      [UNSPLASH("photo-1595777457583-95e059d581b8"), "Silk slip skirt in motion"],
      [UNSPLASH("photo-1515886657613-9f3515b0c78f"), "Charmeuse drape detail"]
    ],
    colors: [
      { name: "Champagne", hex: "#C5A880" },
      { name: "Noir", hex: "#0B0B0C" }
    ],
    stockPerSize: 3
  },
  {
    id: "a1000000-0000-4000-8000-000000000006",
    slug: "structured-leather-tote",
    name: "Structured Leather Tote",
    description:
      "One piece of vegetable-tanned hide, folded and saddle-stitched by hand. Holds its architecture whether empty or full. Cotton twill lining with a single interior pocket.",
    categoryId: "c4444444-4444-4444-8444-444444444444",
    priceMinor: 52000000,
    highlights: [
      "Vegetable-tanned full-grain leather",
      "Hand saddle-stitched",
      "Reinforced base corners",
      "Monogramming available"
    ],
    care: ["Wipe with a dry cloth", "Condition twice yearly", "Keep away from direct heat"],
    images: [
      [UNSPLASH("photo-1441984904996-e0b6ba687e04"), "Structured tote in the atelier"],
      [UNSPLASH("photo-1492707892479-7bc8d5a4ee93"), "Handle and stitching detail"]
    ],
    colors: [{ name: "Espresso", hex: "#4A3728" }],
    sizes: ["ONE SIZE"],
    stockPerSize: 7
  },
  {
    id: "a1000000-0000-4000-8000-000000000007",
    slug: "double-breasted-blazer",
    name: "Double-Breasted Blazer",
    description:
      "Six-button double-breasted blazer with a strong shoulder and a nipped waist. The most useful thing in the house — works over denim and over silk.",
    categoryId: "c2222222-2222-4222-8222-222222222222",
    priceMinor: 61000000,
    compareAtMinor: 74000000,
    highlights: [
      "Double-breasted, six button",
      "Structured shoulder, lightly padded",
      "Half-lined in bemberg",
      "Sale — final collection"
    ],
    care: ["Dry clean only", "Steam to refresh between wears"],
    images: [
      [UNSPLASH("photo-1469334031218-e382a71b716b"), "Double-breasted blazer worn open"],
      [UNSPLASH("photo-1523381210434-271e8be1f52b"), "Button and lapel detail"]
    ],
    colors: [
      { name: "Camel", hex: "#C5A880" },
      { name: "Noir", hex: "#0B0B0C" }
    ],
    stockPerSize: 2
  },
  {
    id: "a1000000-0000-4000-8000-000000000008",
    slug: "cashmere-travel-knit",
    name: "Cashmere Travel Knit",
    description:
      "Boiled cashmere with a compact hand and a wide rib that holds its shape after a fourteen-hour flight. Packable, crease-resistant, quietly expensive.",
    categoryId: "c4444444-4444-4444-8444-444444444444",
    priceMinor: 47000000,
    highlights: [
      "Boiled Mongolian cashmere",
      "Crease-resistant and packable",
      "Ribbed funnel neck",
      "Limited to 200 units"
    ],
    care: ["Hand wash cold with cashmere shampoo", "Dry flat", "De-pill with a comb"],
    images: [[UNSPLASH("photo-1572804013309-59a88b7e92f1"), "Cashmere travel knit, folded still life"]],
    colors: [
      { name: "Oyster", hex: "#E5DFD7" },
      { name: "Noir", hex: "#0B0B0C" }
    ],
    sizes: ["S", "M", "L"],
    stockPerSize: 8
  }
];

function slugifySku(name: string, color: string, size: string): string {
  const base = name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 12);
  return `DEON-${base}-${color.slice(0, 3).toUpperCase()}-${size}`;
}

/** Deterministic index-based UUID keeps variant ids stable across server and client renders. */
function variantUuid(productIndex: number, colorIndex: number, sizeIndex: number): string {
  const seg = (n: number) => n.toString(16).padStart(4, "0");
  return [
    `b1${seg(productIndex + 1).slice(0, 4)}`,
    "4b2c",
    `8${seg(colorIndex + 3).slice(0, 3)}`,
    `a${seg(sizeIndex + 1).slice(0, 3)}`,
    `${seg(productIndex * 97 + colorIndex * 13 + sizeIndex + 1).slice(0, 4)}${seg(sizeIndex + 1)}`
  ].join("-");
}

function buildProduct(seed: Seed, index: number): CatalogProduct {
  const sizes = seed.sizes ?? SIZE_RUN;
  const stockPer = seed.stockPerSize ?? 5;
  const colorCount = seed.colors.length;

  const variants: CatalogVariant[] = [];
  let variantIndex = 0;

  seed.colors.forEach((color, colorIndex) => {
    sizes.forEach((size, sizeIndex) => {
      // Deterministic stock pattern so "only N left" states are reproducible.
      const isLowStock = (colorIndex * 3 + sizeIndex + index) % 7 === 0;
      const isSoldOut = Boolean(seed.soldOut) || ((colorIndex * 5 + sizeIndex + index) % 11 === 0);
      const stock = isSoldOut ? 0 : isLowStock ? 1 + ((sizeIndex + index) % 3) : stockPer;

      variants.push({
        id: variantUuid(index, colorIndex, sizeIndex),
        sku: slugifySku(seed.name, color.name, size),
        size,
        color: color.name,
        priceMinor: seed.priceMinor,
        compareAtMinor: seed.compareAtMinor ?? null,
        stock,
        status: "ACTIVE"
      });
      variantIndex += 1;
    });
  });

  const priced = variants.filter((v) => v.stock > 0);

  return {
    id: seed.id,
    slug: seed.slug,
    name: seed.name,
    description: seed.description,
    currency: "NGN",
    categoryId: seed.categoryId,
    highlights: seed.highlights,
    care: seed.care,
    status: "ACTIVE",
    priceMinor: priced.length ? Math.min(...priced.map((v) => v.priceMinor as number)) : null,
    compareAtMinor: seed.compareAtMinor ?? null,
    stockTotal: variants.reduce((sum, v) => sum + v.stock, 0),
    variants,
    images: seed.images.map(([url, alt], i) =>
      img(`${seed.id.slice(0, 8)}-img-${i}`, url, alt, i)
    )
  };
}

export const MOCK_PRODUCTS: CatalogProduct[] = SEEDS.map(buildProduct);

/** Cards need a colour swatch; derive it from the product's variant colours. */
export function mockColorHex(product: CatalogProduct, colorName: string | null): string | null {
  if (!colorName) return null;
  const seed = SEEDS.find((s) => s.id === product.id);
  return seed?.colors.find((c) => c.name === colorName)?.hex ?? null;
}

export const MOCK_PRODUCT_VARIANT_COUNT = MOCK_PRODUCTS.reduce(
  (sum, p) => sum + p.variants.length,
  0
);

export type MockHeroImage = { url: string; alt: string };

export const MOCK_EDITORIAL: {
  hero: MockHeroImage[];
  academy: MockHeroImage[];
  mentorship: MockHeroImage;
  consultations: MockHeroImage;
  atelier: MockHeroImage;
} = {
  hero: [
    {
      url: UNSPLASH("photo-1539109136881-3be0616acf4b", 2000),
      alt: "DEON model in the studio, obsidian tailoring"
    },
    {
      url: UNSPLASH("photo-1490481651871-ab68de25d43d", 1400),
      alt: "Editorial outerwear detail"
    },
    {
      url: UNSPLASH("photo-1483985988355-763728e1935b", 1400),
      alt: "Ready-to-wear collection, campaign still"
    }
  ],
  academy: [
    {
      url: UNSPLASH("photo-1523381210434-271e8be1f52b", 1200),
      alt: "Fashion studio rails during a DEON atelier class"
    },
    {
      url: UNSPLASH("photo-1524178232363-1fb2b075b655", 1200),
      alt: "Students at a design crit"
    }
  ],
  mentorship: {
    url: UNSPLASH("photo-1554412933-514a83d2f3c8", 1400),
    alt: "Mentorship critique in the atelier"
  },
  consultations: {
    url: UNSPLASH("photo-1487412720507-e7ab37603c6f", 1400),
    alt: "Private styling consultation"
  },
  atelier: {
    url: UNSPLASH("photo-1492707892479-7bc8d5a4ee93", 1600),
    alt: "The DEON atelier floor"
  }
};