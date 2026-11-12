import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SocialPostEmbed from "@/components/patterns/SocialPostEmbed";

const memoryStorage = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k), clear: () => m.clear() };
};
const nearViewport = () =>
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(private cb: (e: { isIntersecting: boolean }[]) => void) {}
      observe() { this.cb([{ isIntersecting: true }]); }
      disconnect() {}
    },
  );

const FB = "https://www.facebook.com/reel/123";
const IG = "https://www.instagram.com/comebackpack/p/Dd5daDbKuc8/";
const TT = "https://www.tiktok.com/@the.comback.pack/video/7707299972596698399";

describe("SocialPostEmbed", () => {
  beforeEach(() => vi.stubGlobal("localStorage", memoryStorage()));
  afterEach(() => vi.unstubAllGlobals());

  it.each([
    [FB, /View original post/],
    [IG, /View original post/],
    [TT, /View original post/],
  ])("always renders the plain link (no-JS fallback) and no embed before it is near the viewport: %s", (url, name) => {
    const { container } = render(<SocialPostEmbed url={url} />);
    const link = screen.getByRole("link", { name });
    expect(link).toHaveAttribute("href", url);
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(container.querySelector(".fb-video, .fb-post, iframe")).toBeNull();
  });

  it("uses a custom link label", () => {
    render(<SocialPostEmbed url={IG} linkLabel="Ver publicación original" />);
    expect(screen.getByRole("link", { name: /Ver publicación original/ })).toBeInTheDocument();
  });

  it.each([FB, IG, TT])("tells the parent when the post is on the seed list, before loading anything: %s", async (url) => {
    nearViewport();
    const onUnavailable = vi.fn();
    render(<SocialPostEmbed url={url} knownGone={new Set([url])} onUnavailable={onUnavailable} />);
    await vi.waitFor(() => expect(onUnavailable).toHaveBeenCalledTimes(1));
    expect(document.querySelector(".fb-video, .fb-post, iframe")).toBeNull();
  });

  it("renders only the link, and never drops the item, for a URL it cannot embed", async () => {
    nearViewport();
    const onUnavailable = vi.fn();
    const story = "https://www.instagram.com/stories/comebackpack/4028584406070992855";
    render(<SocialPostEmbed url={story} onUnavailable={onUnavailable} />);
    expect(screen.getByRole("link", { name: /View original post/ })).toHaveAttribute("href", story);
    await new Promise((r) => setTimeout(r, 20));
    expect(onUnavailable).not.toHaveBeenCalled();
  });

  it("Instagram: a script-free iframe on the canonical embed page, sized from the page's MEASURE message", async () => {
    nearViewport();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ html: "<blockquote/>" }) }));
    render(<SocialPostEmbed url={IG} />);
    const frame = await vi.waitFor(() => {
      const f = document.querySelector("iframe");
      expect(f).not.toBeNull();
      return f as HTMLIFrameElement;
    }, { timeout: 3000 });
    expect(frame.src).toBe("https://www.instagram.com/p/Dd5daDbKuc8/embed/captioned/");
    expect(document.querySelector("script[src*='instagram']")).toBeNull();
    const send = (data: string, source: MessageEventSource | null = frame.contentWindow) => window.dispatchEvent(new MessageEvent("message", { source, data }));
    send(JSON.stringify({ type: "MEASURE", details: { height: 1079 } }));
    await vi.waitFor(() => expect(frame.style.height).toBe("1079px"));
    send(JSON.stringify({ type: "MEASURE", details: { height: 200 } }), window);
    send("not json");
    expect(frame.style.height).toBe("1079px");
  });

  it("TikTok: a player error 1001 from the iframe drops the post; other errors do not", async () => {
    nearViewport();
    const onUnavailable = vi.fn();
    render(<SocialPostEmbed url={TT} onUnavailable={onUnavailable} />);
    const frame = await vi.waitFor(() => {
      const f = document.querySelector("iframe");
      expect(f).not.toBeNull();
      return f as HTMLIFrameElement;
    });
    expect(frame.src).toContain("/player/v1/7707299972596698399");
    const send = (value: object) => window.dispatchEvent(new MessageEvent("message", { source: frame.contentWindow, data: { "x-tiktok-player": true, type: "onPlayerError", value } }));
    send({ errorCode: 3001, errorType: "PLAYBACK_ERROR" });
    expect(onUnavailable).not.toHaveBeenCalled();
    send({ errorCode: 1001, errorType: "INVALID_VIDEO" });
    expect(onUnavailable).toHaveBeenCalledTimes(1);
  });
});
