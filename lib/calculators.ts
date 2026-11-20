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
      "Deciding whether to buy a home or keep renting is one of the biggest financial choices most people make. The monthly mortgage payment is only part of the picture. Owners also pay property tax, insurance, maintenance and, when they sell, agent fees and closing costs. Renters avoid those costs, and if they invest the money they would have spent on a down payment and on the gap between owning and renting, that money can grow.",
      "This calculator models both paths month by month. It tracks the owner's home equity after selling costs and the renter's investment portfolio, then shows which side has more net worth after the number of years you plan to stay. It also reports the break-even year, the first year in which buying overtakes renting, or says clearly when it is not reached in your time frame.",
      "The result depends heavily on how long you stay. Upfront costs such as closing fees and selling fees are large compared with a few years of equity growth, so short stays usually favor renting, while long stays give ownership time to build equity. Rent growth, home appreciation and the return on invested savings matter too, which is why the calculator lets you change every one of them.",
    ],
    steps: [
      "Enter the home price, down payment, mortgage rate and loan term.",
      "Add ownership costs: property tax, insurance, maintenance, buying closing costs and selling costs.",
      "Enter your current rent and the yearly rent increase you expect.",
      "Set the home appreciation rate and the investment return a renter could earn on the money saved.",
      "Choose how many years you expect to stay, then read the verdict, the chart and the year-by-year table.",
    ],
    formula: [
      "Monthly cost to own = mortgage payment + (property tax + insurance + maintenance) ÷ 12",
      "Buyer net worth = home value × (1 − selling cost %) − remaining loan balance",
      "Renter net worth = down payment and buying closing costs invested, plus every month the owner's cost exceeds rent, all invested at your chosen return",
      "Break-even year = first year in which buyer net worth is at least renter net worth",
    ],
    example: [
      "Step 1: Take a $450,000 home with 20% down. The down payment is $90,000, the loan is $360,000, and the 6.5% 30-year mortgage costs about $2,275 a month in principal and interest.",
      "Step 2: Add ownership costs. Property tax at 1.1% is $4,950 a year ($412.50 a month), insurance is $1,800 a year ($150 a month) and maintenance at 1% of value is $4,500 a year ($375 a month). Total monthly cost to own in year one is about $3,213, compared with $2,400 in rent.",
      "Step 3: Price the renter's savings. The renter keeps the $90,000 down payment and the $13,500 of buying closing costs (3% of the price), invested at 6%, for $103,500 at the start. Each month the owner spends $813 more than the renter pays in rent, and the renter invests that gap too.",
      "Step 4: Read the result after 10 years, with 3% yearly appreciation and 3% rent increases. The owner's net worth after 6% selling costs is about $246,725. The renter's portfolio is about $287,225. Renting is ahead by $40,500, and the break-even year is not reached in this 10-year window. Extending the stay or changing the appreciation rate shows when the lines might cross.",
    ],
    tips: [
      "Buying tends to win when you stay many years, because upfront and selling costs are spread across more years of equity growth.",
      "High mortgage rates and a low rent-to-price ratio favor renting. Low rates, fast rent increases and strong local price growth favor buying.",
      "Be honest about maintenance. Older homes often cost more than 1% of value each year, and a roof or furnace can cost a year's savings at once.",
      "Test a pessimistic case with zero appreciation to see how much of the result depends on price growth rather than on the costs of ownership.",
      "The renter's return assumes the saved money is invested every month. If you would spend the difference, the renter's position is much weaker.",
      "This calculator does not model income tax deductions for mortgage interest or property tax, which matter only for households that itemize.",
    ],
    faqs: [
      {
        q: "Is it better to buy or rent a home?",
        a: "Neither is always better. Buying usually pays off when you stay many years, can afford a sizeable down payment and the price is reasonable compared with rent in your area. Renting often wins for short stays, high prices, or when you can invest the savings well. Use this calculator with your own numbers rather than a rule of thumb.",
      },
      {
        q: "What is the break-even point when buying vs renting?",
        a: "It is the first year in which the owner's net worth (home equity after selling costs) is at least as large as the renter's investment portfolio. Before that year renting has been the cheaper path overall. If the break-even year is not reached within your time frame, renting was ahead for the whole period in these assumptions.",
      },
      {
        q: "Does this calculator include tax deductions?",
        a: "No. It does not model mortgage interest or property tax deductions, because many households take the standard deduction. Including deductions would make buying look somewhat better for households that itemize, so consult a tax professional if you do.",
      },
      {
        q: "What investment return should I assume for the renter?",
        a: "A long-run balanced stock and bond portfolio has historically returned roughly 5% to 7% a year before inflation. Use a lower number if the savings would sit in cash, and a higher number only if you accept the risk of large short-term losses.",
      },
      {
        q: "Is a house a good investment?",
        a: "A home gives you housing, forced savings through loan payments and possible appreciation, but it also carries ongoing costs and concentrates your wealth in one asset. Compare it with the alternatives here instead of assuming it always beats renting.",
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
      "A rental property can look attractive on a listing site and still lose money once taxes, insurance, repairs, vacancy and the mortgage are counted. Sellers and agents often quote the rent and leave out the costs, so the best test is to build the full annual income statement yourself before making an offer.",
      "This rental property ROI calculator turns the purchase price, down payment, loan and expected rent into the figures investors and lenders actually use: net operating income, cap rate, monthly cash flow, cash-on-cash return on the money you put in, the debt service coverage ratio and the break-even occupancy. It also shows the gross rent multiplier and the 1% rule as quick screens.",
      "Use the numbers to test the deal rather than to admire it. Small changes in rent, vacancy or the interest rate move cash flow a great deal when the down payment is small, because the loan payment is fixed and every dollar of lost rent comes straight out of the cash flow.",
    ],
    steps: [
      "Enter the purchase price, the down payment percentage and the closing costs.",
      "Enter the loan rate and term, and the expected monthly rent.",
      "Set a realistic vacancy rate, and add property tax, insurance, repairs and management fees.",
      "Review net operating income, cash flow, cash-on-cash return and DSCR, then change one input at a time to stress-test the deal.",
    ],
    formula: [
      "Net operating income (NOI) = collected rent − property tax − insurance − repairs − management",
      "Cap rate = NOI ÷ purchase price",
      "Cash flow = NOI − annual loan payments",
      "Cash-on-cash return = annual cash flow ÷ (down payment + closing costs)",
      "DSCR = NOI ÷ annual loan payments",
    ],
    example: [
      "Step 1: Price and cash. A $300,000 duplex with 25% down is a $75,000 down payment. Closing costs at 3% add $9,000, so the cash invested is $84,000. The $225,000 loan at 6.75% over 30 years costs about $17,512 a year.",
      "Step 2: Income. Rent of $2,500 a month is $30,000 a year. A 5% vacancy allowance removes $1,500, leaving $28,500 collected.",
      "Step 3: Operating costs. Property tax is $3,600, insurance $1,500, repairs 5% of gross rent ($1,500) and management 8% of collected rent ($2,280). Together that is $8,880, so NOI is $28,500 minus $8,880, or $19,620.",
      "Step 4: Returns. The cap rate is $19,620 ÷ $300,000, about 6.5%. Cash flow after the loan is $19,620 − $17,512 = $2,108 a year, which is $176 a month. Cash-on-cash return is $2,108 ÷ $84,000, about 2.5%. DSCR is $19,620 ÷ $17,512, about 1.12, which is below the 1.25 many lenders look for.",
      "Step 5: Stress test. The calculator shows a break-even occupancy of about 87%. If occupancy falls below that level, the property no longer covers its costs and loan payment. This is the number to check against local vacancy rates.",
    ],
    tips: [
      "Never assume zero vacancy or zero repairs. Even good tenants leave, and roofs, water heaters and appliances eventually need replacing.",
      "Lenders usually want a DSCR of at least 1.2 to 1.25 for investment property loans, so a deal near 1.1 may be hard to finance.",
      "Cap rate ignores financing, while cash-on-cash includes it. Look at both before you decide.",
      "Check rent assumptions against current local listings rather than the seller's pro forma, which is often optimistic.",
      "The 1% rule is a fast screen. Properties in high-tax or high-price areas often fail it but can still work with appreciation.",
      "Add a capital reserve for big future costs, and remember that this calculator is before income tax and depreciation.",
    ],
    faqs: [
      {
        q: "What is a good ROI on a rental property?",
        a: "Many investors target a cash-on-cash return of 8% or more and a cap rate at or above the local market average. What counts as good depends on risk, location, financing and your other options, so compare the deal with a simple index fund as well.",
      },
      {
        q: "What is the difference between cap rate and cash-on-cash return?",
        a: "Cap rate measures the property's income against its full price, as if you paid cash. Cash-on-cash return measures the cash flow you actually receive against the cash you invested, so it reflects your loan and down payment.",
      },
      {
        q: "What expenses should I include?",
        a: "Include property tax, insurance, a repair and maintenance reserve, management fees even if you manage the property yourself, vacancy, and any HOA dues or utilities you pay. Do not include loan principal in operating expenses, because principal is a way of building equity.",
      },
      {
        q: "What is the 1% rule?",
        a: "It is a rule of thumb that monthly rent should be at least 1% of the purchase price. For a $300,000 property that means $3,000 a month. It is a quick screen, not a substitute for running the full numbers with expenses and financing.",
      },
      {
        q: "What is debt service coverage ratio?",
        a: "DSCR is net operating income divided by annual loan payments. A ratio of 1.0 means the property exactly covers its loan. Lenders typically want 1.2 to 1.25 or more, which leaves a cushion for vacancy and repairs.",
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
      "Rental income is only one source of real estate returns. Over a multi-year hold you also build equity as the loan is paid down, and you benefit or suffer from changes in the property's value. A deal that barely covers its costs each month can still produce a strong total return once those other effects are added.",
      "This calculator projects each year's cash flow, the loan balance, and the property's value with appreciation. It estimates your equity after selling costs, adds the cash flow you collected, and reports total ROI and the annualized return on the cash you put in. A year-by-year table shows where the return comes from.",
      "Time matters. A 3% annual return looks modest, but compounded over ten years on a leveraged purchase it can add up to a large gain. The annualized figure lets you compare a property held for five years with one held for twelve, or with a stock index fund.",
    ],
    steps: [
      "Enter the purchase price, down payment, closing costs and loan terms.",
      "Enter starting monthly rent, the expected yearly rent growth and the share of rent that goes to operating costs.",
      "Set the appreciation rate, selling costs and the number of years you plan to hold the property.",
      "Read total ROI, annualized return and the year-by-year projection of cash flow, equity and total position.",
    ],
    formula: [
      "Equity at sale = sale price × (1 − selling cost %) − remaining loan balance",
      "Total position = equity at sale + cumulative cash flow",
      "Total ROI = (total position − cash invested) ÷ cash invested",
      "Annualized return = (total position ÷ cash invested)^(1 ÷ years) − 1",
    ],
    example: [
      "Step 1: Cash invested. A $350,000 property with 20% down ($70,000) and 3% closing costs ($10,500) requires $80,500 of your money. The $280,000 loan is at 6.75% over 30 years.",
      "Step 2: Early years. Rent starts at $2,600 a month, grows 3% a year, and 40% of rent goes to operating costs. After loan payments, year-one cash flow is about −$3,073, so you cover a small shortfall from your pocket. Cash flow turns positive in year seven, reaching about +$2,632 by year ten.",
      "Step 3: Equity. With 3% annual appreciation, the property is worth about $470,000 after ten years. After 6% selling costs and the remaining loan balance, equity at sale is about $203,306.",
      "Step 4: Total return. Adding the cumulative cash flow to equity gives a total position of about $199,981 against $80,500 invested. The profit is about $119,481, a total ROI of about 148%, or roughly 9.5% a year.",
      "Step 5: Read the source of the return. Most of the gain comes from loan paydown and appreciation rather than from cash flow. That makes the result sensitive to the appreciation rate, so test a flat market before relying on the number.",
    ],
    tips: [
      "Use conservative appreciation. Long-run national averages are often quoted around 3% to 4%, but local markets can be flat or fall for years.",
      "Leverage magnifies both gains and losses. Try a lower down payment to see how quickly a small price drop would wipe out your equity.",
      "Negative early cash flow is a real cost. Make sure you can fund it for the years it lasts.",
      "Selling costs are often 6% or more of the sale price once agent fees and transfer costs are included, so keep them in the model.",
      "This calculator does not model income tax, depreciation recapture, capital gains or large capital repairs. Those can change the outcome a lot.",
    ],
    faqs: [
      {
        q: "How do you calculate ROI on real estate?",
        a: "Add the property's cumulative cash flow to the equity you receive at sale, subtract the cash you originally invested, and divide by that cash. This calculator does it year by year so you can see how the return builds.",
      },
      {
        q: "Is annualized return better than total ROI?",
        a: "Annualized return lets you compare properties held for different lengths of time, and lets you compare real estate with other investments such as an index fund. Total ROI tells you the overall gain but not how fast it was earned.",
      },
      {
        q: "Does the calculator include taxes?",
        a: "No. Income tax, depreciation recapture and capital gains vary by situation, so consult a tax professional for after-tax results. Taxes can reduce the return considerably, especially when a property is sold.",
      },
      {
        q: "Why is my cash flow negative in the early years?",
        a: "Loan payments, taxes and insurance can exceed rent when you borrow heavily or buy at a high price. Rent growth and the falling loan balance usually improve cash flow over time, but the early shortfall is real money you must cover.",
      },
      {
        q: "What holding period should I use?",
        a: "Most investors test a range, such as five, seven and ten years, because the answer changes with timing. Short holds are more sensitive to selling costs, while longer holds give loan paydown and rent growth more time to work.",
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
      "The capitalization rate, or cap rate, is the annual net income a property produces as a percentage of its price. It ignores financing, which makes it useful for comparing properties of different sizes and prices, and for checking whether an asking price is in line with what similar buildings sell for.",
      "This calculator builds net operating income from the monthly rent, a vacancy allowance and annual operating expenses, excluding loan payments. It then shows the cap rate of the property at its asking price, and the value that same income would support at a market cap rate you choose.",
      "Cap rates are a snapshot of price against income, not a forecast. A low cap rate often means buyers expect strong growth or see low risk, while a high cap rate often means higher risk, weaker tenants or a weaker location. Treat the number as a starting point for a deeper look at the property.",
    ],
    steps: [
      "Enter the purchase price and the monthly gross rent.",
      "Set a vacancy allowance and the annual operating expenses, leaving out loan payments.",
      "Enter the cap rate that similar properties in the area are trading at.",
      "Compare the property's cap rate with the market rate, and the implied value with the asking price.",
    ],
    formula: [
      "Effective income = gross rent × 12 × (1 − vacancy)",
      "NOI = effective income − operating expenses",
      "Cap rate = NOI ÷ purchase price",
      "Implied value = NOI ÷ market cap rate",
      "Gross rent multiplier = purchase price ÷ annual gross rent",
    ],
    example: [
      "Step 1: Gross rent. A building priced at $800,000 collects $7,500 a month, which is $90,000 a year before any vacancy.",
      "Step 2: Vacancy. A 5% allowance removes $4,500 of rent, leaving $85,500 of effective income.",
      "Step 3: Operating costs. Taxes, insurance, repairs and management add up to $30,000 a year. Loan payments are not included, so NOI is $85,500 − $30,000 = $55,500.",
      "Step 4: Cap rate. $55,500 ÷ $800,000 is about 6.94%. The gross rent multiplier is $800,000 ÷ $90,000, about 8.9.",
      "Step 5: Compare with the market. If similar buildings trade at a 6% cap rate, the same income supports a value of $55,500 ÷ 0.06 = $925,000. That suggests the asking price is below the market value, assuming the rent and expense figures are reliable. The gap is a reason to verify the income, not a guarantee of a bargain.",
    ],
    tips: [
      "Cap rate is only as reliable as the NOI behind it. Check rents against leases and expenses against tax bills and utility statements.",
      "Higher cap rates usually mean higher risk or weaker locations, not simply a better deal. Compare like with like, such as similar property types in the same area.",
      "Exclude mortgage payments, depreciation and income taxes from operating expenses. Include a reserve for repairs and capital replacement.",
      "Vacancy allowances should reflect local conditions. A 5% allowance is common, but some markets need more and some need less.",
      "Cap rate tells you about one year of income. It does not capture rent growth, lease terms or the condition of the building.",
    ],
    faqs: [
      {
        q: "What is a good cap rate?",
        a: "It depends on the market, the property type and the risk. Many residential investors look for roughly 5% to 8%. Stable, high-demand areas often trade at lower cap rates, while riskier assets trade higher.",
      },
      {
        q: "Does cap rate include the mortgage?",
        a: "No. Cap rate assumes an all-cash purchase so that properties can be compared regardless of financing. Use cash-on-cash return to see the effect of a loan on your own return.",
      },
      {
        q: "How do I value a property with its cap rate?",
        a: "Divide net operating income by the market cap rate. That gives the price at which the property would match typical market returns for that type of asset and location.",
      },
      {
        q: "What is the gross rent multiplier?",
        a: "It is the price divided by annual gross rent, before expenses and vacancy. It is a quick comparison tool, and lower values generally mean a better price relative to rent.",
      },
      {
        q: "Why is cap rate different from ROI?",
        a: "Cap rate measures one year of income against price. ROI includes financing, appreciation and the full holding period, so it gives a broader view of what you earn.",
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
      "Cash-on-cash return answers a practical question: for every dollar of your own money in the deal, how many cents of cash flow do you get back each year? Because it counts only the cash you invested, it shows the effect of borrowing, which the cap rate hides.",
      "This calculator adds up your down payment, closing costs and any upfront repair budget to find the cash you invested. It subtracts the loan payments from the net rental income to get annual cash flow, then reports the return, the debt service coverage ratio, and a sensitivity table showing how the return changes if rent moves up or down.",
      "The sensitivity table is the most useful part for most investors. A small drop in rent can turn a modest positive return into a loss, and that risk is much larger when the down payment is small and the loan is large.",
    ],
    steps: [
      "Enter the price, the down payment percentage, the closing costs and any upfront repairs.",
      "Enter the loan rate and term.",
      "Enter monthly rent and the operating expenses as a percentage of rent.",
      "Read the cash-on-cash return and DSCR, then use the sensitivity table to test lower and higher rent.",
    ],
    formula: [
      "Cash invested = down payment + closing costs + upfront repairs",
      "Annual cash flow = rent × 12 × (1 − expense ratio) − annual loan payments",
      "Cash-on-cash return = annual cash flow ÷ cash invested",
      "DSCR = (rent × 12 × (1 − expense ratio)) ÷ annual loan payments",
    ],
    example: [
      "Step 1: Cash invested. A $275,000 rental with 25% down is $68,750. Closing costs at 3% are $8,250, and $5,000 of repairs brings the total cash invested to $82,000.",
      "Step 2: Loan payments. The loan is $206,250 at 7% over 30 years, which costs about $1,372 a month or $16,466 a year.",
      "Step 3: Net income. Rent of $2,400 a month is $28,800 a year. Operating expenses at 40% of rent take $11,520, leaving $17,280 of net income before the loan.",
      "Step 4: Cash flow and return. $17,280 − $16,466 = $814 a year, about $68 a month. Divided by $82,000, that is a return of about 1.0%. DSCR is $17,280 ÷ $16,466, about 1.05. The return is positive but far below the common 8% target.",
      "Step 5: Stress test. The sensitivity table shows that 10% less rent gives −$76 a month and a −1.1% return, while 10% more rent gives +$212 a month and about 3.1%. A rent change of only 10% moves the return by about 4 percentage points, which is why the calculator highlights rent as the key risk.",
    ],
    tips: [
      "Include every dollar of cash you put in, including repairs, closing costs and any reserve you hold, not just the down payment.",
      "An 8% to 12% cash-on-cash return is a common target, but risk and location matter as much as the number.",
      "A very high return on a tiny cash investment can hide large risk, such as a thin down payment or aggressive rent assumptions. Check DSCR too.",
      "Loan rates matter a lot. A one-point rate change can wipe out most of the cash flow on a leveraged purchase.",
      "Vacancy is not in the expense ratio here, so either include it in the rent you enter or raise the expense percentage.",
    ],
    faqs: [
      {
        q: "What is cash on cash return?",
        a: "It is annual pre-tax cash flow divided by the total cash you invested in the property. It focuses on the return on your own money rather than on the property's total value.",
      },
      {
        q: "What is a good cash on cash return?",
        a: "Many investors aim for 8% to 12%, though the right target depends on risk, market conditions and alternatives such as index funds or bonds. A return below your mortgage rate usually means the property is not adding cash flow.",
      },
      {
        q: "How is it different from ROI?",
        a: "Cash-on-cash return looks only at yearly cash flow on the cash you invested. Total ROI can also include appreciation and loan paydown over the whole holding period. Use the Real Estate ROI calculator for the broader view.",
      },
      {
        q: "Why does a small rent change matter so much?",
        a: "Loan payments are fixed, so every dollar of lost rent comes straight out of cash flow. The thinner your margin, the bigger the effect, which is why the sensitivity table is useful.",
      },
      {
        q: "Should I include a vacancy allowance?",
        a: "Yes. Either reduce the rent you enter by your expected vacancy or add the vacancy to your expense ratio. Leaving it out overstates the cash flow.",
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
      "House flipping margins are thinner than they look. Between the purchase, the rehab, loan interest and points, holding costs, and agent fees at sale, a deal that seems to leave $100,000 on paper can end up with a fraction of that. Time is the hidden cost: every extra month adds interest, taxes, insurance and utilities.",
      "This calculator adds every cost, subtracts it from the after-repair value (ARV), and shows your net profit, the return on the cash you actually put in, and the maximum offer implied by the common 70% rule. It also shows how the result changes if the project runs longer than planned.",
      "Most failed flips come from one of three things: an ARV that was too optimistic, a rehab that ran over budget, or a timeline that doubled. The calculator makes all three visible before you commit money, so you can test the deal against slower and more expensive scenarios.",
    ],
    steps: [
      "Enter the purchase price, the rehab budget and the ARV based on recent comparable sales.",
      "Set how many months you expect the project to take from closing to sale.",
      "Enter the loan terms: percent financed, interest rate and points. Use 0% financed for an all-cash flip.",
      "Enter buying closing costs, monthly holding costs and selling costs.",
      "Check the profit, the return and the 70% rule offer, then test a longer timeline or a higher rehab cost.",
    ],
    formula: [
      "Total cost = purchase + rehab + buying costs + loan interest + points + holding costs + selling costs",
      "Net profit = ARV − total cost",
      "Return on cash = net profit ÷ cash you invested",
      "70% rule maximum offer = ARV × 70% − rehab cost",
    ],
    example: [
      "Step 1: Set the deal. You buy at $200,000, spend $45,000 on rehab and expect an ARV of $330,000 after six months. The lender finances 80% of the purchase, which is $160,000, at 11% with 2 points.",
      "Step 2: Financing. Interest is $160,000 × 11% × 6/12 = $8,800, and the points are $3,200, so financing costs $12,000. Buying closing costs at 2% add $4,000.",
      "Step 3: Holding and selling. Holding costs of $1,200 a month for six months are $7,200, bringing holding and closing costs to $11,200. Selling costs at 7% of $330,000 are $23,100.",
      "Step 4: Profit and return. Total costs are $200,000 + $45,000 + $12,000 + $11,200 + $23,100 = $291,300. Profit is $330,000 − $291,300 = $38,700. Your cash is $40,000 down, $45,000 of rehab, $11,200 of holding and closing costs and $12,000 of financing costs, or $108,200, so the return is about 36%.",
      "Step 5: Timeline risk. Stretch the same project to nine months and holding costs rise to $10,800, interest and points to $16,400, and profit falls to about $30,700 on $116,200 of cash, a 26% return. The 70% rule suggests an offer of no more than $186,000 for this ARV and rehab.",
    ],
    tips: [
      "Be conservative with ARV. Use sold comparables within a mile and from the last six months, not listing prices or optimistic estimates.",
      "Add a contingency of 10% to 15% to the rehab budget. Hidden damage, permits and material price rises are normal.",
      "Every extra month adds interest, taxes, insurance and utilities. Test slower timelines before you commit to a loan with a short term.",
      "Hard money lenders often charge points and extension fees. Check what happens if the project runs late.",
      "The 70% rule is a screen, not a guarantee. In expensive markets investors may accept a higher percentage, and in weak markets a lower one.",
      "Profit from a flip is usually taxed as ordinary income in the US if held under a year, so the after-tax result is lower than this estimate.",
    ],
    faqs: [
      {
        q: "What is the 70% rule in house flipping?",
        a: "It says an investor should pay no more than 70% of the after-repair value minus the cost of repairs. For an ARV of $300,000 and $40,000 of repairs, the maximum offer is $170,000.",
      },
      {
        q: "How much profit should a flip make?",
        a: "Many investors look for at least $25,000 to $30,000 of profit or a 15% to 20% return on cash per project, because flips carry risk of delays, cost overruns and price drops.",
      },
      {
        q: "What costs do people forget when flipping?",
        a: "Loan points and interest, holding costs such as utilities and insurance, permits, dumpsters, staging and the seller's closing costs are commonly underestimated.",
      },
      {
        q: "Why does the timeline matter so much?",
        a: "Interest, holding costs and points keep running while the house sits. A three-month delay on a loan with monthly interest can cost as much as a bad negotiation.",
      },
      {
        q: "Does this include taxes on the profit?",
        a: "No. Flip profits are often taxed as ordinary income when held for a short time. Talk to a tax professional about your situation before you buy.",
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
      "Many first-time buyers save hard for the down payment and are surprised by closing costs on top of it. These are the fees and prepaid items due when the sale completes. They commonly run between 2% and 5% of the home price, and they are often paid in cash on closing day.",
      "This calculator breaks them into lender fees, title and escrow, appraisal and inspection, recording and transfer taxes, and prepaid property tax and insurance. It adds your down payment to show the total cash to close, which is the figure to plan for.",
      "The numbers are estimates. Your Loan Estimate and Closing Disclosure show the real charges, and the state, lender and loan type all change the result. Use this tool to plan early and to see which items you can negotiate or shop for.",
    ],
    steps: [
      "Enter the home price and your planned down payment percentage.",
      "Adjust lender fees, title and escrow, and recording and transfer percentages using your Loan Estimate.",
      "Add the appraisal and inspection costs.",
      "Enter annual property tax and insurance, and how many months of each your lender will collect upfront.",
      "Read the total closing costs and the cash you need at closing.",
    ],
    formula: [
      "Lender fees = loan amount × lender fee %",
      "Title and escrow = home price × title %",
      "Prepaids = (annual tax + annual insurance) ÷ 12 × prepaid months",
      "Cash to close = down payment + all closing costs",
    ],
    example: [
      "Step 1: Loan and down payment. A $400,000 home with 10% down needs a $40,000 down payment, leaving a $360,000 loan.",
      "Step 2: Lender and title. A 1% lender fee on the loan is $3,600. Title and escrow at 0.8% of the price is $3,200.",
      "Step 3: Third-party and government charges. The appraisal and inspection cost $1,000, and recording and transfer charges at 0.4% of the price are $1,600.",
      "Step 4: Prepaids. Annual property tax of $4,400 and insurance of $1,800 total $6,200. Six months of prepaids is $3,100, which funds your first tax and insurance bills.",
      "Step 5: Totals. Closing costs add up to $12,500, about 3.1% of the price. With the $40,000 down payment, you should plan to bring about $52,500 to closing.",
    ],
    tips: [
      "Your lender must give you a Loan Estimate within three business days of applying. Use its numbers for the most accurate figures.",
      "Transfer taxes and title insurance rates differ a lot by state, and some states charge large transfer taxes to buyers.",
      "You can sometimes negotiate seller credits, or ask for a lender credit in exchange for a slightly higher rate.",
      "Shop for title and settlement services. Compare the fees on the Loan Estimate for lender, title and escrow.",
      "Prepaid items are not extra expenses in the long run. They fund your first tax and insurance bills, so the cash comes back over the year.",
      "Keep a reserve after closing. Moving, repairs and furniture costs often arrive in the first few months.",
    ],
    faqs: [
      {
        q: "How much are closing costs on a house?",
        a: "Buyers typically pay about 2% to 5% of the purchase price. The exact amount depends on the state, lender, loan type, and whether you buy discount points.",
      },
      {
        q: "Are closing costs included in the down payment?",
        a: "No. The down payment goes toward the price of the home. Closing costs are paid separately, unless you negotiate seller credits or roll some costs into certain loans.",
      },
      {
        q: "Who pays closing costs, the buyer or the seller?",
        a: "Both pay some costs. Buyers usually pay lender, title and prepaid items. Sellers typically pay agent commissions and some transfer charges, depending on local custom and negotiation.",
      },
      {
        q: "Can I reduce my closing costs?",
        a: "Yes. Compare lenders, ask about fee waivers, shop for title and insurance, negotiate seller concessions, and avoid buying discount points if you may sell soon.",
      },
      {
        q: "What are prepaids at closing?",
        a: "Prepaids are advance payments for property tax and homeowners insurance, which the lender collects into an escrow account. They are part of your cash to close but fund future bills.",
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
      "Net operating income is the number that drives commercial property value and loan approval. It is the income a property produces after vacancy and operating expenses, but before the mortgage, depreciation and income taxes. Lenders and buyers use it to judge how much a building is worth and how much debt it can carry.",
      "This calculator builds a simple annual income statement from rent, other income and your expense lines. It reports NOI, the expense ratio, the cap rate on your purchase price, and the debt service coverage ratio that lenders review before approving a loan.",
      "Commercial numbers are only as good as their inputs. Sellers often show rent that is not fully collected and expenses that exclude real costs, so check each line against leases, bills and the operating history before you rely on the result.",
    ],
    steps: [
      "Enter the scheduled monthly rent and any other income, such as parking, laundry or signage.",
      "Set a vacancy and credit loss percentage.",
      "Enter annual property tax, insurance, utilities and maintenance, and a management percentage of income.",
      "Add the purchase price and loan terms to see the cap rate and debt coverage.",
    ],
    formula: [
      "Gross potential income = (rent + other income) × 12",
      "Effective gross income = gross potential income × (1 − vacancy)",
      "NOI = effective gross income − operating expenses",
      "Cap rate = NOI ÷ purchase price",
      "DSCR = NOI ÷ annual loan payments",
    ],
    example: [
      "Step 1: Income. Monthly rent of $24,000 plus $1,200 of other income is $25,200 a month, or $302,400 a year before vacancy.",
      "Step 2: Vacancy. A 7% vacancy and credit loss removes $21,168, leaving effective gross income of $281,232.",
      "Step 3: Expenses. Property tax is $28,000, insurance $9,000, utilities $12,000 and repairs $18,000. Management at 5% of effective income is $14,062. Total operating expenses are about $81,062, an expense ratio of about 29%.",
      "Step 4: NOI and cap rate. $281,232 − $81,062 = $200,170 of NOI. On a $2.8 million price, that is a cap rate of about 7.15%.",
      "Step 5: Debt coverage. With a 70% loan of $1.96 million at 6.75% over 25 years, annual loan payments are about $162,700. DSCR is $200,170 ÷ $162,700, about 1.23. That is just under the 1.25 many lenders want, so a lender might offer a smaller loan.",
    ],
    tips: [
      "Do not include mortgage payments, depreciation or income tax in operating expenses. Those are below the NOI line.",
      "Use the seller's operating statements, then verify them against tax bills, utility bills and the rent roll and leases.",
      "Include a repair and capital reserve, even if the seller does not. Roofs, parking lots and HVAC systems are large costs in commercial property.",
      "Compare the expense ratio with similar buildings. A very low ratio can mean costs are missing.",
      "Lenders may size the loan from DSCR rather than from value, so a small change in NOI can change how much you can borrow.",
    ],
    faqs: [
      {
        q: "What is NOI in real estate?",
        a: "Net operating income is a property's income after vacancy and operating expenses, but before debt service, depreciation and income taxes. It describes the building itself, rather than the financing.",
      },
      {
        q: "Is NOI the same as cash flow?",
        a: "No. Cash flow is what remains after paying the loan. NOI is calculated before loan payments, so it shows the value of the property independent of how it is financed.",
      },
      {
        q: "What is a good DSCR?",
        a: "Lenders often require 1.20 to 1.35 for commercial loans. A higher ratio gives more cushion above the loan payments if vacancy rises or costs increase.",
      },
      {
        q: "What is a normal expense ratio?",
        a: "It varies by property type. Many multifamily properties run between about 35% and 50% of effective income, while a triple-net lease shifts most costs to the tenant and has a much lower ratio.",
      },
      {
        q: "Why does vacancy matter so much?",
        a: "Vacancy reduces income while many costs stay fixed, so a few percentage points of extra vacancy can cut NOI noticeably and push DSCR below a lender's minimum.",
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
      "Property tax is one of the largest ongoing costs of owning a home, and it varies enormously by location. Effective rates range from well under 1% of value in some areas to above 2% in several high-tax places, which can mean thousands of dollars a year on two homes of the same price.",
      "This calculator multiplies the taxable value of a home by your local effective rate, subtracts any exemptions, and gives the annual and monthly bill. It then projects how the bill could change if the assessed value keeps rising, which is common in growing areas.",
      "The effective rate matters more than the headline millage rate. Local tax authorities set rates on assessed values that may not match market value, so the most reliable input is last year's tax bill divided by the home's market value. Tax bills can also include separate charges, such as special district levies and bond assessments, which are not always part of the headline rate. Add up every line on the bill before dividing by the value, so the calculation matches what you will actually pay.",
    ],
    steps: [
      "Enter the home's assessed or market value.",
      "Enter the effective tax rate from your county tax bill or assessor's website.",
      "Add any exemptions that reduce taxable value, such as a homestead exemption.",
      "Set how fast the assessed value is expected to rise and how many years to project.",
    ],
    formula: [
      "Taxable value = home value − exemptions",
      "Annual property tax = taxable value × effective tax rate",
      "Monthly property tax = annual tax ÷ 12",
      "Future annual tax = current tax × (1 + annual growth)^years",
    ],
    example: [
      "Step 1: Taxable value. A $400,000 home with a $0 exemption has a taxable value of $400,000.",
      "Step 2: Annual bill. At an effective rate of 1.1%, the bill is $4,400 a year, or $367 a month.",
      "Step 3: Growth. If assessed value rises 3% a year, the bill is $4,532 in year two, $4,952 in year five and about $5,741 by year ten. The total paid over the ten years is about $50,441.",
      "Step 4: Exemption. A $50,000 homestead exemption reduces taxable value to $350,000, which lowers the starting bill by $550 a year at a 1.1% rate.",
    ],
    tips: [
      "Use the effective rate (tax divided by market value), not the nominal millage rate, unless you convert it correctly.",
      "In some states a sale triggers a reassessment at the purchase price, so the previous owner's bill can understate yours.",
      "Check the exemptions you qualify for, such as homestead, senior or veteran exemptions, and appeal the assessment if it looks too high.",
      "Escrow accounts collect property tax monthly with your mortgage payment, so the bill still affects the total you pay each month.",
      "Special assessments for local projects are often billed separately and are not included in this estimate.",
    ],
    faqs: [
      {
        q: "How is property tax calculated?",
        a: "Local governments multiply the taxable value of a property by the combined rate set by counties, cities and school districts, after exemptions are subtracted.",
      },
      {
        q: "What is an effective property tax rate?",
        a: "It is the annual tax bill divided by the home's market value. It makes areas comparable even when assessment methods and tax rates differ.",
      },
      {
        q: "Can I lower my property tax?",
        a: "Often yes. Apply for any exemptions you qualify for, and appeal the assessment if you believe it exceeds market value, following your county's deadline.",
      },
      {
        q: "Why did my property tax go up?",
        a: "Common reasons are a higher assessed value, new voter-approved levies, the end of a temporary exemption, or a reassessment after a sale or major renovation.",
      },
      {
        q: "Is property tax deductible?",
        a: "In the US, property tax can be deducted on federal returns for those who itemize, subject to limits. Check the current rules with a tax professional.",
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
      "Hard money loans are short-term, asset-based loans often used by investors to buy and renovate properties. They can close quickly, based mostly on the value of the property rather than the borrower's income, but they cost more than a bank mortgage because lenders charge higher interest and upfront points.",
      "This calculator shows your interest-only monthly payment and adds up the interest, points and fees over the term you choose. It converts the total into an effective annual cost, so you can compare the loan with other financing, and it shows loan-to-value at payoff.",
      "The effective annual cost is the number to watch. Points and fees are paid once, so a short loan has a much higher annual cost than a long one, even if the interest rate is the same.",
    ],
    steps: [
      "Enter the loan amount, the interest rate and the points.",
      "Set the loan term in months and add any other lender or closing fees.",
      "Enter the expected value of the property at payoff to see the loan-to-value ratio.",
      "Review the monthly payment, the total cost, and how the cost changes if the project runs longer.",
    ],
    formula: [
      "Monthly interest = loan × annual rate ÷ 12",
      "Total cost = monthly interest × months + points + fees",
      "Effective annual cost = total cost ÷ loan ÷ (months ÷ 12)",
      "Loan to value = loan ÷ value at payoff",
    ],
    example: [
      "Step 1: Monthly interest. A $250,000 loan at 11.5% costs $250,000 × 11.5% ÷ 12 = $2,396 a month.",
      "Step 2: Twelve-month total. Interest for 12 months is $28,750. Points at 2% add $5,000, and other fees add $2,500, for a total cost of $36,250.",
      "Step 3: Effective annual cost. $36,250 ÷ $250,000 is about 14.5% for one year, which is the figure to compare with other financing.",
      "Step 4: Shorter loan. The same points and fees on a three-month term give a total cost of about $14,688, or about 23.5% a year. A six-month term costs about $21,875, or about 17.5% a year.",
      "Step 5: Risk. A project that takes 18 months instead of 12 adds about $14,000 of interest. Loan-to-value at payoff is $250,000 ÷ $400,000, about 63%, which gives the lender a cushion.",
    ],
    tips: [
      "Points are paid upfront and weigh more heavily on short loans. Compare the effective annual cost, not just the rate.",
      "Ask about extension fees, minimum interest periods, draw inspection charges and prepayment penalties.",
      "Have a clear exit plan, such as a sale or a refinance into long-term financing, and know how long it will take.",
      "Compare several lenders. Rates and points differ meaningfully, and some lenders are more flexible about extensions.",
      "Hard money loans are often secured by the property, so a missed payment can lead to foreclosure.",
    ],
    faqs: [
      {
        q: "What are typical hard money loan rates?",
        a: "Rates commonly run roughly 9% to 15% with 1 to 4 points, depending on the lender, the borrower's experience and the deal. Check current offers from several lenders.",
      },
      {
        q: "Are hard money loans interest-only?",
        a: "Usually. You pay interest each month and repay the principal as a balloon payment when you sell or refinance.",
      },
      {
        q: "How is a hard money loan different from a bank loan?",
        a: "It is based mostly on the property's value rather than the borrower's income, closes faster, has a short term and costs more. It is designed for investors with a clear exit, not for a long-term home loan.",
      },
      {
        q: "Why is the effective annual cost higher than the rate?",
        a: "Points and fees are charged once, on top of the interest. When spread over a year, they add to the annual rate, and the effect is largest on the shortest loans.",
      },
      {
        q: "What happens if the project runs late?",
        a: "Interest keeps accruing and extension fees may apply. Use the calculator to test a longer term before you borrow, so you know the cost of a delay.",
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
      "Refinancing replaces your mortgage with a new one. It can lower the monthly payment, shorten the loan or change its type, but it comes with closing costs. Whether it pays off depends on how much you save each month and how long you keep the new loan.",
      "This calculator compares your current loan with a new one. It reports the new payment, the monthly savings, the number of months needed to recover the closing costs, and the net savings over the number of years you expect to keep the loan.",
      "A common mistake is to focus on the monthly payment alone. A new 30-year loan lowers the payment but restarts the clock, so the calculator also shows the year-by-year net savings. That lets you see whether the lower payment is a real saving or simply more interest over time.",
    ],
    steps: [
      "Enter your current loan balance, interest rate and years remaining.",
      "Enter the new rate, the new term and the refinance closing costs.",
      "Set how long you expect to keep the loan.",
      "Compare monthly savings, break-even months and net savings over time.",
    ],
    formula: [
      "Monthly savings = current payment − new payment",
      "Break-even months = closing costs ÷ monthly savings",
      "Net savings after N years = cumulative payments saved − closing costs",
    ],
    example: [
      "Step 1: Starting point. Your balance is $320,000 at 7.25% with 27 years left on the loan.",
      "Step 2: New loan. You refinance into a new 30-year loan at 6.25% and pay $6,000 in closing costs. The new loan restarts the term, which is why the payment falls.",
      "Step 3: Monthly saving. The payment falls by about $283 a month, which is the figure used for the break-even calculation.",
      "Step 4: Break-even. $6,000 ÷ $283 means you recover the closing costs after about 22 months. Year one is a net loss of about $2,824, and by the end of year two the savings are ahead, at about $295.",
      "Step 5: Seven-year result. If you keep the loan for seven years, the net savings are about $14,783. Restarting the 30-year clock adds years of interest, so compare the total interest with a 20-year option before you decide.",
    ],
    tips: [
      "Restarting a 30-year clock lowers the payment but can raise lifetime interest. Compare the total cost, not only the monthly payment.",
      "If you may move before the break-even point, refinancing may not pay off. Check how long you realistically plan to stay.",
      "A no-closing-cost loan usually has a higher rate. Compare the total cost of that option with paying the costs upfront.",
      "Get written Loan Estimates from several lenders so the fees are comparable.",
      "Cash-out refinances add to your balance and change the break-even math, so run them separately.",
    ],
    faqs: [
      {
        q: "When does refinancing make sense?",
        a: "When you will keep the loan well past the break-even point and the savings or a shorter term meet your goals. A rate drop of about one percentage point is a common rule of thumb, but run your own numbers.",
      },
      {
        q: "How long does it take to break even on a refinance?",
        a: "Divide the closing costs by the monthly savings. With $6,000 of costs and about $283 of monthly savings, break-even takes about 22 months.",
      },
      {
        q: "Does refinancing hurt my credit score?",
        a: "A lender's credit check can cause a small, temporary dip, and a new account changes your credit mix. The effect is usually modest and fades over time.",
      },
      {
        q: "Should I choose a shorter term?",
        a: "A shorter term has a higher payment but saves interest and builds equity faster. Choose based on a payment you can comfortably afford for the whole term.",
      },
      {
        q: "Are closing costs included in the loan?",
        a: "They can be paid upfront or rolled into the loan. Rolling them in lowers the cash you need but increases the balance and the total interest.",
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
      "Home equity is the part of your home's value that you own: its market value minus what you still owe. Lenders let you borrow against it with a home equity loan or a line of credit (HELOC), but they limit total borrowing to a share of the home's value, which leaves a cushion for falling prices.",
      "This calculator shows your equity and current loan-to-value, estimates how much you could borrow under a combined loan-to-value limit, and estimates the monthly payment on the amount you choose, both as interest-only and as a fully repaying loan.",
      "Borrowing against the home puts the home at risk if payments are missed. The best use of equity is usually a purpose that adds value, such as repairs, and the calculator helps you test how much debt the home can carry before the payment becomes a strain. Compare the cost of borrowing against equity with other options, such as a personal loan or a cash-out refinance, because fees, rates and terms differ. Before you borrow, work out the monthly payment on your full household budget, including a possible rate rise on a variable-rate line.",
    ],
    steps: [
      "Enter the home's current value and your mortgage balance.",
      "Set the maximum combined loan-to-value your lender allows.",
      "Enter the amount you want to borrow, the rate and the repayment period.",
      "Check the available amount, the payment and how much equity remains.",
    ],
    formula: [
      "Equity = home value − mortgage balance",
      "Maximum total borrowing = home value × combined LTV limit",
      "Available to borrow = maximum total borrowing − mortgage balance",
      "Payment = standard amortized payment on the amount borrowed",
    ],
    example: [
      "Step 1: Equity. A $500,000 home with a $290,000 mortgage has $210,000 of equity, and a current loan-to-value of 58%.",
      "Step 2: Borrowing limit. At an 85% combined limit, total debt on the home can reach $425,000. Subtract the $290,000 mortgage and about $135,000 is available.",
      "Step 3: Payment. Borrowing $60,000 at 8.5% costs $425 a month if you pay only interest. Repaying it over 15 years costs about $591 a month.",
      "Step 4: Position after borrowing. Total debt becomes $350,000, or 70% of the home's value, and $150,000 of equity remains.",
    ],
    tips: [
      "Your home is collateral. Missed payments can put it at risk, so only borrow what you can repay comfortably.",
      "Home values are estimates until an appraisal. Be conservative, because a price drop can reduce your borrowing power.",
      "Many HELOCs have variable rates, so payments can rise. Test a higher rate before you borrow.",
      "Interest-only payments keep the balance unchanged, so you must plan for the repayment period when it starts.",
      "Interest on home equity debt may be tax deductible in some cases if the money is used to buy, build or improve the home. Check current rules.",
    ],
    faqs: [
      {
        q: "How do I calculate home equity?",
        a: "Subtract everything you owe on the home from its current market value. If it is worth $500,000 and you owe $290,000, your equity is $210,000.",
      },
      {
        q: "What is a combined loan-to-value (CLTV) ratio?",
        a: "It is all loans secured by the home divided by the home's value. Lenders often cap it around 80% to 90%, depending on credit score and the property.",
      },
      {
        q: "What is the difference between a HELOC and a home equity loan?",
        a: "A home equity loan gives a lump sum with fixed payments. A HELOC is a revolving line of credit, usually with a variable rate, a draw period and then a repayment period.",
      },
      {
        q: "Does borrowing against equity reduce my equity?",
        a: "Yes. Every dollar you borrow lowers the equity in the home by the same amount, though regular repayments gradually restore it.",
      },
      {
        q: "How much equity should I keep?",
        a: "Many homeowners keep at least 15% to 20% of the home's value as equity, which leaves room for falling prices and unexpected costs.",
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
      "A lower rate is not always the cheaper loan. Lenders often offer a lower rate in exchange for upfront points or fees, so the best choice depends on how long you will keep the mortgage. Comparing monthly payments alone can point you to the wrong loan.",
      "This calculator compares two offers on the same loan amount. It shows each monthly payment and the cumulative cost of interest plus fees year by year, and it highlights the year in which the cheaper loan starts to win.",
      "Use the Loan Estimate documents from each lender so the fees are comparable. Points, lender fees and credits all change the upfront cost, and the calculator treats them as part of the total cost.",
    ],
    steps: [
      "Enter the loan amount and how many years you expect to keep the loan.",
      "Enter the rate, term, points and fees for Loan A.",
      "Enter the same details for Loan B.",
      "Read which loan is cheaper at your time horizon and where the cost lines cross.",
    ],
    formula: [
      "Monthly payment = standard amortized payment on the loan amount",
      "Cost to year N = payments made to year N − principal repaid to year N + upfront points and fees",
      "Break-even year = first year in which the lower-rate loan's cumulative cost is lower",
    ],
    example: [
      "Step 1: Loan A. A $360,000 loan at 6.5% over 30 years costs $2,275 a month, with $2,000 of fees.",
      "Step 2: Loan B. The same loan at 6.0% costs $2,158 a month, with $7,500 of fees. Its monthly saving is $117.",
      "Step 3: Break-even. Loan B costs $5,500 more upfront. The cumulative cost chart shows Loan B is still slightly more expensive after three years (about $86 more), and is cheaper from year four onward.",
      "Step 4: Eight-year result. Over eight years Loan A costs about $179,607 and Loan B about $170,685, so Loan B is cheaper by about $8,922. If you sold after three years, Loan A would be the better choice.",
    ],
    tips: [
      "Always include points, lender fees and any credits when comparing. A rate with a large credit can be cheaper than a lower rate with fees.",
      "Be realistic about how long you will keep the loan. Many people refinance or move within seven to ten years.",
      "Compare loans with the same term, or look at the cost and the payment together. A shorter term usually has a lower rate but a higher payment.",
      "Ask whether points can be deducted and whether they are refundable if you refinance soon.",
      "Rates change daily, so compare offers made on the same day.",
    ],
    faqs: [
      {
        q: "Should I pay points to get a lower rate?",
        a: "Only if you will keep the loan long enough to recover the upfront cost through lower interest. The comparison chart shows the break-even year for your numbers.",
      },
      {
        q: "How do I compare two mortgages?",
        a: "Compare the monthly payment, total interest and fees over the period you will actually hold the loan, not just the interest rate.",
      },
      {
        q: "Does a 15-year or 30-year loan cost less?",
        a: "A 15-year loan usually has a lower rate and far less total interest, but a higher monthly payment. Enter each term to compare the cost and the payment.",
      },
      {
        q: "What is an APR?",
        a: "The annual percentage rate includes some fees in addition to the interest rate, so it is useful for comparison. It does not capture every choice, such as how long you keep the loan, so compare total cost as well.",
      },
      {
        q: "Can I change my mind after comparing?",
        a: "Yes. Rates and fees change, and lenders can change offers before you lock. Re-run the comparison with new numbers before you commit.",
      },
    ],
    related: ["refinance-calculator", "closing-costs-calculator", "buy-vs-rent-calculator"],
  },
];

export const CALCULATORS: CalculatorMeta[] = [...REAL_ESTATE, ...CONSTRUCTION_TOOLS, ...FINANCE_TOOLS, ...AUTO_TOOLS, ...BUSINESS_TOOLS];

export const bySlug = (slug: string) => CALCULATORS.find((c) => c.slug === slug);

/** Canonical URL path for a tool. */
export const toolPath = (c: Pick<CalculatorMeta, "category" | "slug">) => `/${c.category}/${c.slug}`;
