import type { Guide } from "../guides";

export const AUTO_GUIDES: Guide[] = [
  {
    slug: "car-loan-term-and-interest",
    category: "auto",
    title: "Car Loan Terms Explained: How Length and Rate Change What You Pay",
    description:
      "How loan term, interest rate, down payment and trade-in change your car payment and total cost, and how to avoid owing more than the car is worth.",
    published: "2026-11-13",
    calculator: "car-loan-calculator",
    sections: [
      {
        h: "What makes up a car payment",
        p: [
          "Your payment is set by the amount you finance, the interest rate and the number of months. The amount financed is the price plus tax and fees, minus your down payment and trade-in.",
        ],
      },
      {
        h: "Longer terms cost more",
        p: [
          "Stretching a loan over 72 or 84 months lowers the monthly payment, but you pay interest for longer and total interest rises substantially. Longer loans also make it more likely you owe more than the car is worth for several years.",
        ],
      },
      {
        h: "Put more down and shop for rates",
        p: [
          "A larger down payment cuts the amount financed and the interest. Getting a pre-approved loan from a bank or credit union gives you a rate to compare with the dealer's offer.",
        ],
      },
      {
        h: "Look at the total, not only the payment",
        p: [
          "A low monthly payment can hide a high total cost. Compare total interest and the full cost of the vehicle, and check that the payment fits comfortably in your budget along with insurance, fuel and maintenance.",
        ],
      },
    ],
  },
  {
    slug: "car-lease-money-factor-and-residual",
    category: "auto",
    title: "Car Leasing Explained: Money Factor, Residual Value and Payments",
    description:
      "How a car lease payment is built from depreciation and finance charges, what money factor and residual value mean, and how to compare a lease with buying.",
    published: "2026-11-13",
    calculator: "auto-lease-calculator",
    sections: [
      {
        h: "What you pay for in a lease",
        p: [
          "A lease payment has two main parts. Depreciation is the difference between the car's price and its expected value at the end, spread over the term. The finance charge is what the lessor charges for tying up its money. Tax is added on top.",
        ],
      },
      {
        h: "Money factor and residual value",
        p: [
          "The money factor is the lease's interest rate in decimal form. Multiply it by 2,400 to get a rough APR. The residual value is the car's expected worth at the end, normally a percentage of MSRP. A higher residual means less depreciation to pay for.",
        ],
      },
      {
        h: "Negotiate the price, not just the payment",
        p: [
          "The capitalized cost is the price used to calculate the lease, and it is negotiable. Lowering it reduces the payment, so negotiate it as you would the price of a car you are buying.",
        ],
      },
      {
        h: "Leasing versus buying",
        p: [
          "Leasing usually has lower payments and lets you drive a newer car, but you build no equity and face mileage and wear limits. Buying costs more per month but you own the car, which can be cheaper over many years.",
        ],
      },
    ],
  },
  {
    slug: "ev-vs-gas-running-costs",
    category: "auto",
    title: "EV vs Gas Running Costs: How to Compare Fuel and Charging",
    description:
      "How to compare electric and gas vehicle running costs, including home charging, public fast charging, charging losses and fuel prices.",
    published: "2026-11-13",
    calculator: "ev-charging-cost-calculator",
    sections: [
      {
        h: "Cost per mile is the key number",
        p: [
          "For a gas car, cost per mile is the fuel price divided by miles per gallon. For an EV, it is the electricity price divided by miles per kWh, adjusted for charging losses. Comparing these two numbers shows the fuel saving.",
        ],
      },
      {
        h: "Where you charge matters",
        p: [
          "Home charging at typical residential rates is usually the cheapest. Public fast charging can cost two to three times as much per kWh, so drivers who rely on it get much smaller savings.",
        ],
      },
      {
        h: "Things that change the result",
        p: [
          "Cold weather, high speeds and short trips reduce EV efficiency. Gas prices and electricity rates vary by region and over time, so test a range of prices instead of one forecast.",
        ],
      },
      {
        h: "Beyond fuel",
        p: [
          "Fuel is only part of ownership. Compare purchase price, incentives, insurance, maintenance and depreciation to see the real total cost of each option.",
        ],
      },
    ],
  },
  {
    slug: "car-depreciation-explained",
    category: "auto",
    title: "Car Depreciation Explained: Why Cars Lose Value and How to Limit It",
    description:
      "Why new cars lose value so quickly, how depreciation changes over time, and practical ways to reduce the cost of ownership.",
    published: "2026-11-13",
    calculator: "car-depreciation-calculator",
    sections: [
      {
        h: "The biggest cost you do not see",
        p: [
          "Depreciation is the fall in a car's value over time. It does not appear on a bill, but for many owners it is the largest single cost of owning a new car.",
        ],
      },
      {
        h: "A steep first year, then a slower slide",
        p: [
          "Cars often lose a fifth of their value or more in the first year and a smaller share each year after. This is why buying a used car, one to three years old, can be a good value.",
        ],
      },
      {
        h: "What affects it",
        p: [
          "Make and model reputation, mileage, condition, color, trim and market demand all influence resale value. Check recent sales of similar cars to estimate real numbers.",
        ],
      },
      {
        h: "How to limit it",
        p: [
          "Choose models known for holding value, keep mileage reasonable, keep maintenance records and consider keeping the car for longer, so the early steep loss is spread over more years.",
        ],
      },
    ],
  },
];
