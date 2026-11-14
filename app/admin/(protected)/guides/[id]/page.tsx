import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { CATEGORIES } from "@/lib/categories";
import { CALCULATORS } from "@/lib/calculators";
import { GuideEditor } from "@/components/admin/forms";
import { deleteGuide, saveGuide } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function EditGuide({ params }: { params: Promise<{ id: string }> }) {
  const { db } = await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data: g } = await db.from("guides").select("*").eq("id", id).maybeSingle();
  if (!g) notFound();

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">Edit guide</h1>
        <div className="flex gap-2 text-sm">
          {g.status === "published" && <Link href={`/guides/${g.slug}`} target="_blank" className="rounded-lg border border-line px-3 py-1.5 font-semibold hover:bg-brand-soft">View ↗</Link>}
          <Link href={`/admin/seo/edit?path=${encodeURIComponent(`/guides/${g.slug}`)}`} className="rounded-lg border border-line px-3 py-1.5 font-semibold hover:bg-brand-soft">SEO</Link>
          <form action={deleteGuide}>
            <input type="hidden" name="id" value={g.id} />
            <button className="rounded-lg border border-line px-3 py-1.5 font-semibold text-bad hover:bg-red-500/10">Delete</button>
          </form>
        </div>
      </div>
      <GuideEditor
        action={saveGuide}
        categories={CATEGORIES.map((c) => ({ slug: c.slug, name: c.short }))}
        calculators={CALCULATORS.map((c) => ({ slug: c.slug, name: c.name }))}
        initial={{
          id: g.id,
          slug: g.slug,
          category: g.category,
          title: g.title,
          description: g.description ?? "",
          body_md: g.body_md ?? "",
          cover_url: g.cover_url ?? "",
          calculator_slug: g.calculator_slug ?? "",
          status: g.status,
          published_at: g.published_at ? new Date(g.published_at).toISOString().slice(0, 16) : "",
        }}
      />
    </div>
  );
}
