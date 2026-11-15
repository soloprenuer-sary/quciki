import Link from "next/link";
import { content, getMenu, siteVars } from "@/lib/content";
import { SITE_ENTRY } from "@/lib/content/entries";

export async function Footer() {
  const site = await content(SITE_ENTRY);
  const vars = await siteVars();
  const calc = await getMenu("footer_calculators");
  const company = await getMenu("footer_company");
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-extrabold tracking-tight">{site.name}</p>
            <p className="mt-2 max-w-xs text-sm text-muted">{site.footerBlurb}</p>
            <p className="mt-4 text-sm">
              <span className="text-muted">{site.footerEmailLabel} </span>
              <a className="font-medium text-brand hover:text-brand-strong" href={`mailto:${vars.email}`}>
                {vars.email}
              </a>
            </p>
          </div>

          <nav aria-label={site.footerCalcHeading}>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">{site.footerCalcHeading}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {calc.map((l) => (
                <li key={l.url + l.label}>
                  <Link className="hover:text-brand" href={l.url}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={site.footerCompanyHeading}>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">{site.footerCompanyHeading}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {company.map((l) => (
                <li key={l.url + l.label}>
                  <Link className="hover:text-brand" href={l.url}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{site.copyright}</p>
          <p>{site.footerNote}</p>
        </div>
      </div>
    </footer>
  );
}
