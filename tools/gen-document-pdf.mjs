#!/usr/bin/env node
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
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
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

console.log(`[gen-document-pdf] done`);
