#!/usr/bin/env node
// SHARED PATTERN: do not edit in a site repo.
// Source: github.com/4LeggedIT/internal-tools
//   4leggedit-websites/templates-sources/tools/gen-og-image.mjs
// Change it there, then sync it to every site.
/**
 * Generates public/og-image.jpg (1200x630) from src/assets/logo.png using Python/Pillow.
 * Reads site-specific branding from tools/og-image-config.json.
 * Run: node tools/gen-og-image.mjs
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const src = path.join(root, "src/assets/logo.png");
const out = path.join(root, "public/og-image.jpg");
const configPath = path.join(__dirname, "og-image-config.json");

const config = JSON.parse(readFileSync(configPath, "utf8"));

const {
  bgColor = [27, 50, 97],
  accentColor = [45, 107, 59],
  orgNameLine1,
  orgNameLine2,
  tagline = "",
  location = "",
} = config;

const script = `
from PIL import Image, ImageDraw, ImageFont
import sys, os, json

src = sys.argv[1]
out = sys.argv[2]
cfg = json.loads(sys.argv[3])

W, H = 1200, 630
BG = tuple(cfg["bgColor"])
WHITE = (255, 255, 255)
ACCENT = tuple(cfg["accentColor"])

canvas = Image.new("RGB", (W, H), BG)

logo = Image.open(src).convert("RGBA")
lw, lh = logo.size
side = min(lw, lh)
left = (lw - side) // 2
top = (lh - side) // 2
logo = logo.crop((left, top, left + side, top + side))

logo_size = 500
logo = logo.resize((logo_size, logo_size), Image.LANCZOS)

pad = 20
bg = Image.new("RGB", (logo_size + pad*2, logo_size + pad*2), WHITE)
logo_x = 60
logo_y = (H - logo_size - pad*2) // 2
canvas.paste(bg, (logo_x, logo_y))
canvas.paste(logo, (logo_x + pad, logo_y + pad), logo)

draw = ImageDraw.Draw(canvas)

def find_font(size, bold=False):
    candidates = (
        [
            "/System/Library/Fonts/Helvetica.ttc",
            "/System/Library/Fonts/SFNSDisplay-Bold.otf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        ] if bold else [
            "/System/Library/Fonts/Helvetica.ttc",
            "/System/Library/Fonts/SFNSDisplay.otf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        ]
    )
    for p in candidates:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return ImageFont.load_default()

text_x = logo_x + logo_size + pad*2 + 60
text_right = W - 60
max_w = text_right - text_x
text_center_y = H // 2

def text_w(text, font):
    return draw.textbbox((0, 0), text, font=font)[2]

def fit_font(text, size, min_size, bold=False):
    # Shrink until the text fits the column (never clipped at the canvas edge).
    while size > min_size and text_w(text, find_font(size, bold)) > max_w:
        size -= 2
    return find_font(size, bold)

def wrap(text, font):
    lines, cur = [], ""
    for word in text.split():
        trial = (cur + " " + word).strip()
        if cur and text_w(trial, font) > max_w:
            lines.append(cur)
            cur = word
        else:
            cur = trial
    if cur:
        lines.append(cur)
    return lines

line1 = cfg.get("orgNameLine1", "")
line2 = cfg.get("orgNameLine2", "")
tagline = cfg.get("tagline", "")
location = cfg.get("location", "")

# One shared title size so both lines match; wrap the second line if even the minimum is too wide.
title_size = 64
while title_size > 44 and max(text_w(line1, find_font(title_size, True)), text_w(line2, find_font(title_size, True))) > max_w:
    title_size -= 2
font_title = find_font(title_size, True)
title_lines = wrap(line1, font_title) + (wrap(line2, font_title) if line2 else [])
title_lh = int(title_size * 1.15)

font_tag = find_font(32)
tag_lines = wrap(tagline, font_tag) if tagline else []
tag_lh = 40
font_loc = find_font(26)
loc_lines = wrap(location, font_loc) if location else []
loc_lh = 34

bar_h = 6
gap_bar, gap_tag, gap_loc = 24, 26, 10
block_h = (bar_h + gap_bar + len(title_lines) * title_lh
           + (gap_tag + len(tag_lines) * tag_lh if tag_lines else 0)
           + (gap_loc + len(loc_lines) * loc_lh if loc_lines else 0))
y = text_center_y - block_h // 2

draw.rectangle([text_x, y, text_x + 80, y + bar_h], fill=ACCENT)
y += bar_h + gap_bar
for ln in title_lines:
    draw.text((text_x, y), ln, font=font_title, fill=WHITE)
    y += title_lh
if tag_lines:
    y += gap_tag
    for ln in tag_lines:
        draw.text((text_x, y), ln, font=font_tag, fill=(180, 200, 230))
        y += tag_lh
if loc_lines:
    y += gap_loc
    for ln in loc_lines:
        draw.text((text_x, y), ln, font=font_loc, fill=(140, 165, 200))
        y += loc_lh

canvas.save(out, format="JPEG", quality=88, optimize=True)
print(f"Wrote {out} ({W}x{H})")
`;

execFileSync(
  "python3",
  ["-c", script, src, out, JSON.stringify({ bgColor, accentColor, orgNameLine1, orgNameLine2, tagline, location })],
  { stdio: "inherit" }
);
