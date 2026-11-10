import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import FacebookPostEmbed from "@/components/patterns/FacebookPostEmbed";

// Some Node/jsdom combinations expose no usable `localStorage`; a tiny in-memory stand-in keeps the tests environment-independent.
const memoryStorage = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k), clear: () => m.clear() };
};

const URL_A = "https://www.facebook.com/reel/123";

describe("FacebookPostEmbed", () => {
  beforeEach(() => vi.stubGlobal("localStorage", memoryStorage()));
  afterEach(() => vi.unstubAllGlobals());

  it("always renders the plain link (no-JS fallback) and no embed before it is near the viewport", () => {
    const { container } = render(<FacebookPostEmbed url={URL_A} />);
    const link = screen.getByRole("link", { name: /View on Facebook/ });
    expect(link).toHaveAttribute("href", URL_A);
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(container.querySelector(".fb-video, .fb-post")).toBeNull();
  });

  it("uses a custom link label", () => {
    render(<FacebookPostEmbed url={URL_A} linkLabel="Ver en Facebook" />);
    expect(screen.getByRole("link", { name: /Ver en Facebook/ })).toBeInTheDocument();
  });

  it("tells the parent when the post is on the seed list, before loading anything", async () => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(private cb: (e: { isIntersecting: boolean }[]) => void) {}
        observe() { this.cb([{ isIntersecting: true }]); }
        disconnect() {}
      },
    );
    const onUnavailable = vi.fn();
    render(<FacebookPostEmbed url={URL_A} knownGone={new Set([URL_A])} onUnavailable={onUnavailable} />);
    await vi.waitFor(() => expect(onUnavailable).toHaveBeenCalledTimes(1));
    expect(document.querySelector(".fb-video, .fb-post")).toBeNull();
  });
});
