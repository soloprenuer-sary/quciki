import { draftMode } from "next/headers";

/** Shown only to editors who opened the site through "Preview on site" in WordPress. */
export async function PreviewBar() {
  if (!(await draftMode()).isEnabled) return null;
  return (
    <div role="status" className="sticky top-0 z-50 flex items-center justify-center gap-3 bg-accent px-4 py-2 text-sm font-semibold text-black">
      <span>Preview mode: you are seeing unpublished changes.</span>
      {/* A plain link: leaving preview must work without JavaScript. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/api/preview/exit" className="rounded bg-black/10 px-2 py-0.5 underline">Exit preview</a>
    </div>
  );
}
