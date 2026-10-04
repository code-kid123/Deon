import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { MOCK_COURSES, mockCourseDetail, mockCourseTier } from "@/lib/mock/academy";

type Row = Record<string, unknown>;

export function db(): SupabaseClient {
  return supabaseAdmin();
}

let databaseAvailable: boolean | null = null;

async function canQuery(): Promise<boolean> {
  if (databaseAvailable !== null) return databaseAvailable;
  try {
    const { error } = await db().from("courses").select("id").limit(1);
    databaseAvailable = !error;
  } catch {
    databaseAvailable = false;
  }
  return databaseAvailable;
}

export type CourseTier = {
  id: string;
  courseId: string;
  name: string;
  priceMinor: number;
  features: string[];
  position: number;
};

export type CourseLesson = {
  id: string;
  moduleId: string;
  title: string;
  durationSeconds: number | null;
  isPreview: boolean;
  position: number;
};

export type CourseModule = {
  id: string;
  title: string;
  position: number;
  lessons: CourseLesson[];
};

export type CourseSummary = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  coverImage: string | null;
  currency: string;
  featured: boolean;
  tiers: CourseTier[];
  moduleCount: number;
  lessonCount: number;
  durationSeconds: number;
  lowestPriceMinor: number | null;
  createdAt: string;
};

export type CourseDetail = CourseSummary & {
  modules: CourseModule[];
};

type CourseRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover_image: string | null;
  currency: string;
  featured: boolean;
  created_at: string;
};

type TierRow = {
  id: string;
  course_id: string;
  name: string;
  price_minor: number;
  features: unknown;
  position: number;
};

type ModuleRow = {
  id: string;
  course_id: string;
  title: string;
  position: number;
};

type LessonRow = {
  id: string;
  module_id: string;
  title: string;
  duration_seconds: number | null;
  is_preview: boolean;
  position: number;
};

function toFeatures(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((f): f is string => typeof f === "string");
}

function toTiers(rows: TierRow[]): CourseTier[] {
  return rows
    .map((row) => ({
      id: row.id,
      courseId: row.course_id,
      name: row.name,
      priceMinor: row.price_minor,
      features: toFeatures(row.features),
      position: row.position
    }))
    .sort((a, b) => a.position - b.position || a.priceMinor - b.priceMinor);
}

function toLessons(rows: LessonRow[]): CourseLesson[] {
  return rows
    .map((row) => ({
      id: row.id,
      moduleId: row.module_id,
      title: row.title,
      durationSeconds: row.duration_seconds,
      isPreview: row.is_preview,
      position: row.position
    }))
    .sort((a, b) => a.position - b.position);
}

async function fetchTiers(courseIds: string[]): Promise<Map<string, CourseTier[]>> {
  if (courseIds.length === 0) return new Map();

  const { data, error } = await db()
    .from("course_tiers")
    .select("id, course_id, name, price_minor, features, position")
    .in("course_id", courseIds);

  if (error) throw new Error(`academy.fetchTiers: ${error.message}`);

  const byCourse = new Map<string, TierRow[]>();
  for (const row of (data ?? []) as unknown as TierRow[]) {
    const list = byCourse.get(row.course_id) ?? [];
    list.push(row);
    byCourse.set(row.course_id, list);
  }

  return new Map(Array.from(byCourse, ([courseId, rows]) => [courseId, toTiers(rows)]));
}

async function fetchCurriculum(
  courseIds: string[]
): Promise<{ modules: Map<string, ModuleRow[]>; lessonsByModule: Map<string, LessonRow[]> }> {
  if (courseIds.length === 0) {
    return { modules: new Map(), lessonsByModule: new Map() };
  }

  const { data: moduleRows, error: moduleError } = await db()
    .from("course_modules")
    .select("id, course_id, title, position")
    .in("course_id", courseIds);

  if (moduleError) throw new Error(`academy.fetchModules: ${moduleError.message}`);

  const modules = moduleRows as unknown as ModuleRow[];

  if (modules.length === 0) {
    return { modules: new Map(), lessonsByModule: new Map() };
  }

  const { data: lessonRows, error: lessonError } = await db()
    .from("course_lessons")
    .select("id, module_id, title, duration_seconds, is_preview, position")
    .in(
      "module_id",
      modules.map((m) => m.id)
    );

  if (lessonError) throw new Error(`academy.fetchLessons: ${lessonError.message}`);

  const lessonsByModule = new Map<string, LessonRow[]>();
  for (const row of (lessonRows ?? []) as unknown as LessonRow[]) {
    const list = lessonsByModule.get(row.module_id) ?? [];
    list.push(row);
    lessonsByModule.set(row.module_id, list);
  }

  const modulesByCourse = new Map<string, ModuleRow[]>();
  for (const row of modules) {
    const list = modulesByCourse.get(row.course_id) ?? [];
    list.push(row);
    modulesByCourse.set(row.course_id, list);
  }

  return { modules: modulesByCourse, lessonsByModule };
}

function summarise(
  row: CourseRow,
  tiers: CourseTier[],
  moduleRows: ModuleRow[],
  lessonsByModule: Map<string, LessonRow[]>
): CourseSummary {
  const lessons = moduleRows.flatMap((m) => lessonsByModule.get(m.id) ?? []);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    coverImage: row.cover_image,
    currency: row.currency,
    featured: row.featured,
    tiers,
    moduleCount: moduleRows.length,
    lessonCount: lessons.length,
    durationSeconds: lessons.reduce((sum, l) => sum + (l.duration_seconds ?? 0), 0),
    lowestPriceMinor:
      tiers.length > 0 ? Math.min(...tiers.map((t) => t.priceMinor)) : null,
    createdAt: row.created_at
  };
}

export async function listCourses(options?: { featuredOnly?: boolean }): Promise<CourseSummary[]> {
  if (!(await canQuery())) {
    return options?.featuredOnly ? MOCK_COURSES.filter((c) => c.featured) : MOCK_COURSES;
  }

  let query = db()
    .from("courses")
    .select("id, slug, title, subtitle, description, cover_image, currency, featured, created_at")
    .eq("status", "PUBLISHED")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (options?.featuredOnly) {
    query = query.eq("featured", true);
  }

  const { data, error } = await query;
  if (error) throw new Error(`academy.listCourses: ${error.message}`);

  const rows = (data ?? []) as unknown as CourseRow[];
  if (rows.length === 0) return [];

  const courseIds = rows.map((row) => row.id);
  const [tierMap, { modules, lessonsByModule }] = await Promise.all([
    fetchTiers(courseIds),
    fetchCurriculum(courseIds)
  ]);

  return rows.map((row) =>
    summarise(row, tierMap.get(row.id) ?? [], modules.get(row.id) ?? [], lessonsByModule)
  );
}

export async function getCourseBySlug(slug: string): Promise<CourseDetail | null> {
  if (!(await canQuery())) return mockCourseDetail(slug);

  const { data, error } = await db()
    .from("courses")
    .select("id, slug, title, subtitle, description, cover_image, currency, featured, created_at")
    .eq("slug", slug)
    .eq("status", "PUBLISHED")
    .maybeSingle();

  if (error) throw new Error(`academy.getCourseBySlug: ${error.message}`);
  if (!data) return null;

  const row = data as unknown as CourseRow;

  const [tierMap, { modules, lessonsByModule }] = await Promise.all([
    fetchTiers([row.id]),
    fetchCurriculum([row.id])
  ]);

  const moduleRows = [...(modules.get(row.id) ?? [])].sort((a, b) => a.position - b.position);

  const courseModules: CourseModule[] = moduleRows.map((m) => ({
    id: m.id,
    title: m.title,
    position: m.position,
    lessons: toLessons(lessonsByModule.get(m.id) ?? [])
  }));

  return {
    ...summarise(row, tierMap.get(row.id) ?? [], moduleRows, lessonsByModule),
    modules: courseModules
  };
}

export type CourseTierQuote =
  | { ok: true; course: CourseSummary; tier: CourseTier }
  | { ok: false; message: string };

/**
 * Validates a course/tier pair and returns the authoritative price for checkout.
 * Tier ids arrive from the browser, so the price is always read from the database.
 */
export async function getCourseTierQuote(
  courseSlug: string,
  tierId: string
): Promise<CourseTierQuote> {
  if (!(await canQuery())) {
    const match = mockCourseTier(tierId);
    if (!match || match.course.slug !== courseSlug) {
      return { ok: false, message: "Please choose one of the available tiers." };
    }
    return { ok: true, course: match.course, tier: match.tier };
  }

  const course = await getCourseBySlug(courseSlug);
  if (!course) {
    return { ok: false, message: "That course is no longer available." };
  }

  const tier = course.tiers.find((t) => t.id === tierId);
  if (!tier) {
    return { ok: false, message: "Please choose one of the available tiers." };
  }

  return { ok: true, course, tier };
}

export function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return "Self-paced";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.round((totalSeconds % 3600) / 60);

  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
}

export function formatLessonDuration(seconds: number | null): string {
  if (seconds === null || seconds <= 0) return "—";
  const minutes = Math.round(seconds / 60);
  return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export type { Row };
