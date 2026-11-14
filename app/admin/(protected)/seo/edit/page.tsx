import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { listPages } from "@/lib/admin/pages";
import { SeoForm } from "@/components/admin/forms";
import { saveSeo } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function EditSeo({ searchParams }: { searchParams: Promise<{ path?: string }> }) {
  const { db } = await requireAdmin();
  const { path } = await searchParams;
  if (!path) notFound();
  const entry = (await listPages()).find((p) => p.path === path);
  if (!entry) notFound();
  const { data: o } = await db.from("seo_overrides").select("*").eq("path", path).maybeSingle();

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <Link href="/admin/seo" className="text-sm text-muted hover:text-brand">← All pages</Link>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">SEO: {entry.label}</h1>
        <p className="text-sm text-muted">{entry.path}</p>
      </div>
      <SeoForm
        action={saveSeo}
        path={entry.path}
        defaults={{ title: entry.title, description: entry.description, usesTemplate: entry.usesTemplate }}
        initial={{ title: o?.title ?? "", description: o?.description ?? "", canonical: o?.canonical ?? "", og_image: o?.og_image ?? "", noindex: Boolean(o?.noindex) }}
      />
    </div>
  );
}
