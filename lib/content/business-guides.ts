import type { Guide } from "../guides";

export const BUSINESS_GUIDES: Guide[] = [
  {
    slug: "markup-vs-margin-explained",
    category: "business",
    title: "Markup vs Margin: What Is the Difference and Why It Matters",
    description:
      "How markup and margin differ, how to convert between them, and how to use both to price products and protect profit.",
    published: "2026-11-13",
    calculator: "markup-margin-calculator",
    sections: [
      {
        h: "Two ways to describe the same profit",
        p: [
          "Markup is profit divided by cost. Margin is profit divided by selling price. If you buy for $60 and sell for $100, the profit is $40. That is a 66.7% markup and a 40% margin.",
        ],
      },
      {
        h: "The common mistake",
        p: [
          "Someone who wants a 40% margin and adds a 40% markup to cost ends up with a margin of only about 28.6%. To reach a target margin, divide the cost by one minus the margin.",
        ],
      },
      {
        h: "Using margin to price",
        p: [
          "Margin is easier to compare across products and with financial statements, because it is based on revenue. Markup is handy when you set prices from a supplier's cost.",
        ],
      },
      {
        h: "Margin must cover overhead",
        p: [
          "Gross margin only counts the direct cost of the product. Rent, wages, marketing and other overheads must be paid from it, so check that your margin leaves a net profit.",
        ],
      },
    ],
  },
  {
    slug: "break-even-analysis-guide",
    category: "business",
    title: "Break-Even Analysis: How to Find and Use Your Break-Even Point",
    description:
      "A plain-English guide to break-even analysis: fixed and variable costs, contribution margin, and how to use the result to price and plan.",
    published: "2026-11-13",
    calculator: "break-even-calculator",
    sections: [
      {
        h: "What break-even means",
        p: [
          "The break-even point is the number of units, or amount of sales, at which total revenue equals total costs. Every sale beyond it adds to profit.",
        ],
      },
      {
        h: "Fixed and variable costs",
        p: [
          "Fixed costs, such as rent and salaries, do not change with volume in the short term. Variable costs, such as materials and shipping, rise with each unit. The difference between price and variable cost is the contribution that goes toward fixed costs and profit.",
        ],
      },
      {
        h: "Using the result",
        p: [
          "Compare the break-even volume with what your market can realistically buy. If it looks too high, test a higher price, lower costs or a smaller cost base before you commit money.",
        ],
      },
      {
        h: "Limits of the model",
        p: [
          "The simple model assumes one product, a constant price and constant variable costs. Real businesses have discounts, mixed products and costs that step up. Treat the result as a planning aid, not a forecast.",
        ],
      },
    ],
  },
  {
    slug: "set-your-freelance-hourly-rate",
    category: "business",
    title: "How to Set Your Freelance Hourly Rate Without Undercharging",
    description:
      "How to work out a freelance rate from your income goal, expenses, taxes and billable hours, and why employee wages are a poor benchmark.",
    published: "2026-11-13",
    calculator: "freelance-hourly-rate-calculator",
    sections: [
      {
        h: "Start with the income you need",
        p: [
          "Decide the yearly take-home income you want, then add business expenses and the share of profit you will set aside for taxes and retirement. That total is the revenue you need to earn.",
        ],
      },
      {
        h: "Count only billable time",
        p: [
          "You cannot bill every working hour. Admin, marketing, sales calls and learning all take time. Many freelancers bill 20 to 30 hours in a full week, so divide the revenue by real billable hours, not 2,080.",
        ],
      },
      {
        h: "Account for time off",
        p: [
          "As a freelancer you are not paid for holidays or sick days. Subtract the weeks you will not work to find the weeks you can bill.",
        ],
      },
      {
        h: "Treat the result as a floor",
        p: [
          "The calculated rate is the minimum that meets your goals. Market demand, your skills and the value you deliver may justify more. Consider project-based pricing once you know your floor.",
        ],
      },
    ],
  },
  {
    slug: "sales-tax-basics",
    category: "business",
    title: "Sales Tax Basics: How It Works and How to Calculate It",
    description:
      "How sales tax is applied, how to add or remove it from a price, and what small businesses should check about rates and registration.",
    published: "2026-11-13",
    calculator: "sales-tax-calculator",
    sections: [
      {
        h: "How sales tax works",
        p: [
          "Sales tax is charged on taxable goods and some services at the point of sale. Sellers collect it from customers and pass it to the tax authority. In the US, rates combine state, county and city taxes and differ by location.",
        ],
      },
      {
        h: "Adding and removing tax",
        p: [
          "To add tax, multiply the price by one plus the rate. To take it out of a total, divide by one plus the rate. Do not simply subtract the rate from the total, because the tax was calculated on the pre-tax price.",
        ],
      },
      {
        h: "What is taxable",
        p: [
          "Rules differ. Many places exempt some groceries, medicine or clothing, and treatment of digital goods and services varies. Check your jurisdiction's list of taxable items.",
        ],
      },
      {
        h: "For small businesses",
        p: [
          "If you sell to customers in several states you may have to register and collect tax where you have a sales presence. Use an accountant or the tax authority's guidance to get this right.",
        ],
      },
    ],
  },
];
