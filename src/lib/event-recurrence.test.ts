import { describe, expect, it } from "vitest";
import {
  buildRrule,
  describeRecurrence,
  getNextOccurrence,
  getOccurrenceDates,
  getOccurrenceOnDate,
  resolveOccurrence,
  type EventRecurrence,
} from "@/lib/event-recurrence";

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
    expect(occurrence?.startDateYmd).toBe("2026-08-01");
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
    expect(occurrence?.startDateYmd).toBe("2026-03-02");
  });

  it("resolves daily recurrences", () => {
    const recurrence: EventRecurrence = { frequency: "daily", intervalDays: 3, startOn: "2026-01-01" };
    const occurrence = getNextOccurrence(
      recurrence,
      "2026-01-01T18:00:00.000Z",
      "2026-01-01T19:00:00.000Z",
      Date.parse("2026-01-05T00:00:00Z"),
    );
    expect(occurrence?.startDateYmd).toBe("2026-01-07");
  });

  it("regression: an evening seed time in a negative UTC offset doesn't shift occurrences back a day", () => {
    // 17:00-07:00 = 00:00 UTC the *next* calendar day. A bug that read the seed's UTC hour back
    // off a real converted instant (instead of the literal local time) rolled every generated
    // occurrence back one day once rendered in local time — e.g. the 1st Thursday of October
    // (Oct 1, 2026) rendered as "September 30". Assert against the local (Pacific) calendar date,
    // not the raw UTC slice, so this test would have caught that.
    const recurrence: EventRecurrence = { frequency: "monthly", nthWeek: 1, weekdays: ["thu"], startOn: "2026-08-06" };
    const occurrence = getNextOccurrence(
      recurrence,
      "2026-08-06T17:00:00-07:00",
      "2026-08-06T21:00:00-07:00",
      Date.parse("2026-09-16T00:00:00Z"),
    );
    const localDate = occurrence && new Date(occurrence.startAtIso).toLocaleDateString("en-US", { timeZone: "America/Los_Angeles" });
    expect(localDate).toBe("10/1/2026");
  });
});

describe("getOccurrenceOnDate", () => {
  it("regression: resolves an evening occurrence to the correct local calendar date", () => {
    const recurrence: EventRecurrence = { frequency: "monthly", nthWeek: 1, weekdays: ["thu"], startOn: "2026-08-06" };
    const occurrence = getOccurrenceOnDate(
      recurrence,
      "2026-08-06T17:00:00-07:00",
      "2026-08-06T21:00:00-07:00",
      "2026-08-06",
      "2026-10-01",
    );
    const localDate = occurrence && new Date(occurrence.startAtIso).toLocaleDateString("en-US", { timeZone: "America/Los_Angeles" });
    expect(localDate).toBe("10/1/2026");
  });
});

// Evening event in a negative-offset zone: 17:00-07:00 = 00:00Z the *next* UTC day. The old lib
// returned toISOString() (UTC), so any caller slicing the date or re-seeding from the output was
// a day early. These tests assert the local calendar date directly and fail on that behavior.
describe("occurrence local dates (evening event, negative offset)", () => {
  const seedStart = "2026-08-06T17:00:00-07:00";
  const seedEnd = "2026-08-06T21:00:00-07:00";
  const firstThursday: EventRecurrence = { frequency: "monthly", nthWeek: 1, weekdays: ["thu"], startOn: "2026-08-06" };

  it("month boundary: Oct 1 keeps local date, local offset and correct instant", () => {
    const occurrence = getNextOccurrence(firstThursday, seedStart, seedEnd, Date.parse("2026-09-26T12:00:00-07:00"));
    expect(occurrence).toEqual({
      startAtIso: "2026-10-01T17:00:00-07:00",
      endAtIso: "2026-10-01T21:00:00-07:00",
      startDateYmd: "2026-10-01",
      endDateYmd: "2026-10-01",
    });
    expect(Date.parse(occurrence!.startAtIso)).toBe(Date.parse("2026-10-02T00:00:00Z"));
  });

  it("year boundary: Jan 1 does not slip into Dec 31", () => {
    const occurrence = getNextOccurrence(firstThursday, seedStart, seedEnd, Date.parse("2026-12-20T12:00:00-08:00"));
    expect(occurrence?.startDateYmd).toBe("2027-01-07");
    const daily: EventRecurrence = { frequency: "daily", startOn: "2026-12-30" };
    const dayOne = getOccurrenceOnDate(daily, "2026-12-30T17:00:00-08:00", "2026-12-30T21:00:00-08:00", "2026-12-30", "2027-01-01");
    expect(dayOne?.startDateYmd).toBe("2027-01-01");
    expect(dayOne?.startAtIso).toBe("2027-01-01T17:00:00-08:00");
  });

  it("endDateYmd reflects the local end date when the event crosses local midnight", () => {
    const occurrence = getOccurrenceOnDate(
      firstThursday,
      "2026-08-06T22:00:00-07:00",
      "2026-08-07T02:00:00-07:00",
      "2026-08-06",
      "2026-10-01",
    );
    expect(occurrence?.startDateYmd).toBe("2026-10-01");
    expect(occurrence?.endDateYmd).toBe("2026-10-02");
    expect(occurrence?.endAtIso).toBe("2026-10-02T02:00:00-07:00");
  });

  it("skipDates are matched on the local date", () => {
    const skipping: EventRecurrence = { ...firstThursday, skipDates: ["2026-10-01"] };
    const occurrence = getNextOccurrence(skipping, seedStart, seedEnd, Date.parse("2026-09-26T12:00:00-07:00"));
    expect(occurrence?.startDateYmd).toBe("2026-11-05");
  });

  it("an occurrence re-fed as the seed resolves to the same date (banner double pass)", () => {
    const now = Date.parse("2026-09-26T12:00:00-07:00");
    const first = getNextOccurrence(firstThursday, seedStart, seedEnd, now)!;
    // No startOn, so the seed date is derived from the fed-in ISO string itself.
    const noStartOn: EventRecurrence = { frequency: "monthly", nthWeek: 1, weekdays: ["thu"] };
    const again = getNextOccurrence(noStartOn, first.startAtIso, first.endAtIso, now);
    expect(again).toEqual(first);
  });

  it("getOccurrenceOnDate round trips the requested local date", () => {
    const occurrence = getOccurrenceOnDate(firstThursday, seedStart, seedEnd, "2026-08-06", "2026-10-01");
    expect(occurrence?.startDateYmd).toBe("2026-10-01");
    expect(occurrence?.startAtIso.startsWith("2026-10-01T17:00:00-07:00")).toBe(true);
    expect(getOccurrenceOnDate(firstThursday, seedStart, seedEnd, "2026-08-06", "2026-10-02")).toBeNull();
  });

  it("resolveOccurrence (list-view expansion path) matches getOccurrenceOnDate", () => {
    const viaResolve = resolveOccurrence(seedStart, seedEnd, new Date(Date.UTC(2026, 9, 1)));
    expect(viaResolve).toEqual(getOccurrenceOnDate(firstThursday, seedStart, seedEnd, "2026-08-06", "2026-10-01"));
  });

  it("UTC (Z) seeds keep working: offset falls back to +00:00 and dates are unchanged", () => {
    const occurrence = getNextOccurrence(
      { frequency: "daily", startOn: "2026-03-14" },
      "2026-03-14T18:00:00.000Z",
      "2026-03-14T19:00:00.000Z",
      Date.parse("2026-03-20T00:00:00Z"),
    );
    expect(occurrence?.startDateYmd).toBe("2026-03-20");
    expect(Date.parse(occurrence!.startAtIso)).toBe(Date.parse("2026-03-20T18:00:00Z"));
    expect(Date.parse(occurrence!.endAtIso)).toBe(Date.parse("2026-03-20T19:00:00Z"));
  });
});

describe("occurrences with an IANA timeZone track DST (TPL-048)", () => {
  const firstThursday: EventRecurrence = {
    frequency: "monthly",
    nthWeek: 1,
    weekdays: ["thu"],
    startOn: "2026-08-06",
    timeZone: "America/Los_Angeles",
  };

  it("without timeZone, the fixed seed offset carries past the Nov 1, 2026 fall-back (the TPL-048 bug)", () => {
    const noZone: EventRecurrence = { ...firstThursday, timeZone: undefined };
    const occurrence = getNextOccurrence(
      noZone,
      "2026-08-06T17:00:00-07:00",
      "2026-08-06T21:00:00-07:00",
      Date.parse("2026-11-01T12:00:00Z"),
    );
    // Nov 5, 2026 is actually -08:00 (PST) local; the fixed-offset seed still says -07:00.
    expect(occurrence).toEqual({
      startAtIso: "2026-11-05T17:00:00-07:00",
      endAtIso: "2026-11-05T21:00:00-07:00",
      startDateYmd: "2026-11-05",
      endDateYmd: "2026-11-05",
    });
  });

  it("with timeZone, the offset flips to -08:00 after the Nov 1, 2026 fall-back", () => {
    const occurrence = getNextOccurrence(
      firstThursday,
      "2026-08-06T17:00:00-07:00",
      "2026-08-06T21:00:00-07:00",
      Date.parse("2026-11-01T12:00:00Z"),
    );
    expect(occurrence).toEqual({
      startAtIso: "2026-11-05T17:00:00-08:00",
      endAtIso: "2026-11-05T21:00:00-08:00",
      startDateYmd: "2026-11-05",
      endDateYmd: "2026-11-05",
    });
    // The instant is genuinely one hour later in UTC than the (wrong) fixed-offset version above.
    expect(Date.parse(occurrence!.startAtIso)).toBe(Date.parse("2026-11-06T01:00:00Z"));
  });

  it("offset flips back to -07:00 after the Mar 14, 2027 spring-forward", () => {
    const occurrence = getOccurrenceOnDate(
      firstThursday,
      "2026-08-06T17:00:00-07:00",
      "2026-08-06T21:00:00-07:00",
      "2026-08-06",
      "2027-04-01",
    );
    expect(occurrence?.startAtIso).toBe("2027-04-01T17:00:00-07:00");
  });

  it("dates before the transition are unaffected: still -07:00 in October", () => {
    const occurrence = getOccurrenceOnDate(
      firstThursday,
      "2026-08-06T17:00:00-07:00",
      "2026-08-06T21:00:00-07:00",
      "2026-08-06",
      "2026-10-01",
    );
    expect(occurrence?.startAtIso).toBe("2026-10-01T17:00:00-07:00");
  });

  it("resolveOccurrence (list-view expansion) honors timeZone too", () => {
    const viaResolve = resolveOccurrence(
      "2026-08-06T17:00:00-07:00",
      "2026-08-06T21:00:00-07:00",
      new Date(Date.UTC(2026, 10, 5)),
      "America/Los_Angeles",
    );
    expect(viaResolve?.startAtIso).toBe("2026-11-05T17:00:00-08:00");
  });

  it("an invalid IANA zone falls back to the seed's fixed offset instead of throwing", () => {
    const bogus: EventRecurrence = { ...firstThursday, timeZone: "Not/AZone" };
    const occurrence = getOccurrenceOnDate(
      bogus,
      "2026-08-06T17:00:00-07:00",
      "2026-08-06T21:00:00-07:00",
      "2026-08-06",
      "2026-11-05",
    );
    expect(occurrence?.startAtIso).toBe("2026-11-05T17:00:00-07:00");
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
