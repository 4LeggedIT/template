// SHARED PATTERN: do not edit in a site repo.
// Source: github.com/4LeggedIT/internal-tools
//   4leggedit-websites/templates-sources/tools/check-seo-meta.mjs
// Change it there, then sync it to every site.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// check-seo-meta.mjs
//
// Post-prerender SEO gate. Reads every dist/**/index.html and enforces the
// rules Bing Webmaster "Recommendations" flags:
//
//   M0-13  <meta name="description"> exactly once, 100..160 chars, unique
//          per page (Bing floor is ~100; target 150-160 where content allows)
//   M0-11  <title> present, non-empty, at least 20 chars (Bing rule 114, "title too short")
//          and unique across indexable pages (Bing rule 113, "identical titles"),
//          with no repeated segment ("Page | Org | Org")
//   M0-xx  every <img> has a non-empty alt (decorative images must carry
//          aria-hidden="true" to be exempt)
//
//   M0-22  every PDF under dist/ has a descriptive /Title (Bing rule 121). Rejects
//          empty, "Page not found", and filename-like titles. Needs qpdf; skipped
//          with a notice when qpdf is not installed. The PDF /Author must equal
//          siteName from src/config/site.ts (the organization, never a person).
//
// Pages with <meta name="robots" content="...noindex..."> are skipped.
//
// Usage:
//   node tools/check-seo-meta.mjs                 # strict, exit 1 on failure
//   node tools/check-seo-meta.mjs --report        # print findings, exit 0
//   node tools/check-seo-meta.mjs --dist <dir>    # audit another dist dir
//   node tools/check-seo-meta.mjs --json          # machine-readable output
//
// Do not edit locally in a client-site repo; change it in internal-tools
// templates-sources/tools and propagate.
// ---------------------------------------------------------------------------

const MIN_DESC = 100;
const MAX_DESC = 160;
const MIN_TITLE = 20; // Bing rule 114 flagged a 17-char title; 23-char titles pass. Floor is a working value, revisit with more Bing data.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const distIdx = argv.indexOf("--dist");
const distRoot = path.resolve(distIdx >= 0 ? argv[distIdx + 1] : path.join(__dirname, "..", "dist"));
const reportOnly = flag("--report");
const asJson = flag("--json");

const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const walk = (dir) => {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else if (e.name === "index.html") out.push(full);
  }
  return out;
};

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  return m ? (m[2] ?? m[3]) : null;
};

if (!fs.existsSync(distRoot)) {
  console.error(`check-seo-meta: dist not found: ${distRoot} (run the build first)`);
  process.exit(reportOnly ? 0 : 1);
}

const findings = [];
const warnings = [];
const seenDesc = new Map();
const seenTitle = new Map();
// "Page - Org | Org" / "Page | Org | Org": the same segment twice, i.e. the organization name appended
// by SEOHead on top of a title that already ends with it. A headline that merely mentions the
// organization ("Adoption Event for Example Rescue | Example Rescue") is not flagged.
const repeatedSegment = (t) => {
  const segs = t.split(/\s+[|\u2013\u2014-]\s+/).map((x) => x.trim().toLowerCase()).filter(Boolean);
  return new Set(segs).size !== segs.length;
};
const pages = walk(distRoot);

for (const file of pages) {
  const html = fs.readFileSync(file, "utf8");
  const route = "/" + path.relative(distRoot, path.dirname(file)).split(path.sep).join("/");
  const head = html.match(/<head[\s\S]*?<\/head>/i)?.[0] ?? html;
  const metas = head.match(/<meta\b[^>]*>/gi) ?? [];

  // Any robots tag with noindex wins (some pages carry both the site default and a page-level tag).
  const noindex = metas.some(
    (m) => (attr(m, "name") ?? "").toLowerCase() === "robots" && /noindex/i.test(attr(m, "content") ?? ""),
  );
  if (noindex) continue;

  const add = (rule, detail) => findings.push({ route, rule, detail });
  // Warnings are reported but never fail the gate (over-160
  // descriptions are not remediated; Bing does not flag them).
  const warn = (rule, detail) => warnings.push({ route, rule, detail });

  const descs = metas.filter((m) => (attr(m, "name") ?? "").toLowerCase() === "description");
  if (descs.length === 0) add("M0-12", "no meta description");
  else {
    if (descs.length > 1) add("M0-12", `${descs.length} meta description tags`);
    const text = decode(attr(descs[0], "content") ?? "").trim();
    if (text.length < MIN_DESC) add("M0-13", `description ${text.length} chars (< ${MIN_DESC}): ${text}`);
    else if (text.length > MAX_DESC) warn("M0-13", `description ${text.length} chars (> ${MAX_DESC}, warning only)`);
    if (text) {
      const prev = seenDesc.get(text);
      if (prev) add("M0-13", `duplicate description (also ${prev})`);
      else seenDesc.set(text, route);
    }
  }

  const title = head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const titleText = title ? decode(title[1]).trim() : "";
  if (!titleText) add("M0-11", "missing or empty <title>");
  else {
    if (repeatedSegment(titleText)) add("M0-11", `title repeats a segment (organization name doubled?): ${titleText}`);
    if (titleText.length < MIN_TITLE) add("M0-11", `title ${titleText.length} chars (< ${MIN_TITLE}): ${titleText}`);
    const prevTitle = seenTitle.get(titleText);
    if (prevTitle) add("M0-11", `duplicate title (also ${prevTitle}): ${titleText}`);
    else seenTitle.set(titleText, route);
  }

  const body = html.slice(html.search(/<body/i) >= 0 ? html.search(/<body/i) : 0);
  for (const img of body.match(/<img\b[^>]*>/gi) ?? []) {
    if (/\saria-hidden\s*=\s*["']true["']/i.test(img)) continue;
    const alt = attr(img, "alt");
    if (alt === null || !alt.trim()) {
      add("IMG-ALT", `${alt === null ? "missing" : "empty"} alt: ${(attr(img, "src") ?? "?").slice(0, 80)}`);
    }
  }
}

// ---- PDF /Title --------------------------------------------------------------
const walkPdf = (dir) => {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkPdf(full));
    else if (/\.pdf$/i.test(e.name)) out.push(full);
  }
  return out;
};
const pdfs = walkPdf(distRoot);
const seenPdfTitle = new Map();
let orgName = "";
try {
  orgName = fs.readFileSync(path.join(__dirname, "..", "src", "config", "site.ts"), "utf8").match(/siteName:\s*"([^"]+)"/)?.[1] ?? "";
} catch {
  /* no site config: skip the author check */
}
let pdfSkipped = false;
if (pdfs.length && spawnSync("qpdf", ["--version"]).error) pdfSkipped = true;
else {
  for (const file of pdfs) {
    const route = "/" + path.relative(distRoot, file).split(path.sep).join("/");
    const r = spawnSync("qpdf", ["--json=2", "--json-key=qpdf", file], { encoding: "utf8", maxBuffer: 1 << 28 });
    if (r.error || r.status > 3) {
      findings.push({ route, rule: "M0-22", detail: "could not read PDF (qpdf failed)" });
      continue;
    }
    const objs = JSON.parse(r.stdout).qpdf[1];
    const ref = objs.trailer?.value?.["/Info"];
    const raw = ref ? objs[`obj:${ref}`]?.value?.["/Title"] : undefined;
    const rawAuthor = ref ? objs[`obj:${ref}`]?.value?.["/Author"] : undefined;
    const a = typeof rawAuthor === "string" ? rawAuthor.replace(/^[ub]:/, "").trim() : "";
    if (orgName && a !== orgName) findings.push({ route, rule: "M0-22", detail: `PDF /Author is ${JSON.stringify(a)}, expected the organization name ${JSON.stringify(orgName)}` });
    const t = typeof raw === "string" ? raw.replace(/^[ub]:/, "").trim() : "";
    if (!t) findings.push({ route, rule: "M0-22", detail: "PDF has no /Title" });
    else if (seenPdfTitle.has(t)) findings.push({ route, rule: "M0-22", detail: `duplicate PDF /Title (also ${seenPdfTitle.get(t)}): ${t}` });
    else if (repeatedSegment(t)) findings.push({ route, rule: "M0-22", detail: `PDF /Title repeats a segment (organization name doubled?): ${t}` });
    else if (/^page not found/i.test(t)) findings.push({ route, rule: "M0-22", detail: `PDF /Title is "${t}" (printed before the page rendered)` });
    else if (/^[\w.-]+$/.test(t) && /[-_]/.test(t)) findings.push({ route, rule: "M0-22", detail: `PDF /Title looks like a filename: ${t}` });
    if (t && !seenPdfTitle.has(t)) seenPdfTitle.set(t, route);
  }
}
if (pdfSkipped) console.log("check-seo-meta: qpdf not installed, PDF /Title check skipped");

if (asJson) {
  console.log(JSON.stringify({ distRoot, pages: pages.length, findings, warnings }, null, 2));
} else {
  const byRule = {};
  for (const f of findings) (byRule[f.rule] ||= []).push(f);
  console.log(`check-seo-meta: ${pages.length} pages, ${pdfs.length} PDFs, ${findings.length} finding(s) in ${distRoot}`);
  for (const [rule, list] of Object.entries(byRule)) {
    console.log(`\n[${rule}] ${list.length}`);
    for (const f of list) console.log(`  ${f.route} : ${f.detail}`);
  }
}

if (!asJson && warnings.length) console.log(`\n${warnings.length} warning(s) (not failing): descriptions over ${MAX_DESC} chars`);

process.exit(findings.length && !reportOnly ? 1 : 0);
