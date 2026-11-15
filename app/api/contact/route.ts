import { NextResponse } from "next/server";
import { resolveEntry } from "@/lib/content";
import { EMAIL_RE, submitToWp } from "@/lib/wp-submit";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 100) : "";
  const email = typeof body?.email === "string" ? body.email.trim().slice(0, 254) : "";
  const message = typeof body?.message === "string" ? body.message.trim().slice(0, 4000) : "";
  const topic = typeof body?.topic === "string" ? body.topic.trim().slice(0, 120) : "";
  const honeypot = typeof body?.website === "string" ? body.website : "";

  if (honeypot) return NextResponse.json({ ok: true }); // bots fill the hidden field

  // The topic must be one of the topics currently offered on the Contact page.
  let topics: string[];
  try {
    topics = ((await resolveEntry("contact")).values.topics as { label: string }[]).map((t) => t.label);
  } catch {
    return NextResponse.json({ error: "Could not send. Try again later." }, { status: 502 });
  }
  if (!name || !EMAIL_RE.test(email) || message.length < 5 || !topics.includes(topic)) {
    return NextResponse.json({ error: "Please fill in all fields." }, { status: 400 });
  }

  const r = await submitToWp("message", { name, email, topic, message }, req);
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: r.status });
  return NextResponse.json({ ok: true });
}
