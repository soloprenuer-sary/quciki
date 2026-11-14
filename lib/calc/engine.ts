import { loanBalance, monthlyPayment } from "./finance";
import { money, moneySigned, percent } from "../format";
import type { CalcDef, Tone, Values } from "./types";
import { CONSTRUCTION_CALCS } from "./construction";
import { PERSONAL_FINANCE_CALCS } from "./personal-finance";
import { AUTO_CALCS } from "./auto";
import { BUSINESS_CALCS } from "./business";

const BRAND = "#0f766e";
const AMBER = "#f59e0b";
const SLATE = "#64748b";
const VIOLET = "#8b5cf6";
const BLUE = "#3b82f6";
const RED = "#ef4444";

const tone = (ok: boolean): Tone => (ok ? "good" : "bad");

/* ------------------------------------------------------------------ */
/* Buy vs Rent                                                         */
/* ------------------------------------------------------------------ */
const buyVsRent: CalcDef = {
  inputs: [
    { key: "price", label: "Home price", group: "Buying", default: 450000, min: 50000, max: 3000000, step: 5000, prefix: "$" },
    { key: "down", label: "Down payment", group: "Buying", default: 20, min: 0, max: 100, step: 1, suffix: "%" },
    { key: "rate", label: "Mortgage rate (APR)", group: "Buying", default: 6.5, min: 1, max: 12, step: 0.05, suffix: "%" },
    { key: "term", label: "Loan term", group: "Buying", default: 30, min: 10, max: 40, step: 5, suffix: "yrs" },
    { key: "tax", label: "Property tax", group: "Buying", default: 1.1, min: 0, max: 4, step: 0.05, suffix: "%/yr", help: "Share of home value paid in tax each year. US average is about 1%." },
    { key: "ins", label: "Home insurance", group: "Buying", default: 1800, min: 0, max: 12000, step: 100, prefix: "$", suffix: "/yr" },
    { key: "maint", label: "Maintenance", group: "Buying", default: 1, min: 0, max: 4, step: 0.1, suffix: "%/yr", help: "A common rule of thumb is 1% of home value per year." },
    { key: "appr", label: "Home appreciation", group: "Buying", default: 3, min: -3, max: 10, step: 0.1, suffix: "%/yr" },
    { key: "closing", label: "Buying closing costs", group: "Buying", default: 3, min: 0, max: 8, step: 0.5, suffix: "%" },
    { key: "selling", label: "Selling costs", group: "Buying", default: 6, min: 0, max: 10, step: 0.5, suffix: "%", help: "Agent fees and closing costs when you eventually sell." },
    { key: "rent", label: "Monthly rent today", group: "Renting", default: 2400, min: 300, max: 20000, step: 50, prefix: "$" },
    { key: "rentInc", label: "Rent increase", group: "Renting", default: 3, min: 0, max: 10, step: 0.1, suffix: "%/yr" },
    { key: "invest", label: "Investment return", group: "Renting", default: 6, min: 0, max: 12, step: 0.1, suffix: "%/yr", help: "What the renter earns by investing the down payment and monthly savings." },
    { key: "years", label: "How long you will stay", group: "Horizon", default: 10, min: 1, max: 40, step: 1, suffix: "yrs" },
  ],
  compute(v) {
    const loan0 = v.price * (1 - v.down / 100);
    const closing = v.price * (v.closing / 100);
    const pmt = monthlyPayment(loan0, v.rate, v.term);
    const rg = v.invest / 100 / 12;
    const months = Math.round(v.years * 12);
    const r = v.rate / 100 / 12;

    let loan = loan0;
    let home = v.price;
    let rentMo = v.rent;
    let renterInv = v.price * (v.down / 100) + closing;
    const rows: { year: number; buyer: number; renter: number }[] = [];

    for (let m = 1; m <= months; m++) {
      if (m > 1 && (m - 1) % 12 === 0) {
        rentMo *= 1 + v.rentInc / 100;
        home *= 1 + v.appr / 100;
      }
      const interest = loan * r;
      const principal = Math.min(Math.max(pmt - interest, 0), loan);
      loan = Math.max(loan - principal, 0);
      const paidPI = loan0 > 0 && m <= v.term * 12 ? pmt : 0;
      const ownCost = paidPI + (home * (v.tax / 100) + v.ins + home * (v.maint / 100)) / 12;
      renterInv = renterInv * (1 + rg) + (ownCost - rentMo);
      if (m % 12 === 0) {
        rows.push({ year: m / 12, buyer: home * (1 - v.selling / 100) - loan, renter: renterInv });
      }
    }

    const last = rows[rows.length - 1] ?? { year: 0, buyer: 0, renter: 0 };
    const diff = last.buyer - last.renter;
    const be = rows.find((r2) => r2.buyer >= r2.renter)?.year ?? null;
    const firstYearOwn = pmt + (v.price * (v.tax / 100) + v.ins + v.price * (v.maint / 100)) / 12;

    const verdictText =
      diff >= 0
        ? `Buying comes out ahead by ${money(diff)} after ${v.years} years.${be ? ` Break-even is in year ${be}.` : ""}`
        : `Renting comes out ahead by ${money(-diff)} after ${v.years} years.${be ? ` Buying catches up in year ${be}.` : " Buying does not catch up in this period."}`;

    const step = Math.max(1, Math.round(rows.length / 10));
    return {
      verdict: { text: verdictText, tone: diff >= 0 ? "good" : "neutral" },
      kpis: [
        { label: "Buyer net worth", value: money(last.buyer), hint: "Home value minus selling costs and loan" },
        { label: "Renter net worth", value: money(last.renter), hint: "Invested down payment and savings" },
        { label: "Monthly cost to own (yr 1)", value: money(firstYearOwn), hint: "Mortgage, tax, insurance, upkeep" },
        { label: "Break-even year", value: be ? `Year ${be}` : "Not reached", tone: be ? "good" : "neutral" },
      ],
      series: {
        title: "Net worth over time",
        xPrefix: "Y",
        format: "currency",
        lines: [
          { name: "Buying", color: BRAND, points: rows.map((x) => ({ x: x.year, y: x.buyer })) },
          { name: "Renting and investing", color: AMBER, points: rows.map((x) => ({ x: x.year, y: x.renter })) },
        ],
      },
      table: {
        title: "Year-by-year comparison",
        columns: ["Year", "Buyer", "Renter", "Difference"],
        rows: rows
          .filter((_, i) => (i + 1) % step === 0 || i === rows.length - 1)
          .map((x) => [String(x.year), money(x.buyer), money(x.renter), moneySigned(x.buyer - x.renter)]),
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Rental property ROI                                                 */
/* ------------------------------------------------------------------ */
interface RentalCore {
  gross: number;
  vacancyLoss: number;
  egi: number;
  tax: number;
  ins: number;
  maint: number;
  mgmt: number;
  opex: number;
  noi: number;
  annualDebt: number;
  cashFlow: number;
  cashInvested: number;
  down: number;
  loan: number;
}

function rentalCore(v: Values): RentalCore {
  const down = v.price * (v.down / 100);
  const closing = v.price * (v.closing / 100);
  const loan = v.price - down;
  const annualDebt = monthlyPayment(loan, v.rate, v.term) * 12;
  const gross = v.rent * 12;
  const vacancyLoss = gross * (v.vacancy / 100);
  const egi = gross - vacancyLoss;
  const maint = gross * (v.maint / 100);
  const mgmt = egi * (v.mgmt / 100);
  const opex = v.tax + v.ins + maint + mgmt;
  const noi = egi - opex;
  return { gross, vacancyLoss, egi, tax: v.tax, ins: v.ins, maint, mgmt, opex, noi, annualDebt, cashFlow: noi - annualDebt, cashInvested: down + closing + (v.rehab ?? 0), down, loan };
}

const rentalROI: CalcDef = {
  inputs: [
    { key: "price", label: "Purchase price", group: "Purchase", default: 300000, min: 20000, max: 5000000, step: 5000, prefix: "$" },
    { key: "down", label: "Down payment", group: "Purchase", default: 25, min: 0, max: 100, step: 1, suffix: "%" },
    { key: "closing", label: "Closing costs", group: "Purchase", default: 3, min: 0, max: 8, step: 0.5, suffix: "%" },
    { key: "rate", label: "Interest rate", group: "Purchase", default: 6.75, min: 1, max: 14, step: 0.05, suffix: "%" },
    { key: "term", label: "Loan term", group: "Purchase", default: 30, min: 5, max: 40, step: 5, suffix: "yrs" },
    { key: "rent", label: "Monthly rent", group: "Income and expenses", default: 2500, min: 100, max: 40000, step: 50, prefix: "$" },
    { key: "vacancy", label: "Vacancy", group: "Income and expenses", default: 5, min: 0, max: 30, step: 1, suffix: "%", help: "Share of the year the unit sits empty." },
    { key: "tax", label: "Property tax", group: "Income and expenses", default: 3600, min: 0, max: 60000, step: 100, prefix: "$", suffix: "/yr" },
    { key: "ins", label: "Insurance", group: "Income and expenses", default: 1500, min: 0, max: 30000, step: 100, prefix: "$", suffix: "/yr" },
    { key: "maint", label: "Repairs and maintenance", group: "Income and expenses", default: 5, min: 0, max: 25, step: 0.5, suffix: "% of rent" },
    { key: "mgmt", label: "Property management", group: "Income and expenses", default: 8, min: 0, max: 15, step: 0.5, suffix: "% of rent" },
  ],
  compute(v) {
    const c = rentalCore(v);
    const capRate = (c.noi / v.price) * 100;
    const coc = c.cashInvested > 0 ? (c.cashFlow / c.cashInvested) * 100 : 0;
    const dscr = c.annualDebt > 0 ? c.noi / c.annualDebt : Infinity;
    const grm = c.gross > 0 ? v.price / c.gross : 0;
    const onePct = (v.rent / v.price) * 100;
    const monthly = c.cashFlow / 12;
    // Occupancy at which collected rent (less management) covers fixed costs and the loan.
    const breakEvenOcc = c.gross > 0 ? ((c.tax + c.ins + c.maint + c.annualDebt) / (c.gross * (1 - v.mgmt / 100))) * 100 : 0;

    return {
      verdict: {
        tone: c.cashFlow >= 0 ? "good" : "bad",
        text:
          c.cashFlow >= 0
            ? `Positive cash flow of ${money(monthly)} per month. ${coc >= 8 ? "The cash-on-cash return clears the common 8% target." : "Cash-on-cash is below the common 8% target, so check whether price or rent can improve."}`
            : `Negative cash flow of ${money(monthly)} per month. You would cover the gap from savings. Higher rent, lower costs or a lower price would help.`,
      },
      kpis: [
        { label: "Cap rate", value: percent(capRate), tone: tone(capRate >= 5) },
        { label: "Cash-on-cash return", value: percent(coc), tone: tone(coc >= 8) },
        { label: "Monthly cash flow", value: moneySigned(monthly), tone: tone(monthly >= 0) },
        { label: "Debt service coverage", value: Number.isFinite(dscr) ? `${dscr.toFixed(2)}×` : "No loan", tone: tone(dscr >= 1.25) },
      ],
      breakdown: {
        title: "Where the rent goes (per year)",
        total: Math.max(c.gross, 1),
        items: [
          { label: "Loan payments", value: c.annualDebt, color: AMBER },
          { label: "Property tax", value: c.tax, color: SLATE },
          { label: "Insurance", value: c.ins, color: "#94a3b8" },
          { label: "Repairs", value: c.maint, color: VIOLET },
          { label: "Management", value: c.mgmt, color: BLUE },
          { label: "Vacancy", value: c.vacancyLoss, color: RED },
          { label: "Cash flow", value: Math.max(c.cashFlow, 0), color: BRAND },
        ],
      },
      table: {
        title: "How your numbers compare",
        columns: ["Metric", "Your value", "Rule of thumb"],
        rows: [
          ["Net operating income", money(c.noi), "Rent minus operating costs, before the loan"],
          ["Cash invested", money(c.cashInvested), "Down payment plus closing costs"],
          ["Gross rent multiplier", grm ? grm.toFixed(1) : "—", "Lower is better; 8 to 12 is common"],
          ["1% rule", percent(onePct, 2), "Monthly rent at least 1% of price"],
          ["Break-even occupancy", percent(Math.min(breakEvenOcc, 999), 0), "Occupancy needed to cover costs and loan"],
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Real estate ROI (appreciation included)                             */
/* ------------------------------------------------------------------ */
const realEstateROI: CalcDef = {
  inputs: [
    { key: "price", label: "Purchase price", group: "Purchase", default: 350000, min: 20000, max: 5000000, step: 5000, prefix: "$" },
    { key: "down", label: "Down payment", group: "Purchase", default: 20, min: 0, max: 100, step: 1, suffix: "%" },
    { key: "closing", label: "Closing costs", group: "Purchase", default: 3, min: 0, max: 8, step: 0.5, suffix: "%" },
    { key: "rate", label: "Interest rate", group: "Purchase", default: 6.75, min: 1, max: 14, step: 0.05, suffix: "%" },
    { key: "term", label: "Loan term", group: "Purchase", default: 30, min: 5, max: 40, step: 5, suffix: "yrs" },
    { key: "rent", label: "Monthly rent", group: "Income", default: 2600, min: 0, max: 40000, step: 50, prefix: "$" },
    { key: "rentGrowth", label: "Rent growth", group: "Income", default: 3, min: 0, max: 10, step: 0.1, suffix: "%/yr" },
    { key: "opex", label: "Operating expenses", group: "Income", default: 40, min: 0, max: 80, step: 1, suffix: "% of rent", help: "Taxes, insurance, repairs, vacancy and management together. 35 to 50% is typical." },
    { key: "appr", label: "Appreciation", group: "Exit", default: 3, min: -3, max: 10, step: 0.1, suffix: "%/yr" },
    { key: "hold", label: "Years you hold it", group: "Exit", default: 10, min: 1, max: 30, step: 1, suffix: "yrs" },
    { key: "selling", label: "Selling costs", group: "Exit", default: 6, min: 0, max: 10, step: 0.5, suffix: "%" },
  ],
  compute(v) {
    const down = v.price * (v.down / 100);
    const cashIn = down + v.price * (v.closing / 100);
    const loan = v.price - down;
    const debt = monthlyPayment(loan, v.rate, v.term) * 12;
    const years = Math.round(v.hold);

    let cumCF = 0;
    const rows: { year: number; value: number; cf: number; equity: number }[] = [];
    for (let y = 1; y <= years; y++) {
      const rentY = v.rent * 12 * Math.pow(1 + v.rentGrowth / 100, y - 1);
      const noi = rentY * (1 - v.opex / 100);
      const cf = noi - debt;
      cumCF += cf;
      const homeValue = v.price * Math.pow(1 + v.appr / 100, y);
      const equityNet = homeValue * (1 - v.selling / 100) - loanBalance(loan, v.rate, v.term, y * 12);
      rows.push({ year: y, value: equityNet + cumCF, cf, equity: equityNet });
    }
    const last = rows[rows.length - 1] ?? { year: 0, value: 0, cf: 0, equity: 0 };
    const profit = last.value - cashIn;
    const roi = cashIn > 0 ? (profit / cashIn) * 100 : 0;
    const annualized = cashIn > 0 && last.value > 0 && years > 0 ? (Math.pow(last.value / cashIn, 1 / years) - 1) * 100 : 0;
    const step = Math.max(1, Math.round(rows.length / 10));

    return {
      verdict: {
        tone: profit >= 0 ? "good" : "bad",
        text:
          profit >= 0
            ? `Over ${years} years you turn ${money(cashIn)} into ${money(last.value)}: a ${money(profit)} profit, or about ${percent(annualized)} per year.`
            : `After ${years} years you would be ${money(-profit)} behind your ${money(cashIn)} cash investment.`,
      },
      kpis: [
        { label: "Total ROI", value: percent(roi, 0), tone: tone(roi >= 0) },
        { label: "Annualized return", value: percent(annualized), tone: tone(annualized >= 7), hint: "Compare with about 7% long-run stock returns" },
        { label: "Total profit", value: moneySigned(profit), tone: tone(profit >= 0) },
        { label: "Equity at sale", value: money(last.equity), hint: "After selling costs and loan payoff" },
      ],
      series: {
        title: "Your total position vs cash invested",
        xPrefix: "Y",
        format: "currency",
        lines: [
          { name: "Equity plus cash flow", color: BRAND, points: rows.map((r) => ({ x: r.year, y: r.value })) },
          { name: "Cash invested", color: AMBER, points: rows.map((r) => ({ x: r.year, y: cashIn })) },
        ],
      },
      table: {
        title: "Projection by year",
        columns: ["Year", "Cash flow", "Equity", "Total position"],
        rows: rows
          .filter((_, i) => (i + 1) % step === 0 || i === rows.length - 1)
          .map((r) => [String(r.year), moneySigned(r.cf), money(r.equity), money(r.value)]),
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Cap rate                                                            */
/* ------------------------------------------------------------------ */
const capRate: CalcDef = {
  inputs: [
    { key: "price", label: "Purchase price", group: "Property", default: 800000, min: 20000, max: 50000000, step: 10000, prefix: "$" },
    { key: "rent", label: "Gross rent (monthly)", group: "Income", default: 7500, min: 100, max: 500000, step: 100, prefix: "$" },
    { key: "vacancy", label: "Vacancy", group: "Income", default: 5, min: 0, max: 40, step: 1, suffix: "%" },
    { key: "opex", label: "Operating expenses", group: "Expenses", default: 30000, min: 0, max: 2000000, step: 500, prefix: "$", suffix: "/yr", help: "Taxes, insurance, repairs, management, utilities. Do not include loan payments." },
    { key: "market", label: "Market cap rate", group: "Valuation", default: 6, min: 2, max: 15, step: 0.1, suffix: "%", help: "Typical cap rate for similar properties in the area." },
  ],
  compute(v) {
    const gross = v.rent * 12;
    const egi = gross * (1 - v.vacancy / 100);
    const noi = egi - v.opex;
    const cap = (noi / v.price) * 100;
    const implied = v.market > 0 ? noi / (v.market / 100) : 0;
    const diff = implied - v.price;
    const grm = gross > 0 ? v.price / gross : 0;
    return {
      verdict: {
        tone: cap >= v.market ? "good" : "neutral",
        text:
          cap >= v.market
            ? `The cap rate is ${percent(cap, 2)}, above the ${percent(v.market)} market rate. At market pricing this property would be worth about ${money(implied)}.`
            : `The cap rate is ${percent(cap, 2)}, below the ${percent(v.market)} market rate. At market pricing this property would be worth about ${money(implied)}, which is ${money(-diff)} less than the asking price.`,
      },
      kpis: [
        { label: "Cap rate", value: percent(cap, 2), tone: tone(cap >= v.market) },
        { label: "Net operating income", value: money(noi), tone: tone(noi > 0) },
        { label: "Value at market cap rate", value: money(implied) },
        { label: "Gross rent multiplier", value: grm ? grm.toFixed(1) : "—" },
      ],
      breakdown: {
        title: "Income and expenses (per year)",
        total: Math.max(gross, 1),
        items: [
          { label: "Vacancy", value: gross - egi, color: RED },
          { label: "Operating costs", value: v.opex, color: SLATE },
          { label: "Net operating income", value: Math.max(noi, 0), color: BRAND },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Cash on cash return                                                 */
/* ------------------------------------------------------------------ */
const cashOnCash: CalcDef = {
  inputs: [
    { key: "price", label: "Purchase price", group: "Cash invested", default: 275000, min: 20000, max: 5000000, step: 5000, prefix: "$" },
    { key: "down", label: "Down payment", group: "Cash invested", default: 25, min: 0, max: 100, step: 1, suffix: "%" },
    { key: "closing", label: "Closing costs", group: "Cash invested", default: 3, min: 0, max: 8, step: 0.5, suffix: "%" },
    { key: "rehab", label: "Repairs or rehab upfront", group: "Cash invested", default: 5000, min: 0, max: 500000, step: 500, prefix: "$" },
    { key: "rate", label: "Interest rate", group: "Loan", default: 7, min: 1, max: 14, step: 0.05, suffix: "%" },
    { key: "term", label: "Loan term", group: "Loan", default: 30, min: 5, max: 40, step: 5, suffix: "yrs" },
    { key: "rent", label: "Monthly rent", group: "Income", default: 2400, min: 100, max: 40000, step: 50, prefix: "$" },
    { key: "opex", label: "All operating expenses", group: "Income", default: 40, min: 0, max: 80, step: 1, suffix: "% of rent", help: "Taxes, insurance, vacancy, repairs and management combined." },
  ],
  compute(v) {
    const down = v.price * (v.down / 100);
    const cash = down + v.price * (v.closing / 100) + v.rehab;
    const loan = v.price - down;
    const debt = monthlyPayment(loan, v.rate, v.term) * 12;
    const calc = (rent: number) => rent * 12 * (1 - v.opex / 100) - debt;
    const cf = calc(v.rent);
    const coc = cash > 0 ? (cf / cash) * 100 : 0;
    const noi = v.rent * 12 * (1 - v.opex / 100);
    const dscr = debt > 0 ? noi / debt : Infinity;
    const sens = [-10, -5, 0, 5, 10].map((p) => {
      const c = calc(v.rent * (1 + p / 100));
      const cc = cash > 0 ? (c / cash) * 100 : 0;
      return [p === 0 ? "Current rent" : `${p > 0 ? "+" : "−"}${Math.abs(p)}% rent`, money(v.rent * (1 + p / 100)), moneySigned(c / 12), percent(cc)];
    });
    return {
      verdict: {
        tone: coc >= 8 ? "good" : coc >= 0 ? "neutral" : "bad",
        text:
          coc >= 8
            ? `A ${percent(coc)} cash-on-cash return is above the common 8% investor target. You invest ${money(cash)} and collect ${money(cf)} a year.`
            : coc >= 0
              ? `A ${percent(coc)} cash-on-cash return is positive but under the common 8% target. You invest ${money(cash)} and collect ${money(cf)} a year.`
              : `Cash flow is negative at ${money(cf)} a year, so the cash-on-cash return is ${percent(coc)}.`,
      },
      kpis: [
        { label: "Cash-on-cash return", value: percent(coc, 2), tone: tone(coc >= 8) },
        { label: "Annual cash flow", value: moneySigned(cf), tone: tone(cf >= 0) },
        { label: "Total cash invested", value: money(cash) },
        { label: "Debt service coverage", value: Number.isFinite(dscr) ? `${dscr.toFixed(2)}×` : "No loan", tone: tone(dscr >= 1.25) },
      ],
      table: {
        title: "What if rent changes?",
        columns: ["Scenario", "Monthly rent", "Monthly cash flow", "Cash-on-cash"],
        rows: sens,
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Fix and flip                                                        */
/* ------------------------------------------------------------------ */
const fixAndFlip: CalcDef = {
  inputs: [
    { key: "price", label: "Purchase price", group: "Deal", default: 200000, min: 20000, max: 3000000, step: 5000, prefix: "$" },
    { key: "rehab", label: "Rehab budget", group: "Deal", default: 45000, min: 0, max: 1000000, step: 1000, prefix: "$" },
    { key: "arv", label: "After-repair value (ARV)", group: "Deal", default: 330000, min: 30000, max: 5000000, step: 5000, prefix: "$", help: "What the finished home should sell for, based on recent comparable sales." },
    { key: "months", label: "Months to finish and sell", group: "Deal", default: 6, min: 1, max: 24, step: 1, suffix: "mo" },
    { key: "ltv", label: "Loan on purchase price", group: "Financing", default: 80, min: 0, max: 100, step: 5, suffix: "%", help: "Set to 0 for an all-cash deal." },
    { key: "rate", label: "Loan interest rate", group: "Financing", default: 11, min: 0, max: 20, step: 0.25, suffix: "%" },
    { key: "points", label: "Loan points", group: "Financing", default: 2, min: 0, max: 5, step: 0.25, suffix: "%" },
    { key: "buyClose", label: "Buying closing costs", group: "Costs", default: 2, min: 0, max: 6, step: 0.5, suffix: "%" },
    { key: "hold", label: "Holding costs", group: "Costs", default: 1200, min: 0, max: 10000, step: 50, prefix: "$", suffix: "/mo", help: "Property tax, insurance, utilities and lawn care while you own it." },
    { key: "sell", label: "Selling costs", group: "Costs", default: 7, min: 0, max: 10, step: 0.5, suffix: "%", help: "Agent commissions and seller closing costs." },
  ],
  compute(v) {
    const loan = v.price * (v.ltv / 100);
    const interest = loan * (v.rate / 100) * (v.months / 12);
    const points = loan * (v.points / 100);
    const buyClose = v.price * (v.buyClose / 100);
    const holding = v.hold * v.months;
    const sell = v.arv * (v.sell / 100);
    const totalCost = v.price + v.rehab + buyClose + interest + points + holding + sell;
    const profit = v.arv - totalCost;
    const cash = v.price - loan + v.rehab + buyClose + points + holding + interest; // interest paid monthly from cash
    const roi = cash > 0 ? (profit / cash) * 100 : 0;
    const annualized = cash > 0 && profit > -cash ? (Math.pow(1 + profit / cash, 12 / v.months) - 1) * 100 : -100;
    const maxOffer = v.arv * 0.7 - v.rehab;
    const margin = v.arv > 0 ? (profit / v.arv) * 100 : 0;
    return {
      verdict: {
        tone: profit >= 25000 ? "good" : profit >= 0 ? "neutral" : "bad",
        text:
          profit >= 0
            ? `Estimated profit of ${money(profit)} on ${money(cash)} of your own cash, a ${percent(roi, 0)} return in ${v.months} months. ${v.price <= maxOffer ? "The price is at or below the 70% rule maximum." : `The 70% rule suggests offering no more than ${money(maxOffer)}.`}`
            : `This deal loses an estimated ${money(-profit)}. The 70% rule suggests offering no more than ${money(maxOffer)}.`,
      },
      kpis: [
        { label: "Net profit", value: moneySigned(profit), tone: tone(profit >= 0) },
        { label: "Return on cash invested", value: percent(roi, 0), tone: tone(roi >= 15), hint: `About ${percent(Math.max(annualized, -100), 0)} annualized` },
        { label: "Cash needed", value: money(cash) },
        { label: "70% rule max offer", value: money(maxOffer), tone: tone(v.price <= maxOffer) },
      ],
      breakdown: {
        title: "Where the sale price goes",
        total: Math.max(v.arv, 1),
        items: [
          { label: "Purchase", value: v.price, color: SLATE },
          { label: "Rehab", value: v.rehab, color: VIOLET },
          { label: "Financing", value: interest + points, color: AMBER },
          { label: "Holding and closing", value: holding + buyClose, color: BLUE },
          { label: "Selling costs", value: sell, color: RED },
          { label: "Profit", value: Math.max(profit, 0), color: BRAND },
        ],
      },
      table: {
        title: "Deal summary",
        columns: ["Item", "Amount"],
        rows: [
          ["After-repair value", money(v.arv)],
          ["Total costs", money(totalCost)],
          ["Net profit", moneySigned(profit)],
          ["Profit margin on sale price", percent(margin, 1)],
          ["Loan amount", money(loan)],
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Closing costs                                                       */
/* ------------------------------------------------------------------ */
const closingCosts: CalcDef = {
  inputs: [
    { key: "price", label: "Home price", group: "Loan", default: 400000, min: 50000, max: 3000000, step: 5000, prefix: "$" },
    { key: "down", label: "Down payment", group: "Loan", default: 10, min: 0, max: 100, step: 1, suffix: "%" },
    { key: "orig", label: "Lender fees", group: "Fees", default: 1, min: 0, max: 4, step: 0.1, suffix: "% of loan", help: "Origination, underwriting and processing fees." },
    { key: "title", label: "Title and escrow", group: "Fees", default: 0.8, min: 0, max: 3, step: 0.1, suffix: "% of price", help: "Title search, title insurance, escrow and settlement fees." },
    { key: "inspect", label: "Appraisal and inspection", group: "Fees", default: 1000, min: 0, max: 5000, step: 50, prefix: "$" },
    { key: "recording", label: "Recording and transfer taxes", group: "Fees", default: 0.4, min: 0, max: 3, step: 0.1, suffix: "% of price", help: "Varies widely by state and city." },
    { key: "tax", label: "Property tax", group: "Prepaids", default: 4400, min: 0, max: 50000, step: 100, prefix: "$", suffix: "/yr" },
    { key: "ins", label: "Home insurance", group: "Prepaids", default: 1800, min: 0, max: 15000, step: 100, prefix: "$", suffix: "/yr" },
    { key: "months", label: "Months of tax and insurance prepaid", group: "Prepaids", default: 6, min: 0, max: 14, step: 1, suffix: "mo", help: "Lenders usually collect several months into escrow." },
  ],
  compute(v) {
    const down = v.price * (v.down / 100);
    const loan = v.price - down;
    const lender = loan * (v.orig / 100);
    const title = v.price * (v.title / 100);
    const recording = v.price * (v.recording / 100);
    const prepaid = ((v.tax + v.ins) / 12) * v.months;
    const total = lender + title + v.inspect + recording + prepaid;
    const pct = v.price > 0 ? (total / v.price) * 100 : 0;
    return {
      verdict: {
        tone: "neutral",
        text: `Expect about ${money(total)} in closing costs (${percent(pct, 1)} of the price). With your ${money(down)} down payment, plan to bring around ${money(down + total)} to closing.`,
      },
      kpis: [
        { label: "Total closing costs", value: money(total) },
        { label: "Share of home price", value: percent(pct, 1), hint: "Typical range is 2% to 5%" },
        { label: "Down payment", value: money(down) },
        { label: "Cash to close", value: money(down + total), tone: "neutral" },
      ],
      breakdown: {
        title: "Closing cost breakdown",
        total: Math.max(total, 1),
        items: [
          { label: "Lender fees", value: lender, color: AMBER },
          { label: "Title and escrow", value: title, color: BLUE },
          { label: "Appraisal, inspection", value: v.inspect, color: VIOLET },
          { label: "Recording, transfer", value: recording, color: SLATE },
          { label: "Prepaid tax, insurance", value: prepaid, color: BRAND },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Commercial NOI                                                      */
/* ------------------------------------------------------------------ */
const commercialNOI: CalcDef = {
  inputs: [
    { key: "rent", label: "Scheduled rent (monthly)", group: "Income", default: 24000, min: 0, max: 2000000, step: 500, prefix: "$" },
    { key: "other", label: "Other income (monthly)", group: "Income", default: 1200, min: 0, max: 200000, step: 100, prefix: "$", help: "Parking, laundry, storage, fees and reimbursements." },
    { key: "vacancy", label: "Vacancy and credit loss", group: "Income", default: 7, min: 0, max: 40, step: 1, suffix: "%" },
    { key: "tax", label: "Property tax", group: "Expenses", default: 28000, min: 0, max: 1000000, step: 500, prefix: "$", suffix: "/yr" },
    { key: "ins", label: "Insurance", group: "Expenses", default: 9000, min: 0, max: 300000, step: 500, prefix: "$", suffix: "/yr" },
    { key: "util", label: "Utilities", group: "Expenses", default: 12000, min: 0, max: 500000, step: 500, prefix: "$", suffix: "/yr" },
    { key: "maint", label: "Repairs and maintenance", group: "Expenses", default: 18000, min: 0, max: 500000, step: 500, prefix: "$", suffix: "/yr" },
    { key: "mgmt", label: "Management", group: "Expenses", default: 5, min: 0, max: 12, step: 0.5, suffix: "% of income" },
    { key: "price", label: "Purchase price", group: "Value and loan", default: 2800000, min: 100000, max: 100000000, step: 50000, prefix: "$" },
    { key: "ltv", label: "Loan to value", group: "Value and loan", default: 70, min: 0, max: 90, step: 5, suffix: "%" },
    { key: "rate", label: "Loan rate", group: "Value and loan", default: 6.75, min: 1, max: 14, step: 0.05, suffix: "%" },
    { key: "term", label: "Amortization", group: "Value and loan", default: 25, min: 10, max: 30, step: 5, suffix: "yrs" },
  ],
  compute(v) {
    const gpi = (v.rent + v.other) * 12;
    const egi = gpi * (1 - v.vacancy / 100);
    const mgmt = egi * (v.mgmt / 100);
    const opex = v.tax + v.ins + v.util + v.maint + mgmt;
    const noi = egi - opex;
    const cap = (noi / v.price) * 100;
    const loan = v.price * (v.ltv / 100);
    const debt = monthlyPayment(loan, v.rate, v.term) * 12;
    const dscr = debt > 0 ? noi / debt : Infinity;
    const cf = noi - debt;
    const expRatio = egi > 0 ? (opex / egi) * 100 : 0;
    return {
      verdict: {
        tone: noi > 0 ? "good" : "bad",
        text: `Net operating income is ${money(noi)} a year, a ${percent(cap, 2)} cap rate on the purchase price. ${Number.isFinite(dscr) ? `Debt service coverage is ${dscr.toFixed(2)}×${dscr >= 1.25 ? ", above the 1.25 many lenders require." : ", below the 1.25 many lenders require."}` : ""}`,
      },
      kpis: [
        { label: "Net operating income", value: money(noi), tone: tone(noi > 0) },
        { label: "Cap rate", value: percent(cap, 2) },
        { label: "Expense ratio", value: percent(expRatio, 0), hint: "Operating costs as share of income" },
        { label: "Debt service coverage", value: Number.isFinite(dscr) ? `${dscr.toFixed(2)}×` : "No loan", tone: tone(dscr >= 1.25) },
      ],
      breakdown: {
        title: "Annual income and expenses",
        total: Math.max(gpi, 1),
        items: [
          { label: "Vacancy loss", value: gpi - egi, color: RED },
          { label: "Property tax", value: v.tax, color: SLATE },
          { label: "Insurance", value: v.ins, color: "#94a3b8" },
          { label: "Utilities", value: v.util, color: BLUE },
          { label: "Repairs", value: v.maint, color: VIOLET },
          { label: "Management", value: mgmt, color: AMBER },
          { label: "NOI", value: Math.max(noi, 0), color: BRAND },
        ],
      },
      table: {
        title: "Income statement",
        columns: ["Line", "Per year"],
        rows: [
          ["Gross potential income", money(gpi)],
          ["Effective gross income", money(egi)],
          ["Operating expenses", money(opex)],
          ["Net operating income", money(noi)],
          ["Annual loan payments", money(debt)],
          ["Cash flow after debt", moneySigned(cf)],
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Property tax                                                        */
/* ------------------------------------------------------------------ */
const propertyTax: CalcDef = {
  inputs: [
    { key: "value", label: "Assessed or market value", group: "Property", default: 400000, min: 30000, max: 5000000, step: 5000, prefix: "$" },
    { key: "rate", label: "Effective tax rate", group: "Property", default: 1.1, min: 0.1, max: 3.5, step: 0.05, suffix: "%/yr", help: "Annual tax as a share of value. Find it on your county tax bill or assessor site." },
    { key: "exempt", label: "Exemptions", group: "Property", default: 0, min: 0, max: 500000, step: 1000, prefix: "$", help: "Homestead, senior or veteran exemption that reduces taxable value." },
    { key: "growth", label: "Yearly increase in assessed value", group: "Forecast", default: 3, min: 0, max: 10, step: 0.5, suffix: "%", help: "Some states cap this, for example at 2% to 5% a year." },
    { key: "years", label: "Years to project", group: "Forecast", default: 10, min: 1, max: 30, step: 1, suffix: "yrs" },
  ],
  compute(v) {
    const taxable0 = Math.max(v.value - v.exempt, 0);
    const annual = taxable0 * (v.rate / 100);
    const years = Math.round(v.years);
    const pts: { x: number; y: number }[] = [];
    let total = 0;
    for (let y = 1; y <= years; y++) {
      const t = Math.max(v.value * Math.pow(1 + v.growth / 100, y - 1) - v.exempt, 0) * (v.rate / 100);
      total += t;
      pts.push({ x: y, y: t });
    }
    const last = pts[pts.length - 1]?.y ?? 0;
    const step = Math.max(1, Math.round(pts.length / 10));
    return {
      verdict: {
        tone: "neutral",
        text: `Estimated property tax is ${money(annual)} a year (${money(annual / 12)} a month). If assessed value grows ${percent(v.growth)} a year, it reaches about ${money(last)} by year ${years}, and you pay ${money(total)} in total.`,
      },
      kpis: [
        { label: "Annual property tax", value: money(annual) },
        { label: "Monthly property tax", value: money(annual / 12) },
        { label: "Taxable value", value: money(taxable0) },
        { label: `Tax in year ${years}`, value: money(last) },
      ],
      series: {
        title: "Projected annual property tax",
        xPrefix: "Y",
        format: "currency",
        lines: [{ name: "Annual tax", color: BRAND, points: pts }],
      },
      table: {
        title: "Projection by year",
        columns: ["Year", "Annual tax", "Monthly"],
        rows: pts.filter((_, i) => (i + 1) % step === 0 || i === pts.length - 1).map((p) => [String(p.x), money(p.y), money(p.y / 12)]),
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Hard money loan                                                     */
/* ------------------------------------------------------------------ */
const hardMoney: CalcDef = {
  inputs: [
    { key: "loan", label: "Loan amount", group: "Loan", default: 250000, min: 10000, max: 5000000, step: 5000, prefix: "$" },
    { key: "rate", label: "Interest rate", group: "Loan", default: 11.5, min: 5, max: 20, step: 0.25, suffix: "%/yr" },
    { key: "points", label: "Origination points", group: "Loan", default: 2, min: 0, max: 6, step: 0.25, suffix: "%" },
    { key: "months", label: "Loan term", group: "Loan", default: 12, min: 1, max: 36, step: 1, suffix: "mo" },
    { key: "fees", label: "Other lender and closing fees", group: "Loan", default: 2500, min: 0, max: 50000, step: 100, prefix: "$", help: "Underwriting, document, appraisal and draw inspection fees." },
    { key: "value", label: "Expected value at payoff", group: "Deal", default: 400000, min: 20000, max: 6000000, step: 5000, prefix: "$", help: "Used to show the loan-to-value at exit." },
  ],
  compute(v) {
    const monthly = v.loan * (v.rate / 100 / 12);
    const interest = monthly * v.months;
    const points = v.loan * (v.points / 100);
    const total = interest + points + v.fees;
    const years = v.months / 12;
    const effective = years > 0 ? (total / v.loan / years) * 100 : 0;
    const ltv = v.value > 0 ? (v.loan / v.value) * 100 : 0;
    const rows = [3, 6, 9, 12, 18, 24].map((m) => {
      const t = monthly * m + points + v.fees;
      return [`${m} months`, money(t), percent((t / v.loan / (m / 12)) * 100, 1)];
    });
    return {
      verdict: {
        tone: "neutral",
        text: `Interest-only payments are ${money(monthly)} a month. Over ${v.months} months the loan costs ${money(total)} including points and fees, an effective annual cost of about ${percent(effective, 1)}. You repay ${money(v.loan)} as a balloon at the end.`,
      },
      kpis: [
        { label: "Monthly interest payment", value: money(monthly) },
        { label: "Total cost of loan", value: money(total), hint: "Interest, points and fees" },
        { label: "Effective annual cost", value: percent(effective, 1), tone: effective > 15 ? "bad" : "neutral" },
        { label: "Loan to value at payoff", value: percent(ltv, 0), tone: tone(ltv <= 75) },
      ],
      breakdown: {
        title: "What the loan costs",
        total: Math.max(total, 1),
        items: [
          { label: "Interest", value: interest, color: AMBER },
          { label: "Points", value: points, color: BLUE },
          { label: "Other fees", value: v.fees, color: SLATE },
        ],
      },
      table: { title: "Cost if you pay off early or late", columns: ["Term", "Total cost", "Effective annual cost"], rows },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Refinance                                                           */
/* ------------------------------------------------------------------ */
const refinance: CalcDef = {
  inputs: [
    { key: "balance", label: "Current loan balance", group: "Current loan", default: 320000, min: 10000, max: 3000000, step: 1000, prefix: "$" },
    { key: "curRate", label: "Current interest rate", group: "Current loan", default: 7.25, min: 1, max: 12, step: 0.05, suffix: "%" },
    { key: "remaining", label: "Years remaining", group: "Current loan", default: 27, min: 1, max: 40, step: 1, suffix: "yrs" },
    { key: "newRate", label: "New interest rate", group: "New loan", default: 6.25, min: 1, max: 12, step: 0.05, suffix: "%" },
    { key: "newTerm", label: "New loan term", group: "New loan", default: 30, min: 5, max: 40, step: 5, suffix: "yrs" },
    { key: "costs", label: "Refinance closing costs", group: "New loan", default: 6000, min: 0, max: 50000, step: 250, prefix: "$", help: "Typically 2% to 5% of the loan amount." },
    { key: "stay", label: "How long you will keep the loan", group: "Horizon", default: 7, min: 1, max: 30, step: 1, suffix: "yrs" },
  ],
  compute(v) {
    const payOld = monthlyPayment(v.balance, v.curRate, v.remaining);
    const payNew = monthlyPayment(v.balance, v.newRate, v.newTerm);
    const save = payOld - payNew;
    const be = save > 0 ? v.costs / save : Infinity;
    const stay = Math.round(v.stay);
    const pts: { x: number; y: number }[] = [{ x: 0, y: -v.costs }];
    for (let y = 1; y <= Math.max(stay, 1); y++) {
      const costOld = payOld * 12 * Math.min(y, v.remaining) + loanBalance(v.balance, v.curRate, v.remaining, y * 12);
      const costNew = v.costs + payNew * 12 * Math.min(y, v.newTerm) + loanBalance(v.balance, v.newRate, v.newTerm, y * 12);
      pts.push({ x: y, y: costOld - costNew });
    }
    const net = pts[pts.length - 1].y;
    const step = Math.max(1, Math.round(pts.length / 8));
    return {
      verdict: {
        tone: net >= 0 ? "good" : "bad",
        text:
          save <= 0
            ? `The new payment is ${money(-save)} higher per month. The refinance only makes sense if you need cash or a shorter or longer term for other reasons.`
            : net >= 0
              ? `Refinancing saves ${money(save)} a month and breaks even after ${Math.ceil(be)} months. Keeping the loan ${stay} years nets about ${money(net)} after costs.`
              : `Refinancing saves ${money(save)} a month but needs ${Math.ceil(be)} months to repay the costs, so you would lose about ${money(-net)} if you move after ${stay} years.`,
      },
      kpis: [
        { label: "Monthly savings", value: moneySigned(save), tone: tone(save > 0), hint: `${money(payOld)} → ${money(payNew)}` },
        { label: "Break-even point", value: Number.isFinite(be) ? `${Math.ceil(be)} months` : "Never", tone: tone(Number.isFinite(be) && be / 12 <= v.stay) },
        { label: `Net savings after ${stay} yrs`, value: moneySigned(net), tone: tone(net >= 0), hint: "Includes loan balance and closing costs" },
        { label: "Closing costs", value: money(v.costs) },
      ],
      series: {
        title: "Cumulative net savings from refinancing",
        xPrefix: "Y",
        format: "currency",
        lines: [{ name: "Net savings", color: BRAND, points: pts }],
      },
      table: {
        title: "Net savings by year",
        columns: ["Year", "Net savings"],
        rows: pts.filter((p, i) => p.x > 0 && ((i % step === 0) || i === pts.length - 1)).map((p) => [String(p.x), moneySigned(p.y)]),
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Home equity / HELOC                                                 */
/* ------------------------------------------------------------------ */
const homeEquity: CalcDef = {
  inputs: [
    { key: "value", label: "Current home value", group: "Home", default: 500000, min: 50000, max: 5000000, step: 5000, prefix: "$" },
    { key: "balance", label: "Mortgage balance", group: "Home", default: 290000, min: 0, max: 4000000, step: 1000, prefix: "$" },
    { key: "cltv", label: "Maximum combined loan-to-value", group: "Borrowing", default: 85, min: 50, max: 100, step: 1, suffix: "%", help: "Most lenders allow 80% to 90% of home value across all loans." },
    { key: "draw", label: "Amount you want to borrow", group: "Borrowing", default: 60000, min: 0, max: 1000000, step: 1000, prefix: "$" },
    { key: "rate", label: "HELOC or home equity rate", group: "Borrowing", default: 8.5, min: 1, max: 16, step: 0.05, suffix: "%" },
    { key: "term", label: "Repayment period", group: "Borrowing", default: 15, min: 5, max: 30, step: 5, suffix: "yrs" },
  ],
  compute(v) {
    const equity = v.value - v.balance;
    const ltv = v.value > 0 ? (v.balance / v.value) * 100 : 0;
    const maxLoan = v.value * (v.cltv / 100);
    const available = Math.max(maxLoan - v.balance, 0);
    const draw = Math.min(v.draw, available);
    const interestOnly = draw * (v.rate / 100 / 12);
    const full = monthlyPayment(draw, v.rate, v.term);
    const cltvAfter = v.value > 0 ? ((v.balance + draw) / v.value) * 100 : 0;
    return {
      verdict: {
        tone: v.draw <= available ? "good" : "bad",
        text:
          v.draw <= available
            ? `You have ${money(equity)} of equity and could borrow up to ${money(available)}. Borrowing ${money(draw)} costs ${money(interestOnly)} a month interest-only, or ${money(full)} a month over ${v.term} years.`
            : `You have ${money(equity)} of equity, but lenders would likely cap borrowing near ${money(available)}, less than the ${money(v.draw)} you asked for.`,
      },
      kpis: [
        { label: "Home equity", value: money(equity) },
        { label: "Current loan-to-value", value: percent(ltv, 1) },
        { label: "Available to borrow", value: money(available), tone: tone(available > 0) },
        { label: "Payment on amount borrowed", value: money(full), hint: `${money(interestOnly)} interest-only` },
      ],
      breakdown: {
        title: "Your home value",
        total: Math.max(v.value, 1),
        items: [
          { label: "Mortgage balance", value: v.balance, color: SLATE },
          { label: "Amount you borrow", value: draw, color: AMBER },
          { label: "Remaining equity", value: Math.max(v.value - v.balance - draw, 0), color: BRAND },
        ],
      },
      table: {
        title: "Lender limit check",
        columns: ["Measure", "Value"],
        rows: [
          ["Maximum total borrowing", money(maxLoan)],
          ["Combined loan-to-value after borrowing", percent(cltvAfter, 1)],
          ["Equity left in the home", money(Math.max(v.value - v.balance - draw, 0))],
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Mortgage comparison                                                 */
/* ------------------------------------------------------------------ */
const mortgageCompare: CalcDef = {
  inputs: [
    { key: "loan", label: "Loan amount", group: "Both loans", default: 360000, min: 20000, max: 3000000, step: 5000, prefix: "$" },
    { key: "years", label: "How long you will keep the loan", group: "Both loans", default: 8, min: 1, max: 30, step: 1, suffix: "yrs" },
    { key: "rateA", label: "Rate", group: "Loan A", default: 6.5, min: 1, max: 12, step: 0.05, suffix: "%" },
    { key: "termA", label: "Term", group: "Loan A", default: 30, min: 10, max: 40, step: 5, suffix: "yrs" },
    { key: "feesA", label: "Points and fees", group: "Loan A", default: 2000, min: 0, max: 50000, step: 250, prefix: "$" },
    { key: "rateB", label: "Rate", group: "Loan B", default: 6.0, min: 1, max: 12, step: 0.05, suffix: "%" },
    { key: "termB", label: "Term", group: "Loan B", default: 30, min: 10, max: 40, step: 5, suffix: "yrs" },
    { key: "feesB", label: "Points and fees", group: "Loan B", default: 7500, min: 0, max: 50000, step: 250, prefix: "$" },
  ],
  compute(v) {
    const pA = monthlyPayment(v.loan, v.rateA, v.termA);
    const pB = monthlyPayment(v.loan, v.rateB, v.termB);
    const horizon = Math.round(v.years);
    const costAt = (rate: number, term: number, fees: number, pay: number, y: number) =>
      pay * 12 * Math.min(y, term) - (v.loan - loanBalance(v.loan, rate, term, y * 12)) + fees;
    const ptsA: { x: number; y: number }[] = [];
    const ptsB: { x: number; y: number }[] = [];
    for (let y = 1; y <= horizon; y++) {
      ptsA.push({ x: y, y: costAt(v.rateA, v.termA, v.feesA, pA, y) });
      ptsB.push({ x: y, y: costAt(v.rateB, v.termB, v.feesB, pB, y) });
    }
    const a = ptsA[ptsA.length - 1]?.y ?? 0;
    const b = ptsB[ptsB.length - 1]?.y ?? 0;
    const crossing = ptsB.find((p, i) => p.y <= ptsA[i].y)?.x ?? null;
    const diff = a - b;
    const step = Math.max(1, Math.round(ptsA.length / 8));
    return {
      verdict: {
        tone: "neutral",
        text:
          diff === 0
            ? "Both loans cost the same over this period."
            : `Loan ${diff > 0 ? "B" : "A"} is cheaper by ${money(Math.abs(diff))} over ${horizon} years.${crossing && diff > 0 ? ` Loan B's higher upfront cost pays off in year ${crossing}.` : ""}`,
      },
      kpis: [
        { label: "Loan A payment", value: money(pA), hint: `${percent(v.rateA, 2)} · ${v.termA} yr` },
        { label: "Loan B payment", value: money(pB), hint: `${percent(v.rateB, 2)} · ${v.termB} yr` },
        { label: `Loan A cost, ${horizon} yrs`, value: money(a), tone: tone(a <= b), hint: "Interest plus fees" },
        { label: `Loan B cost, ${horizon} yrs`, value: money(b), tone: tone(b <= a), hint: "Interest plus fees" },
      ],
      series: {
        title: "Cumulative borrowing cost (interest plus fees)",
        xPrefix: "Y",
        format: "currency",
        lines: [
          { name: "Loan A", color: AMBER, points: ptsA },
          { name: "Loan B", color: BRAND, points: ptsB },
        ],
      },
      table: {
        title: "Cost by year",
        columns: ["Year", "Loan A", "Loan B", "B vs A"],
        rows: ptsA.filter((_, i) => (i + 1) % step === 0 || i === ptsA.length - 1).map((p) => {
          const q = ptsB[p.x - 1];
          return [String(p.x), money(p.y), money(q.y), moneySigned(q.y - p.y)];
        }),
      },
    };
  },
};

export const CALCS: Record<string, CalcDef> = {
  ...CONSTRUCTION_CALCS,
  ...PERSONAL_FINANCE_CALCS,
  ...AUTO_CALCS,
  ...BUSINESS_CALCS,
  "property-tax-calculator": propertyTax,
  "hard-money-loan-calculator": hardMoney,
  "refinance-calculator": refinance,
  "home-equity-calculator": homeEquity,
  "mortgage-comparison-calculator": mortgageCompare,
  "fix-and-flip-calculator": fixAndFlip,
  "closing-costs-calculator": closingCosts,
  "commercial-noi-calculator": commercialNOI,
  "buy-vs-rent-calculator": buyVsRent,
  "rental-property-roi-calculator": rentalROI,
  "real-estate-roi-calculator": realEstateROI,
  "cap-rate-calculator": capRate,
  "cash-on-cash-return-calculator": cashOnCash,
};

export function defaultsFor(slug: string): Values {
  const def = CALCS[slug];
  return Object.fromEntries(def.inputs.map((i) => [i.key, i.default]));
}
