import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GUIDES } from "@/lib/guides";
import { getAllGuides, getGuide, getSiteConfig, getTool } from "@/lib/cms";
import { toolPath } from "@/lib/calculators";
import { splitHtmlSections, splitSections } from "@/lib/markdown";
import { withSeo } from "@/lib/seo";
import { SITE, abs } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/AdSlot";
import { Markdown } from "@/components/Markdown";
import { RichHtml } from "@/components/RichHtml";

// Guides published in WordPress are rendered on first request and then cached.
// Re-check once an hour so scheduled guides appear; publishing in WordPress refreshes immediately via /api/revalidate.
export const revalidate = 3600;

export async function generateStaticParams() {
  const guides = await getAllGuides();
  return (guides.length ? guides : GUIDES).map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const g = await getGuide(slug);
  if (!g) return {};
  const path = `/guides/${g.slug}`;
  return withSeo(path, {
    title: g.title,
    description: g.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: g.title,
      description: g.description,
      publishedTime: g.published,
      modifiedTime: g.updated,
      ...(g.cover ? { images: [{ url: g.cover }] } : {}),
    },
  });
}

const fmtDate = (iso: string) => iso.slice(0, 10);

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const g = await getGuide(slug);
  if (!g) notFound();
  const calc = g.calculator ? await getTool(g.calculator) : undefined;
  const config = await getSiteConfig();
  const isHtml = typeof g.bodyHtml === "string";
  const sections = isHtml ? splitHtmlSections(g.bodyHtml ?? "") : splitSections(g.bodyMd ?? "");

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: g.title,
          description: g.description,
          datePublished: g.published,
          dateModified: g.updated,
          mainEntityOfPage: abs(`/guides/${g.slug}`),
          ...(g.cover ? { image: g.cover } : {}),
          author: { "@type": "Organization", name: SITE.name },
          publisher: { "@type": "Organization", name: SITE.name },
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-2 text-sm text-muted">
        <Link href="/" className="hover:text-brand">Home</Link> / <Link href="/guides" className="hover:text-brand">Guides</Link>
      </nav>
      <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">{g.title}</h1>
      <p className="mt-2 text-sm text-muted">
        Published {fmtDate(g.published)}
        {fmtDate(g.updated) !== fmtDate(g.published) ? ` · Last updated ${fmtDate(g.updated)}` : ""}
      </p>

      <article className="prose-pc mt-6">
        {g.description && <p className="text-lg text-muted">{g.description}</p>}
        {g.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={g.cover} alt="" className="my-4 h-auto w-full rounded-xl" />
        )}
        {sections.map((md, i) => (
          <section key={i}>
            {isHtml ? <RichHtml html={md} /> : <Markdown>{md}</Markdown>}
            {i === 1 && <AdSlot client={config.adsenseClient} slot={config.slotContent || undefined} className="my-6" />}
          </section>
        ))}
        {calc && (
          <p className="mt-8 rounded-xl bg-brand-soft p-4">
            Try it with your own numbers: <Link href={toolPath(calc)}>{calc.name}</Link>.
          </p>
        )}
        <p className="mt-6 text-sm text-muted">This guide is educational and is not financial, legal or engineering advice.</p>
      </article>
    </main>
  );
}
