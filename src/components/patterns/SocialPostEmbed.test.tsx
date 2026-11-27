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
const IG = "https://www.instagram.com/examplerescue/p/AbC123xYz_9/";
const TT = "https://www.tiktok.com/@example.rescue/video/7000000000000000001";

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
    const story = "https://www.instagram.com/stories/examplerescue/1000000000000000001";
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
    expect(frame.src).toBe("https://www.instagram.com/p/AbC123xYz_9/embed/captioned/");
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
    expect(frame.src).toContain("/player/v1/7000000000000000001");
    const send = (value: object) => window.dispatchEvent(new MessageEvent("message", { source: frame.contentWindow, data: { "x-tiktok-player": true, type: "onPlayerError", value } }));
    send({ errorCode: 3001, errorType: "PLAYBACK_ERROR" });
    expect(onUnavailable).not.toHaveBeenCalled();
    send({ errorCode: 1001, errorType: "INVALID_VIDEO" });
    expect(onUnavailable).toHaveBeenCalledTimes(1);
  });

  it("Facebook: re-rendering with the same url (even with a fresh onUnavailable) parses the SDK once, not per render", async () => {
    nearViewport();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ html: "<blockquote/>" }) }));
    const parse = vi.fn();
    (window as unknown as { FB?: unknown }).FB = { XFBML: { parse } };
    // Keep the SDK <script> out of the DOM (some jsdom setups fire onerror for it) and fire its onload by hand.
    const append = document.body.appendChild.bind(document.body);
    const sdk: HTMLScriptElement[] = [];
    vi.spyOn(document.body, "appendChild").mockImplementation(((n: Node) => {
      if (n instanceof HTMLScriptElement && n.src.includes("connect.facebook.net")) { sdk.push(n); return n; }
      return append(n);
    }) as typeof document.body.appendChild);
    const { rerender } = render(<SocialPostEmbed url={FB} onUnavailable={() => undefined} />);
    await vi.waitFor(() => expect(sdk).toHaveLength(1), { timeout: 3000 });
    sdk[0].onload?.(new Event("load"));
    await vi.waitFor(() => expect(parse).toHaveBeenCalledTimes(1));
    for (let i = 0; i < 5; i++) rerender(<SocialPostEmbed url={FB} onUnavailable={() => undefined} />);
    await new Promise((r) => setTimeout(r, 50));
    expect(parse).toHaveBeenCalledTimes(1);
    delete (window as unknown as { FB?: unknown }).FB;
    vi.restoreAllMocks();
  });

  describe("Facebook: SDK probe, plain-iframe result", () => {
    const sdkHarness = (size: { width: number; height: number }) => {
      nearViewport();
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ html: "<blockquote/>" }) }));
      // The SDK stand-in drops an iframe into the probe, like the real one does.
      (window as unknown as { FB?: unknown }).FB = {
        XFBML: { parse: (el: Element) => { const f = document.createElement("iframe"); f.src = "https://www.facebook.com/v26.0/plugins/post.php?channel=x"; el.appendChild(f); } },
      };
      vi.spyOn(HTMLIFrameElement.prototype, "getBoundingClientRect").mockReturnValue({ ...size, x: 0, y: 0, top: 0, left: 0, right: size.width, bottom: size.height, toJSON: () => ({}) });
      const append = document.body.appendChild.bind(document.body);
      vi.spyOn(document.body, "appendChild").mockImplementation(((n: Node) => {
        if (n instanceof HTMLScriptElement && n.src.includes("connect.facebook.net")) { queueMicrotask(() => n.onload?.(new Event("load"))); return n; }
        return append(n);
      }) as typeof document.body.appendChild);
    };
    afterEach(() => { delete (window as unknown as { FB?: unknown }).FB; vi.restoreAllMocks(); });

    it("shows a plain plugin iframe (no SDK channel) at the height the SDK measured, and removes the probe", async () => {
      sdkHarness({ width: 400, height: 660 });
      render(<SocialPostEmbed url="https://www.facebook.com/TheComebackPack/posts/pfbid02kufX6" />);
      const frame = await vi.waitFor(() => {
        const f = document.querySelector("iframe[src^='https://www.facebook.com/plugins/post.php']");
        expect(f).not.toBeNull();
        return f as HTMLIFrameElement;
      }, { timeout: 8000 });
      expect(frame.getAttribute("height")).toBe("660");
      expect(frame.src).not.toContain("channel");
      expect(new URL(frame.src).searchParams.get("href")).toBe("https://www.facebook.com/TheComebackPack/posts/pfbid02kufX6");
      expect(document.querySelector(".fb-post, [aria-hidden='true'] iframe")).toBeNull();
    }, 12000);

    it("drops the item when the SDK's iframe settles at the blocked-embed size", async () => {
      sdkHarness({ width: 400, height: 225 });
      const onUnavailable = vi.fn();
      render(<SocialPostEmbed url={FB} onUnavailable={onUnavailable} />);
      await vi.waitFor(() => expect(onUnavailable).toHaveBeenCalledTimes(1), { timeout: 8000 });
      expect(document.querySelector("iframe[src^='https://www.facebook.com/plugins']")).toBeNull();
    }, 12000);

    it("uses the video plugin for reels", async () => {
      sdkHarness({ width: 400, height: 711 });
      render(<SocialPostEmbed url={FB} />);
      const frame = await vi.waitFor(() => {
        const f = document.querySelector("iframe[src^='https://www.facebook.com/plugins/video.php']");
        expect(f).not.toBeNull();
        return f as HTMLIFrameElement;
      }, { timeout: 8000 });
      expect(frame.getAttribute("height")).toBe("711");
    }, 12000);
  });
});
