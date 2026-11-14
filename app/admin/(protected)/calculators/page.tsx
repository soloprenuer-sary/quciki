import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { CALCULATORS } from "@/lib/calculators";
import { CATEGORIES } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function CalculatorsAdmin() {
  const { db } = await requireAdmin();
  const { data } = await db.from("calculator_content").select("slug,updated_at");
  const edited = new Map((data ?? []).map((r) => [r.slug as string, r.updated_at as string]));
  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Calculator text</h1>
      <p className="text-sm text-muted">Edit the text around each calculator: tagline, introduction, steps, formulas, example, tips and FAQs. The calculator itself (inputs and math) stays in code.</p>
      {CATEGORIES.map((cat) => (
        <section key={cat.slug}>
          <h2 className="mb-2 font-bold">{cat.short}</h2>
          <ul className="divide-y divide-line rounded-2xl border border-line bg-surface text-sm">
            {CALCULATORS.filter((c) => c.category === cat.slug).map((c) => (
              <li key={c.slug} className="flex items-center justify-between gap-3 p-3">
                <span>{c.name}{edited.has(c.slug) && <span className="ml-2 rounded-md bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand">Edited</span>}</span>
                <Link className="font-semibold text-brand" href={`/admin/calculators/${c.slug}`}>Edit</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
