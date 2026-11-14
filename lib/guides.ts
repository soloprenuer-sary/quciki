import type { CategorySlug } from "./categories";
import { CONSTRUCTION_GUIDES } from "./content/construction-guides";
import { FINANCE_GUIDES } from "./content/finance-guides";
import { AUTO_GUIDES } from "./content/auto-guides";
import { BUSINESS_GUIDES } from "./content/business-guides";

export interface Guide {
  category: CategorySlug;
  slug: string;
  title: string;
  description: string;
  published: string; // ISO date
  calculator: string;
  sections: { h: string; p: string[] }[];
}

const REAL_ESTATE_GUIDES: Guide[] = [
  {
    slug: "buy-vs-rent-which-is-better",
    category: "real-estate",
    title: "Buy vs Rent: Which Is Better? How to Decide With Numbers",
    description:
      "A practical framework for the buy vs rent decision: the costs people forget, how break-even works, and when each choice usually wins.",
    published: "2026-11-01",
    calculator: "buy-vs-rent-calculator",
    sections: [
      {
        h: "Why the monthly payment is a misleading comparison",
        p: [
          "People often compare rent to a mortgage payment and stop there. That ignores property tax, insurance, maintenance, closing costs and the cost of selling later. It also ignores what the renter could do with the down payment.",
          "A fair comparison tracks net worth on both paths. The owner builds equity as the loan is paid and the home appreciates. The renter invests the down payment and any monthly savings. Whichever pile is bigger after your planned stay wins.",
        ],
      },
      {
        h: "The costs that tilt the decision",
        p: [
          "Buying costs usually run around 2% to 5% of the price, and selling costs often reach 6% when an agent is involved. Those transaction costs are why buying rarely pays off for short stays.",
          "Ongoing costs matter too. A common planning figure for maintenance is 1% of the home's value each year, and property tax and insurance vary a lot by location.",
        ],
      },
      {
        h: "Understanding the break-even year",
        p: [
          "The break-even year is the first year in which owning leaves you at least as well off as renting. If you expect to move before then, renting has been the cheaper path.",
          "Break-even moves with interest rates, price-to-rent ratios, and appreciation. Run the numbers with several rates and growth assumptions instead of trusting one forecast.",
        ],
      },
      {
        h: "When buying usually wins, and when renting does",
        p: [
          "Buying tends to win when you will stay a decade or more, rents are high relative to prices, and you can make a solid down payment without draining savings.",
          "Renting tends to win when you may move within a few years, prices are high relative to rents, or you would otherwise invest the money well and need flexibility.",
          "Non-financial factors count as well: stability, freedom to renovate and the risk of a large unexpected repair bill versus the flexibility to leave.",
        ],
      },
    ],
  },
  {
    slug: "how-to-calculate-rental-property-roi",
    category: "real-estate",
    title: "How to Calculate Rental Property ROI (With Examples)",
    description:
      "Learn the formulas for NOI, cap rate, cash flow, cash-on-cash return and DSCR, and how to use them to screen rental properties.",
    published: "2026-11-02",
    calculator: "rental-property-roi-calculator",
    sections: [
      {
        h: "Start with net operating income",
        p: [
          "Net operating income (NOI) is the rent you actually collect minus the costs of operating the property: taxes, insurance, repairs, management and vacancy. It excludes loan payments and income tax.",
          "Getting NOI right is the most important step. Overly optimistic rent or missing expenses will inflate every other metric.",
        ],
      },
      {
        h: "Cap rate: the quick comparison",
        p: [
          "Cap rate equals NOI divided by price. Because it ignores financing it lets you compare a duplex with an apartment building on equal terms, and compare an asking price to what the market pays.",
        ],
      },
      {
        h: "Cash flow and cash-on-cash return",
        p: [
          "Cash flow is NOI minus the loan payments. Cash-on-cash return divides yearly cash flow by the cash you put in: the down payment, closing costs and upfront repairs.",
          "This is the return on your own money, so it reflects how much leverage you use.",
        ],
      },
      {
        h: "Debt service coverage and the 1% rule",
        p: [
          "Lenders look at DSCR, which is NOI divided by annual loan payments. A ratio of about 1.25 or more gives a cushion.",
          "The 1% rule is a fast filter: monthly rent should be at least 1% of the price. It is only a screen, and it works better in some markets than others.",
        ],
      },
      {
        h: "Stress-test before you buy",
        p: [
          "Run the deal with higher vacancy, lower rent and higher repairs. If it only works under perfect conditions, it is fragile. A margin of safety matters more than a pretty spreadsheet.",
        ],
      },
    ],
  },
  {
    slug: "cap-rate-explained",
    category: "real-estate",
    title: "Cap Rate Explained: What It Is and How to Use It",
    description:
      "Understand capitalization rate: the formula, how to read it, what a good cap rate looks like, and its limits when evaluating investment property.",
    published: "2026-11-03",
    calculator: "cap-rate-calculator",
    sections: [
      {
        h: "What cap rate measures",
        p: [
          "Capitalization rate is a property's net operating income divided by its price. A building that earns $60,000 NOI and costs $800,000 has a 7.5% cap rate.",
          "It describes the income yield as if you paid all cash, which makes properties comparable regardless of how each buyer finances them.",
        ],
      },
      {
        h: "Using cap rate to value a property",
        p: [
          "Rearranging the formula gives value = NOI ÷ cap rate. If similar properties trade at a 6% cap rate and your target earns $60,000, a price near $1,000,000 would be in line with the market.",
        ],
      },
      {
        h: "What counts as a good cap rate",
        p: [
          "There is no single answer. Lower cap rates are common where buyers expect stable demand and growth. Higher cap rates usually compensate for higher perceived risk, such as weaker locations, older buildings or tenant turnover.",
        ],
      },
      {
        h: "Limits of cap rate",
        p: [
          "Cap rate ignores financing, taxes and future changes in rent or value. It is a snapshot of one year. Pair it with cash-on-cash return and a multi-year ROI projection for a fuller picture.",
        ],
      },
    ],
  },
  {
    slug: "fix-and-flip-70-percent-rule",
    category: "real-estate",
    title: "The 70% Rule for House Flipping: How It Works and When to Break It",
    description:
      "Learn the 70% rule for fix and flip deals, how to estimate ARV and rehab costs, and the hidden costs that shrink flip profits.",
    published: "2026-11-08",
    calculator: "fix-and-flip-calculator",
    sections: [
      {
        h: "What the 70% rule says",
        p: [
          "The 70% rule is a quick screen for flip deals: pay no more than 70% of the after-repair value (ARV) minus the cost of repairs. If a house will be worth $300,000 after renovation and needs $40,000 of work, the maximum offer is $170,000.",
          "The remaining 30% of ARV is meant to cover the investor's profit plus financing, holding, closing and selling costs.",
        ],
      },
      {
        h: "Estimating ARV honestly",
        p: [
          "ARV should come from recently sold homes of similar size, condition and location, typically within a mile and the last six months. Listing prices show what sellers hope for, not what buyers paid.",
          "Because the whole deal rests on ARV, a 5% error can erase most of the profit. Run the numbers with a lower ARV as a stress test.",
        ],
      },
      {
        h: "Costs that eat the margin",
        p: [
          "Interest and points on short-term loans, monthly taxes, insurance and utilities, permits, and agent commissions add up quickly. Every additional month of the project adds to the cost.",
          "A rehab contingency of 10% to 15% is standard because opening walls often reveals new problems.",
        ],
      },
      {
        h: "When to use a different percentage",
        p: [
          "In high-priced markets where fixed costs are a smaller share of the price, investors sometimes accept 75% or even 80%. In slow markets or with expensive financing they may need 65% or less.",
          "Use the rule to decide quickly whether a deal is worth analyzing, then confirm with a full cost calculation.",
        ],
      },
    ],
  },
  {
    slug: "closing-costs-explained",
    category: "real-estate",
    title: "Closing Costs Explained: What Home Buyers Pay and How to Lower It",
    description:
      "A plain-English breakdown of closing costs for home buyers: lender fees, title and escrow, prepaids, typical percentages and ways to reduce them.",
    published: "2026-11-09",
    calculator: "closing-costs-calculator",
    sections: [
      {
        h: "What closing costs are",
        p: [
          "Closing costs are the fees and prepaid items due when your home purchase finishes. They are separate from your down payment and typically total about 2% to 5% of the purchase price.",
        ],
      },
      {
        h: "The main categories",
        p: [
          "Lender charges include origination, underwriting and processing fees. Third-party costs include the appraisal, inspection, credit report and survey. Title and escrow cover the title search, title insurance and settlement. Government charges include recording fees and, in many places, transfer taxes.",
          "Prepaids are taxes and insurance collected in advance, along with prepaid interest. These fund your escrow account rather than being a pure fee.",
        ],
      },
      {
        h: "How to estimate your own",
        p: [
          "Once you apply for a mortgage, your lender must provide a Loan Estimate that lists expected costs. Compare estimates from several lenders, and ask the title company for a quote since you can often shop for it.",
        ],
      },
      {
        h: "Ways to lower them",
        p: [
          "Negotiate seller credits, compare lenders, ask for fee waivers, close near the end of the month to reduce prepaid interest, and avoid paying discount points if you may sell or refinance soon.",
        ],
      },
    ],
  },
  {
    slug: "how-to-calculate-noi",
    category: "real-estate",
    title: "How to Calculate Net Operating Income (NOI) for a Rental or Commercial Property",
    description:
      "Step-by-step guide to calculating NOI: which income and expenses to include, common mistakes, and how NOI drives cap rate and DSCR.",
    published: "2026-11-10",
    calculator: "commercial-noi-calculator",
    sections: [
      {
        h: "The NOI formula",
        p: [
          "NOI equals effective gross income minus operating expenses. Effective gross income is scheduled rent plus other income, less vacancy and credit losses.",
        ],
      },
      {
        h: "What counts as operating expenses",
        p: [
          "Include property taxes, insurance, utilities you pay, repairs and maintenance, management, and ongoing services like landscaping or snow removal.",
          "Leave out loan payments, depreciation, income taxes and major capital improvements. Those are important, but they are not part of operating performance.",
        ],
      },
      {
        h: "Common mistakes",
        p: [
          "Using the seller's pro forma instead of actual statements, ignoring vacancy, and leaving out management or repair reserves are the most frequent errors. They all make NOI look higher than it really is.",
          "Because value is often set by dividing NOI by a market cap rate, an overstated NOI can inflate a property's apparent value by a large amount.",
        ],
      },
      {
        h: "What NOI is used for",
        p: [
          "NOI feeds the cap rate (NOI divided by price) and the debt service coverage ratio (NOI divided by loan payments). Together they show how the property performs and how much a lender may be willing to finance.",
        ],
      },
    ],
  },
  {
    slug: "property-tax-explained",
    category: "real-estate",
    title: "Property Tax Explained: How It Is Calculated and How to Lower It",
    description:
      "How property tax works: assessed value, tax rates, exemptions, why bills rise, and practical ways to check or reduce what you owe.",
    published: "2026-11-11",
    calculator: "property-tax-calculator",
    sections: [
      {
        h: "How the bill is built",
        p: [
          "A local assessor estimates your property's value. Counties, cities, school districts and other bodies set rates, which combine into one tax rate. Taxable value multiplied by that rate gives the bill.",
        ],
      },
      {
        h: "Effective rate vs millage rate",
        p: [
          "Some places quote a millage rate, meaning dollars per $1,000 of assessed value. Because assessed value is often lower than market value, the effective rate (tax divided by market value) is a fairer way to compare locations.",
        ],
      },
      {
        h: "Why it changes",
        p: [
          "Bills rise when assessed values go up, when new levies pass, or when exemptions end. In some states a sale resets assessed value to the purchase price, so a new owner can pay much more than the previous one.",
        ],
      },
      {
        h: "Ways to check or lower it",
        p: [
          "Review your assessment for errors in square footage or condition, apply for exemptions such as homestead or senior relief, and appeal within your county's deadline if the value seems too high.",
        ],
      },
    ],
  },
  {
    slug: "hard-money-loans-explained",
    category: "real-estate",
    title: "Hard Money Loans Explained: Costs, Terms and When They Make Sense",
    description:
      "What hard money loans are, how rates and points work, how to calculate the true cost, and what to plan before using one for a flip or bridge.",
    published: "2026-11-12",
    calculator: "hard-money-loan-calculator",
    sections: [
      {
        h: "What a hard money loan is",
        p: [
          "A hard money loan is short-term financing secured by real estate and issued by private lenders or funds. Approval depends mostly on the property and the plan for it rather than on your income and credit history.",
        ],
      },
      {
        h: "How the costs work",
        p: [
          "Expect an interest rate well above bank mortgage rates, one to several points paid upfront, and extra fees for documents, appraisals and draw inspections. Because the term is short, upfront costs have a large impact on the effective annual cost.",
        ],
      },
      {
        h: "When it can make sense",
        p: [
          "Investors use hard money for quick purchases, renovations that banks will not finance and bridge situations. It works best when the numbers are strong enough to absorb the cost and there is a reliable exit by sale or refinance.",
        ],
      },
      {
        h: "Risks to plan for",
        p: [
          "Delays are expensive because interest keeps running, and a balloon payment is due at maturity. Build in extra time and money, and confirm extension terms before you sign.",
        ],
      },
    ],
  },
  {
    slug: "refinance-break-even-explained",
    category: "real-estate",
    title: "Should You Refinance? Understanding the Break-Even Point",
    description:
      "How to decide whether refinancing your mortgage is worth it: break-even months, term resets, closing costs and the cases where it does not pay.",
    published: "2026-11-13",
    calculator: "refinance-calculator",
    sections: [
      {
        h: "The break-even calculation",
        p: [
          "Divide your refinance closing costs by your monthly savings. The result is the number of months until you have recovered the costs. If you will keep the loan longer than that, refinancing may be worth it.",
        ],
      },
      {
        h: "Do not ignore the loan term",
        p: [
          "Refinancing from 25 years remaining into a new 30-year loan lowers the payment partly by stretching the debt. That can raise lifetime interest even with a lower rate. Compare total cost, not only the payment.",
        ],
      },
      {
        h: "No-cost refinances",
        p: [
          "Some lenders offer to cover closing costs in exchange for a higher rate. This can make sense if you expect to move or refinance again soon, but compare it with paying the costs.",
        ],
      },
      {
        h: "When refinancing does not help",
        p: [
          "If you plan to sell soon, the savings may not recover the costs. If the rate drop is small, the break-even may be many years away.",
        ],
      },
    ],
  },
];

export const GUIDES: Guide[] = [...REAL_ESTATE_GUIDES, ...CONSTRUCTION_GUIDES, ...FINANCE_GUIDES, ...AUTO_GUIDES, ...BUSINESS_GUIDES];

/** Built-in guides store sections; the admin and public pages work with markdown. */
export function guideToMarkdown(g: Pick<Guide, "sections">): string {
  return g.sections.map((s) => `## ${s.h}\n\n${s.p.join("\n\n")}`).join("\n\n");
}

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
