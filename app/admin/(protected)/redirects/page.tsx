import { requireAdmin } from "@/lib/admin/auth";
import { ActionForm, SubmitButton, helpCls, inputCls, labelCls } from "@/components/admin/forms";
import { addRedirect, deleteRedirect, toggleRedirect } from "../../actions";

export const dynamic = "force-dynamic";

export default async function RedirectsAdmin() {
  const { db } = await requireAdmin();
  const { data } = await db.from("redirects").select("*").order("created_at", { ascending: false });
  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Redirects</h1>
      <p className="text-sm text-muted">Send an old URL to a new one, for example after changing a guide&apos;s slug. Changes can take up to a minute to apply. The built-in redirects from the old <code>/calculators/…</code> URLs are separate and always active.</p>

      <ActionForm action={addRedirect} className="grid gap-3 rounded-2xl border border-line bg-surface p-4 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
        <div>
          <label className={labelCls} htmlFor="source">From (path)</label>
          <input id="source" name="source" required placeholder="/guides/old-slug" className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="destination">To (path or https URL)</label>
          <input id="destination" name="destination" required placeholder="/guides/new-slug" className={inputCls} />
        </div>
        <label className="flex items-center gap-2 pb-2 text-sm"><input type="checkbox" name="permanent" defaultChecked /> Permanent (301/308)</label>
        <SubmitButton>Add</SubmitButton>
        <p className={`${helpCls} md:col-span-4`}>Use permanent redirects when a page has moved for good. They pass ranking signals to the new URL.</p>
      </ActionForm>

      <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs uppercase tracking-wide text-muted"><th className="p-3">From</th><th className="p-3">To</th><th className="p-3">Type</th><th className="p-3">Active</th><th className="p-3" /></tr></thead>
          <tbody>
            {(data ?? []).map((r) => (
              <tr key={r.id} className="border-t border-line">
                <td className="p-3 font-mono text-xs">{r.source}</td>
                <td className="p-3 font-mono text-xs">{r.destination}</td>
                <td className="p-3">{r.permanent ? "Permanent" : "Temporary"}</td>
                <td className="p-3">
                  <form action={toggleRedirect}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="active" value={String(r.active)} />
                    <button className="rounded-md border border-line px-2 py-1 text-xs font-semibold hover:bg-brand-soft">{r.active ? "On" : "Off"}</button>
                  </form>
                </td>
                <td className="p-3 text-right">
                  <form action={deleteRedirect}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="text-xs font-semibold text-bad">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {!data?.length && <tr><td colSpan={5} className="p-4 text-muted">No custom redirects yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
