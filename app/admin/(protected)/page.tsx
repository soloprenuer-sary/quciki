import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { CALCULATORS } from "@/lib/calculators";

export const dynamic = "force-dynamic";

async function count(db: Awaited<ReturnType<typeof requireAdmin>>["db"], table: string, filter?: [string, string]) {
  let q = db.from(table).select("*", { count: "exact", head: true });
  if (filter) q = q.eq(filter[0], filter[1]);
  const { count: n, error } = await q;
  return error ? null : (n ?? 0);
}

export default async function Dashboard() {
  const { db } = await requireAdmin();
  const [published, drafts, seo, calc, redirects, subs, msgs] = await Promise.all([
    count(db, "guides", ["status", "published"]),
    count(db, "guides", ["status", "draft"]),
    count(db, "seo_overrides"),
    count(db, "calculator_content"),
    count(db, "redirects"),
    count(db, "subscribers"),
    count(db, "contact_messages"),
  ]);
  const { data: latest } = await db.from("contact_messages").select("id,name,email,message,created_at").order("created_at", { ascending: false }).limit(5);
  const tablesMissing = [published, seo, redirects].some((v) => v === null);

  const stats: [string, number | null, string][] = [
    ["Published guides (database)", published, "/admin/guides"],
    ["Draft guides", drafts, "/admin/guides"],
    ["SEO overrides", seo, "/admin/seo"],
    ["Edited calculator pages", calc, "/admin/calculators"],
    ["Redirects", redirects, "/admin/redirects"],
    ["Email subscribers", subs, "/admin"],
    ["Contact messages", msgs, "/admin"],
  ];
  return (
    <div className="max-w-5xl space-y-8">
      <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
      {tablesMissing && (
        <p className="rounded-xl bg-red-500/10 p-4 text-sm text-bad">
          Some database tables are missing. Run <code>supabase/admin.sql</code> in the Supabase SQL editor, then reload.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, n, href]) => (
          <Link key={label} href={href} className="rounded-2xl border border-line bg-surface p-4 shadow-card hover:border-brand">
            <p className="text-3xl font-extrabold">{n ?? "—"}</p>
            <p className="text-sm text-muted">{label}</p>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="font-bold">How content works</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
          <li>The site ships with {CALCULATORS.length} calculators and built-in guides. Edits you make here are stored in the database and win over the built-in text.</li>
          <li>Built-in guides appear under <Link className="text-brand underline" href="/admin/guides">Guides</Link> with an Import button, so you can edit them.</li>
          <li>Calculator formulas stay in code, so nothing you edit here can break a calculator&apos;s results.</li>
          <li>Saving refreshes the public pages immediately. Scheduled guides go live within an hour.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="font-bold">Latest contact messages</h2>
        {!latest?.length ? (
          <p className="mt-2 text-sm text-muted">No messages yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line text-sm">
            {latest.map((m) => (
              <li key={m.id} className="py-3">
                <p className="font-semibold">{m.name} <span className="font-normal text-muted">· {m.email} · {String(m.created_at).slice(0, 10)}</span></p>
                <p className="mt-1 whitespace-pre-wrap text-muted">{m.message}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
