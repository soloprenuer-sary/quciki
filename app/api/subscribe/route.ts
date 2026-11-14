import { NextResponse } from "next/server";
import { EMAIL_RE, getSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().slice(0, 254) : "";
  const source = typeof body?.source === "string" ? body.source.slice(0, 80) : null;
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });

  const db = getSupabase();
  if (!db) return NextResponse.json({ error: "Signup is not configured yet." }, { status: 503 });

  const { error } = await db.from("subscribers").insert({ email, source });
  // 23505 = duplicate email: treat as success so we do not reveal who is subscribed.
  if (error && error.code !== "23505") return NextResponse.json({ error: "Could not save. Try again later." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
