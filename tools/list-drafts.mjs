// Lists every piece of copy still wrapped in <Placeholder> or <PlaceholderSection> —
// wording we drafted that the client has not confirmed, or a section only the client
// can supply. Governance: M0-05a/b/c (placeholder-module-wiring-contract.md).
// Run: npm run drafts
//
// A file that renders markers on purpose — e.g. a pattern's documentation page
// showing live examples — opts out with a `drafts:ignore-file` comment anywhere
// in it. Never use that on real site content.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(rootDir, "src");

const walk = async (dir) => {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
};

const files = await walk(srcDir);
let total = 0;
for (const file of files) {
  if (/(^|[\\/])(Placeholder|PlaceholderSection)(\.test)?\.tsx$/.test(file)) continue;
  const text = await fs.readFile(file, "utf-8");
  if (text.includes("drafts:ignore-file")) continue;
  const lines = text.split("\n");
  const hits = [];
  lines.forEach((line, i) => {
    // Exact component tags only — `<PlaceholderStandardPage />` and similar names must not match.
    if (/<Placeholder(Section)?(?=[\s/>]|$)/.test(line)) hits.push(i + 1);
  });
  if (!hits.length) continue;
  console.log(`\n  ${path.relative(rootDir, file)}`);
  for (const lineNo of hits) {
    const snippet = lines
      .slice(lineNo - 1, lineNo + 3)
      .join(" ")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 96);
    console.log(`    line ${lineNo}: ${snippet}…`);
    total += 1;
  }
}

console.log(
  total === 0
    ? "\n[drafts] Nothing unconfirmed — every claim on the site is the client's own.\n"
    : `\n[drafts] ${total} passage(s) still awaiting the client's confirmation.\n` +
        "[drafts] <Placeholder> = wording we drafted; remove the wrapper once the client confirms it.\n" +
        "[drafts] <PlaceholderSection> = a section only the client can fill; remove it once they send the content.\n",
);
