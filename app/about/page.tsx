import type { Metadata } from "next";
import { withSeo } from "@/lib/seo";
import { content, getReview, getSiteInfo } from "@/lib/content";
import { ABOUT_ENTRY } from "@/lib/content/entries";
import { RichHtml } from "@/components/RichHtml";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/about", {
    title: "About Us",
    description: ABOUT_ENTRY.seo!.description.replace("Quciki", (await getSiteInfo()).name),
    alternates: { canonical: "/about" },
  });
}

export default async function About() {
  const a = await content(ABOUT_ENTRY);
  const review = await getReview(ABOUT_ENTRY.key);
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">{a.kicker}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">{a.headline}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">{a.intro}</p>
        {review.at && (
          <p className="mt-3 text-sm text-muted">
            Last reviewed {review.at.slice(0, 10)}
            {review.by ? ` by ${review.by}` : ""}
          </p>
        )}
      </header>

      <section className="mt-12 grid gap-5 md:grid-cols-3" aria-label={a.kicker}>
        {a.pillars.map((p) => (
          <div key={p.title} className="rounded-2xl border border-line bg-surface p-6 shadow-card">
            <h2 className="text-lg font-bold">{p.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
          </div>
        ))}
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold">{a.reviewHeading}</h2>
        <div className="prose-pc mt-3">
          <RichHtml html={a.reviewText} />
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold">{a.stepsHeading}</h2>
        <ol className="mt-5 space-y-4">
          {a.steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand">{i + 1}</span>
              <span className="pt-1 text-muted">{step.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold">{a.coverageHeading}</h2>
        <div className="prose-pc mt-3">
          <RichHtml html={a.coverageText} />
        </div>
      </section>

      <section className="mt-14 rounded-2xl border border-line bg-surface p-6">
        <h2 className="text-xl font-bold">{a.noticeHeading}</h2>
        <div className="prose-pc mt-2 text-sm">
          <RichHtml html={a.noticeText} />
        </div>
      </section>
    </main>
  );
}
