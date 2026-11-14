"use client";

import { useState } from "react";

type State = "idle" | "loading" | "done" | "error";

export function EmailForm({
  endpoint = "/api/subscribe",
  extra = {},
  cta = "Subscribe",
  placeholder = "you@example.com",
  success = "Thanks! You are on the list.",
}: {
  endpoint?: string;
  extra?: Record<string, unknown>;
  cta?: string;
  placeholder?: string;
  success?: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...extra }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setState("done");
      setMsg(success);
      setEmail("");
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap gap-2" noValidate>
      <label className="sr-only" htmlFor="email-input">Email address</label>
      <input
        id="email-input"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-lg border border-line bg-bg px-3 py-2"
      />
      <button disabled={state === "loading"} className="rounded-lg bg-brand px-4 py-2 font-semibold text-brand-ink disabled:opacity-60">
        {state === "loading" ? "Saving…" : cta}
      </button>
      <p role="status" aria-live="polite" className={`w-full text-sm ${state === "error" ? "text-bad" : "text-good"}`}>
        {state === "done" || state === "error" ? msg : ""}
      </p>
    </form>
  );
}
