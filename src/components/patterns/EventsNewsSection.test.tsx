import { describe, expect, it } from "vitest";
import {
  formatFallbackDateLabel,
  getAdjacentEntries,
  type EventsNewsEventEntry,
} from "@/components/patterns/EventsNewsSection";

// Mirrors the themisfitranch Halloween Paint and Sip bug (TPL-050 in
// template-enhancement-backlog.md): 6-8 PM Pacific on Oct 30, authored as UTC ISO instants.
const halloweenEvent: EventsNewsEventEntry = {
  id: "halloween-paint-and-sip",
  kind: "event",
  title: "Halloween Paint and Sip",
  startAt: "2026-10-30",
  startAtIso: "2026-10-31T01:00:00.000Z",
  endAtIso: "2026-10-31T03:00:00.000Z",
};

describe("formatFallbackDateLabel", () => {
  it("renders a timed event in the runtime's default zone when timeZone is unset (pre-TPL-050 behavior)", () => {
    // No assertion on the exact string here — the whole point of the bug is that this varies by
    // runtime. Asserting only that omitting timeZone doesn't throw and produces *some* label.
    expect(formatFallbackDateLabel(halloweenEvent)).toEqual(expect.any(String));
  });

  it("renders a timed event's date in its own zone, not UTC's, when timeZone is passed", () => {
    const label = formatFallbackDateLabel(halloweenEvent, "America/Los_Angeles");
    expect(label).toContain("October 30, 2026");
    expect(label).not.toContain("October 31");
    expect(label).toContain("6:00 PM");
    expect(label).toContain("8:00 PM");
  });

  it("renders the UTC-shifted date when timeZone is explicitly UTC", () => {
    const label = formatFallbackDateLabel(halloweenEvent, "UTC");
    expect(label).toContain("October 31, 2026");
    expect(label).toContain("1:00 AM");
  });

  it("keeps an all-day event's date UTC-anchored regardless of timeZone", () => {
    const allDay: EventsNewsEventEntry = {
      id: "yard-sale",
      kind: "event",
      title: "Yard Sale",
      startAt: "2026-11-01",
      allDay: true,
    };
    expect(formatFallbackDateLabel(allDay, "America/Los_Angeles")).toBe("November 1, 2026");
    expect(formatFallbackDateLabel(allDay, "UTC")).toBe("November 1, 2026");
    expect(formatFallbackDateLabel(allDay)).toBe("November 1, 2026");
  });

  it("keeps a date-only (no startAtIso) event's date UTC-anchored regardless of timeZone", () => {
    const dateOnly: EventsNewsEventEntry = {
      id: "market-night",
      kind: "event",
      title: "Market Night",
      startAt: "2026-10-01",
    };
    expect(formatFallbackDateLabel(dateOnly, "America/Los_Angeles")).toBe("October 1, 2026");
  });

  it("determines same-day vs. multi-day end labels relative to the passed zone, not UTC's", () => {
    // 11 PM–1 AM Pacific crosses local midnight (so must render as a multi-day span), but both
    // timestamps land on the *same* UTC calendar day (July 5) — a formatter that ignored the
    // passed zone for this comparison would wrongly collapse it to a same-day time-only range.
    const spansMidnightLocally: EventsNewsEventEntry = {
      id: "late-bonfire",
      kind: "event",
      title: "Late Bonfire",
      startAt: "2026-07-04",
      startAtIso: "2026-07-05T06:00:00.000Z",
      endAtIso: "2026-07-05T08:00:00.000Z",
    };
    const pacific = formatFallbackDateLabel(spansMidnightLocally, "America/Los_Angeles");
    expect(pacific).toBe("July 4, 2026 at 11:00 PM – July 5, 2026 at 1:00 AM");
  });
});

describe("getAdjacentEntries", () => {
  const earlier: EventsNewsEventEntry = {
    id: "earlier-event",
    kind: "event",
    title: "Earlier Event",
    startAt: "2026-10-29",
    startAtIso: "2026-10-30T01:00:00.000Z",
    endAtIso: "2026-10-30T03:00:00.000Z",
    href: "/news/earlier-event",
  };
  const entries: EventsNewsEventEntry[] = [earlier, { ...halloweenEvent, href: "/news/halloween-paint-and-sip" }];

  it("threads timeZone through to a neighbor's computed dateLabel", () => {
    const { previous } = getAdjacentEntries(entries, "halloween-paint-and-sip", undefined, undefined, "America/Los_Angeles");
    expect(previous?.dateLabel).toContain("October 29, 2026");
  });
});
