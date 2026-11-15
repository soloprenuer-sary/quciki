import { NextResponse, type NextRequest } from "next/server";

/*
 * Applies redirects managed in WordPress (Quciki > Redirects).
 * The list is fetched from a small WordPress endpoint and cached in memory for a minute, so most
 * requests never leave the server. If WordPress is down, the last known list keeps working.
 */

interface Hit {
  to: string;
  permanent: boolean;
}
let cache: { at: number; map: Map<string, Hit> } | null = null;
const TTL_MS = 60_000;

const SAFE_DEST = /^(\/(?!\/)[^\s]*|https:\/\/[^\s]+)$/;

async function redirectMap(): Promise<Map<string, Hit>> {
  const base = (process.env.WORDPRESS_URL ?? "").trim().replace(/\/+$/, "");
  if (!/^https?:\/\//.test(base)) return new Map();
  if (cache && Date.now() - cache.at < TTL_MS) return cache.map;
  try {
    const res = await fetch(`${base}/wp-json/quciki/v1/redirects`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(1500),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(String(res.status));
    const rows = (await res.json()) as unknown;
    const map = new Map<string, Hit>();
    if (Array.isArray(rows)) {
      for (const r of rows) {
        const source = typeof r?.source === "string" ? r.source : "";
        const to = typeof r?.destination === "string" ? r.destination : "";
        if (!source.startsWith("/") || source.startsWith("//") || /[\s?#]/.test(source)) continue;
        if (/^\/(api|_next)(\/|$)/.test(source) || source === to || !SAFE_DEST.test(to)) continue;
        map.set(source.length > 1 && source.endsWith("/") ? source.slice(0, -1) : source, { to, permanent: r.permanent !== false });
      }
    }
    cache = { at: Date.now(), map };
    return map;
  } catch {
    // On failure keep serving the last known list (or none) and retry in a minute.
    cache = { at: Date.now(), map: cache?.map ?? new Map() };
    return cache.map;
  }
}

export async function proxy(request: NextRequest) {
  const map = await redirectMap();
  if (map.size) {
    const { pathname } = request.nextUrl;
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
