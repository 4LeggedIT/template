import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ZEFFY_SCRIPT_SRC = "https://www.zeffy.com/embed/v2/zeffy-embed.js";

const fireScriptEvent = (type: "load" | "error") => {
  const script = document.querySelector<HTMLScriptElement>(`script[src="${ZEFFY_SCRIPT_SRC}"]`);
  script?.dispatchEvent(new Event(type));
};

// The component keeps a module-level script-load promise so the script is
// never injected twice, real-world behavior we want to keep -- but it means
// each test needs a fresh module instance, or a stale pending promise from
// an earlier test (whose script element was already removed by afterEach)
// leaks in and never resolves/rejects for the new test's script element.
let ZeffyDonateEmbed: typeof import("@/components/patterns/ZeffyDonateEmbed").default;

beforeEach(async () => {
  vi.resetModules();
  ({ default: ZeffyDonateEmbed } = await import("@/components/patterns/ZeffyDonateEmbed"));
});

afterEach(() => {
  document.querySelectorAll(`script[src="${ZEFFY_SCRIPT_SRC}"]`).forEach((el) => el.remove());
  delete window.Zeffy;
});

describe("ZeffyDonateEmbed", () => {
  it("renders the fallback iframe visibly before the embed script loads", () => {
    const { container } = render(<ZeffyDonateEmbed formSlug="example-fund-slug" />);

    const iframe = screen.getByTitle("Donation form powered by Zeffy");
    expect(iframe).toHaveAttribute("src", "https://www.zeffy.com/embed/donation-form/example-fund-slug");

    const primaryMount = container.querySelector("[data-zeffy-embed]");
    expect(primaryMount).toHaveStyle({ display: "none" });
  });

  it("injects the Zeffy embed script exactly once across two instances", () => {
    render(
      <>
        <ZeffyDonateEmbed formSlug="example-fund-slug" />
        <ZeffyDonateEmbed formSlug="another-appeal-slug" />
      </>,
    );

    expect(document.querySelectorAll(`script[src="${ZEFFY_SCRIPT_SRC}"]`)).toHaveLength(1);
  });

  it("switches to the primary embed div and hides the fallback once the script loads", async () => {
    const { container } = render(<ZeffyDonateEmbed formSlug="example-fund-slug" />);

    fireScriptEvent("load");

    await waitFor(() => {
      expect(container.querySelector("[data-zeffy-embed]")).not.toHaveStyle({ display: "none" });
    });

    const fallbackContainer = screen.getByTitle("Donation form powered by Zeffy").parentElement;
    expect(fallbackContainer).toHaveStyle({ display: "none" });
  });

  it("calls window.Zeffy.embed.init() once the script loads", async () => {
    const init = vi.fn();
    window.Zeffy = { embed: { init } };

    render(<ZeffyDonateEmbed formSlug="example-fund-slug" />);
    fireScriptEvent("load");

    await waitFor(() => {
      expect(init).toHaveBeenCalledTimes(1);
    });
  });

  it("calls window.Zeffy.embed.init() again on a remount after the script is already cached -- the fix for containers that mount after Zeffy's one-time DOM scan (e.g. a client-side SPA route change back to this page)", async () => {
    const init = vi.fn();
    window.Zeffy = { embed: { init } };

    const { unmount } = render(<ZeffyDonateEmbed formSlug="example-fund-slug" />);
    fireScriptEvent("load");
    await waitFor(() => expect(init).toHaveBeenCalledTimes(1));

    unmount();
    render(<ZeffyDonateEmbed formSlug="example-fund-slug" />);

    await waitFor(() => {
      expect(init).toHaveBeenCalledTimes(2);
    });
    expect(document.querySelectorAll(`script[src="${ZEFFY_SCRIPT_SRC}"]`)).toHaveLength(1);
  });

  it("doesn't throw if window.Zeffy is unavailable when the script resolves", async () => {
    const { container } = render(<ZeffyDonateEmbed formSlug="example-fund-slug" />);

    fireScriptEvent("load");

    await waitFor(() => {
      expect(container.querySelector("[data-zeffy-embed]")).not.toHaveStyle({ display: "none" });
    });
  });

  it("keeps the fallback iframe visible and calls onError if the script fails to load", async () => {
    const onError = vi.fn();
    render(<ZeffyDonateEmbed formSlug="example-fund-slug" onError={onError} />);

    fireScriptEvent("error");

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });

    const iframe = screen.getByTitle("Donation form powered by Zeffy");
    expect(iframe.parentElement).not.toHaveStyle({ display: "none" });
  });

  it("renders a not-configured message when formSlug is empty", () => {
    render(<ZeffyDonateEmbed formSlug="" />);

    expect(screen.getByText("Zeffy donate form not configured")).toBeInTheDocument();
    expect(screen.queryByTitle("Donation form powered by Zeffy")).not.toBeInTheDocument();
  });

  it("points the helper link at the full-page form, not the /embed/ path", () => {
    render(<ZeffyDonateEmbed formSlug="example-fund-slug" />);

    expect(screen.getByRole("link", { name: "Having trouble? Open the donation form in a new tab" })).toHaveAttribute(
      "href",
      "https://www.zeffy.com/en-US/donation-form/example-fund-slug",
    );
  });
});
