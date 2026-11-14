import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { getTool, } from "@/lib/cms";
import { toolPath } from "@/lib/calculators";
import { faqsToText } from "@/lib/admin/parse";
import { ActionForm, SubmitButton, helpCls, inputCls, labelCls } from "@/components/admin/forms";
import { resetCalcContent, saveCalcContent } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function EditCalc({ params }: { params: Promise<{ slug: string }> }) {
  const { db } = await requireAdmin();
  const { slug } = await params;
  const c = await getTool(slug);
  if (!c) notFound();
  const { data: row } = await db.from("calculator_content").select("slug").eq("slug", slug).maybeSingle();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Link href="/admin/calculators" className="text-sm text-muted hover:text-brand">← All calculators</Link>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">{c.name}</h1>
        <div className="mt-1 flex flex-wrap gap-3 text-sm">
          <Link href={toolPath(c)} target="_blank" className="text-brand">View page ↗</Link>
          <Link href={`/admin/seo/edit?path=${encodeURIComponent(toolPath(c))}`} className="text-brand">Edit SEO title and description</Link>
        </div>
      </div>

      <ActionForm action={saveCalcContent} className="space-y-5">
        <input type="hidden" name="slug" value={c.slug} />
        <div>
          <label className={labelCls} htmlFor="tagline">Tagline</label>
          <input id="tagline" name="tagline" defaultValue={c.tagline} className={inputCls} maxLength={300} />
        </div>
        <div>
          <label className={labelCls} htmlFor="intro">Introduction</label>
          <textarea id="intro" name="intro" rows={7} defaultValue={c.intro.join("\n\n")} className={inputCls} />
          <p className={helpCls}>Separate paragraphs with a blank line.</p>
        </div>
        <div>
          <label className={labelCls} htmlFor="steps">How to use (one step per line)</label>
          <textarea id="steps" name="steps" rows={6} defaultValue={c.steps.join("\n")} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="formula">Formulas (one per line)</label>
          <textarea id="formula" name="formula" rows={5} defaultValue={c.formula.join("\n")} className={`${inputCls} font-mono`} />
          <p className={helpCls}>This is explanatory text only. It does not change how the calculator computes.</p>
        </div>
        <div>
          <label className={labelCls} htmlFor="example">Worked example</label>
          <textarea id="example" name="example" rows={6} defaultValue={c.example.join("\n\n")} className={inputCls} />
          <p className={helpCls}>Keep the numbers consistent with the calculator&apos;s default results.</p>
        </div>
        <div>
          <label className={labelCls} htmlFor="tips">Tips (one per line)</label>
          <textarea id="tips" name="tips" rows={6} defaultValue={c.tips.join("\n")} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="faqs">FAQs</label>
          <textarea id="faqs" name="faqs" rows={14} defaultValue={faqsToText(c.faqs)} className={`${inputCls} font-mono`} />
          <p className={helpCls}>Format: a line starting <code>Q:</code>, then a line starting <code>A:</code>, with a blank line between questions. These also feed the page&apos;s FAQ structured data.</p>
        </div>
        <SubmitButton>Save text</SubmitButton>
      </ActionForm>

      {row && (
        <form action={resetCalcContent} className="rounded-2xl border border-line bg-surface p-4">
          <input type="hidden" name="slug" value={c.slug} />
          <p className="text-sm text-muted">This page has custom text. Resetting deletes your edits and restores the built-in text.</p>
          <button className="mt-2 rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-bad hover:bg-red-500/10">Reset to built-in text</button>
        </form>
      )}
    </div>
  );
}
