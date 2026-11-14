import { compactMoney } from "@/lib/format";
import type { Series } from "@/lib/calc/types";

export function LineChart({ series }: { series: Series }) {
  const W = 640;
  const H = 260;
  const P = { l: 60, r: 14, t: 12, b: 28 };
  const pts = series.lines.flatMap((l) => l.points);
  if (!pts.length) return null;

  const ys = pts.map((p) => p.y);
  const xs = pts.map((p) => p.x);
  const rawMin = Math.min(0, ...ys);
  const rawMax = Math.max(1, ...ys);
  // Round the axis to "nice" values so tick labels read $0, $5K, $10K instead of $-660.
  const rawStep = (rawMax - rawMin) / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
  const minY = Math.floor(rawMin / step) * step;
  const maxY = Math.ceil(rawMax / step) * step;
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const sx = (x: number) => P.l + (maxX === minX ? 0 : ((x - minX) / (maxX - minX)) * (W - P.l - P.r));
  const sy = (y: number) => P.t + ((maxY - y) / (maxY - minY || 1)) * (H - P.t - P.b);
  const fmtY = series.format === "currency" ? compactMoney : (n: number) => `${n.toFixed(0)}%`;

  const ticks = Array.from({ length: Math.round((maxY - minY) / step) + 1 }, (_, i) => minY + i * step);
  const uniqueX = Array.from(new Set(xs)).sort((a, b) => a - b);
  const stride = Math.max(1, Math.ceil(uniqueX.length / 7));
  const xTicks = uniqueX.filter((_, i) => i % stride === 0 || i === uniqueX.length - 1);

  const desc = series.lines
    .map((l) => `${l.name} ends at ${fmtY(l.points[l.points.length - 1].y)}`)
    .join("; ");

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${series.title}. ${desc}.`} className="block h-auto w-full text-muted">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={P.l} x2={W - P.r} y1={sy(t)} y2={sy(t)} stroke="currentColor" opacity={t === 0 && minY < 0 ? 0.6 : 0.2} strokeWidth={t === 0 && minY < 0 ? 1.5 : 1} />
            <text x={P.l - 8} y={sy(t) + 4} textAnchor="end" fontSize={11} fill="currentColor">
              {fmtY(t)}
            </text>
          </g>
        ))}
        {xTicks.map((x) => (
          <text key={x} x={sx(x)} y={H - 8} textAnchor="middle" fontSize={11} fill="currentColor">
            {series.xPrefix}
            {Number(x.toFixed(1))}
          </text>
        ))}
        {series.lines.map((l) => (
          <path
            key={l.name}
            d={l.points.map((p, i) => `${i ? "L" : "M"}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" ")}
            fill="none"
            stroke={l.color}
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-4 text-sm text-muted">
        {series.lines.map((l) => (
          <span key={l.name} className="flex items-center gap-2">
            <i className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: l.color }} />
            {l.name}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
