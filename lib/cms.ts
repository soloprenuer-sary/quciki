import { cache } from "react";
import { getSupabase } from "./supabase";
import { CALCULATORS, type CalculatorMeta, type Faq } from "./calculators";
import { GUIDES as BUILTIN_GUIDES, guideToMarkdown } from "./guides";
import type { CategorySlug } from "./categories";
import { SITE } from "./site";

/* ------------------------------------------------------------------ */
/* Content layer: built-in content (in code) + overrides from Supabase. */
/* If Supabase is missing or a query fails, the built-in content is    */
/* used, so the public site never breaks because of the database.      */
/* ------------------------------------------------------------------ */

export interface GuideView {
  slug: string;
  category: CategorySlug;
  title: string;
  description: string;
  /** ISO date or timestamp. */
  published: string;
  updated: string;
  calculator?: string;
  bodyMd: string;
  cover?: string | null;
  source: "code" | "db";
}

interface GuideRow {
  slug: string;
  category: CategorySlug;
  title: string;
  description: string | null;
  body_md: string | null;
  cover_url: string | null;
  calculator_slug: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const builtinGuides = (): GuideView[] =>
  BUILTIN_GUIDES.map((g) => ({
    slug: g.slug,
    category: g.category,
    title: g.title,
    description: g.description,
    published: g.published,
    updated: g.published,
    calculator: g.calculator,
    bodyMd: guideToMarkdown(g),
    cover: null,
    source: "code",
  }));

/** All visible guides: built-in ones, replaced by a database guide with the same slug, plus new database guides. */
export const getAllGuides = cache(async (): Promise<GuideView[]> => {
  const map = new Map<string, GuideView>(builtinGuides().map((g) => [g.slug, g]));
  const db = getSupabase();
  if (db) {
    try {
      // RLS only returns published guides whose publish time has passed.
      const { data } = await db
        .from("guides")
        .select("slug,category,title,description,body_md,cover_url,calculator_slug,published_at,created_at,updated_at");
      for (const r of (data ?? []) as GuideRow[]) {
        map.set(r.slug, {
          slug: r.slug,
          category: r.category,
          title: r.title,
          description: r.description ?? "",
          published: r.published_at ?? r.created_at,
          updated: r.updated_at,
          calculator: r.calculator_slug ?? undefined,
          bodyMd: r.body_md ?? "",
          cover: r.cover_url,
          source: "db",
        });
      }
    } catch {
      /* fall back to built-in guides */
    }
  }
  return [...map.values()].sort((a, b) => b.published.localeCompare(a.published) || a.title.localeCompare(b.title));
});

export const getGuide = async (slug: string) => (await getAllGuides()).find((g) => g.slug === slug);

/* ----------------------------- calculator copy ----------------------------- */

interface CalcContentRow {
  slug: string;
  tagline: string | null;
  intro: string[] | null;
  steps: string[] | null;
  formula: string[] | null;
  example: string[] | null;
  tips: string[] | null;
  faqs: Faq[] | null;
}

const isStrings = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === "string");
const isFaqs = (v: unknown): v is Faq[] =>
  Array.isArray(v) && v.every((x) => x && typeof x.q === "string" && typeof x.a === "string");

export const getCalcOverride = cache(async (slug: string): Promise<CalcContentRow | null> => {
  const db = getSupabase();
  if (!db) return null;
  try {
    const { data } = await db.from("calculator_content").select("*").eq("slug", slug).maybeSingle();
    return (data as CalcContentRow | null) ?? null;
  } catch {
    return null;
  }
});

/** Merge admin-edited copy over the built-in copy. Formulas of the calculator itself stay in code. */
export function mergeCalcContent(base: CalculatorMeta, o: CalcContentRow | null): CalculatorMeta {
  if (!o) return base;
  return {
    ...base,
    tagline: o.tagline?.trim() ? o.tagline : base.tagline,
    intro: isStrings(o.intro) && o.intro.length ? o.intro : base.intro,
    steps: isStrings(o.steps) && o.steps.length ? o.steps : base.steps,
    formula: isStrings(o.formula) && o.formula.length ? o.formula : base.formula,
    example: isStrings(o.example) && o.example.length ? o.example : base.example,
    tips: isStrings(o.tips) && o.tips.length ? o.tips : base.tips,
    faqs: isFaqs(o.faqs) && o.faqs.length ? o.faqs : base.faqs,
  };
}

export async function getTool(slug: string): Promise<CalculatorMeta | undefined> {
  const base = CALCULATORS.find((c) => c.slug === slug);
  if (!base) return undefined;
  return mergeCalcContent(base, await getCalcOverride(slug));
}

/** Every tool with admin edits applied (used for lists and cards). */
export const getAllTools = cache(async (): Promise<CalculatorMeta[]> => {
  const db = getSupabase();
  let rows: CalcContentRow[] = [];
  if (db) {
    try {
      const { data } = await db.from("calculator_content").select("*");
      rows = (data ?? []) as CalcContentRow[];
    } catch {
      rows = [];
    }
  }
  const by = new Map(rows.map((r) => [r.slug, r]));
  return CALCULATORS.map((c) => mergeCalcContent(c, by.get(c.slug) ?? null));
});

/* ----------------------------- SEO overrides ----------------------------- */

export interface SeoOverride {
  path: string;
  title: string | null;
  description: string | null;
  canonical: string | null;
  og_image: string | null;
  noindex: boolean;
}

export const getSeoOverride = cache(async (path: string): Promise<SeoOverride | null> => {
  const db = getSupabase();
  if (!db) return null;
  try {
    const { data } = await db.from("seo_overrides").select("*").eq("path", path).maybeSingle();
    return (data as SeoOverride | null) ?? null;
  } catch {
    return null;
  }
});

/** Paths marked noindex (kept out of the sitemap). */
export const getNoindexPaths = cache(async (): Promise<Set<string>> => {
  const db = getSupabase();
  if (!db) return new Set();
  try {
    const { data } = await db.from("seo_overrides").select("path").eq("noindex", true);
    return new Set((data ?? []).map((r: { path: string }) => r.path));
  } catch {
    return new Set();
  }
});

/* ----------------------------- site settings ----------------------------- */

export interface SiteConfig {
  adsenseClient: string;
  slotResults: string;
  slotContent: string;
  contactEmail: string;
  googleVerification: string;
}

export const SETTING_KEYS = ["adsense_client", "adsense_slot_results", "adsense_slot_content", "contact_email", "google_verification"] as const;

/** Settings from the database, falling back to environment variables. */
export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  const stored: Record<string, string> = {};
  const db = getSupabase();
  if (db) {
    try {
      const { data } = await db.from("site_settings").select("key,value");
      for (const r of (data ?? []) as { key: string; value: string }[]) stored[r.key] = r.value;
    } catch {
      /* use env */
    }
  }
  const pick = (key: string, env: string | undefined, fallback = "") => (stored[key]?.trim() ? stored[key].trim() : (env ?? fallback));
  return {
    adsenseClient: pick("adsense_client", process.env.NEXT_PUBLIC_ADSENSE_CLIENT),
    slotResults: pick("adsense_slot_results", process.env.NEXT_PUBLIC_ADSENSE_SLOT_RESULTS),
    slotContent: pick("adsense_slot_content", process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT),
    contactEmail: pick("contact_email", process.env.NEXT_PUBLIC_CONTACT_EMAIL, SITE.email),
    googleVerification: pick("google_verification", undefined),
  };
});
