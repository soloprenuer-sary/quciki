"use client";

import { usePathname } from "next/navigation";

/** Hides the public site chrome (header, footer, cookie banner, ad script) on /admin pages. */
export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
