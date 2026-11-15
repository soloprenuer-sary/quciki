# Quciki WordPress backend

The `quciki-headless` plugin turns WordPress into the content admin for the Quciki website.
WordPress is never shown to visitors. The Next.js site reads one public JSON endpoint and rebuilds
the affected pages when you publish.

## Install

1. Use any WordPress host (PHP 7.4+). Use HTTPS. Keep WordPress, PHP and plugins updated, and turn on two-step login for every editor.
2. Plugins > Add New > Upload Plugin > choose `quciki-headless.zip` > Activate.
3. Settings > Permalinks: choose any option other than "Plain" (the REST API needs pretty permalinks).
4. Open **Quciki > Settings**:
   - **Website URL**: your Vercel address, for example `https://quciki.vercel.app`.
   - **Refresh secret**: a random string of 16+ characters. Use the same value as `REVALIDATE_SECRET` in Vercel.
   - Contact email, AdSense IDs and Search Console code (all public values).
5. In Vercel add `WORDPRESS_URL` (your WordPress address) and `REVALIDATE_SECRET`, then redeploy.
6. Check `https://YOUR-WORDPRESS/wp-json/quciki/v1/content` loads JSON in a browser.

## Day-to-day

| Menu | Use it for |
| --- | --- |
| Quciki > Guides | New guides. The permalink slug becomes `/guides/<slug>`. Use Heading 2 for sections. Excerpt = description. |
| Quciki > Calculator text | Pick a calculator, then edit its text. Empty boxes keep the built-in text. |
| Quciki > Legal pages | Privacy Policy, Terms, Disclaimer. Set "Reviewed by" and the review date. |
| Quciki > SEO overrides | Title, description, canonical, social image, noindex for any page path. |
| Quciki > Redirects | From and to paths. Published = on, Draft = off. |

Publishing, scheduling, updating or trashing refreshes the website within seconds.
If the website URL or secret is missing, the pages refresh within an hour instead.

## Roles

Use WordPress roles. Editors can write everything. Only Administrators can open Quciki > Settings.
Give the legal advisors and the CA firm an Editor account each so each person has their own login. WordPress keeps revisions of guide and legal page text.

## Security notes

- Only published items are exposed. Drafts, scheduled posts and trash are not.
- The settings endpoint data never includes the refresh secret or the website URL.
- Do not put secrets in any Quciki field. All Quciki Settings values are public.
- The website sanitizes all HTML it receives, so a compromised editor cannot add scripts to pages. Still, use strong passwords and two-step login.
- WordPress pages themselves are set to noindex so search engines only see the website.

## When the calculator list changes

From the website project run `npm run wp:export`, then re-zip `wordpress/quciki-headless` so the dropdowns list the new calculators.
