import type { Metadata } from "next";
import { withSeo } from "@/lib/seo";
import { content, getReview, getSiteInfo } from "@/lib/content";
import { DISCLAIMER_ENTRY } from "@/lib/content/entries";
import { RichHtml } from "@/components/RichHtml";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await content(DISCLAIMER_ENTRY);
  return withSeo("/disclaimer", {
    title: page.title,
    description: DISCLAIMER_ENTRY.seo!.description.replace("Quciki", (await getSiteInfo()).name),
    alternates: { canonical: "/disclaimer" },
  });
}

export default async function Disclaimer() {
  const page = await content(DISCLAIMER_ENTRY);
  const review = await getReview(DISCLAIMER_ENTRY.key);
  const info = await getSiteInfo();
  const label = review.at ? `${page.reviewedLabel} ${review.at.slice(0, 10)}${review.by ? ` (${review.by})` : ""}` : `${page.updatedLabel} ${info.reviewed}`;
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{page.title}</h1>
      <p className="mt-2 text-sm text-muted">{label}</p>
      <div className="prose-pc mt-4">
        <RichHtml html={page.body} />
      </div>
    </main>
  );
}
