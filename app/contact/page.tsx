import type { Metadata } from "next";
import Link from "next/link";
import { withSeo } from "@/lib/seo";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/lib/site";
import { getSiteConfig } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/contact", {
    title: "Contact Us",
    description: `Contact ${SITE.name} about calculator corrections, feature ideas, privacy requests or advertising enquiries.`,
    alternates: { canonical: "/contact" },
  });
}

const HELP = [
  { title: "Corrections", text: "Spotted a wrong number, formula or unclear sentence? Tell us which calculator and what to change. We review each correction before changing a page." },
  { title: "Privacy requests", text: "To ask what data we hold or to request deletion, use this form and choose Privacy. Read our Privacy Policy first." },
  { title: "Ideas", text: "Suggest a calculator or a guide topic. We favour tools that people use to make a real decision." },
];

export default async function Contact() {
  const config = await getSiteConfig();
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">Contact</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">How can we help?</h1>
        <p className="mt-3 text-lg text-muted">
          Send us a correction, an idea or a question. Messages go to our team, and we reply by email.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <aside className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Email us directly</p>
            <a className="mt-2 block break-all text-lg font-bold text-brand hover:text-brand-strong" href={`mailto:${config.contactEmail}`}>
              {config.contactEmail}
            </a>
            <p className="mt-2 text-sm text-muted">Use the form if you want your message tied to a topic.</p>
          </div>

          {HELP.map((h) => (
            <div key={h.title} className="rounded-2xl border border-line bg-surface p-6">
              <h2 className="font-bold">{h.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{h.text}</p>
            </div>
          ))}

          <p className="px-1 text-sm text-muted">
            Looking for an answer? Check the <Link className="font-medium text-brand hover:text-brand-strong" href="/guides">guides</Link> and
            the FAQ on each calculator page.
          </p>
        </aside>

        <section className="rounded-2xl border border-line bg-surface p-6 shadow-card md:p-8 lg:col-span-3" aria-labelledby="form-title">
          <h2 id="form-title" className="text-xl font-bold">Send a message</h2>
          <p className="mt-1 text-sm text-muted">All fields are required. We only use your details to reply to you.</p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </section>
      </div>
    </main>
  );
}
