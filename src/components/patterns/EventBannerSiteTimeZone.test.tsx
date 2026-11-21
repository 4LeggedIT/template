import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// A site outside Pacific time sets `siteConfig.timeZone` once instead of passing `timeZone` to
// every EventBanner. Mocked per test so both the set and unset paths are covered.
const mockConfig = vi.hoisted(() => ({ timeZone: undefined as string | undefined }));
vi.mock("@/config/site", () => ({ siteConfig: mockConfig }));

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

const renderBanner = async () => {
  const { default: EventBanner } = await import("@/components/patterns/EventBanner");
  return render(
    <MemoryRouter>
      <EventBanner
        events={[{ id: "fair", title: "Adoption fair", startsAtIso: "2026-12-05T10:00:00-05:00", endsAtIso: "2026-12-05T14:00:00-05:00" }]}
      />
    </MemoryRouter>,
  );
};

describe("EventBanner default time zone from siteConfig", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createMemoryStorage());
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-12-01T00:00:00-05:00"));
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    mockConfig.timeZone = undefined;
  });

  it("uses siteConfig.timeZone when no timeZone prop is passed", async () => {
    mockConfig.timeZone = "America/New_York";
    await renderBanner();
    expect(screen.getByText(/10:00 AM–2:00 PM/)).toBeInTheDocument();
  });

  it("falls back to America/Los_Angeles when siteConfig sets none", async () => {
    await renderBanner();
    expect(screen.getByText(/7:00 AM–11:00 AM/)).toBeInTheDocument();
  });
});
