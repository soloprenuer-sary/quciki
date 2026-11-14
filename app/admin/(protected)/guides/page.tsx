import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { GUIDES } from "@/lib/guides";
import { importGuides } from "../../actions";

export const dynamic = "force-dynamic";

const isFuture = (iso: string) => new Date(iso).getTime() > Date.now();

export default async function GuidesAdmin() {
  const { db } = await requireAdmin();
  const { data, error } = await db.from("guides").select("id,slug,title,category,status,published_at,updated_at").order("updated_at", { ascending: false });
  const rows = data ?? [];
  const inDb = new Set(rows.map((r) => r.slug));
  const builtin = GUIDES.filter((g) => !inDb.has(g.slug));

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold tracking-tight">Guides</h1>
        <Link href="/admin/guides/new" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-ink">New guide</Link>
      </div>
      {error && <p className="rounded-xl bg-red-500/10 p-4 text-sm text-bad">Could not load guides: {error.message}. Run supabase/admin.sql if the tables are missing.</p>}

      <section>
        <h2 className="mb-2 font-bold">Your guides ({rows.length})</h2>
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs uppercase tracking-wide text-muted"><th className="p-3">Title</th><th className="p-3">Category</th><th className="p-3">Status</th><th className="p-3">Updated</th></tr></thead>
            <tbody>
              {rows.map((g) => {
                const scheduled = g.status === "published" && g.published_at && isFuture(g.published_at);
                return (
                  <tr key={g.id} className="border-t border-line">
                    <td className="p-3"><Link className="font-semibold text-brand" href={`/admin/guides/${g.id}`}>{g.title}</Link><div className="text-xs text-muted">/guides/{g.slug}</div></td>
                    <td className="p-3">{g.category}</td>
                    <td className="p-3">{scheduled ? "Scheduled" : g.status === "published" ? "Published" : "Draft"}</td>
                    <td className="p-3 text-muted">{String(g.updated_at).slice(0, 10)}</td>
                  </tr>
                );
              })}
              {!rows.length && <tr><td colSpan={4} className="p-4 text-muted">No guides in the database yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between gap-4">
          <h2 className="font-bold">Built-in guides ({builtin.length})</h2>
          {builtin.length > 0 && (
            <form action={importGuides}><button className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold hover:bg-brand-soft">Import all to edit</button></form>
          )}
        </div>
        <p className="mb-2 text-sm text-muted">These are part of the site&apos;s code. Import one to copy it into the database; the imported copy then replaces the built-in one on the site.</p>
        <ul className="divide-y divide-line rounded-2xl border border-line bg-surface text-sm">
          {builtin.map((g) => (
            <li key={g.slug} className="flex items-center justify-between gap-3 p-3">
              <span>{g.title}<span className="block text-xs text-muted">/guides/{g.slug}</span></span>
              <form action={importGuides}><input type="hidden" name="slug" value={g.slug} /><button className="rounded-lg border border-line px-3 py-1.5 font-semibold hover:bg-brand-soft">Import</button></form>
            </li>
          ))}
          {!builtin.length && <li className="p-3 text-muted">All built-in guides are imported.</li>}
        </ul>
      </section>
    </div>
  );
}
