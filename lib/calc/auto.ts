import { monthlyPayment } from "./finance";
import { money, num, percent } from "../format";
import type { CalcDef } from "./types";

const BRAND = "#0f766e";
const AMBER = "#f59e0b";
const SLATE = "#64748b";

/* ------------------------------------------------------------------ */
/* Car loan                                                            */
/* ------------------------------------------------------------------ */
const carLoan: CalcDef = {
  inputs: [
    { key: "price", label: "Vehicle price", group: "Vehicle", default: 32000, min: 1000, max: 300000, step: 500, prefix: "$" },
    { key: "down", label: "Down payment", group: "Vehicle", default: 4000, min: 0, max: 300000, step: 250, prefix: "$" },
    { key: "trade", label: "Trade-in value", group: "Vehicle", default: 3000, min: 0, max: 200000, step: 250, prefix: "$" },
    { key: "rate", label: "Loan interest rate (APR)", group: "Loan", default: 7, min: 0, max: 25, step: 0.1, suffix: "%" },
    { key: "term", label: "Loan term", group: "Loan", default: 60, min: 12, max: 96, step: 12, suffix: "mo" },
    { key: "tax", label: "Sales tax", group: "Fees", default: 6.5, min: 0, max: 12, step: 0.1, suffix: "%", help: "Applied to the price minus trade-in. Rules differ by state, so adjust if yours taxes the full price." },
    { key: "fees", label: "Title, registration and dealer fees", group: "Fees", default: 600, min: 0, max: 10000, step: 50, prefix: "$" },
  ],
  compute(v) {
    const tax = Math.max(v.price - v.trade, 0) * (v.tax / 100);
    const loan = Math.max(v.price - v.trade + tax + v.fees - v.down, 0);
    const years = v.term / 12;
    const pmt = monthlyPayment(loan, v.rate, years);
    const paid = pmt * v.term;
    const interest = paid - loan;
    const total = paid + v.down + v.trade;
    return {
      verdict: {
        tone: "neutral",
        text: `You would borrow ${money(loan)} and pay ${money(pmt)} a month for ${v.term} months. Total interest is ${money(interest)}, so the vehicle costs about ${money(total)} including your down payment and trade-in.`,
      },
      kpis: [
        { label: "Monthly payment", value: money(pmt) },
        { label: "Amount financed", value: money(loan), hint: `Includes ${money(tax)} tax and ${money(v.fees)} fees` },
        { label: "Total interest", value: money(interest) },
        { label: "Total cost of vehicle", value: money(total) },
      ],
      breakdown: {
        title: "What you pay in total",
        total: Math.max(paid + v.down + v.trade, 1),
        items: [
          { label: "Down payment and trade-in", value: v.down + v.trade, color: SLATE },
          { label: "Loan principal", value: loan, color: BRAND },
          { label: "Interest", value: interest, color: AMBER },
        ],
      },
      table: {
        title: "Same loan over different terms",
        columns: ["Term", "Monthly payment", "Total interest"],
        rows: [36, 48, 60, 72, 84].map((m) => {
          const p = monthlyPayment(loan, v.rate, m / 12);
          return [`${m} months`, money(p), money(p * m - loan)];
        }),
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Lease                                                               */
/* ------------------------------------------------------------------ */
const autoLease: CalcDef = {
  inputs: [
    { key: "msrp", label: "MSRP", group: "Vehicle", default: 36000, min: 5000, max: 300000, step: 500, prefix: "$", help: "The manufacturer's suggested retail price. The residual value is based on it." },
    { key: "price", label: "Negotiated price (capitalized cost)", group: "Vehicle", default: 35000, min: 5000, max: 300000, step: 500, prefix: "$" },
    { key: "down", label: "Down payment", group: "Vehicle", default: 2000, min: 0, max: 100000, step: 250, prefix: "$" },
    { key: "fees", label: "Acquisition and other fees", group: "Vehicle", default: 695, min: 0, max: 5000, step: 25, prefix: "$" },
    { key: "residual", label: "Residual value", group: "Lease terms", default: 60, min: 30, max: 80, step: 1, suffix: "% of MSRP", help: "What the car is expected to be worth at the end of the lease." },
    { key: "mf", label: "Money factor", group: "Lease terms", default: 0.0025, min: 0, max: 0.01, step: 0.0001, help: "Multiply by 2,400 for an approximate APR. 0.0025 is about 6%." },
    { key: "term", label: "Lease term", group: "Lease terms", default: 36, min: 12, max: 60, step: 6, suffix: "mo" },
    { key: "tax", label: "Sales tax on payment", group: "Lease terms", default: 6.5, min: 0, max: 12, step: 0.1, suffix: "%" },
  ],
  compute(v) {
    const residual = v.msrp * (v.residual / 100);
    const cap = Math.max(v.price + v.fees - v.down, 0);
    const dep = (cap - residual) / v.term;
    const fin = (cap + residual) * v.mf;
    const base = Math.max(dep, 0) + fin;
    const tax = base * (v.tax / 100);
    const pmt = base + tax;
    const total = pmt * v.term + v.down;
    const apr = v.mf * 2400;
    return {
      verdict: {
        tone: "neutral",
        text: `Estimated lease payment is ${money(pmt)} a month for ${v.term} months, with ${money(v.down)} due at signing. The money factor is equivalent to about ${percent(apr, 1)} APR, and you would pay about ${money(total)} over the lease.`,
      },
      kpis: [
        { label: "Monthly payment", value: money(pmt) },
        { label: "Equivalent APR", value: percent(apr, 1) },
        { label: "Residual value", value: money(residual) },
        { label: "Total lease cost", value: money(total), hint: "Payments plus down payment" },
      ],
      breakdown: {
        title: "What your monthly payment covers",
        total: Math.max(pmt, 1),
        items: [
          { label: "Depreciation", value: Math.max(dep, 0), color: BRAND },
          { label: "Finance charge", value: fin, color: AMBER },
          { label: "Sales tax", value: tax, color: SLATE },
        ],
      },
      table: {
        title: "Lease calculation",
        columns: ["Item", "Amount"],
        rows: [
          ["Capitalized cost (after down payment and fees)", money(cap)],
          ["Residual value", money(residual)],
          ["Monthly depreciation", money(Math.max(dep, 0))],
          ["Monthly finance charge", money(fin)],
          ["Payment before tax", money(base)],
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Fuel cost                                                           */
/* ------------------------------------------------------------------ */
const fuelCost: CalcDef = {
  inputs: [
    { key: "miles", label: "Miles driven per month", group: "Driving", default: 1000, min: 10, max: 10000, step: 50, suffix: "mi" },
    { key: "mpg", label: "Fuel economy", group: "Driving", default: 28, min: 5, max: 100, step: 1, suffix: "mpg" },
    { key: "price", label: "Fuel price", group: "Fuel", default: 3.6, min: 1, max: 10, step: 0.05, prefix: "$", suffix: "/gal" },
    { key: "trip", label: "Trip distance", group: "Trip", default: 300, min: 1, max: 5000, step: 10, suffix: "mi", help: "A single journey, for example a road trip." },
  ],
  compute(v) {
    const perMile = v.price / v.mpg;
    const monthly = v.miles * perMile;
    const annual = monthly * 12;
    const trip = v.trip * perMile;
    return {
      verdict: {
        tone: "neutral",
        text: `At ${num(v.mpg, 0)} mpg and $${v.price.toFixed(2)} a gallon, fuel costs about $${num(perMile, 3)} per mile. Driving ${num(v.miles, 0)} miles a month costs ${money(monthly)} (${money(annual)} a year), and a ${num(v.trip, 0)}-mile trip costs about ${money(trip)}.`,
      },
      kpis: [
        { label: "Cost per mile", value: `$${num(perMile, 3)}` },
        { label: "Monthly fuel cost", value: money(monthly), hint: `${num(v.miles / v.mpg, 1)} gallons` },
        { label: "Annual fuel cost", value: money(annual) },
        { label: "Trip fuel cost", value: money(trip), hint: `${num(v.trip / v.mpg, 1)} gallons` },
      ],
      table: {
        title: "Monthly cost at different fuel prices",
        columns: ["Price per gallon", "Monthly cost", "Annual cost"],
        rows: [3, 3.5, 4, 4.5, 5].map((p) => [`$${num(p, 2)}`, money((v.miles / v.mpg) * p), money((v.miles / v.mpg) * p * 12)]),
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* EV charging vs gas                                                  */
/* ------------------------------------------------------------------ */
const evCharging: CalcDef = {
  inputs: [
    { key: "miles", label: "Miles driven per year", group: "Driving", default: 12000, min: 500, max: 100000, step: 500, suffix: "mi" },
    { key: "eff", label: "EV efficiency", group: "Electric vehicle", default: 3.5, min: 1.5, max: 6, step: 0.1, suffix: "mi/kWh", help: "Most EVs get roughly 3 to 4 miles per kWh. Check your car's rating." },
    { key: "loss", label: "Charging losses", group: "Electric vehicle", default: 10, min: 0, max: 25, step: 1, suffix: "%", help: "Energy lost as heat between the outlet and the battery." },
    { key: "home", label: "Share charged at home", group: "Electric vehicle", default: 80, min: 0, max: 100, step: 5, suffix: "%" },
    { key: "homeRate", label: "Home electricity price", group: "Electric vehicle", default: 0.17, min: 0.03, max: 0.6, step: 0.01, prefix: "$", suffix: "/kWh" },
    { key: "pubRate", label: "Public fast-charging price", group: "Electric vehicle", default: 0.45, min: 0.15, max: 1.2, step: 0.01, prefix: "$", suffix: "/kWh" },
    { key: "mpg", label: "Gas car fuel economy", group: "Gas car to compare", default: 30, min: 8, max: 80, step: 1, suffix: "mpg" },
    { key: "gas", label: "Gas price", group: "Gas car to compare", default: 3.6, min: 1, max: 10, step: 0.05, prefix: "$", suffix: "/gal" },
  ],
  compute(v) {
    const kwh = (v.miles / v.eff) * (1 + v.loss / 100);
    const homeKwh = kwh * (v.home / 100);
    const pubKwh = kwh - homeKwh;
    const homeCost = homeKwh * v.homeRate;
    const pubCost = pubKwh * v.pubRate;
    const ev = homeCost + pubCost;
    const gas = (v.miles / v.mpg) * v.gas;
    const save = gas - ev;
    return {
      verdict: {
        tone: save >= 0 ? "good" : "neutral",
        text:
          save >= 0
            ? `Charging costs about ${money(ev)} a year (${num(kwh, 0)} kWh) versus ${money(gas)} for the gas car, saving ${money(save)} a year in fuel.`
            : `Charging costs about ${money(ev)} a year versus ${money(gas)} for the gas car, so the EV costs ${money(-save)} more to fuel at these prices.`,
      },
      kpis: [
        { label: "EV charging cost per year", value: money(ev) },
        { label: "Gas car fuel per year", value: money(gas) },
        { label: save >= 0 ? "Yearly savings" : "Yearly extra cost", value: money(Math.abs(save)), tone: save >= 0 ? "good" : "bad" },
        { label: "EV cost per mile", value: `$${num(ev / v.miles, 3)}`, hint: `Gas: $${num(gas / v.miles, 3)}` },
      ],
      breakdown: {
        title: "EV charging cost per year",
        total: Math.max(ev, 1),
        items: [
          { label: "Home charging", value: homeCost, color: BRAND },
          { label: "Public fast charging", value: pubCost, color: AMBER },
        ],
      },
      table: {
        title: "Fuel cost comparison",
        columns: ["", "EV", "Gas car"],
        rows: [
          ["Energy used per year", `${num(kwh, 0)} kWh`, `${num(v.miles / v.mpg, 0)} gallons`],
          ["Cost per year", money(ev), money(gas)],
          ["Cost per month", money(ev / 12), money(gas / 12)],
          ["Cost per 100 miles", `$${num((ev / v.miles) * 100, 2)}`, `$${num((gas / v.miles) * 100, 2)}`],
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Depreciation                                                        */
/* ------------------------------------------------------------------ */
const depreciation: CalcDef = {
  inputs: [
    { key: "price", label: "Purchase price", group: "Vehicle", default: 35000, min: 1000, max: 300000, step: 500, prefix: "$" },
    { key: "first", label: "First-year depreciation", group: "Depreciation", default: 20, min: 0, max: 40, step: 1, suffix: "%", help: "New cars often lose around 15% to 25% in the first year." },
    { key: "later", label: "Depreciation after year one", group: "Depreciation", default: 12, min: 0, max: 30, step: 1, suffix: "%/yr", help: "Yearly loss of the remaining value after the first year." },
    { key: "years", label: "Years you will own it", group: "Depreciation", default: 5, min: 1, max: 15, step: 1, suffix: "yrs" },
  ],
  compute(v) {
    const years = Math.round(v.years);
    const pts = [{ x: 0, y: v.price }];
    let val = v.price;
    for (let y = 1; y <= years; y++) {
      val *= 1 - (y === 1 ? v.first : v.later) / 100;
      pts.push({ x: y, y: val });
    }
    const loss = v.price - val;
    return {
      verdict: {
        tone: "neutral",
        text: `A ${money(v.price)} vehicle would be worth about ${money(val)} after ${years} years. That is a loss of ${money(loss)} (${percent((loss / v.price) * 100, 0)}), or about ${money(loss / (years * 12))} a month.`,
      },
      kpis: [
        { label: `Value after ${years} years`, value: money(val) },
        { label: "Total depreciation", value: money(loss), tone: "bad" },
        { label: "Share of price lost", value: percent((loss / v.price) * 100, 0) },
        { label: "Average loss per month", value: money(loss / (years * 12)) },
      ],
      series: {
        title: "Estimated vehicle value",
        xPrefix: "Y",
        format: "currency",
        lines: [{ name: "Value", color: BRAND, points: pts }],
      },
      table: {
        title: "Year-by-year value",
        columns: ["Year", "Estimated value", "Total lost"],
        rows: pts.filter((p) => p.x > 0).map((p) => [String(p.x), money(p.y), money(v.price - p.y)]),
      },
    };
  },
};

export const AUTO_CALCS: Record<string, CalcDef> = {
  "car-loan-calculator": carLoan,
  "auto-lease-calculator": autoLease,
  "fuel-cost-calculator": fuelCost,
  "ev-charging-cost-calculator": evCharging,
  "car-depreciation-calculator": depreciation,
};

