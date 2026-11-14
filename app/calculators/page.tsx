import Link from "next/link";
import type { Metadata } from "next";
import { toolPath } from "@/lib/calculators";
import { getAllTools } from "@/lib/cms";
import { withSeo } from "@/lib/seo";
import { CATEGORIES } from "@/lib/categories";
import { SITE, abs } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/calculators", {
    title: "All Calculators",
    description: "Browse every free calculator on Quciki, organised by category.",
    alternates: { canonical: "/calculators" },
  });
}

export default async function CalculatorsIndex() {
  const CALCULATORS = await getAllTools();
    return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${SITE.name} calculators`,
          itemListElement: CALCULATORS.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: abs(toolPath(c)),
            name: c.name,
          })),
        }}
      />
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">All calculators</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Each calculator includes the formula, a worked example and answers to common questions, so you understand the result and not just the number.
      </p>
      {CATEGORIES.map((cat) => (
        <section key={cat.slug} className="mt-10">
          <h2 className="text-2xl font-bold">
            <Link href={`/${cat.slug}`} className="hover:text-brand">{cat.name}</Link>
          </h2>
          {cat.groups.map((g) => (
            <div key={g} className="mt-5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted">{g}</h3>
              <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {CALCULATORS.filter((c) => c.category === cat.slug && c.group === g).map((c) => (
                  <Link key={c.slug} href={toolPath(c)} className="rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:border-brand">
                    <h4 className="text-lg font-bold">{c.name}</h4>
                    <p className="mt-1 text-sm text-muted">{c.tagline}</p>
                    <span className="mt-4 inline-block text-sm font-semibold text-brand">Open →</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}
    </main>
  );
}
