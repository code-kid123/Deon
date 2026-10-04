import type { CourseDetail, CourseSummary } from "@/lib/academy/academy-repository";

/**
 * Mock academy catalogue used when Supabase is unreachable so `/academy` and the
 * homepage bento grid render a complete front-end on a fresh clone.
 * Tier ids are valid UUIDs so `startCourseCheckout` shape validation passes.
 */

const UNSPLASH = (id: string, width = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

type TierSeed = {
  id: string;
  name: string;
  priceMinor: number;
  features: string[];
};

type CourseSeed = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  featured: boolean;
  tiers: TierSeed[];
  modules: { title: string; lessons: { title: string; duration: number; preview?: boolean }[] }[];
};

const SEEDS: CourseSeed[] = [
  {
    id: "ac000001-0000-4000-8000-000000000001",
    slug: "ready-to-wear-design-foundations",
    title: "Ready-to-Wear Design Foundations",
    subtitle: "From first sketch to a sample that sells.",
    description:
      "The complete DEON method for taking a garment from sketch to saleable sample. You finish with a spec sheet, a costed bill of materials, and a small collection of pieces shot for your own lookbook.\n\nThis is the course our designers took before joining the atelier. It assumes you can sew, or are learning — the pattern and construction sessions assume nothing.",
    coverImage: UNSPLASH("photo-1554412933-514a83d2f3c8"),
    featured: true,
    tiers: [
      {
        id: "t1000000-0000-4000-8000-000000000001",
        name: "Studio Access",
        priceMinor: 18500000,
        features: [
          "All 4 modules and 22 lessons",
          "Instant Telegram community access",
          "Monthly live Q&A with a DEON pattern cutter"
        ]
      },
      {
        id: "t1000000-0000-4000-8000-000000000002",
        name: "Atelier Mentorship",
        priceMinor: 42000000,
        features: [
          "Everything in Studio Access",
          "1-on-1 mentorship with the creative director",
          "Your sample reviewed and critiqued twice",
          "Private fitting session in Lagos"
        ]
      }
    ],
    modules: [
      {
        title: "01 — Fashion illustration and figure drawing",
        lessons: [
          { title: "Drawing the croquis: proportion and gesture", duration: 1100, preview: true },
          { title: "Fabric rendering in six media", duration: 1640 },
          { title: "Building a collection board that communicates", duration: 1320 }
        ]
      },
      {
        title: "02 — Pattern cutting and toile",
        lessons: [
          { title: "Drafting a basic bodice block", duration: 2400, preview: true },
          { title: "Darts, seams and three ways to shape a waist", duration: 2180 },
          { title: "Toile fitting on the body vs. on the stand", duration: 1960 },
          { title: "Grading a block across five sizes", duration: 1740 }
        ]
      },
      {
        title: "03 — Construction and finishing",
        lessons: [
          { title: "Lining a jacket: cupro, bemberg and how to hang it", duration: 2020 },
          { title: "Hand-finishing a pick-stitched lapel", duration: 2280 },
          { title: "Interlining, canvas and fusing discipline", duration: 1500 },
          { title: "The finishing checklist before a sample is photographed", duration: 900 }
        ]
      },
      {
        title: "04 — Costing, pricing and selling",
        lessons: [
          { title: "Bills of materials and real landed cost", duration: 1580 },
          { title: "Pricing for a small-batch brand", duration: 1340, preview: true },
          { title: "Lookbooks, pricing pages and launch sequencing", duration: 1120 }
        ]
      }
    ]
  },
  {
    id: "ac000001-0000-4000-8000-000000000002",
    slug: "personal-styling-and-client-direction",
    title: "Personal Styling & Client Direction",
    subtitle: "Build a capsule that actually gets worn.",
    description:
      "How to style real people rather than images: body proportion, colour analysis, wardrobe auditing, and the client relationship that turns a one-off session into a retainer.\n\nSessions are run against live clients, with a recorded consultation you critique yourself alongside ours.",
    coverImage: UNSPLASH("photo-1487412720507-e7ab37603c6f"),
    featured: true,
    tiers: [
      {
        id: "t1000000-0000-4000-8000-000000000003",
        name: "Essentials",
        priceMinor: 12000000,
        features: [
          "All 3 modules and 16 lessons",
          "Instant Telegram community access",
          "Capsule worksheet pack"
        ]
      },
      {
        id: "t1000000-0000-4000-8000-000000000004",
        name: "Client Practice",
        priceMinor: 29000000,
        features: [
          "Everything in Essentials",
          "Five recorded consultations to critique",
          "Pricing, contracts and retainer scripts",
          "Monthly group critique"
        ]
      }
    ],
    modules: [
      {
        title: "01 — Reading the client",
        lessons: [
          { title: "First consultation: the questions that matter", duration: 1260, preview: true },
          { title: "Body proportion, posture and fit", duration: 1740 },
          { title: "Colour analysis and undertone", duration: 1080 }
        ]
      },
      {
        title: "02 — Building the wardrobe",
        lessons: [
          { title: "The wardrobe audit", duration: 1620 },
          { title: "Capsules by life, not by category", duration: 1480 },
          { title: "Fitting rooms, budgets and the honest conversation", duration: 1320 }
        ]
      },
      {
        title: "03 — Running the business",
        lessons: [
          { title: "Pricing a session and a retainer", duration: 1140, preview: true },
          { title: "Contracts, deposits and difficult clients", duration: 980 },
          { title: "Writing a style report worth keeping", duration: 860 }
        ]
      }
    ]
  },
  {
    id: "ac000001-0000-4000-8000-000000000003",
    slug: "starting-your-own-label",
    title: "Starting Your Own Label",
    subtitle: "Structure, capital and the first three seasons.",
    description:
      "The business half of fashion: entity setup, capital strategy, production planning, wholesale terms and the marketing that precedes a launch. Built for founders in Nigeria and across West Africa.\n\nIncludes the templates DEON used to open its own doors.",
    coverImage: UNSPLASH("photo-1441984904996-e0b6ba687e04"),
    featured: false,
    tiers: [
      {
        id: "t1000000-0000-4000-8000-000000000005",
        name: "Founder Kit",
        priceMinor: 9500000,
        features: [
          "All 3 modules and 14 lessons",
          "Instant Telegram community access",
          "Cap table and cash-flow templates"
        ]
      },
      {
        id: "t1000000-0000-4000-8000-000000000006",
        name: "Label Launch",
        priceMinor: 24000000,
        features: [
          "Everything in Founder Kit",
          "Entity and tax setup walkthrough",
          "Production plan reviewed line by line",
          "Two seasons of launch marketing critique"
        ]
      }
    ],
    modules: [
      {
        title: "01 — Structure and capital",
        lessons: [
          { title: "Choosing an entity and where to register it", duration: 1020, preview: true },
          { title: "Capitalising a fashion label without over-raising", duration: 1420 },
          { title: "Cash flow across a season", duration: 1260 }
        ]
      },
      {
        title: "02 — Production",
        lessons: [
          { title: "Factory versus atelier: real cost comparison", duration: 1380 },
          { title: "Buying fabric ahead of demand, safely", duration: 1120 },
          { title: "Quality control before the sample shoot", duration: 980 }
        ]
      },
      {
        title: "03 — Selling",
        lessons: [
          { title: "Wholesale terms and how to negotiate them", duration: 1240, preview: true },
          { title: "Pricing across channels without undercutting yourself", duration: 1160 },
          { title: "The three seasons that decide whether you continue", duration: 1040 }
        ]
      }
    ]
  }
];

function buildModules(seed: CourseSeed) {
  let position = 0;
  return seed.modules.map((module, moduleIndex) => {
    const moduleId = `m${seed.id.slice(2, 10)}${moduleIndex.toString().padStart(4, "0")}-0000-4000-8000-000000000000`;
    const lessons = module.lessons.map((lesson, lessonIndex) => ({
      id: `l${seed.id.slice(2, 10)}${moduleIndex.toString().padStart(2, "0")}${lessonIndex
        .toString()
        .padStart(2, "0")}-0000-4000-8000-000000000000`,
      moduleId,
      title: lesson.title,
      durationSeconds: lesson.duration,
      isPreview: Boolean(lesson.preview),
      position: lessonIndex
    }));

    position += 1;
    return { id: moduleId, title: module.title, position, lessons };
  });
}

function toSummary(seed: CourseSeed): CourseSummary {
  const modules = buildModules(seed);
  const lessons = modules.flatMap((m) => m.lessons);

  return {
    id: seed.id,
    slug: seed.slug,
    title: seed.title,
    subtitle: seed.subtitle,
    description: seed.description,
    coverImage: seed.coverImage,
    currency: "NGN",
    featured: seed.featured,
    tiers: seed.tiers.map((tier, index) => ({
      id: tier.id,
      courseId: seed.id,
      name: tier.name,
      priceMinor: tier.priceMinor,
      features: tier.features,
      position: index
    })),
    moduleCount: modules.length,
    lessonCount: lessons.length,
    durationSeconds: lessons.reduce((sum, l) => sum + (l.durationSeconds ?? 0), 0),
    lowestPriceMinor: Math.min(...seed.tiers.map((t) => t.priceMinor)),
    createdAt: "2024-01-01T00:00:00.000Z"
  };
}

export const MOCK_COURSES: CourseSummary[] = SEEDS.map(toSummary);

export const MOCK_COURSE_DETAILS: CourseDetail[] = SEEDS.map((seed) => ({
  ...toSummary(seed),
  modules: buildModules(seed)
}));

export function mockCourseDetail(slug: string): CourseDetail | null {
  return MOCK_COURSE_DETAILS.find((c) => c.slug === slug) ?? null;
}

export function mockCourseTier(tierId: string): { course: CourseSummary; tier: CourseSummary["tiers"][number] } | null {
  for (const course of MOCK_COURSES) {
    const tier = course.tiers.find((t) => t.id === tierId);
    if (tier) return { course, tier };
  }
  return null;
}