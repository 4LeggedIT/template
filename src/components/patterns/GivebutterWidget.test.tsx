import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const SCRIPT_SRC = "https://widgets.givebutter.com/latest.umd.cjs?acct=example-acct&p=other";
const CAMPAIGN = "https://givebutter.com/example-campaign";

// Filter on the .src property: a CSS attribute selector doesn't match a URL containing ? and & in jsdom.
const scripts = () => Array.from(document.scripts).filter((el) => el.src === SCRIPT_SRC);

const fireScriptEvent = (type: "load" | "error") => {
  scripts()[0]?.dispatchEvent(new Event(type));
};

// Module-level script promise: each test needs a fresh module instance.
let GivebutterWidget: typeof import("@/components/patterns/GivebutterWidget").default;

beforeEach(async () => {
  vi.resetModules();
  ({ default: GivebutterWidget } = await import("@/components/patterns/GivebutterWidget"));
});

afterEach(() => {
  scripts().forEach((el) => el.remove());
});

const props = { widgetId: "example-widget", accountId: "example-acct", campaignUrl: CAMPAIGN };

describe("GivebutterWidget", () => {
  it("renders a working campaign link before the script loads", () => {
    const { container } = render(<GivebutterWidget {...props} />);

    expect(screen.getByRole("link", { name: "Give on Givebutter" })).toHaveAttribute("href", CAMPAIGN);
    expect(container.querySelector("givebutter-widget")).toBeNull();
  });

  it("injects the script exactly once across two instances", () => {
    render(
      <>
        <GivebutterWidget {...props} />
        <GivebutterWidget {...props} widgetId="another-widget" />
      </>,
    );

    expect(scripts()).toHaveLength(1);
  });

  it("keeps the fallback link visible after the script loads until the widget has rendered, then hands over", async () => {
    let rendered = false;
    const rect = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      const size = rendered && this.tagName.toLowerCase() === "givebutter-widget" ? 86 : 0;
      return { width: size, height: size ? 48 : 0, top: 0, left: 0, right: size, bottom: size ? 48 : 0, x: 0, y: 0, toJSON() {} };
    });

    const { container } = render(<GivebutterWidget {...props} />);
    fireScriptEvent("load");

    // Script loaded: the element is mounted (hidden) with the id, but the
    // fallback is still the only visible action and the helper link is absent.
    await waitFor(() => {
      expect(container.querySelector("givebutter-widget")).toHaveAttribute("id", "example-widget");
    });
    expect(container.querySelector("givebutter-widget")?.parentElement).toHaveStyle({ visibility: "hidden" });
    expect(screen.getByRole("link", { name: "Give on Givebutter" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Having trouble? Open the campaign in a new tab" })).not.toBeInTheDocument();

    const widgetBefore = container.querySelector("givebutter-widget");
    rendered = true;

    await waitFor(() => {
      expect(screen.queryByRole("link", { name: "Give on Givebutter" })).not.toBeInTheDocument();
    });
    expect(container.querySelector("givebutter-widget")).toBe(widgetBefore);
    expect(container.querySelector("givebutter-widget")?.parentElement).not.toHaveStyle({ visibility: "hidden" });
    expect(screen.getByRole("link", { name: "Having trouble? Open the campaign in a new tab" })).toHaveAttribute(
      "href",
      CAMPAIGN,
    );
    rect.mockRestore();
  });

  it("stays on the fallback link when the widget element never renders", async () => {
    const { container } = render(<GivebutterWidget {...props} />);
    fireScriptEvent("load");

    await waitFor(() => expect(container.querySelector("givebutter-widget")).not.toBeNull());
    await new Promise((resolve) => setTimeout(resolve, 400));

    expect(screen.getByRole("link", { name: "Give on Givebutter" })).toBeInTheDocument();
  });

  it("keeps the fallback link and calls onError if the script fails", async () => {
    const onError = vi.fn();
    const { container } = render(<GivebutterWidget {...props} onError={onError} />);

    fireScriptEvent("error");

    await waitFor(() => expect(onError).toHaveBeenCalledWith(expect.any(Error)));
    expect(container.querySelector("givebutter-widget")).toBeNull();
    expect(screen.getByRole("link", { name: "Give on Givebutter" })).toBeInTheDocument();
  });

  it("defers the script until visible when lazy", () => {
    let trigger: (entries: Array<{ isIntersecting: boolean }>) => void = () => {};
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: typeof trigger) {
          trigger = cb;
        }
        observe() {}
        disconnect() {}
      },
    );

    render(<GivebutterWidget {...props} lazy />);
    expect(scripts()).toHaveLength(0);

    trigger([{ isIntersecting: true }]);
    return waitFor(() => {
      expect(scripts()).toHaveLength(1);
    }).finally(() => vi.unstubAllGlobals());
  });

  it("renders a not-configured message when a required prop is empty", () => {
    render(<GivebutterWidget {...props} widgetId="" />);

    expect(screen.getByText("Givebutter widget not configured")).toBeInTheDocument();
  });
});
