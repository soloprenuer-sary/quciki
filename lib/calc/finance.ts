/** Fixed-rate monthly payment (principal + interest). */
export function monthlyPayment(loan: number, annualRatePct: number, years: number) {
  const n = years * 12;
  if (loan <= 0 || n <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  return r > 0 ? (loan * r) / (1 - Math.pow(1 + r, -n)) : loan / n;
}

/** Remaining loan balance after `months` payments. */
export function loanBalance(loan: number, annualRatePct: number, years: number, months: number) {
  const n = years * 12;
  if (loan <= 0) return 0;
  if (months >= n) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return loan * (1 - months / n);
  const pmt = monthlyPayment(loan, annualRatePct, years);
  return loan * Math.pow(1 + r, months) - pmt * ((Math.pow(1 + r, months) - 1) / r);
}
