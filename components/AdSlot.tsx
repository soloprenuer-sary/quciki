"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Reserved-height ad container (prevents layout shift).
 * - No AdSense ID configured: renders nothing in production, a labelled placeholder in development.
 * - `slot` is the ad unit ID from your AdSense account.
 */
export function AdSlot({ client = "", slot, className = "", minHeight = 120 }: { client?: string; slot?: string; className?: string; minHeight?: number }) {
  const CLIENT = client;
  const pushed = useRef(false);

  useEffect(() => {
    if (!CLIENT || !slot || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ad blocked or script not loaded */
    }
  }, [slot, CLIENT]);

  if (!CLIENT || !slot) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div
        aria-hidden
        style={{ minHeight }}
        className={`grid place-items-center rounded-xl border border-dashed border-line text-xs uppercase tracking-widest text-muted ${className}`}
      >
        Ad slot (dev placeholder)
      </div>
    );
  }

  return (
    <div className={className} style={{ minHeight }}>
      <p className="mb-1 text-center text-[10px] uppercase tracking-widest text-muted">Advertisement</p>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
