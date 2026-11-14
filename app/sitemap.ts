import type { MetadataRoute } from "next";
import { CALCULATORS, toolPath } from "@/lib/calculators";
import { CATEGORIES } from "@/lib/categories";
import { getAllGuides, getNoindexPaths } from "@/lib/cms";
import { abs } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const noindex = await getNoindexPaths(); // pages the admin marked noindex stay out of the sitemap
  const guides = await getAllGuides();
  const staticPages = ["/", "/calculators", "/guides", "/about", "/contact", "/privacy-policy", "/terms", "/disclaimer"];

  type Entry = MetadataRoute.Sitemap[number] & { path: string };
  const entries: Entry[] = [
    ...staticPages.map((p) => ({ url: abs(p), path: p, priority: p === "/" ? 1 : 0.5 })),
    ...CATEGORIES.map((c) => ({ url: abs(`/${c.slug}`), path: `/${c.slug}`, priority: 0.8 })),
    ...CALCULATORS.map((c) => ({ url: abs(toolPath(c)), path: toolPath(c), priority: 0.9 })),
    ...guides.map((g) => ({ url: abs(`/guides/${g.slug}`), path: `/guides/${g.slug}`, lastModified: g.updated, priority: 0.7 })),
  ];
  return entries.filter((e) => !noindex.has(e.path)).map((e) => ({ url: e.url, lastModified: e.lastModified, priority: e.priority }));
}
