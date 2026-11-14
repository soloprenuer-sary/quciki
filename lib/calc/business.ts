import { monthlyPayment } from "./finance";
import { money, moneySigned, num, percent } from "../format";
import type { CalcDef } from "./types";

const BRAND = "#0f766e";
const AMBER = "#f59e0b";
const SLATE = "#64748b";

/* ------------------------------------------------------------------ */
/* Markup and margin                                                   */
/* ------------------------------------------------------------------ */
const markupMargin: CalcDef = {
  inputs: [
    { key: "cost", label: "Cost per unit", group: "Pricing", default: 60, min: 0.01, max: 1000000, step: 1, prefix: "$" },
    { key: "price", label: "Selling price per unit", group: "Pricing", default: 100, min: 0.01, max: 1000000, step: 1, prefix: "$" },
    { key: "units", label: "Units sold", group: "Volume", default: 200, min: 1, max: 10000000, step: 10 },
  ],
  compute(v) {
    const profit = v.price - v.cost;
    const margin = (profit / v.price) * 100;
    const markup = (profit / v.cost) * 100;
    return {
      verdict: {
        tone: profit >= 0 ? "good" : "bad",
        text: `Selling at $${num(v.price, 2)} a unit with a cost of $${num(v.cost, 2)} gives a profit of $${num(profit, 2)} per unit: a ${percent(margin, 1)} margin and a ${percent(markup, 1)} markup. Over ${num(v.units, 0)} units that is ${money(profit * v.units)} of gross profit.`,
      },
      kpis: [
        { label: "Gross margin", value: percent(margin, 1), tone: profit >= 0 ? "good" : "bad", hint: "Profit as a share of price" },
        { label: "Markup", value: percent(markup, 1), hint: "Profit as a share of cost" },
        { label: "Profit per unit", value: moneySigned(profit) },
        { label: "Total gross profit", value: moneySigned(profit * v.units) },
      ],
      breakdown: {
        title: "Where the selling price goes",
        total: Math.max(v.price, 0.01),
        items: [
          { label: "Cost", value: v.cost, color: SLATE },
          { label: "Profit", value: Math.max(profit, 0), color: BRAND },
        ],
      },
      table: {
        title: "Price needed for a target margin",
        columns: ["Target margin", "Selling price", "Equivalent markup"],
        rows: [10, 20, 30, 40, 50, 60].map((m) => {
          const p = v.cost / (1 - m / 100);
          return [`${m}%`, `$${num(p, 2)}`, percent(((p - v.cost) / v.cost) * 100, 1)];
        }),
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Break-even                                                          */
/* ------------------------------------------------------------------ */
const breakEven: CalcDef = {
  inputs: [
    { key: "fixed", label: "Fixed costs per month", group: "Costs", default: 12000, min: 0, max: 10000000, step: 100, prefix: "$", help: "Rent, salaries, insurance, software and other costs that do not change with sales." },
    { key: "price", label: "Selling price per unit", group: "Per unit", default: 45, min: 0.01, max: 1000000, step: 1, prefix: "$" },
    { key: "variable", label: "Variable cost per unit", group: "Per unit", default: 18, min: 0, max: 1000000, step: 1, prefix: "$", help: "Materials, packaging, shipping and fees for each unit sold." },
    { key: "target", label: "Target monthly profit", group: "Goal", default: 3000, min: 0, max: 10000000, step: 100, prefix: "$" },
  ],
  compute(v) {
    const cm = v.price - v.variable;
    const be = cm > 0 ? v.fixed / cm : Infinity;
    const beRev = be * v.price;
    const targetUnits = cm > 0 ? (v.fixed + v.target) / cm : Infinity;
    const pts = [] as { x: number; y: number }[];
    const top = Number.isFinite(targetUnits) ? Math.ceil((targetUnits * 1.5) / 10) * 10 : 100;
    for (let i = 0; i <= 10; i++) {
      const u = Math.round((top * i) / 10);
      pts.push({ x: u, y: cm * u - v.fixed });
    }
    return {
      verdict: {
        tone: cm > 0 ? "good" : "bad",
        text:
          cm > 0
            ? `You break even at ${num(Math.ceil(be), 0)} units a month (${money(beRev)} of sales). To earn ${money(v.target)} a month you need to sell ${num(Math.ceil(targetUnits), 0)} units. Each unit contributes $${num(cm, 2)} after variable costs.`
            : "The selling price does not cover the variable cost, so you lose money on every unit and can never break even. Raise the price or cut the variable cost.",
      },
      kpis: [
        { label: "Break-even units", value: Number.isFinite(be) ? num(Math.ceil(be), 0) : "Never" },
        { label: "Break-even sales", value: Number.isFinite(be) ? money(beRev) : "—" },
        { label: "Contribution per unit", value: moneySigned(cm), hint: `${percent((cm / v.price) * 100, 0)} of price` },
        { label: "Units for target profit", value: Number.isFinite(targetUnits) ? num(Math.ceil(targetUnits), 0) : "—" },
      ],
      series: {
        title: "Monthly profit by units sold",
        xPrefix: "",
        format: "currency",
        lines: [{ name: "Profit or loss", color: BRAND, points: pts }],
      },
      table: {
        title: "Profit at different volumes",
        columns: ["Units sold", "Revenue", "Profit"],
        rows: pts.filter((p) => p.x > 0).map((p) => [num(p.x, 0), money(p.x * v.price), moneySigned(p.y)]),
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Sales tax                                                           */
/* ------------------------------------------------------------------ */
const salesTax: CalcDef = {
  inputs: [
    { key: "price", label: "Price before tax", group: "Purchase", default: 249.99, min: 0.01, max: 10000000, step: 1, prefix: "$" },
    { key: "qty", label: "Quantity", group: "Purchase", default: 1, min: 1, max: 100000, step: 1 },
    { key: "rate", label: "Sales tax rate", group: "Tax", default: 8.25, min: 0, max: 15, step: 0.05, suffix: "%", help: "State plus local rate. Check your local government's current rate." },
  ],
  compute(v) {
    const subtotal = v.price * v.qty;
    const tax = subtotal * (v.rate / 100);
    const total = subtotal + tax;
    const preTax = v.price / (1 + v.rate / 100);
    return {
      verdict: {
        tone: "neutral",
        text: `Sales tax at ${percent(v.rate, 2)} on $${num(subtotal, 2)} is $${num(tax, 2)}, so the total is $${num(total, 2)}. If $${num(v.price, 2)} already included tax, the price before tax would be $${num(preTax, 2)}.`,
      },
      kpis: [
        { label: "Sales tax", value: `$${num(tax, 2)}` },
        { label: "Total with tax", value: `$${num(total, 2)}` },
        { label: "Subtotal", value: `$${num(subtotal, 2)}` },
        { label: "Pre-tax price if tax is included", value: `$${num(preTax, 2)}`, hint: "Working backwards from the entered price" },
      ],
      table: {
        title: "Total at different tax rates",
        columns: ["Rate", "Tax", "Total"],
        rows: [0, 4, 5, 6, 7, 8, 9, 10].map((r) => [`${r}%`, `$${num(subtotal * (r / 100), 2)}`, `$${num(subtotal * (1 + r / 100), 2)}`]),
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Freelance hourly rate                                               */
/* ------------------------------------------------------------------ */
const freelanceRate: CalcDef = {
  inputs: [
    { key: "income", label: "Desired yearly take-home income", group: "Goals", default: 70000, min: 5000, max: 2000000, step: 1000, prefix: "$" },
    { key: "expenses", label: "Business expenses per year", group: "Costs", default: 8000, min: 0, max: 1000000, step: 500, prefix: "$", help: "Software, equipment, insurance, marketing, accounting, coworking." },
    { key: "tax", label: "Taxes and retirement set aside", group: "Costs", default: 25, min: 0, max: 50, step: 1, suffix: "% of profit", help: "A rough share of profit for income tax, self-employment tax and savings." },
    { key: "hours", label: "Billable hours per week", group: "Time", default: 25, min: 5, max: 60, step: 1, suffix: "hrs", help: "Time you can bill. Admin, sales and learning usually take the rest of the week." },
    { key: "off", label: "Weeks off per year", group: "Time", default: 6, min: 0, max: 20, step: 1, suffix: "wks", help: "Holidays, vacation and sick time." },
  ],
  compute(v) {
    const profitNeeded = v.income / (1 - v.tax / 100);
    const revenue = profitNeeded + v.expenses;
    const weeks = Math.max(52 - v.off, 1);
    const hours = v.hours * weeks;
    const rate = revenue / hours;
    return {
      verdict: {
        tone: "neutral",
        text: `To take home ${money(v.income)} after ${percent(v.tax, 0)} tax and ${money(v.expenses)} of expenses you need ${money(revenue)} of revenue. Billing ${num(v.hours, 0)} hours a week for ${num(weeks, 0)} weeks, that means charging about $${num(rate, 2)} an hour.`,
      },
      kpis: [
        { label: "Hourly rate needed", value: `$${num(rate, 2)}`, tone: "good" },
        { label: "Revenue needed per year", value: money(revenue) },
        { label: "Billable hours per year", value: num(hours, 0) },
        { label: "Weekly revenue target", value: money(revenue / weeks) },
      ],
      breakdown: {
        title: "Where your revenue goes",
        total: Math.max(revenue, 1),
        items: [
          { label: "Your take-home income", value: v.income, color: BRAND },
          { label: "Taxes and retirement", value: profitNeeded - v.income, color: AMBER },
          { label: "Business expenses", value: v.expenses, color: SLATE },
        ],
      },
      table: {
        title: "Rate needed at different billable hours",
        columns: ["Billable hours per week", "Hourly rate"],
        rows: [15, 20, 25, 30, 35].map((h) => [`${h} hours`, `$${num(revenue / (h * weeks), 2)}`]),
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Business loan                                                       */
/* ------------------------------------------------------------------ */
const businessLoan: CalcDef = {
  inputs: [
    { key: "amount", label: "Loan amount", group: "Loan", default: 50000, min: 1000, max: 10000000, step: 1000, prefix: "$" },
    { key: "rate", label: "Interest rate", group: "Loan", default: 9, min: 1, max: 40, step: 0.1, suffix: "%" },
    { key: "years", label: "Term", group: "Loan", default: 5, min: 1, max: 25, step: 1, suffix: "yrs" },
    { key: "fee", label: "Origination fee", group: "Loan", default: 2, min: 0, max: 10, step: 0.25, suffix: "%", help: "Deducted from the amount you receive." },
  ],
  compute(v) {
    const pmt = monthlyPayment(v.amount, v.rate, v.years);
    const months = v.years * 12;
    const interest = pmt * months - v.amount;
    const fee = v.amount * (v.fee / 100);
    const net = v.amount - fee;
    const cost = interest + fee;
    return {
      verdict: {
        tone: "neutral",
        text: `Borrowing ${money(v.amount)} at ${percent(v.rate, 2)} for ${v.years} years costs ${money(pmt)} a month. You pay ${money(interest)} in interest plus a ${money(fee)} fee, so you receive ${money(net)} and the loan costs ${money(cost)} in total.`,
      },
      kpis: [
        { label: "Monthly payment", value: money(pmt) },
        { label: "Total interest", value: money(interest) },
        { label: "Origination fee", value: money(fee) },
        { label: "Cash you receive", value: money(net) },
      ],
      breakdown: {
        title: "Total repaid",
        total: Math.max(pmt * months + fee, 1),
        items: [
          { label: "Principal", value: v.amount, color: BRAND },
          { label: "Interest", value: interest, color: AMBER },
          { label: "Origination fee", value: fee, color: SLATE },
        ],
      },
      table: {
        title: "Same loan over different terms",
        columns: ["Term", "Monthly payment", "Total interest"],
        rows: [1, 2, 3, 5, 7, 10].map((y) => {
          const p = monthlyPayment(v.amount, v.rate, y);
          return [`${y} year${y === 1 ? "" : "s"}`, money(p), money(p * y * 12 - v.amount)];
        }),
      },
    };
  },
};

export const BUSINESS_CALCS: Record<string, CalcDef> = {
  "markup-margin-calculator": markupMargin,
  "break-even-calculator": breakEven,
  "sales-tax-calculator": salesTax,
  "freelance-hourly-rate-calculator": freelanceRate,
  "business-loan-calculator": businessLoan,
};
