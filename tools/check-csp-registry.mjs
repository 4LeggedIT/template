#!/usr/bin/env node
/**
 * Governance check: every third-party origin a shared pattern actually
 * loads (script/iframe src, fetch() call, <img> src — anything CSP would
 * restrict) must be registered for that pattern in csp-registry.mjs, or the
 * line must carry an explicit `// csp-exempt: <reason>` comment.
 *
 * Deliberately does NOT flag `href=` — CSP doesn't restrict navigation via
 * <a> links (maps/calendar/share links), so those never need an entry.
 *
 * Usage: node check-csp-registry.mjs <patterns-dir>
 *   e.g. node check-csp-registry.mjs templates-sources/patterns
 *        node check-csp-registry.mjs src/components/patterns
 *
 * Run as part of the fleet's quality-gate list (npm run csp:check),
 * alongside lint/typecheck/build. See docs/governance/csp-registry-governance.md.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { patternCspRequirements } from "./csp-registry.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Matches `<identifier> = "https://..."` (or {`, {", {') but not the
// identifier "href" — catches JSX src=/srcSet=, `script.src =`, and
// module-level `const FOO_SRC = "https://..."` literals alike.
const ASSIGNMENT_RE = /([\w.]+)\s*=\s*(?:\{)?[`"'](https:\/\/[^"'`\s)]+)/g;
const FETCH_RE = /fetch\(\s*[`"'](https:\/\/[^"'`\s)]+)/g;

function extractHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function registeredHostnames(patternName) {
  const requirement = patternCspRequirements[patternName] ?? {};
  const all = [
    ...(requirement.scriptSrc ?? []),
    ...(requirement.imgSrc ?? []),
    ...(requirement.connectSrc ?? []),
    ...(requirement.frameSrc ?? []),
    ...(requirement.styleSrc ?? []),
    ...(requirement.fontSrc ?? []),
  ];
  return new Set(all.map(extractHostname).filter(Boolean));
}

async function checkFile(filePath, patternName) {
  const content = await fs.readFile(filePath, "utf-8");
  const lines = content.split("\n");
  const registered = registeredHostnames(patternName);
  const problems = [];

  lines.forEach((line, idx) => {
    if (line.includes("csp-exempt:")) return;

    for (const match of line.matchAll(ASSIGNMENT_RE)) {
      const [, attr, url] = match;
      if (attr.toLowerCase() === "href") continue;
      const hostname = extractHostname(url);
      if (hostname && !registered.has(hostname)) {
        problems.push({ line: idx + 1, hostname });
      }
    }
    for (const match of line.matchAll(FETCH_RE)) {
      const hostname = extractHostname(match[1]);
      if (hostname && !registered.has(hostname)) {
        problems.push({ line: idx + 1, hostname });
      }
    }
  });

  return problems;
}

async function main() {
  const patternsDirArg = process.argv[2];
  if (!patternsDirArg) {
    console.error("Usage: node check-csp-registry.mjs <patterns-dir>");
    process.exit(1);
  }
  const patternsDir = path.resolve(process.cwd(), patternsDirArg);

  const entries = await fs.readdir(patternsDir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile() && e.name.endsWith(".tsx") && !e.name.endsWith(".test.tsx"));

  let failed = false;

  for (const entry of files) {
    const patternName = entry.name.replace(/\.tsx$/, "");
    const filePath = path.join(patternsDir, entry.name);
    const problems = await checkFile(filePath, patternName);

    for (const problem of problems) {
      failed = true;
      console.error(
        `[csp:check] ${path.relative(process.cwd(), filePath)}:${problem.line} references https://${problem.hostname} ` +
          `but it isn't registered in csp-registry.mjs for pattern "${patternName}". ` +
          `Add it to patternCspRequirements.${patternName}, or add "// csp-exempt: <reason>" on this line if it's not a real resource load.`
      );
    }
  }

  if (failed) {
    console.error(`\n[csp:check] FAILED — see ${path.relative(process.cwd(), path.join(__dirname, "csp-registry.mjs"))}`);
    process.exit(1);
  }
  console.log("[csp:check] all pattern third-party origins are registered.");
}

main();
