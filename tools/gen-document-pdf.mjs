#!/usr/bin/env node
// SHARED PATTERN: do not edit in a site repo.
// Source: github.com/4LeggedIT/internal-tools
//   4leggedit-websites/templates-sources/tools/gen-document-pdf.mjs
// Change it there, then sync it to every site.
/**
 * Renders a print-mode /documents/<slug> page to PDF and writes it to
 * public/documents/<slug>.pdf — the file every site's Resources page links
 * as a direct download. Drives a locally installed Chrome/Chromium/Brave/Edge
 * via its built-in headless --print-to-pdf flag; no puppeteer/playwright or
 * other new dependency required.
 *
 * Requires the site's dev or preview server to already be running (this
 * script does not start one).
 *
 * When to use it: only for content that arrived as an old-format text
 * document (Word, Google Doc, typed handout) and was migrated into the
 * site's /documents format. If the rescue published its own designed
 * graphic (flyer, infographic, social-post image), that image IS the
 * download: wrap it with img2pdf at native size and write the result to
 * public/resources/<Name>.pdf instead of printing the document page.
 *   img2pdf <image> --title "<Title> | <Org>" --author "<Org>" -o public/resources/<Name>.pdf
 *
 * Usage:
 *   node tools/gen-document-pdf.mjs foster-agreement
 *   node tools/gen-document-pdf.mjs foster-agreement --base http://localhost:4180
 *   node tools/gen-document-pdf.mjs --route /documents/foster-agreement --out public/documents/foster-agreement.pdf
 *   node tools/gen-document-pdf.mjs --url http://localhost:8080/documents/foster-agreement --out public/documents/foster-agreement.pdf
 *
 * Only ever point this at a document's *print* route (never a "-digital"
 * e-sign variant) — those are staff-only JotForm import masters, not meant
 * to replace the Resources page's public download.
 *
 * Options:
 *   <slug>     Shorthand: sets route to /documents/<slug> and out to
 *              public/documents/<slug>.pdf (either can still be overridden below)
 *   --route    Route path on the local server (combined with --base)
 *   --url      Full URL to print (overrides --route/--base)
 *   --base     Base URL when using --route (default: http://localhost:8080)
 *   --out      Output PDF path (default derived from <slug>/--route)
 *   --browser  Explicit path to a Chrome/Chromium/Brave/Edge binary (overrides auto-detect)
 *   --author   PDF /Author. Default: `siteName` from src/config/site.ts (the
 *              organization name), so every PDF carries the org, never a person.
 *   --title    PDF /Title to write, e.g. "Foster Application | <Org>". Chrome copies
 *              document.title at print time, which can be wrong when the SPA route
 *              has not rendered yet (seen as "Page not found"). Needs qpdf.
 *              Without --title the script fails if the printed title is empty or
 *              "Page not found".
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    } else {
      args._.push(a);
    }
  }
  return args;
}

const CANDIDATE_BINARIES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "google-chrome",
  "google-chrome-stable",
  "chromium",
  "chromium-browser",
  "chrome",
];

function commandExists(cmd) {
  const probe = spawnSync(process.platform === "win32" ? "where" : "command", process.platform === "win32" ? [cmd] : ["-v", cmd], { shell: process.platform !== "win32" });
  return probe.status === 0;
}

function findBrowser(explicit) {
  if (explicit) {
    if (existsSync(explicit)) return explicit;
    throw new Error(`--browser path not found: ${explicit}`);
  }
  for (const candidate of CANDIDATE_BINARIES) {
    if (candidate.startsWith("/")) {
      if (existsSync(candidate)) return candidate;
    } else if (commandExists(candidate)) {
      return candidate;
    }
  }
  throw new Error(
    "No Chrome/Chromium/Brave/Edge install found. Install one, or pass --browser <path-to-binary>.",
  );
}

const args = parseArgs(process.argv.slice(2));
const slug = args._[0];

if (!slug && !args.route && !args.url) {
  console.error(
    "Usage: node tools/gen-document-pdf.mjs <slug> [--base <url>]\n" +
    "   or: node tools/gen-document-pdf.mjs --route /documents/<slug> --out public/documents/<slug>.pdf\n" +
    "   or: node tools/gen-document-pdf.mjs --url <full-url> --out <path>",
  );
  process.exit(1);
}

const base = (args.base || "http://localhost:8080").replace(/\/$/, "");
const route = args.route || (slug ? `/documents/${slug}` : undefined);
const url = args.url || `${base}${route.startsWith("/") ? route : `/${route}`}`;

const outArg = args.out || (slug ? `public/documents/${slug}.pdf` : undefined);
if (!outArg) {
  console.error("No --out path given and no <slug> to derive one from. Pass --out <path>.");
  process.exit(1);
}
const outPath = resolve(process.cwd(), outArg);
mkdirSync(dirname(outPath), { recursive: true });

const browser = findBrowser(typeof args.browser === "string" ? args.browser : undefined);

console.log(`[gen-document-pdf] printing ${url}`);
console.log(`[gen-document-pdf] writing  ${outPath}`);
console.log(`[gen-document-pdf] browser  ${browser}`);

const result = spawnSync(
  browser,
  [
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--no-pdf-header-footer",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=10000",
    `--print-to-pdf=${outPath}`,
    url,
  ],
  { stdio: "inherit" },
);

if (result.error) {
  console.error(`[gen-document-pdf] failed to launch browser: ${result.error.message}`);
  process.exit(1);
}
if (result.status !== 0) {
  console.error(`[gen-document-pdf] browser exited with status ${result.status}`);
  process.exit(result.status ?? 1);
}
if (!existsSync(outPath)) {
  console.error("[gen-document-pdf] Expected output PDF was not created.");
  process.exit(1);
}

// --- PDF /Title (Bing rule 121: a PDF with no title is flagged) -------------
const qpdfJson = (file, key) => {
  const r = spawnSync("qpdf", ["--json=2", `--json-key=${key}`, file], { encoding: "utf8", maxBuffer: 1 << 28 });
  if (r.error || r.status !== 0) return null;
  return JSON.parse(r.stdout);
};
const readInfo = (file) => {
  const j = qpdfJson(file, "qpdf");
  if (!j) return null;
  const objs = j.qpdf[1];
  const ref = objs.trailer?.value?.["/Info"];
  const info = ref ? objs[`obj:${ref}`]?.value : undefined;
  return { ref, info: info ?? {} };
};
const decodeStr = (v) => (typeof v === "string" ? v.replace(/^u:/, "").replace(/^b:/, "") : "");

const title = typeof args.title === "string" ? args.title.trim() : "";
let author = typeof args.author === "string" ? args.author.trim() : "";
if (!author) {
  try {
    author = readFileSync(resolve(process.cwd(), "src/config/site.ts"), "utf8").match(/siteName:\s*"([^"]+)"/)?.[1] ?? "";
  } catch {
    /* fall through */
  }
}
if (!author) {
  console.error("[gen-document-pdf] could not read siteName from src/config/site.ts. Pass --author \"<Organization name>\".");
  process.exit(1);
}
const meta = readInfo(outPath);
if (!meta) {
  console.error("[gen-document-pdf] qpdf not found: cannot set or verify the PDF /Title. Install qpdf (brew install qpdf).");
  process.exit(1);
}
{
  const newInfo = { ...meta.info, "/Author": `u:${author}` };
  if (title) newInfo["/Title"] = `u:${title}`;
  const upd = { qpdf: [{ jsonversion: 2 }, { [`obj:${meta.ref}`]: { value: newInfo } }] };
  const tmp = `${outPath}.title.json`;
  writeFileSync(tmp, JSON.stringify(upd));
  const u = spawnSync("qpdf", ["--update-from-json=" + tmp, "--replace-input", outPath], { stdio: "inherit" });
  unlinkSync(tmp);
  if (u.status !== 0 && u.status !== 3) {
    console.error("[gen-document-pdf] qpdf failed to write the /Title.");
    process.exit(1);
  }
  console.log(`[gen-document-pdf] title    ${title || "(kept)"}`);
  console.log(`[gen-document-pdf] author   ${author}`);
}
if (!title) {
  const t = decodeStr(readInfo(outPath)?.info["/Title"]).trim();
  if (!t || /^page not found/i.test(t)) {
    console.error(`[gen-document-pdf] printed PDF has a bad /Title (${JSON.stringify(t)}). Re-run with --title "<Title> | <Org>".`);
    process.exit(1);
  }
}

console.log(`[gen-document-pdf] done`);
