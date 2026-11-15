import type { WpPage } from "@/lib/wp";
import { RichHtml } from "./RichHtml";

const fmt = (iso: string) => iso.slice(0, 10);

/** A text page (privacy, terms, disclaimer) edited in WordPress. */
export function WpPageView({ page }: { page: WpPage }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{page.title}</h1>
      <p className="mt-2 text-sm text-muted">
        {page.reviewedAt
          ? `Last reviewed: ${fmt(page.reviewedAt)}${page.reviewedBy ? ` by ${page.reviewedBy}` : ""}`
          : `Last updated: ${fmt(page.updated)}`}
      </p>
      <div className="prose-pc mt-4">
        <RichHtml html={page.bodyHtml} />
      </div>
    </main>
  );
}
