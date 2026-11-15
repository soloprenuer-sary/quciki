import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { WP_TAG } from "@/lib/wp";

/**
 * Called by the WordPress plugin when content is published or changed.
 * Requires the shared secret in the `x-revalidate-secret` header (REVALIDATE_SECRET env var).
 */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET ?? "";
  const given = req.headers.get("x-revalidate-secret") ?? "";
  const a = Buffer.from(secret);
  const b = Buffer.from(given);
  if (secret.length < 16 || a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidateTag(WP_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
