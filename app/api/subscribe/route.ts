import { NextResponse } from "next/server";
import { EMAIL_RE, submitToWp } from "@/lib/wp-submit";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().slice(0, 254) : "";
  const source = typeof body?.source === "string" ? body.source.slice(0, 80) : "";
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });

  const r = await submitToWp("subscriber", { email, source }, req);
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: r.status });
  return NextResponse.json({ ok: true });
}
