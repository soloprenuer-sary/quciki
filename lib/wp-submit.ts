import { createHash } from "node:crypto";
import { wpBase, wpConfigured } from "./wp";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SubmitType = "message" | "subscriber" | "estimate";

export interface SubmitResult {
  ok: boolean;
  status: number;
  error?: string;
}

/** A stable, anonymous id for rate limiting in WordPress. The raw IP address is never sent. */
function clientId(req: Request): string {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`${process.env.REVALIDATE_SECRET ?? ""}|${ip}`).digest("hex").slice(0, 32);
}

/** Sends a form submission to WordPress (server to server, with the shared secret). */
export async function submitToWp(type: SubmitType, data: Record<string, unknown>, req: Request): Promise<SubmitResult> {
  const secret = process.env.REVALIDATE_SECRET ?? "";
  if (!wpConfigured() || secret.length < 16) return { ok: false, status: 503, error: "This form is not configured yet." };
  try {
    const res = await fetch(`${wpBase()}/wp-json/quciki/v1/submit/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-revalidate-secret": secret, "x-qk-client": clientId(req) },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (res.status === 429) return { ok: false, status: 429, error: "Too many attempts. Please try again later." };
    if (!res.ok) {
      // Visitors only see a generic message. The real reason is in the Vercel function logs.
      const why = res.status === 401 ? "WordPress rejected the shared secret (REVALIDATE_SECRET in Vercel must equal the secret saved in WordPress)" : `WordPress answered ${res.status}`;
      console.error(`[quciki] form "${type}" could not be saved: ${why}`);
      return { ok: false, status: res.status === 400 ? 400 : 502, error: "Could not save. Try again later." };
    }
    return { ok: true, status: 200 };
  } catch (err) {
    console.error(`[quciki] form "${type}" could not be saved: WordPress unreachable (${err instanceof Error ? err.message : err})`);
    return { ok: false, status: 502, error: "Could not save. Try again later." };
  }
}
