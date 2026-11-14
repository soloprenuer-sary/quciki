import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-4xl font-extrabold">Page not found</h1>
      <p className="mt-3 text-muted">That page does not exist. Try one of our calculators instead.</p>
      <Link href="/calculators" className="mt-6 inline-block rounded-xl bg-brand px-5 py-3 font-semibold text-brand-ink">Browse calculators</Link>
    </main>
  );
}
