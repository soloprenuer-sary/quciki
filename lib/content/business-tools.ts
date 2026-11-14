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
      "Markup and margin both describe profit, but they use different bases, and mixing them up is a common and costly pricing mistake. Markup is profit as a percentage of cost. Margin is profit as a percentage of the selling price.",
      "This calculator shows both for the cost and price you enter, shows total gross profit at your sales volume, and lists the selling price you need to hit target margins.",
    ],
    steps: [
      "Enter the cost to you of each unit.",
      "Enter the price you sell it for.",
      "Enter the number of units you expect to sell.",
      "Use the table to see the price needed for different margins.",
    ],
    formula: [
      "Profit = selling price − cost",
      "Margin = profit ÷ selling price",
      "Markup = profit ÷ cost",
      "Price for a target margin = cost ÷ (1 − margin)",
    ],
    example: [
      "An item costing $60 and selling for $100 earns $40 profit. That is a 40% margin (40 ÷ 100) but a 66.7% markup (40 ÷ 60). Selling 200 units earns $8,000 gross profit. To reach a 50% margin on a $60 cost, the price must be $120.",
    ],
    tips: [
      "A 50% markup is not a 50% margin. A 50% markup gives a 33.3% margin.",
      "Gross margin ignores overhead. Check that it covers rent, salaries and other costs.",
      "Review prices regularly as costs change.",
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
      "The break-even point is the sales volume at which total revenue equals total costs. Below it you lose money, above it you make a profit. It is one of the first numbers to know before launching or pricing a product.",
      "This calculator divides your fixed costs by the contribution each unit makes after variable costs. It shows the units and sales needed to break even, the volume for a profit target, and a chart of profit at different volumes.",
    ],
    steps: [
      "Enter your fixed costs for the period, for example per month.",
      "Enter the selling price and the variable cost of each unit.",
      "Enter the profit you want to earn.",
      "Read the break-even volume and the chart.",
    ],
    formula: [
      "Contribution per unit = selling price − variable cost per unit",
      "Break-even units = fixed costs ÷ contribution per unit",
      "Break-even sales = break-even units × selling price",
      "Units for a profit target = (fixed costs + target profit) ÷ contribution per unit",
    ],
    example: [
      "With $12,000 of monthly fixed costs, a $45 price and $18 of variable cost, each unit contributes $27. You break even at about 445 units, or about $20,000 of sales. To earn $3,000 a month you need to sell about 556 units.",
    ],
    tips: [
      "Include every fixed cost, such as rent, wages, insurance, software and loan payments.",
      "Raising price or cutting variable cost lowers the break-even point quickly.",
      "Check that the break-even volume is realistic for your market.",
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
        a: "Raise the price, reduce fixed or variable costs, or find ways to increase volume. Test each change in the calculator.",
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
      "Sales tax is added at the register in most US states, but rates differ by state, county and city, and some items are exempt. Knowing how to add it, and how to take it back out of a total, is useful for shoppers and small businesses.",
      "This calculator adds tax to a pre-tax price and quantity, shows the total, works out the pre-tax price if the number you entered already includes tax, and compares totals at different rates.",
    ],
    steps: [
      "Enter the price before tax and the quantity.",
      "Enter the combined sales tax rate for your location.",
      "Read the tax and total, and the pre-tax price if the entered price already includes tax.",
    ],
    formula: [
      "Sales tax = price × quantity × tax rate",
      "Total = price × quantity + sales tax",
      "Pre-tax price from a tax-inclusive price = price ÷ (1 + tax rate)",
    ],
    example: [
      "A $249.99 item at an 8.25% sales tax rate has about $20.62 of tax, for a total of $270.61. If $249.99 already included the tax, the pre-tax price would be about $230.94.",
    ],
    tips: [
      "Use the combined state and local rate for your exact location.",
      "Check whether your goods or services are taxable. Rules vary by product and jurisdiction.",
      "Businesses that sell across states may have registration obligations. Ask an accountant.",
      NOTE,
    ],
    faqs: [
      {
        q: "How do you calculate sales tax?",
        a: "Multiply the price by the tax rate as a decimal. For 8.25%, multiply by 0.0825. Add that to the price for the total.",
      },
      {
        q: "How do I remove sales tax from a total?",
        a: "Divide the total by one plus the tax rate. For a total of $270.61 at 8.25%, divide by 1.0825 to get $249.99.",
      },
      {
        q: "Is sales tax the same everywhere?",
        a: "No. Rates differ by state, county and city, and some places have no state sales tax. Check your local rate.",
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
      "Freelancers often set rates by looking at an employee's hourly pay, but that leaves out business expenses, taxes, unpaid time off and the hours spent finding clients and doing admin. As a result, many freelancers undercharge.",
      "This calculator works backward from the income you want to take home. It adds taxes and expenses to find the revenue you need, then divides by your real billable hours to give an hourly rate.",
    ],
    steps: [
      "Enter the yearly take-home income you want.",
      "Enter your yearly business expenses and the share of profit you set aside for tax and retirement.",
      "Enter the billable hours you work per week and the weeks you take off.",
      "Read the hourly rate and the revenue target, and compare different billable hours.",
    ],
    formula: [
      "Profit needed = take-home income ÷ (1 − tax set-aside)",
      "Revenue needed = profit needed + business expenses",
      "Hourly rate = revenue needed ÷ (billable hours per week × weeks worked)",
    ],
    example: [
      "To take home $70,000 with 25% set aside for tax, you need about $93,333 of profit. Add $8,000 of expenses and you need about $101,333 of revenue. Billing 25 hours a week for 46 weeks is 1,150 hours, so you would charge about $88.12 an hour.",
    ],
    tips: [
      "Count only billable hours. Sales, admin and learning rarely fit inside client time.",
      "Include unpaid holidays, sick days and slow periods in your weeks off.",
      "Consider project or value-based pricing once you know your minimum hourly rate.",
      NOTE,
    ],
    faqs: [
      {
        q: "How much should a freelancer charge per hour?",
        a: "Enough to cover your income goal, business expenses, taxes and unpaid time. This calculator shows the rate that does that for your numbers.",
      },
      {
        q: "Why is a freelance rate higher than an employee's hourly rate?",
        a: "Freelancers pay their own taxes, insurance and expenses, have no paid time off and cannot bill every working hour.",
      },
      {
        q: "How many hours can a freelancer bill in a week?",
        a: "Many freelancers bill 20 to 30 hours in a full working week. The rest goes to admin, marketing and finding work.",
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
      "A business loan can fund equipment, stock or expansion, but the monthly payment, interest and fees all reduce the benefit. Knowing the full cost helps you decide how much to borrow and for how long.",
      "This calculator works out the monthly payment on a fixed-rate term loan, the total interest, the origination fee deducted from your proceeds, and the cash you actually receive. A table compares different terms.",
    ],
    steps: [
      "Enter the loan amount, interest rate and term in years.",
      "Enter the origination fee as a percentage.",
      "Review the monthly payment, total interest and cash received.",
      "Compare terms in the table to find a payment you can afford.",
    ],
    formula: [
      "Monthly payment = loan × r ÷ (1 − (1 + r)^−n), where r is the monthly rate and n the number of months",
      "Total interest = monthly payment × months − loan amount",
      "Cash received = loan amount − origination fee",
    ],
    example: [
      "A $50,000 loan at 9% over 5 years has a monthly payment of about $1,038 and costs about $12,275 in interest. With a 2% origination fee of $1,000 you receive $49,000, so the total cost of the loan is about $13,275.",
    ],
    tips: [
      "Compare the total cost, not only the rate. Fees can add significantly.",
      "Check for prepayment penalties and whether payments are monthly, weekly or daily.",
      "Make sure the loan's payments fit your cash flow, with room for a slow month.",
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
        a: "A longer term lowers the monthly payment but increases total interest. Use the table to compare.",
      },
    ],
    related: ["break-even-calculator", "markup-margin-calculator", "freelance-hourly-rate-calculator"],
  },
];
