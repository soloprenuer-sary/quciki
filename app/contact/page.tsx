import type { Metadata } from "next";
import { withSeo } from "@/lib/seo";
import { ContactForm } from "@/components/ContactForm";
import { RichHtml } from "@/components/RichHtml";
import { content, getSiteInfo, siteVars } from "@/lib/content";
import { CONTACT_ENTRY } from "@/lib/content/entries";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/contact", {
    title: "Contact Us",
    description: CONTACT_ENTRY.seo!.description.replace("Quciki", (await getSiteInfo()).name),
    alternates: { canonical: "/contact" },
  });
}

export default async function Contact() {
  const c = await content(CONTACT_ENTRY);
  const { email } = await siteVars();
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">{c.kicker}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">{c.headline}</h1>
        <p className="mt-3 text-lg text-muted">{c.intro}</p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <aside className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">{c.emailCardTitle}</p>
            <a className="mt-2 block break-all text-lg font-bold text-brand hover:text-brand-strong" href={`mailto:${email}`}>
              {email}
            </a>
            <p className="mt-2 text-sm text-muted">{c.emailCardNote}</p>
          </div>

          {c.helpCards.map((h) => (
            <div key={h.title} className="rounded-2xl border border-line bg-surface p-6">
              <h2 className="font-bold">{h.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{h.text}</p>
            </div>
          ))}

          <div className="prose-pc px-1 text-sm text-muted">
            <RichHtml html={c.helpNote} />
          </div>
        </aside>

        <section className="rounded-2xl border border-line bg-surface p-6 shadow-card md:p-8 lg:col-span-3" aria-labelledby="form-title">
          <h2 id="form-title" className="text-xl font-bold">{c.formTitle}</h2>
          <p className="mt-1 text-sm text-muted">{c.formNote}</p>
          <div className="mt-6">
            <ContactForm
              topics={c.topics.map((t) => t.label)}
              labels={{
                name: c.labelName,
                email: c.labelEmail,
                topic: c.labelTopic,
                topicPlaceholder: c.topicPlaceholder,
                message: c.labelMessage,
                messagePlaceholder: c.messagePlaceholder,
                messageNote: c.messageNote,
                submit: c.submitLabel,
                sending: c.sendingLabel,
                success: c.successMessage,
              }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
