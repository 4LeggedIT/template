#!/usr/bin/env node
// SHARED PATTERN: do not edit in a site repo.
// Source: github.com/4LeggedIT/internal-tools
//   4leggedit-websites/templates-sources/tools/check-safe-urls.mjs
// Change it there, then sync it to every site.
/**
 * Governance check: a shared pattern must not put a props- or content-authored
 * value straight into a link or frame sink. Flags, in src/components/patterns:
 *
 *   <a href={expr}>   <Link to={expr}>   <iframe|embed|object src|data={expr}>
 *
 * unless `expr` is a string literal, a template literal with literal text
 * around its placeholders (e.g. `${basePath}/${slug}`), an identifier assigned
 * from an expression that calls safeContentUrl()/safeMediaUrl() in the same file, or itself a call to
 * one of them. Use <ContentLink href={...}> (patterns/ContentLink.tsx), which
 * validates with safeContentUrl() and renders no link for unsafe values.
 *
 * A deliberate exception carries `// safe-url-ok: <reason>` on the same or the
 * preceding line. SiteHeader/SiteFooter/SiteLayout (site chrome fed by the
 * site's own nav config) and ContentLink itself are exempt.
 *
 * <img src> is not checked: image sources do not execute script.
 *
 * Usage: node check-safe-urls.mjs <patterns-dir>
 *   e.g. node check-safe-urls.mjs src/components/patterns
 * Wired into `npm run security:check`.
 */
import fs from "node:fs/promises";
import path from "node:path";

const EXEMPT_FILES = new Set(["SiteHeader.tsx", "SiteFooter.tsx", "SiteLayout.tsx", "ContentLink.tsx"]);
const SINKS = [
  { tag: "a", attrs: ["href"] },
  { tag: "Link", attrs: ["to"] },
  { tag: "iframe", attrs: ["src"] },
  { tag: "embed", attrs: ["src"] },
  { tag: "object", attrs: ["data"] },
];
const SAFE_CALL_RE = /\b(?:safeContentUrl|safeMediaUrl)\s*\(/;

/** Index of the `>` that closes an opening tag starting at `from`, honoring braces and quotes. */
function findTagEnd(src, from) {
  let depth = 0;
  let quote = null;
  for (let i = from; i < src.length; i++) {
    const ch = src[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    else if (ch === "{") depth++;
    else if (ch === "}") depth--;
    else if (ch === ">" && depth === 0 && src[i - 1] !== "=") return i;
  }
  return -1;
}

/** Content of the `{...}` expression starting at `open` (index of `{`). */
function readBraced(src, open) {
  let depth = 0;
  let quote = null;
  for (let i = open; i < src.length; i++) {
    const ch = src[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    else if (ch === "{") depth++;
    else if (ch === "}" && --depth === 0) return src.slice(open + 1, i);
  }
  return null;
}

function isSafeExpr(expr, safeIdents) {
  const e = expr.trim();
  if (/^(["'])[^"']*\1$/.test(e)) return true;
  if (e.startsWith("`")) return !/^`\$\{[^}]*\}`$/.test(e);
  if (SAFE_CALL_RE.test(e)) return true;
  return /^[\w.]+$/.test(e) && safeIdents.has(e);
}

export function scanSource(src) {
  const safeIdents = new Set();
  for (const m of src.matchAll(/\b(?:const|let)\s+(\w+)\s*(?::[^=;\n]+)?=[^;\n]*?\b(?:safeContentUrl|safeMediaUrl)\s*\(/g)) safeIdents.add(m[1]);
  const lines = src.split("\n");
  const lineOf = (idx) => src.slice(0, idx).split("\n").length;
  const problems = [];
  for (const { tag, attrs } of SINKS) {
    const tagRe = new RegExp(`<${tag}(?=[\\s>/])`, "g");
    for (const m of src.matchAll(tagRe)) {
      const end = findTagEnd(src, m.index + m[0].length);
      if (end < 0) continue;
      const open = src.slice(m.index, end + 1);
      for (const attr of attrs) {
        const am = new RegExp(`\\s${attr}=`).exec(open);
        if (!am) continue;
        const valueStart = am.index + am[0].length;
        let expr;
        if (open[valueStart] === "{") expr = readBraced(open, valueStart);
        else continue; // plain string attribute
        if (expr === null || isSafeExpr(expr, safeIdents)) continue;
        const line = lineOf(m.index + am.index + 1);
        const tagLine = lineOf(m.index);
        const nearby = lines.slice(Math.max(0, tagLine - 2), line).join("\n");
        if (/safe-url-ok:/.test(nearby)) continue;
        problems.push({ line, tag, attr, expr: expr.trim().replace(/\s+/g, " ").slice(0, 80) });
      }
    }
  }
  return problems;
}

async function main() {
  const dir = process.argv[2];
  if (!dir) {
    console.error("Usage: node check-safe-urls.mjs <patterns-dir>");
    process.exit(2);
  }
  const entries = (await fs.readdir(dir)).filter((f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx") && !EXEMPT_FILES.has(f));
  let failures = 0;
  for (const file of entries.sort()) {
    const src = await fs.readFile(path.join(dir, file), "utf8");
    for (const p of scanSource(src)) {
      failures++;
      console.error(`${path.join(dir, file)}:${p.line}  <${p.tag} ${p.attr}={${p.expr}}> is not validated. Use <ContentLink href=...> or safeContentUrl(), or add "// safe-url-ok: <reason>".`);
    }
  }
  if (failures) {
    console.error(`\nsafe-url check failed: ${failures} unvalidated link/frame value(s).`);
    process.exit(1);
  }
  console.log(`safe-url check passed (${entries.length} pattern files).`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
