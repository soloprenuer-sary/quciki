import Link from "next/link";
import { content } from "@/lib/content";
import { SITE_ENTRY } from "@/lib/content/entries";

export default async function NotFound() {
  const site = await content(SITE_ENTRY);
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-4xl font-extrabold">{site.notFoundTitle}</h1>
      <p className="mt-3 text-muted">{site.notFoundText}</p>
      <Link href="/calculators" className="mt-6 inline-block rounded-xl bg-brand px-5 py-3 font-semibold text-brand-ink">{site.notFoundButton}</Link>
    </main>
  );
}
