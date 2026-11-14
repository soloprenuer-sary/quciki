import type { Metadata } from "next";
import { withSeo } from "@/lib/seo";
import { SITE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/terms", {
  title: "Terms of Use",
  description: `Terms of use for ${SITE.name} calculators and content.`,
  alternates: { canonical: "/terms" },
});
}

export default function Terms() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Terms of Use</h1>
      <p className="mt-2 text-sm text-muted">Last updated: {SITE.reviewed}</p>
      <div className="prose-pc mt-4">
        <p>By using {SITE.name} you agree to these terms.</p>
        <h2>Use of the site</h2>
        <p>The calculators and content are provided free for personal, non-commercial information. Do not scrape, overload or misuse the service.</p>
        <h2>No advice</h2>
        <p>Content is educational and not financial, investment, tax or legal advice. See the disclaimer. Consult qualified professionals before making decisions.</p>
        <h2>No warranty</h2>
        <p>The site is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that results are accurate, complete or suitable for your situation.</p>
        <h2>Limitation of liability</h2>
        <p>To the extent permitted by law, we are not liable for losses arising from your use of, or reliance on, the site or its calculators.</p>
        <h2>Intellectual property</h2>
        <p>Site text, design and code are owned by {SITE.name}. You may link to pages freely and quote short excerpts with attribution.</p>
        <h2>Third-party links and ads</h2>
        <p>We are not responsible for third-party websites or advertisements shown on the site.</p>
        <h2>Changes</h2>
        <p>We may update these terms. Continued use means you accept the updated terms.</p>
      </div>
    </main>
  );
}
