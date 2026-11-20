import type { CalculatorMeta } from "../calculators";

const NOTE =
  "Results are estimates for planning and education. They are not accounting, tax or legal advice. Check rates and rules with your accountant or local tax authority.";

export const BUSINESS_TOOLS: CalculatorMeta[] = [
  {
    slug: "markup-margin-calculator",
    name: "Markup and Margin Calculator",
    category: "business",
    group: "Pricing and Profit",
    tagline: "Convert between cost, price, markup and gross margin, and find the price for a target margin.",
    metaTitle: "Markup and Margin Calculator: Profit Margin & Pricing",
    metaDescription:
      "Free markup and margin calculator. Enter cost and selling price to get gross margin, markup and profit, plus the price you need for any target margin.",
    keywords: ["markup calculator", "profit margin calculator", "markup vs margin", "gross margin calculator"],
    intro: [
      "Markup and margin both describe profit, but they use different bases, and mixing them up is a common and costly pricing mistake. Markup is profit as a percentage of cost. Margin is profit as a percentage of the selling price. The same sale can show a 50% markup and only a 33% margin.",
      "This calculator shows both for the cost and price you enter, works out the gross profit at your expected sales volume, and lists the selling price you need to reach a target margin. Use it before you set prices, not after, because a small change in price can change the margin a great deal.",
      "Gross margin is only the first layer of profit. It does not include rent, wages, shipping you pay, marketing or card fees, so a healthy gross margin can still produce a loss once overheads are counted. Prices should also leave room for returns, damaged stock and promotions. A product that sells well at a 40% margin can still lose money if a tenth of units are returned for a full refund, so build a small allowance into the cost.",
    ],
    steps: [
      "Enter the cost to you of each unit.",
      "Enter the price you sell it for.",
      "Enter the number of units you expect to sell.",
      "Use the table to see the price needed for different target margins.",
    ],
    formula: [
      "Profit = selling price − cost",
      "Margin = profit ÷ selling price",
      "Markup = profit ÷ cost",
      "Price for a target margin = cost ÷ (1 − target margin)",
    ],
    example: [
      "Step 1: Profit per unit. An item costing $60 and selling for $100 earns $40.",
      "Step 2: Margin. $40 ÷ $100 is a 40% margin, the share of each sale kept as gross profit.",
      "Step 3: Markup. $40 ÷ $60 is a 66.7% markup, the profit measured against cost.",
      "Step 4: Volume. Selling 200 units at $40 profit each gives $8,000 of gross profit before overheads.",
      "Step 5: Target price. For a 50% margin on a $60 cost, the price must be $60 ÷ (1 − 0.5) = $120.",
    ],
    tips: [
      "A 50% markup is not a 50% margin. A 50% markup gives a 33.3% margin, so check which one a supplier or customer is quoting.",
      "Gross margin ignores overhead. Make sure it covers rent, salaries, shipping, marketing and card fees.",
      "Review prices regularly as costs change, and do not let a supplier price rise pass through unnoticed.",
      "Discounts reduce margin faster than most people expect. A 20% discount on a 40% margin leaves only a 25% margin.",
      NOTE,
    ],
    faqs: [
      {
        q: "What is the difference between markup and margin?",
        a: "Markup is profit divided by cost. Margin is profit divided by selling price. For the same sale, the markup percentage is always higher than the margin percentage.",
      },
      {
        q: "How do I calculate a selling price from a margin?",
        a: "Divide your cost by one minus the margin. For a $60 cost and a 40% margin, the price is $60 ÷ 0.60 = $100.",
      },
      {
        q: "What is a good profit margin?",
        a: "It varies by industry. Retail often works with gross margins of 20% to 50%, while software can be far higher. Compare with your sector and your overheads.",
      },
      {
        q: "How does a discount affect margin?",
        a: "A discount comes straight out of the price, so it removes profit dollar for dollar. Work out the margin at the discounted price before offering it.",
      },
      {
        q: "Should I price by markup or by margin?",
        a: "Margin is better for judging profitability against revenue, while markup is common when you apply a set percentage to cost. Use margin when you want a clear target for the business.",
      },
    ],
    related: ["break-even-calculator", "sales-tax-calculator", "freelance-hourly-rate-calculator"],
    guide: "markup-vs-margin-explained",
  },
  {
    slug: "break-even-calculator",
    name: "Break-Even Calculator",
    category: "business",
    group: "Pricing and Profit",
    tagline: "Find how many units you must sell to cover costs, and how many to reach a profit target.",
    metaTitle: "Break-Even Calculator: Break-Even Units & Revenue",
    metaDescription:
      "Free break-even calculator. Enter fixed costs, price and variable cost per unit to find break-even units and sales, and the volume needed for a target profit.",
    keywords: ["break even calculator", "break even point", "break even analysis", "contribution margin calculator"],
    intro: [
      "The break-even point is the sales volume at which total revenue equals total costs. Below it you lose money, above it you make a profit. It is one of the first numbers to know before launching or pricing a product, because it shows how much you must sell just to stand still.",
      "This calculator divides your fixed costs by the contribution each unit makes after its variable costs. It shows the units and sales needed to break even, the volume needed for a profit target, and a chart of profit at different volumes.",
      "Fixed and variable costs are where most mistakes happen. Fixed costs include the things you pay whether or not you sell, such as rent, insurance, software and loan repayments. Variable costs rise with each sale, such as materials, packaging and shipping.",
    ],
    steps: [
      "Enter your fixed costs for the period, for example per month.",
      "Enter the selling price and the variable cost of each unit.",
      "Enter the profit you want to earn in the same period.",
      "Read the break-even volume and study the chart.",
    ],
    formula: [
      "Contribution per unit = selling price − variable cost per unit",
      "Break-even units = fixed costs ÷ contribution per unit",
      "Break-even sales = break-even units × selling price",
      "Units for a profit target = (fixed costs + target profit) ÷ contribution per unit",
    ],
    example: [
      "Step 1: Contribution. A $45 price and $18 of variable cost leaves $27 per unit toward fixed costs.",
      "Step 2: Break-even units. $12,000 of monthly fixed costs ÷ $27 is about 444 units, which rounds up to 445.",
      "Step 3: Break-even sales. 445 units at $45 is about $20,000 of revenue a month.",
      "Step 4: Profit target. To earn $3,000 a month on top of covering costs, you need ($12,000 + $3,000) ÷ $27, which is about 556 units.",
      "Step 5: Use. Each extra unit above 445 adds $27 of profit, so the table and chart show how quickly profit grows once you pass the break-even point.",
    ],
    tips: [
      "Include every fixed cost, such as rent, wages, insurance, software and loan payments, or the break-even point will be too low.",
      "Raising the price or cutting the variable cost lowers the break-even point quickly, often more than a small increase in sales would.",
      "Check that the break-even volume is realistic for your market. A break-even point larger than your likely sales means the plan needs changing.",
      "Revisit the numbers when costs change, especially when a supplier raises prices.",
      NOTE,
    ],
    faqs: [
      {
        q: "How do you calculate the break-even point?",
        a: "Divide fixed costs by the contribution margin per unit, which is the price minus the variable cost per unit.",
      },
      {
        q: "What are fixed and variable costs?",
        a: "Fixed costs stay the same regardless of sales, such as rent. Variable costs rise with each unit sold, such as materials and shipping.",
      },
      {
        q: "What if the break-even point is too high?",
        a: "Raise the price, reduce fixed or variable costs, or find ways to increase volume. Test each change in the calculator to see which one matters most.",
      },
      {
        q: "Is break-even revenue the same as break-even units?",
        a: "They describe the same point in different ways. Units tell you how many to sell, and revenue tells you how much money that means at your price.",
      },
      {
        q: "Does break-even include taxes?",
        a: "No. It is a pre-tax figure. Income tax on profit means you need to earn more than break-even to keep a given amount after tax.",
      },
    ],
    related: ["markup-margin-calculator", "freelance-hourly-rate-calculator", "business-loan-calculator"],
    guide: "break-even-analysis-guide",
  },
  {
    slug: "sales-tax-calculator",
    name: "Sales Tax Calculator",
    category: "business",
    group: "Pricing and Profit",
    tagline: "Add sales tax to a price, or work out the pre-tax price from a tax-inclusive total.",
    metaTitle: "Sales Tax Calculator: Add or Remove Tax From a Price",
    metaDescription:
      "Free sales tax calculator. Enter a price and tax rate to see the sales tax and total, or find the pre-tax price from a tax-inclusive amount, with a table of rates.",
    keywords: ["sales tax calculator", "how to calculate sales tax", "reverse sales tax calculator", "price with tax calculator"],
    intro: [
      "Sales tax is added at the register in most US states, but rates differ by state, county and city, and some items are exempt or taxed differently. Knowing how to add tax to a price, and how to take it back out of a total, is useful for shoppers and small businesses alike.",
      "This calculator adds tax to a pre-tax price and quantity and shows the total. It also works out the pre-tax price when the number you have already includes tax, and it shows how the total changes at different rates.",
      "The rate that applies is your combined rate for the exact address where the sale happens, which can be different from the rate in the next town. Check it before you rely on the figure for pricing or for filing. In most states the tax is calculated on the price after any discount applied before the sale, not on the list price, while a rebate paid later usually does not reduce the tax. If a store shows prices with tax included, divide by one plus the rate to see the pre-tax figure, which is the number to compare with a supplier quote.",
    ],
    steps: [
      "Enter the price before tax and the quantity.",
      "Enter the combined sales tax rate for your location.",
      "Read the tax and the total, and the pre-tax price if the entered price already includes tax.",
    ],
    formula: [
      "Sales tax = price × quantity × tax rate",
      "Total = price × quantity + sales tax",
      "Pre-tax price from a tax-inclusive price = tax-inclusive price ÷ (1 + tax rate)",
    ],
    example: [
      "Step 1: Tax. A $249.99 item at an 8.25% sales tax rate has tax of $249.99 × 0.0825, which is about $20.62.",
      "Step 2: Total. $249.99 + $20.62 = $270.61 at the register.",
      "Step 3: Reverse. If $249.99 already included tax, the pre-tax price is $249.99 ÷ 1.0825, or about $230.94.",
      "Step 4: Check. Adding 8.25% to $230.94 gives back about $249.99, which confirms the reverse calculation.",
    ],
    tips: [
      "Use the combined state and local rate for your exact location, not only the state rate.",
      "Check whether your goods or services are taxable. Rules vary by product and by jurisdiction, and some services are taxed in some states and not in others.",
      "Businesses that sell across state lines may have registration and filing obligations. Ask an accountant before you start.",
      "Round tax the way your point-of-sale system does, so your receipts and your records agree.",
      NOTE,
    ],
    faqs: [
      {
        q: "How do you calculate sales tax?",
        a: "Multiply the price by the tax rate as a decimal. For 8.25%, multiply by 0.0825. Add that to the price for the total.",
      },
      {
        q: "How do I remove sales tax from a total?",
        a: "Divide the total by one plus the tax rate. For a total of $270.61 at 8.25%, divide by 1.0825 to get about $250.",
      },
      {
        q: "Is sales tax the same everywhere?",
        a: "No. Rates differ by state, county and city, and some states have no state sales tax. Check your local combined rate.",
      },
      {
        q: "Does the tax apply to the quantity or to each item?",
        a: "The tax applies to the total taxable amount, so for multiple items the tax is the price times the quantity times the rate.",
      },
      {
        q: "Why is my final price different from this calculator?",
        a: "Local rates change, some items are exempt, and some stores round each line item differently. Compare against your receipt for the exact figure.",
      },
    ],
    related: ["markup-margin-calculator", "break-even-calculator", "business-loan-calculator"],
    guide: "sales-tax-basics",
  },
  {
    slug: "freelance-hourly-rate-calculator",
    name: "Freelance Hourly Rate Calculator",
    category: "business",
    group: "Income and Funding",
    tagline: "Work out the hourly rate you need to charge to reach your income goal after expenses and tax.",
    metaTitle: "Freelance Hourly Rate Calculator: What Should You Charge?",
    metaDescription:
      "Free freelance hourly rate calculator. Enter your income goal, expenses, tax set-aside, billable hours and time off to find the hourly rate you need to charge.",
    keywords: ["freelance hourly rate calculator", "how much should I charge per hour", "freelancer rate calculator", "consulting rate calculator"],
    intro: [
      "Freelancers often set rates by looking at an employee's hourly pay, but that leaves out business expenses, taxes, unpaid time off and the hours spent finding clients and doing admin. As a result, many freelancers undercharge and then struggle to make the numbers work.",
      "This calculator works backward from the income you want to take home. It adds taxes and expenses to find the revenue you need, then divides that by your real billable hours to give an hourly rate. It also shows how much you need to bill each week.",
      "Billable hours are the most sensitive input. A freelancer who can bill 15 hours a week needs a much higher rate than one who can bill 25, so be realistic about how much of the working week is paid client work.",
    ],
    steps: [
      "Enter the yearly take-home income you want.",
      "Enter your yearly business expenses and the share of profit you set aside for tax and retirement.",
      "Enter the billable hours you work per week and the weeks you take off each year.",
      "Read the hourly rate and the revenue target, and compare different billable hours.",
    ],
    formula: [
      "Profit needed = take-home income ÷ (1 − tax set-aside)",
      "Revenue needed = profit needed + business expenses",
      "Hourly rate = revenue needed ÷ (billable hours per week × weeks worked)",
    ],
    example: [
      "Step 1: Profit. To take home $70,000 with 25% set aside for tax and retirement, you need $70,000 ÷ 0.75, about $93,333 of profit.",
      "Step 2: Revenue. Add $8,000 of business expenses to reach about $101,333 of revenue.",
      "Step 3: Billable hours. Billing 25 hours a week for 46 working weeks is 1,150 hours.",
      "Step 4: Rate. $101,333 ÷ 1,150 is about $88.12 an hour, or about $2,203 a week of revenue.",
      "Step 5: Sensitivity. If you could bill only 15 hours a week, the rate would need to be about $146.86 an hour to reach the same income.",
    ],
    tips: [
      "Count only billable hours. Sales, admin and learning rarely fit inside client time, so a 25-hour billable week is already a full week.",
      "Include unpaid holidays, sick days and slow periods in your weeks off, so the annual figure is realistic.",
      "Consider project or value-based pricing once you know your minimum hourly rate, since clients often pay for results rather than hours.",
      "Set aside money for tax as you earn it. Self-employed income is usually taxed without an employer withholding it.",
      NOTE,
    ],
    faqs: [
      {
        q: "How much should a freelancer charge per hour?",
        a: "Enough to cover your income goal, business expenses, taxes and unpaid time. This calculator shows the rate that does that for your numbers.",
      },
      {
        q: "Why is a freelance rate higher than an employee's hourly rate?",
        a: "Freelancers pay their own taxes and insurance, cover their own expenses, have no paid time off and cannot bill every working hour.",
      },
      {
        q: "How many hours can a freelancer bill in a week?",
        a: "Many freelancers bill 20 to 30 hours in a full working week. The rest goes to admin, marketing and finding work.",
      },
      {
        q: "Should I quote by the hour or by the project?",
        a: "Hourly rates are simple and protect you on uncertain work, while fixed project prices reward efficiency. Use the hourly rate as a floor when you price projects.",
      },
      {
        q: "How often should I raise my rates?",
        a: "Review rates at least once a year, and whenever your costs or the demand for your work change.",
      },
    ],
    related: ["break-even-calculator", "markup-margin-calculator", "business-loan-calculator"],
    guide: "set-your-freelance-hourly-rate",
  },
  {
    slug: "business-loan-calculator",
    name: "Business Loan Calculator",
    category: "business",
    group: "Income and Funding",
    tagline: "Estimate monthly payments, total interest and fees on a term loan for your business.",
    metaTitle: "Business Loan Calculator: Payment, Interest & Total Cost",
    metaDescription:
      "Free business loan calculator. Enter the loan amount, rate, term and origination fee to see your monthly payment, total interest, cash received and cost by term.",
    keywords: ["business loan calculator", "small business loan calculator", "term loan payment calculator", "business loan interest"],
    intro: [
      "A business loan can fund equipment, stock or expansion, but the monthly payment, interest and fees all reduce the benefit. Knowing the full cost helps you decide how much to borrow and for how long, and whether the return on what you buy is larger than the cost of the money.",
      "This calculator works out the monthly payment on a fixed-rate term loan, the total interest, the origination fee taken from the loan proceeds, and the cash you actually receive. A table compares the same loan over different terms, which shows the trade-off between a lower payment and more interest.",
      "Compare the total cost of the loan, not only the rate. A loan with a low rate and a large fee can cost more than one with a higher rate and no fee, especially when the loan is repaid early. Lenders also differ on how they treat fees, prepayment and payment frequency, so line up the offers on the same basis before you choose.",
    ],
    steps: [
      "Enter the loan amount, interest rate and term in years.",
      "Enter the origination fee as a percentage of the loan.",
      "Review the monthly payment, total interest and cash received.",
      "Compare terms in the table to find a payment you can afford.",
    ],
    formula: [
      "Monthly payment = loan × r ÷ (1 − (1 + r)^−n), where r is the monthly rate and n the number of months",
      "Total interest = monthly payment × months − loan amount",
      "Cash received = loan amount − origination fee",
      "Total cost = total interest + origination fee",
    ],
    example: [
      "Step 1: Payment. A $50,000 loan at 9% over 5 years has a monthly payment of about $1,038.",
      "Step 2: Interest. Over 60 months the payments total about $62,275, so interest is about $12,275.",
      "Step 3: Fee. A 2% origination fee on $50,000 is $1,000, which is taken from the proceeds.",
      "Step 4: Cash in hand. You receive $50,000 − $1,000 = $49,000, but repay the full $50,000 plus interest.",
      "Step 5: Total cost. Interest plus the fee comes to about $13,275. A three-year term on the same loan would cost about $1,590 a month and about $7,240 in interest, so the table shows how the term changes the cost.",
    ],
    tips: [
      "Compare the total cost, not only the rate. Fees can add significantly, especially on small loans.",
      "Check for prepayment penalties, and whether payments are monthly, weekly or daily, because frequency changes how fast the balance falls.",
      "Make sure the payment fits your cash flow, with room for a slow month, not only an average one.",
      "Ask whether the lender charges a fee for early repayment, which can change the best term.",
      NOTE,
    ],
    faqs: [
      {
        q: "How do I calculate a business loan payment?",
        a: "Use the standard loan formula with the amount, interest rate and number of monthly payments. The calculator does this for you.",
      },
      {
        q: "What is an origination fee?",
        a: "A fee the lender charges for processing the loan, usually a percentage of the amount and often deducted from the money you receive.",
      },
      {
        q: "Does a longer term save money?",
        a: "A longer term lowers the monthly payment but increases total interest. Use the table to compare the trade-off for your situation.",
      },
      {
        q: "Is the origination fee included in the interest rate?",
        a: "Usually not. The fee is separate, so the effective cost is higher than the stated rate. Compare total cost to see the difference.",
      },
      {
        q: "What should I have ready before applying?",
        a: "Lenders typically ask for recent bank statements, financial statements, tax returns and a clear plan for how the money will be used.",
      },
    ],
    related: ["break-even-calculator", "markup-margin-calculator", "freelance-hourly-rate-calculator"],
  },
];
