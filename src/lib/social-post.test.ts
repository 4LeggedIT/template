import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cachedVerdict, parseSocialPost, rememberVerdict } from "@/lib/social-post";
import { checkExists, detectBlockedEmbed } from "@/lib/social-post-checks";

const memoryStorage = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k), clear: () => m.clear() };
};

describe("parseSocialPost", () => {
  it("parses Facebook posts, reels and videos", () => {
    expect(parseSocialPost("https://www.facebook.com/reel/942053501572129")).toMatchObject({ platform: "facebook", isVideo: true });
    expect(parseSocialPost("https://www.facebook.com/permalink.php?story_fbid=pfbid0&id=61591427017177")).toMatchObject({ platform: "facebook", isVideo: false });
    expect(parseSocialPost("https://web.facebook.com/page/videos/123")).toMatchObject({ platform: "facebook", isVideo: true });
  });

  it("parses Instagram posts and reels, with or without the account prefix, to the canonical form", () => {
    expect(parseSocialPost("https://www.instagram.com/comebackpack/p/Dd5daDbKuc8/")).toMatchObject({ platform: "instagram", id: "Dd5daDbKuc8", canonicalUrl: "https://www.instagram.com/p/Dd5daDbKuc8/", isVideo: false });
    expect(parseSocialPost("https://instagram.com/reel/DfpV7lVqnfz")).toMatchObject({ id: "DfpV7lVqnfz", canonicalUrl: "https://www.instagram.com/reel/DfpV7lVqnfz/", isVideo: true });
    expect(parseSocialPost("https://www.instagram.com/p/Dd5daDbKuc8/?utm_source=ig_web_copy_link")?.id).toBe("Dd5daDbKuc8");
  });

  it("parses TikTok videos and photos", () => {
    expect(parseSocialPost("https://www.tiktok.com/@the.comback.pack/video/7707299972596698399")).toMatchObject({ platform: "tiktok", id: "7707299972596698399", canonicalUrl: "https://www.tiktok.com/player/v1/7707299972596698399", isVideo: true });
    expect(parseSocialPost("https://www.tiktok.com/@the.comback.pack/photo/7707299972596698399")).toMatchObject({ platform: "tiktok", isVideo: false });
  });

  it("rejects what cannot be embedded", () => {
    for (const url of [
      "https://www.instagram.com/stories/comebackpack/4028584406070992855?reel_id=62083456037",
      "https://www.instagram.com/comebackpack/",
      "https://vm.tiktok.com/ZMabc123/",
      "https://www.tiktok.com/@the.comback.pack",
      "https://example.com/p/abc",
      "javascript:alert(1)",
      "not a url",
    ]) expect(parseSocialPost(url), url).toBeNull();
  });
});

describe("verdict cache", () => {
  beforeEach(() => vi.stubGlobal("localStorage", memoryStorage()));
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

  it("remembers a verdict for a day, then forgets it", () => {
    vi.useFakeTimers();
    rememberVerdict("https://www.facebook.com/reel/1", "blocked");
    expect(cachedVerdict("https://www.facebook.com/reel/1")).toBe("blocked");
    vi.advanceTimersByTime(25 * 60 * 60 * 1000);
    expect(cachedVerdict("https://www.facebook.com/reel/1")).toBeUndefined();
  });

  it("remembers a verdict and honours the seed list first", () => {
    const u = "https://www.instagram.com/p/abc/";
    expect(cachedVerdict(u)).toBeUndefined();
    rememberVerdict(u, "gone");
    expect(cachedVerdict(u)).toBe("gone");
    expect(cachedVerdict("https://x.test/", new Set(["https://x.test/"]))).toBe("gone");
  });
});

describe("checkExists", () => {
  beforeEach(() => { vi.stubGlobal("localStorage", memoryStorage()); vi.useFakeTimers(); });
  afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

  const reply = (status: number, body: unknown) => vi.fn().mockResolvedValue({ ok: status < 400, status, json: async () => body });
  const run = async (url: string) => {
    const post = parseSocialPost(url)!;
    const p = checkExists(post);
    await vi.advanceTimersByTimeAsync(1500);
    return p;
  };

  it("Instagram: private (2207046) and not found (2207045) are gone, and cached", async () => {
    for (const sub of [2207046, 2207045]) {
      vi.stubGlobal("fetch", reply(400, { error: { code: 200, error_subcode: sub } }));
      const url = `https://www.instagram.com/p/gone${sub}/`;
      expect(await run(url)).toBe("gone");
      expect(cachedVerdict(url)).toBe("gone");
    }
  });

  it("Instagram: a rate limit or network error is never a verdict", async () => {
    vi.stubGlobal("fetch", reply(403, { error: { code: 4, is_transient: true } }));
    const url = "https://www.instagram.com/p/rate/";
    expect(await run(url)).toBe("ok");
    expect(cachedVerdict(url)).toBeUndefined();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect(await run(url)).toBe("ok");
  });

  it("Instagram: a successful oEmbed is ok and uses the canonical URL", async () => {
    const f = reply(200, { html: "<blockquote/>" });
    vi.stubGlobal("fetch", f);
    expect(await run("https://www.instagram.com/comebackpack/p/Dd5daDbKuc8/")).toBe("ok");
    expect(String(f.mock.calls[0][0])).toContain("instagram_oembed?url=https%3A%2F%2Fwww.instagram.com%2Fp%2FDd5daDbKuc8%2F");
  });

  it("Facebook: 400 / code 100 is gone; anything else is ok", async () => {
    vi.stubGlobal("fetch", reply(400, { error: { code: 100 } }));
    expect(await run("https://www.facebook.com/reel/1")).toBe("gone");
    vi.stubGlobal("fetch", reply(400, { error: { code: 1 } }));
    expect(await run("https://www.facebook.com/reel/2")).toBe("ok");
  });

  it("TikTok: makes no network call (its oEmbed answers 200 for any id)", async () => {
    const f = vi.fn();
    vi.stubGlobal("fetch", f);
    expect(await run("https://www.tiktok.com/@a/video/123")).toBe("ok");
    expect(f).not.toHaveBeenCalled();
  });
});

describe("detectBlockedEmbed (Facebook)", () => {
  afterEach(() => vi.useRealTimers());

  it("recognises the 400x225 box, not other sizes, and gives up with no iframe", async () => {
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
