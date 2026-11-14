import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/*
 * Two jobs, both best-effort and fast:
 *  1. /admin: keep the Supabase session fresh and tell search engines not to index it.
 *     Real authorization happens in server code and database rules, NOT here.
 *  2. Everything else: apply redirects saved in Admin > Redirects.
 *     The redirect list is cached in memory for a minute, so most requests never touch the database.
 */

interface Hit {
  to: string;
  permanent: boolean;
}
let cache: { at: number; map: Map<string, Hit> } | null = null;
const TTL_MS = 60_000;

async function redirectMap(): Promise<Map<string, Hit>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return new Map();
  if (cache && Date.now() - cache.at < TTL_MS) return cache.map;
  try {
    const res = await fetch(`${url}/rest/v1/redirects?select=source,destination,permanent&active=eq.true&limit=2000`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(1500),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(String(res.status));
    const rows = (await res.json()) as { source: string; destination: string; permanent: boolean }[];
    const map = new Map(rows.map((r) => [r.source, { to: r.destination, permanent: r.permanent }]));
    cache = { at: Date.now(), map };
    return map;
  } catch {
    // On failure keep serving the last known list (or none) and retry in a minute.
    cache = { at: Date.now(), map: cache?.map ?? new Map() };
    return cache.map;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    let response = NextResponse.next({ request });
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const supabase = createServerClient(url, key, {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll(list) {
            list.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          },
        },
      });
      await supabase.auth.getUser(); // refreshes an expiring session and rewrites the cookies
    }
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  const map = await redirectMap();
  if (map.size) {
    const key = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    const hit = map.get(key);
    if (hit) {
      const target = /^https:\/\//.test(hit.to) ? new URL(hit.to) : new URL(hit.to, request.url);
      return NextResponse.redirect(target, hit.permanent ? 308 : 307);
    }
  }
  return NextResponse.next();
}

export const config = {
  // Skip Next internals, API routes and any path with a file extension (images, sitemap.xml, robots.txt, ads.txt).
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
