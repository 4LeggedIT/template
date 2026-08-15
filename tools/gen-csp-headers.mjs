#!/usr/bin/env node
/**
 * Generates a Content-Security-Policy-Report-Only header line from
 * csp-registry.mjs and which patterns this specific site actually uses,
 * then writes it into dist/_headers (Cloudflare Pages header config).
 *
 * Usage (called from tools/build.mjs, after the Vite client build has
 * already copied public/_headers -> dist/_headers):
 *
 *   import { writeCspHeaders } from "./gen-csp-headers.mjs";
 *   await writeCspHeaders(rootDir);
 *
 * Report-Only, not enforcing: usage detection below is a text-scan
 * heuristic, not a full module-reachability analysis, so it can
 * under-report (miss a pattern used only via an unusual import shape).
 * Report-Only means that's harmless — it only under-logs to the browser
 * console, nothing ever gets blocked. Switching to enforcing mode is a
 * deliberate later step, not automatic here.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { cspBaseline, patternCspRequirements } from "./csp-registry.mjs";

// Fixed, non-pattern-driven directives. Every site gets these regardless of
// which patterns it uses.
const FIXED_DIRECTIVES = {
  "default-src": ["'self'"],
  "base-uri": ["'self'"],
  "object-src": ["'none'"],
  "frame-ancestors": ["'self'"],
  "script-src": ["'self'"],
  // 'unsafe-inline' covers React inline `style` attributes used throughout
  // (e.g. dynamically-sized QR images) — tightening this to nonces/hashes
  // is a separate future project, not part of this pass.
  "style-src": ["'self'", "'unsafe-inline'"],
  "font-src": ["'self'"],
  "img-src": ["'self'", "data:"],
  "connect-src": ["'self'"],
};

const DIRECTIVE_KEY_MAP = {
  scriptSrc: "script-src",
  styleSrc: "style-src",
  fontSrc: "font-src",
  imgSrc: "img-src",
  connectSrc: "connect-src",
  frameSrc: "frame-src",
};

const DIRECTIVE_ORDER = [
  "default-src",
  "base-uri",
  "object-src",
  "frame-ancestors",
  "script-src",
  "style-src",
  "font-src",
  "img-src",
  "connect-src",
  "frame-src",
];

const SCAN_EXCLUDE_DIRS = new Set(["patterns", "ui", "node_modules"]);

async function collectSourceFiles(dir) {
  let results = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SCAN_EXCLUDE_DIRS.has(entry.name)) continue;
      results = results.concat(await collectSourceFiles(full));
    } else if (/\.(tsx|jsx|ts)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

// Scans for `<PatternName` JSX usage across a set of files, for a set of
// candidate pattern names. Shared by both the top-level site scan and the
// pattern-composition scan below.
async function findJsxUsage(files, patternNames) {
  const used = new Set();
  for (const file of files) {
    if (used.size === patternNames.length) break;
    const content = await fs.readFile(file, "utf-8");
    for (const name of patternNames) {
      if (used.has(name)) continue;
      if (content.includes(`<${name}`)) used.add(name);
    }
  }
  return used;
}

// Some registered patterns compose OTHER registered patterns internally
// (e.g. AdoptablePetsSection renders PetfinderScrollerEmbed/AdoptAPetEmbed/
// GetBuddyEmbed/PawPlacerEmbed depending on its `mode` prop). A site's own
// page code only ever writes <AdoptablePetsSection ...> — it never names
// the inner embeds directly — so top-level usage-detection alone would
// silently miss their CSP requirements. Build the composition graph by
// scanning the patterns' own definitions (not the call site), then expand
// any directly-used pattern to include everything it composes, transitively.
async function buildCompositionMap(patternsDir, patternNames) {
  const map = new Map();
  for (const name of patternNames) {
    const filePath = path.join(patternsDir, `${name}.tsx`);
    let content;
    try {
      content = await fs.readFile(filePath, "utf-8");
    } catch {
      map.set(name, []);
      continue;
    }
    const composes = patternNames.filter((other) => other !== name && content.includes(`<${other}`));
    map.set(name, composes);
  }
  return map;
}

function expandTransitively(directlyUsed, compositionMap) {
  const expanded = new Set(directlyUsed);
  const queue = [...directlyUsed];
  while (queue.length) {
    const current = queue.pop();
    for (const composed of compositionMap.get(current) ?? []) {
      if (!expanded.has(composed)) {
        expanded.add(composed);
        queue.push(composed);
      }
    }
  }
  return expanded;
}

// A pattern is "used" by this site if any non-pattern, non-ui source file
// renders it as JSX (<PatternName ...), OR if it's composed internally by
// another pattern that's used. Excludes components/patterns/ and
// components/ui/ themselves (definitions, not call sites) from the
// top-level scan.
async function findUsedPatterns(srcDir, patternNames) {
  const siteFiles = await collectSourceFiles(srcDir);
  const directlyUsed = await findJsxUsage(siteFiles, patternNames);

  const patternsDir = path.join(srcDir, "components", "patterns");
  const compositionMap = await buildCompositionMap(patternsDir, patternNames);

  return expandTransitively(directlyUsed, compositionMap);
}

function mergeRequirement(target, requirement) {
  for (const [key, values] of Object.entries(requirement)) {
    const directive = DIRECTIVE_KEY_MAP[key];
    if (!directive || !values?.length) continue;
    if (!target[directive]) target[directive] = new Set();
    for (const value of values) target[directive].add(value);
  }
}

/**
 * @param {string} rootDir - repo root (contains src/, dist/)
 * @param {object} [options]
 * @param {object} [options.extraRequirements] - site-specific, non-pattern
 *   requirement (e.g. 4leggedit's Supabase connect-src), same shape as a
 *   patternCspRequirements entry. Comes from tools/site-build-config.mjs's
 *   optional EXTRA_CSP_REQUIREMENTS export.
 */
export async function generateCspHeaderLine(rootDir, options = {}) {
  const srcDir = path.join(rootDir, "src");
  const patternNames = Object.keys(patternCspRequirements);
  const used = await findUsedPatterns(srcDir, patternNames);

  const merged = {};
  for (const [directive, values] of Object.entries(FIXED_DIRECTIVES)) {
    merged[directive] = new Set(values);
  }
  mergeRequirement(merged, cspBaseline);
  for (const name of used) {
    mergeRequirement(merged, patternCspRequirements[name]);
  }
  if (options.extraRequirements) {
    mergeRequirement(merged, options.extraRequirements);
  }

  const parts = DIRECTIVE_ORDER
    .filter((directive) => merged[directive]?.size)
    .map((directive) => `${directive} ${[...merged[directive]].join(" ")}`);

  return {
    headerLine: `Content-Security-Policy-Report-Only: ${parts.join("; ")};`,
    usedPatterns: [...used],
  };
}

export async function writeCspHeaders(rootDir, options = {}) {
  const { headerLine, usedPatterns } = await generateCspHeaderLine(rootDir, options);
  const headersPath = path.join(rootDir, "dist/_headers");

  let existing = "";
  try {
    existing = await fs.readFile(headersPath, "utf-8");
  } catch {
    existing = "";
  }

  const lines = existing.length ? existing.split("\n") : [];
  const blockIndex = lines.findIndex((line) => line.trim() === "/*");

  let updated;
  if (blockIndex === -1) {
    // No existing "/*" block (e.g. a repo whose _headers only has narrower
    // path rules) — add one at the top, keep everything else untouched.
    updated = [`/*`, `  ${headerLine}`, "", ...lines].join("\n");
  } else {
    lines.splice(blockIndex + 1, 0, `  ${headerLine}`);
    updated = lines.join("\n");
  }

  await fs.mkdir(path.dirname(headersPath), { recursive: true });
  await fs.writeFile(headersPath, updated, "utf-8");
  console.log(
    `[gen-csp-headers] wrote CSP (Report-Only) to dist/_headers — patterns matched: ${usedPatterns.join(", ") || "(none)"}`
  );
  return headerLine;
}
