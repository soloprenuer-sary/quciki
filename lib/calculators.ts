import type { CategorySlug } from "./categories";
import { CONSTRUCTION_TOOLS } from "./content/construction-tools";
import { FINANCE_TOOLS } from "./content/finance-tools";
import { AUTO_TOOLS } from "./content/auto-tools";
import { BUSINESS_TOOLS } from "./content/business-tools";

export interface Faq {
  q: string;
  a: string;
}

export interface CalculatorMeta {
  slug: string;
  name: string;
  category: CategorySlug;
  /** Sub-group shown on the category hub page. */
  group: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  intro: string[];
  steps: string[];
  formula: string[];
  example: string[];
  tips: string[];
  faqs: Faq[];
  related: string[];
  guide?: string;
}

const REAL_ESTATE: CalculatorMeta[] = [
  {
    slug: "buy-vs-rent-calculator",
    name: "Buy vs Rent Calculator",
    category: "real-estate",
    group: "Buying",
    tagline: "Compare the true long-term cost of owning a home against renting and investing the difference.",
    metaTitle: "Buy vs Rent Calculator: Break-Even Year & Net Worth Comparison",
    metaDescription:
      "Free buy vs rent calculator. Compare mortgage, tax, upkeep and opportunity cost against rent to see your break-even year and net worth after 1 to 40 years.",
    keywords: ["buy vs rent calculator", "rent vs buy", "should I buy or rent", "break even buying a home"],
    intro: [
      "Deciding whether to buy a home or keep renting is one of the biggest financial choices most people make. The monthly mortgage payment is only part of the picture. Owners also pay property tax, insurance, maintenance and, eventually, selling costs, while renters keep their down payment free to invest.",
      "This calculator models both paths month by month. It tracks the owner's home equity and the renter's investment portfolio, then shows which side has more net worth after the number of years you plan to stay. It also finds the break-even year, the first year in which buying overtakes renting.",
    ],
    steps: [
      "Enter the home price, down payment, mortgage rate and loan term.",
      "Add ownership costs: property tax, insurance, maintenance, closing and selling costs.",
      "Enter your current rent and the rent increase you expect each year.",
      "Set the investment return a renter could earn on the money that would otherwise go into the house.",
      "Choose how many years you expect to stay and read the verdict, chart and table.",
    ],
    formula: [
      "Buyer net worth = home value × (1 − selling cost %) − remaining loan balance",
      "Renter net worth = (down payment + closing costs) invested, plus every month the owner's total cost exceeds rent, invested at your chosen return",
      "Monthly cost to own = mortgage payment + (property tax + insurance + maintenance) ÷ 12",
    ],
    example: [
      "Take a $450,000 home with 20% down, a 6.5% 30-year mortgage, 1.1% property tax, $1,800 insurance and 1% maintenance, compared with $2,400 monthly rent. With 3% annual appreciation and 6% investment returns, buying is still behind after five years because closing and selling costs are high, but it moves ahead later in the second decade as the loan is paid down and the home appreciates. Try different horizons to see how sensitive the result is to how long you stay.",
    ],
    tips: [
      "The longer you stay, the more buying tends to win, because upfront and selling costs are spread over more years.",
      "High mortgage rates and low rent-to-price ratios favor renting. Low rates and fast rent growth favor buying.",
      "Be honest about maintenance. Older homes often cost more than 1% of value each year.",
      "Test a pessimistic case with zero appreciation to see how much of the result depends on price growth.",
    ],
    faqs: [
      {
        q: "Is it better to buy or rent a home?",
        a: "Neither is always better. Buying usually pays off when you stay many years, can afford a sizeable down payment and buy at a reasonable price relative to rent. Renting often wins for short stays, high prices or when you can invest the savings well. This calculator compares both using your own numbers.",
      },
      {
        q: "What is the break-even point when buying vs renting?",
        a: "It is the first year in which the owner's net worth (home equity after selling costs) is at least as large as the renter's investment portfolio. Before that year renting has been the cheaper path overall.",
      },
      {
        q: "Does this calculator include tax deductions?",
        a: "No. It does not model mortgage interest or property tax deductions, because many households take the standard deduction. Including deductions would make buying look somewhat better for those who itemize.",
      },
      {
        q: "What investment return should I assume for the renter?",
        a: "A long-run balanced portfolio has historically returned roughly 5% to 7% a year before inflation adjustments. Use a lower number if you would keep the money in savings, and a higher one only if you are comfortable with the risk.",
      },
      {
        q: "Is a house a good investment?",
        a: "A home provides housing, forced savings through loan payments and potential appreciation, but it also carries costs and concentrated risk. Compare it against alternatives with this tool rather than assuming it always beats renting.",
      },
    ],
    related: ["rental-property-roi-calculator", "real-estate-roi-calculator", "cash-on-cash-return-calculator"],
    guide: "buy-vs-rent-which-is-better",
  },
  {
    slug: "rental-property-roi-calculator",
    name: "Rental Property ROI Calculator",
    category: "real-estate",
    group: "Investing",
    tagline: "Check cap rate, cash-on-cash return, cash flow and debt coverage before you buy a rental.",
    metaTitle: "Rental Property ROI Calculator: Cap Rate, Cash Flow & Cash-on-Cash",
    metaDescription:
      "Free rental property ROI calculator. Enter price, rent and expenses to get cap rate, cash-on-cash return, monthly cash flow, DSCR and break-even occupancy.",
    keywords: ["rental property calculator", "rental property roi", "rental cash flow calculator", "investment property calculator"],
    intro: [
      "A rental property can look attractive on listing sites and still lose money once taxes, insurance, repairs, vacancy and the mortgage are counted. This rental property ROI calculator turns the asking price and expected rent into the metrics investors and lenders actually use.",
      "You get the cap rate, the cash-on-cash return on the money you put in, monthly cash flow, the debt service coverage ratio and a breakdown of where each year's rent goes.",
    ],
    steps: [
      "Enter the purchase price, down payment, closing costs and loan terms.",
      "Enter expected monthly rent and a realistic vacancy rate.",
      "Add property tax, insurance, repairs and management costs.",
      "Review cash flow, cap rate, cash-on-cash return and DSCR, then adjust inputs to stress-test the deal.",
    ],
    formula: [
      "Net operating income (NOI) = collected rent − taxes − insurance − repairs − management",
      "Cap rate = NOI ÷ purchase price",
      "Cash flow = NOI − annual loan payments",
      "Cash-on-cash return = annual cash flow ÷ (down payment + closing costs)",
      "DSCR = NOI ÷ annual loan payments",
    ],
    example: [
      "A $300,000 duplex rents for $2,500 a month with 5% vacancy, $3,600 tax, $1,500 insurance, 5% repairs and 8% management. With 25% down at 6.75%, NOI is about $19,620 and the cap rate is about 6.5%. After loan payments, cash flow is only about $176 a month, a 2.5% cash-on-cash return on $84,000 invested, and the debt service coverage ratio is about 1.12, below the 1.25 many lenders look for. Raising rent by $200 a month or negotiating the price shows how quickly those numbers move.",
    ],
    tips: [
      "Never assume zero vacancy or zero repairs. Even good tenants leave and roofs wear out.",
      "Lenders typically want a DSCR of at least 1.2 to 1.25.",
      "Cap rate ignores financing, while cash-on-cash includes it. Look at both.",
      "Check rent assumptions against local listings rather than the seller's pro forma.",
    ],
    faqs: [
      {
        q: "What is a good ROI on a rental property?",
        a: "Many investors target a cash-on-cash return of 8% or more and a cap rate that matches or beats the local market. What is good for you depends on risk, location and your alternatives.",
      },
      {
        q: "What is the difference between cap rate and cash-on-cash return?",
        a: "Cap rate measures property income against the full price as if bought with cash. Cash-on-cash return measures your actual annual cash flow against the cash you invested, so it reflects your loan.",
      },
      {
        q: "What expenses should I include?",
        a: "Include property tax, insurance, a repair and maintenance reserve, management fees (even if you self-manage), vacancy, and any HOA or utilities you pay. Do not include loan principal in operating expenses.",
      },
      {
        q: "What is the 1% rule?",
        a: "A rule of thumb that says monthly rent should be at least 1% of the purchase price. It is a quick screen, not a substitute for running the full numbers.",
      },
    ],
    related: ["cap-rate-calculator", "cash-on-cash-return-calculator", "real-estate-roi-calculator"],
    guide: "how-to-calculate-rental-property-roi",
  },
  {
    slug: "real-estate-roi-calculator",
    name: "Real Estate ROI Calculator",
    category: "real-estate",
    group: "Investing",
    tagline: "See total return including cash flow, loan paydown and appreciation over your holding period.",
    metaTitle: "Real Estate ROI Calculator: Total Return with Appreciation",
    metaDescription:
      "Free real estate ROI calculator. Project cash flow, equity and appreciation over your holding period to see total ROI and annualized return on cash invested.",
    keywords: ["real estate roi calculator", "property investment return", "real estate investment calculator", "annualized return real estate"],
    intro: [
      "Rental income is only one source of real estate returns. Over a multi-year hold you also build equity as the loan is paid down and benefit, or suffer, from changes in the property's value. This calculator combines all three.",
      "It projects each year's cash flow, estimates your net equity after selling costs, and reports the total ROI and the annualized return on the cash you invested.",
    ],
    steps: [
      "Enter the purchase price, financing and closing costs.",
      "Enter starting rent, expected rent growth and an operating expense ratio.",
      "Set your expected appreciation, selling costs and how many years you will hold.",
      "Read total ROI, annualized return and the year-by-year projection.",
    ],
    formula: [
      "Total position = equity after selling costs + cumulative cash flow",
      "Total ROI = (total position − cash invested) ÷ cash invested",
      "Annualized return = (total position ÷ cash invested)^(1 ÷ years) − 1",
    ],
    example: [
      "Buying a $350,000 property with 20% down, 3% closing costs, $2,600 rent growing 3% a year and 40% operating costs, then selling after ten years at 3% appreciation and 6% selling costs, turns about $80,500 of cash invested into roughly $200,000 of equity after selling costs plus accumulated cash flow. That is a total ROI of about 148%, or roughly 9.5% a year. Cash flow is slightly negative in the early years, so the return comes mostly from loan paydown and appreciation. Raising or lowering appreciation shows how much of the result depends on market growth.",
    ],
    tips: [
      "Use conservative appreciation. Long-run national averages are often quoted around 3% to 4%, but local markets vary.",
      "Leverage magnifies both gains and losses. Try a lower down payment to see the effect.",
      "This calculator does not model income tax, depreciation or major capital repairs.",
    ],
    faqs: [
      {
        q: "How do you calculate ROI on real estate?",
        a: "Add the property's cumulative cash flow to the equity you would receive at sale, subtract the cash you originally invested, and divide by that cash. This tool does it for you year by year.",
      },
      {
        q: "Is annualized return better than total ROI?",
        a: "Annualized return lets you compare properties held for different lengths of time and compare real estate with other investments such as index funds.",
      },
      {
        q: "Does the calculator include taxes?",
        a: "No. Income tax, depreciation recapture and capital gains vary by situation, so consult a tax professional for after-tax results.",
      },
    ],
    related: ["rental-property-roi-calculator", "cash-on-cash-return-calculator", "buy-vs-rent-calculator"],
  },
  {
    slug: "cap-rate-calculator",
    name: "Cap Rate Calculator",
    category: "real-estate",
    group: "Investing",
    tagline: "Calculate capitalization rate and estimate what a property is worth at the market cap rate.",
    metaTitle: "Cap Rate Calculator: Capitalization Rate & Property Value",
    metaDescription:
      "Free cap rate calculator. Enter price, rent, vacancy and operating expenses to get NOI, capitalization rate, gross rent multiplier and value at the market cap rate.",
    keywords: ["cap rate calculator", "capitalization rate", "noi calculator", "how to calculate cap rate"],
    intro: [
      "The capitalization rate, or cap rate, is the annual income a property produces as a percentage of its price, ignoring financing. It lets you compare properties of different sizes and check whether an asking price is in line with the market.",
      "This calculator works out net operating income from rent, vacancy and expenses, then shows the cap rate and the value implied by a market cap rate you choose.",
    ],
    steps: [
      "Enter the purchase price and monthly gross rent.",
      "Set a vacancy allowance and annual operating expenses (without loan payments).",
      "Enter the cap rate typical for similar properties in the area.",
      "Compare the property's cap rate with the market, and the implied value with the asking price.",
    ],
    formula: [
      "NOI = gross rent × (1 − vacancy) − operating expenses",
      "Cap rate = NOI ÷ purchase price",
      "Implied value = NOI ÷ market cap rate",
    ],
    example: [
      "A building priced at $800,000 collects $7,500 a month, has 5% vacancy and $30,000 of annual operating costs. After vacancy, rent is $85,500 a year, so NOI is $55,500 and the cap rate is about 6.94%. If similar buildings trade at a 6% cap rate, the implied value is $925,000, which suggests the asking price is attractive, assuming the income figures are reliable.",
    ],
    tips: [
      "Cap rate is only as reliable as the NOI behind it. Verify rents and expenses with documents.",
      "Higher cap rates usually mean higher risk or weaker locations, not simply a better deal.",
      "Exclude mortgage payments and depreciation from operating expenses.",
    ],
    faqs: [
      {
        q: "What is a good cap rate?",
        a: "It depends on the market, property type and risk. Many residential investors look for roughly 5% to 8%, while stable, high-demand areas may trade lower and riskier assets higher.",
      },
      {
        q: "Does cap rate include the mortgage?",
        a: "No. Cap rate assumes an all-cash purchase so properties can be compared regardless of financing. Use cash-on-cash return to see the effect of a loan.",
      },
      {
        q: "How do I value a property with its cap rate?",
        a: "Divide net operating income by the market cap rate. That gives the price at which the property would match typical market returns.",
      },
    ],
    related: ["rental-property-roi-calculator", "cash-on-cash-return-calculator", "real-estate-roi-calculator"],
    guide: "cap-rate-explained",
  },
  {
    slug: "cash-on-cash-return-calculator",
    name: "Cash on Cash Return Calculator",
    category: "real-estate",
    group: "Investing",
    tagline: "Measure annual cash flow against the cash you actually invest, then stress-test rent changes.",
    metaTitle: "Cash on Cash Return Calculator for Rental Property",
    metaDescription:
      "Free cash on cash return calculator. See annual cash flow versus total cash invested, DSCR, and how rent changes of ±10% affect your return.",
    keywords: ["cash on cash return calculator", "cash on cash return", "coc return real estate", "rental investment return"],
    intro: [
      "Cash-on-cash return answers a practical question: for every dollar of your own money in the deal, how many dollars of cash flow do you get back each year? Because it counts only the cash you invested, it shows the effect of leverage that cap rate hides.",
      "This calculator adds up your down payment, closing costs and upfront repairs, subtracts loan payments from net income, and shows a rent sensitivity table so you can see how fragile the return is.",
    ],
    steps: [
      "Enter the price, down payment, closing costs and any upfront repair budget.",
      "Enter the loan rate and term.",
      "Enter monthly rent and operating expenses as a percentage of rent.",
      "Read the return and use the sensitivity table to test lower or higher rent.",
    ],
    formula: [
      "Annual cash flow = rent × 12 × (1 − expense ratio) − annual loan payments",
      "Cash invested = down payment + closing costs + upfront repairs",
      "Cash-on-cash return = annual cash flow ÷ cash invested",
    ],
    example: [
      "On a $275,000 rental with 25% down, 3% closing, $5,000 of repairs, a 7% loan and $2,400 rent with 40% expenses, you invest about $82,000. Annual cash flow after the mortgage is only about $814, a return of roughly 1.0% with a debt service coverage ratio of 1.05, well under the common 8% target. The sensitivity table shows how fragile that is: 5% lower rent turns cash flow slightly negative, while 10% higher rent lifts the return to about 3.1%.",
    ],
    tips: [
      "Include every dollar of upfront cash, including repairs, not just the down payment.",
      "An 8% to 12% cash-on-cash return is a common target, but risk and location matter as much as the number.",
      "A very high return from a tiny cash investment can hide large risk. Look at DSCR too.",
    ],
    faqs: [
      {
        q: "What is cash on cash return?",
        a: "It is annual pre-tax cash flow divided by the total cash you invested in the property. It focuses on the return on your own money rather than the property's total value.",
      },
      {
        q: "What is a good cash on cash return?",
        a: "Many investors aim for 8% to 12%, though the right target depends on risk, market and alternatives such as index funds.",
      },
      {
        q: "How is it different from ROI?",
        a: "Cash-on-cash return looks only at yearly cash flow. ROI can also include appreciation and loan paydown over the whole holding period. Use the Real Estate ROI calculator for the broader view.",
      },
    ],
    related: ["rental-property-roi-calculator", "cap-rate-calculator", "real-estate-roi-calculator"],
  },
  {
    slug: "fix-and-flip-calculator",
    name: "Fix and Flip Calculator",
    category: "real-estate",
    group: "Investing",
    tagline: "Estimate profit, return on cash and the 70% rule maximum offer before you buy a flip.",
    metaTitle: "Fix and Flip Calculator: Profit, ROI & 70% Rule Offer",
    metaDescription:
      "Free fix and flip calculator. Enter purchase price, rehab budget, ARV and financing to see net profit, return on cash invested and the 70% rule maximum offer.",
    keywords: ["fix and flip calculator", "house flipping calculator", "70 percent rule calculator", "flip profit calculator"],
    intro: [
      "House flipping margins are thinner than they look. Between the purchase, the rehab, loan interest and points, holding costs, and agent fees at sale, a deal that seems to leave $100,000 on paper can end up with a fraction of that.",
      "This calculator adds every cost, subtracts it from the after-repair value (ARV), and shows your net profit, the return on the cash you actually put in, and the maximum offer implied by the common 70% rule.",
    ],
    steps: [
      "Enter the purchase price, rehab budget and the ARV based on recent comparable sales.",
      "Set how many months you expect the project to take from closing to sale.",
      "Add your loan terms: percent financed, interest rate and points. Use 0% financed for an all-cash flip.",
      "Enter buying closing costs, monthly holding costs and selling costs.",
      "Check the profit, return and 70% rule offer, then test a longer timeline or a higher rehab cost.",
    ],
    formula: [
      "Total cost = purchase + rehab + buying costs + loan interest + points + holding costs + selling costs",
      "Net profit = ARV − total cost",
      "Return on cash = net profit ÷ cash you invested",
      "70% rule maximum offer = ARV × 70% − rehab cost",
    ],
    example: [
      "Suppose you buy at $200,000, spend $45,000 on rehab, and expect an ARV of $330,000 after six months. With an 80% hard-money loan at 11% plus 2 points, $1,200 monthly holding costs and 7% selling costs, the net profit is about $38,700 on $108,200 of your own cash (a 36% return), far smaller than the $85,000 gap between ARV and purchase plus rehab. Extending the project from six to nine months cuts profit to about $30,700, which is why timelines matter so much.",
    ],
    tips: [
      "Be conservative with ARV. Use sold comps within a mile and the last six months, not listing prices.",
      "Add a contingency of 10% to 15% to the rehab budget. Surprises are normal.",
      "Every extra month adds interest, taxes, insurance and utilities. Test slower timelines.",
      "The 70% rule is a screen, not a guarantee. In expensive markets investors may accept a higher percentage.",
    ],
    faqs: [
      {
        q: "What is the 70% rule in house flipping?",
        a: "It says an investor should pay no more than 70% of the after-repair value minus the cost of repairs. For an ARV of $300,000 and $40,000 of repairs, the maximum offer is $170,000.",
      },
      {
        q: "How much profit should a flip make?",
        a: "Many investors look for at least $25,000 to $30,000 or a 15% to 20% return on cash per project, because flips carry risk of delays, cost overruns and price drops.",
      },
      {
        q: "What costs do people forget when flipping?",
        a: "Loan points and interest, holding costs like utilities and insurance, permits, dumpsters, staging, and seller closing costs are commonly underestimated.",
      },
      {
        q: "Does this include taxes on the profit?",
        a: "No. Flip profits are often taxed as ordinary income. Talk to a tax professional about your situation.",
      },
    ],
    related: ["real-estate-roi-calculator", "closing-costs-calculator", "cash-on-cash-return-calculator"],
    guide: "fix-and-flip-70-percent-rule",
  },
  {
    slug: "closing-costs-calculator",
    name: "Closing Costs Calculator",
    category: "real-estate",
    group: "Buying",
    tagline: "Estimate lender fees, title charges and prepaid items to see how much cash you need at closing.",
    metaTitle: "Closing Costs Calculator: Estimate Cash Needed to Close",
    metaDescription:
      "Free closing costs calculator for home buyers. Estimate lender fees, title and escrow, inspection, transfer taxes and prepaids to see total cash to close.",
    keywords: ["closing costs calculator", "home buying closing costs", "cash to close calculator", "how much are closing costs"],
    intro: [
      "Many first-time buyers save for the down payment and are surprised by closing costs on top of it. These are the fees and prepaid items due when the sale completes, and they commonly run between 2% and 5% of the home price.",
      "This calculator breaks them into lender fees, title and escrow, appraisal and inspection, recording and transfer taxes, and prepaid property tax and insurance, then adds your down payment to show the total cash to close.",
    ],
    steps: [
      "Enter the home price and your planned down payment percentage.",
      "Adjust lender fees, title and escrow, and transfer tax percentages using your loan estimate.",
      "Add the appraisal and inspection cost.",
      "Enter annual tax and insurance, and how many months your lender will collect upfront.",
      "Read the total closing costs and the cash needed at closing.",
    ],
    formula: [
      "Lender fees = loan amount × lender fee %",
      "Title and escrow = price × title %",
      "Prepaids = (annual tax + annual insurance) ÷ 12 × prepaid months",
      "Cash to close = down payment + all closing costs",
    ],
    example: [
      "On a $400,000 home with 10% down, a $360,000 loan, 1% lender fees, 0.8% title and escrow, $1,000 for appraisal and inspection, 0.4% recording and six months of tax and insurance prepaids, closing costs come to roughly $12,000 to $13,000, about 3% of the price. Add the $40,000 down payment and the total cash needed is well above the down payment alone.",
    ],
    tips: [
      "Your lender must give you a Loan Estimate within three business days of applying. Use its numbers for the best accuracy.",
      "Transfer taxes and title insurance rates differ a lot by state, so check local figures.",
      "You can sometimes negotiate seller credits or shop for title services to lower costs.",
      "Prepaid items are not extra expenses in the long run. They fund your first tax and insurance bills.",
    ],
    faqs: [
      {
        q: "How much are closing costs on a house?",
        a: "Buyers typically pay about 2% to 5% of the purchase price, though the exact amount depends on the state, lender, loan type and whether you buy points.",
      },
      {
        q: "Are closing costs included in the down payment?",
        a: "No. The down payment goes toward the price of the home. Closing costs are paid separately, unless you negotiate seller credits or roll some costs into certain loans.",
      },
      {
        q: "Who pays closing costs, the buyer or seller?",
        a: "Both pay some costs. Buyers usually pay lender, title and prepaid items. Sellers typically pay agent commissions and transfer-related charges, depending on local custom and negotiation.",
      },
      {
        q: "Can I reduce my closing costs?",
        a: "Yes. Compare lenders, ask about fee waivers, shop for title and insurance, negotiate seller concessions, and avoid buying discount points if you may sell soon.",
      },
    ],
    related: ["buy-vs-rent-calculator", "rental-property-roi-calculator", "fix-and-flip-calculator"],
    guide: "closing-costs-explained",
  },
  {
    slug: "commercial-noi-calculator",
    name: "Commercial NOI Calculator",
    category: "real-estate",
    group: "Investing",
    tagline: "Build a simple income statement for an income property and see NOI, cap rate and debt coverage.",
    metaTitle: "Commercial NOI Calculator: Net Operating Income & DSCR",
    metaDescription:
      "Free commercial NOI calculator. Enter rent, vacancy and operating expenses to calculate net operating income, expense ratio, cap rate and debt service coverage.",
    keywords: ["noi calculator", "net operating income calculator", "commercial real estate calculator", "dscr calculator"],
    intro: [
      "Net operating income is the number that drives commercial property value and loan approval. It is the income a property produces after vacancy and operating expenses, before the mortgage, depreciation and income taxes.",
      "This calculator builds a simple annual income statement from rent, other income and your expense lines. It reports NOI, the expense ratio, the cap rate on your purchase price, and the debt service coverage ratio lenders look at.",
    ],
    steps: [
      "Enter scheduled monthly rent and any other income such as parking or laundry.",
      "Set a vacancy and credit loss percentage.",
      "Enter annual tax, insurance, utilities and maintenance, and a management percentage.",
      "Add the purchase price and loan terms to see cap rate and debt coverage.",
    ],
    formula: [
      "Effective gross income = (rent + other income) × 12 × (1 − vacancy)",
      "NOI = effective gross income − operating expenses",
      "Cap rate = NOI ÷ purchase price",
      "DSCR = NOI ÷ annual loan payments",
    ],
    example: [
      "A building collecting $24,000 monthly rent and $1,200 of other income with 7% vacancy, $67,000 of fixed annual costs and 5% management produces an NOI of about $200,000. On a $2.8 million price that is a cap rate near 7.2%. With a 70% loan at 6.75% over 25 years, the debt coverage ratio is about 1.23, just under the 1.25 many lenders want, so a lender might ask for a lower loan amount.",
    ],
    tips: [
      "Do not include mortgage payments, depreciation or income tax in operating expenses.",
      "Use actual operating statements from the seller and verify them against bills and leases.",
      "Include a repair and capital reserve even if the seller does not.",
      "Compare the expense ratio with similar buildings. A very low ratio can mean missing costs.",
    ],
    faqs: [
      {
        q: "What is NOI in real estate?",
        a: "Net operating income is a property's income after vacancy and operating expenses, but before debt service, depreciation and income taxes.",
      },
      {
        q: "Is NOI the same as cash flow?",
        a: "No. Cash flow is what remains after paying the loan. NOI is calculated before loan payments, so it describes the property rather than the financing.",
      },
      {
        q: "What is a good DSCR?",
        a: "Lenders often require 1.20 to 1.35 for commercial loans. A higher ratio means more cushion above the loan payments.",
      },
      {
        q: "What is a normal expense ratio?",
        a: "It varies by property type, but many multifamily properties run between about 35% and 50% of effective income.",
      },
    ],
    related: ["cap-rate-calculator", "rental-property-roi-calculator", "cash-on-cash-return-calculator"],
    guide: "how-to-calculate-noi",
  },
  {
    slug: "property-tax-calculator",
    name: "Property Tax Calculator",
    category: "real-estate",
    group: "Buying",
    tagline: "Estimate your annual and monthly property tax and see how it could grow over the years.",
    metaTitle: "Property Tax Calculator: Annual & Monthly Estimate With Forecast",
    metaDescription:
      "Free property tax calculator. Enter home value, tax rate and exemptions to estimate annual and monthly property tax and project it over 1 to 30 years.",
    keywords: ["property tax calculator", "real estate tax calculator", "annual property tax estimate", "home property tax"],
    intro: [
      "Property tax is one of the largest ongoing costs of owning a home, and it varies enormously by location. Effective rates range from roughly 0.3% of value in a few low-tax areas to above 2% in several high-tax states, which can mean thousands of dollars a year on the same priced home.",
      "This calculator multiplies taxable value by your local effective rate, subtracts exemptions, and projects how the bill could change as assessed value rises.",
    ],
    steps: [
      "Enter the home's assessed or market value.",
      "Enter the effective tax rate from your county tax bill or assessor website.",
      "Add any exemptions that reduce taxable value, such as a homestead exemption.",
      "Set how fast assessed value is expected to rise and how many years to project.",
    ],
    formula: [
      "Taxable value = home value − exemptions",
      "Annual property tax = taxable value × effective tax rate",
      "Monthly property tax = annual tax ÷ 12",
    ],
    example: [
      "A $400,000 home with a 1.1% effective rate and no exemptions owes about $4,400 a year, or $367 a month. If assessed value rises 3% annually, the bill passes $5,700 by year ten. A $50,000 homestead exemption would lower the starting bill by $550 a year.",
    ],
    tips: [
      "Use the effective rate (tax divided by market value), not the nominal millage rate, unless you convert it properly.",
      "New buyers are sometimes reassessed at the purchase price, so the previous owner's bill can understate yours.",
      "Check for exemptions and appeal options. Assessments can contain errors.",
      "Escrow accounts collect property tax monthly with your mortgage payment.",
    ],
    faqs: [
      {
        q: "How is property tax calculated?",
        a: "Local governments multiply the taxable value of the property by the combined tax rate set by counties, cities and school districts, after any exemptions are removed.",
      },
      {
        q: "What is an effective property tax rate?",
        a: "It is the annual tax bill divided by the home's market value. It makes areas comparable even when assessment methods and millage rates differ.",
      },
      {
        q: "Can I lower my property tax?",
        a: "Often yes. Apply for exemptions you qualify for and appeal the assessment if you believe it exceeds market value, following your county's deadline.",
      },
      {
        q: "Why did my property tax go up?",
        a: "Common reasons are a higher assessed value, new voter-approved levies, the end of a temporary exemption or a reassessment after a sale or renovation.",
      },
    ],
    related: ["buy-vs-rent-calculator", "closing-costs-calculator", "mortgage-comparison-calculator"],
    guide: "property-tax-explained",
  },
  {
    slug: "hard-money-loan-calculator",
    name: "Hard Money Loan Calculator",
    category: "real-estate",
    group: "Investing",
    tagline: "See the true cost of a short-term hard money loan, including points, interest and fees.",
    metaTitle: "Hard Money Loan Calculator: Interest, Points & True Cost",
    metaDescription:
      "Free hard money loan calculator. Enter loan amount, rate, points and term to see monthly interest, total cost and the effective annual cost of the loan.",
    keywords: ["hard money loan calculator", "hard money interest calculator", "bridge loan calculator", "fix and flip loan cost"],
    intro: [
      "Hard money loans are short-term, asset-based loans often used by investors to buy and renovate properties. They close quickly but cost more than a bank mortgage, because lenders charge higher interest and upfront points.",
      "This calculator shows your interest-only monthly payment and totals interest, points and fees. It also converts the total into an effective annual cost so you can compare it with other financing.",
    ],
    steps: [
      "Enter the loan amount, interest rate and points.",
      "Set the loan term in months and add other lender or closing fees.",
      "Enter the expected value of the property at payoff to see loan to value.",
      "Review the monthly payment, total cost and cost if the project runs long.",
    ],
    formula: [
      "Monthly interest = loan × annual rate ÷ 12",
      "Total cost = monthly interest × months + points + fees",
      "Effective annual cost = total cost ÷ loan ÷ years",
    ],
    example: [
      "A $250,000 loan at 11.5% with two points, $2,500 of fees and a 12-month term costs about $2,396 in monthly interest, or $28,750 over the year, plus $5,000 in points and $2,500 in fees. The effective annual cost is about 14.5%. If the project slips to 18 months the total rises further, which is why timelines matter.",
    ],
    tips: [
      "Points are paid upfront and are a larger share of the cost on short loans.",
      "Ask about extension fees, minimum interest periods and draw inspection charges.",
      "Have a clear exit plan: a sale or a refinance into long-term financing.",
      "Compare several lenders. Rates and points differ meaningfully.",
    ],
    faqs: [
      {
        q: "What are typical hard money loan rates?",
        a: "Rates commonly run roughly 9% to 15% with 1 to 4 points, depending on the lender, the borrower's experience and the deal. Check current offers.",
      },
      {
        q: "Are hard money loans interest-only?",
        a: "Usually. You pay interest each month and repay the principal as a balloon payment when you sell or refinance.",
      },
      {
        q: "How is a hard money loan different from a bank loan?",
        a: "It is based mostly on the property's value rather than the borrower's income, closes faster, has a short term and costs more.",
      },
    ],
    related: ["fix-and-flip-calculator", "refinance-calculator", "real-estate-roi-calculator"],
    guide: "hard-money-loans-explained",
  },
  {
    slug: "refinance-calculator",
    name: "Refinance Calculator",
    category: "real-estate",
    group: "Buying",
    tagline: "Find your monthly savings, break-even point and net savings from refinancing your mortgage.",
    metaTitle: "Refinance Calculator: Break-Even Point & Monthly Savings",
    metaDescription:
      "Free mortgage refinance calculator. Compare your current loan with a new one to see monthly savings, break-even months and net savings after closing costs.",
    keywords: ["refinance calculator", "mortgage refinance break even", "should I refinance", "refinance savings calculator"],
    intro: [
      "Refinancing can lower your payment, shorten your loan or change its type, but it comes with closing costs. Whether it pays off depends on how much you save each month and how long you keep the new loan.",
      "This calculator compares your current loan with a new one. It reports the new payment, the break-even point and the net savings over the time you expect to keep the loan, including the effect of restarting the loan term.",
    ],
    steps: [
      "Enter your current balance, interest rate and years remaining.",
      "Enter the new rate, term and refinance closing costs.",
      "Set how long you expect to keep the loan.",
      "Compare monthly savings, break-even months and net savings over time.",
    ],
    formula: [
      "Monthly savings = current payment − new payment",
      "Break-even months = closing costs ÷ monthly savings",
      "Net savings = (old payments + old balance) − (new payments + new balance + closing costs)",
    ],
    example: [
      "Refinancing a $320,000 balance from 7.25% with 27 years left into a 30-year loan at 6.25% with $6,000 of costs lowers the payment by several hundred dollars a month and breaks even in under two years. Net savings after seven years are positive, though extending the term adds interest later. Try a 20-year term to see the trade-off.",
    ],
    tips: [
      "Restarting a 30-year clock lowers the payment but can raise lifetime interest. Compare terms.",
      "If you may move before the break-even point, refinancing may not pay off.",
      "A no-closing-cost loan usually has a higher rate. Compare it with paying costs.",
      "Get written Loan Estimates from several lenders.",
    ],
    faqs: [
      {
        q: "When does refinancing make sense?",
        a: "When you will keep the loan well past the break-even point and the savings, or a shorter term, meet your goals. A rate drop of about one percentage point is a common rule of thumb, but run your own numbers.",
      },
      {
        q: "How long does it take to break even on a refinance?",
        a: "Divide the closing costs by the monthly savings. With $6,000 of costs and $300 monthly savings, break-even takes about 20 months.",
      },
      {
        q: "Does refinancing hurt my credit score?",
        a: "A lender's credit check can cause a small, temporary dip, and a new account changes your credit mix. The effect is usually modest.",
      },
      {
        q: "Should I choose a shorter term?",
        a: "A shorter term has a higher payment but saves interest and builds equity faster. Choose based on what payment you can comfortably afford.",
      },
    ],
    related: ["mortgage-comparison-calculator", "home-equity-calculator", "closing-costs-calculator"],
    guide: "refinance-break-even-explained",
  },
  {
    slug: "home-equity-calculator",
    name: "Home Equity Calculator",
    category: "real-estate",
    group: "Buying",
    tagline: "Work out your home equity, how much you can borrow and what a HELOC would cost per month.",
    metaTitle: "Home Equity Calculator: How Much Can You Borrow?",
    metaDescription:
      "Free home equity calculator. Enter home value and mortgage balance to see equity, loan-to-value, available borrowing and estimated HELOC or home equity loan payments.",
    keywords: ["home equity calculator", "heloc calculator", "how much equity do i have", "home equity loan calculator"],
    intro: [
      "Home equity is the part of your home's value that you own: its market value minus what you still owe. Lenders let you borrow against it with a home equity loan or a HELOC, but they limit total borrowing to a share of the home's value.",
      "This calculator shows your equity and current loan-to-value, estimates how much you could borrow under a combined loan-to-value limit, and estimates the payment on the amount you choose.",
    ],
    steps: [
      "Enter your home's current value and your mortgage balance.",
      "Set the maximum combined loan-to-value your lender allows.",
      "Enter how much you want to borrow, the rate and the repayment period.",
      "Check the available amount, payment and how much equity remains.",
    ],
    formula: [
      "Equity = home value − mortgage balance",
      "Maximum borrowing = home value × combined LTV limit − mortgage balance",
      "Payment = standard amortized payment on the amount borrowed",
    ],
    example: [
      "A $500,000 home with a $290,000 mortgage has $210,000 of equity. At an 85% combined limit, lenders would allow total debt up to $425,000, so about $135,000 is available. Borrowing $60,000 at 8.5% over 15 years costs roughly $591 a month, leaving substantial equity in the home.",
    ],
    tips: [
      "Your home is collateral. Missed payments can put it at risk.",
      "Home values are estimates until an appraisal. Be conservative.",
      "Many HELOCs have variable rates, so payments can change.",
      "Borrow for purposes that build value, such as repairs, and keep an emergency cushion.",
    ],
    faqs: [
      {
        q: "How do I calculate home equity?",
        a: "Subtract everything you owe on the home from its current market value. If it is worth $500,000 and you owe $290,000, your equity is $210,000.",
      },
      {
        q: "What is a combined loan-to-value (CLTV) ratio?",
        a: "It is all loans secured by the home divided by the home's value. Lenders often cap it around 80% to 90%.",
      },
      {
        q: "What is the difference between a HELOC and a home equity loan?",
        a: "A home equity loan gives a lump sum with fixed payments. A HELOC is a revolving line of credit, usually with a variable rate and a draw period followed by repayment.",
      },
    ],
    related: ["refinance-calculator", "mortgage-comparison-calculator", "real-estate-roi-calculator"],
  },
  {
    slug: "mortgage-comparison-calculator",
    name: "Mortgage Comparison Calculator",
    category: "real-estate",
    group: "Buying",
    tagline: "Compare two mortgage offers side by side, including points and fees, over the time you will keep the loan.",
    metaTitle: "Mortgage Comparison Calculator: Compare Two Loans Side by Side",
    metaDescription:
      "Free mortgage comparison calculator. Compare two loans by rate, term, points and fees to see monthly payments and the total borrowing cost over the years you keep it.",
    keywords: ["mortgage comparison calculator", "compare mortgage rates", "points vs rate calculator", "which mortgage is cheaper"],
    intro: [
      "A lower rate is not always the cheaper loan. Lenders often offer lower rates in exchange for upfront points or fees, so the best choice depends on how long you will keep the mortgage.",
      "This calculator compares two offers on the same loan amount. It shows each monthly payment and the cumulative cost of interest plus fees year by year, so you can see when the higher upfront cost starts to pay off.",
    ],
    steps: [
      "Enter the loan amount and how many years you expect to keep the loan.",
      "Enter the rate, term and points and fees for Loan A.",
      "Enter the same details for Loan B.",
      "Read which loan is cheaper at your time horizon and where the lines cross.",
    ],
    formula: [
      "Payment = standard amortized monthly payment",
      "Borrowing cost = payments made − principal repaid + upfront points and fees",
    ],
    example: [
      "Loan A at 6.5% with $2,000 of fees and Loan B at 6.0% with $7,500 of fees on a $360,000 loan: Loan B has a lower payment but costs $5,500 more upfront. The chart shows B overtaking A after several years, so if you expect to stay eight years B is cheaper, but if you sell in three, A wins.",
    ],
    tips: [
      "Always include points, lender fees and any credits when comparing.",
      "Be realistic about how long you will keep the loan. Many people refinance or move within 7 to 10 years.",
      "Compare loans with the same term, or look at the cost and the payment together.",
      "Use the Loan Estimate documents so fees are comparable.",
    ],
    faqs: [
      {
        q: "Should I pay points to get a lower rate?",
        a: "Only if you will keep the loan long enough to recover the upfront cost through lower interest. The comparison chart shows the break-even year.",
      },
      {
        q: "How do I compare two mortgages?",
        a: "Compare monthly payment, total interest and fees over the period you will actually hold the loan, not just the interest rate.",
      },
      {
        q: "Does a 15-year or 30-year loan cost less?",
        a: "A 15-year loan usually has a lower rate and far less total interest, but a higher monthly payment. Enter each term to compare.",
      },
    ],
    related: ["refinance-calculator", "closing-costs-calculator", "buy-vs-rent-calculator"],
  },
];

export const CALCULATORS: CalculatorMeta[] = [...REAL_ESTATE, ...CONSTRUCTION_TOOLS, ...FINANCE_TOOLS, ...AUTO_TOOLS, ...BUSINESS_TOOLS];

export const bySlug = (slug: string) => CALCULATORS.find((c) => c.slug === slug);

/** Canonical URL path for a tool. */
export const toolPath = (c: Pick<CalculatorMeta, "category" | "slug">) => `/${c.category}/${c.slug}`;
