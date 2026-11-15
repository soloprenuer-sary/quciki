// Writes the editable-content schema into the WordPress plugin, so the plugin can build its edit screens
// from the same definitions the website uses. Run after changing lib/content/entries.ts: npm run wp:export
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const out = mkdtempSync(join(tmpdir(), "quciki-export-"));
execFileSync(
  join(root, "node_modules/.bin/tsc"),
  ["lib/content/entries.ts", "--outDir", out, "--module", "commonjs", "--target", "es2020", "--skipLibCheck", "--moduleResolution", "node"],
  { cwd: root, stdio: "inherit" },
);
const require = createRequire(import.meta.url);
const { allEntries } = require(join(out, "content/entries.js"));
const { CALCULATORS, toolPath } = require(join(out, "calculators.js"));
const { CATEGORIES } = require(join(out, "categories.js"));

const entries = allEntries().map((e) => ({
  key: e.key,
  label: e.label,
  group: e.group,
  path: e.path ?? null,
  review: e.review ?? null,
  seo: e.seo ?? null,
  fields: Object.entries(e.fields).map(([key, f]) => ({ key, ...f, item: f.item ? Object.entries(f.item).map(([k, v]) => ({ key: k, ...v })) : undefined })),
}));

const data = {
  version: 2,
  categories: CATEGORIES.map((c) => ({ slug: c.slug, name: c.name })),
  calculators: CALCULATORS.map((c) => ({ slug: c.slug, name: c.name, category: c.category, path: toolPath(c) })),
  paths: [
    { path: "/", label: "Home page" },
    { path: "/calculators", label: "All calculators" },
    { path: "/guides", label: "Guides index" },
    ...CATEGORIES.map((c) => ({ path: `/${c.slug}`, label: `Category: ${c.name}` })),
    ...CALCULATORS.map((c) => ({ path: toolPath(c), label: `Calculator: ${c.name}` })),
  ],
  entries,
};
const file = join(root, "wordpress/quciki-headless/data/schema.json");
mkdirSync(dirname(file), { recursive: true });
writeFileSync(file, JSON.stringify(data));
console.log(`Wrote ${file}: ${entries.length} editable pages, ${entries.reduce((n, e) => n + e.fields.length, 0)} fields, ${Math.round(JSON.stringify(data).length / 1024)} KB`);
