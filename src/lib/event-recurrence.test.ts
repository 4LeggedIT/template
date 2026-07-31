import { describe, expect, it } from "vitest";
import { buildRrule, describeRecurrence, getNextOccurrence, getOccurrenceDates, type EventRecurrence } from "@/lib/event-recurrence";

const rangeStart = new Date(Date.UTC(2026, 0, 1));
const rangeEnd = new Date(Date.UTC(2026, 7, 1));

describe("getOccurrenceDates", () => {
  it("generates biweekly Saturday occurrences", () => {
    const recurrence: EventRecurrence = { frequency: "weekly", intervalWeeks: 2, startOn: "2026-03-14" };
    const dates = getOccurrenceDates(recurrence, "2026-03-14", rangeStart, rangeEnd).map((d) => d.toISOString().slice(0, 10));
    expect(dates).toEqual([
      "2026-03-14",
      "2026-03-28",
      "2026-04-11",
      "2026-04-25",
      "2026-05-09",
      "2026-05-23",
      "2026-06-06",
      "2026-06-20",
      "2026-07-04",
      "2026-07-18",
      "2026-08-01",
    ]);
  });

  it("removes a skipDates entry entirely, leaving all other occurrences", () => {
    const recurrence: EventRecurrence = {
      frequency: "weekly",
      intervalWeeks: 2,
      startOn: "2026-03-14",
      skipDates: ["2026-07-18"],
    };
    const dates = getOccurrenceDates(recurrence, "2026-03-14", rangeStart, rangeEnd).map((d) => d.toISOString().slice(0, 10));
    expect(dates).not.toContain("2026-07-18");
    expect(dates).toContain("2026-08-01");
    expect(dates).toHaveLength(10);
  });

  it("applies count before skipDates, so a skipped occurrence still consumes its slot", () => {
    const recurrence: EventRecurrence = {
      frequency: "weekly",
      intervalWeeks: 2,
      startOn: "2026-03-14",
      count: 5,
      skipDates: ["2026-04-11"],
    };
    const dates = getOccurrenceDates(recurrence, "2026-03-14", rangeStart, rangeEnd).map((d) => d.toISOString().slice(0, 10));
    // Raw count:5 would be [03-14, 03-28, 04-11, 04-25, 05-09]; removing 04-11 leaves 4,
    // NOT backfilled with 05-23 (which would make it 5 again).
    expect(dates).toEqual(["2026-03-14", "2026-03-28", "2026-04-25", "2026-05-09"]);
  });

  it("generates monthly occurrences on a fixed day-of-month and honors skipDates", () => {
    const recurrence: EventRecurrence = {
      frequency: "monthly",
      intervalMonths: 1,
      monthDay: 15,
      startOn: "2026-01-15",
      skipDates: ["2026-02-15"],
    };
    const dates = getOccurrenceDates(recurrence, "2026-01-15", rangeStart, new Date(Date.UTC(2026, 3, 30))).map((d) =>
      d.toISOString().slice(0, 10),
    );
    expect(dates).toEqual(["2026-01-15", "2026-03-15", "2026-04-15"]);
  });

  it("generates monthly nth-weekday occurrences (1st Monday) and honors skipDates", () => {
    const recurrence: EventRecurrence = {
      frequency: "monthly",
      nthWeek: 1,
      weekdays: ["mon"],
      startOn: "2026-01-05",
      skipDates: ["2026-02-02"],
    };
    const dates = getOccurrenceDates(recurrence, "2026-01-05", rangeStart, new Date(Date.UTC(2026, 3, 30))).map((d) =>
      d.toISOString().slice(0, 10),
    );
    expect(dates).toEqual(["2026-01-05", "2026-03-02", "2026-04-06"]);
  });

  it("generates daily occurrences at a fixed interval and honors skipDates", () => {
    const recurrence: EventRecurrence = { frequency: "daily", intervalDays: 3, startOn: "2026-01-01", skipDates: ["2026-01-07"] };
    const dates = getOccurrenceDates(recurrence, "2026-01-01", rangeStart, new Date(Date.UTC(2026, 0, 15))).map((d) =>
      d.toISOString().slice(0, 10),
    );
    expect(dates).toEqual(["2026-01-01", "2026-01-04", "2026-01-10", "2026-01-13"]);
  });
});

describe("getNextOccurrence", () => {
  it("skips a skipDates-listed date and returns the following live occurrence", () => {
    const recurrence: EventRecurrence = { frequency: "weekly", intervalWeeks: 2, startOn: "2026-03-14", skipDates: ["2026-07-18"] };
    const occurrence = getNextOccurrence(
      recurrence,
      "2026-03-14T18:00:00.000Z",
      "2026-03-14T19:00:00.000Z",
      Date.parse("2026-07-10T00:00:00Z"),
    );
    expect(occurrence?.startAtIso.slice(0, 10)).toBe("2026-08-01");
  });

  it("still consumes a count slot for a skipped occurrence rather than falling through to the next one", () => {
    const recurrence: EventRecurrence = {
      frequency: "weekly",
      intervalWeeks: 2,
      startOn: "2026-03-14",
      count: 1,
      skipDates: ["2026-03-14"],
    };
    const occurrence = getNextOccurrence(
      recurrence,
      "2026-03-14T18:00:00.000Z",
      "2026-03-14T19:00:00.000Z",
      Date.parse("2026-01-01T00:00:00Z"),
    );
    expect(occurrence).toBeNull();
  });

  it("resolves monthly recurrences (regression: EventBanner previously only supported weekly)", () => {
    const recurrence: EventRecurrence = { frequency: "monthly", nthWeek: 1, weekdays: ["mon"], startOn: "2026-01-05" };
    const occurrence = getNextOccurrence(
      recurrence,
      "2026-01-05T18:00:00.000Z",
      "2026-01-05T19:00:00.000Z",
      Date.parse("2026-02-15T00:00:00Z"),
    );
    expect(occurrence?.startAtIso.slice(0, 10)).toBe("2026-03-02");
  });

  it("resolves daily recurrences", () => {
    const recurrence: EventRecurrence = { frequency: "daily", intervalDays: 3, startOn: "2026-01-01" };
    const occurrence = getNextOccurrence(
      recurrence,
      "2026-01-01T18:00:00.000Z",
      "2026-01-01T19:00:00.000Z",
      Date.parse("2026-01-05T00:00:00Z"),
    );
    expect(occurrence?.startAtIso.slice(0, 10)).toBe("2026-01-07");
  });
});

describe("describeRecurrence", () => {
  it("describes a daily recurrence", () => {
    const recurrence: EventRecurrence = { frequency: "daily", intervalDays: 5, until: "2026-12-31" };
    expect(describeRecurrence(recurrence, "2026-01-01T00:00:00.000Z")).toEqual({
      frequency: "daily",
      interval: 5,
      weekdays: [],
      until: "2026-12-31",
      count: undefined,
    });
  });
});

describe("buildRrule", () => {
  it("emits a plain weekly RRULE with no skipDates", () => {
    const recurrence: EventRecurrence = { frequency: "weekly", intervalWeeks: 2 };
    expect(buildRrule(recurrence)).toBe("RRULE:FREQ=WEEKLY;INTERVAL=2");
  });

  it("emits RRULE + EXDATE joined by a newline when skipDates is set", () => {
    const recurrence: EventRecurrence = {
      frequency: "weekly",
      intervalWeeks: 2,
      skipDates: ["2026-07-18", "2026-08-01"],
    };
    expect(buildRrule(recurrence)).toBe("RRULE:FREQ=WEEKLY;INTERVAL=2\nEXDATE;VALUE=DATE:20260718,20260801");
  });

  it("emits a daily RRULE", () => {
    const recurrence: EventRecurrence = { frequency: "daily", intervalDays: 10 };
    expect(buildRrule(recurrence)).toBe("RRULE:FREQ=DAILY;INTERVAL=10");
  });

  it("emits a monthly nth-weekday RRULE", () => {
    const recurrence: EventRecurrence = { frequency: "monthly", nthWeek: 1, weekdays: ["mon"] };
    expect(buildRrule(recurrence)).toBe("RRULE:FREQ=MONTHLY;BYDAY=1MO");
  });
});
