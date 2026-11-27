#!/usr/bin/env node
// SHARED PATTERN: do not edit in a site repo.
// Source: github.com/4LeggedIT/internal-tools
//   4leggedit-websites/templates-sources/tools/gen-favicon.mjs
// Change it there, then sync it to every site.
/**
 * Generates public/favicon.ico from src/assets/logo.png using Python/Pillow.
 * Run: node tools/gen-favicon.mjs
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const src = path.join(root, "src/assets/logo.png");
const out = path.join(root, "public/favicon.ico");

const script = `
from PIL import Image
import sys

src = sys.argv[1]
out = sys.argv[2]

img = Image.open(src).convert("RGBA")

# Ensure square crop from center
w, h = img.size
side = min(w, h)
left = (w - side) // 2
top = (h - side) // 2
img = img.crop((left, top, left + side, top + side))

img.save(out, format="ICO", sizes=[(16,16),(32,32),(48,48),(256,256)])
print(f"Wrote {out}")
`;

execFileSync("python3", ["-c", script, src, out], { stdio: "inherit" });
