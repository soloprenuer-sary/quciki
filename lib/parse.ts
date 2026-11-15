import type { Faq } from "./calculators";

/** Paragraphs separated by a blank line. */
export const parseParagraphs = (text: string): string[] =>
  text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n+/g, " ").trim())
    .filter(Boolean);

/** One item per line. */
export const parseLines = (text: string): string[] =>
  text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

/**
 * FAQs written as:
 *   Q: question
 *   A: answer
 * (blank line between items). Returns null and an error message when a block is malformed.
 */
export function parseFaqs(text: string): { faqs: Faq[]; error?: string } {
  const faqs: Faq[] = [];
  const blocks = text.replace(/\r\n/g, "\n").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  for (const [i, block] of blocks.entries()) {
    const m = block.match(/^Q:\s*([\s\S]+?)\n\s*A:\s*([\s\S]+)$/i);
    if (!m) return { faqs: [], error: `FAQ ${i + 1} must be "Q: question" on one line and "A: answer" on the next.` };
    const q = m[1].replace(/\s+/g, " ").trim();
    const a = m[2].replace(/\s+/g, " ").trim();
    if (!q || !a) return { faqs: [], error: `FAQ ${i + 1} has an empty question or answer.` };
    faqs.push({ q, a });
  }
  return { faqs };
}

export const faqsToText = (faqs: Faq[]) => faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");

/* ----------------------------- validation ----------------------------- */

export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const isSlug = (s: string) => s.length >= 2 && s.length <= 100 && SLUG_RE.test(s);

/** Empty, a site path ("/x"), or an https URL. Blocks javascript:, data: and protocol-relative URLs. */
export function isSafeUrl(u: string): boolean {
  if (!u) return true;
  if (u.length > 500) return false;
  if (u.startsWith("/") && !u.startsWith("//") && !/\s/.test(u)) return true;
  try {
    const url = new URL(u);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Paths that redirects may never touch. */
export const isProtectedPath = (p: string) => /^\/(admin|api|_next)(\/|$)/.test(p);

export function normalizePath(p: string): string {
  const t = p.trim();
  if (t.length > 1 && t.endsWith("/")) return t.slice(0, -1);
  return t;
}
