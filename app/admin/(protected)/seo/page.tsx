import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { listPages } from "@/lib/admin/pages";

export const dynamic = "force-dynamic";

export default async function SeoAdmin() {
  const { db } = await requireAdmin();
  const pages = await listPages();
  const { data } = await db.from("seo_overrides").select("path,title,description,noindex");
  const by = new Map((data ?? []).map((r) => [r.path as string, r]));

  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight">SEO</h1>
      <p className="text-sm text-muted">Override the title, description, canonical, social image and indexing for any page. Pages without an override use their built-in SEO.</p>
      <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs uppercase tracking-wide text-muted"><th className="p-3">Page</th><th className="p-3">Type</th><th className="p-3">Override</th><th className="p-3" /></tr></thead>
          <tbody>
            {pages.map((p) => {
              const o = by.get(p.path);
              return (
                <tr key={p.path} className="border-t border-line">
                  <td className="p-3"><span className="font-semibold">{p.label}</span><div className="text-xs text-muted">{p.path}</div></td>
                  <td className="p-3 text-muted">{p.kind}</td>
                  <td className="p-3">{o ? <span className="rounded-md bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand">{o.noindex ? "noindex" : "Custom"}</span> : <span className="text-muted">Default</span>}</td>
                  <td className="p-3 text-right"><Link className="font-semibold text-brand" href={`/admin/seo/edit?path=${encodeURIComponent(p.path)}`}>Edit</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
