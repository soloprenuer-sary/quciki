// Writes wordpress/quciki-headless/data/site-data.json from the calculator and category definitions,
// so the WordPress plugin can offer valid calculator slugs and page paths. Run: npm run wp:export
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const out = mkdtempSync(join(tmpdir(), "quciki-export-"));
execFileSync(
  join(root, "node_modules/.bin/tsc"),
  ["lib/calculators.ts", "lib/categories.ts", "--outDir", out, "--module", "commonjs", "--target", "es2020", "--skipLibCheck", "--moduleResolution", "node"],
  { cwd: root, stdio: "inherit" },
);
const require = createRequire(import.meta.url);
const { CALCULATORS, toolPath } = require(join(out, "calculators.js"));
const { CATEGORIES } = require(join(out, "categories.js"));

const data = {
  categories: CATEGORIES.map((c) => ({ slug: c.slug, name: c.name })),
  calculators: CALCULATORS.map((c) => ({ slug: c.slug, name: c.name, category: c.category, path: toolPath(c) })),
  paths: [
    { path: "/", label: "Home page" },
    { path: "/calculators", label: "All calculators" },
    { path: "/guides", label: "Guides index" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact Us" },
    ...CATEGORIES.map((c) => ({ path: `/${c.slug}`, label: `Category: ${c.name}` })),
    ...CALCULATORS.map((c) => ({ path: toolPath(c), label: `Calculator: ${c.name}` })),
  ],
};
const file = join(root, "wordpress/quciki-headless/data/site-data.json");
writeFileSync(file, JSON.stringify(data, null, 1) + "\n");
console.log(`Wrote ${file}: ${data.calculators.length} calculators, ${data.paths.length} paths`);
