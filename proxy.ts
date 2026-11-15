import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

/*
 * Applies redirects managed in WordPress (Quciki > Redirects).
 * The list is fetched from a small WordPress endpoint and kept in memory. If WordPress is down, the last known
 * list keeps working.
 */

interface Hit {
  to: string;
  permanent: boolean;
}

/** Last good list, when it was fetched, and when to try again. */
let state: { map: Map<string, Hit>; fetchedAt: number; retryAt: number } | null = null;
let inflight: Promise<void> | null = null;

const FRESH_MS = 60_000; // use the list as is for a minute
const RETRY_MS = 10_000; // after a failure, try again soon
const TIMEOUT_MS = 5_000;

const SAFE_DEST = /^(\/(?!\/)[^\s]*|https:\/\/[^\s]+)$/;

function parse(rows: unknown): Map<string, Hit> {
  const map = new Map<string, Hit>();
  if (!Array.isArray(rows)) return map;
  for (const r of rows) {
    const source = typeof r?.source === "string" ? r.source : "";
    const to = typeof r?.destination === "string" ? r.destination : "";
    if (!source.startsWith("/") || source.startsWith("//") || /[\s?#]/.test(source)) continue;
    if (/^\/(api|_next)(\/|$)/.test(source) || source === to || !SAFE_DEST.test(to)) continue;
    map.set(source.length > 1 && source.endsWith("/") ? source.slice(0, -1) : source, { to, permanent: r.permanent !== false });
  }
  return map;
}

async function refresh(base: string): Promise<void> {
  try {
    const res = await fetch(`${base}/wp-json/quciki/v1/redirects`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(String(res.status));
    const now = Date.now();
    state = { map: parse(await res.json()), fetchedAt: now, retryAt: now + FRESH_MS };
  } catch {
    // Keep the last good list and try again soon.
    state = { map: state?.map ?? new Map(), fetchedAt: state?.fetchedAt ?? 0, retryAt: Date.now() + RETRY_MS };
  }
}

/**
 * Redirects come from WordPress. Once a list is known, requests never wait for WordPress: a stale list is used
 * immediately and refreshed in the background. Only the very first request on a cold server waits (up to 5 seconds).
 */
async function redirectMap(event: NextFetchEvent): Promise<Map<string, Hit>> {
  const base = (process.env.WORDPRESS_URL ?? "").trim().replace(/\/+$/, "");
  if (!/^https?:\/\//.test(base)) return new Map();
  const now = Date.now();
  if (state && now < state.retryAt) return state.map;

  inflight ??= refresh(base).finally(() => {
    inflight = null;
  });
  if (state) {
    event.waitUntil(inflight);
    return state.map;
  }
  await inflight;
  return state!.map;
}

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const map = await redirectMap(event);
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
