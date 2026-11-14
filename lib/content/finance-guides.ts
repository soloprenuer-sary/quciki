import type { Guide } from "../guides";

export const FINANCE_GUIDES: Guide[] = [
  {
    slug: "compound-interest-explained",
    category: "finance",
    title: "Compound Interest Explained: How Money Grows Over Time",
    description:
      "What compound interest is, how it differs from simple interest, why time and regular contributions matter, and how the rule of 72 works.",
    published: "2026-11-13",
    calculator: "compound-interest-calculator",
    sections: [
      {
        h: "Interest on interest",
        p: [
          "With simple interest you earn a fixed amount each year on your original deposit. With compound interest, each period's interest is added to the balance, so the next period's interest is calculated on a larger amount. The effect is small at first and large over decades.",
        ],
      },
      {
        h: "Time beats size",
        p: [
          "Because growth builds on itself, the number of years has a bigger effect than most people expect. Someone who starts saving ten years earlier can finish with far more than someone who saves larger amounts later.",
        ],
      },
      {
        h: "Regular contributions",
        p: [
          "Each deposit begins earning interest as soon as it is added. A steady monthly contribution can account for most of the final balance, with interest becoming the larger share in later years.",
        ],
      },
      {
        h: "The rule of 72 and its limits",
        p: [
          "Divide 72 by the annual rate to estimate the years needed to double your money. At 6% that is about 12 years. Real returns vary from year to year, and fees and inflation reduce what you keep, so use the rule for a rough idea only.",
        ],
      },
    ],
  },
  {
    slug: "debt-snowball-vs-avalanche",
    category: "finance",
    title: "Debt Snowball vs Debt Avalanche: Which Payoff Method Should You Use?",
    description:
      "How the snowball and avalanche methods work, how they compare on interest and motivation, and how to choose and stick with a plan.",
    published: "2026-11-13",
    calculator: "debt-payoff-calculator",
    sections: [
      {
        h: "Two ways to order your debts",
        p: [
          "Both methods start the same way: pay the minimum on every debt, then put all your extra money on one target. The difference is which debt you pick. The avalanche targets the highest interest rate. The snowball targets the smallest balance.",
        ],
      },
      {
        h: "Cost versus momentum",
        p: [
          "The avalanche usually costs less because it removes the most expensive interest first. The snowball can give you a quicker win, which some people find keeps them going. When rates are close together, the cost gap is often small.",
        ],
      },
      {
        h: "Roll payments forward",
        p: [
          "When a debt is paid off, add its payment to the next target. This rolling effect is what speeds up the plan, so keep your total monthly payment the same.",
        ],
      },
      {
        h: "Stay on track",
        p: [
          "Stop adding new balances, automate payments, and keep a small cash cushion so one surprise does not push you back to the cards. The best method is the one you will keep doing.",
        ],
      },
    ],
  },
  {
    slug: "budget-50-30-20-rule",
    category: "finance",
    title: "The 50/30/20 Budget Rule: How It Works and How to Adapt It",
    description:
      "How the 50/30/20 budget splits income into needs, wants and savings, what counts in each group, and how to adjust it for your situation.",
    published: "2026-11-13",
    calculator: "budget-50-30-20-calculator",
    sections: [
      {
        h: "The basic split",
        p: [
          "Take your income after taxes. Aim to spend about half on needs, thirty percent on wants and put twenty percent toward savings and extra debt payments. It is popular because it is easy to remember.",
        ],
      },
      {
        h: "Sorting needs from wants",
        p: [
          "Needs are the costs of living and working: housing, utilities, groceries, transport, insurance and minimum debt payments. Wants are things you could cut without serious harm, such as dining out, entertainment and subscriptions.",
        ],
      },
      {
        h: "When it does not fit",
        p: [
          "In expensive cities, needs may take 60% or more of income. In that case a 60/20/20 split can be more realistic. On a lower income the first step may be a small savings habit rather than a full 20%.",
        ],
      },
      {
        h: "Make it work",
        p: [
          "Track a month of spending to see actual numbers, automate savings on payday and review the budget every few months as income or costs change.",
        ],
      },
    ],
  },
  {
    slug: "how-much-emergency-fund",
    category: "finance",
    title: "How Much Emergency Fund Do You Need? A Practical Guide",
    description:
      "How to decide the size of your emergency fund, where to keep it, and how to build it alongside debt and other goals.",
    published: "2026-11-13",
    calculator: "emergency-fund-calculator",
    sections: [
      {
        h: "Base it on essential expenses",
        p: [
          "Add up your must-pay monthly costs: housing, utilities, food, transport, insurance and minimum debt payments. Multiply by the number of months you want covered. Many planners suggest three to six months.",
        ],
      },
      {
        h: "Adjust for your situation",
        p: [
          "Stable income and dual earners can often manage with three months. Irregular income, a single earner, dependents or specialised jobs that take longer to replace point toward six months or more.",
        ],
      },
      {
        h: "Where to keep it",
        p: [
          "Use an insured account you can reach quickly, such as a high-yield savings account. The goal is availability and safety, not high returns.",
        ],
      },
      {
        h: "Build it in stages",
        p: [
          "Start with a small first target, such as one month of expenses, then grow it. Balance this with paying down high-interest debt, and rebuild the fund after you use it.",
        ],
      },
    ],
  },
];
