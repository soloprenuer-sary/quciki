import { cache } from "react";
import { CALCULATORS, type CalculatorMeta, type Faq } from "./calculators";
import { CATEGORIES, type Category, type CategorySlug } from "./categories";
import { entryDef } from "./content/entries";
import { defaultsOf, type EntryDef, type Fields, type ListField, type TextField, type Values } from "./content/types";
import { isSafeUrl, parseLines, parseParagraphs } from "./parse";
import { SITE } from "./site";
import { cleanHtml, loadWp, type WpMenuItem } from "./wp";

/*
 * Resolves editable content: defaults in code, overridden by the values editors saved in WordPress.
 * Every stored value is validated against its field definition. Anything invalid is ignored and the default is used.
 */

type Vars = Record<string, string>;

const TOKEN = /\{([a-z]+)\}/g;
export const fill = (s: string, vars: Vars): string => s.replace(TOKEN, (m, k: string) => (k in vars ? vars[k] : m));

const MAX_LONG = 60_000;

function cleanText(f: TextField, v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = f.type === "textarea" || f.type === "richtext" ? v.replace(/\r\n/g, "\n").trim() : v.replace(/\s+/g, " ").trim();
  if (!t) return f.optional || f.default === "" ? "" : undefined;
  const cap = f.type === "richtext" ? MAX_LONG : (f.max ?? 2000);
  if (t.length > cap) return undefined;
  if (f.type === "url" || f.type === "image") return isSafeUrl(t) ? t : undefined;
  if (f.type === "date") return /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : undefined;
  if (f.type === "richtext") return cleanHtml(t);
  return t;
}

function cleanList(f: ListField, v: unknown): Record<string, string>[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const rows: Record<string, string>[] = [];
  for (const raw of v.slice(0, f.max)) {
    if (!raw || typeof raw !== "object") continue;
    const row: Record<string, string> = {};
    let any = false;
    for (const [k, sub] of Object.entries(f.item)) {
      const c = cleanText(sub, (raw as Record<string, unknown>)[k]) ?? "";
      row[k] = c;
      if (c) any = true;
    }
    if (any) rows.push(row);
  }
  return rows.length ? rows : undefined;
}

function resolveFields(fields: Fields, stored: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = defaultsOf(fields);
  for (const [k, f] of Object.entries(fields)) {
    if (!(k in stored)) continue;
    const v = f.type === "list" ? cleanList(f, stored[k]) : cleanText(f, stored[k]);
    if (v !== undefined) out[k] = v;
  }
  return out;
}

function fillAll(fields: Fields, values: Record<string, unknown>, vars: Vars): void {
  for (const [k, f] of Object.entries(fields)) {
    if (f.type === "list") {
      const rows = values[k] as Record<string, string>[];
      for (const row of rows) for (const [sk, sf] of Object.entries(f.item)) if (isFillable(sf)) row[sk] = fill(row[sk] ?? "", vars);
    } else if (isFillable(f)) {
      values[k] = fill(String(values[k] ?? ""), vars);
    }
  }
}
const isFillable = (f: TextField) => f.type === "text" || f.type === "textarea" || f.type === "richtext";

export interface Resolved {
  values: Record<string, unknown>;
  reviewedBy: string | null;
  reviewedAt: string | null;
  updated: string | null;
}

/** Site-wide variables usable as {name}, {tagline}, {year}, {reviewed}, {email}, {url} in any text. */
export const siteVars = cache(async (): Promise<Vars> => {
  const wp = await loadWp();
  const def = entryDef("site")!;
  const v = resolveFields(def.fields, wp?.entries["site"]?.values ?? {});
  const year = String(new Date().getFullYear());
  const base: Vars = { year, url: SITE.url };
  const text = (k: string) => fill(String(v[k] ?? ""), base);
  const name = text("name");
  const email = wp?.settings.contact_email?.trim() || process.env.NEXT_PUBLIC_CONTACT_EMAIL || SITE.email;
  return { ...base, name, tagline: fill(text("tagline"), { ...base, name }), reviewed: text("reviewed"), email };
});

/** Values of one entry by key, with defaults, validation and tokens applied. */
export const resolveEntry = cache(async (key: string): Promise<Resolved> => {
  const def = entryDef(key);
  if (!def) throw new Error(`Unknown content entry: ${key}`);
  const wp = await loadWp();
  const stored = wp?.entries[key];
  const values = resolveFields(def.fields, stored?.values ?? {});
  fillAll(def.fields, values, await siteVars());
  return {
    values,
    reviewedBy: stored?.reviewedBy ?? null,
    reviewedAt: stored?.reviewedAt ?? null,
    updated: stored?.updated ?? null,
  };
});

/** Typed values for an entry defined in `lib/content/entries.ts`. */
export async function content<F extends Fields>(def: EntryDef<F>): Promise<Values<F>> {
  return (await resolveEntry(def.key)).values as Values<F>;
}

/* ------------------------------ site ------------------------------ */

export interface SiteInfo {
  name: string;
  tagline: string;
  reviewed: string;
}

export async function getSiteInfo(): Promise<SiteInfo> {
  const v = await siteVars();
  return { name: v.name, tagline: v.tagline, reviewed: v.reviewed };
}

/* ------------------------------ categories ------------------------------ */

export const getCategories = cache(async (): Promise<Category[]> => {
  const out: Category[] = [];
  for (const c of CATEGORIES) {
    const v = (await resolveEntry(`category-${c.slug}`)).values;
    out.push({
      ...c,
      name: String(v.name),
      short: String(v.short),
      tagline: String(v.tagline),
      intro: parseParagraphs(String(v.intro)),
    });
  }
  return out;
});

export async function getCategory(slug: string): Promise<Category | undefined> {
  return (await getCategories()).find((c) => c.slug === slug);
}

/* ------------------------------ calculators ------------------------------ */

export interface InputText {
  label?: string;
  help?: string;
  prefix?: string;
  suffix?: string;
}

function mergeCalc(base: CalculatorMeta, v: Record<string, unknown>): CalculatorMeta {
  const faqs = (v.faqs as { q: string; a: string }[]).filter((f) => f.q && f.a) as Faq[];
  const steps = parseLines(String(v.steps));
  const formula = parseLines(String(v.formula));
  const tips = parseLines(String(v.tips));
  const intro = parseParagraphs(String(v.intro));
  const example = parseParagraphs(String(v.example));
  return {
    ...base,
    name: String(v.name) || base.name,
    tagline: String(v.tagline) || base.tagline,
    intro: intro.length ? intro : base.intro,
    steps: steps.length ? steps : base.steps,
    formula: formula.length ? formula : base.formula,
    example: example.length ? example : base.example,
    tips: tips.length ? tips : base.tips,
    faqs: faqs.length ? faqs : base.faqs,
  };
}

export const getTool = cache(async (slug: string): Promise<CalculatorMeta | undefined> => {
  const base = CALCULATORS.find((c) => c.slug === slug);
  if (!base) return undefined;
  return mergeCalc(base, (await resolveEntry(`calc-${slug}`)).values);
});

export const getAllTools = cache(async (): Promise<CalculatorMeta[]> => {
  const out: CalculatorMeta[] = [];
  for (const c of CALCULATORS) out.push((await getTool(c.slug))!);
  return out;
});

/** Edited labels for the calculator's inputs, keyed by input key. */
export async function getInputText(slug: string): Promise<Record<string, InputText>> {
  const entry = entryDef(`calc-${slug}`);
  if (!entry) return {};
  const v = (await resolveEntry(entry.key)).values;
  const out: Record<string, InputText> = {};
  for (const k of Object.keys(entry.fields)) {
    const m = /^in_(.+)_(label|help|prefix|suffix)$/.exec(k);
    if (!m) continue;
    (out[m[1]] ??= {})[m[2] as keyof InputText] = String(v[k] ?? "");
  }
  return out;
}

/** Reviewer sign-off saved for an entry, if any. */
export async function getReview(key: string): Promise<{ by: string | null; at: string | null }> {
  const r = await resolveEntry(key);
  return { by: r.reviewedBy, at: r.reviewedAt };
}

/* ------------------------------ menus ------------------------------ */

export type MenuName = "header" | "footer_calculators" | "footer_company";

export async function getMenu(name: MenuName): Promise<WpMenuItem[]> {
  const stored = (await loadWp())?.menus[name];
  if (stored?.length) return stored;
  const cats = await getCategories();
  switch (name) {
    case "header":
      return [
        ...cats.map((c) => ({ label: c.short, url: `/${c.slug}` })),
        { label: "All tools", url: "/calculators" },
        { label: "Guides", url: "/guides" },
        { label: "About", url: "/about" },
        { label: "Contact", url: "/contact" },
      ];
    case "footer_calculators":
      return [...cats.map((c) => ({ label: c.name, url: `/${c.slug}` })), { label: "Guides", url: "/guides" }];
    case "footer_company":
      return [
        { label: "About Us", url: "/about" },
        { label: "Contact Us", url: "/contact" },
        { label: "Privacy Policy", url: "/privacy-policy" },
        { label: "Terms of Use", url: "/terms" },
        { label: "Disclaimer", url: "/disclaimer" },
      ];
  }
}

export type { CategorySlug };
