import { NextResponse } from "next/server";
import { CALCS } from "@/lib/calc/engine";
import { EMAIL_RE, submitToWp } from "@/lib/wp-submit";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const calculator = typeof body?.calculator === "string" ? body.calculator : "";
  const email = typeof body?.email === "string" ? body.email.trim().slice(0, 254) : "";
  const summary = typeof body?.summary === "string" ? body.summary.slice(0, 500) : "";

  if (!CALCS[calculator]) return NextResponse.json({ error: "Unknown calculator." }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });

  // Keep only numeric inputs that belong to this calculator.
  const inputs: Record<string, number> = {};
  for (const spec of CALCS[calculator].inputs) {
    const n = Number(body?.inputs?.[spec.key]);
    if (Number.isFinite(n)) inputs[spec.key] = n;
  }

  const r = await submitToWp("estimate", { calculator, email, inputs, summary }, req);
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: r.status });
  return NextResponse.json({ ok: true });
}
