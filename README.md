# Quciki

Next.js 16 + Tailwind 4 calculator site (WordPress content backend, Supabase for forms), built to be SEO-friendly and AdSense-ready.

## Run it

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Supabase setup

1. Create a project at supabase.com.
2. Run `supabase/schema.sql` in the SQL editor (creates `subscribers`, `saved_estimates`, `contact_messages` with insert-only RLS).
3. Put the project URL and anon key in `.env.local`.

Without these variables the site still works; the save/subscribe/contact forms show "not configured yet".

## Admin: WordPress is the backend

Content is managed in WordPress and published to this site through one JSON endpoint. The site (Next.js on Vercel) stays fast and static. If WordPress is unreachable, the site keeps serving its built-in content.

One-time setup (full steps in `wordpress/README.md`):

1. Install WordPress on any host and upload `wordpress/quciki-headless.zip` (Plugins > Add New > Upload), then activate it.
2. In WordPress open **Quciki > Settings**. Set the Website URL and a Refresh secret (16+ characters).
3. In Vercel add `WORDPRESS_URL` (your WordPress address) and `REVALIDATE_SECRET` (the same secret), then redeploy.

What you manage in WordPress:

| Area | What it does |
| --- | --- |
| Guides | Write in the block editor. Publish, schedule or draft. Category, related calculator, excerpt as description, featured image. |
| Calculator text | Tagline, intro, steps, formulas text, worked example, tips and FAQs. The calculator maths stays in code. |
| Legal pages | Privacy Policy, Terms and Disclaimer, with a reviewer name and review date shown on the page. |
| SEO overrides | Title, description, canonical, social image and noindex for any page. Guides and legal pages have their own SEO box. |
| Redirects | Published = on, Draft = off. Applied within about a minute. |
| Settings | AdSense IDs, Search Console code, contact email. |

How it stays safe:

- Everything from WordPress is validated and HTML is sanitized on the site (scripts, event handlers, iframes and `javascript:` links are removed).
- Only published items are sent. Drafts, scheduled and trashed items never leave WordPress.
- `/api/revalidate` refreshes pages only with the shared secret.
- Contact messages, subscribers and saved estimates stay in Supabase (`supabase/schema.sql`), not in WordPress.

When the calculator list changes, run `npm run wp:export` and re-zip the plugin so the WordPress dropdowns stay current.

## Structure

| Path | Purpose |
| --- | --- |
| `lib/calc/engine.ts` | All calculator inputs and math (one place per calculator) |
| `lib/calculators.ts` | SEO copy per calculator: intro, steps, formulas, example, FAQs |
| `lib/guides.ts` | Guide articles |
| `app/calculators/[slug]` | Statically generated calculator pages (metadata, JSON-LD, content) |
| `components/CalculatorClient.tsx` | Generic interactive UI driven by the engine |
| `app/api/*` | Supabase-backed forms |

## Add a calculator

1. Add a `CalcDef` to `lib/calc/engine.ts` and register it in `CALCS`.
2. Add its metadata and content to `CALCULATORS` in `lib/calculators.ts` (same slug).
3. It gets a page, sitemap entry and links automatically.

## AdSense checklist

- Deploy to your own domain and set `NEXT_PUBLIC_SITE_URL`.
- Keep the About, Contact, Privacy, Terms and Disclaimer pages live.
- Apply in AdSense, then set `NEXT_PUBLIC_ADSENSE_CLIENT` and the slot IDs after approval (the script, `ads.txt` and ad units switch on automatically).
- For EEA/UK traffic, add a Google-certified consent management platform.
- Publish more original guides over time; thin sites get rejected.
