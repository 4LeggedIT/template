import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import EventBanner, { type EventBannerItem } from "@/components/patterns/EventBanner";

// Vitest 4's jsdom has no working window.localStorage (same gap PromoModal.test.tsx works around).
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

const renderBanner = (events: EventBannerItem[]) =>
  render(
    <MemoryRouter>
      <EventBanner events={events} timeZone="America/Los_Angeles" storageKeyPrefix="test_banner" />
    </MemoryRouter>,
  );

const thanksgiving: EventBannerItem = {
  id: "thanksgiving",
  title: "Home for Thanksgiving Adopt-A-Thon",
  startsAtIso: "2026-11-21T00:00:00-08:00",
  endsAtIso: "2026-11-29T23:59:00-08:00",
  ctaHref: "/news/thanksgiving",
};

describe("EventBanner multi-day events (TPL-064)", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createMemoryStorage());
    vi.useFakeTimers({ toFake: ["Date"] });
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("stays visible while a multi-day event is in progress and shows its date range", () => {
    vi.setSystemTime(new Date("2026-11-24T12:00:00-08:00"));
    renderBanner([thanksgiving]);
    expect(screen.getByText(/Home for Thanksgiving/)).toBeInTheDocument();
    expect(screen.getByText(/Sat, Nov 21\s*–\s*Sun, Nov 29/)).toBeInTheDocument();
    expect(screen.queryByText(/AM–|PM–/)).not.toBeInTheDocument();
  });

  it("disappears once the multi-day event has ended", () => {
    vi.setSystemTime(new Date("2026-11-30T00:30:00-08:00"));
    renderBanner([thanksgiving]);
    expect(screen.queryByText(/Home for Thanksgiving/)).not.toBeInTheDocument();
  });

  it("keeps a single date plus time range for a same-day event", () => {
    vi.setSystemTime(new Date("2026-12-01T00:00:00-08:00"));
    renderBanner([
      { id: "fair", title: "Adoption fair", startsAtIso: "2026-12-05T10:00:00-08:00", endsAtIso: "2026-12-05T14:00:00-08:00" },
    ]);
    expect(screen.getByText(/Sat, Dec 5/)).toBeInTheDocument();
    expect(screen.getByText(/10:00 AM–2:00 PM/)).toBeInTheDocument();
  });

  it("keeps the time range for an overnight event shorter than 24 hours", () => {
    vi.setSystemTime(new Date("2026-12-01T00:00:00-08:00"));
    renderBanner([
      { id: "night", title: "Night walk", startsAtIso: "2026-12-05T18:00:00-08:00", endsAtIso: "2026-12-06T01:00:00-08:00" },
    ]);
    expect(screen.getByText(/6:00 PM–1:00 AM/)).toBeInTheDocument();
    expect(screen.queryByText(/Dec 5\s*–/)).not.toBeInTheDocument();
  });
});

describe("EventBanner prerender (TPL-064)", () => {
  it("renders nothing on the server so a build-time banner never reaches the static HTML", async () => {
    const { renderToString } = await import("react-dom/server");
    const html = renderToString(
      <MemoryRouter>
        <EventBanner events={[thanksgiving]} timeZone="America/Los_Angeles" storageKeyPrefix="test_banner" />
      </MemoryRouter>,
    );
    expect(html).toBe("");
  });
});
