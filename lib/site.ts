export const SITE = {
  name: "Quciki",
  tagline: "Free calculators for property, construction and home projects",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@example.com",
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "", // e.g. ca-pub-1234567890123456
  reviewed: "November 2026",
};

export const abs = (path: string) => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
