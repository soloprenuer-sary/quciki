import { cache } from "react";
import sanitizeHtml from "sanitize-html";
import type { Faq } from "./calculators";
import { CATEGORIES, type CategorySlug } from "./categories";
import { SLUG_RE, isSafeUrl, normalizePath, parseFaqs, parseLines, parseParagraphs } from "./parse";

/*
 * WordPress is the content backend. One public JSON endpoint (see wordpress/quciki-headless) returns every
 * guide, calculator text, SEO override, redirect, legal page and public setting.
 *
 * Everything coming from WordPress is treated as untrusted: shapes are checked, URLs are validated and
 * HTML is sanitized here, once, so pages can render it directly. If WordPress is not configured or is
 * unreachable, load() returns null and the site uses its built-in content.
 */

export const WP_TAG = "wordpress";

export interface WpGuide {
  slug: string;
  category: CategorySlug;
  title: string;
  description: string;
  bodyHtml: string;
  cover: string | null;
  calculator?: string;
  published: string;
  updated: string;
}

export interface WpCalc {
  slug: string;
  tagline: string | null;
  intro: string[];
  steps: string[];
  formula: string[];
  example: string[];
  tips: string[];
  faqs: Faq[];
}

export interface WpSeo {
  path: string;
  title: string | null;
  description: string | null;
  canonical: string | null;
  og_image: string | null;
  noindex: boolean;
}

export interface WpRedirect {
  source: string;
  destination: string;
  permanent: boolean;
}

export interface WpPage {
  slug: string;
  title: string;
  bodyHtml: string;
  updated: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
}

export interface WpContent {
  guides: WpGuide[];
  calculators: WpCalc[];
  seo: WpSeo[];
  redirects: WpRedirect[];
  pages: WpPage[];
  settings: Record<string, string>;
}

/* ------------------------------ sanitizing ------------------------------ */

export function cleanHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "h2", "h3", "h4", "p", "br", "hr", "ul", "ol", "li", "strong", "b", "em", "i", "blockquote", "code", "pre",
      "a", "img", "figure", "figcaption", "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "title", "rel", "target"],
      img: ["src", "alt", "width", "height", "loading"],
      th: ["scope"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => {
        const external = /^https?:\/\//i.test(attribs.href ?? "");
        return { tagName, attribs: { ...attribs, ...(external ? { rel: "noopener noreferrer" } : {}) } };
      },
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }),
    },
  });
}

/* ------------------------------ validation ------------------------------ */

const str = (v: unknown, max = 2000): string => (typeof v === "string" ? v.slice(0, max) : "");
const rec = (v: unknown): Record<string, unknown> | null => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null);
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const isoOrNow = (v: unknown): string => {
  const s = str(v, 40);
  return s && !Number.isNaN(Date.parse(s)) ? new Date(s).toISOString() : new Date(0).toISOString();
};
const safeUrl = (v: unknown): string | null => {
  const s = str(v, 500).trim();
  return s && isSafeUrl(s) ? s : null;
};

const CATEGORY_SLUGS = new Set<string>(CATEGORIES.map((c) => c.slug));

function toGuide(v: unknown): WpGuide | null {
  const r = rec(v);
  if (!r) return null;
  const slug = str(r.slug, 100);
  const title = str(r.title, 200).trim();
  const category = str(r.category, 40);
  if (!SLUG_RE.test(slug) || !title || !CATEGORY_SLUGS.has(category)) return null;
  const calc = str(r.calculator_slug, 100);
  return {
    slug,
    category: category as CategorySlug,
    title,
    description: str(r.description, 400).trim(),
    bodyHtml: cleanHtml(str(r.body_html, 300_000)),
    cover: safeUrl(r.cover_url),
    calculator: SLUG_RE.test(calc) ? calc : undefined,
    published: isoOrNow(r.published_at),
    updated: isoOrNow(r.updated_at),
  };
}

function toCalc(v: unknown): WpCalc | null {
  const r = rec(v);
  if (!r) return null;
  const slug = str(r.slug, 100);
  if (!SLUG_RE.test(slug)) return null;
  const faqs = parseFaqs(str(r.faqs, 30_000));
  return {
    slug,
    tagline: str(r.tagline, 300).trim() || null,
    intro: parseParagraphs(str(r.intro, 30_000)),
    steps: parseLines(str(r.steps, 10_000)),
    formula: parseLines(str(r.formula, 10_000)),
    example: parseParagraphs(str(r.example, 30_000)),
    tips: parseLines(str(r.tips, 10_000)),
    faqs: faqs.error ? [] : faqs.faqs,
  };
}

function toSeo(v: unknown): WpSeo | null {
  const r = rec(v);
  if (!r) return null;
  const path = normalizePath(str(r.path, 300));
  if (!path.startsWith("/") || path.startsWith("//") || /\s/.test(path)) return null;
  return {
    path,
    title: str(r.title, 200).trim() || null,
    description: str(r.description, 400).trim() || null,
    canonical: safeUrl(r.canonical),
    og_image: safeUrl(r.og_image),
    noindex: r.noindex === true || r.noindex === "1" || r.noindex === 1,
  };
}

function toRedirect(v: unknown): WpRedirect | null {
  const r = rec(v);
  if (!r) return null;
  const source = normalizePath(str(r.source, 300));
  const destination = normalizePath(str(r.destination, 500));
  if (!source.startsWith("/") || source.startsWith("//") || /[\s?#]/.test(source)) return null;
  if (/^\/(api|_next)(\/|$)/.test(source)) return null;
  if (source === destination || !isSafeUrl(destination) || !destination) return null;
  return { source, destination, permanent: r.permanent !== false && r.permanent !== "0" && r.permanent !== 0 };
}

function toPage(v: unknown): WpPage | null {
  const r = rec(v);
  if (!r) return null;
  const slug = str(r.slug, 100);
  const title = str(r.title, 200).trim();
  if (!SLUG_RE.test(slug) || !title) return null;
  const reviewed = str(r.reviewed_at, 40);
  return {
    slug,
    title,
    bodyHtml: cleanHtml(str(r.body_html, 300_000)),
    updated: isoOrNow(r.updated_at),
    reviewedAt: reviewed && !Number.isNaN(Date.parse(reviewed)) ? new Date(reviewed).toISOString() : null,
    reviewedBy: str(r.reviewed_by, 200).trim() || null,
  };
}

export function normalize(raw: unknown): WpContent | null {
  const r = rec(raw);
  if (!r) return null;
  const settings: Record<string, string> = {};
  const s = rec(r.settings);
  if (s) for (const [k, val] of Object.entries(s)) if (typeof val === "string" && /^[a-z_]{1,40}$/.test(k)) settings[k] = val.trim().slice(0, 300);
  return {
    guides: list(r.guides).map(toGuide).filter((x): x is WpGuide => !!x),
    calculators: list(r.calculators).map(toCalc).filter((x): x is WpCalc => !!x),
    seo: list(r.seo).map(toSeo).filter((x): x is WpSeo => !!x),
    redirects: list(r.redirects).map(toRedirect).filter((x): x is WpRedirect => !!x),
    pages: list(r.pages).map(toPage).filter((x): x is WpPage => !!x),
    settings,
  };
}

/* ------------------------------ loading ------------------------------ */

export const wpBase = () => (process.env.WORDPRESS_URL ?? "").trim().replace(/\/+$/, "");
export const wpConfigured = () => /^https?:\/\//.test(wpBase());
export const wpEndpoint = () => `${wpBase()}/wp-json/quciki/v1/content`;

/** WordPress content, or null when WordPress is not configured or not reachable (callers use built-in content). */
export const loadWp = cache(async (): Promise<WpContent | null> => {
  if (!wpConfigured()) return null;
  try {
    const res = await fetch(wpEndpoint(), {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 3600, tags: [WP_TAG] },
    });
    if (!res.ok) return null;
    return normalize(await res.json());
  } catch {
    return null;
  }
});
