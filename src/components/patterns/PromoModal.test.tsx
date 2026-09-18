import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PromoModal, { type PromoModalItem } from "@/components/patterns/PromoModal";

// Vitest 4's bundled jsdom environment doesn't expose a working `window.localStorage` (jsdom
// 28's storage getter isn't reachable through populateGlobal's property copy — a pre-existing
// environment gap, not specific to this component). Polyfill it in-memory for this suite; see
// promo-modal-module-wiring-contract.md's "known test-environment gap" note.
const createMemoryStorage = (): Storage => {
  const store = new Map<string, string>();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => void store.set(key, String(value)),
    removeItem: (key) => void store.delete(key),
    clear: () => store.clear(),
    key: (index) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  };
};

const backToSchool: PromoModalItem = {
  id: "back-to-school-2026-09",
  imageSrc: "/back-to-school-flyer.webp",
  imageAlt: "Back to School Special flyer",
  headline: "20% off for new clients this September",
  ctaLabel: "Book Now",
  ctaHref: "/contact",
  startsAtIso: "2026-09-01T00:00:00-07:00",
  expiresAtIso: "2026-09-30T23:59:59-07:00",
};

const renderModal = (promos: PromoModalItem[], openDelayMs = 0) =>
  render(
    <MemoryRouter>
      <PromoModal promos={promos} openDelayMs={openDelayMs} />
    </MemoryRouter>,
  );

describe("PromoModal", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders nothing when no promo is eligible", () => {
    renderModal([]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not show a promo before its startsAtIso", () => {
    renderModal([{ ...backToSchool, startsAtIso: "2099-01-01T00:00:00-07:00" }]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not show a promo after its expiresAtIso", () => {
    renderModal([{ ...backToSchool, expiresAtIso: "2020-01-01T00:00:00-07:00" }]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens after openDelayMs and renders the image, headline and CTA", async () => {
    renderModal([backToSchool]);

    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
    expect(screen.getByAltText("Back to School Special flyer")).toBeInTheDocument();
    expect(screen.getByText("20% off for new clients this September")).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: "Book Now" });
    expect(cta).toHaveAttribute("href", "/contact");
  });

  it("persists dismissal to localStorage using the promo's expiry, and does not reopen on remount", async () => {
    const { unmount } = renderModal([backToSchool]);
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    const stored = window.localStorage.getItem("template_promo_modal_dismissed_until_back-to-school-2026-09");
    expect(stored).toBe(String(Date.parse(backToSchool.expiresAtIso!)));

    unmount();
    renderModal([backToSchool]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows the soonest-expiring promo when more than one is eligible", async () => {
    const laterPromo: PromoModalItem = {
      ...backToSchool,
      id: "holiday-2026-12",
      headline: "Holiday booking special",
      expiresAtIso: "2026-12-31T23:59:59-07:00",
    };

    renderModal([laterPromo, backToSchool]);

    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
    expect(screen.getByText("20% off for new clients this September")).toBeInTheDocument();
  });
});
