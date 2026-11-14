const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const money = (n: number) => (Number.isFinite(n) ? usd.format(n) : "—");

export const moneySigned = (n: number) =>
  Number.isFinite(n) ? `${n >= 0 ? "+" : "−"}${usd.format(Math.abs(n))}` : "—";

export const percent = (n: number, digits = 1) =>
  Number.isFinite(n) ? `${n.toFixed(digits).replace("-", "−")}%` : "—";

/** Compact axis label like $120K / $1.2M */
export function compactMoney(n: number) {
  const abs = Math.abs(n);
  const sign = n < 0 ? "−" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${Math.round(abs / 1_000)}K`;
  return `${sign}$${Math.round(abs)}`;
}

/** Plain number with thousands separators, e.g. 1,234.5 */
export const num = (n: number, digits = 1) =>
  Number.isFinite(n) ? n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: digits }) : "—";
