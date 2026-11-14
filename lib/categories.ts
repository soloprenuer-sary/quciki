export type CategorySlug = "real-estate" | "construction" | "finance" | "auto" | "business";

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Short label for nav and cards. */
  short: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  /** Order in which tool groups are shown on the hub page. */
  groups: string[];
}

export const CATEGORIES: Category[] = [
  {
    slug: "real-estate",
    name: "Real Estate Calculators",
    short: "Real Estate",
    tagline: "Buy, rent, finance and invest in property with clear numbers.",
    metaTitle: "Real Estate Calculators: Buy vs Rent, Rental ROI, Mortgage & More",
    metaDescription:
      "Free real estate calculators for buyers, renters and investors: buy vs rent, rental property ROI, cap rate, closing costs, refinance, property tax and more.",
    intro: [
      "These calculators cover the main financial questions in property: should you buy or rent, what will a mortgage and closing costs really cost, and does a rental or flip make money.",
      "Each tool shows its formulas, a worked example and plain-English guidance, so you understand the result and the assumptions behind it.",
    ],
    groups: ["Buying", "Investing"],
  },
  {
    slug: "construction",
    name: "Construction and Landscaping Calculators",
    short: "Construction",
    tagline: "Estimate gravel, drainage, hardscape and excavation quantities before you order or dig.",
    metaTitle: "Construction Calculators: Gravel, French Drain, Retaining Wall & Excavation",
    metaDescription:
      "Free construction and landscaping calculators: gravel, gravel driveway, French drain, retaining wall blocks, paver base, excavation volume, dump truck loads, fill dirt and excavation cost.",
    intro: [
      "Ordering materials is easier when you know the numbers. These calculators convert the size of a job into cubic yards, tons, blocks, loads and a cost estimate, so you can order the right amount the first time.",
      "All tools use US units (feet, inches, cubic yards and tons). Material weights and prices are editable, because they vary by supplier and region. Always confirm quantities with your supplier and check local codes before you dig or build.",
    ],
    groups: ["Gravel and Aggregate", "Drainage and Landscaping", "Hardscape", "Excavation and Earthwork"],
  },
  {
    slug: "finance",
    name: "Personal Finance Calculators",
    short: "Finance",
    tagline: "Plan savings, pay down debt and understand your paycheck and budget.",
    metaTitle: "Personal Finance Calculators: Compound Interest, Debt Payoff, Budget & More",
    metaDescription:
      "Free personal finance calculators: compound interest, savings goal, debt payoff (snowball vs avalanche), salary to hourly, take-home pay, 50/30/20 budget and emergency fund.",
    intro: [
      "These calculators answer everyday money questions: how fast your savings can grow, what you need to save each month to reach a goal, which debt payoff method costs less, and what your paycheck and budget really look like.",
      "Each tool explains its formulas and assumptions with a worked example. Results are estimates for education and planning, not personal financial advice.",
    ],
    groups: ["Saving and Growth", "Debt and Budgeting", "Income and Pay"],
  },
  {
    slug: "auto",
    name: "Auto and Transportation Calculators",
    short: "Auto",
    tagline: "Understand car loans, leases, fuel, EV charging and depreciation before you buy.",
    metaTitle: "Auto Calculators: Car Loan, Lease, Fuel Cost, EV Charging & Depreciation",
    metaDescription:
      "Free auto calculators: car loan payment, auto lease with money factor, fuel cost per mile, EV charging cost vs gas, and car depreciation by year.",
    intro: [
      "A car costs much more than its price. These calculators show what financing or leasing really costs, what you will spend on fuel or charging, and how quickly the car loses value.",
      "Each tool explains its formulas and assumptions. Prices, rates and taxes vary, so use the results as estimates and confirm quotes with the dealer or lender.",
    ],
    groups: ["Buying and Financing", "Running Costs"],
  },
  {
    slug: "business",
    name: "Business and Freelance Calculators",
    short: "Business",
    tagline: "Price products, find your break-even point, set a freelance rate and plan funding.",
    metaTitle: "Business Calculators: Markup, Break-Even, Sales Tax, Freelance Rate & Loans",
    metaDescription:
      "Free business calculators: markup and margin, break-even point, sales tax, freelance hourly rate and business loan payments.",
    intro: [
      "Good pricing and planning decisions start with a few key numbers. These calculators help small business owners and freelancers find margins, break-even volume, the rate to charge and the cost of borrowing.",
      "They are planning aids, not accounting or tax advice. Check figures with your accountant and local tax authority.",
    ],
    groups: ["Pricing and Profit", "Income and Funding"],
  },
];

export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
