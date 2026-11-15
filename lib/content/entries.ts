import { CALCULATORS, toolPath } from "../calculators";
import { CATEGORIES } from "../categories";
import { CALCS } from "../calc/engine";
import { SITE } from "../site";
import {
  defineEntry, image, list, richtext, text, textarea, url,
  type EntryDef, type Fields,
} from "./types";

/*
 * Tokens usable inside any text: {name} {tagline} {year} {reviewed} {email} {url}.
 * The calculator page also supports {calc} (the calculator's name).
 */

/* ------------------------------ site-wide ------------------------------ */

export const SITE_ENTRY = defineEntry({
  key: "site",
  label: "Site-wide text (brand, header, footer, cookie banner, 404)",
  group: "Site",
  fields: {
    name: text("Site name", SITE.name, { max: 60, section: "Brand", help: "Shown in the header, footer, page titles and search results." }),
    tagline: text("Tagline", SITE.tagline, { max: 160, section: "Brand" }),
    logoText: text("Logo letters", "QC", { max: 3, section: "Brand", help: "Two or three letters shown in the round logo when no logo image is set." }),
    logoImage: image("Logo image", "", { optional: true, section: "Brand", help: "Optional. A square image from the media library. Replaces the logo letters." }),
    reviewed: text("Last reviewed date", SITE.reviewed, { max: 40, section: "Brand", help: "Shown on the home page badge and at the end of each calculator page." }),
    skipLink: text("Skip link", "Skip to content", { max: 40, section: "Header" }),
    menuButton: text("Mobile menu button", "Menu", { max: 20, section: "Header" }),
    homeLabel: text("Breadcrumb: Home", "Home", { max: 30, section: "Header" }),
    footerBlurb: text("Footer description", "{tagline}.", { max: 200, section: "Footer" }),
    footerEmailLabel: text("Footer email label", "Email:", { max: 30, section: "Footer" }),
    footerCalcHeading: text("Footer heading: calculators", "Calculators", { max: 40, section: "Footer" }),
    footerCompanyHeading: text("Footer heading: company", "Company", { max: 40, section: "Footer" }),
    copyright: text("Copyright line", "© {year} {name}. All rights reserved.", { max: 160, section: "Footer" }),
    footerNote: text("Footer notice", "Results are estimates for education only, not financial, legal or engineering advice.", { max: 240, section: "Footer" }),
    consentText: textarea("Cookie banner text", "We use cookies to run the site and to show ads from Google and partners, which may use cookies to personalize ads.", { max: 400, section: "Cookie banner" }),
    consentLinkLead: text("Cookie banner link lead-in", "See our", { max: 30, section: "Cookie banner" }),
    consentLinkLabel: text("Cookie banner link label", "Privacy Policy", { max: 40, section: "Cookie banner" }),
    consentAccept: text("Accept button", "Accept", { max: 20, section: "Cookie banner" }),
    consentDecline: text("Decline button", "Decline", { max: 20, section: "Cookie banner" }),
    notFoundTitle: text("404 title", "Page not found", { max: 80, section: "Page not found" }),
    notFoundText: textarea("404 text", "That page does not exist. Try one of our calculators instead.", { max: 300, section: "Page not found" }),
    notFoundButton: text("404 button", "Browse calculators", { max: 40, section: "Page not found" }),
    openLabel: text("Card link label", "Open →", { max: 30, section: "Common labels" }),
    openCalculatorLabel: text("Popular card link label", "Open calculator →", { max: 40, section: "Common labels" }),
  },
});

export const FORMS_ENTRY = defineEntry({
  key: "forms",
  label: "Newsletter and save-estimate forms",
  group: "Site",
  fields: {
    emailLabel: text("Email field label (for screen readers)", "Email address", { max: 40, section: "Newsletter form" }),
    placeholder: text("Email placeholder", "you@example.com", { max: 60, section: "Newsletter form" }),
    subscribeButton: text("Subscribe button", "Subscribe", { max: 30, section: "Newsletter form" }),
    savingLabel: text("Saving label", "Saving…", { max: 30, section: "Newsletter form" }),
    subscribeSuccess: text("Subscribe success message", "Thanks! You are on the list.", { max: 160, section: "Newsletter form" }),
    genericError: text("Error message", "Something went wrong.", { max: 160, section: "Newsletter form" }),
    saveTitle: text("Save-estimate heading", "Save this estimate and get updates", { max: 120, section: "Save estimate (under results)" }),
    saveButton: text("Save-estimate button", "Save", { max: 30, section: "Save estimate (under results)" }),
    saveSuccess: text("Save-estimate success message", "Saved! We stored your inputs and added you to the list.", { max: 200, section: "Save estimate (under results)" }),
  },
});

export const CALCULATOR_PAGE_ENTRY = defineEntry({
  key: "calculator-page",
  label: "Calculator pages: headings and notes (used on all calculators)",
  group: "Site",
  fields: {
    aboutHeading: text("Heading: about", "About this calculator", { max: 80, section: "Headings" }),
    stepsHeading: text("Heading: steps", "How to use the {calc}", { max: 100, section: "Headings", help: "{calc} is replaced by the calculator name in lower case." }),
    formulaHeading: text("Heading: formulas", "The formulas behind it", { max: 80, section: "Headings" }),
    exampleHeading: text("Heading: worked example", "Worked example", { max: 80, section: "Headings" }),
    tipsHeading: text("Heading: tips", "Tips for getting reliable results", { max: 80, section: "Headings" }),
    faqHeading: text("Heading: FAQs", "Frequently asked questions", { max: 80, section: "Headings" }),
    relatedHeading: text("Heading: related", "Related calculators", { max: 80, section: "Headings" }),
    guideLead: text("Guide link lead-in", "Want the full explanation? Read our guide:", { max: 120, section: "Headings" }),
    updatedLabel: text("Last updated label", "Last updated", { max: 40, section: "Notes" }),
    financeNote: textarea("Note: money calculators", "Results are estimates based on the inputs you provide and simplified assumptions. They are not financial, tax or legal advice.", { max: 400, section: "Notes" }),
    safetyNote: textarea("Note: construction and other calculators", "Results are estimates based on the inputs you provide and typical material values. They are not engineering, construction or safety advice. Call 811 before you dig and check local codes.", { max: 400, section: "Notes" }),
    disclaimerLead: text("Disclaimer link lead-in", "See our", { max: 30, section: "Notes" }),
    disclaimerLabel: text("Disclaimer link label", "disclaimer", { max: 40, section: "Notes" }),
    inputsLabel: text("Inputs panel label (screen readers)", "Calculator inputs", { max: 60, section: "Calculator tool" }),
    sliderSuffix: text("Slider label suffix", "slider", { max: 30, section: "Calculator tool" }),
    resetButton: text("Reset button", "Reset to defaults", { max: 40, section: "Calculator tool" }),
    resultsLabel: text("Results label (screen readers)", "Results", { max: 40, section: "Calculator tool" }),
  },
});

/* ------------------------------ pages ------------------------------ */

export const HOME_ENTRY = defineEntry({
  key: "home",
  label: "Home page",
  group: "Pages",
  path: "/",
  seo: {
    title: `${SITE.name}: Free Calculators for Property, Construction, Finance, Auto and Business`,
    description: "Free calculators with clear explanations: buy vs rent, rental ROI, mortgage and closing costs, gravel and excavation, compound interest and debt payoff, car loans and business pricing.",
  },
  fields: {
    badge: text("Badge", "Free · No sign-up · Updated {reviewed}", { max: 100, section: "Hero" }),
    title: text("Headline", "Run the numbers before you buy, build or invest.", { max: 140, section: "Hero" }),
    text: textarea("Intro", "Clear, honest calculators for property and home projects. Compare buying with renting, check a rental's cash flow, or work out how much gravel, stone or fill you need.", { max: 400, section: "Hero" }),
    primaryLabel: text("Main button label", "Try the Buy vs Rent calculator", { max: 60, section: "Hero" }),
    primaryLink: url("Main button link", "", { optional: true, section: "Hero", help: "Leave empty to link to the first calculator." }),
    secondaryLabel: text("Second button label", "All calculators", { max: 60, section: "Hero" }),
    cardEyebrow: text("Hero card: small heading", "Example · $450K home, 10-year stay", { max: 100, section: "Hero card" }),
    cardTitle: text("Hero card: title", "Break-even point, net worth and monthly cost in one view", { max: 160, section: "Hero card" }),
    cardBullets: list("Hero card: bullet points", { text: text("Bullet", "", { max: 120 }) }, [
      { text: "✓ Mortgage, tax, insurance and upkeep" },
      { text: "✓ Renter's invested down payment" },
      { text: "✓ Year-by-year chart and table" },
    ], { max: 6, section: "Hero card", itemLabel: "Bullet" }),
    categoriesTitle: text("Categories heading", "Browse by category", { max: 80, section: "Sections" }),
    categoryCountLabel: text("Category count label", "calculators", { max: 30, section: "Sections", help: "Shown after the number, for example '8 calculators'." }),
    popularTitle: text("Popular heading", "Popular calculators", { max: 80, section: "Sections" }),
    seeAllLabel: text("See-all link", "See all {count} calculators →", { max: 80, section: "Sections" }),
    benefits: list("Benefit blocks", {
      t: text("Title", "", { max: 80 }),
      d: textarea("Text", "", { max: 240 }),
    }, [
      { t: "Explained, not just answered", d: "Every calculator shows its formula, a worked example and a plain-English guide to the result." },
      { t: "Live results on any screen", d: "Move a slider and the verdict, chart and table update instantly, on desktop or phone." },
      { t: "Private by default", d: "Your inputs are calculated in your browser. Nothing is stored unless you choose to save an estimate." },
    ], { max: 6, section: "Benefits", itemLabel: "Benefit" }),
    guidesTitle: text("Guides heading", "Guides", { max: 80, section: "Guides and newsletter" }),
    guidesLink: text("All-guides link", "All guides →", { max: 40, section: "Guides and newsletter" }),
    newsletterTitle: text("Newsletter heading", "Get new calculators and guides", { max: 100, section: "Guides and newsletter" }),
    newsletterText: textarea("Newsletter text", "One short email when we publish something new. Unsubscribe any time.", { max: 240, section: "Guides and newsletter" }),
  },
});

export const ABOUT_ENTRY = defineEntry({
  key: "about",
  label: "About Us page",
  group: "Pages",
  path: "/about",
  review: "optional",
  seo: { title: "About Us", description: `Who runs ${SITE.name}, how our calculators are built and reviewed by legal advisors and Chartered Accountants, and how we keep them accurate.` },
  fields: {
    kicker: text("Small heading", "About us", { max: 40, section: "Top" }),
    headline: text("Headline", "Free calculators, checked by legal and accounting professionals", { max: 160, section: "Top" }),
    intro: textarea("Intro", "{name} helps people understand the numbers behind property, construction and money decisions. We show the formula and the assumptions behind every result, not just a single figure.", { max: 500, section: "Top" }),
    pillars: list("Three cards", {
      title: text("Title", "", { max: 60 }),
      text: textarea("Text", "", { max: 400 }),
    }, [
      { title: "Built on the math", text: "Each calculator uses a standard, published method, such as amortization for loans, net operating income for rentals and quantity formulas for materials. The formula is shown on the page, so you can check it yourself." },
      { title: "Reviewed by professionals", text: "Our legal advisors review the wording of our terms, privacy, disclaimer and any content that touches contracts, tenancy or property law. Our Chartered Accountants review the finance, tax-related and return calculations." },
      { title: "Kept up to date", text: "Rules, tax thresholds and market rates change. Every page shows the date it was last reviewed, and we update it when a method or rule changes." },
    ], { max: 6, section: "Cards", itemLabel: "Card" }),
    reviewHeading: text("Heading: who checks", "Who checks our work", { max: 80, section: "Who checks" }),
    reviewText: richtext("Text: who checks", "<p>Our content is reviewed by a team of <strong>qualified legal advisors</strong> and a <strong>Chartered Accountant firm</strong>. They do not make decisions for you. They make sure our explanations are accurate, clearly worded and clearly limited.</p>", { section: "Who checks" }),
    stepsHeading: text("Heading: review process", "How each calculator is reviewed", { max: 80, section: "Review process" }),
    steps: list("Review steps", { text: textarea("Step", "", { max: 240 }) }, [
      { text: "A calculator's formula and assumptions are written from a standard source." },
      { text: "A Chartered Accountant checks the financial logic and worked examples." },
      { text: "A legal advisor checks any statements about contracts, tenancy, ownership or compliance." },
      { text: "We publish the page with its review date and a clear limits-of-use note." },
      { text: "Corrections go to the contact form and are fixed as soon as they are verified." },
    ], { max: 10, section: "Review process", itemLabel: "Step" }),
    coverageHeading: text("Heading: what we cover", "What we cover", { max: 80, section: "Coverage" }),
    coverageText: richtext("Text: what we cover", "<p>Real estate calculators such as <a href=\"/real-estate/buy-vs-rent-calculator\">buy vs rent</a>, <a href=\"/real-estate/rental-property-roi-calculator\">rental property ROI</a> and cap rate. Construction calculators for <a href=\"/construction\">materials, drainage and excavation</a>. Personal finance, auto and business calculators, plus <a href=\"/guides\">plain-English guides</a> that explain the ideas behind them.</p>", { section: "Coverage" }),
    noticeHeading: text("Heading: notice", "Important", { max: 60, section: "Notice" }),
    noticeText: richtext("Text: notice", "<p>Our calculators give estimates for education. They are not legal, tax, financial, engineering or construction advice, and they do not replace a professional who knows your situation. Read our <a href=\"/disclaimer\">disclaimer</a>. Questions or corrections? <a href=\"/contact\">Contact us</a>.</p>", { section: "Notice" }),
  },
});

export const CONTACT_ENTRY = defineEntry({
  key: "contact",
  label: "Contact Us page",
  group: "Pages",
  path: "/contact",
  seo: { title: "Contact Us", description: `Contact ${SITE.name} about calculator corrections, feature ideas, privacy requests or advertising enquiries.` },
  fields: {
    kicker: text("Small heading", "Contact", { max: 40, section: "Top" }),
    headline: text("Headline", "How can we help?", { max: 120, section: "Top" }),
    intro: textarea("Intro", "Send us a correction, an idea or a question. Messages go to our team, and we reply by email.", { max: 300, section: "Top" }),
    emailCardTitle: text("Email card heading", "Email us directly", { max: 60, section: "Left column" }),
    emailCardNote: text("Email card note", "Use the form if you want your message tied to a topic.", { max: 160, section: "Left column" }),
    helpCards: list("Help cards", {
      title: text("Title", "", { max: 60 }),
      text: textarea("Text", "", { max: 300 }),
    }, [
      { title: "Corrections", text: "Spotted a wrong number, formula or unclear sentence? Tell us which calculator and what to change. We review each correction before changing a page." },
      { title: "Privacy requests", text: "To ask what data we hold or to request deletion, use this form and choose Privacy. Read our Privacy Policy first." },
      { title: "Ideas", text: "Suggest a calculator or a guide topic. We favour tools that people use to make a real decision." },
    ], { max: 6, section: "Left column", itemLabel: "Card" }),
    helpNote: richtext("Note under the cards", "<p>Looking for an answer? Check the <a href=\"/guides\">guides</a> and the FAQ on each calculator page.</p>", { section: "Left column" }),
    formTitle: text("Form heading", "Send a message", { max: 60, section: "Form" }),
    formNote: text("Form note", "All fields are required. We only use your details to reply to you.", { max: 200, section: "Form" }),
    labelName: text("Label: name", "Name", { max: 30, section: "Form" }),
    labelEmail: text("Label: email", "Email", { max: 30, section: "Form" }),
    labelTopic: text("Label: topic", "What is this about?", { max: 60, section: "Form" }),
    topicPlaceholder: text("Topic placeholder", "Choose a topic", { max: 40, section: "Form" }),
    labelMessage: text("Label: message", "Message", { max: 30, section: "Form" }),
    messagePlaceholder: textarea("Message placeholder", "For a correction, include the calculator name, the line you think is wrong and your source if you have one.", { max: 240, section: "Form" }),
    messageNote: text("Message note", "Up to 4,000 characters. Please don't send personal financial details.", { max: 200, section: "Form" }),
    submitLabel: text("Send button", "Send message", { max: 30, section: "Form" }),
    sendingLabel: text("Sending label", "Sending…", { max: 30, section: "Form" }),
    successMessage: text("Success message", "Thanks! Your message was sent. We will reply to the email you gave us.", { max: 200, section: "Form" }),
    topics: list("Topics in the dropdown", { label: text("Topic", "", { max: 80 }) }, [
      { label: "Correction to a calculator or guide" },
      { label: "Suggest a calculator or feature" },
      { label: "Privacy or data request" },
      { label: "Advertising or partnership" },
      { label: "Legal or copyright notice" },
      { label: "Something else" },
    ], { max: 12, section: "Form", itemLabel: "Topic" }),
  },
});

export const CALCULATORS_INDEX_ENTRY = defineEntry({
  key: "calculators-index",
  label: "All calculators page",
  group: "Pages",
  path: "/calculators",
  seo: { title: "All Calculators", description: `Browse every free calculator on ${SITE.name}, organised by category.` },
  fields: {
    heading: text("Headline", "All calculators", { max: 100 }),
    intro: textarea("Intro", "Each calculator includes the formula, a worked example and answers to common questions, so you understand the result and not just the number.", { max: 400 }),
  },
});

export const GUIDES_INDEX_ENTRY = defineEntry({
  key: "guides-index",
  label: "Guides page",
  group: "Pages",
  path: "/guides",
  seo: { title: "Guides", description: "Plain-English guides to buying vs renting, rental returns, construction quantities, personal finance, cars and business pricing." },
  fields: {
    heading: text("Headline", "Guides", { max: 100 }),
    intro: textarea("Intro", "Short, practical explanations that go with our calculators.", { max: 400 }),
    publishedLabel: text("Published label", "Published", { max: 30 }),
  },
});

/* ------------------------------ legal pages ------------------------------ */

const legal = (key: string, label: string, path: string, title: string, description: string, body: string) =>
  defineEntry({
    key,
    label,
    group: "Legal pages",
    path,
    review: "required",
    seo: { title, description },
    fields: {
      title: text("Page title", title, { max: 100, section: "Page" }),
      body: richtext("Page text", body, { section: "Page" }),
      updatedLabel: text("Fallback label when not reviewed", "Last updated:", { max: 40, section: "Review" }),
      reviewedLabel: text("Label when reviewed", "Last reviewed:", { max: 40, section: "Review" }),
    },
  });

export const PRIVACY_ENTRY = legal(
  "privacy-policy", "Privacy Policy", "/privacy-policy", "Privacy Policy",
  `How ${SITE.name} collects, uses and protects information, including cookies and Google AdSense advertising.`,
  `<p>This policy explains what information {name} ("we", "us") handles when you use {url}.</p>
<h2>Information you enter into calculators</h2>
<p>Calculator inputs are processed in your browser. We do not receive them unless you choose to save an estimate, in which case we store your inputs and email address.</p>
<h2>Information you give us</h2>
<ul>
<li><strong>Email signups and saved estimates:</strong> your email address, and for estimates the numbers you entered. We use this to send the updates you asked for.</li>
<li><strong>Contact form:</strong> your name, email and message, used only to reply to you.</li>
</ul>
<p>This data is stored in our content management system, which is hosted by our hosting provider, and is not sold. To access or delete your data, <a href="/contact">contact us</a>.</p>
<h2>Cookies and advertising</h2>
<p>We use Google AdSense to show ads. Google and its partners may use cookies and similar technologies to serve ads based on your visits to this and other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site and other sites on the Internet.</p>
<p>You can opt out of personalized advertising at <a href="https://adssettings.google.com">Google Ads Settings</a> or visit <a href="https://www.aboutads.info">aboutads.info</a>. Learn how Google uses data at <a href="https://policies.google.com/technologies/partner-sites">policies.google.com/technologies/partner-sites</a>.</p>
<h2>Analytics and server logs</h2>
<p>Our hosting provider may keep standard server logs (such as IP address, browser type and pages requested) for security and performance.</p>
<h2>Your rights</h2>
<p>Depending on where you live (for example the EEA, UK or California) you may have rights to access, correct or delete your personal data and to object to certain processing. Contact us to exercise them.</p>
<h2>Children</h2>
<p>The site is not directed to children under 13 and we do not knowingly collect their data.</p>
<h2>Changes</h2>
<p>We may update this policy. The date above shows the latest revision.</p>`,
);

export const TERMS_ENTRY = legal(
  "terms", "Terms of Use", "/terms", "Terms of Use",
  `Terms of use for ${SITE.name} calculators and content.`,
  `<p>By using {name} you agree to these terms.</p>
<h2>Use of the site</h2>
<p>The calculators and content are provided free for personal, non-commercial information. Do not scrape, overload or misuse the service.</p>
<h2>No advice</h2>
<p>Content is educational and not financial, investment, tax or legal advice. See the <a href="/disclaimer">disclaimer</a>. Consult qualified professionals before making decisions.</p>
<h2>No warranty</h2>
<p>The site is provided "as is" without warranties of any kind. We do not guarantee that results are accurate, complete or suitable for your situation.</p>
<h2>Limitation of liability</h2>
<p>To the extent permitted by law, we are not liable for losses arising from your use of, or reliance on, the site or its calculators.</p>
<h2>Intellectual property</h2>
<p>Site text, design and code are owned by {name}. You may link to pages freely and quote short excerpts with attribution.</p>
<h2>Third-party links and ads</h2>
<p>We are not responsible for third-party websites or advertisements shown on the site.</p>
<h2>Changes</h2>
<p>We may update these terms. Continued use means you accept the updated terms.</p>`,
);

export const DISCLAIMER_ENTRY = legal(
  "disclaimer", "Disclaimer", "/disclaimer", "Disclaimer",
  `${SITE.name} calculators provide estimates for education only and are not financial, tax or legal advice.`,
  `<p>{name} is an educational website. Nothing on this site is financial, investment, tax, legal, real estate, engineering or construction advice, and nothing is an offer or recommendation to buy or sell any property or product.</p>
<h2>Estimates only</h2>
<p>Calculator results depend on the numbers you enter and on simplified assumptions (for example constant rates of appreciation and returns, and no income tax effects). Real outcomes will differ.</p>
<h2>Construction and landscaping tools</h2>
<p>Quantities, weights and prices are typical planning values. Soil, site conditions and suppliers differ. Confirm amounts with your supplier, call 811 before you dig, follow local building codes and permit rules, and use a qualified engineer or contractor for structural, drainage or retaining work.</p>
<h2>Do your own research</h2>
<p>Before making a decision, verify figures with lenders, agents, accountants and local sources, and consult a qualified professional.</p>
<h2>No liability</h2>
<p>We are not responsible for losses or damages resulting from the use of this site's tools or content.</p>`,
);

/* ------------------------------ categories ------------------------------ */

export const categoryEntry = (slug: string) => {
  const c = CATEGORIES.find((x) => x.slug === slug)!;
  return defineEntry({
    key: `category-${c.slug}`,
    label: c.name,
    group: "Category pages",
    path: `/${c.slug}`,
    seo: { title: c.metaTitle, description: c.metaDescription },
    fields: {
      name: text("Page title", c.name, { max: 100 }),
      short: text("Short name (cards and breadcrumbs)", c.short, { max: 40 }),
      tagline: textarea("Tagline", c.tagline, { max: 240 }),
      intro: textarea("Intro", c.intro.join("\n\n"), { max: 2000, help: "Separate paragraphs with a blank line." }),
    },
  });
};

/* ------------------------------ calculators ------------------------------ */

const lines = (a: string[]) => a.join("\n");

export const calcEntry = (slug: string) => {
  const c = CALCULATORS.find((x) => x.slug === slug)!;
  const fields: Fields = {
    name: text("Calculator name", c.name, { max: 100, section: "Page text" }),
    tagline: textarea("Tagline", c.tagline, { max: 300, section: "Page text" }),
    intro: textarea("Intro", c.intro.join("\n\n"), { max: 8000, section: "Page text", help: "Separate paragraphs with a blank line." }),
    steps: textarea("Steps", lines(c.steps), { max: 4000, section: "Page text", help: "One step per line." }),
    formula: textarea("Formulas", lines(c.formula), { max: 4000, section: "Page text", help: "One formula per line." }),
    example: textarea("Worked example", c.example.join("\n\n"), { max: 8000, section: "Page text", help: "Separate paragraphs with a blank line." }),
    tips: textarea("Tips", lines(c.tips), { max: 4000, section: "Page text", help: "One tip per line." }),
    faqs: list("FAQs", { q: text("Question", "", { max: 240 }), a: textarea("Answer", "", { max: 2000 }) }, c.faqs.map((f) => ({ q: f.q, a: f.a })), { max: 20, section: "FAQs", itemLabel: "Question" }),
  };
  const def = CALCS[slug];
  if (def) {
    for (const i of def.inputs) {
      const sec = `Input: ${i.label}`;
      fields[`in_${i.key}_label`] = text("Label", i.label, { max: 80, section: sec });
      fields[`in_${i.key}_help`] = textarea("Help text", i.help ?? "", { max: 240, section: sec, optional: true, help: "Leave empty for no help text." });
      fields[`in_${i.key}_prefix`] = text("Prefix (before the number)", i.prefix ?? "", { max: 6, section: sec, optional: true });
      fields[`in_${i.key}_suffix`] = text("Suffix (after the number)", i.suffix ?? "", { max: 14, section: sec, optional: true });
    }
  }
  return defineEntry({
    key: `calc-${c.slug}`,
    label: c.name,
    group: `Calculators: ${CATEGORIES.find((x) => x.slug === c.category)?.short ?? c.category}`,
    path: toolPath(c),
    review: "optional",
    seo: { title: c.metaTitle, description: c.metaDescription },
    fields,
  });
};

/* ------------------------------ registry ------------------------------ */

export const STATIC_ENTRIES: EntryDef[] = [
  SITE_ENTRY, FORMS_ENTRY, CALCULATOR_PAGE_ENTRY, HOME_ENTRY, ABOUT_ENTRY, CONTACT_ENTRY, CALCULATORS_INDEX_ENTRY, GUIDES_INDEX_ENTRY,
  PRIVACY_ENTRY, TERMS_ENTRY, DISCLAIMER_ENTRY,
] as EntryDef[];

export function allEntries(): EntryDef[] {
  return [
    ...STATIC_ENTRIES,
    ...CATEGORIES.map((c) => categoryEntry(c.slug) as EntryDef),
    ...CALCULATORS.map((c) => calcEntry(c.slug) as EntryDef),
  ];
}

const registry = new Map<string, EntryDef>();
export function entryDef(key: string): EntryDef | undefined {
  if (!registry.size) for (const e of allEntries()) registry.set(e.key, e);
  return registry.get(key);
}
