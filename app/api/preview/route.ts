import { cookies, draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { PREVIEW_COOKIE, wpBase, wpConfigured } from "@/lib/wp";

/**
 * Opens the site in preview mode for a WordPress editor.
 * WordPress creates a short-lived, random token when the editor clicks "Preview on site". Here we confirm
 * the token with WordPress (server to server, with the shared secret) before turning preview mode on.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  const path = url.searchParams.get("path") ?? "/";
  const secret = process.env.REVALIDATE_SECRET ?? "";

  if (!/^[a-f0-9]{32}$/.test(token) || !wpConfigured() || secret.length < 16) {
    return NextResponse.json({ error: "Invalid preview link." }, { status: 401 });
  }
  // Only same-site paths: "/something", never "//host" or a full URL.
  const dest = path.startsWith("/") && !path.startsWith("//") && !/[\s\\]/.test(path) ? path : "/";

  try {
    const res = await fetch(`${wpBase()}/wp-json/quciki/v1/preview`, {
      headers: { Accept: "application/json", "x-revalidate-secret": secret, "x-preview-token": token },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!res.ok) return NextResponse.json({ error: "This preview link has expired. Click Preview again in WordPress." }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "WordPress is not reachable." }, { status: 502 });
  }

  (await draftMode()).enable();
  (await cookies()).set(PREVIEW_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 30,
  });
  const res = NextResponse.redirect(new URL(dest, req.url));
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}
