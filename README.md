# Quciki

Next.js 16 + Tailwind 4 + Supabase real estate calculator site, built to be SEO-friendly and AdSense-ready.

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

## Admin (blog, SEO, calculator text, redirects, settings)

The admin lives at `/admin`. It is built into this site and uses your Supabase project for sign-in and storage.

One-time setup:

1. Run `supabase/schema.sql`, then `supabase/admin.sql` in the Supabase SQL editor.
2. Supabase Dashboard > Authentication > Providers > Email: **turn off "Allow new users to sign up"**.
3. Authentication > Users > **Add user** with your email and a strong password.
4. In the SQL editor run: `insert into public.admin_users (email) values ('you@example.com');`
5. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`, restart, and open `/admin`.

What you can manage:

| Area | What it does |
| --- | --- |
| Guides | Write, draft, schedule and publish guides in Markdown with live preview and image upload. Import the built-in guides to edit them. |
| SEO | Override title, meta description, canonical, social image and noindex for any page, with a search-result preview and length counters. |
| Calculator text | Edit the intro, steps, formulas text, worked example, tips and FAQs. The calculator math stays in code. |
| Redirects | Add 301/307 redirects without redeploying (cached for up to a minute). |
| Media | Upload images (PNG, JPG, WebP, GIF, up to 5 MB). |
| Settings | AdSense publisher and ad unit IDs, Search Console verification code, contact email. |

How it stays safe:

- Only emails in `admin_users` can write. This is enforced by database Row Level Security, not only by the app, and every server action re-checks it.
- The public site reads only published content. Drafts and future-dated guides are invisible to visitors.
- Guide bodies are Markdown. Raw HTML is ignored, and `javascript:` and other unsafe links are blocked.
- `/admin` is `noindex`, disallowed in `robots.txt`, and uncached.
- `site_settings` is publicly readable, so never store secrets there.

How content flows: built-in content lives in code; anything saved in the admin overrides it. Public pages are statically generated and refresh immediately when you save, and scheduled guides appear within an hour.

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
