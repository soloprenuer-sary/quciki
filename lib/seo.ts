import type { Metadata } from "next";
import { getSeoOverride } from "./cms";

/**
 * Applies admin SEO overrides (title, description, canonical, noindex, social image) for a URL path
 * on top of the page's default metadata.
 */
export async function withSeo(path: string, base: Metadata): Promise<Metadata> {
  const o = await getSeoOverride(path);
  if (!o) return base;

  const next: Metadata = { ...base };
  const title = o.title?.trim();
  const description = o.description?.trim();

  if (title) next.title = { absolute: title };
  if (description) next.description = description;
  if (o.canonical?.trim()) next.alternates = { ...(base.alternates ?? {}), canonical: o.canonical.trim() };
  if (o.noindex) next.robots = { index: false, follow: true };

  const og = { ...(base.openGraph ?? {}) } as NonNullable<Metadata["openGraph"]>;
  if (title) og.title = title;
  if (description) og.description = description;
  if (o.og_image?.trim()) og.images = [{ url: o.og_image.trim() }];
  next.openGraph = og;

  if (title || description || o.og_image) {
    next.twitter = {
      ...(base.twitter ?? {}),
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(o.og_image?.trim() ? { images: [o.og_image.trim()] } : {}),
    } as Metadata["twitter"];
  }
  return next;
}
