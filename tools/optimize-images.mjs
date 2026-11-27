#!/usr/bin/env node
// SHARED PATTERN: do not edit in a site repo.
// Source: github.com/4LeggedIT/internal-tools
//   4leggedit-websites/templates-sources/tools/optimize-images.mjs
// Change it there, then sync it to every site.
/**
 * Optimizes images in src/assets/ and public/:
 *  - Rasters (jpg/png/gif/tiff/bmp) → WebP (except KEEP_ORIGINAL_FORMAT paths, which are
 *    resized/compressed in place and keep their original format+extension)
 *  - SVGs → minified in place via svgo
 *  - Automatically rewrites every reference to a renamed file (ES imports, hardcoded
 *    "/public-path" strings, other tool scripts) across src/, public/, tools/, and index.html
 * Run: node tools/optimize-images.mjs
 * Requires: sharp, svgo (devDependencies)
 */
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";
import { optimize as optimizeSvg } from "svgo";

const PROJECT_ROOT = process.cwd();

const ROOT_DIRS = ["src/assets", "public"];

const SVG_EXTS = new Set([".svg"]);
const RASTER_EXTS = new Set([".png", ".jpg", ".jpeg", ".gif", ".tif", ".tiff", ".bmp"]);

// These paths are resized/compressed in place but never renamed or converted to WebP,
// because something outside the normal import graph depends on their exact path+extension:
//  - public/og-image.jpg / public/favicon.png: referenced as hardcoded "/name.ext" strings
//    in src/config/site.ts (and social-share crawlers expect a real jpg/png, not webp).
//  - src/assets/logo.(png|jpe?g): fixed-path source input read by tools/gen-favicon.mjs
//    and tools/gen-og-image.mjs.
const KEEP_ORIGINAL_FORMAT = new Set(["public/og-image.jpg", "public/favicon.png"]);
const isProtectedLogoSource = (p) => /^src\/assets\/logo\.(png|jpe?g)$/i.test(p);

// Per-site preset overrides (optional). A site may add tools/optimize-images.config.mjs exporting
//   export const imagePresets = [{ test: (relPath) => relPath === "src/assets/hero.jpg", max: 1600, webpQuality: 72 }];
// Site presets are checked before the fleet defaults below, so they win. The config file is
// per-site and is never synced; without it only the fleet defaults apply.
let sitePresets = [];
try {
  ({ imagePresets: sitePresets = [] } = await import("./optimize-images.config.mjs"));
} catch (error) {
  // Only a missing config FILE is fine; a config that exists but fails to load must surface.
  const missingConfig = error?.code === "ERR_MODULE_NOT_FOUND" && /Cannot find module '[^']*optimize-images\.config\.mjs'/.test(String(error.message));
  if (!missingConfig) throw error;
}

// Fleet default size/quality presets by folder. Falls back to the generic default for anything unmatched.
const presets = [
  { test: (p) => p === "src/assets/logo.png",        max: 512,  webpQuality: 80 },
  { test: (p) => p.startsWith("src/assets/team/"),   max: 1200, webpQuality: 72 },
  { test: (p) => p.startsWith("src/assets/partners/"), max: 900, webpQuality: 74 },
  { test: (p) => p.startsWith("src/assets/events/"), max: 1400, webpQuality: 75 },
  { test: (p) => p.startsWith("src/assets/news/"),   max: 1400, webpQuality: 75 },
  { test: (p) => p.startsWith("src/assets/gallery/"),max: 1600, webpQuality: 75 },
];

// Directories/extensions scanned for references to rewrite after a rename.
const REFERENCE_SCAN_DIRS = ["src", "public", "tools", "."];
const REFERENCE_SCAN_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".html", ".json", ".css", ".md", ".mdx"]);

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function walkFiles(dir) {
  const out = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return out;
    throw error;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist" || entry.name === ".git") continue;
      out.push(...(await walkFiles(full)));
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

function getPreset(relPath) {
  for (const preset of [...sitePresets, ...presets]) {
    if (preset.test(relPath)) return preset;
  }
  return { max: 1600, webpQuality: 75 };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

async function optimizeSvgFile(absPath, relPath) {
  const before = await fs.readFile(absPath, "utf8");
  const result = optimizeSvg(before, { path: absPath, multipass: true });
  if (result.data && result.data !== before) {
    await fs.writeFile(absPath, result.data, "utf8");
    const afterSize = (await fs.stat(absPath)).size;
    return { type: "svg", relPath, beforeSize: Buffer.byteLength(before, "utf8"), afterSize };
  }
  return { type: "svg", relPath, skipped: true, beforeSize: Buffer.byteLength(before, "utf8"), afterSize: Buffer.byteLength(before, "utf8") };
}

async function optimizeRasterFile(absPath, relPath) {
  const beforeSize = (await fs.stat(absPath)).size;
  const ext = path.extname(relPath).toLowerCase();
  const preset = getPreset(relPath);

  if (KEEP_ORIGINAL_FORMAT.has(relPath) || isProtectedLogoSource(relPath)) {
    const tmpPath = `${absPath}.tmp`;
    let pipeline = sharp(absPath, { failOn: "none" })
      .rotate()
      .resize({ width: preset.max, height: preset.max, fit: "inside", withoutEnlargement: true });
    pipeline = ext === ".png"
      ? pipeline.png({ compressionLevel: 9 })
      : pipeline.jpeg({ quality: 82, progressive: true, mozjpeg: true });
    await pipeline.toFile(tmpPath);
    await fs.rename(tmpPath, absPath);
    const afterSize = (await fs.stat(absPath)).size;
    return { type: ext === ".png" ? "png" : "jpeg", relPath, beforeSize, afterSize, outputRelPath: relPath };
  }

  const outRelPath = relPath.replace(new RegExp(`${ext}$`, "i"), ".webp");
  const outAbsPath = path.join(PROJECT_ROOT, outRelPath);
  const tmpPath = `${outAbsPath}.tmp`;

  await sharp(absPath, { failOn: "none" })
    .rotate()
    .resize({ width: preset.max, height: preset.max, fit: "inside", withoutEnlargement: true })
    .webp({ quality: preset.webpQuality, effort: 6, smartSubsample: true })
    .toFile(tmpPath);

  await fs.rename(tmpPath, outAbsPath);
  const afterSize = (await fs.stat(outAbsPath)).size;
  await fs.unlink(absPath);

  return { type: "webp", relPath, beforeSize, afterSize, outputRelPath: outRelPath };
}

async function rewriteReferences(rewrites) {
  if (!rewrites.length) return { filesChanged: 0, replacements: 0, unmatched: [] };

  const scanFiles = [];
  for (const root of REFERENCE_SCAN_DIRS) {
    const absRoot = path.join(PROJECT_ROOT, root);
    const stat = await fs.stat(absRoot).catch(() => null);
    if (!stat) continue;
    if (stat.isFile()) {
      if (REFERENCE_SCAN_EXTS.has(path.extname(absRoot).toLowerCase())) scanFiles.push(absRoot);
      continue;
    }
    const files = await walkFiles(absRoot);
    for (const f of files) {
      if (REFERENCE_SCAN_EXTS.has(path.extname(f).toLowerCase())) scanFiles.push(f);
    }
  }
  const uniqueScanFiles = [...new Set(scanFiles)];

  const matchedBasenames = new Set();
  let filesChanged = 0;
  let replacements = 0;

  for (const absPath of uniqueScanFiles) {
    let content = await fs.readFile(absPath, "utf8");
    let fileChanged = false;

    for (const { from, to } of rewrites) {
      const oldBase = path.basename(from);
      const newBase = path.basename(to);
      const pattern = new RegExp(`(?<![\\w.-])${escapeRegExp(oldBase)}(?![\\w-])`, "g");
      const matches = content.match(pattern);
      if (matches?.length) {
        content = content.replace(pattern, newBase);
        replacements += matches.length;
        fileChanged = true;
        matchedBasenames.add(oldBase);
      }
    }

    if (fileChanged) {
      await fs.writeFile(absPath, content, "utf8");
      filesChanged += 1;
    }
  }

  const unmatched = rewrites
    .map((r) => path.basename(r.from))
    .filter((base) => !matchedBasenames.has(base));

  return { filesChanged, replacements, unmatched };
}

async function main() {
  const changes = [];

  for (const root of ROOT_DIRS) {
    const absRoot = path.join(PROJECT_ROOT, root);
    let files = [];
    try {
      files = await walkFiles(absRoot);
    } catch (error) {
      if (error?.code === "ENOENT") continue;
      throw error;
    }

    for (const absPath of files) {
      const relPath = toPosix(path.relative(PROJECT_ROOT, absPath));
      const ext = path.extname(relPath).toLowerCase();
      if (relPath.includes("node_modules/") || relPath.startsWith("dist/")) continue;
      if (SVG_EXTS.has(ext)) {
        changes.push(await optimizeSvgFile(absPath, relPath));
        continue;
      }
      if (!RASTER_EXTS.has(ext)) continue;
      changes.push(await optimizeRasterFile(absPath, relPath));
    }
  }

  let savedBytes = 0;
  for (const c of changes) {
    if (!c.beforeSize || !c.afterSize) continue;
    savedBytes += Math.max(0, c.beforeSize - c.afterSize);
  }

  const optimized = changes.filter((c) => !c.skipped);
  const skipped = changes.filter((c) => c.skipped);
  console.log(`Optimized ${optimized.length} file(s), skipped ${skipped.length}.`);
  console.log(`Estimated bytes saved: ${formatBytes(savedBytes)}.`);

  const rewrites = changes
    .filter((c) => c.outputRelPath && c.outputRelPath !== c.relPath)
    .map((c) => ({ from: c.relPath, to: c.outputRelPath }));

  if (rewrites.length) {
    const { filesChanged, replacements, unmatched } = await rewriteReferences(rewrites);
    console.log(`\nRenamed ${rewrites.length} file(s) to .webp; rewrote ${replacements} reference(s) across ${filesChanged} file(s).`);
    if (unmatched.length) {
      console.log("\nNo references found for these renamed files (verify manually — may be unused, or referenced in a file type this script doesn't scan):");
      for (const base of unmatched) console.log(`  ${base}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
