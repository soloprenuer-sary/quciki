import type { CalculatorMeta } from "../calculators";

const NOTE =
  "Results are estimates from the numbers you enter. Dealer quotes, lender terms, taxes and fees vary, so confirm with the dealer or lender before you sign.";

export const AUTO_TOOLS: CalculatorMeta[] = [
  {
    slug: "car-loan-calculator",
    name: "Car Loan Calculator",
    category: "auto",
    group: "Buying and Financing",
    tagline: "Estimate your monthly car payment, total interest and the full cost of financing a vehicle.",
    metaTitle: "Car Loan Calculator: Monthly Payment, Interest & Total Cost",
    metaDescription:
      "Free car loan calculator. Enter price, down payment, trade-in, rate, term, sales tax and fees to see your monthly payment, total interest and a comparison of loan terms.",
    keywords: ["car loan calculator", "auto loan calculator", "car payment calculator", "monthly car payment"],
    intro: [
      "A car payment depends on more than the sticker price. Sales tax, dealer fees, your down payment and trade-in, the interest rate and the length of the loan all change what you pay each month and in total.",
      "This calculator builds the amount financed from the price, tax and fees, subtracts your down payment and trade-in, and shows your monthly payment, total interest and the full cost of the vehicle. A table compares terms from 36 to 84 months.",
    ],
    steps: [
      "Enter the vehicle price, your down payment and any trade-in value.",
      "Enter the loan rate (APR) and the term in months.",
      "Enter sales tax and any title, registration or dealer fees.",
      "Compare the payment and interest for different terms in the table.",
    ],
    formula: [
      "Amount financed = price − trade-in + sales tax + fees − down payment",
      "Monthly payment = loan × r ÷ (1 − (1 + r)^−n), where r is the monthly rate and n the number of months",
      "Total interest = monthly payment × months − amount financed",
    ],
    example: [
      "A $32,000 car with $4,000 down, a $3,000 trade-in, 6.5% sales tax on the price after trade-in and $600 of fees means financing $27,485. At 7% over 60 months the payment is about $544 a month, with $5,169 of interest. The whole vehicle costs about $39,654 including your down payment and trade-in. Stretching to 84 months lowers the payment to about $415 but raises interest to roughly $7,360.",
    ],
    tips: [
      "A longer term lowers the payment but increases interest and the time you owe more than the car is worth.",
      "Get a pre-approved rate from a bank or credit union before visiting a dealer.",
      "Look at the total cost, not just the monthly payment.",
      NOTE,
    ],
    faqs: [
      {
        q: "How is a car payment calculated?",
        a: "The lender takes the amount financed, the interest rate and the term, and uses the standard loan formula to find the level monthly payment that pays off the loan.",
      },
      {
        q: "How much car can I afford?",
        a: "A common guideline is to put 20% down, finance for no more than four years and keep total car costs under 10% of gross income. These are rules of thumb, not requirements.",
      },
      {
        q: "Does a bigger down payment help?",
        a: "Yes. It reduces the amount financed, so you pay less interest and have a lower payment. It also reduces the risk of owing more than the car is worth.",
      },
      {
        q: "Is sales tax included in the loan?",
        a: "Often yes, if you roll it into the financing. This calculator includes tax and fees in the amount financed.",
      },
    ],
    related: ["auto-lease-calculator", "car-depreciation-calculator", "fuel-cost-calculator"],
    guide: "car-loan-term-and-interest",
  },
  {
    slug: "auto-lease-calculator",
    name: "Auto Lease Calculator",
    category: "auto",
    group: "Buying and Financing",
    tagline: "Estimate a monthly lease payment from the price, residual value, money factor and term.",
    metaTitle: "Auto Lease Calculator: Monthly Payment, Money Factor & Residual",
    metaDescription:
      "Free auto lease calculator. Enter price, MSRP, residual value, money factor, term and tax to estimate your monthly lease payment, equivalent APR and total lease cost.",
    keywords: ["auto lease calculator", "car lease calculator", "money factor calculator", "lease payment calculator"],
    intro: [
      "A lease payment covers the part of the car's value you use up, plus a finance charge and tax. The terms dealers quote, money factor and residual value, are not as familiar as an interest rate, which makes leases hard to compare.",
      "This calculator turns those terms into a monthly payment. It shows the depreciation and finance charge separately, converts the money factor into an approximate APR and totals the cost of the lease.",
    ],
    steps: [
      "Enter the MSRP and the negotiated price of the car.",
      "Enter your down payment and any acquisition fees.",
      "Enter the residual value as a percentage of MSRP, the money factor and the lease term.",
      "Enter the sales tax rate on lease payments.",
    ],
    formula: [
      "Capitalized cost = negotiated price + fees − down payment",
      "Depreciation per month = (capitalized cost − residual value) ÷ months",
      "Finance charge per month = (capitalized cost + residual value) × money factor",
      "Payment = (depreciation + finance charge) × (1 + tax rate)",
      "Approximate APR = money factor × 2,400",
    ],
    example: [
      "A car with a $36,000 MSRP negotiated to $35,000, with $2,000 down, $695 in fees, a 60% residual ($21,600), a 0.0025 money factor (about 6% APR) and a 36-month term has a capitalized cost of $33,695. Depreciation is about $336 a month and the finance charge about $138. With 6.5% tax the payment is about $505 a month, and the lease costs about $20,181 including the down payment.",
    ],
    tips: [
      "Negotiate the price of the car, not just the monthly payment. A lower capitalized cost lowers the payment.",
      "Ask for the money factor and residual value in writing and convert the factor to APR.",
      "Check the mileage allowance and the fees for excess miles and wear.",
      NOTE,
    ],
    faqs: [
      {
        q: "What is a money factor?",
        a: "It is the lease's finance rate expressed as a small decimal. Multiply it by 2,400 to get an approximate APR, so 0.0025 is about 6%.",
      },
      {
        q: "What is a residual value?",
        a: "It is what the leasing company expects the car to be worth at the end of the lease, usually expressed as a percentage of MSRP. A higher residual means lower depreciation and a lower payment.",
      },
      {
        q: "Is leasing cheaper than buying?",
        a: "Leasing usually has lower monthly payments, but you do not own the car at the end. Buying often costs less over many years if you keep the car long term.",
      },
      {
        q: "Do I pay tax on a lease?",
        a: "Rules differ by state. Some tax each monthly payment, some tax the whole price upfront. Enter the rate that applies to your payment.",
      },
    ],
    related: ["car-loan-calculator", "car-depreciation-calculator", "fuel-cost-calculator"],
    guide: "car-lease-money-factor-and-residual",
  },
  {
    slug: "fuel-cost-calculator",
    name: "Fuel Cost Calculator",
    category: "auto",
    group: "Running Costs",
    tagline: "Work out the cost per mile, per month and per trip from your fuel economy and fuel price.",
    metaTitle: "Fuel Cost Calculator: Cost Per Mile, Month & Trip",
    metaDescription:
      "Free fuel cost calculator. Enter miles, fuel economy and fuel price to get your cost per mile, monthly and yearly fuel spend, and the cost of a trip.",
    keywords: ["fuel cost calculator", "gas cost calculator", "trip cost calculator", "cost per mile calculator"],
    intro: [
      "Fuel is one of the biggest running costs of a car, and it moves with both fuel prices and how much you drive. Knowing your cost per mile helps you budget for commuting and road trips and compare vehicles.",
      "This calculator turns your miles, fuel economy and fuel price into a cost per mile, a monthly and yearly total, and the fuel cost of a specific trip. A table shows how your spend changes if fuel prices move.",
    ],
    steps: [
      "Enter the miles you drive in a typical month.",
      "Enter your fuel economy in miles per gallon.",
      "Enter the price per gallon.",
      "Enter a trip distance to see the fuel cost of that journey.",
    ],
    formula: [
      "Cost per mile = fuel price ÷ miles per gallon",
      "Monthly cost = miles per month ÷ miles per gallon × fuel price",
      "Trip cost = trip miles ÷ miles per gallon × fuel price",
    ],
    example: [
      "At 28 mpg and $3.60 a gallon, fuel costs about $0.129 per mile. Driving 1,000 miles a month costs about $129 a month, or $1,543 a year. A 300-mile trip uses about 10.7 gallons and costs about $39.",
    ],
    tips: [
      "Your real mpg is often lower than the sticker number in city driving, in cold weather and with a heavy foot.",
      "Keep tires properly inflated and remove unneeded weight to improve fuel economy.",
      "Use the table to see how a rise in fuel prices would affect your budget.",
      NOTE,
    ],
    faqs: [
      {
        q: "How do I calculate fuel cost per mile?",
        a: "Divide the price of a gallon of fuel by your car's miles per gallon. At $3.60 and 28 mpg that is about 12.9 cents per mile.",
      },
      {
        q: "How much does it cost to drive 100 miles?",
        a: "Multiply the cost per mile by 100. At 12.9 cents a mile, 100 miles costs about $12.86 in fuel.",
      },
      {
        q: "How can I lower my fuel costs?",
        a: "Drive smoothly, maintain your car, reduce idling, combine trips and choose a more efficient vehicle when you replace it.",
      },
    ],
    related: ["ev-charging-cost-calculator", "car-loan-calculator", "car-depreciation-calculator"],
  },
  {
    slug: "ev-charging-cost-calculator",
    name: "EV Charging Cost Calculator",
    category: "auto",
    group: "Running Costs",
    tagline: "Estimate yearly electric vehicle charging costs and compare them with a gas car.",
    metaTitle: "EV Charging Cost Calculator: Electric vs Gas Fuel Cost",
    metaDescription:
      "Free EV charging cost calculator. Enter miles, efficiency, home and public charging prices to see your yearly charging cost and savings compared with a gas car.",
    keywords: ["ev charging cost calculator", "electric car cost calculator", "ev vs gas cost", "cost to charge electric car"],
    intro: [
      "Charging an electric car costs far less than fueling a gas car in many places, but the savings depend on your electricity rate and how much you rely on pricier public fast chargers.",
      "This calculator estimates the energy your EV uses, including charging losses, splits it between home and public charging, and compares the yearly cost with a gas car at the fuel price you enter.",
    ],
    steps: [
      "Enter the miles you drive each year and your EV's efficiency in miles per kWh.",
      "Enter the share of charging you do at home and the home and public prices per kWh.",
      "Enter the gas car's fuel economy and the gas price to compare.",
      "Read the yearly cost, the savings and the cost per mile.",
    ],
    formula: [
      "Energy used = miles ÷ miles per kWh × (1 + charging losses)",
      "EV cost = home kWh × home price + public kWh × public price",
      "Gas cost = miles ÷ mpg × gas price",
    ],
    example: [
      "Driving 12,000 miles a year at 3.5 miles per kWh with 10% charging losses uses about 3,771 kWh. With 80% charged at home at $0.17 and 20% at public chargers at $0.45, the yearly cost is about $852. A 30 mpg gas car at $3.60 a gallon costs about $1,440, so the EV saves about $588 a year in fuel.",
    ],
    tips: [
      "Home charging overnight on a time-of-use plan can be much cheaper than the average rate.",
      "Public fast charging often costs two to three times as much per kWh as home charging.",
      "Cold weather and high speeds reduce range and efficiency.",
      "Fuel is only part of the cost. Compare purchase price, insurance and maintenance too.",
      NOTE,
    ],
    faqs: [
      {
        q: "How much does it cost to charge an electric car?",
        a: "It depends on your electricity rate and the car's efficiency. At $0.17 per kWh and 3.5 miles per kWh, home charging costs about 5 cents per mile.",
      },
      {
        q: "Is it cheaper to charge an EV or fill a gas car?",
        a: "Usually cheaper to charge, especially at home. Heavy reliance on public fast chargers can narrow or erase the gap.",
      },
      {
        q: "What are charging losses?",
        a: "Some energy is lost as heat between the outlet and the battery, commonly about 10% to 15%, so you pay for more energy than the car uses to drive.",
      },
    ],
    related: ["fuel-cost-calculator", "car-loan-calculator", "car-depreciation-calculator"],
    guide: "ev-vs-gas-running-costs",
  },
  {
    slug: "car-depreciation-calculator",
    name: "Car Depreciation Calculator",
    category: "auto",
    group: "Buying and Financing",
    tagline: "Estimate how much value a car loses each year and what it may be worth when you sell.",
    metaTitle: "Car Depreciation Calculator: Estimated Value by Year",
    metaDescription:
      "Free car depreciation calculator. Enter the price and yearly depreciation rates to see the estimated value, total loss and monthly cost of depreciation over time.",
    keywords: ["car depreciation calculator", "vehicle depreciation", "how much does a car depreciate", "car value calculator"],
    intro: [
      "Depreciation is usually the largest cost of owning a new car, and it happens quietly. A car loses the most value in its first year and keeps losing value each year after, though more slowly.",
      "This calculator applies a first-year rate and a yearly rate for later years to estimate the car's value over the time you own it, and expresses the loss as a monthly cost.",
    ],
    steps: [
      "Enter the purchase price.",
      "Enter the first-year depreciation rate and the yearly rate afterward.",
      "Enter how many years you plan to own the car.",
      "Read the estimated value, total loss and the year-by-year table.",
    ],
    formula: [
      "Value after year 1 = price × (1 − first-year rate)",
      "Value after later years = previous value × (1 − yearly rate)",
      "Total depreciation = price − current value",
    ],
    example: [
      "A $35,000 car losing 20% in the first year and 12% a year after that would be worth about $28,000 after one year, $24,640 after two and about $16,791 after five. The five-year loss is about $18,209, roughly 52% of the price, or about $303 a month.",
    ],
    tips: [
      "Real depreciation depends on the make, model, mileage, condition and market. Check recent listings.",
      "Buying a used car lets the first owner absorb the steepest drop.",
      "Include depreciation when you compare buying and leasing.",
      NOTE,
    ],
    faqs: [
      {
        q: "How much does a car depreciate in the first year?",
        a: "New cars commonly lose around 15% to 25% in the first year, then a smaller share each year after, though it varies widely by model.",
      },
      {
        q: "Do all cars depreciate at the same rate?",
        a: "No. Some trucks and certain models hold value well, while luxury cars and some EVs may lose value faster.",
      },
      {
        q: "How can I reduce the effect of depreciation?",
        a: "Buy a car that is one to three years old, choose a model with a strong resale record, and keep it well maintained with sensible mileage.",
      },
    ],
    related: ["car-loan-calculator", "auto-lease-calculator", "fuel-cost-calculator"],
    guide: "car-depreciation-explained",
  },
];
