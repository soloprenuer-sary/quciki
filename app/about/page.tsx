import type { Metadata } from "next";
import Link from "next/link";
import { withSeo } from "@/lib/seo";
import { SITE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/about", {
    title: "About Us",
    description: `Who runs ${SITE.name}, how our calculators are built and reviewed by legal advisors and Chartered Accountants, and how we keep them accurate.`,
    alternates: { canonical: "/about" },
  });
}

const PILLARS = [
  {
    title: "Built on the math",
    text: "Each calculator uses a standard, published method, such as amortization for loans, net operating income for rentals and quantity formulas for materials. The formula is shown on the page, so you can check it yourself.",
  },
  {
    title: "Reviewed by professionals",
    text: "Our legal advisors review the wording of our terms, privacy, disclaimer and any content that touches contracts, tenancy or property law. Our Chartered Accountants review the finance, tax-related and return calculations.",
  },
  {
    title: "Kept up to date",
    text: "Rules, tax thresholds and market rates change. Every page shows the date it was last reviewed, and we update it when a method or rule changes.",
  },
];

const REVIEW_STEPS = [
  "A calculator's formula and assumptions are written from a standard source.",
  "A Chartered Accountant checks the financial logic and worked examples.",
  "A legal advisor checks any statements about contracts, tenancy, ownership or compliance.",
  "We publish the page with its review date and a clear limits-of-use note.",
  "Corrections go to the contact form and are fixed as soon as they are verified.",
];

export default function About() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">About us</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
          Free calculators, checked by legal and accounting professionals
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          {SITE.name} helps people understand the numbers behind property, construction and money decisions. We show the
          formula and the assumptions behind every result, not just a single figure.
        </p>
      </header>

      <section className="mt-12 grid gap-5 md:grid-cols-3" aria-label="Our approach">
        {PILLARS.map((p) => (
          <div key={p.title} className="rounded-2xl border border-line bg-surface p-6 shadow-card">
            <h2 className="text-lg font-bold">{p.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
          </div>
        ))}
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold">Who checks our work</h2>
        <div className="prose-pc mt-3">
          <p>
            Our content is reviewed by a team of <strong>qualified legal advisors</strong> and a <strong>Chartered Accountant firm</strong>.
            They do not make decisions for you. They make sure our explanations are accurate, clearly worded and
            clearly limited.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold">How each calculator is reviewed</h2>
        <ol className="mt-5 space-y-4">
          {REVIEW_STEPS.map((step, i) => (
            <li key={step} className="flex gap-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand">
                {i + 1}
              </span>
              <span className="pt-1 text-muted">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold">What we cover</h2>
        <div className="prose-pc mt-3">
          <p>
            Real estate calculators such as{" "}
            <Link href="/real-estate/buy-vs-rent-calculator">buy vs rent</Link>,{" "}
            <Link href="/real-estate/rental-property-roi-calculator">rental property ROI</Link> and cap rate. Construction
            calculators for <Link href="/construction">materials, drainage and excavation</Link>. Personal finance, auto
            and business calculators, plus <Link href="/guides">plain-English guides</Link> that explain the ideas behind them.
          </p>
        </div>
      </section>

      <section className="mt-14 rounded-2xl border border-line bg-surface p-6">
        <h2 className="text-xl font-bold">Important</h2>
        <p className="mt-2 text-sm text-muted">
          Our calculators give estimates for education. They are not legal, tax, financial, engineering or construction
          advice, and they do not replace a professional who knows your situation. Read our{" "}
          <Link className="text-brand hover:text-brand-strong" href="/disclaimer">disclaimer</Link>. Questions or
          corrections? <Link className="text-brand hover:text-brand-strong" href="/contact">Contact us</Link>.
        </p>
      </section>
    </main>
  );
}
