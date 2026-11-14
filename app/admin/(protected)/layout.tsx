import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { signOut } from "../actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/guides", label: "Guides" },
  { href: "/admin/seo", label: "SEO" },
  { href: "/admin/calculators", label: "Calculator text" },
  { href: "/admin/redirects", label: "Redirects" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-screen bg-bg lg:grid lg:grid-cols-[220px_1fr]">
      <aside className="border-b border-line bg-surface p-4 lg:min-h-screen lg:border-b-0 lg:border-r">
        <p className="font-extrabold tracking-tight">Admin</p>
        <p className="mb-4 truncate text-xs text-muted">{admin.email}</p>
        <nav aria-label="Admin" className="flex flex-wrap gap-1 lg:flex-col">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-brand-soft hover:text-brand">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-4 flex gap-2 text-sm lg:flex-col">
          <Link href="/" target="_blank" className="rounded-lg px-3 py-2 text-muted hover:bg-brand-soft hover:text-brand">View site ↗</Link>
          <form action={signOut}>
            <button className="w-full rounded-lg border border-line px-3 py-2 text-left text-muted hover:bg-brand-soft">Sign out</button>
          </form>
        </div>
      </aside>
      <div className="min-w-0 p-6">{children}</div>
    </div>
  );
}
