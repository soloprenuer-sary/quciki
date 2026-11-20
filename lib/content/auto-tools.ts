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
      "A car payment depends on more than the sticker price. Sales tax, dealer fees, your down payment and trade-in, the interest rate and the length of the loan all change what you pay each month and in total. Many buyers focus on the monthly figure and miss how much the loan adds to the cost of the car.",
      "This calculator builds the amount financed from the price, the trade-in, tax and fees, subtracts your down payment, and shows your monthly payment, total interest and the full cost of the vehicle. A table compares the same loan over terms from 36 to 84 months, which shows the trade-off between a lower payment and more interest.",
      "Get a rate from your bank or credit union before you visit a dealer. A pre-approved rate gives you a benchmark, so you can check any dealer financing offer against a number you already have.",
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
      "Step 1: Amount financed. A $32,000 car with $4,000 down and a $3,000 trade-in. Sales tax at 6.5% on the $29,000 after trade-in is about $1,885, and $600 of fees adds to the total. $32,000 − $3,000 + $1,885 + $600 − $4,000 = $27,485 to finance.",
      "Step 2: Payment. At 7% over 60 months the payment is about $544 a month.",
      "Step 3: Interest. Total payments over 60 months are about $32,654, which is $5,169 more than the amount financed.",
      "Step 4: Total cost. The car costs about $39,654 including your $7,000 of down payment and trade-in.",
      "Step 5: Longer term. At 84 months the payment falls to about $415 a month, but interest rises to about $7,360. At 36 months the payment is about $849 and interest about $3,067.",
    ],
    tips: [
      "A longer term lowers the payment but increases interest, and it can leave you owing more than the car is worth for longer.",
      "Look at the total cost, not just the monthly payment. Dealers can often hit a monthly target by stretching the term.",
      "Negotiate the price of the car before discussing financing, so the two are not mixed together.",
      "Gap insurance can matter on a long loan with a small down payment, because the car can lose value faster than you repay the loan.",
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
      {
        q: "Does the trade-in reduce the tax?",
        a: "In many states, sales tax is charged only on the price minus the trade-in value, which is how this calculator works. Rules vary, so check your state.",
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
      "A lease payment covers the part of the car's value you use up, plus a finance charge and tax. The terms dealers quote, money factor and residual value, are less familiar than an interest rate, which makes leases hard to compare with each other and with a loan.",
      "This calculator turns those terms into a monthly payment. It shows the depreciation and finance charge separately, converts the money factor into an approximate APR, and totals the cost of the lease, including the amount due at signing.",
      "Leasing is a rental of the car's use, not a purchase. At the end you return the car, or pay the residual to buy it. Work out the total cost of the lease and compare it with the cost of owning the same car for the same period.",
    ],
    steps: [
      "Enter the MSRP and the negotiated price of the car.",
      "Enter your down payment and any acquisition fees.",
      "Enter the residual value as a percentage of MSRP, the money factor and the lease term.",
      "Enter the sales tax rate that applies to lease payments in your state.",
    ],
    formula: [
      "Capitalized cost = negotiated price + fees − down payment",
      "Depreciation per month = (capitalized cost − residual value) ÷ months",
      "Finance charge per month = (capitalized cost + residual value) × money factor",
      "Payment = (depreciation + finance charge) × (1 + tax rate)",
      "Approximate APR = money factor × 2,400",
    ],
    example: [
      "Step 1: Capitalized cost. The car is negotiated to $35,000, plus $695 of fees, less $2,000 down. That gives $33,695.",
      "Step 2: Residual. A 60% residual on the $36,000 MSRP is $21,600, the value the lessor expects at the end.",
      "Step 3: Depreciation. ($33,695 − $21,600) ÷ 36 months is about $336 a month.",
      "Step 4: Finance charge. ($33,695 + $21,600) × 0.0025 is about $138 a month. The money factor of 0.0025 is roughly a 6% APR.",
      "Step 5: Payment and total. ($336 + $138) × 1.065 is about $505 a month. Over 36 months that is about $18,180, plus the $2,000 down, a total lease cost of about $20,181.",
    ],
    tips: [
      "Negotiate the price of the car, not just the monthly payment. A lower capitalized cost lowers the payment.",
      "Ask for the money factor and residual value in writing and convert the factor to APR to compare with loans.",
      "Check the mileage allowance and the charges for excess miles and wear, which can be large at the end.",
      "A higher residual value lowers the depreciation you pay, but check whether the lessor has set it high on purpose to make the payment look low.",
      NOTE,
    ],
    faqs: [
      {
        q: "What is a money factor?",
        a: "It is the lease's finance rate expressed as a small decimal. Multiply it by 2,400 to get an approximate APR, so 0.0025 is about 6%.",
      },
      {
        q: "What is a residual value?",
        a: "It is what the leasing company expects the car to be worth at the end of the lease, usually a percentage of MSRP. A higher residual means lower depreciation and a lower payment.",
      },
      {
        q: "Is leasing cheaper than buying?",
        a: "Leasing usually has lower monthly payments, but you do not own the car at the end. Buying often costs less over many years if you keep the car long term.",
      },
      {
        q: "Do I pay tax on a lease?",
        a: "Rules differ by state. Some tax each monthly payment, while others tax the whole price upfront. Enter the rate that applies to your payment.",
      },
      {
        q: "What happens if I drive too many miles?",
        a: "Most leases charge a fee per extra mile over the allowance. Choose a mileage allowance that matches your real driving, because adding miles later is more expensive.",
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
      "Fuel is one of the biggest running costs of a car, and it moves with both fuel prices and how much you drive. Knowing your cost per mile helps you budget for commuting and road trips, and it makes it easier to compare the running costs of different vehicles.",
      "This calculator turns your monthly miles, fuel economy and fuel price into a cost per mile, a monthly and yearly total, and the fuel cost of a specific trip. A table shows how your monthly spend changes if fuel prices move up or down.",
      "The sticker fuel economy is a best case. Real driving, with stop-start traffic, cold weather, roof racks and a heavy foot, often gives a lower mpg, so the figure you enter should reflect how you actually drive. To find your real figure, fill the tank, note the odometer, and fill it again at the same level after your next full tank. Divide the miles by the gallons added, and average two or three tanks. Motorway trips and short city journeys often give different figures, so calculate both if your driving is mixed.",
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
      "Step 1: Cost per mile. At 28 mpg and $3.60 a gallon, each mile costs $3.60 ÷ 28, about $0.129.",
      "Step 2: Monthly. Driving 1,000 miles a month costs about $129, which is $1,543 a year.",
      "Step 3: Gallons. A 300-mile trip uses 300 ÷ 28, about 10.7 gallons.",
      "Step 4: Trip cost. 10.7 gallons at $3.60 is about $39 for the trip.",
      "Step 5: Price sensitivity. The table shows that at $3.00 a gallon the monthly cost is about $107, and at $3.50 about $125, so a 50-cent change in price adds about $18 a month here.",
    ],
    tips: [
      "Real mpg is often lower than the sticker figure in city driving, in cold weather and at high speeds. Track a few tanks to find your own figure.",
      "Keep tyres properly inflated and remove unneeded weight. Both improve fuel economy at little cost.",
      "Use the price table to see how a rise in fuel prices would affect your budget.",
      "Combining short trips and avoiding long idling reduces the fuel you burn without changing how far you drive.",
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
      {
        q: "Does fuel economy change in winter?",
        a: "Yes. Cold weather reduces efficiency, especially on short trips when the engine stays cold, so winter fuel costs are often higher than the summer figure.",
      },
      {
        q: "Should I use the sticker mpg?",
        a: "It is a useful starting point, but real mpg is usually lower. Calculate from your own fuel records for the most accurate budget.",
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
      "Charging an electric car usually costs far less than fuelling a gas car, but the savings depend on your electricity rate and on how much you rely on public fast chargers, which are often priced at two to three times the home rate.",
      "This calculator estimates the energy your EV uses, including charging losses, splits it between home and public charging, and compares the yearly cost with a gas car at the fuel price you enter. It shows the yearly savings and the cost per mile.",
      "Charging losses are easy to overlook. Some energy is lost as heat between the outlet and the battery, so you pay for more electricity than the car uses to drive. The calculator adds that loss to the energy used.",
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
      "Step 1: Energy. 12,000 miles at 3.5 miles per kWh is about 3,429 kWh. Adding 10% charging losses gives about 3,771 kWh a year.",
      "Step 2: Split. 80% at home is about 3,017 kWh at $0.17, costing about $513. 20% at public chargers is about 754 kWh at $0.45, costing about $339.",
      "Step 3: EV total. $513 + $339 is about $852 a year.",
      "Step 4: Gas comparison. A 30 mpg car covers 12,000 miles on 400 gallons, which at $3.60 costs about $1,440.",
      "Step 5: Savings. The EV saves about $588 a year in fuel, or about $49 a month. If you charged only at public stations, the savings would be much smaller.",
    ],
    tips: [
      "Home charging overnight on a time-of-use plan can be much cheaper than the average rate, so check your utility's tariffs.",
      "Public fast charging often costs two to three times as much per kWh as home charging, so the more you use it, the less you save.",
      "Cold weather and high speeds reduce range and efficiency, so the real miles per kWh can be lower than the rated figure.",
      "Fuel is only part of the cost. Compare purchase price, insurance and maintenance too, because the total picture is what matters.",
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
      {
        q: "Does a home charger cost extra to install?",
        a: "Installation costs vary with your electrical panel and the charger type. Those costs are not in this calculator, and they are a one-time expense.",
      },
      {
        q: "Are there incentives for EV charging?",
        a: "Some utilities and governments offer rebates or cheaper time-of-use rates. Check local programs, as they change often.",
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
      "Depreciation is usually the largest cost of owning a new car, and it happens quietly. A car loses the most value in its first year and keeps losing value each year after, though more slowly. The loss is a real cost even though you never write a cheque for it.",
      "This calculator applies a first-year rate and a yearly rate for later years to estimate the car's value over the time you own it. It reports the total loss and expresses the loss as a monthly cost, which you can compare with the monthly cost of a loan or lease.",
      "Depreciation varies widely between models. Some hold their value well and others lose it quickly, so the rates you enter should come from recent sales data for the specific model, not from a general rule.",
    ],
    steps: [
      "Enter the purchase price.",
      "Enter the first-year depreciation rate and the yearly rate for later years.",
      "Enter how many years you plan to own the car.",
      "Read the estimated value, the total loss and the year-by-year table.",
    ],
    formula: [
      "Value after year 1 = price × (1 − first-year rate)",
      "Value after each later year = previous value × (1 − yearly rate)",
      "Total depreciation = price − value at the end of ownership",
      "Monthly cost = total depreciation ÷ months owned",
    ],
    example: [
      "Step 1: Year one. A $35,000 car losing 20% in the first year is worth $28,000 after one year, a loss of $7,000.",
      "Step 2: Years two and three. At 12% a year, it is worth $24,640 after two years and about $21,683 after three.",
      "Step 3: Years four and five. It is about $19,081 after four years and $16,791 after five.",
      "Step 4: Total loss. Over five years the car loses about $18,209, which is 52% of the price.",
      "Step 5: Monthly cost. Spread over 60 months, the depreciation is about $303 a month, a cost that applies whether or not you sell.",
    ],
    tips: [
      "Real depreciation depends on the make, model, mileage, condition and market. Check recent listings for the model you want.",
      "Buying a used car lets the first owner absorb the steepest drop, which is one reason used cars can be good value.",
      "Include depreciation when you compare buying and leasing, because a lease payment is largely depreciation.",
      "Keep records of maintenance. A documented service history helps a car hold its value when you sell.",
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
      {
        q: "Does depreciation matter if I keep the car a long time?",
        a: "The first few years carry most of the loss, so keeping a car for many years spreads that cost across more miles and lowers the cost per year.",
      },
      {
        q: "Is the estimate the same as the resale price?",
        a: "No. Dealers and private buyers pay different amounts, and condition, mileage and local demand all affect the final price.",
      },
    ],
    related: ["car-loan-calculator", "auto-lease-calculator", "fuel-cost-calculator"],
    guide: "car-depreciation-explained",
  },
];
