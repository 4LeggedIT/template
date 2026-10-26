// Governance check: standards-page-contract.md. Every pattern page under src/pages/standards
// (`*StandardPage.tsx` / `*PatternPage.tsx`) must carry the two blocks that keep the standards
// consistent: a "Snippet" section (<StandardSnippet code={...} />: import, component with its
// required props, one sample data entry) and the "Standard" rules card (`<ns>:standard.title`).
// Overview/workflow pages that do not document a pattern are not named that way and are not checked.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pagesDir = path.join(projectRoot, "src", "pages", "standards");

const failures = [];
const pages = fs.readdirSync(pagesDir).filter((name) => /(StandardPage|PatternPage)\.tsx$/.test(name));

for (const name of pages) {
  const source = fs.readFileSync(path.join(pagesDir, name), "utf8");
  if (!/<StandardSnippet\b[^>]*\bcode=/.test(source)) failures.push(`${name}: missing the Snippet section (<StandardSnippet code={...} />)`);
  if (!/:standard\.title"/.test(source)) failures.push(`${name}: missing the Standard rules card (t("<ns>:standard.title"))`);
}

if (failures.length) {
  console.error(`check-standards-pages: ${failures.length} problem(s) in ${pages.length} standards pages\n- ${failures.join("\n- ")}`);
  console.error("See internal-tools/4leggedit-websites/docs/governance/standards-page-contract.md");
  process.exit(1);
}
console.log(`check-standards-pages: ${pages.length} standards pages OK`);
