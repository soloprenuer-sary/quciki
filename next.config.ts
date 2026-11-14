import type { NextConfig } from "next";

const LEGACY_SLUGS = [
  "buy-vs-rent-calculator",
  "rental-property-roi-calculator",
  "real-estate-roi-calculator",
  "cap-rate-calculator",
  "cash-on-cash-return-calculator",
  "fix-and-flip-calculator",
  "closing-costs-calculator",
  "commercial-noi-calculator",
  "property-tax-calculator",
  "hard-money-loan-calculator",
  "refinance-calculator",
  "home-equity-calculator",
  "mortgage-comparison-calculator",
];

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      // Old flat URLs from before categories. Only these real estate slugs ever existed at /calculators/.
      {
        source: `/calculators/:slug(${LEGACY_SLUGS.join("|")})`,
        destination: "/real-estate/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
