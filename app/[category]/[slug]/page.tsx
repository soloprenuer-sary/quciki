import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CALCULATORS, bySlug, toolPath } from "@/lib/calculators";
import { categoryBySlug } from "@/lib/categories";
import { getAllTools, getGuide, getSiteConfig, getTool } from "@/lib/cms";
import { withSeo } from "@/lib/seo";
import { SITE, abs } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { CalculatorClient } from "@/components/CalculatorClient";
import { AdSlot } from "@/components/AdSlot";

// Unknown slugs return a real HTTP 404 (no soft-404s for search engines).
export const dynamicParams = false;

// Re-check scheduled and edited content at most once an hour; saving in the admin refreshes it immediately.
export const revalidate = 3600;

export function generateStaticParams() {
  return CALCULATORS.map((c) => ({ category: c.category, slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[category]/[slug]">): Promise<Metadata> {
  const { category, slug } = await params;
  const c = bySlug(slug);
  if (!c || c.category !== category) return {};
  const url = toolPath(c);
  return withSeo(url, {
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
    alternates: { canonical: url },
    openGraph: { title: c.metaTitle, description: c.metaDescription, url, type: "website" },
    twitter: { card: "summary_large_image", title: c.metaTitle, description: c.metaDescription },
  });
}

export default async function CalculatorPage({ params }: PageProps<"/[category]/[slug]">) {
  const { category: categorySlug, slug } = await params;
  const c = await getTool(slug); // built-in copy with any admin edits applied
  const cat = categoryBySlug(categorySlug);
  // A tool only exists under its own category, so /finance/<real-estate-tool> is a 404.
  if (!c || !cat || c.category !== cat.slug) notFound();

  const guide = c.guide ? await getGuide(c.guide) : undefined;
  const all = await getAllTools();
  const related = c.related.map((s) => all.find((t) => t.slug === s)).filter((x) => x !== undefined);
  const config = await getSiteConfig();
  const resultsSlot = config.slotResults;
  const contentSlot = config.slotContent;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: c.name,
              description: c.metaDescription,
              url: abs(toolPath(c)),
              applicationCategory: c.category === "real-estate" ? "FinanceApplication" : "UtilitiesApplication",
              operatingSystem: "Any",
              browserRequirements: "Requires JavaScript",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              publisher: { "@type": "Organization", name: SITE.name, url: abs("/") },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
                { "@type": "ListItem", position: 2, name: cat.short, item: abs(`/${cat.slug}`) },
                { "@type": "ListItem", position: 3, name: c.name, item: abs(toolPath(c)) },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: c.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }}
      />

      <nav aria-label="Breadcrumb" className="mb-2 text-sm text-muted">
        <Link href="/" className="hover:text-brand">Home</Link> / <Link href={`/${cat.slug}`} className="hover:text-brand">{cat.short}</Link> / {c.name}
      </nav>
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{c.name}</h1>
      <p className="mt-2 max-w-3xl text-lg text-muted">{c.tagline}</p>

      <div className="mt-6">
        <CalculatorClient slug={c.slug} adSlot={resultsSlot} adClient={config.adsenseClient} />
      </div>

      {/* ---------- Original, helpful content below the tool (important for ad approval and SEO) ---------- */}
      <article className="prose-pc mx-auto mt-14 max-w-3xl">
        <h2>About this calculator</h2>
        {c.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        <AdSlot client={config.adsenseClient} slot={contentSlot || undefined} className="my-8" />

        <h2>How to use the {c.name.toLowerCase()}</h2>
        <ol>
          {c.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>

        <h2>The formulas behind it</h2>
        <ul>
          {c.formula.map((f, i) => (
            <li key={i}>
              <code>{f}</code>
            </li>
          ))}
        </ul>

        <h2>Worked example</h2>
        {c.example.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        <h2>Tips for getting reliable results</h2>
        <ul>
          {c.tips.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>

        <h2>Frequently asked questions</h2>
        <div className="space-y-3">
          {c.faqs.map((f) => (
            <details key={f.q} className="rounded-xl border border-line bg-surface p-4">
              <summary className="cursor-pointer font-semibold">{f.q}</summary>
              <p className="!mb-0">{f.a}</p>
            </details>
          ))}
        </div>

        {guide && (
          <p className="mt-8 rounded-xl bg-brand-soft p-4">
            Want the full explanation? Read our guide: <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>.
          </p>
        )}

        <h2>Related calculators</h2>
        <ul>
          {related.map((r) => (
            <li key={r.slug}>
              <Link href={toolPath(r)}>{r.name}</Link>: {r.tagline}
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-muted">
          Last updated {SITE.reviewed}. {c.category === "real-estate"
            ? "Results are estimates based on the inputs you provide and simplified assumptions. They are not financial, tax or legal advice."
            : "Results are estimates based on the inputs you provide and typical material values. They are not engineering, construction or safety advice. Call 811 before you dig and check local codes."}{" "}
          See our <Link href="/disclaimer">disclaimer</Link>.
        </p>
      </article>
    </main>
  );
}
