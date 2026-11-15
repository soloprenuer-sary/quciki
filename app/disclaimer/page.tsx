import type { Metadata } from "next";
import { withSeo } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { getWpPage } from "@/lib/cms";
import { WpPageView } from "@/components/WpPageView";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/disclaimer", {
  title: "Disclaimer",
  description: `${SITE.name} calculators provide estimates for education only and are not financial, tax or legal advice.`,
  alternates: { canonical: "/disclaimer" },
});
}

export default async function Disclaimer() {
  const wp = await getWpPage("disclaimer");
  if (wp) return <WpPageView page={wp} />;
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Disclaimer</h1>
      <div className="prose-pc mt-4">
        <p>{SITE.name} is an educational website. Nothing on this site is financial, investment, tax, legal, real estate, engineering or construction advice, and nothing is an offer or recommendation to buy or sell any property or product.</p>
        <h2>Estimates only</h2>
        <p>Calculator results depend on the numbers you enter and on simplified assumptions (for example constant rates of appreciation and returns, and no income tax effects). Real outcomes will differ.</p>
        <h2>Construction and landscaping tools</h2>
        <p>Quantities, weights and prices are typical planning values. Soil, site conditions and suppliers differ. Confirm amounts with your supplier, call 811 before you dig, follow local building codes and permit rules, and use a qualified engineer or contractor for structural, drainage or retaining work.</p>
        <h2>Do your own research</h2>
        <p>Before making a decision, verify figures with lenders, agents, accountants and local sources, and consult a qualified professional.</p>
        <h2>No liability</h2>
        <p>We are not responsible for losses or damages resulting from the use of this site&apos;s tools or content.</p>
      </div>
    </main>
  );
}
