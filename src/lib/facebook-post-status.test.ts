import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cachedVerdict, checkExists, detectBlockedEmbed, rememberVerdict } from "@/lib/facebook-post-status";

// Some Node/jsdom combinations expose no usable `localStorage`; a tiny in-memory stand-in keeps the tests environment-independent.
const memoryStorage = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k), clear: () => m.clear() };
};

const URL_A = "https://www.facebook.com/reel/1";

describe("facebook-post-status", () => {
  beforeEach(() => vi.stubGlobal("localStorage", memoryStorage()));
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("treats a seed-list URL as gone without any network", () => {
    expect(cachedVerdict(URL_A, new Set([URL_A]))).toBe("gone");
    expect(cachedVerdict(URL_A)).toBeUndefined();
  });

  it("remembers a verdict for a day, then forgets it", () => {
    vi.useFakeTimers();
    rememberVerdict(URL_A, "blocked");
    expect(cachedVerdict(URL_A)).toBe("blocked");
    vi.advanceTimersByTime(25 * 60 * 60 * 1000);
    expect(cachedVerdict(URL_A)).toBeUndefined();
  });

  it("oEmbed 400 / code 100 is a definite 'gone' and is cached", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 400, json: async () => ({ error: { code: 100 } }) }));
    await expect(checkExists("https://www.facebook.com/reel/gone")).resolves.toBe("gone");
    expect(cachedVerdict("https://www.facebook.com/reel/gone")).toBe("gone");
  });

  it("a rate limit (403 / code 4) is never a verdict: shown, not cached", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 403, json: async () => ({ error: { code: 4 } }) }));
    await expect(checkExists("https://www.facebook.com/reel/limited")).resolves.toBe("ok");
    expect(cachedVerdict("https://www.facebook.com/reel/limited")).toBeUndefined();
  });

  it("a network error is never a verdict", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(checkExists("https://www.facebook.com/reel/offline")).resolves.toBe("ok");
    expect(cachedVerdict("https://www.facebook.com/reel/offline")).toBeUndefined();
  });

  it("a successful oEmbed answer is cached as ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ html: "<div/>" }) }));
    await expect(checkExists("https://www.facebook.com/reel/fine")).resolves.toBe("ok");
    expect(cachedVerdict("https://www.facebook.com/reel/fine")).toBe("ok");
  });

  it("detectBlockedEmbed recognises the 400x225 box, not other sizes, and gives up with no iframe", async () => {
    vi.useFakeTimers();
    const rect = (w: number, h: number) => ({ width: w, height: h }) as DOMRect;
    const box = document.createElement("div");
    const frame = document.createElement("iframe");
    box.appendChild(frame);
    const spy = vi.spyOn(frame, "getBoundingClientRect");

    spy.mockReturnValue(rect(400, 225));
    const blocked = detectBlockedEmbed(box);
    await vi.advanceTimersByTimeAsync(5000);
    await expect(blocked).resolves.toBe(true);

    spy.mockReturnValue(rect(400, 711));
    const fine = detectBlockedEmbed(box);
    await vi.advanceTimersByTimeAsync(5000);
    await expect(fine).resolves.toBe(false);

    const empty = detectBlockedEmbed(document.createElement("div"));
    await vi.advanceTimersByTimeAsync(20000);
    await expect(empty).resolves.toBe(false);
  });
});
