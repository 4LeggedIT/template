/**
 * SHARED PATTERN: do not edit in a site repo.
 * Source: github.com/4LeggedIT/internal-tools
 *   4leggedit-websites/templates-sources/patterns/FlyerBuilderSection.helpers.ts
 * Change it there, then sync it to every site.
 */
/**
 * Helpers for `FlyerBuilderSection`: text fitting, photo decoding, canvas rendering, print and download.
 * Everything here runs in the browser; nothing is uploaded. Types live in `FlyerBuilderSection.tsx`.
 */
import type { FlyerLocale, FlyerPhoto, FlyerSpec, FlyerValues, FlyerWarning, MeasureText, PhotoErrorCode } from "./FlyerBuilderSection";

// ---- image-fit ----
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * "Contain" fit: the whole image, at its own aspect ratio, centered in the box. Never crops, never stretches.
 * Small images are not scaled up past `maxUpscale` times their size (default 1: no upscaling blur beyond the
 * box is avoided by letting small photos stay small and centered).
 */
export function containRect(srcW: number, srcH: number, box: Rect, maxUpscale = Number.POSITIVE_INFINITY): Rect {
  if (srcW <= 0 || srcH <= 0 || box.w <= 0 || box.h <= 0) return { x: box.x, y: box.y, w: 0, h: 0 };
  const scale = Math.min(box.w / srcW, box.h / srcH, maxUpscale);
  const w = srcW * scale;
  const h = srcH * scale;
  return { x: box.x + (box.w - w) / 2, y: box.y + (box.h - h) / 2, w, h };
}

/** Scale a size down so its long edge is at most `maxEdge`; never scales up. */
export function capLongEdge(width: number, height: number, maxEdge: number): { width: number; height: number } {
  const long = Math.max(width, height);
  if (long <= maxEdge) return { width, height };
  const k = maxEdge / long;
  return { width: Math.max(1, Math.round(width * k)), height: Math.max(1, Math.round(height * k)) };
}

// ---- text-fit ----

/** Greedy word wrap. A word longer than the width is broken by characters. Blank lines are kept. */
export function wrapText(text: string, maxWidth: number, font: string, measure: MeasureText): string[] {
  const out: string[] = [];
  for (const rawLine of text.replace(/\r\n?/g, "\n").split("\n")) {
    const words = rawLine.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      out.push("");
      continue;
    }
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (measure(candidate, font) <= maxWidth) {
        line = candidate;
        continue;
      }
      if (line) out.push(line);
      if (measure(word, font) <= maxWidth) {
        line = word;
        continue;
      }
      // A single word too wide for a line: break it by characters.
      let piece = "";
      for (const ch of Array.from(word)) {
        if (measure(piece + ch, font) > maxWidth && piece) {
          out.push(piece);
          piece = ch;
        } else {
          piece += ch;
        }
      }
      line = piece;
    }
    out.push(line);
  }
  return out;
}

export interface FitResult {
  size: number;
  lines: string[];
  /** Total height of the wrapped block in the same units as `size`. */
  height: number;
  /** True when even the minimum size does not fit and the text was clipped to the box. */
  clipped: boolean;
}

export interface FitOptions {
  maxWidth: number;
  maxHeight: number;
  maxSize: number;
  minSize: number;
  /** Line height as a multiple of the font size. */
  lineHeight: number;
  /** Font string with `{size}` replaced by the pixel size, for example "bold {size}px Arial". */
  fontTemplate: string;
  /** Hard cap on lines (1 forces a single line that shrinks to fit the width). */
  maxLines?: number;
}

const fontAt = (template: string, size: number) => template.replace("{size}", String(size));

/**
 * Largest font size between `minSize` and `maxSize` at which the wrapped text fits the box.
 * Never crops silently: if nothing fits at `minSize`, the lines are cut to what fits and `clipped` is true.
 */
export function fitText(text: string, opts: FitOptions, measure: MeasureText): FitResult {
  const { maxWidth, maxHeight, maxSize, minSize, lineHeight, fontTemplate } = opts;
  const maxLines = opts.maxLines ?? Number.POSITIVE_INFINITY;
  if (!text.trim()) return { size: minSize, lines: [], height: 0, clipped: false };

  for (let size = Math.floor(maxSize); size >= Math.ceil(minSize); size -= 1) {
    const lines = wrapText(text, maxWidth, fontAt(fontTemplate, size), measure);
    const height = lines.length * size * lineHeight;
    if (lines.length <= maxLines && height <= maxHeight) {
      return { size, lines, height, clipped: false };
    }
  }

  const size = Math.ceil(minSize);
  const all = wrapText(text, maxWidth, fontAt(fontTemplate, size), measure);
  const fit = Math.max(1, Math.min(maxLines, Math.floor(maxHeight / (size * lineHeight))));
  const lines = all.slice(0, fit);
  return { size, lines, height: lines.length * size * lineHeight, clipped: all.length > lines.length };
}

// ---- phone ----
export interface PhoneResult {
  valid: boolean;
  /** Ten digits when valid, otherwise whatever digits were found (country code 1 removed when present). */
  digits: string;
  /** "(555) 123-4567" when valid, otherwise the trimmed input. */
  formatted: string;
}

/** US (NANP) numbers only: ten digits, optional leading 1 or +1, area code starts with 2 to 9. */
export function parseUsPhone(input: string): PhoneResult {
  const trimmed = input.trim();
  let digits = trimmed.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  const valid = /^[2-9]\d{9}$/.test(digits);
  const formatted = valid ? `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}` : trimmed;
  return { valid, digits, formatted };
}

// ---- warnings ----

const STREET_WORDS =
  "st|street|ave|avenue|av|rd|road|blvd|boulevard|dr|drive|ln|lane|way|ct|court|cir|circle|pl|place|pkwy|parkway|hwy|highway|calle|avenida|camino";

// A house number followed by up to three words and a street word: "1234 Elm St", "88 N Main Street".
const NOT_ADDRESS_UNITS = "am|pm|a\\.m\\.|p\\.m\\.|lb|lbs|pounds|years|year|yrs|months|weeks|days|hours|miles|mi|feet|ft|inches|in|kg";
const ADDRESS_RE = new RegExp(`\\b\\d{1,6}(?!\\s*(?:${NOT_ADDRESS_UNITS})\\b)\\s+(?:[A-Za-z0-9.'-]+\\s+){0,3}(?:${STREET_WORDS})\\b\\.?`, "i");

// "reward", "recompensa", or a dollar amount.
const REWARD_RE = /\b(reward|rewards|recompensa|recompensas)\b|\$\s?\d/i;

/** Advisory checks on free text. They never block; the page shows a dismissible note. */
export function detectWarnings(text: string): FlyerWarning[] {
  const found: FlyerWarning[] = [];
  if (ADDRESS_RE.test(text)) found.push("address");
  if (REWARD_RE.test(text)) found.push("reward");
  return found;
}

// ---- photo ----

export const MAX_PHOTO_BYTES = 30 * 1024 * 1024;
export const MAX_LONG_EDGE = 2400;
/** Below this long edge a photo may look soft when printed full page. */
export const LOW_RES_EDGE = 800;


export class PhotoError extends Error {
  constructor(public code: PhotoErrorCode) {
    super(code);
  }
}

/**
 * Decodes a chosen file into a canvas capped at `MAX_LONG_EDGE`. Re-drawing on a canvas applies the photo's
 * orientation (createImageBitmap honors EXIF by default) and drops all metadata, including GPS.
 * The file never leaves the browser.
 */
export async function loadPhoto(file: File): Promise<FlyerPhoto> {
  if (file.type && !file.type.startsWith("image/")) throw new PhotoError("notImage");
  if (file.size > MAX_PHOTO_BYTES) throw new PhotoError("tooBig");
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new PhotoError("unreadable");
  }
  const { width, height } = capLongEdge(bitmap.width, bitmap.height, MAX_LONG_EDGE);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close?.();
    throw new PhotoError("unreadable");
  }
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  const original = Math.max(bitmap.width, bitmap.height);
  bitmap.close?.();
  return { source: canvas, width, height, lowRes: original < LOW_RES_EDGE };
}

// ---- renderer ----

/** Design units per inch. The page is drawn in design units and scaled to the canvas, so layout never depends on pixel size. */
export const UNITS_PER_INCH = 100;

export const HEAVY_FONT = `{size}px FlyerHeavy, Impact, "Arial Narrow", "Helvetica Neue", Arial, sans-serif`;
export const BODY_FONT = `600 {size}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
export const LABEL_FONT = `700 {size}px "Helvetica Neue", Helvetica, Arial, sans-serif`;

/** The subset of CanvasRenderingContext2D the renderer uses, so tests can supply a fake. */
export interface FlyerContext {
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  lineWidth: number;
  font: string;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  save(): void;
  restore(): void;
  scale(x: number, y: number): void;
  fillRect(x: number, y: number, w: number, h: number): void;
  strokeRect(x: number, y: number, w: number, h: number): void;
  fillText(text: string, x: number, y: number): void;
  drawImage(image: CanvasImageSource, x: number, y: number, w: number, h: number): void;
  measureText(text: string): { width: number };
  setLineDash?(segments: number[]): void;
}

export interface RenderOptions {
  /** Pixel width of the canvas the context belongs to; the height follows the page ratio. */
  pixelWidth: number;
  /** Text drawn inside an empty photo frame (preview only). Leave undefined for print and download. */
  photoPlaceholder?: string;
}

export interface RenderReport {
  /** True when the body text hit its minimum size and was cut short. */
  bodyClipped: boolean;
  /** The rectangle the photo was drawn into (design units), or null when no photo. */
  photoRect: Rect | null;
  /** The chosen body font size in design units. */
  bodySize: number;
}

export const canvasHeightFor = (spec: FlyerSpec, pixelWidth: number) =>
  Math.round((pixelWidth * spec.layout.heightIn) / spec.layout.widthIn);

const fieldFor = (spec: FlyerSpec, slot: string) => spec.fields.find((f) => f.slot === slot);

/** Draws one flyer. Pure apart from the context; nothing is stored. */
export function renderFlyer(
  ctx: FlyerContext,
  spec: FlyerSpec,
  values: FlyerValues,
  locale: FlyerLocale,
  photo: FlyerPhoto | null,
  options: RenderOptions,
): RenderReport {
  const { layout, palette } = spec;
  const W = layout.widthIn * UNITS_PER_INCH;
  const H = layout.heightIn * UNITS_PER_INCH;
  const M = layout.marginIn * UNITS_PER_INCH;
  const innerW = W - 2 * M;
  const fixed = spec.fixed[locale];

  const measure: MeasureText = (text, font) => {
    ctx.font = font;
    return ctx.measureText(text).width;
  };

  ctx.save();
  ctx.scale(options.pixelWidth / W, options.pixelWidth / W);

  // Paper.
  ctx.fillStyle = palette.paper;
  ctx.fillRect(0, 0, W, H);

  // Header band with fixed lines.
  const headerH = layout.headerFrac * H;
  ctx.fillStyle = palette.band;
  ctx.fillRect(M, M, innerW, headerH);
  const headerPad = 14;
  const lineShare = (headerH - 2 * headerPad) / Math.max(1, fixed.headerLines.length);
  ctx.fillStyle = palette.onBand;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  fixed.headerLines.forEach((line, i) => {
    const fit = fitText(
      line,
      { maxWidth: innerW - 40, maxHeight: lineShare * 0.92, maxSize: 170, minSize: 24, lineHeight: 1, fontTemplate: HEAVY_FONT, maxLines: 1 },
      measure,
    );
    ctx.font = HEAVY_FONT.replace("{size}", String(fit.size));
    ctx.fillText(fit.lines[0] ?? line, W / 2, M + headerPad + lineShare * (i + 0.5));
  });

  // Footer band: label on top, big line (phone) below.
  const footerH = layout.footerFrac * H;
  const footerY = H - M - footerH;
  ctx.fillStyle = palette.band;
  ctx.fillRect(M, footerY, innerW, footerH);
  const footerPad = 12;
  const labelH = 34;
  ctx.fillStyle = palette.onBand;
  const label = fitText(
    fixed.footerLabel.toUpperCase(),
    { maxWidth: innerW - 40, maxHeight: labelH, maxSize: 26, minSize: 12, lineHeight: 1, fontTemplate: LABEL_FONT, maxLines: 1 },
    measure,
  );
  ctx.font = LABEL_FONT.replace("{size}", String(label.size));
  ctx.fillText(label.lines[0] ?? "", W / 2, footerY + footerPad + labelH / 2);

  const bigField = fieldFor(spec, "footerBig");
  const bigRaw = bigField ? (values[bigField.key] ?? "") : "";
  const phone = parseUsPhone(bigRaw);
  const bigText = bigField?.kind === "phone" ? phone.formatted : bigRaw.trim();
  if (bigText) {
    const bigTop = footerY + footerPad + labelH;
    const bigH = footerH - footerPad * 2 - labelH;
    const big = fitText(
      bigText,
      { maxWidth: innerW - 40, maxHeight: bigH * 0.85, maxSize: 130, minSize: 30, lineHeight: 1, fontTemplate: HEAVY_FONT, maxLines: 1 },
      measure,
    );
    ctx.font = HEAVY_FONT.replace("{size}", String(big.size));
    ctx.fillText(big.lines[0] ?? bigText, W / 2, bigTop + bigH / 2 + 4);
  }

  // Middle region: photo on top, text stack below. The photo gets whatever the text does not need.
  const gap = 22;
  const midTop = M + headerH + gap;
  const midBottom = footerY - gap;
  const midH = midBottom - midTop;
  const photoMin = layout.photoMinFrac * H;

  const titleField = fieldFor(spec, "title");
  const bodyField = fieldFor(spec, "body");
  const titleText = titleField ? (values[titleField.key] ?? "").trim() : "";
  const bodyText = bodyField ? (values[bodyField.key] ?? "").trim() : "";

  let textBudget = Math.max(0, Math.min(layout.textMaxFrac * H, midH - photoMin - gap));
  let titleH = 0;
  let titleSize = 0;
  let titleLine = "";
  if (titleText && textBudget > 0) {
    const t = fitText(
      titleText,
      { maxWidth: innerW, maxHeight: Math.min(80, textBudget), maxSize: 72, minSize: 28, lineHeight: 1.1, fontTemplate: HEAVY_FONT, maxLines: 1 },
      measure,
    );
    titleSize = t.size;
    titleLine = t.lines[0] ?? "";
    titleH = t.height;
  }

  let bodyFit = { size: 0, lines: [] as string[], height: 0, clipped: false };
  if (bodyText && textBudget - titleH - (titleH ? 8 : 0) > 24) {
    bodyFit = fitText(
      bodyText,
      {
        maxWidth: innerW,
        maxHeight: textBudget - titleH - (titleH ? 8 : 0),
        maxSize: 36,
        minSize: 20,
        lineHeight: 1.25,
        fontTemplate: BODY_FONT,
      },
      measure,
    );
  }

  const textH = titleH + bodyFit.height + (titleH && bodyFit.height ? 8 : 0);
  textBudget = textH;
  const photoH = midH - (textH > 0 ? textH + gap : 0);
  const photoBox: Rect = { x: M, y: midTop, w: innerW, h: photoH };

  let photoRect: Rect | null = null;
  if (photo) {
    photoRect = containRect(photo.width, photo.height, photoBox);
    ctx.drawImage(photo.source, photoRect.x, photoRect.y, photoRect.w, photoRect.h);
    ctx.strokeStyle = palette.frame;
    ctx.lineWidth = 2;
    ctx.strokeRect(photoRect.x, photoRect.y, photoRect.w, photoRect.h);
  } else if (options.photoPlaceholder) {
    ctx.strokeStyle = palette.frame;
    ctx.lineWidth = 3;
    ctx.setLineDash?.([14, 10]);
    ctx.strokeRect(photoBox.x, photoBox.y, photoBox.w, photoBox.h);
    ctx.setLineDash?.([]);
    ctx.fillStyle = palette.frame;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = LABEL_FONT.replace("{size}", "34");
    ctx.fillText(options.photoPlaceholder, photoBox.x + photoBox.w / 2, photoBox.y + photoBox.h / 2);
  }

  // Text stack below the photo.
  let y = photoBox.y + photoBox.h + (textH > 0 ? gap : 0);
  ctx.fillStyle = palette.ink;
  ctx.textAlign = "left";
  if (titleLine) {
    ctx.textBaseline = "middle";
    ctx.font = HEAVY_FONT.replace("{size}", String(titleSize));
    ctx.fillText(titleLine, M, y + titleH / 2);
    y += titleH + 8;
  }
  if (bodyFit.lines.length) {
    ctx.textBaseline = "top";
    ctx.font = BODY_FONT.replace("{size}", String(bodyFit.size));
    const step = bodyFit.size * 1.25;
    bodyFit.lines.forEach((line, i) => ctx.fillText(line, M, y + i * step + (step - bodyFit.size) / 2));
  }

  ctx.restore();
  return { bodyClipped: bodyFit.clipped, photoRect, bodySize: bodyFit.size };
}

// ---- output ----

/** Print resolution: 300 dpi across the page width. */
export const PRINT_DPI = 300;

/** Draws the flyer at full print resolution on a fresh canvas. */
export function renderPrintCanvas(spec: FlyerSpec, values: FlyerValues, locale: FlyerLocale, photo: FlyerPhoto | null): HTMLCanvasElement {
  const pixelWidth = Math.round(spec.layout.widthIn * PRINT_DPI);
  const canvas = document.createElement("canvas");
  canvas.width = pixelWidth;
  canvas.height = canvasHeightFor(spec, pixelWidth);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas unavailable");
  renderFlyer(ctx, spec, values, locale, photo, { pixelWidth });
  return canvas;
}

const toBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png"));

/** `prefix` comes from the spec (`fileNamePrefix`), so each flyer type names its own downloads. */
export const fileNameFor = (name: string, prefix = "flyer") => {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
  return slug ? `${prefix}-${slug}.png` : `${prefix}.png`;
};

/** Saves the canvas as a PNG through a temporary link. Nothing is uploaded. */
export async function downloadCanvas(canvas: HTMLCanvasElement, fileName: string): Promise<void> {
  const blob = await toBlob(canvas);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/**
 * Prints the canvas as one full page. The image sits in a hidden iframe so the site's header, footer and
 * styles never reach the printed page, with `@page` set to the flyer's exact size and no browser margin.
 */
export async function printCanvas(canvas: HTMLCanvasElement, widthIn: number, heightIn: number, title: string): Promise<void> {
  const dataUrl = canvas.toDataURL("image/png");
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.tabIndex = -1;
  iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden";
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  const win = iframe.contentWindow;
  if (!doc || !win) {
    iframe.remove();
    throw new Error("print frame unavailable");
  }
  doc.open();
  doc.write(
    `<!doctype html><html><head><meta charset="utf-8"><title>${title.replace(/[<&>]/g, "")}</title>` +
      `<style>@page{size:${widthIn}in ${heightIn}in;margin:0}html,body{margin:0;padding:0;background:#fff}` +
      `img{display:block;width:${widthIn}in;height:${heightIn}in}</style></head><body><img alt=""></body></html>`,
  );
  doc.close();
  const img = doc.querySelector("img");
  if (!img) {
    iframe.remove();
    throw new Error("print frame empty");
  }
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("print image failed"));
    img.src = dataUrl;
  });
  const cleanup = () => window.setTimeout(() => iframe.remove(), 500);
  win.addEventListener("afterprint", cleanup, { once: true });
  window.setTimeout(() => iframe.remove(), 5 * 60_000);
  win.focus();
  win.print();
}

// ---- fonts ----
const fontLoads = new Map<string, Promise<void>>();

/**
 * Loads the optional heavy headline face once per URL. With no URL, or when the font cannot load, the renderer
 * falls back to Impact / Arial Narrow / sans-serif. The URL is the site's own file (same origin), never a CDN.
 */
export function loadFlyerFonts(fontUrl?: string): Promise<void> {
  if (!fontUrl || typeof document === "undefined" || typeof FontFace === "undefined") return Promise.resolve();
  let pending = fontLoads.get(fontUrl);
  if (!pending) {
    pending = (async () => {
      try {
        const face = new FontFace("FlyerHeavy", `url(${fontUrl}) format("woff2")`);
        await face.load();
        document.fonts.add(face);
      } catch {
        // Fall back to the system faces in HEAVY_FONT.
      }
    })();
    fontLoads.set(fontUrl, pending);
  }
  return pending;
}
