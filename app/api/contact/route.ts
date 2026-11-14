import { NextResponse } from "next/server";
import { EMAIL_RE, getSupabase } from "@/lib/supabase";
import { isContactTopic, topicLabel } from "@/lib/contact";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 100) : "";
  const email = typeof body?.email === "string" ? body.email.trim().slice(0, 254) : "";
  const message = typeof body?.message === "string" ? body.message.trim().slice(0, 4000) : "";
  const topic = body?.topic;
  const honeypot = typeof body?.website === "string" ? body.website : "";

  if (honeypot) return NextResponse.json({ ok: true }); // bots fill hidden field
  if (!name || !EMAIL_RE.test(email) || message.length < 5 || !isContactTopic(topic)) {
    return NextResponse.json({ error: "Please fill in all fields." }, { status: 400 });
  }

  const db = getSupabase();
  if (!db) return NextResponse.json({ error: "Contact form is not configured yet." }, { status: 503 });

  // The table has no topic column, so the topic is stored as the first line of the message.
  const stored = `[${topicLabel(topic)}]\n${message}`.slice(0, 4000);
  const { error } = await db.from("contact_messages").insert({ name, email, message: stored });
  if (error) return NextResponse.json({ error: "Could not send. Try again later." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
