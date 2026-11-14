"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Markdown } from "@/components/Markdown";
import { SITE } from "@/lib/site";
import type { ActionState } from "@/app/admin/actions";

export const inputCls = "w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm";
export const labelCls = "mb-1 block text-sm font-semibold";
export const helpCls = "mt-1 text-xs text-muted";

export function SubmitButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-ink disabled:opacity-60 ${className}`}>
      {pending ? "Saving…" : children}
    </button>
  );
}

export function FormMessage({ state }: { state: ActionState }) {
  if (!state) return null;
  return (
    <p role="status" aria-live="polite" className={`rounded-lg px-3 py-2 text-sm ${state.ok ? "bg-brand-soft text-ink" : "bg-red-500/10 text-bad"}`}>
      {state.message}
    </p>
  );
}

/** A form wired to a server action that returns a success or error message. */
export function ActionForm({
  action,
  children,
  className = "space-y-4",
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState(action, null);
  return (
    <form action={formAction} className={className}>
      {children}
      <FormMessage state={state} />
    </form>
  );
}

/* ----------------------------- guide editor ----------------------------- */

export interface GuideFormValues {
  id?: string;
  slug: string;
  category: string;
  title: string;
  description: string;
  body_md: string;
  cover_url: string;
  calculator_slug: string;
  status: "draft" | "published";
  published_at: string; // "YYYY-MM-DDTHH:mm" in UTC, or ""
}

export function GuideEditor({
  action,
  initial,
  categories,
  calculators,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  initial: GuideFormValues;
  categories: { slug: string; name: string }[];
  calculators: { slug: string; name: string }[];
}) {
  const [state, formAction] = useActionState(action, null);
  const [title, setTitle] = useState(initial.title);
  const [body, setBody] = useState(initial.body_md);
  const [description, setDescription] = useState(initial.description);
  const [uploadMsg, setUploadMsg] = useState("");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const area = useRef<HTMLTextAreaElement>(null);

  async function upload(file: File) {
    setUploadMsg("Uploading…");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      const md = `\n\n![Describe the image](${json.url})\n\n`;
      const el = area.current;
      const at = el ? el.selectionStart : body.length;
      setBody((b) => b.slice(0, at) + md + b.slice(at));
      setUploadMsg("Image added to the text. Replace “Describe the image” with real alt text.");
    } catch (e) {
      setUploadMsg(e instanceof Error ? e.message : "Upload failed");
    }
  }

  const words = body.trim() ? body.trim().split(/\s+/).length : 0;
  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <div className="space-y-4">
        <div>
          <label className={labelCls} htmlFor="title">Title</label>
          <input id="title" name="title" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} maxLength={200} />
        </div>
        <div>
          <label className={labelCls} htmlFor="description">Description (shown in search results and cards)</label>
          <textarea id="description" name="description" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} maxLength={300} />
          <p className={helpCls}>{description.length}/300 · aim for 120 to 160 characters</p>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-semibold" htmlFor="body_md">Body (Markdown)</label>
            <div className="flex gap-1 text-xs">
              {(["write", "preview"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-md px-2 py-1 ${tab === t ? "bg-brand-soft font-semibold text-brand" : "text-muted"}`}>
                  {t === "write" ? "Write" : "Preview"}
                </button>
              ))}
            </div>
          </div>
          <textarea
            ref={area}
            id="body_md"
            name="body_md"
            rows={26}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className={`${inputCls} font-mono ${tab === "write" ? "" : "hidden"}`}
            placeholder={"## First heading\n\nWrite your guide here. Use ## for section headings, **bold**, - lists and [links](/real-estate)."}
          />
          {tab === "preview" && (
            <div className="prose-pc min-h-[26rem] rounded-lg border border-line bg-surface p-4">
              <h1 className="text-2xl font-extrabold">{title || "Untitled"}</h1>
              <Markdown>{body || "*Nothing to preview yet.*"}</Markdown>
            </div>
          )}
          <p className={helpCls}>{words} words · Raw HTML is not allowed. Use ## headings: each one becomes a section.</p>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="space-y-3 rounded-2xl border border-line bg-surface p-4">
          <div>
            <label className={labelCls} htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={initial.status} className={inputCls}>
              <option value="draft">Draft (not public)</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="published_at">Publish date and time (UTC)</label>
            <input id="published_at" name="published_at" type="datetime-local" defaultValue={initial.published_at} className={inputCls} />
            <p className={helpCls}>Leave empty to publish now. A future time schedules the guide; it goes live within the hour.</p>
          </div>
          <SubmitButton className="w-full">Save</SubmitButton>
          <FormMessage state={state} />
        </div>

        <div className="space-y-3 rounded-2xl border border-line bg-surface p-4">
          <div>
            <label className={labelCls} htmlFor="slug">URL slug</label>
            <input id="slug" name="slug" required defaultValue={initial.slug} className={inputCls} pattern="[a-z0-9]+(-[a-z0-9]+)*" />
            <p className={helpCls}>/guides/<b>{initial.slug || "your-slug"}</b>. Changing it breaks existing links; add a redirect.</p>
          </div>
          <div>
            <label className={labelCls} htmlFor="category">Category</label>
            <select id="category" name="category" defaultValue={initial.category} className={inputCls}>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="calculator_slug">Related calculator</label>
            <select id="calculator_slug" name="calculator_slug" defaultValue={initial.calculator_slug} className={inputCls}>
              <option value="">None</option>
              {calculators.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="cover_url">Cover image URL</label>
            <input id="cover_url" name="cover_url" defaultValue={initial.cover_url} className={inputCls} placeholder="https://…" />
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-4">
          <label className={labelCls} htmlFor="img">Upload an image</label>
          <input id="img" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} className="text-sm" />
          <p className={helpCls}>PNG, JPG, WebP or GIF, up to 5 MB. It is inserted into the body at the cursor.</p>
          {uploadMsg && <p className="mt-2 text-xs">{uploadMsg}</p>}
        </div>
      </aside>
    </form>
  );
}

/* ----------------------------- SEO editor ----------------------------- */

export function SeoForm({
  action,
  path,
  defaults,
  initial,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  path: string;
  defaults: { title: string; description: string; usesTemplate: boolean };
  initial: { title: string; description: string; canonical: string; og_image: string; noindex: boolean };
}) {
  const [state, formAction] = useActionState(action, null);
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);

  const shownTitle = title.trim() ? title.trim() : defaults.usesTemplate ? `${defaults.title} | ${SITE.name}` : defaults.title;
  const shownDesc = description.trim() || defaults.description;
  const tLen = shownTitle.length;
  const dLen = shownDesc.length;

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <input type="hidden" name="path" value={path} />
      <div className="space-y-4">
        <div>
          <label className={labelCls} htmlFor="title">SEO title</label>
          <input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder={defaults.title} maxLength={120} />
          <p className={`${helpCls} ${tLen > 60 ? "!text-bad" : ""}`}>{tLen} characters shown · about 60 or fewer displays fully. Leave empty to use the default. Your text is used exactly as typed, so include the site name yourself if you want it.</p>
        </div>
        <div>
          <label className={labelCls} htmlFor="description">Meta description</label>
          <textarea id="description" name="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} placeholder={defaults.description} maxLength={320} />
          <p className={`${helpCls} ${dLen > 160 ? "!text-bad" : ""}`}>{dLen} characters · aim for 120 to 160. Leave empty to use the default.</p>
        </div>
        <div>
          <label className={labelCls} htmlFor="canonical">Canonical URL (advanced)</label>
          <input id="canonical" name="canonical" defaultValue={initial.canonical} className={inputCls} placeholder="Leave empty unless this page duplicates another" />
        </div>
        <div>
          <label className={labelCls} htmlFor="og_image">Social share image URL</label>
          <input id="og_image" name="og_image" defaultValue={initial.og_image} className={inputCls} placeholder="https://… (1200×630 recommended)" />
        </div>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="noindex" defaultChecked={initial.noindex} className="mt-1" />
          <span><b>noindex</b>: ask search engines not to list this page, and remove it from the sitemap.</span>
        </label>
        <div className="flex items-center gap-3">
          <SubmitButton>Save SEO</SubmitButton>
          <span className="text-xs text-muted">Saving with every field empty removes the override.</span>
        </div>
        <FormMessage state={state} />
      </div>

      <aside>
        <p className="mb-2 text-sm font-semibold">Search result preview</p>
        <div className="rounded-2xl border border-line bg-white p-4 text-left text-black">
          <p className="truncate text-xs text-neutral-600">{SITE.url.replace(/^https?:\/\//, "")}{path === "/" ? "" : path}</p>
          <p className="mt-1 text-lg leading-snug text-[#1a0dab]">{shownTitle.length > 60 ? `${shownTitle.slice(0, 60)}…` : shownTitle}</p>
          <p className="mt-1 text-sm leading-snug text-neutral-700">{shownDesc.length > 160 ? `${shownDesc.slice(0, 160)}…` : shownDesc}</p>
        </div>
        <p className="mt-2 text-xs text-muted">Approximate. Search engines may rewrite titles and descriptions.</p>
      </aside>
    </form>
  );
}
