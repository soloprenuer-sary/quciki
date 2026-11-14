import type { Metadata } from "next";
import { withSeo } from "@/lib/seo";
import Link from "next/link";
import { SITE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/privacy-policy", {
  title: "Privacy Policy",
  description: `How ${SITE.name} collects, uses and protects information, including cookies and Google AdSense advertising.`,
  alternates: { canonical: "/privacy-policy" },
});
}

export default function Privacy() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: {SITE.reviewed}</p>
      <div className="prose-pc mt-4">
        <p>This policy explains what information {SITE.name} (&quot;we&quot;, &quot;us&quot;) handles when you use {SITE.url}.</p>

        <h2>Information you enter into calculators</h2>
        <p>Calculator inputs are processed in your browser. We do not receive them unless you choose to save an estimate, in which case we store your inputs and email address.</p>

        <h2>Information you give us</h2>
        <ul>
          <li><strong>Email signups and saved estimates:</strong> your email address, and for estimates the numbers you entered. We use this to send the updates you asked for.</li>
          <li><strong>Contact form:</strong> your name, email and message, used only to reply to you.</li>
        </ul>
        <p>This data is stored with our database provider, Supabase, and is not sold. To access or delete your data, <Link href="/contact">contact us</Link>.</p>

        <h2>Cookies and advertising</h2>
        <p>We use Google AdSense to show ads. Google and its partners may use cookies and similar technologies to serve ads based on your visits to this and other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visit to our site and other sites on the Internet.</p>
        <p>You can opt out of personalized advertising at <a href="https://adssettings.google.com" rel="noopener noreferrer">Google Ads Settings</a> or visit <a href="https://www.aboutads.info" rel="noopener noreferrer">aboutads.info</a>. Learn how Google uses data at <a href="https://policies.google.com/technologies/partner-sites" rel="noopener noreferrer">policies.google.com/technologies/partner-sites</a>.</p>

        <h2>Analytics and server logs</h2>
        <p>Our hosting provider may keep standard server logs (such as IP address, browser type and pages requested) for security and performance.</p>

        <h2>Your rights</h2>
        <p>Depending on where you live (for example the EEA, UK or California) you may have rights to access, correct or delete your personal data and to object to certain processing. Contact us to exercise them.</p>

        <h2>Children</h2>
        <p>The site is not directed to children under 13 and we do not knowingly collect their data.</p>

        <h2>Changes</h2>
        <p>We may update this policy. The date above shows the latest revision.</p>
      </div>
    </main>
  );
}
