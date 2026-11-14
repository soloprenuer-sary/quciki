import Link from "next/link";
import { SITE } from "@/lib/site";
import { CATEGORIES } from "@/lib/categories";

const LINKS = [
  ...CATEGORIES.map((c) => ({ href: `/${c.slug}`, label: c.short })),
  { href: "/calculators", label: "All tools" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
          <span aria-hidden className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-sm text-brand-ink">
            PC
          </span>
          <span>{SITE.name}</span>
        </Link>

        <nav aria-label="Main" className="ml-auto hidden gap-1 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-full px-3 py-2 text-sm text-muted transition hover:bg-brand-soft hover:text-brand">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* No-JS mobile menu */}
        <details className="relative ml-auto md:hidden">
          <summary className="cursor-pointer list-none rounded-lg border border-line px-3 py-2 text-sm font-medium">Menu</summary>
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-line bg-surface p-2 shadow-card">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="block rounded-lg px-3 py-2 text-sm hover:bg-brand-soft">
                {l.label}
              </Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
