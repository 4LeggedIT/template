#!/usr/bin/env node
/**
 * Governance check: verifies a site's headers file carries the fleet's
 * baseline security headers with real (non-placeholder) values — not just
 * that the file exists (that was the entirety of the old M0-32 check).
 *
 * Checks the first "/*" block of the given headers file for:
 *   - X-Frame-Options: SAMEORIGIN or DENY
 *   - X-Content-Type-Options: nosniff
 *   - Referrer-Policy: <any non-empty value>
 *   - Permissions-Policy: <any non-empty value>
 *   - Strict-Transport-Security: max-age >= 15552000 (6 months) and includeSubDomains
 *   - Content-Security-Policy or Content-Security-Policy-Report-Only, either
 *     literally present in this file (static-CSP sites, e.g. goldenpupaccessories)
 *     OR wired via the build-time generator (pass --build-script=<path> to also
 *     grep that file for the gen-csp-headers.mjs call).
 *
 * Usage:
 *   node check-security-headers.mjs <headers-file> [--build-script=<path>]
 *   e.g. node check-security-headers.mjs public/_headers --build-script=tools/build.mjs
 *        node check-security-headers.mjs public/_headers   (static-CSP sites, no build script)
 *
 * Run as part of the fleet's quality-gate list (npm run headers:check),
 * alongside lint/typecheck/build/csp:check. See
 * docs/governance/mvp0-core-governance-gate.md (M0-32) and
 * docs/governance/csp-registry-governance.md.
 */
import fs from "node:fs/promises";
import path from "node:path";

const MIN_HSTS_MAX_AGE = 15552000; // 6 months

function parseBlock(content) {
  const lines = content.split("\n");
  const startIdx = lines.findIndex((line) => line.trim() === "/*");
  if (startIdx === -1) return [];
  const block = [];
  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "" || !line.startsWith(" ")) break;
    block.push(line.trim());
  }
  return block;
}

function findHeader(block, name) {
  const prefix = `${name}:`;
  const line = block.find((l) => l.toLowerCase().startsWith(prefix.toLowerCase()));
  return line ? line.slice(prefix.length).trim() : null;
}

async function main() {
  const headersFileArg = process.argv[2];
  const buildScriptArg = process.argv.find((a) => a.startsWith("--build-script="));
  const buildScriptPath = buildScriptArg ? buildScriptArg.slice("--build-script=".length) : null;

  if (!headersFileArg) {
    console.error("Usage: node check-security-headers.mjs <headers-file> [--build-script=<path>]");
    process.exit(1);
  }

  const headersFile = path.resolve(process.cwd(), headersFileArg);
  const problems = [];

  let content;
  try {
    content = await fs.readFile(headersFile, "utf-8");
  } catch {
    console.error(`[headers:check] FAILED — ${headersFileArg} does not exist.`);
    process.exit(1);
  }

  const block = parseBlock(content);
  if (block.length === 0) {
    problems.push(`no "/*" header block found in ${headersFileArg}`);
  }

  const xfo = findHeader(block, "X-Frame-Options");
  if (!xfo || !/^(SAMEORIGIN|DENY)$/i.test(xfo)) {
    problems.push(`X-Frame-Options missing or not SAMEORIGIN/DENY (got: ${xfo ?? "(none)"})`);
  }

  const xcto = findHeader(block, "X-Content-Type-Options");
  if (!xcto || xcto.toLowerCase() !== "nosniff") {
    problems.push(`X-Content-Type-Options missing or not "nosniff" (got: ${xcto ?? "(none)"})`);
  }

  if (!findHeader(block, "Referrer-Policy")) {
    problems.push("Referrer-Policy missing");
  }

  if (!findHeader(block, "Permissions-Policy")) {
    problems.push("Permissions-Policy missing");
  }

  const hsts = findHeader(block, "Strict-Transport-Security");
  if (!hsts) {
    problems.push("Strict-Transport-Security missing");
  } else {
    const maxAgeMatch = hsts.match(/max-age=(\d+)/i);
    const maxAge = maxAgeMatch ? Number(maxAgeMatch[1]) : 0;
    if (maxAge < MIN_HSTS_MAX_AGE) {
      problems.push(`Strict-Transport-Security max-age too low (${maxAge}, need >= ${MIN_HSTS_MAX_AGE})`);
    }
    if (!/includeSubDomains/i.test(hsts)) {
      problems.push("Strict-Transport-Security missing includeSubDomains");
    }
  }

  const hasCspLine = block.some((l) => /^content-security-policy(-report-only)?:/i.test(l));
  if (!hasCspLine) {
    if (!buildScriptPath) {
      problems.push(
        "no Content-Security-Policy(-Report-Only) line found, and no --build-script given to check for generator wiring"
      );
    } else {
      let buildScriptContent = "";
      try {
        buildScriptContent = await fs.readFile(path.resolve(process.cwd(), buildScriptPath), "utf-8");
      } catch {
        problems.push(`--build-script path ${buildScriptPath} does not exist`);
      }
      if (buildScriptContent && !/writeCspHeaders|gen-csp-headers/.test(buildScriptContent)) {
        problems.push(`CSP not found in ${headersFileArg} and ${buildScriptPath} does not call the CSP generator`);
      }
    }
  }

  if (problems.length) {
    console.error(`[headers:check] FAILED — ${headersFileArg}:`);
    for (const p of problems) console.error(`  - ${p}`);
    console.error(
      "\nSee docs/governance/mvp0-core-governance-gate.md (M0-32) and docs/governance/csp-registry-governance.md."
    );
    process.exit(1);
  }

  console.log(`[headers:check] ${headersFileArg} — all required security headers present.`);
}

main();
