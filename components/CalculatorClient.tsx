"use client";

import { useMemo, useState } from "react";
import { CALCS, defaultsFor } from "@/lib/calc/engine";
import type { Tone, Values } from "@/lib/calc/types";
import { money, percent } from "@/lib/format";
import { EmailForm, type EmailFormLabels } from "./EmailForm";
import { LineChart } from "./LineChart";
import { AdSlot } from "./AdSlot";

const toneClass: Record<Tone, string> = {
  good: "text-good",
  bad: "text-bad",
  neutral: "text-ink",
};

function groupInputs<T extends { group: string }>(items: T[]) {
  const map = new Map<string, T[]>();
  for (const i of items) map.set(i.group, [...(map.get(i.group) ?? []), i]);
  return [...map.entries()];
}

export interface CalculatorText {
  inputsLabel: string;
  sliderSuffix: string;
  resetButton: string;
  resultsLabel: string;
  saveTitle: string;
  save: EmailFormLabels;
  /** Edited labels for each input, keyed by input key. Empty strings mean "none". */
  inputs: Record<string, { label?: string; help?: string; prefix?: string; suffix?: string }>;
}

export function CalculatorClient({ slug, adSlot, adClient, text }: { slug: string; adSlot?: string; adClient?: string; text: CalculatorText }) {
  const base = CALCS[slug];
  // Labels, help text and units can be edited in WordPress. Ranges, defaults and the maths always come from code.
  const def = useMemo(
    () => ({
      ...base,
      inputs: base.inputs.map((i) => {
        const o = text.inputs[i.key];
        if (!o) return i;
        return { ...i, label: o.label || i.label, help: o.help || undefined, prefix: o.prefix || undefined, suffix: o.suffix || undefined };
      }),
    }),
    [base, text.inputs],
  );
  const [values, setValues] = useState<Values>(() => defaultsFor(slug));
  // Clamp to each input's valid range so typing 0 (or clearing a box) never produces NaN or Infinity results.
  const result = useMemo(() => {
    const safe: Values = {};
    for (const i of def.inputs) {
      const n = Number.isFinite(values[i.key]) ? values[i.key] : i.default;
      safe[i.key] = Math.min(Math.max(n, i.min), i.max);
    }
    return base.compute(safe);
  }, [base, def.inputs, values]);
  const groups = useMemo(() => groupInputs(def.inputs), [def]);

  const set = (key: string, raw: string) => {
    const n = parseFloat(raw);
    setValues((v) => ({ ...v, [key]: Number.isFinite(n) ? n : 0 }));
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[380px_1fr]">
      {/* ---------- Inputs ---------- */}
      <form
        onSubmit={(e) => e.preventDefault()}
        aria-label={text.inputsLabel}
        className="rounded-2xl border border-line bg-surface p-5 shadow-card lg:sticky lg:top-20"
      >
        {groups.map(([group, items]) => (
          <fieldset key={group} className="mb-5 border-0 p-0">
            <legend className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">{group}</legend>
            {items.map((i) => {
              const id = `in-${i.key}`;
              return (
                <div key={i.key} className="mb-4">
                  <label htmlFor={id} className="mb-1 block text-sm font-semibold">
                    {i.label}
                  </label>
                  <div className="relative">
                    {i.prefix && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">{i.prefix}</span>}
                    <input
                      id={id}
                      type="number"
                      inputMode="decimal"
                      min={i.min}
                      max={i.max}
                      step={i.step}
                      value={Number.isFinite(values[i.key]) ? values[i.key] : ""}
                      onChange={(e) => set(i.key, e.target.value)}
                      aria-describedby={i.help ? `${id}-help` : undefined}
                      className={`w-full rounded-lg border border-line bg-bg py-2 tabular-nums ${i.prefix ? "pl-7" : "pl-3"} ${i.suffix ? "pr-16" : "pr-3"}`}
                    />
                    {i.suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">{i.suffix}</span>}
                  </div>
                  <input
                    type="range"
                    aria-label={`${i.label} ${text.sliderSuffix}`}
                    min={i.min}
                    max={i.max}
                    step={i.step}
                    value={Math.min(Math.max(values[i.key], i.min), i.max)}
                    onChange={(e) => set(i.key, e.target.value)}
                    className="mt-2 w-full"
                  />
                  {i.help && (
                    <p id={`${id}-help`} className="mt-1 text-xs text-muted">
                      {i.help}
                    </p>
                  )}
                </div>
              );
            })}
          </fieldset>
        ))}
        <button
          type="button"
          onClick={() => setValues(defaultsFor(slug))}
          className="w-full rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:bg-brand-soft"
        >
          {text.resetButton}
        </button>
      </form>

      {/* ---------- Results ---------- */}
      <div className="grid gap-6">
        <section aria-live="polite" aria-label={text.resultsLabel} className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <p className="rounded-xl bg-brand-soft p-4 text-base font-semibold leading-snug">{result.verdict.text}</p>

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {result.kpis.map((k) => (
              <div key={k.label} className="rounded-xl border border-line p-3">
                <p className={`text-xl font-extrabold tabular-nums tracking-tight ${toneClass[k.tone ?? "neutral"]}`}>{k.value}</p>
                <p className="mt-0.5 text-xs text-muted">{k.label}</p>
                {k.hint && <p className="mt-1 text-[11px] leading-snug text-muted">{k.hint}</p>}
              </div>
            ))}
          </div>

          {result.series && (
            <div className="mt-6">
              <h2 className="mb-2 text-lg font-bold">{result.series.title}</h2>
              <LineChart series={result.series} />
            </div>
          )}

          {result.breakdown && (
            <div className="mt-6">
              <h2 className="mb-3 text-lg font-bold">{result.breakdown.title}</h2>
              <ul className="grid gap-2.5">
                {result.breakdown.items.map((b) => {
                  const share = (b.value / result.breakdown!.total) * 100;
                  return (
                    <li key={b.label} className="grid grid-cols-[100px_1fr_84px] items-center gap-3 text-sm sm:grid-cols-[140px_1fr_96px]">
                      <span>{b.label}</span>
                      <span className="h-3 overflow-hidden rounded-full bg-line" role="img" aria-label={`${b.label}: ${percent(share, 0)} of the total`}>
                        <span className="block h-full rounded-full transition-[width]" style={{ width: `${Math.min(100, Math.max(0, share))}%`, background: b.color }} />
                      </span>
                      <span className="text-right tabular-nums">{money(b.value)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="mt-6 border-t border-line pt-4">
            <p className="mb-2 text-sm font-semibold">{text.saveTitle}</p>
            <EmailForm
              endpoint="/api/save-estimate"
              extra={{ calculator: slug, inputs: values, summary: result.verdict.text }}
              labels={text.save}
            />
          </div>
        </section>

        {adSlot !== undefined && <AdSlot client={adClient} slot={adSlot || undefined} minHeight={120} />}

        {result.table && (
          <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
            <h2 className="mb-3 text-lg font-bold">{result.table.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm tabular-nums">
                <thead>
                  <tr>
                    {result.table.columns.map((c, idx) => (
                      <th key={c} scope="col" className={`border-b border-line py-2 text-xs font-semibold uppercase tracking-wide text-muted ${idx ? "text-right" : "text-left"}`}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.table.rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci} className={`border-b border-line py-2 ${ci ? "text-right" : "text-left"}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
