import Link from "next/link";
import type { Metadata } from "next";
import { getAllGuides } from "@/lib/cms";
import { content } from "@/lib/content";
import { GUIDES_INDEX_ENTRY } from "@/lib/content/entries";
import { withSeo } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/guides", {
    title: "Guides",
    description: "Plain-English guides to buying vs renting, rental returns, construction quantities, personal finance, cars and business pricing.",
    alternates: { canonical: "/guides" },
  });
}

export default async function GuidesIndex() {
  const guides = await getAllGuides();
  const page = await content(GUIDES_INDEX_ENTRY);
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{page.heading}</h1>
      <p className="mt-2 text-muted">{page.intro}</p>
      <div className="mt-8 grid gap-5">
        {guides.map((g) => (
          <Link key={g.slug} href={`/guides/${g.slug}`} className="rounded-2xl border border-line bg-surface p-6 shadow-card transition hover:border-brand">
            <h2 className="text-xl font-bold leading-snug">{g.title}</h2>
            <p className="mt-2 text-muted">{g.description}</p>
            <p className="mt-3 text-xs text-muted">{page.publishedLabel} {g.published.slice(0, 10)}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
