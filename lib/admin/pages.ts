import { CALCULATORS, toolPath } from "../calculators";
import { CATEGORIES } from "../categories";
import { getAllGuides } from "../cms";

export interface PageEntry {
  path: string;
  label: string;
  kind: "Page" | "Category" | "Calculator" | "Guide";
  /** Default SEO text, when it is known. */
  title: string;
  description: string;
  usesTemplate: boolean;
}

const STATIC: { path: string; label: string }[] = [
  { path: "/", label: "Home" },
  { path: "/calculators", label: "All calculators" },
  { path: "/guides", label: "Guides index" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
  { path: "/privacy-policy", label: "Privacy Policy" },
  { path: "/terms", label: "Terms of Use" },
  { path: "/disclaimer", label: "Disclaimer" },
];

/** Every public page whose SEO can be overridden. */
export async function listPages(): Promise<PageEntry[]> {
  const guides = await getAllGuides();
  return [
    ...STATIC.map((s) => ({ path: s.path, label: s.label, kind: "Page" as const, title: s.label, description: "Built-in description", usesTemplate: s.path !== "/" })),
    ...CATEGORIES.map((c) => ({ path: `/${c.slug}`, label: c.name, kind: "Category" as const, title: c.metaTitle, description: c.metaDescription, usesTemplate: true })),
    ...CALCULATORS.map((c) => ({ path: toolPath(c), label: c.name, kind: "Calculator" as const, title: c.metaTitle, description: c.metaDescription, usesTemplate: true })),
    ...guides.map((g) => ({ path: `/guides/${g.slug}`, label: g.title, kind: "Guide" as const, title: g.title, description: g.description, usesTemplate: true })),
  ];
}
