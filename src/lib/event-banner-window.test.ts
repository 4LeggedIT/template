import { describe, expect, it } from "vitest";
import { getActiveBannerEvents, getBannerEndMs, isBannerEventActive } from "@/lib/event-banner-window";

const at = (iso: string) => Date.parse(iso);

describe("getActiveBannerEvents", () => {
  const holidayEvent = {
    id: "holidayEvent",
    startAt: "2026-11-21",
    endAt: "2026-11-29",
    startAtIso: "2026-11-21T00:00:00-08:00",
    endAtIso: "2026-11-29T23:59:00-08:00",
  };

  it("keeps a multi-day event after it has started", () => {
    expect(isBannerEventActive(holidayEvent, at("2026-11-24T12:00:00-08:00"))).toBe(true);
  });

  it("drops an event once it has ended", () => {
    expect(isBannerEventActive(holidayEvent, at("2026-11-30T00:00:00-08:00"))).toBe(false);
  });

  it("keeps a future event", () => {
    expect(isBannerEventActive(holidayEvent, at("2026-11-01T00:00:00-08:00"))).toBe(true);
  });

  it("uses the end of the endAt day when there is no endAtIso", () => {
    const entry = { startAt: "2026-12-01", endAt: "2026-12-03" };
    expect(getBannerEndMs(entry)).toBe(at("2026-12-03T23:59:59"));
    expect(isBannerEventActive(entry, at("2026-12-03T12:00:00"))).toBe(true);
    expect(isBannerEventActive(entry, at("2026-12-04T00:30:00"))).toBe(false);
  });

  it("uses the end of the startAt day for a date-only single-day event", () => {
    const entry = { startAt: "2026-12-01" };
    expect(isBannerEventActive(entry, at("2026-12-01T20:00:00"))).toBe(true);
    expect(isBannerEventActive(entry, at("2026-12-02T00:30:00"))).toBe(false);
  });

  it("matches EventBanner's 24h fallback for a start time with no end", () => {
    const entry = { startAt: "2026-12-01", startAtIso: "2026-12-01T10:00:00-08:00" };
    expect(isBannerEventActive(entry, at("2026-12-02T09:00:00-08:00"))).toBe(true);
    expect(isBannerEventActive(entry, at("2026-12-02T11:00:00-08:00"))).toBe(false);
  });

  it("always keeps recurring events, even when the seed is long past", () => {
    const entry = {
      startAt: "2025-01-04",
      startAtIso: "2025-01-04T10:00:00-08:00",
      endAtIso: "2025-01-04T14:00:00-08:00",
      recurrence: { frequency: "weekly" },
    };
    expect(isBannerEventActive(entry, at("2026-11-21T00:00:00-08:00"))).toBe(true);
  });

  it("sorts soonest first", () => {
    const later = { id: "b", startAt: "2026-12-10", startAtIso: "2026-12-10T10:00:00-08:00" };
    const sooner = { id: "a", startAt: "2026-12-05", startAtIso: "2026-12-05T10:00:00-08:00" };
    const result = getActiveBannerEvents([later, sooner], at("2026-12-01T00:00:00-08:00"));
    expect(result.map((e) => e.id)).toEqual(["a", "b"]);
  });
});
