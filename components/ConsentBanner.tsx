"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const KEY = "pc-consent";
const EVENT = "pc-consent-change";
let dismissedInMemory = false; // fallback when localStorage is blocked

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

function getSnapshot() {
  if (dismissedInMemory) return "set";
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

/** Simple privacy notice. For EEA/UK/Swiss traffic Google requires a certified CMP (TCF) in addition to this. */
export function ConsentBanner() {
  // The server snapshot is "server" so the banner is never part of the static HTML (no hydration mismatch).
  const stored = useSyncExternalStore(subscribe, getSnapshot, () => "server");

  function choose(value: "accepted" | "declined") {
    dismissedInMemory = true;
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* storage blocked */
    }
    window.dispatchEvent(new Event(EVENT));
  }

  if (stored !== "") return null;
  return (
    <div role="dialog" aria-label="Cookie notice" className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-2xl rounded-2xl border border-line bg-surface p-4 shadow-card">
      <p className="text-sm text-muted">
        We use cookies to run the site and to show ads from Google and partners, which may use cookies to personalize ads.
        See our <Link className="text-brand underline" href="/privacy-policy">Privacy Policy</Link>.
      </p>
      <div className="mt-3 flex gap-2">
        <button onClick={() => choose("accepted")} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-ink">
          Accept
        </button>
        <button onClick={() => choose("declined")} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold">
          Decline
        </button>
      </div>
    </div>
  );
}
