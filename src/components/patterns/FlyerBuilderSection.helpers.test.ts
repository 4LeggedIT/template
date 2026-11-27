import { describe, expect, it } from "vitest";
import {
  canvasHeightFor,
  capLongEdge,
  containRect,
  detectWarnings,
  fileNameFor,
  fitText,
  parseUsPhone,
  renderFlyer,
  UNITS_PER_INCH,
  wrapText,
  type FlyerContext,
} from "./FlyerBuilderSection.helpers";
import type { FlyerLocale, FlyerPhoto, FlyerValues } from "./FlyerBuilderSection";
import { foundDogFlyerSpec, lostDogFlyerSpec as missingDogFlyer } from "./FlyerBuilderSection.specs";

// Width model: every character is half the font size wide.
const measure = (text: string, font: string) => {
  const size = Number(/(\d+)px/.exec(font)?.[1] ?? 10);
  return Array.from(text).length * size * 0.5;
};

describe("wrapText", () => {
  it("wraps on word boundaries", () => {
    expect(wrapText("one two three four", 60, "10px x", measure)).toEqual(["one two", "three four"]);
  });
  it("breaks a word that is wider than the line", () => {
    const lines = wrapText("abcdefghijklmnopqrst", 50, "10px x", measure);
    expect(lines.length).toBeGreaterThan(1);
    expect(lines.join("")).toBe("abcdefghijklmnopqrst");
    for (const l of lines) expect(measure(l, "10px x")).toBeLessThanOrEqual(50);
  });
  it("keeps blank lines and handles empty text", () => {
    expect(wrapText("a\n\nb", 100, "10px x", measure)).toEqual(["a", "", "b"]);
    expect(wrapText("", 100, "10px x", measure)).toEqual([""]);
  });
  it("keeps accents and emoji intact", () => {
    const lines = wrapText("Perro pequeño, ¡muy dócil! 🐶", 400, "10px x", measure);
    expect(lines.join(" ")).toContain("🐶");
    expect(lines.join(" ")).toContain("pequeño");
  });
});

describe("fitText", () => {
  const base = { maxWidth: 200, maxHeight: 100, maxSize: 40, minSize: 10, lineHeight: 1.2, fontTemplate: "{size}px x" };
  it("uses the largest size that fits", () => {
    const r = fitText("hello world", base, measure);
    expect(r.clipped).toBe(false);
    expect(r.height).toBeLessThanOrEqual(100);
    if (r.size < 40) {
      const next = r.size + 1;
      const nextHeight = wrapText("hello world", 200, `${next}px x`, measure).length * next * 1.2;
      expect(nextHeight).toBeGreaterThan(100);
    }
  });
  it("returns nothing for blank text", () => {
    expect(fitText("   ", base, measure)).toMatchObject({ lines: [], height: 0, clipped: false });
  });
  it("forces one line when maxLines is 1 by shrinking", () => {
    const r = fitText("DO NOT CHASE", { ...base, maxLines: 1, maxWidth: 100 }, measure);
    expect(r.lines).toHaveLength(1);
    expect(measure(r.lines[0], `${r.size}px x`)).toBeLessThanOrEqual(100);
  });
  it("clips and reports it when nothing fits at the minimum", () => {
    const r = fitText("word ".repeat(200), { ...base, maxHeight: 30 }, measure);
    expect(r.clipped).toBe(true);
    expect(r.size).toBe(10);
    expect(r.height).toBeLessThanOrEqual(30);
  });
});

describe("containRect (never crops, never stretches)", () => {
  const box = { x: 10, y: 20, w: 400, h: 300 };
  it.each([
    ["portrait", 300, 600],
    ["landscape", 1600, 900],
    ["square", 500, 500],
    ["very wide", 4000, 200],
    ["very tall", 200, 4000],
    ["tiny", 30, 20],
  ])("%s photo fits whole, keeps its ratio, stays centered inside the box", (_n, w, h) => {
    const r = containRect(w, h, box);
    expect(r.w).toBeLessThanOrEqual(box.w + 1e-9);
    expect(r.h).toBeLessThanOrEqual(box.h + 1e-9);
    expect(r.w / r.h).toBeCloseTo(w / h, 6);
    expect(r.x).toBeGreaterThanOrEqual(box.x - 1e-9);
    expect(r.y).toBeGreaterThanOrEqual(box.y - 1e-9);
    expect(r.x + r.w / 2).toBeCloseTo(box.x + box.w / 2, 6);
    expect(r.y + r.h / 2).toBeCloseTo(box.y + box.h / 2, 6);
    // As large as it can be: at least one edge touches the box.
    expect(Math.abs(r.w - box.w) < 1e-6 || Math.abs(r.h - box.h) < 1e-6).toBe(true);
  });
  it("returns an empty rect for zero sizes", () => {
    expect(containRect(0, 10, box).w).toBe(0);
    expect(containRect(10, 10, { ...box, h: 0 }).h).toBe(0);
  });
});

describe("capLongEdge", () => {
  it("scales down keeping the ratio and never scales up", () => {
    expect(capLongEdge(4800, 2400, 2400)).toEqual({ width: 2400, height: 1200 });
    expect(capLongEdge(1000, 500, 2400)).toEqual({ width: 1000, height: 500 });
  });
});

describe("parseUsPhone", () => {
  it.each([
    ["5551234567", "(555) 123-4567"],
    ["(951) 543-8825", "(951) 543-8825"],
    ["951-543-8825", "(951) 543-8825"],
    ["+1 951 543 8825", "(951) 543-8825"],
    ["1-760-585-5973", "(760) 585-5973"],
    ["  951.543.8825 ", "(951) 543-8825"],
  ])("accepts %s", (input, formatted) => {
    const r = parseUsPhone(input);
    expect(r.valid).toBe(true);
    expect(r.formatted).toBe(formatted);
    expect(r.digits).toHaveLength(10);
  });
  it.each(["", "12345", "0551234567", "1551234567", "555123456", "555123456789", "abc", "+44 20 7946 0958"]) (
    "rejects %s",
    (input) => {
      expect(parseUsPhone(input).valid).toBe(false);
    },
  );
});

describe("detectWarnings", () => {
  it.each(["Last seen at 1234 Elm St", "lives at 88 N Main Street", "home is 4521 Oak Avenue, Wildomar", "vive en 120 Calle Sol"])(
    "flags an address: %s",
    (text) => {
      expect(detectWarnings(text)).toContain("address");
    },
  );
  it.each([
    "Brown and white, medium size, green collar. Last seen near the park on Elm St. and 5th on Tuesday around 4 pm.",
    "Weighs 50 lb, last seen near Main St",
    "Seen at 4 pm on Elm St",
    "Female, 3 years old, near the creek",
  ])("does not flag ordinary text: %s", (text) => {
    expect(detectWarnings(text)).not.toContain("address");
  });
  it.each(["Reward offered", "$500 reward", "Hay una recompensa", "will pay $ 200"])("flags a reward: %s", (text) => {
    expect(detectWarnings(text)).toContain("reward");
  });
  it("does not flag text that only resembles the word", () => {
    expect(detectWarnings("He is rewarding to be around")).not.toContain("reward");
  });
});

type Call = { op: string; args: unknown[]; font: string; fill: unknown };

/** A recording fake of the canvas context. Text is half a font-size wide per character. */
function fakeContext() {
  const calls: Call[] = [];
  const ctx: FlyerContext = {
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    font: "10px x",
    textAlign: "left",
    textBaseline: "alphabetic",
    save: () => {},
    restore: () => {},
    scale: () => {},
    setLineDash: () => {},
    fillRect: (...args) => void calls.push({ op: "fillRect", args, font: ctx.font, fill: ctx.fillStyle }),
    strokeRect: (...args) => void calls.push({ op: "strokeRect", args, font: ctx.font, fill: ctx.fillStyle }),
    fillText: (...args) => void calls.push({ op: "fillText", args, font: ctx.font, fill: ctx.fillStyle }),
    drawImage: (...args) => void calls.push({ op: "drawImage", args, font: ctx.font, fill: ctx.fillStyle }),
    measureText: (text) => {
      const size = Number(/(\d+)px/.exec(ctx.font)?.[1] ?? 10);
      return { width: Array.from(text).length * size * 0.5 };
    },
  };
  return { ctx, calls };
}

const photoOf = (width: number, height: number): FlyerPhoto => ({ source: {} as CanvasImageSource, width, height });
const draw = (values: FlyerValues, locale: FlyerLocale = "en", photo: FlyerPhoto | null = photoOf(1200, 900)) => {
  const { ctx, calls } = fakeContext();
  const report = renderFlyer(ctx, missingDogFlyer, values, locale, photo, { pixelWidth: 850 });
  return { calls, report, texts: calls.filter((c) => c.op === "fillText").map((c) => String(c.args[0])) };
};

const W = missingDogFlyer.layout.widthIn * UNITS_PER_INCH;
const H = missingDogFlyer.layout.heightIn * UNITS_PER_INCH;
const M = missingDogFlyer.layout.marginIn * UNITS_PER_INCH;

describe("renderFlyer: fixed wording", () => {
  it("always says DO NOT CHASE and LOST DOG in English", () => {
    const { texts } = draw({ phone: "9515438825" });
    expect(texts).toContain("DO NOT CHASE");
    expect(texts).toContain("LOST DOG");
  });
  it("says NO LO PERSIGAS and PERRO PERDIDO in Spanish", () => {
    const { texts } = draw({ phone: "9515438825" }, "es");
    expect(texts).toContain("NO LO PERSIGAS");
    expect(texts).toContain("PERRO PERDIDO");
    expect(texts).not.toContain("DO NOT CHASE");
  });
  it("carries no organization branding", () => {
    for (const locale of ["en", "es"] as const) {
      const { texts } = draw({ phone: "9515438825", name: "Max", description: "Brown dog" }, locale);
      expect(texts.join(" ")).not.toMatch(/rovers|return|585|760/i);
    }
  });
});

describe("renderFlyer: the person's input", () => {
  it("draws the phone number formatted, big, in the footer band", () => {
    const { calls } = draw({ phone: "9515438825" });
    const phone = calls.find((c) => c.op === "fillText" && c.args[0] === "(951) 543-8825");
    expect(phone).toBeDefined();
    const size = Number(/(\d+)px/.exec(phone!.font)?.[1]);
    expect(size).toBeGreaterThanOrEqual(60);
  });
  it("draws name and description when given, and nothing when blank", () => {
    const filled = draw({ phone: "9515438825", name: "Max", description: "Brown and white, green collar." });
    expect(filled.texts).toContain("Max");
    expect(filled.texts.join(" ")).toContain("Brown and white");
    const blank = draw({ phone: "9515438825" });
    expect(blank.texts).not.toContain("Max");
    expect(blank.report.bodySize).toBe(0);
  });
  it("gives the photo more room when there is no text", () => {
    const withText = draw({ phone: "9515438825", name: "Max", description: "Brown dog. ".repeat(12) }, "en", photoOf(900, 1200));
    const without = draw({ phone: "9515438825" }, "en", photoOf(900, 1200));
    expect(without.report.photoRect!.h).toBeGreaterThan(withText.report.photoRect!.h);
  });
  it("is deterministic for the same input", () => {
    const a = draw({ phone: "9515438825", name: "Max", description: "x y z" });
    const b = draw({ phone: "9515438825", name: "Max", description: "x y z" });
    expect(a.calls).toEqual(b.calls);
  });
});

describe("renderFlyer: photo is never cropped", () => {
  it.each([
    ["portrait", 900, 1600],
    ["landscape", 1600, 900],
    ["square", 1000, 1000],
    ["very wide", 4000, 300],
    ["very tall", 300, 4000],
    ["tiny", 40, 30],
  ])("%s photo is drawn whole, in proportion, inside the margins", (_n, w, h) => {
    const { calls, report } = draw({ phone: "9515438825", name: "Max", description: "Brown dog" }, "en", photoOf(w, h));
    const img = calls.find((c) => c.op === "drawImage")!;
    const [, x, y, dw, dh] = img.args as [unknown, number, number, number, number];
    expect(dw / dh).toBeCloseTo(w / h, 5);
    expect(x).toBeGreaterThanOrEqual(M - 1e-6);
    expect(x + dw).toBeLessThanOrEqual(W - M + 1e-6);
    expect(y).toBeGreaterThan(0);
    expect(y + dh).toBeLessThan(H);
    expect(report.photoRect).not.toBeNull();
  });
  it("draws nothing for the photo when none is chosen, and a placeholder only when asked", () => {
    const { ctx, calls } = fakeContext();
    renderFlyer(ctx, missingDogFlyer, { phone: "9515438825" }, "en", null, { pixelWidth: 850, photoPlaceholder: "Your photo goes here" });
    expect(calls.some((c) => c.op === "drawImage")).toBe(false);
    expect(calls.some((c) => c.op === "fillText" && c.args[0] === "Your photo goes here")).toBe(true);
    const printed = fakeContext();
    renderFlyer(printed.ctx, missingDogFlyer, { phone: "9515438825" }, "en", null, { pixelWidth: 850 });
    expect(printed.calls.some((c) => c.op === "fillText" && c.args[0] === "Your photo goes here")).toBe(false);
  });
});

describe("renderFlyer: layout stays on the page", () => {
  it("keeps every filled rectangle inside the page margins", () => {
    const { calls } = draw({ phone: "9515438825", name: "Max", description: "x ".repeat(100) });
    for (const c of calls.filter((k) => k.op === "fillRect" && k.args[2] !== W)) {
      const [x, y, w, h] = c.args as number[];
      expect(x).toBeGreaterThanOrEqual(M - 1e-6);
      expect(x + w).toBeLessThanOrEqual(W - M + 1e-6);
      expect(y).toBeGreaterThanOrEqual(M - 1e-6);
      expect(y + h).toBeLessThanOrEqual(H - M + 1e-6);
    }
  });
  it("keeps every text line inside the page width", () => {
    const { calls } = draw({
      phone: "9515438825",
      name: "A very long dog name that goes on and on and on",
      description: "Pneumonoultramicroscopicsilicovolcanoconiosis ".repeat(8) + "w".repeat(200),
    });
    for (const c of calls.filter((k) => k.op === "fillText")) {
      const text = String(c.args[0]);
      const size = Number(/(\d+)px/.exec(c.font)?.[1]);
      const width = Array.from(text).length * size * 0.5;
      expect(width).toBeLessThanOrEqual(W - 2 * M + 1e-6);
    }
  });
  it("flags clipped body text instead of silently dropping it", () => {
    const { report } = draw({ phone: "9515438825", name: "Max", description: "word ".repeat(300) });
    expect(report.bodyClipped).toBe(true);
  });
  it("canvas height follows the page ratio", () => {
    expect(canvasHeightFor(missingDogFlyer, 2550)).toBe(3300);
    expect(canvasHeightFor(missingDogFlyer, 1020)).toBe(1320);
  });
});

describe("missing dog flyer spec", () => {
  it("has the four inputs, photo and phone required", () => {
    const keys = missingDogFlyer.fields.map((f) => f.key);
    expect(keys).toEqual(["photo", "name", "description", "phone"]);
    expect(missingDogFlyer.fields.filter((f) => f.required).map((f) => f.key)).toEqual(["photo", "phone"]);
  });
  it("is Letter portrait", () => {
    expect(missingDogFlyer.layout.widthIn).toBe(8.5);
    expect(missingDogFlyer.layout.heightIn).toBe(11);
  });
  it("has fixed wording for both languages, with no em dashes", () => {
    for (const locale of ["en", "es"] as const) {
      const fixed = missingDogFlyer.fixed[locale];
      expect(fixed.headerLines.length).toBeGreaterThan(0);
      expect(fixed.footerLabel.length).toBeGreaterThan(0);
      expect(JSON.stringify(fixed)).not.toContain("—");
    }
  });
});

describe("found dog spec", () => {
  it("renders its own fixed wording and shares the lost-dog inputs", () => {
    const { ctx, calls } = fakeContext();
    renderFlyer(ctx, foundDogFlyerSpec, { phone: "9515438825" }, "en", null, { pixelWidth: 850 });
    const texts = calls.filter((c) => c.op === "fillText").map((c) => String(c.args[0]));
    expect(texts).toContain("FOUND DOG");
    expect(texts).not.toContain("DO NOT CHASE");
    expect(foundDogFlyerSpec.fields.map((f) => f.key)).toEqual(["photo", "name", "description", "phone"]);
  });
  it("has fixed wording for both languages, with no em dashes", () => {
    for (const locale of ["en", "es"] as const) {
      expect(JSON.stringify(foundDogFlyerSpec.fixed[locale])).not.toContain("—");
    }
  });
});

describe("fileNameFor", () => {
  it("slugifies the name onto the prefix, dropping accents", () => {
    expect(fileNameFor("Max Ñandú", "lost-dog-flyer")).toBe("lost-dog-flyer-max-nandu.png");
  });
  it("falls back to the bare prefix", () => {
    expect(fileNameFor("  ", "lost-dog-flyer")).toBe("lost-dog-flyer.png");
    expect(fileNameFor("")).toBe("flyer.png");
  });
});
