import type { CalculatorMeta } from "../calculators";

const NOT_ADVICE =
  "Results are estimates based on the numbers you enter and simplified assumptions. They are for education and planning and are not personal financial, tax or legal advice.";

export const FINANCE_TOOLS: CalculatorMeta[] = [
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    category: "finance",
    group: "Saving and Growth",
    tagline: "See how a starting balance and regular contributions grow over time with compound interest.",
    metaTitle: "Compound Interest Calculator: Growth With Monthly Contributions",
    metaDescription:
      "Free compound interest calculator. Enter a starting balance, monthly contribution, rate and years to see your future balance, interest earned and value in today's money.",
    keywords: ["compound interest calculator", "investment growth calculator", "savings calculator", "interest calculator with monthly contributions"],
    intro: [
      "Compound interest means you earn interest on your interest. Left alone, a balance grows faster each year, which is why starting early and contributing regularly matters more than the exact starting amount.",
      "This calculator models a starting balance plus monthly contributions at your chosen rate and compounding frequency. It shows the future balance, how much of it is your own money and how much is interest, and adjusts for inflation to show the result in today's money.",
    ],
    steps: [
      "Enter your starting balance and the amount you will add each month.",
      "Enter the expected annual interest rate and how often interest compounds.",
      "Set the number of years and an inflation estimate.",
      "Read the future balance, the chart and the year-by-year table.",
    ],
    formula: [
      "Each month: balance = balance × (1 + monthly rate) + contribution",
      "Monthly rate = (1 + annual rate ÷ periods per year)^(periods ÷ 12) − 1",
      "Value in today's money = future balance ÷ (1 + inflation)^years",
    ],
    example: [
      "Starting with $10,000 and adding $500 a month at 6% compounded monthly for 20 years grows to about $264,122. You contribute $130,000 and earn $134,122 in interest. After 2.5% yearly inflation, that is worth about $161,186 in today's money.",
    ],
    tips: [
      "Time matters most. Adding years has a larger effect than adding a similar amount late.",
      "Rates of return are not guaranteed. Test a lower rate to see a cautious case.",
      "Fees reduce your effective return. Subtract them from the rate you enter.",
      NOT_ADVICE,
    ],
    faqs: [
      {
        q: "How is compound interest calculated?",
        a: "Interest is added to the balance at each compounding period, and the next period's interest is calculated on the larger balance. With regular contributions, each deposit also starts earning interest.",
      },
      {
        q: "What is the difference between simple and compound interest?",
        a: "Simple interest is calculated only on the original amount. Compound interest is calculated on the original amount plus all interest earned so far, so it grows faster over time.",
      },
      {
        q: "What is the rule of 72?",
        a: "Dividing 72 by the annual rate gives a rough number of years to double your money. At 6%, it takes about 12 years.",
      },
      {
        q: "Does compounding more often make a big difference?",
        a: "Slightly. Monthly versus yearly compounding at the same rate adds a small amount. The rate and the time period matter much more.",
      },
    ],
    related: ["savings-goal-calculator", "emergency-fund-calculator", "debt-payoff-calculator"],
    guide: "compound-interest-explained",
  },
  {
    slug: "savings-goal-calculator",
    name: "Savings Goal Calculator",
    category: "finance",
    group: "Saving and Growth",
    tagline: "Find how much to save each month to reach a target amount by a set date.",
    metaTitle: "Savings Goal Calculator: How Much to Save Each Month",
    metaDescription:
      "Free savings goal calculator. Enter your target, current savings, timeline and interest rate to find the monthly amount you need to save, with a chart and timeline comparison.",
    keywords: ["savings goal calculator", "how much to save per month", "down payment savings calculator", "savings plan calculator"],
    intro: [
      "A savings goal is easier to hit when it is turned into a monthly number. Whether you are saving for a down payment, a car or a trip, the amount to set aside depends on your target, your head start, how long you have and the interest you earn.",
      "This calculator works backward from your goal. It tells you the monthly savings needed and shows how that amount changes with a shorter or longer timeline.",
    ],
    steps: [
      "Enter the amount you want to save and what you already have.",
      "Choose how many years you have to reach the goal.",
      "Enter the interest rate your savings earn.",
      "Read the monthly amount, and compare the timelines in the table.",
    ],
    formula: [
      "Future value of current savings = current × (1 + monthly rate)^months",
      "Monthly savings = (goal − future value of current savings) × monthly rate ÷ ((1 + monthly rate)^months − 1)",
    ],
    example: [
      "To reach $50,000 in 5 years with $5,000 already saved at 4.5% interest, you would save about $651 a month. You contribute about $39,086 of new money and the rest comes from interest and your starting balance.",
    ],
    tips: [
      "Automate the transfer on payday so saving happens before spending.",
      "Match the account to the timeline. Short goals suit insured savings accounts, not volatile investments.",
      "Rates change. Revisit the plan when your rate does.",
      NOT_ADVICE,
    ],
    faqs: [
      {
        q: "How much should I save each month?",
        a: "It depends on the goal, the timeline and your budget. Enter the target and time frame, and the calculator tells you the monthly amount.",
      },
      {
        q: "Does interest really help with a short goal?",
        a: "A little. Over one to three years, interest is a small share of the total, so most of the goal must come from your own contributions.",
      },
      {
        q: "What if I cannot afford the monthly amount?",
        a: "Try a longer timeline, a smaller goal, or a higher interest account, and see how the table changes.",
      },
    ],
    related: ["compound-interest-calculator", "emergency-fund-calculator", "budget-50-30-20-calculator"],
  },
  {
    slug: "debt-payoff-calculator",
    name: "Debt Payoff Calculator",
    category: "finance",
    group: "Debt and Budgeting",
    tagline: "Compare the debt avalanche and debt snowball methods and see when you will be debt free.",
    metaTitle: "Debt Payoff Calculator: Snowball vs Avalanche",
    metaDescription:
      "Free debt payoff calculator. Enter up to three debts and an extra monthly payment to compare snowball and avalanche, see your debt-free date and the interest you save.",
    keywords: ["debt payoff calculator", "debt snowball calculator", "debt avalanche calculator", "credit card payoff calculator"],
    intro: [
      "When you have several debts, the order in which you pay them off changes how much interest you pay and how motivated you stay. The avalanche method puts extra money on the highest interest rate first. The snowball method targets the smallest balance first.",
      "This calculator simulates both methods month by month using your balances, interest rates and minimum payments. It also shows what would happen if you only made minimum payments.",
    ],
    steps: [
      "Enter the balance, interest rate and minimum payment for each debt. Use 0 for unused rows.",
      "Enter the extra amount you can pay each month above all minimums.",
      "Compare the debt-free time and total interest for each strategy.",
      "Pick the method you can stick with. The best plan is the one you finish.",
    ],
    formula: [
      "Each month: interest = balance × annual rate ÷ 12",
      "Pay each minimum, then send everything left over to the target debt",
      "Avalanche target = highest rate. Snowball target = smallest balance.",
      "When a debt is paid off, its payment rolls into the next target",
    ],
    example: [
      "With a $4,500 card at 22.9%, a $2,800 card at 18.5% and a $9,000 loan at 7.5%, plus an extra $150 a month, the avalanche method clears all $16,300 in 3 years and about $3,060 of interest. Snowball also takes 3 years and costs about $3,209 in interest. Paying only the minimums would take 5 years 1 month and cost about $5,705.",
    ],
    tips: [
      "Avalanche saves the most interest. Snowball can give faster early wins, which helps some people stay motivated.",
      "Keep making the minimum on every debt to avoid fees and credit damage.",
      "Stop adding new balances while you pay off the old ones.",
      "Consider whether a lower-rate balance transfer or consolidation could help, but check fees.",
      NOT_ADVICE,
    ],
    faqs: [
      {
        q: "What is the difference between the debt snowball and avalanche?",
        a: "The snowball pays the smallest balance first for quick wins. The avalanche pays the highest-interest debt first and usually costs less in total interest.",
      },
      {
        q: "Which method is better?",
        a: "Avalanche is cheaper when rates differ a lot. Snowball may be better if you need early momentum. When balances and rates are similar, the difference is small.",
      },
      {
        q: "What if my minimum payment does not cover interest?",
        a: "Then the balance grows and the debt never gets paid down. The calculator will tell you. Increase your payment.",
      },
      {
        q: "Does this include new purchases?",
        a: "No. It assumes you do not add new charges to the debts.",
      },
    ],
    related: ["budget-50-30-20-calculator", "emergency-fund-calculator", "savings-goal-calculator"],
    guide: "debt-snowball-vs-avalanche",
  },
  {
    slug: "salary-to-hourly-calculator",
    name: "Salary to Hourly Calculator",
    category: "finance",
    group: "Income and Pay",
    tagline: "Convert an annual salary to an hourly rate and to monthly, biweekly, weekly and daily pay.",
    metaTitle: "Salary to Hourly Calculator: Convert Annual Pay to Hourly Wage",
    metaDescription:
      "Free salary to hourly calculator. Enter your annual salary, weekly hours and weeks worked to get your hourly rate and daily, weekly, biweekly and monthly pay.",
    keywords: ["salary to hourly calculator", "annual salary to hourly", "hourly wage calculator", "convert salary to hourly"],
    intro: [
      "Comparing a salaried job with an hourly one starts with putting both on the same basis. Dividing salary by hours worked gives an hourly rate you can compare directly.",
      "This calculator turns an annual salary into an hourly rate using your hours per week and weeks worked per year, and also shows the pay for each common pay period, before tax.",
    ],
    steps: [
      "Enter the annual salary.",
      "Enter the hours you work in a typical week.",
      "Enter the weeks you are paid each year. Use 52 if holidays and vacation are paid.",
      "Read the hourly rate and the pay by period.",
    ],
    formula: [
      "Hourly rate = annual salary ÷ (hours per week × weeks per year)",
      "Weekly pay = annual salary ÷ weeks per year",
      "Monthly pay = annual salary ÷ 12",
    ],
    example: [
      "A $65,000 salary with 40 hours a week for 52 weeks is 2,080 hours a year, so the hourly rate is $31.25. That is about $1,250 a week, $2,500 biweekly and $5,417 a month before taxes.",
    ],
    tips: [
      "Paid time off still counts toward the 2,080 hours, so use 52 weeks if you are paid for it.",
      "If you regularly work unpaid overtime, use the real hours to see your true hourly rate.",
      "Compare benefits as well as pay. Health insurance and retirement matching add real value.",
      NOT_ADVICE,
    ],
    faqs: [
      {
        q: "How do I convert salary to hourly?",
        a: "Divide your annual salary by the number of hours you work in a year. For a full-time job that is usually 2,080 hours (40 hours × 52 weeks).",
      },
      {
        q: "How many working hours are in a year?",
        a: "A standard full-time year is 2,080 hours. Subtract unpaid time off to get your actual paid hours.",
      },
      {
        q: "Is this before or after tax?",
        a: "Before tax. Use the take-home pay calculator to estimate what you keep after taxes and deductions.",
      },
    ],
    related: ["take-home-pay-calculator", "budget-50-30-20-calculator", "savings-goal-calculator"],
  },
  {
    slug: "take-home-pay-calculator",
    name: "Take-Home Pay Calculator",
    category: "finance",
    group: "Income and Pay",
    tagline: "Estimate your paycheck after taxes, retirement contributions and benefits.",
    metaTitle: "Take-Home Pay Calculator: Estimate Your Paycheck After Taxes",
    metaDescription:
      "Free take-home pay calculator. Enter salary, tax rates and deductions to estimate your net pay per paycheck, per month and per year, with a breakdown of where the money goes.",
    keywords: ["take home pay calculator", "paycheck calculator", "salary after tax calculator", "net pay calculator"],
    intro: [
      "Your salary is not what lands in your bank account. Income taxes, Social Security and Medicare, retirement contributions and benefit costs all come out first.",
      "This calculator estimates your net pay from the effective tax rates you enter. Because tax rules change and vary by state, it does not apply tax tables. It lets you set the rates yourself, so you can use numbers from your last tax return or your pay stub.",
    ],
    steps: [
      "Enter your gross salary and how many pay periods you have each year.",
      "Enter your effective federal and state tax rates. Find them on your last tax return.",
      "Enter Social Security and Medicare, which is usually 7.65%.",
      "Add retirement contributions, health premiums and other deductions.",
    ],
    formula: [
      "Taxable income = gross pay − pre-tax retirement − pre-tax health insurance",
      "Income tax = taxable income × (federal rate + state rate)",
      "Social Security and Medicare = (gross pay − health insurance) × FICA rate",
      "Take-home = gross − taxes − all deductions",
    ],
    example: [
      "On a $75,000 salary with a 13% federal rate, 4% state rate, 7.65% FICA, 5% going to a pre-tax retirement plan and $150 a month for health insurance, take-home pay is about $52,044 a year, $4,337 a month or $2,002 per biweekly paycheck. That is about 69% of gross pay.",
    ],
    tips: [
      "Use your effective tax rate (total tax divided by taxable income), not your top bracket.",
      "Your pay stub shows exact amounts. Use it to refine the rates.",
      "Pre-tax contributions lower your taxable income, so they cost less than their face value.",
      "Social Security tax stops above an annual wage limit, so very high earners should lower the FICA rate.",
      NOT_ADVICE,
    ],
    faqs: [
      {
        q: "How do I calculate take-home pay?",
        a: "Subtract pre-tax deductions from gross pay, apply income taxes to what remains, subtract payroll taxes, then subtract any after-tax deductions.",
      },
      {
        q: "What is an effective tax rate?",
        a: "It is your total income tax divided by your taxable income. It is lower than your top bracket rate because the first dollars are taxed at lower rates.",
      },
      {
        q: "Why is my paycheck smaller than expected?",
        a: "Common reasons are higher retirement contributions, benefit premiums, or a different withholding amount than your actual tax rate.",
      },
      {
        q: "Does this calculator use official tax tables?",
        a: "No. You enter your own effective rates. For exact withholding, use your employer's payroll tools or an official tax calculator.",
      },
    ],
    related: ["salary-to-hourly-calculator", "budget-50-30-20-calculator", "savings-goal-calculator"],
  },
  {
    slug: "budget-50-30-20-calculator",
    name: "50/30/20 Budget Calculator",
    category: "finance",
    group: "Debt and Budgeting",
    tagline: "Split your income into needs, wants and savings and see how your spending compares.",
    metaTitle: "50/30/20 Budget Calculator: Needs, Wants & Savings",
    metaDescription:
      "Free 50/30/20 budget calculator. Enter your monthly take-home pay and spending to see how it compares with the 50% needs, 30% wants and 20% savings rule.",
    keywords: ["50/30/20 budget calculator", "50 30 20 rule", "budget calculator", "monthly budget planner"],
    intro: [
      "The 50/30/20 rule is a simple way to plan a budget: about 50% of your after-tax income for needs, 30% for wants and 20% for savings and extra debt payments. It is a starting point, not a law.",
      "This calculator gives you the target amount for each category and compares them with what you actually spend, so you can see where to adjust.",
    ],
    steps: [
      "Enter your monthly take-home income after taxes.",
      "Enter what you spend on needs, wants and savings or extra debt payments.",
      "Compare each category with its 50%, 30% and 20% target.",
      "Adjust the categories that are furthest from the targets.",
    ],
    formula: [
      "Needs target = take-home income × 50%",
      "Wants target = take-home income × 30%",
      "Savings and debt target = take-home income × 20%",
    ],
    example: [
      "On $4,500 a month, the targets are $2,250 for needs, $1,350 for wants and $900 for savings and debt. If you spend $2,600 on needs, $1,300 on wants and $600 on savings, you are $350 above target on needs and $300 below on savings, which suggests where to focus.",
    ],
    tips: [
      "In high-cost areas, needs can exceed 50%. Adjust the split to fit, for example 60/20/20.",
      "Count minimum debt payments as needs and extra payments as savings.",
      "Track your real spending for a month to fill the numbers with facts, not guesses.",
      NOT_ADVICE,
    ],
    faqs: [
      {
        q: "What is the 50/30/20 rule?",
        a: "A budgeting guideline that suggests spending 50% of after-tax income on needs, 30% on wants and 20% on savings and debt repayment.",
      },
      {
        q: "What counts as a need versus a want?",
        a: "Needs are costs you must pay to live and work, such as housing, utilities, groceries, transport, insurance and minimum debt payments. Wants are optional, such as dining out, entertainment and subscriptions.",
      },
      {
        q: "What if my needs are more than 50%?",
        a: "That is common where housing is costly. Try to trim wants first, or adjust the split to something realistic and review it regularly.",
      },
    ],
    related: ["take-home-pay-calculator", "debt-payoff-calculator", "emergency-fund-calculator"],
    guide: "budget-50-30-20-rule",
  },
  {
    slug: "emergency-fund-calculator",
    name: "Emergency Fund Calculator",
    category: "finance",
    group: "Saving and Growth",
    tagline: "Work out how big your emergency fund should be and how long it will take to build.",
    metaTitle: "Emergency Fund Calculator: How Much Do You Need?",
    metaDescription:
      "Free emergency fund calculator. Enter essential monthly expenses, months of cover and your savings to see your target, the shortfall and how long it will take to reach.",
    keywords: ["emergency fund calculator", "how much emergency fund do I need", "emergency savings calculator", "months of expenses saved"],
    intro: [
      "An emergency fund is money set aside for job loss, medical bills or urgent repairs, so you do not have to borrow at high interest. How much you need depends on your essential expenses and how stable your income is.",
      "This calculator sets a target based on months of expenses, shows how many months you already have covered, and estimates how long it will take to close the gap with regular savings and interest.",
    ],
    steps: [
      "Enter your essential monthly expenses.",
      "Choose how many months of expenses you want covered.",
      "Enter your current savings, monthly contribution and savings interest rate.",
      "Read the target, the shortfall and the time to reach it.",
    ],
    formula: [
      "Target = essential monthly expenses × months of cover",
      "Each month: balance = balance × (1 + monthly rate) + contribution",
      "Months covered = current savings ÷ essential monthly expenses",
    ],
    example: [
      "With $3,200 of essential monthly expenses and a six-month goal, the target is $19,200. Starting with $2,500 and saving $400 a month at 4% interest, you reach the target in 3 years 3 months (39 months).",
    ],
    tips: [
      "Count only essentials, not every expense. You can cut the rest in an emergency.",
      "Keep the fund in an easily accessible insured account, not in volatile investments.",
      "Self-employed or single-income households may want more than six months.",
      NOT_ADVICE,
    ],
    faqs: [
      {
        q: "How much emergency fund do I need?",
        a: "Many planners suggest three to six months of essential expenses. More is sensible if your income is irregular or you have dependents.",
      },
      {
        q: "Where should I keep an emergency fund?",
        a: "In a safe, liquid account such as a high-yield savings account, where you can withdraw quickly without market risk.",
      },
      {
        q: "Should I build an emergency fund or pay off debt first?",
        a: "Many people build a small starter fund first, then pay down high-interest debt, then grow the fund. The right order depends on your situation.",
      },
    ],
    related: ["savings-goal-calculator", "budget-50-30-20-calculator", "debt-payoff-calculator"],
    guide: "how-much-emergency-fund",
  },
];
