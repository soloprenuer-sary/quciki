import { cache } from "react";
import { cookies, draftMode } from "next/headers";
import sanitizeHtml from "sanitize-html";
import { CATEGORIES, type CategorySlug } from "./categories";
import { SLUG_RE, isSafeUrl, normalizePath } from "./parse";

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

export interface WpEntry {
  /** Only the fields an editor changed. Everything else uses the defaults in code. */
  values: Record<string, unknown>;
  reviewedBy: string | null;
  reviewedAt: string | null;
  updated: string;
}

export interface WpMenuItem {
  label: string;
  url: string;
}

export interface WpContent {
  guides: WpGuide[];
  entries: Record<string, WpEntry>;
  menus: Record<string, WpMenuItem[]>;
  seo: WpSeo[];
  redirects: WpRedirect[];
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

const KEY_RE = /^[a-z0-9][a-z0-9-]{0,80}$/;
const dateOrNull = (v: unknown): string | null => {
  const t = str(v, 40);
  return t && !Number.isNaN(Date.parse(t)) ? new Date(t).toISOString() : null;
};

function toEntries(v: unknown): Record<string, WpEntry> {
  const out: Record<string, WpEntry> = {};
  const r = rec(v);
  if (!r) return out;
  for (const [key, raw] of Object.entries(r)) {
    const e = rec(raw);
    const values = e ? rec(e.values) : null;
    if (!KEY_RE.test(key) || !e || !values) continue;
    out[key] = {
      values,
      reviewedBy: str(e.reviewed_by, 200).trim() || null,
      reviewedAt: dateOrNull(e.reviewed_at),
      updated: isoOrNow(e.updated_at),
    };
  }
  return out;
}

function toMenus(v: unknown): Record<string, WpMenuItem[]> {
  const out: Record<string, WpMenuItem[]> = {};
  const r = rec(v);
  if (!r) return out;
  for (const [name, items] of Object.entries(r)) {
    if (!/^[a-z_]{1,40}$/.test(name)) continue;
    const rows: WpMenuItem[] = [];
    for (const it of list(items).slice(0, 20)) {
      const o = rec(it);
      const label = o ? str(o.label, 80).trim() : "";
      const url = o ? str(o.url, 500).trim() : "";
      if (label && url && isSafeUrl(url)) rows.push({ label, url });
    }
    if (rows.length) out[name] = rows;
  }
  return out;
}

export function normalize(raw: unknown): WpContent | null {
  const r = rec(raw);
  if (!r) return null;
  const settings: Record<string, string> = {};
  const s = rec(r.settings);
  if (s) for (const [k, val] of Object.entries(s)) if (typeof val === "string" && /^[a-z_]{1,40}$/.test(k)) settings[k] = val.trim().slice(0, 300);
  return {
    guides: list(r.guides).map(toGuide).filter((x): x is WpGuide => !!x),
    entries: toEntries(r.entries),
    menus: toMenus(r.menus),
    seo: list(r.seo).map(toSeo).filter((x): x is WpSeo => !!x),
    redirects: list(r.redirects).map(toRedirect).filter((x): x is WpRedirect => !!x),
    settings,
  };
}

/* ------------------------------ loading ------------------------------ */

export const wpBase = () => (process.env.WORDPRESS_URL ?? "").trim().replace(/\/+$/, "");
export const wpConfigured = () => /^https?:\/\//.test(wpBase());
export const wpEndpoint = () => `${wpBase()}/wp-json/quciki/v1/content`;

export const PREVIEW_COOKIE = "qk_preview";

/** Preview token of the editor currently previewing a draft, or null for normal visitors. */
async function previewToken(): Promise<string | null> {
  try {
    if (!(await draftMode()).isEnabled) return null;
    const t = (await cookies()).get(PREVIEW_COOKIE)?.value ?? "";
    return /^[a-f0-9]{32}$/.test(t) ? t : null;
  } catch {
    return null;
  }
}

const isBuildPhase = () => process.env.NEXT_PHASE === "phase-production-build";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchContent(token: string | null, attempts: number[] = [0, 400, 1200]): Promise<WpContent> {
  let last: unknown = new Error("WordPress did not answer");
  for (const wait of attempts) {
    if (wait) await sleep(wait);
    try {
      const res = token
        ? await fetch(`${wpBase()}/wp-json/quciki/v1/preview`, {
            headers: {
              Accept: "application/json",
              "x-revalidate-secret": process.env.REVALIDATE_SECRET ?? "",
              "x-preview-token": token,
            },
            signal: AbortSignal.timeout(8000),
            cache: "no-store",
          })
        : await fetch(wpEndpoint(), {
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(8000),
            next: { revalidate: 3600, tags: [WP_TAG] },
          });
      if (res.status === 401 && token) throw new Error("Preview expired"); // do not retry an expired preview
      if (!res.ok) throw new Error(`WordPress answered ${res.status}`);
      const content = normalize(await res.json());
      if (!content) throw new Error("WordPress returned unexpected data");
      return content;
    } catch (err) {
      last = err;
      if (err instanceof Error && err.message === "Preview expired") break;
    }
  }
  throw last;
}

let buildRequest: Promise<WpContent | null> | null = null;

export const loadWp = cache(async (): Promise<WpContent | null> => {
  if (!wpConfigured()) return null;
  const token = await previewToken();
  if (!token && isBuildPhase()) {
    buildRequest ??= fetchContent(null, [0, 1000, 2500, 5000, 10000]).catch((err) => {
      const why = err instanceof Error ? err.message : String(err);
      if (process.env.QUCIKI_ALLOW_BUILD_FALLBACK === "1") {
        console.warn(`[quciki] WordPress unreachable during build (${why}). Building with the built-in content.`);
        return null;
      }
      throw new Error(`WordPress is configured (${wpBase()}) but could not be read during the build: ${why}. Fix WORDPRESS_URL or WordPress, or set QUCIKI_ALLOW_BUILD_FALLBACK=1 to build with the built-in content.`);
    });
    return buildRequest;
  }
  try {
    return await fetchContent(token);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") return null;
    throw err;
  }
});
