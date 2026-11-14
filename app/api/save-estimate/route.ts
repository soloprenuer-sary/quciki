import { NextResponse } from "next/server";
import { CALCS } from "@/lib/calc/engine";
import { EMAIL_RE, getSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const calculator = typeof body?.calculator === "string" ? body.calculator : "";
  const email = typeof body?.email === "string" ? body.email.trim().slice(0, 254) : "";
  const summary = typeof body?.summary === "string" ? body.summary.slice(0, 500) : null;

  if (!CALCS[calculator]) return NextResponse.json({ error: "Unknown calculator." }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });

  // Keep only numeric inputs that belong to this calculator.
  const inputs: Record<string, number> = {};
  for (const spec of CALCS[calculator].inputs) {
    const n = Number(body?.inputs?.[spec.key]);
    if (Number.isFinite(n)) inputs[spec.key] = n;
  }

  const db = getSupabase();
  if (!db) return NextResponse.json({ error: "Saving is not configured yet." }, { status: 503 });

  const { error } = await db.from("saved_estimates").insert({ calculator, email, inputs, summary });
  if (error) return NextResponse.json({ error: "Could not save. Try again later." }, { status: 500 });

  // Also add to the mailing list; ignore duplicates and failures here.
  await db.from("subscribers").insert({ email, source: `estimate:${calculator}` });
  return NextResponse.json({ ok: true });
}
