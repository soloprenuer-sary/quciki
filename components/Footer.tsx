import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { SITE } from "@/lib/site";

// Google AdSense reviewers look for these pages to be easy to find, with clear names.
const POLICY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-extrabold tracking-tight">{SITE.name}</p>
            <p className="mt-2 max-w-xs text-sm text-muted">{SITE.tagline}.</p>
            <p className="mt-4 text-sm">
              <span className="text-muted">Email: </span>
              <a className="font-medium text-brand hover:text-brand-strong" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
            </p>
          </div>

          <nav aria-label="Calculators">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Calculators</p>
            <ul className="mt-3 space-y-2 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link className="hover:text-brand" href={`/${c.slug}`}>{c.name}</Link>
                </li>
              ))}
              <li>
                <Link className="hover:text-brand" href="/guides">Guides</Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Company and policies">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Company</p>
            <ul className="mt-3 space-y-2 text-sm">
              {POLICY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link className="hover:text-brand" href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {SITE.name}. All rights reserved.</p>
          <p>Results are estimates for education only, not financial, legal or engineering advice.</p>
        </div>
      </div>
    </footer>
  );
}
