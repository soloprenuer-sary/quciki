# Quciki

Next.js 16 + Tailwind 4 calculator site (WordPress content backend), built to be SEO-friendly and AdSense-ready.

## Run it

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Admin: WordPress is the backend

Every word, link and menu on the site is edited in WordPress and published to this site (Next.js on Vercel). The site stays fast and static. If WordPress is unreachable, pages already built keep working.

One-time setup (full steps in `wordpress/README.md`):

1. WordPress at `https://tool.akrinity.in` (Hostinger). Upload `wordpress/quciki-headless.zip` (Plugins > Add New > Upload) and activate it. Permalinks: anything but "Plain".
2. WordPress > **Quciki > Settings**: set the Website URL (your Vercel site) and a shared secret (16+ characters).
3. Vercel environment variables: `WORDPRESS_URL=https://tool.akrinity.in` and `REVALIDATE_SECRET` (the same secret). Redeploy.

What you manage in WordPress (**Quciki** menu):

| Menu | What it does |
| --- | --- |
| Pages and text | Site-wide text, Home, About, Contact, index pages, category pages, every calculator page (text, FAQs, input labels and units), Privacy, Terms and Disclaimer. Draft, preview on the site, publish, history. |
| Guides | Block editor, scheduling, featured image. |
| Menus | Header menu and the two footer columns (WordPress Menus screen). |
| Redirects | Published = on, Draft = off. |
| Messages, Subscribers, Saved estimates | Everything visitors submit. Status and notes on messages, CSV export of subscribers. |
| Settings | Website connection, AdSense IDs, Search Console code, contact email, review cycle. |

How publishing works: **Save draft** keeps changes private, **Save and preview on site** shows them on the real website (only for you), **Publish** sends them live in a few seconds without a rebuild. Legal pages cannot be published until a reviewer has signed them off.

What stays in code on purpose: calculator maths and input limits, the sentences and numbers a calculator produces from your inputs, the page layout, and the "Advertisement" label on ads (Google requires it).

Safety:

- Everything from WordPress is validated and HTML is sanitized on the site (scripts, event handlers, iframes and `javascript:` links are removed). Bad values fall back to the built-in text.
- Only published items are sent. Drafts, scheduled and trashed items never leave WordPress.
- A production build fails if WordPress is configured but cannot be read, so a broken deploy never replaces a good site. Set `QUCIKI_ALLOW_BUILD_FALLBACK=1` to build with the built-in text anyway.
- `/api/revalidate`, `/api/preview` and form submissions need the shared secret or a short-lived token.
- Form data (messages, subscribers, estimates) is stored in WordPress, with rate limits and the WordPress personal-data export and erase tools.

When the calculator list or the editable fields change, run `npm run wp:export` and re-zip the plugin.

## Structure

| Path | Purpose |
| --- | --- |
| `lib/calc/engine.ts` | All calculator inputs and math (one place per calculator) |
| `lib/calculators.ts` | SEO copy per calculator: intro, steps, formulas, example, FAQs |
| `lib/guides.ts` | Guide articles |
| `app/calculators/[slug]` | Statically generated calculator pages (metadata, JSON-LD, content) |
| `components/CalculatorClient.tsx` | Generic interactive UI driven by the engine |
| `app/api/*` | Form endpoints, preview and refresh (talk to WordPress) |

## Add a calculator

1. Add a `CalcDef` to `lib/calc/engine.ts` and register it in `CALCS`.
2. Add its metadata and content to `CALCULATORS` in `lib/calculators.ts` (same slug).
3. Run `npm run wp:export` and re-zip the plugin so WordPress can edit the new calculator's text.
4. It gets a page, sitemap entry and links automatically.

## AdSense checklist

- Deploy to your own domain and set `NEXT_PUBLIC_SITE_URL`.
- Keep the About, Contact, Privacy, Terms and Disclaimer pages live.
- Apply in AdSense, then set `NEXT_PUBLIC_ADSENSE_CLIENT` and the slot IDs after approval (the script, `ads.txt` and ad units switch on automatically).
- For EEA/UK traffic, add a Google-certified consent management platform.
- Publish more original guides over time; thin sites get rejected.
