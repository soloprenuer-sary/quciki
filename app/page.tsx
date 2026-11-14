import Link from "next/link";
import type { Metadata } from "next";
import { toolPath } from "@/lib/calculators";
import { getAllGuides, getAllTools } from "@/lib/cms";
import { withSeo } from "@/lib/seo";
import { CATEGORIES } from "@/lib/categories";
import { SITE, abs } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { EmailForm } from "@/components/EmailForm";

// Scheduled guides and edits made in the admin show up within the hour, or immediately after saving.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/", {
    title: { absolute: `${SITE.name}: Free Calculators for Property, Construction, Finance, Auto and Business` },
    description:
      "Free calculators with clear explanations: buy vs rent, rental ROI, mortgage and closing costs, gravel and excavation, compound interest and debt payoff, car loans and business pricing.",
    alternates: { canonical: "/" },
  });
}

const BENEFITS = [
  { t: "Explained, not just answered", d: "Every calculator shows its formula, a worked example and a plain-English guide to the result." },
  { t: "Live results on any screen", d: "Move a slider and the verdict, chart and table update instantly, on desktop or phone." },
  { t: "Private by default", d: "Your inputs are calculated in your browser. Nothing is stored unless you choose to save an estimate." },
];

export default async function Home() {
  const CALCULATORS = await getAllTools();
  const guides = await getAllGuides();
  const featured = CALCULATORS[0];
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebSite", name: SITE.name, url: abs("/"), description: SITE.tagline },
            { "@type": "Organization", name: SITE.name, url: abs("/") },
          ],
        }}
      />

      <section className="border-b border-line bg-gradient-to-b from-brand-soft to-bg">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[1.15fr_0.85fr] md:py-20">
          <div>
            <p className="mb-3 inline-block rounded-full bg-surface px-3 py-1 text-xs font-semibold text-brand ring-1 ring-line">
              Free · No sign-up · Updated {SITE.reviewed}
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Run the numbers before you buy, build or invest.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Clear, honest calculators for property and home projects. Compare buying with renting, check a rental&apos;s cash flow, or work out how much gravel, stone or fill you need.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={toolPath(featured)} className="rounded-xl bg-brand px-5 py-3 font-semibold text-brand-ink shadow-card transition hover:bg-brand-strong">
                Try the Buy vs Rent calculator
              </Link>
              <Link href="/calculators" className="rounded-xl border border-line bg-surface px-5 py-3 font-semibold transition hover:border-brand">
                All calculators
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-brand to-teal-700 p-7 text-white shadow-card">
            <p className="text-sm opacity-85">Example · $450K home, 10-year stay</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight">Break-even point, net worth and monthly cost in one view</p>
            <ul className="mt-5 space-y-2 text-sm opacity-95">
              <li>✓ Mortgage, tax, insurance and upkeep</li>
              <li>✓ Renter&apos;s invested down payment</li>
              <li>✓ Year-by-year chart and table</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14">
        <h2 className="text-2xl font-bold tracking-tight">Browse by category</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/${cat.slug}`} className="rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:border-brand">
              <h3 className="text-lg font-bold">{cat.short}</h3>
              <p className="mt-1 text-sm text-muted">{cat.tagline}</p>
              <p className="mt-3 text-xs text-muted">{CALCULATORS.filter((c) => c.category === cat.slug).length} calculators</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold tracking-tight">Popular calculators</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CALCULATORS.slice(0, 6).map((c) => (
            <Link key={c.slug} href={toolPath(c)} className="group flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:border-brand">
              <span className="self-start rounded-md bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand">{c.group}</span>
              <h3 className="mt-3 text-lg font-bold">{c.name}</h3>
              <p className="mt-1 flex-1 text-sm text-muted">{c.tagline}</p>
              <span className="mt-4 text-sm font-semibold text-brand">Open calculator →</span>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-center">
          <Link href="/calculators" className="font-semibold text-brand">See all {CALCULATORS.length} calculators →</Link>
        </p>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.t}>
              <h3 className="text-lg font-bold">{b.t}</h3>
              <p className="mt-2 text-muted">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Guides</h2>
          <Link href="/guides" className="text-sm font-semibold text-brand">All guides →</Link>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {guides.slice(0, 6).map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:border-brand">
              <h3 className="font-bold leading-snug">{g.title}</h3>
              <p className="mt-2 text-sm text-muted">{g.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-6">
        <div className="rounded-3xl border border-line bg-surface p-8 text-center shadow-card">
          <h2 className="text-2xl font-bold">Get new calculators and guides</h2>
          <p className="mx-auto mt-2 max-w-md text-muted">One short email when we publish something new. Unsubscribe any time.</p>
          <div className="mx-auto mt-5 max-w-md">
            <EmailForm extra={{ source: "home" }} />
          </div>
        </div>
      </section>
    </>
  );
}
