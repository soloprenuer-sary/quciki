import { cache } from "react";
import { CALCULATORS, type CalculatorMeta } from "./calculators";
import { GUIDES as BUILTIN_GUIDES, guideToMarkdown } from "./guides";
import type { CategorySlug } from "./categories";
import { SITE } from "./site";
import { loadWp, type WpCalc, type WpPage } from "./wp";
import { normalizePath } from "./parse";

/* ------------------------------------------------------------------ */
/* Content layer: built-in content (in code) + content from WordPress. */
/* If WordPress is not configured or a request fails, the built-in    */
/* content is used, so the public site never breaks because of the CMS.*/
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
  /** Built-in guides are Markdown; WordPress guides are sanitized HTML. Exactly one is set. */
  bodyMd?: string;
  bodyHtml?: string;
  cover?: string | null;
  source: "code" | "wordpress";
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

/** All visible guides: built-in ones, replaced by a WordPress guide with the same slug, plus new WordPress guides. */
export const getAllGuides = cache(async (): Promise<GuideView[]> => {
  const map = new Map<string, GuideView>(builtinGuides().map((g) => [g.slug, g]));
  const wp = await loadWp();
  for (const g of wp?.guides ?? []) {
    map.set(g.slug, {
      slug: g.slug,
      category: g.category,
      title: g.title,
      description: g.description,
      published: g.published,
      updated: g.updated,
      calculator: g.calculator,
      bodyHtml: g.bodyHtml,
      cover: g.cover,
      source: "wordpress",
    });
  }
  return [...map.values()].sort((a, b) => b.published.localeCompare(a.published) || a.title.localeCompare(b.title));
});

export const getGuide = async (slug: string) => (await getAllGuides()).find((g) => g.slug === slug);

/* ----------------------------- calculator copy ----------------------------- */

export const getCalcOverride = cache(async (slug: string): Promise<WpCalc | null> => {
  const wp = await loadWp();
  return wp?.calculators.find((c) => c.slug === slug) ?? null;
});

/** Merge WordPress-edited copy over the built-in copy. The calculator's formulas stay in code. */
export function mergeCalcContent(base: CalculatorMeta, o: WpCalc | null): CalculatorMeta {
  if (!o) return base;
  return {
    ...base,
    tagline: o.tagline?.trim() ? o.tagline : base.tagline,
    intro: o.intro.length ? o.intro : base.intro,
    steps: o.steps.length ? o.steps : base.steps,
    formula: o.formula.length ? o.formula : base.formula,
    example: o.example.length ? o.example : base.example,
    tips: o.tips.length ? o.tips : base.tips,
    faqs: o.faqs.length ? o.faqs : base.faqs,
  };
}

export async function getTool(slug: string): Promise<CalculatorMeta | undefined> {
  const base = CALCULATORS.find((c) => c.slug === slug);
  if (!base) return undefined;
  return mergeCalcContent(base, await getCalcOverride(slug));
}

/** Every tool with WordPress edits applied (used for lists and cards). */
export const getAllTools = cache(async (): Promise<CalculatorMeta[]> => {
  const wp = await loadWp();
  const by = new Map((wp?.calculators ?? []).map((r) => [r.slug, r]));
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
  const wp = await loadWp();
  const want = normalizePath(path);
  return wp?.seo.find((s) => s.path === want) ?? null;
});

/** Paths marked noindex (kept out of the sitemap). */
export const getNoindexPaths = cache(async (): Promise<Set<string>> => {
  const wp = await loadWp();
  return new Set((wp?.seo ?? []).filter((s) => s.noindex).map((s) => s.path));
});

/* ----------------------------- legal / text pages ----------------------------- */

/** A page edited in WordPress (privacy-policy, terms, disclaimer), or null to use the built-in text. */
export const getWpPage = cache(async (slug: string): Promise<WpPage | null> => {
  const wp = await loadWp();
  return wp?.pages.find((p) => p.slug === slug) ?? null;
});

/* ----------------------------- site settings ----------------------------- */

export interface SiteConfig {
  adsenseClient: string;
  slotResults: string;
  slotContent: string;
  contactEmail: string;
  googleVerification: string;
}

/** Settings from WordPress, falling back to environment variables. */
export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  const stored = (await loadWp())?.settings ?? {};
  const pick = (key: string, env: string | undefined, fallback = "") => (stored[key]?.trim() ? stored[key].trim() : (env ?? fallback));
  return {
    adsenseClient: pick("adsense_client", process.env.NEXT_PUBLIC_ADSENSE_CLIENT),
    slotResults: pick("adsense_slot_results", process.env.NEXT_PUBLIC_ADSENSE_SLOT_RESULTS),
    slotContent: pick("adsense_slot_content", process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT),
    contactEmail: pick("contact_email", process.env.NEXT_PUBLIC_CONTACT_EMAIL, SITE.email),
    googleVerification: pick("google_verification", undefined),
  };
});
