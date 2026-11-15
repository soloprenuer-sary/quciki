import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES, categoryBySlug } from "@/lib/categories";
import { content, getAllTools, getCategory, getSiteInfo } from "@/lib/content";
import { SITE_ENTRY } from "@/lib/content/entries";
import { toolPath } from "@/lib/calculators";
import { getAllGuides } from "@/lib/cms";
import { withSeo } from "@/lib/seo";
import { abs } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";

// Unknown categories return a real HTTP 404.
export const dynamicParams = false;
export const revalidate = 3600;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[category]">): Promise<Metadata> {
  const { category } = await params;
  const cat = categoryBySlug(category); // search title and description come from code or the SEO box
  if (!cat) return {};
  return withSeo(`/${cat.slug}`, {
    title: cat.metaTitle,
    description: cat.metaDescription,
    alternates: { canonical: `/${cat.slug}` },
    openGraph: { title: cat.metaTitle, description: cat.metaDescription, url: `/${cat.slug}`, type: "website" },
  });
}

export default async function CategoryPage({ params }: PageProps<"/[category]">) {
  const { category } = await params;
  const cat = await getCategory(category);
  if (!cat) notFound();
  const site = await content(SITE_ENTRY);
  const info = await getSiteInfo();

  const tools = (await getAllTools()).filter((c) => c.category === cat.slug);
  const guides = (await getAllGuides()).filter((g) => g.category === cat.slug);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: cat.name,
              description: cat.metaDescription,
              url: abs(`/${cat.slug}`),
              isPartOf: { "@type": "WebSite", name: info.name, url: abs("/") },
            },
            {
              "@type": "ItemList",
              itemListElement: tools.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: abs(toolPath(c)), name: c.name })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: site.homeLabel, item: abs("/") },
                { "@type": "ListItem", position: 2, name: cat.short, item: abs(`/${cat.slug}`) },
              ],
            },
          ],
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-2 text-sm text-muted">
        <Link href="/" className="hover:text-brand">{site.homeLabel}</Link> / {cat.short}
      </nav>
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{cat.name}</h1>
      <p className="mt-2 max-w-2xl text-lg text-muted">{cat.tagline}</p>
      <div className="prose-pc mt-4 max-w-3xl">
        {cat.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {cat.groups.map((g) => {
        const items = tools.filter((t) => t.group === g);
        if (!items.length) return null;
        return (
          <section key={g} className="mt-10">
            <h2 className="text-xl font-bold">{g}</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c) => (
                <Link key={c.slug} href={toolPath(c)} className="rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:border-brand">
                  <h3 className="text-lg font-bold">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted">{c.tagline}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-brand">{site.openLabel}</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {guides.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold">Guides</h2>
          <div className="mt-4 grid gap-5 md:grid-cols-3">
            {guides.map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className="rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:border-brand">
                <h3 className="font-bold leading-snug">{g.title}</h3>
                <p className="mt-2 text-sm text-muted">{g.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
