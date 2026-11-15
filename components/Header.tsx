import Link from "next/link";
import { content, getMenu } from "@/lib/content";
import { SITE_ENTRY } from "@/lib/content/entries";

export async function Header() {
  const site = await content(SITE_ENTRY);
  const links = await getMenu("header");
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
          {site.logoImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={site.logoImage} alt="" className="h-8 w-8 rounded-lg object-cover" />
          ) : (
            <span aria-hidden className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-sm text-brand-ink">
              {site.logoText}
            </span>
          )}
          <span>{site.name}</span>
        </Link>

        <nav aria-label="Main" className="ml-auto hidden gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.url + l.label} href={l.url} className="rounded-full px-3 py-2 text-sm text-muted transition hover:bg-brand-soft hover:text-brand">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* No-JS mobile menu */}
        <details className="relative ml-auto md:hidden">
          <summary className="cursor-pointer list-none rounded-lg border border-line px-3 py-2 text-sm font-medium">{site.menuButton}</summary>
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-line bg-surface p-2 shadow-card">
            {links.map((l) => (
              <Link key={l.url + l.label} href={l.url} className="block rounded-lg px-3 py-2 text-sm hover:bg-brand-soft">
                {l.label}
              </Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
