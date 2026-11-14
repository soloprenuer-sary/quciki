import { requireAdmin } from "@/lib/admin/auth";
import { deleteMedia } from "../../actions";
import { MediaUploader } from "@/components/admin/MediaUploader";

export const dynamic = "force-dynamic";

export default async function MediaAdmin() {
  const { db } = await requireAdmin();
  const { data, error } = await db.storage.from("media").list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
  const files = (data ?? []).filter((f) => f.name && f.id);
  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Media</h1>
      {error && <p className="rounded-xl bg-red-500/10 p-4 text-sm text-bad">Could not read the media bucket: {error.message}. Run supabase/admin.sql to create it.</p>}
      <MediaUploader />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {files.map((f) => {
          const url = db.storage.from("media").getPublicUrl(f.name).data.publicUrl;
          return (
            <figure key={f.name} className="overflow-hidden rounded-2xl border border-line bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-40 w-full object-cover" />
              <figcaption className="space-y-2 p-3 text-xs">
                <input readOnly value={url} className="w-full rounded-md border border-line bg-bg px-2 py-1 font-mono" />
                <form action={deleteMedia}><input type="hidden" name="name" value={f.name} /><button className="font-semibold text-bad">Delete</button></form>
              </figcaption>
            </figure>
          );
        })}
        {!files.length && !error && <p className="text-sm text-muted">No images uploaded yet.</p>}
      </div>
    </div>
  );
}
