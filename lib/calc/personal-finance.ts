import { money, moneySigned, percent, num } from "../format";
import type { CalcDef } from "./types";

const BRAND = "#0f766e";
const AMBER = "#f59e0b";
const SLATE = "#64748b";
const VIOLET = "#8b5cf6";
const BLUE = "#3b82f6";
const RED = "#ef4444";

/* ------------------------------------------------------------------ */
/* Compound interest                                                   */
/* ------------------------------------------------------------------ */
const compoundInterest: CalcDef = {
  inputs: [
    { key: "initial", label: "Starting balance", group: "Savings", default: 10000, min: 0, max: 5000000, step: 500, prefix: "$" },
    { key: "monthly", label: "Monthly contribution", group: "Savings", default: 500, min: 0, max: 50000, step: 25, prefix: "$" },
    { key: "rate", label: "Annual interest rate", group: "Growth", default: 6, min: 0, max: 20, step: 0.1, suffix: "%" },
    { key: "n", label: "Compounding periods per year", group: "Growth", default: 12, min: 1, max: 365, step: 1, help: "1 = yearly, 4 = quarterly, 12 = monthly, 365 = daily." },
    { key: "years", label: "Years", group: "Growth", default: 20, min: 1, max: 60, step: 1, suffix: "yrs" },
    { key: "inflation", label: "Expected inflation", group: "Growth", default: 2.5, min: 0, max: 10, step: 0.1, suffix: "%/yr", help: "Used to show what the final balance is worth in today's money." },
  ],
  compute(v) {
    const n = Math.max(1, Math.round(v.n));
    const im = Math.pow(1 + v.rate / 100 / n, n / 12) - 1; // equivalent monthly rate
    const years = Math.round(v.years);
    let bal = v.initial;
    const pts = [{ x: 0, y: v.initial }];
    const contrib = [{ x: 0, y: v.initial }];
    for (let m = 1; m <= years * 12; m++) {
      bal = bal * (1 + im) + v.monthly; // contribution added at month end
      if (m % 12 === 0) {
        pts.push({ x: m / 12, y: bal });
        contrib.push({ x: m / 12, y: v.initial + v.monthly * m });
      }
    }
    const paidIn = v.initial + v.monthly * years * 12;
    const interest = bal - paidIn;
    const real = bal / Math.pow(1 + v.inflation / 100, years);
    const step = Math.max(1, Math.round(years / 10));
    return {
      verdict: {
        tone: "good",
        text: `After ${years} years your balance would grow to ${money(bal)}. Of that, ${money(paidIn)} is money you put in and ${money(interest)} is interest. In today's money, allowing for ${percent(v.inflation)} inflation, that is about ${money(real)}.`,
      },
      kpis: [
        { label: "Future balance", value: money(bal), tone: "good" },
        { label: "Total you contribute", value: money(paidIn) },
        { label: "Interest earned", value: money(interest), tone: "good" },
        { label: "Value in today's money", value: money(real), hint: `At ${percent(v.inflation)} inflation` },
      ],
      series: {
        title: "Balance over time",
        xPrefix: "Y",
        format: "currency",
        lines: [
          { name: "Balance with interest", color: BRAND, points: pts },
          { name: "Money you put in", color: AMBER, points: contrib },
        ],
      },
      table: {
        title: "Year-by-year growth",
        columns: ["Year", "Contributed", "Balance", "Interest so far"],
        rows: pts
          .filter((p, i) => i > 0 && (i % step === 0 || i === pts.length - 1))
          .map((p) => {
            const c = contrib[p.x].y;
            return [String(p.x), money(c), money(p.y), money(p.y - c)];
          }),
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Savings goal                                                        */
/* ------------------------------------------------------------------ */
const savingsGoal: CalcDef = {
  inputs: [
    { key: "goal", label: "Savings goal", group: "Goal", default: 50000, min: 100, max: 10000000, step: 500, prefix: "$" },
    { key: "current", label: "Already saved", group: "Goal", default: 5000, min: 0, max: 10000000, step: 500, prefix: "$" },
    { key: "years", label: "Time to reach the goal", group: "Goal", default: 5, min: 1, max: 50, step: 1, suffix: "yrs" },
    { key: "rate", label: "Annual interest rate", group: "Growth", default: 4.5, min: 0, max: 15, step: 0.1, suffix: "%", help: "For example a high-yield savings account or CD rate." },
  ],
  compute(v) {
    const months = Math.round(v.years * 12);
    const i = v.rate / 100 / 12;
    const growth = Math.pow(1 + i, months);
    const fvCurrent = v.current * growth;
    const needed = i > 0 ? ((v.goal - fvCurrent) * i) / (growth - 1) : (v.goal - v.current) / months;
    const monthly = Math.max(needed, 0);
    const pts = [{ x: 0, y: v.current }];
    let bal = v.current;
    for (let m = 1; m <= months; m++) {
      bal = bal * (1 + i) + monthly;
      if (m % 12 === 0) pts.push({ x: m / 12, y: bal });
    }
    const contributed = monthly * months;
    const interest = bal - v.current - contributed;
    return {
      verdict: {
        tone: monthly === 0 ? "good" : "neutral",
        text:
          monthly === 0
            ? `Your current savings will grow to ${money(fvCurrent)} on their own, which already meets your ${money(v.goal)} goal in ${v.years} years.`
            : `Save ${money(monthly)} a month for ${v.years} years to reach ${money(v.goal)}. You contribute ${money(contributed)} and earn about ${money(interest)} in interest.`,
      },
      kpis: [
        { label: "Monthly savings needed", value: money(monthly), tone: "good" },
        { label: "Total you contribute", value: money(contributed + v.current), hint: "Including what you have saved" },
        { label: "Interest earned", value: money(interest) },
        { label: "Goal", value: money(v.goal) },
      ],
      series: {
        title: "Path to your goal",
        xPrefix: "Y",
        format: "currency",
        lines: [
          { name: "Savings balance", color: BRAND, points: pts },
          { name: "Goal", color: AMBER, points: pts.map((p) => ({ x: p.x, y: v.goal })) },
        ],
      },
      table: {
        title: "Monthly amount needed for different timelines",
        columns: ["Time", "Monthly savings", "Total contributed"],
        rows: [1, 2, 3, 5, 7, 10].map((y) => {
          const m = y * 12;
          const g = Math.pow(1 + i, m);
          const need = i > 0 ? Math.max(((v.goal - v.current * g) * i) / (g - 1), 0) : Math.max((v.goal - v.current) / m, 0);
          return [`${y} year${y === 1 ? "" : "s"}`, money(need), money(need * m)];
        }),
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Debt payoff (snowball vs avalanche)                                 */
/* ------------------------------------------------------------------ */
interface Debt {
  bal: number;
  rate: number;
  min: number;
}
type Strategy = "snowball" | "avalanche" | "minimum";

function payoff(debts: Debt[], extra: number, strategy: Strategy) {
  const d = debts.map((x) => ({ ...x })).filter((x) => x.bal > 0);
  const budget = d.reduce((s, x) => s + x.min, 0) + (strategy === "minimum" ? 0 : extra);
  const total = () => d.reduce((s, x) => s + x.bal, 0);
  const pts = [{ x: 0, y: total() }];
  let month = 0;
  let interest = 0;
  while (d.some((x) => x.bal > 0.005) && month < 600) {
    month++;
    for (const x of d) {
      if (x.bal <= 0) continue;
      const i = (x.bal * x.rate) / 1200;
      x.bal += i;
      interest += i;
    }
    let avail = budget;
    for (const x of d) {
      if (x.bal <= 0) continue;
      const p = Math.min(x.min, x.bal);
      x.bal -= p;
      avail -= p;
    }
    if (strategy !== "minimum") {
      const open = d.filter((x) => x.bal > 0.005);
      open.sort((a, b) => (strategy === "snowball" ? a.bal - b.bal : b.rate - a.rate));
      for (const t of open) {
        if (avail <= 0) break;
        const p = Math.min(avail, t.bal);
        t.bal -= p;
        avail -= p;
      }
    }
    if (month % 12 === 0) pts.push({ x: month / 12, y: Math.max(total(), 0) });
  }
  const paid = !d.some((x) => x.bal > 0.005);
  if (paid && month % 12 !== 0) pts.push({ x: month / 12, y: 0 });
  return { months: month, interest, paid, pts };
}

const duration = (months: number, paid: boolean) => {
  if (!paid) return "More than 50 years";
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts = [];
  if (y) parts.push(`${y} year${y === 1 ? "" : "s"}`);
  if (m || !y) parts.push(`${m} month${m === 1 ? "" : "s"}`);
  return parts.join(" ");
};

const debtPayoff: CalcDef = {
  inputs: [
    { key: "b1", label: "Debt 1 balance", group: "Debt 1 (credit card)", default: 4500, min: 0, max: 1000000, step: 100, prefix: "$" },
    { key: "r1", label: "Interest rate", group: "Debt 1 (credit card)", default: 22.9, min: 0, max: 40, step: 0.1, suffix: "%" },
    { key: "m1", label: "Minimum payment", group: "Debt 1 (credit card)", default: 135, min: 0, max: 20000, step: 5, prefix: "$", suffix: "/mo" },
    { key: "b2", label: "Debt 2 balance", group: "Debt 2 (credit card)", default: 2800, min: 0, max: 1000000, step: 100, prefix: "$" },
    { key: "r2", label: "Interest rate", group: "Debt 2 (credit card)", default: 18.5, min: 0, max: 40, step: 0.1, suffix: "%" },
    { key: "m2", label: "Minimum payment", group: "Debt 2 (credit card)", default: 84, min: 0, max: 20000, step: 5, prefix: "$", suffix: "/mo" },
    { key: "b3", label: "Debt 3 balance", group: "Debt 3 (loan)", default: 9000, min: 0, max: 1000000, step: 100, prefix: "$", help: "Set any balance to 0 if you have fewer than three debts." },
    { key: "r3", label: "Interest rate", group: "Debt 3 (loan)", default: 7.5, min: 0, max: 40, step: 0.1, suffix: "%" },
    { key: "m3", label: "Minimum payment", group: "Debt 3 (loan)", default: 180, min: 0, max: 20000, step: 5, prefix: "$", suffix: "/mo" },
    { key: "extra", label: "Extra payment each month", group: "Extra", default: 150, min: 0, max: 20000, step: 10, prefix: "$", help: "Money above all minimums that you can put toward debt." },
  ],
  compute(v) {
    const debts: Debt[] = [
      { bal: v.b1, rate: v.r1, min: v.m1 },
      { bal: v.b2, rate: v.r2, min: v.m2 },
      { bal: v.b3, rate: v.r3, min: v.m3 },
    ];
    const av = payoff(debts, v.extra, "avalanche");
    const sn = payoff(debts, v.extra, "snowball");
    const mn = payoff(debts, v.extra, "minimum");
    const total = debts.reduce((s, d) => s + d.bal, 0);
    const saved = mn.paid ? mn.interest - av.interest : NaN;
    return {
      verdict: {
        tone: av.paid ? "good" : "bad",
        text: !av.paid
          ? "These payments do not cover the interest, so the debt never gets paid off. Increase your payments."
          : `With an extra ${money(v.extra)} a month the avalanche method clears ${money(total)} of debt in ${duration(av.months, av.paid)} and about ${money(av.interest)} of interest. The snowball method takes ${duration(sn.months, sn.paid)} and costs ${money(sn.interest)} of interest${sn.interest - av.interest > 0.5 ? `, ${money(sn.interest - av.interest)} more than avalanche` : ", about the same as avalanche"}.`,
      },
      kpis: [
        { label: "Debt-free in (avalanche)", value: duration(av.months, av.paid), tone: tone(av.paid) },
        { label: "Interest (avalanche)", value: money(av.interest) },
        { label: "Interest (snowball)", value: money(sn.interest) },
        { label: "Saved vs minimums only", value: Number.isFinite(saved) ? money(saved) : "—", tone: "good" },
      ],
      series: {
        title: "Total debt balance over time",
        xPrefix: "Y",
        format: "currency",
        lines: [
          { name: "Avalanche (highest rate first)", color: BRAND, points: av.pts },
          { name: "Snowball (smallest balance first)", color: AMBER, points: sn.pts },
        ],
      },
      table: {
        title: "Compare the strategies",
        columns: ["Strategy", "Debt-free in", "Total interest"],
        rows: [
          ["Avalanche", duration(av.months, av.paid), money(av.interest)],
          ["Snowball", duration(sn.months, sn.paid), money(sn.interest)],
          ["Minimum payments only", duration(mn.months, mn.paid), mn.paid ? money(mn.interest) : "Never repaid"],
        ],
      },
    };
  },
};

function tone(ok: boolean) {
  return ok ? ("good" as const) : ("bad" as const);
}

/* ------------------------------------------------------------------ */
/* Salary to hourly                                                    */
/* ------------------------------------------------------------------ */
const salaryToHourly: CalcDef = {
  inputs: [
    { key: "salary", label: "Annual salary", group: "Pay", default: 65000, min: 1000, max: 2000000, step: 500, prefix: "$" },
    { key: "hours", label: "Hours worked per week", group: "Schedule", default: 40, min: 1, max: 80, step: 1, suffix: "hrs" },
    { key: "weeks", label: "Weeks worked per year", group: "Schedule", default: 52, min: 1, max: 52, step: 1, suffix: "wks", help: "Use 52 if your vacation and holidays are paid. Subtract weeks of unpaid time off." },
  ],
  compute(v) {
    const hoursYear = v.hours * v.weeks;
    const hourly = v.salary / Math.max(hoursYear, 1);
    const perWeek = v.salary / Math.max(v.weeks, 1);
    const f = (n: number) => `$${num(n, 2)}`;
    return {
      verdict: {
        tone: "neutral",
        text: `A ${money(v.salary)} salary at ${num(v.hours, 0)} hours a week for ${num(v.weeks, 0)} weeks works out to about ${f(hourly)} an hour (${num(hoursYear, 0)} paid hours a year).`,
      },
      kpis: [
        { label: "Hourly rate", value: f(hourly), tone: "good" },
        { label: "Daily", value: f(hourly * (v.hours / 5)), hint: "Assuming a 5-day week" },
        { label: "Weekly", value: money(perWeek) },
        { label: "Monthly", value: money(v.salary / 12) },
      ],
      table: {
        title: "Pay by period (before tax)",
        columns: ["Period", "Amount"],
        rows: [
          ["Annual", money(v.salary)],
          ["Monthly", money(v.salary / 12)],
          ["Semi-monthly (24 pay periods)", money(v.salary / 24)],
          ["Biweekly (26 pay periods)", money(v.salary / 26)],
          ["Weekly", money(v.salary / 52)],
          ["Hourly", f(hourly)],
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Take-home pay                                                       */
/* ------------------------------------------------------------------ */
const takeHome: CalcDef = {
  inputs: [
    { key: "gross", label: "Gross annual salary", group: "Income", default: 75000, min: 5000, max: 2000000, step: 1000, prefix: "$" },
    { key: "periods", label: "Pay periods per year", group: "Income", default: 26, min: 12, max: 52, step: 1, help: "26 = biweekly, 24 = twice a month, 12 = monthly, 52 = weekly." },
    { key: "fed", label: "Federal income tax (effective rate)", group: "Taxes", default: 13, min: 0, max: 40, step: 0.5, suffix: "%", help: "Your average rate on taxable income, not your top bracket. Find it on last year's return: total tax ÷ taxable income." },
    { key: "state", label: "State and local income tax", group: "Taxes", default: 4, min: 0, max: 15, step: 0.25, suffix: "%" },
    { key: "fica", label: "Social Security and Medicare", group: "Taxes", default: 7.65, min: 0, max: 15.3, step: 0.05, suffix: "%", help: "7.65% for most employees (6.2% Social Security + 1.45% Medicare)." },
    { key: "retire", label: "Pre-tax retirement contribution", group: "Deductions", default: 5, min: 0, max: 50, step: 0.5, suffix: "% of pay" },
    { key: "health", label: "Pre-tax health insurance", group: "Deductions", default: 150, min: 0, max: 5000, step: 10, prefix: "$", suffix: "/mo" },
    { key: "other", label: "Other after-tax deductions", group: "Deductions", default: 0, min: 0, max: 5000, step: 10, prefix: "$", suffix: "/mo" },
  ],
  compute(v) {
    const retire = v.gross * (v.retire / 100);
    const health = v.health * 12;
    const taxable = Math.max(v.gross - retire - health, 0);
    const fed = taxable * (v.fed / 100);
    const state = taxable * (v.state / 100);
    const fica = Math.max(v.gross - health, 0) * (v.fica / 100); // retirement deferrals are still subject to FICA
    const other = v.other * 12;
    const net = v.gross - retire - health - fed - state - fica - other;
    const perCheck = net / v.periods;
    return {
      verdict: {
        tone: "neutral",
        text: `Estimated take-home pay is ${money(net)} a year, ${money(net / 12)} a month or ${money(perCheck)} per paycheck (${num(v.periods, 0)} a year). That is ${percent((net / v.gross) * 100, 0)} of your gross pay.`,
      },
      kpis: [
        { label: "Per paycheck", value: money(perCheck), tone: "good" },
        { label: "Monthly", value: money(net / 12) },
        { label: "Annual take-home", value: money(net) },
        { label: "Share of gross", value: percent((net / v.gross) * 100, 0) },
      ],
      breakdown: {
        title: "Where your gross pay goes (per year)",
        total: Math.max(v.gross, 1),
        items: [
          { label: "Take-home pay", value: Math.max(net, 0), color: BRAND },
          { label: "Federal tax", value: fed, color: RED },
          { label: "State and local tax", value: state, color: AMBER },
          { label: "Social Security, Medicare", value: fica, color: SLATE },
          { label: "Retirement savings", value: retire, color: VIOLET },
          { label: "Health insurance", value: health, color: BLUE },
        ],
      },
      table: {
        title: "Annual summary",
        columns: ["Item", "Amount"],
        rows: [
          ["Gross pay", money(v.gross)],
          ["Taxable income (after pre-tax deductions)", money(taxable)],
          ["Total taxes", money(fed + state + fica)],
          ["Total deductions", money(retire + health + other)],
          ["Take-home pay", money(net)],
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* 50/30/20 budget                                                     */
/* ------------------------------------------------------------------ */
const budget: CalcDef = {
  inputs: [
    { key: "income", label: "Monthly take-home income", group: "Income", default: 4500, min: 500, max: 200000, step: 50, prefix: "$", help: "Pay after taxes and payroll deductions." },
    { key: "needs", label: "Needs spending", group: "Your spending today", default: 2600, min: 0, max: 200000, step: 50, prefix: "$", help: "Housing, utilities, groceries, transport, insurance, minimum debt payments." },
    { key: "wants", label: "Wants spending", group: "Your spending today", default: 1300, min: 0, max: 200000, step: 50, prefix: "$", help: "Dining out, entertainment, subscriptions, hobbies, travel." },
    { key: "saved", label: "Savings and extra debt payments", group: "Your spending today", default: 600, min: 0, max: 200000, step: 50, prefix: "$" },
  ],
  compute(v) {
    const t = { needs: v.income * 0.5, wants: v.income * 0.3, saved: v.income * 0.2 };
    const rows = [
      ["Needs (50%)", t.needs, v.needs],
      ["Wants (30%)", t.wants, v.wants],
      ["Savings and debt (20%)", t.saved, v.saved],
    ] as const;
    const spent = v.needs + v.wants + v.saved;
    const left = v.income - spent;
    return {
      verdict: {
        tone: v.needs <= t.needs && v.saved >= t.saved ? "good" : "neutral",
        text: `On ${money(v.income)} a month the 50/30/20 targets are ${money(t.needs)} for needs, ${money(t.wants)} for wants and ${money(t.saved)} for savings and debt. You currently put ${percent((v.needs / v.income) * 100, 0)} toward needs, ${percent((v.wants / v.income) * 100, 0)} toward wants and ${percent((v.saved / v.income) * 100, 0)} toward savings.${left < 0 ? ` You are spending ${money(-left)} more than you earn.` : ""}`,
      },
      kpis: [
        { label: "Needs target", value: money(t.needs), hint: `You: ${money(v.needs)}` },
        { label: "Wants target", value: money(t.wants), hint: `You: ${money(v.wants)}` },
        { label: "Savings target", value: money(t.saved), hint: `You: ${money(v.saved)}` },
        { label: left >= 0 ? "Unallocated" : "Overspent", value: money(Math.abs(left)), tone: tone(left >= 0) },
      ],
      breakdown: {
        title: "Your budget today",
        total: Math.max(v.income, 1),
        items: [
          { label: "Needs", value: v.needs, color: SLATE },
          { label: "Wants", value: v.wants, color: AMBER },
          { label: "Savings and debt", value: v.saved, color: BRAND },
        ],
      },
      table: {
        title: "Target vs actual",
        columns: ["Category", "Target", "Actual", "Difference"],
        rows: rows.map(([label, target, actual]) => [label, money(target), money(actual), moneySigned(actual - target)]),
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Emergency fund                                                      */
/* ------------------------------------------------------------------ */
const emergencyFund: CalcDef = {
  inputs: [
    { key: "expenses", label: "Essential monthly expenses", group: "Target", default: 3200, min: 200, max: 100000, step: 50, prefix: "$", help: "Housing, utilities, food, transport, insurance and minimum debt payments." },
    { key: "months", label: "Months of expenses to cover", group: "Target", default: 6, min: 1, max: 24, step: 1, suffix: "mo", help: "Three months is a common minimum. Six or more suits variable income or single-income households." },
    { key: "current", label: "Already saved", group: "Progress", default: 2500, min: 0, max: 5000000, step: 100, prefix: "$" },
    { key: "monthly", label: "Monthly contribution", group: "Progress", default: 400, min: 0, max: 50000, step: 25, prefix: "$" },
    { key: "rate", label: "Savings account interest rate", group: "Progress", default: 4, min: 0, max: 10, step: 0.1, suffix: "%" },
  ],
  compute(v) {
    const target = v.expenses * v.months;
    const i = v.rate / 100 / 12;
    let bal = v.current;
    let m = 0;
    const pts = [{ x: 0, y: bal }];
    while (bal < target && m < 600 && (v.monthly > 0 || bal * i > 0)) {
      m++;
      bal = bal * (1 + i) + v.monthly;
      if (m % 12 === 0) pts.push({ x: m / 12, y: Math.min(bal, target) });
    }
    const reached = bal >= target;
    if (reached && m % 12 !== 0) pts.push({ x: m / 12, y: target });
    const gap = Math.max(target - v.current, 0);
    return {
      verdict: {
        tone: reached ? "good" : "bad",
        text:
          v.current >= target
            ? `You already have ${money(v.current)}, which covers ${num(v.current / v.expenses, 1)} months of expenses and meets your ${money(target)} target.`
            : reached
              ? `Your ${num(v.months, 0)}-month emergency fund target is ${money(target)}. Saving ${money(v.monthly)} a month, you reach it in ${duration(m, true)}.`
              : `Your ${num(v.months, 0)}-month target is ${money(target)}, but at this pace you will not reach it. Increase your monthly contribution.`,
      },
      kpis: [
        { label: "Emergency fund target", value: money(target) },
        { label: "Still to save", value: money(gap) },
        { label: "Months covered today", value: num(v.current / v.expenses, 1) },
        { label: "Time to reach target", value: v.current >= target ? "Done" : reached ? duration(m, true) : "Not reached", tone: tone(reached) },
      ],
      series: {
        title: "Emergency fund growth",
        xPrefix: "Y",
        format: "currency",
        lines: [
          { name: "Savings balance", color: BRAND, points: pts },
          { name: "Target", color: AMBER, points: pts.map((p) => ({ x: p.x, y: target })) },
        ],
      },
      table: {
        title: "Target by months of coverage",
        columns: ["Coverage", "Amount", "Shortfall"],
        rows: [3, 4, 6, 9, 12].map((mo) => [`${mo} months`, money(v.expenses * mo), money(Math.max(v.expenses * mo - v.current, 0))]),
      },
    };
  },
};

export const PERSONAL_FINANCE_CALCS: Record<string, CalcDef> = {
  "compound-interest-calculator": compoundInterest,
  "savings-goal-calculator": savingsGoal,
  "debt-payoff-calculator": debtPayoff,
  "salary-to-hourly-calculator": salaryToHourly,
  "take-home-pay-calculator": takeHome,
  "budget-50-30-20-calculator": budget,
  "emergency-fund-calculator": emergencyFund,
};

