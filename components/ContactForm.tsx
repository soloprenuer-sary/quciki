"use client";

import { useState } from "react";
import { CONTACT_TOPICS } from "@/lib/contact";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setState("done");
      setMsg("Thanks! Your message was sent. We will reply to the email you gave us.");
      form.reset();
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const input =
    "w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-ink placeholder:text-muted focus:border-brand focus:outline-none";
  const label = "mb-1.5 block text-sm font-semibold";
  return (
    <form onSubmit={submit} className="space-y-5" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>Name</label>
          <input id="name" name="name" required maxLength={100} autoComplete="name" className={input} />
        </div>
        <div>
          <label htmlFor="email" className={label}>Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" className={input} />
        </div>
      </div>

      <div>
        <label htmlFor="topic" className={label}>What is this about?</label>
        <select id="topic" name="topic" required defaultValue="" className={input}>
          <option value="" disabled>Choose a topic</option>
          {CONTACT_TOPICS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className={label}>Message</label>
        <textarea
          id="message"
          name="message"
          required
          minLength={5}
          maxLength={4000}
          rows={6}
          placeholder="For a correction, include the calculator name, the line you think is wrong and your source if you have one."
          className={input}
        />
        <p className="mt-1.5 text-xs text-muted">Up to 4,000 characters. Please don&apos;t send personal financial details.</p>
      </div>

      {/* Honeypot: hidden from people, filled by bots */}
      <div aria-hidden className="hidden">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          disabled={state === "loading"}
          className="rounded-lg bg-brand px-6 py-3 font-semibold text-brand-ink transition hover:bg-brand-strong disabled:opacity-60"
        >
          {state === "loading" ? "Sending…" : "Send message"}
        </button>
        <p role="status" aria-live="polite" className={`text-sm ${state === "error" ? "text-bad" : "text-good"}`}>
          {state === "done" || state === "error" ? msg : ""}
        </p>
      </div>
    </form>
  );
}
