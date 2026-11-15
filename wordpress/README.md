# Quciki WordPress backend (Hostinger)

The `quciki-headless` plugin turns WordPress into the admin for the whole Quciki website: every page, menu, guide,
SEO field, redirect and setting, plus the inbox for messages, subscribers and saved estimates.
Visitors never see WordPress. The website (Next.js on Vercel) reads one public JSON endpoint and refreshes
when you publish.

## Install on Hostinger (tool.akrinity.in)

1. In hPanel, make sure `tool.akrinity.in` runs WordPress over HTTPS (free SSL), PHP 7.4 or newer.
2. WordPress admin > Settings > Permalinks: choose "Post name" (anything except "Plain").
3. Plugins > Add New > Upload Plugin > `quciki-headless.zip` > Activate.
4. **Quciki > Settings**:
   - **Website URL**: your Vercel address, for example `https://quciki.vercel.app` (no trailing slash).
   - **Shared secret**: 16 or more characters, using ONLY letters, numbers, `-` and `_` (WordPress removes anything else, which would make it differ from Vercel). Use exactly the same value as `REVALIDATE_SECRET` in Vercel.
   - Contact email, AdSense IDs and Search Console code (public values).
   - Optional: "Email me about new messages".
5. In Vercel add `WORDPRESS_URL=https://tool.akrinity.in` and `REVALIDATE_SECRET`, then redeploy.
6. Open `https://tool.akrinity.in/wp-json/quciki/v1/content` in a browser. You should see JSON.
7. **Appearance > Menus**: create the header menu and the two footer menus (use Custom Links such as `/guides`),
   then assign them under "Manage Locations". Until you do, the website uses its built-in menus.

### Hostinger checklist

- If you use a caching plugin or Hostinger's LiteSpeed cache, exclude `/wp-json/quciki/` from caching.
- If a firewall, Cloudflare or "Under attack" mode challenges visitors, allow requests to `/wp-json/quciki/`
  (the website server calls them with no browser).
- Turn on automatic WordPress and plugin updates and Hostinger backups.
- Use strong passwords and two-step login for every account.
- Hide the default login if you can (a security plugin), and delete unused plugins and themes.

**After saving Settings, WordPress tests the connection** and tells you in plain words if the website accepted the
secret, rejected it, or could not be reached. If forms say "Could not save", open Settings and save again to see why.

## Yoast SEO or Rank Math

You can install either one. They work like this here:

- **Guides**: the Yoast / Rank Math box (focus keyword, analysis, title, description, canonical, social image, noindex)
  appears on guides and what you save there is sent to the website. If neither plugin is installed, a simple
  "Search appearance" box is shown instead.
- **All other pages** (Home, About, calculators, categories, legal pages): these are not WordPress posts, so the SEO
  plugins cannot see them. Use the **Search appearance (SEO)** section on each Quciki page editor.
- The public website is built by Next.js, which creates its own sitemap, robots.txt and structured data. The SEO plugins'
  sitemaps, schema and redirect modules only affect WordPress itself (which is set to noindex), so you can switch them off.
  Manage redirects under Quciki > Redirects.
- Title variables such as `%%sitename%%` (Yoast) or `%sitename%` (Rank Math) are filled in with the site name from
  Quciki > Pages and text > Site-wide text.

## Day to day

| Menu | Use it for |
| --- | --- |
| Quciki > Pages and text | Everything on the site. Pick a page, change text, **Save draft**, **Save and preview on site**, **Publish to website**. |
| Quciki > Guides | New guides in the block editor. Use Heading 2 for sections. Excerpt = description. |
| Quciki > Menus | Header and footer menus. |
| Quciki > Redirects | From and to paths. Published = on, Draft = off. |
| Quciki > Messages | Contact form messages: status, internal note. |
| Quciki > Subscribers | Newsletter signups. Download them as CSV. |
| Quciki > Saved estimates | Estimates visitors saved from calculators. |

- "Pages and text" starts from the text built into the website. Change only what you want. A page you never touch keeps
  its built-in text, and a field set back to its default is not stored.
- Use `{name}`, `{year}`, `{reviewed}`, `{email}`, `{url}` and `{tagline}` inside text. They fill in automatically.
- **Reset to default text** on any page returns it to the built-in text. The old version stays in History.

## Roles and review

| Role | Can do |
| --- | --- |
| Administrator | Everything, including Settings and Menus |
| Editor | Write, preview and publish pages and guides, handle messages and subscribers |
| Quciki reviewer (new role) | Write and save drafts, sign off Reviewer name and date. Cannot publish. |
| Author and below | No access to Quciki pages |

Legal pages (Privacy, Terms, Disclaimer) need a reviewer name and date before they can be published. If anyone other
than a reviewer changes the text afterwards, the sign-off is cleared and must be given again. Give the legal advisors
and the CA firm the "Quciki reviewer" role. About and calculator pages have an optional sign-off that shows on the page.

## What stays in code

Calculator formulas and limits, the sentences a calculator produces from your numbers, the page layout, and the
"Advertisement" label on ads. Everything else is editable.

## Security notes

- Only published items are exposed. Drafts, scheduled posts and trash are not.
- Settings sent to the website never include the shared secret or the website URL.
- Do not put secrets in any Quciki field. Settings values are public.
- The website sanitizes all HTML, so a compromised editor account cannot add scripts to pages.
- Form submissions are accepted only from the website server (shared secret), are rate limited, and are covered by
  WordPress Tools > Export / Erase Personal Data.
- WordPress pages themselves are set to noindex.

## When the code changes

After changing editable text in `lib/content/entries.ts` or the calculator list, run `npm run wp:export` in the website
project and re-zip `wordpress/quciki-headless`.
