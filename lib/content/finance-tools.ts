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
      "Compound interest means you earn interest on your interest. Left alone, a balance grows faster each year because each year's gains are added to the base that earns the next year's gains. Over long periods this effect is larger than most people expect, which is why starting early and contributing regularly matters more than the exact starting amount.",
      "This calculator models a starting balance plus monthly contributions at your chosen rate and compounding frequency. It shows the future balance, how much of it is your own money and how much is interest, and it adjusts for inflation so you can see the result in today's money rather than in future dollars.",
      "The rate you enter is the most important assumption, and it is an estimate rather than a promise. Investment returns vary from year to year, and fees, taxes and inflation reduce what you keep. Test a few rates, including a cautious one, before relying on any single figure.",
    ],
    steps: [
      "Enter your starting balance and the amount you will add each month.",
      "Enter the expected annual interest rate and how often interest compounds.",
      "Set the number of years and an inflation estimate.",
      "Read the future balance, the chart and the year-by-year table.",
    ],
    formula: [
      "Each month: balance = balance × (1 + monthly rate) + monthly contribution",
      "Monthly rate = (1 + annual rate ÷ compounding periods per year)^(periods per year ÷ 12) − 1",
      "Value in today's money = future balance ÷ (1 + inflation)^years",
    ],
    example: [
      "Step 1: Money you put in. A $10,000 starting balance plus $500 a month for 20 years is $10,000 + $500 × 240 months = $130,000 of your own money.",
      "Step 2: Growth. At 6% a year compounded monthly, the balance grows to about $264,122 after 20 years.",
      "Step 3: Interest. Subtract your $130,000 from the $264,122 and the interest earned is about $134,122. Interest is larger than the money you contributed.",
      "Step 4: Early years. After two years the balance is about $23,988 on $22,000 contributed, so only about $1,988 of growth. The gap widens each year, which is why time matters so much.",
      "Step 5: Real value. Adjusted for 2.5% yearly inflation, $264,122 is worth about $161,186 in today's money.",
    ],
    tips: [
      "Time matters most. An extra five years of contributions often adds more than doubling the amount you save later.",
      "Rates of return are not guaranteed. Test a lower rate to see a cautious case, and a higher one only as an optimistic check.",
      "Fees reduce your effective return. Subtract them from the rate you enter, because a 1% annual fee can cut a long-term balance noticeably.",
      "Taxes change the result. Tax-advantaged accounts and taxable accounts grow differently, so the rate should be after tax where it applies.",
      "Compounding more often has a small effect. The rate and the time period matter far more than daily versus monthly compounding.",
      NOT_ADVICE,
    ],
    faqs: [
      {
        q: "How is compound interest calculated?",
        a: "Interest is added to the balance at each compounding period, and the next period's interest is calculated on the larger balance. With regular contributions, each deposit also starts earning interest from the day it is made.",
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
        a: "Only slightly. Monthly versus yearly compounding at the same rate adds a small amount. The rate and the time period matter much more.",
      },
      {
        q: "Why is the inflation-adjusted figure lower?",
        a: "Inflation reduces what each future dollar can buy. The adjusted figure shows the balance in today's purchasing power, which is the more realistic measure for planning.",
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
      "A savings goal is easier to reach when it is turned into a monthly number. Whether you are saving for a down payment, a car or a trip, the amount to set aside depends on your target, the money you already have, how long you have and the interest your savings earn.",
      "This calculator works backward from the goal. It tells you the monthly amount needed, accounting for your current savings and interest, and it shows how that amount changes with a shorter or longer timeline. That comparison is useful when the monthly figure is more than you can afford.",
      "Interest helps less than people assume on a short goal. Over a few years the growth is a small share of the total, so most of the money has to come from your own deposits. Plan on that basis, then treat any interest as a bonus.",
    ],
    steps: [
      "Enter the amount you want to save and what you already have.",
      "Choose how many years you have to reach the goal.",
      "Enter the interest rate your savings earn.",
      "Read the monthly amount, then compare the timelines in the table.",
    ],
    formula: [
      "Future value of current savings = current savings × (1 + monthly rate)^months",
      "Monthly savings = (goal − future value of current savings) × monthly rate ÷ ((1 + monthly rate)^months − 1)",
    ],
    example: [
      "Step 1: Gap. Your target is $50,000 in five years and you have $5,000 today. Growing at 4.5% a year, the $5,000 is worth about $6,250 by then, so the calculator needs to cover about $43,750 from new deposits and interest.",
      "Step 2: Monthly amount. Spread over 60 months at 4.5%, the required deposit is about $651 a month.",
      "Step 3: Money from you. Those deposits total about $39,086, which is the part of the goal you contribute directly.",
      "Step 4: Interest. The rest of the growth, about $5,914 in total, comes from interest on your starting balance and deposits.",
      "Step 5: Timeline comparison. The table shows about $3,655 a month over one year and $1,151 a month over three years, so a shorter goal needs a much larger monthly amount.",
    ],
    tips: [
      "Automate the transfer on payday so saving happens before spending. Saving what is left at month end rarely works.",
      "Match the account to the timeline. Short goals suit insured savings accounts, not volatile investments that could fall just before you need the money.",
      "Rates change. Revisit the plan when your rate changes, because a lower rate means a higher monthly saving.",
      "Build in a small buffer. Goals often cost more than expected, so aim slightly higher than the figure.",
      NOT_ADVICE,
    ],
    faqs: [
      {
        q: "How much should I save each month?",
        a: "It depends on the goal, the timeline and your budget. Enter the target and time frame, and the calculator tells you the monthly amount needed.",
      },
      {
        q: "Does interest really help with a short goal?",
        a: "A little. Over one to three years, interest is a small share of the total, so most of the goal must come from your own deposits.",
      },
      {
        q: "What if I cannot afford the monthly amount?",
        a: "Try a longer timeline, a smaller goal, or a higher interest account, and see how the table changes. Even a few extra months can lower the monthly figure a lot.",
      },
      {
        q: "Where should I keep savings for a goal?",
        a: "Choose a safe, accessible account such as a high-yield savings account or a certificate of deposit that matches your date. Avoid investments that can fall sharply before you need the money.",
      },
      {
        q: "Should I save for a goal or pay off debt first?",
        a: "Debt with a high interest rate usually costs more than savings earn, so it often makes sense to reduce it first. Keep a small emergency cushion while you do.",
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
      "When you have several debts, the order in which you pay them changes how much interest you pay and how motivated you stay. The avalanche method puts any extra money toward the highest interest rate first. The snowball method targets the smallest balance first, which gives quick wins.",
      "This calculator simulates both methods month by month, using each balance, interest rate and minimum payment. It shows the debt-free time and total interest for each method, and it also shows what would happen if you only paid the minimums, which is the baseline most people are on.",
      "Whichever method you choose, the extra payment matters most. Money you send beyond the minimums cuts both the balance and the interest, and every debt you clear frees its minimum payment to roll into the next one.",
    ],
    steps: [
      "Enter the balance, interest rate and minimum payment for each debt. Use zero for unused rows.",
      "Enter the extra amount you can pay each month above all minimums.",
      "Compare the debt-free time and total interest for each strategy.",
      "Pick the method you can stick with. The best plan is the one you finish.",
    ],
    formula: [
      "Each month: interest = balance × annual rate ÷ 12",
      "Pay each minimum, then send the extra money to the target debt",
      "Avalanche target = highest interest rate. Snowball target = smallest balance.",
      "When a debt is cleared, its minimum payment rolls into the next target",
    ],
    example: [
      "Step 1: The debts. A $4,500 card at 22.9% with a $135 minimum, a $2,800 card at 18.5% with an $84 minimum and a $9,000 loan at 7.5% with a $180 minimum. Total debt is $16,300. Add a $150 extra payment for $549 a month in total.",
      "Step 2: Monthly interest. In month one the card costs $4,500 × 22.9% ÷ 12 = $86, the second card $43 and the loan $56. That is about $185 of interest before any principal is repaid.",
      "Step 3: Avalanche. Extra money goes to the 22.9% card first. Once it is gone, its payments roll into the 18.5% card, then the loan. The avalanche clears everything in about three years with about $3,060 of interest.",
      "Step 4: Snowball. The snowball clears the $2,800 card first, then the $4,500 card, then the loan. It also takes three years but costs about $3,209, which is $149 more.",
      "Step 5: Minimums only. Paying just the minimums takes 5 years and 1 month and costs about $5,705 in interest, so the $150 extra saves about $2,645 in interest with either method.",
    ],
    tips: [
      "Avalanche saves the most interest. Snowball can give faster early wins, which helps some people stay motivated.",
      "Keep making the minimum on every debt to avoid late fees and credit damage.",
      "Stop adding new balances while you pay off the old ones, or the plan will not reduce your total debt.",
      "Consider a lower-rate balance transfer or consolidation loan, but check the fees and the rate after any promotional period.",
      "If your minimum does not cover the monthly interest, the balance grows. Increase the payment before it becomes unmanageable.",
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
        a: "Then the balance grows and the debt is never paid down. The calculator flags this, and you should increase the payment or talk to the lender about a plan.",
      },
      {
        q: "Does this include new purchases?",
        a: "No. It assumes you do not add new charges to the debts, so new spending would lengthen the payoff time.",
      },
      {
        q: "Should I pay debt or invest?",
        a: "Debt with a high interest rate, such as credit cards, usually costs more than typical investment returns, so paying it down first is often sensible. Low-rate debt may be better paired with investing.",
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
      "Comparing a salaried job with an hourly one starts with putting both on the same basis. Dividing a salary by the hours you actually work gives an hourly rate you can compare directly with a job advert or an offer.",
      "This calculator turns an annual salary into an hourly rate using your hours per week and the weeks you are paid each year. It also shows the pay for each common period, daily, weekly, biweekly and monthly, before tax.",
      "The result is only as good as the hours. A salary that looks high can work out to a modest hourly rate if you regularly work unpaid overtime, and an hourly wage can be worth more once paid holidays and benefits are counted. Use the calculator to see the baseline, then look at the full package. Commuting, professional memberships and work clothing reduce what the pay is worth, while paid leave and retirement matching add to it. For a salaried role, unpaid extra hours are the usual gap between the advertised salary and the real hourly rate, so count them honestly.",
    ],
    steps: [
      "Enter the annual salary before tax.",
      "Enter the hours you work in a typical week.",
      "Enter the weeks you are paid each year. Use 52 if holidays and vacation are paid.",
      "Read the hourly rate and the pay for each period.",
    ],
    formula: [
      "Hourly rate = annual salary ÷ (hours per week × weeks per year)",
      "Weekly pay = annual salary ÷ weeks per year",
      "Monthly pay = annual salary ÷ 12",
    ],
    example: [
      "Step 1: Paid hours. A standard full-time year is 40 hours a week for 52 weeks, which is 2,080 hours.",
      "Step 2: Hourly rate. $65,000 ÷ 2,080 hours is $31.25 an hour.",
      "Step 3: Daily and weekly. Over an eight-hour day that is $250 a day, and over a 40-hour week it is $1,250.",
      "Step 4: Biweekly and monthly. Two weeks is $2,500, and dividing the annual salary by 12 gives $5,417 a month.",
      "Step 5: Caveat. These are before tax. If you work 45 unpaid hours a week, the real rate falls to about $27.78 an hour.",
    ],
    tips: [
      "Paid time off still counts toward the 2,080 hours, so use 52 weeks if you are paid for it.",
      "If you regularly work unpaid overtime, use the real hours to see your true hourly rate.",
      "Compare benefits as well as pay. Health insurance, retirement matching and paid leave add real value.",
      "Some salaried roles are paid for a fixed number of weeks rather than 52. Check your contract before you divide.",
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
      {
        q: "Should I use 52 weeks or fewer?",
        a: "Use 52 if you are paid for holidays and vacation. If unpaid time off is common in your job, use the number of weeks you are actually paid.",
      },
      {
        q: "Can I compare a salary with an hourly wage?",
        a: "Yes, once both are on the same hours basis. Add the value of benefits and paid time off to the hourly figure for a fairer comparison.",
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
      "Your salary is not what lands in your bank account. Income taxes, Social Security and Medicare, retirement contributions and health premiums all come out first. Some of those deductions reduce your taxable income, which changes how much tax you pay as well.",
      "This calculator estimates net pay from the effective tax rates you enter. Because tax rules change and vary by state, it does not apply official tax tables. It lets you set the rates yourself, so you can use numbers from your last tax return or your pay stub.",
      "Two numbers matter most: your effective federal and state tax rates, and whether each deduction is taken before or after tax. Getting those right will bring the estimate close to your real paycheck. Your state may have no income tax, a flat rate or a local tax on top, and each of those changes the answer, so enter the rate that actually applies to you.",
    ],
    steps: [
      "Enter your gross salary and how many pay periods you have each year.",
      "Enter your effective federal and state tax rates. You can find them on your last tax return.",
      "Enter Social Security and Medicare, which is usually 7.65% of wages.",
      "Add retirement contributions, health premiums and other deductions, and say whether each is pre-tax.",
    ],
    formula: [
      "Taxable income = gross pay − pre-tax retirement − pre-tax health insurance",
      "Income tax = taxable income × (federal rate + state rate)",
      "Social Security and Medicare = (gross pay − pre-tax health insurance) × FICA rate",
      "Take-home = gross pay − taxes − all deductions",
    ],
    example: [
      "Step 1: Gross. A $75,000 salary paid 26 times a year.",
      "Step 2: Pre-tax deductions. Retirement at 5% is $3,750, and $150 a month for health insurance is $1,800 a year. Taxable income is $75,000 − $3,750 − $1,800 = $69,450.",
      "Step 3: Income taxes. Federal at 13% of $69,450 is about $9,029, and state at 4% is $2,778.",
      "Step 4: Payroll taxes. At 7.65% of $73,200 (salary less health premiums), FICA is about $5,600.",
      "Step 5: Net pay. $75,000 − $9,029 − $2,778 − $5,600 − $3,750 − $1,800 = $52,044 a year, or $4,337 a month and $2,002 per paycheck. That is about 69% of gross pay.",
    ],
    tips: [
      "Use your effective tax rate (total tax divided by taxable income), not your top bracket, because the lower brackets apply to the first part of your income.",
      "Your pay stub shows exact amounts. Use it to refine the rates and check the deductions.",
      "Pre-tax contributions lower your taxable income, so they cost less take-home pay than their face value.",
      "Social Security tax stops above an annual wage limit, so very high earners will pay less than 7.65% on the top portion.",
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
        a: "Common reasons are higher retirement contributions, benefit premiums, or withholding that differs from your actual tax rate.",
      },
      {
        q: "Does this calculator use official tax tables?",
        a: "No. You enter your own effective rates. For exact withholding, use your employer's payroll tools or an official tax calculator.",
      },
      {
        q: "Why does pre-tax versus after-tax matter?",
        a: "A pre-tax deduction lowers the income that is taxed, so it reduces take-home pay by less than the deduction itself. An after-tax deduction reduces take-home pay by the full amount.",
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
      "The 50/30/20 rule is a simple way to plan a budget: about 50% of your after-tax income for needs, 30% for wants, and 20% for savings and extra debt payments. It is a starting point rather than a law, and many households adjust the split to fit their costs.",
      "This calculator gives you the target amount for each category based on your take-home pay, and compares those targets with what you actually spend. It shows the gap in each category, so you can see where to adjust first.",
      "The rule works best with real numbers. Track a month of spending before you set targets, because most people underestimate their wants and overestimate what they save. Start by listing fixed bills, then variable essentials such as groceries and fuel, and only then discretionary spending. Irregular costs, such as car repairs, annual insurance premiums and holiday gifts, are easy to forget, so divide them by twelve and budget a monthly amount for each. A budget that includes them is far more likely to survive a busy month.",
    ],
    steps: [
      "Enter your monthly take-home income after taxes.",
      "Enter what you spend on needs, wants, and savings or extra debt payments.",
      "Compare each category with its 50%, 30% and 20% target.",
      "Adjust the categories that are furthest from their targets.",
    ],
    formula: [
      "Needs target = take-home income × 50%",
      "Wants target = take-home income × 30%",
      "Savings and debt target = take-home income × 20%",
    ],
    example: [
      "Step 1: Targets. On $4,500 a month, the targets are $2,250 for needs, $1,350 for wants and $900 for savings and debt.",
      "Step 2: Actual spending. Suppose you spend $2,600 on needs, $1,300 on wants and $600 on savings.",
      "Step 3: Comparison. Needs are $350 over target, wants are $50 under and savings are $300 under.",
      "Step 4: Priority. The savings gap is the biggest. Moving $300 from wants and needs into savings would bring the split close to the rule.",
      "Step 5: Percentages. Needs are 58% of income, wants 29% and savings 13%, so the budget is over on needs and short on savings.",
    ],
    tips: [
      "In high-cost areas, needs can exceed 50%. Adjust the split to fit, for example 60/20/20, and keep the savings share as high as you can.",
      "Count minimum debt payments as needs and extra debt payments as savings, so the categories reflect where the money goes.",
      "Track your real spending for a month to fill the numbers with facts rather than estimates.",
      "Review the split every few months. Income changes and so do fixed costs such as rent and insurance.",
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
      {
        q: "Should I use gross or take-home income?",
        a: "Use take-home income after taxes and payroll deductions, because that is the money you actually have to spend or save.",
      },
      {
        q: "Is 20% for savings enough?",
        a: "It is a reasonable default. If you have high-interest debt or are behind on retirement, you may want to direct more of the 20% there.",
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
      "An emergency fund is money set aside for job loss, medical bills or urgent repairs, so you do not have to borrow at high interest when something goes wrong. How much you need depends on your essential expenses and how stable your income is.",
      "This calculator sets a target from your essential monthly expenses and the number of months you want covered. It shows how many months your current savings would cover, the shortfall, and how long it will take to close the gap with regular saving and interest.",
      "Only essential spending belongs in the calculation. Rent, food, utilities, transport, insurance and minimum debt payments are essential, while dining out and subscriptions are not, because you can cut them in a crisis. A simple test is to ask whether a bill would still be due if you lost your income next month. If yes, it belongs in the total. A crisis often brings extra costs too, such as travel, childcare or replacing a broken appliance, so a little headroom above the plain expense total is sensible.",
    ],
    steps: [
      "Enter your essential monthly expenses.",
      "Choose how many months of expenses you want covered.",
      "Enter your current savings, your monthly contribution and the interest rate your savings earn.",
      "Read the target, the shortfall and the time needed to reach it.",
    ],
    formula: [
      "Target = essential monthly expenses × months of cover",
      "Months covered today = current savings ÷ essential monthly expenses",
      "Each month: balance = balance × (1 + monthly rate) + monthly contribution",
    ],
    example: [
      "Step 1: Target. Essential expenses of $3,200 a month and a six-month goal give a target of $19,200.",
      "Step 2: Today. $2,500 of savings covers about 0.8 months, so the shortfall is $16,700.",
      "Step 3: Saving. Adding $400 a month at 4% interest, the balance reaches $19,200 in about 3 years and 3 months.",
      "Step 4: Smaller goals. The table shows that three months of cover needs $9,600, leaving a shortfall of $7,100 today.",
      "Step 5: Choice. If your income is steady, six months may be enough. If it is irregular, aim higher, which means a longer build time.",
    ],
    tips: [
      "Count only essentials, not every expense. You can cut the rest in an emergency, and that keeps the target realistic.",
      "Keep the fund in an easily accessible insured account, not in volatile investments that could fall when you need the money.",
      "Self-employed or single-income households may want more than six months, because a gap in income lasts longer.",
      "Build a small starter fund first, then grow it. Even one month of cover is a useful buffer against a common shock.",
      NOT_ADVICE,
    ],
    faqs: [
      {
        q: "How much emergency fund do I need?",
        a: "Many planners suggest three to six months of essential expenses. More is sensible if your income is irregular, you have dependents or your job is less secure.",
      },
      {
        q: "Where should I keep an emergency fund?",
        a: "In a safe, liquid account such as a high-yield savings account, where you can withdraw quickly without market risk.",
      },
      {
        q: "Should I build an emergency fund or pay off debt first?",
        a: "Many people build a small starter fund first, then pay down high-interest debt, then grow the fund. The right order depends on your situation and the interest rate on the debt.",
      },
      {
        q: "What counts as an essential expense?",
        a: "Housing, food, utilities, basic transport, insurance, healthcare and minimum debt payments. Leave out discretionary spending.",
      },
      {
        q: "How often should I update the target?",
        a: "Review it once a year or whenever your expenses change, such as after a move, a new child or a change in income.",
      },
    ],
    related: ["savings-goal-calculator", "budget-50-30-20-calculator", "debt-payoff-calculator"],
    guide: "how-much-emergency-fund",
  },
];
