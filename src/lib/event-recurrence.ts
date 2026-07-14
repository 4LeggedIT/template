export type EventRecurrenceWeekday = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
export type EventRecurrenceMonthlyWeek = 1 | 2 | 3 | 4 | 5 | -1;

type EventRecurrenceBase = {
  startOn?: string;
  until?: string;
  count?: number;
  maxOccurrences?: number;
  skipDates?: string[];
};

export type EventWeeklyRecurrence = EventRecurrenceBase & {
  frequency: "weekly";
  intervalWeeks?: number;
  weekdays?: EventRecurrenceWeekday[];
};

export type EventMonthlyRecurrence = EventRecurrenceBase & {
  frequency: "monthly";
  intervalMonths?: number;
  monthDay?: number;
  nthWeek?: EventRecurrenceMonthlyWeek;
  weekdays?: EventRecurrenceWeekday[];
};

export type EventDailyRecurrence = EventRecurrenceBase & {
  frequency: "daily";
  intervalDays?: number;
};

export type EventRecurrence = EventWeeklyRecurrence | EventMonthlyRecurrence | EventDailyRecurrence;

export type EventOccurrence = {
  startAtIso: string;
  endAtIso: string;
};

export type RecurrenceDescription = {
  frequency: "weekly" | "monthly" | "daily";
  interval: number;
  weekdays: EventRecurrenceWeekday[];
  monthDay?: number;
  nthWeek?: EventRecurrenceMonthlyWeek;
  until?: string;
  count?: number;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const LOOKAHEAD_DAYS = 400;
const MAX_OCCURRENCES_SCANNED = 5000;
const DEFAULT_MAX_OCCURRENCES = 120;

const weekdayOrder: EventRecurrenceWeekday[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const weekdayToIndex: Record<EventRecurrenceWeekday, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};
const weekdayToRrule: Record<EventRecurrenceWeekday, string> = {
  sun: "SU",
  mon: "MO",
  tue: "TU",
  wed: "WE",
  thu: "TH",
  fri: "FR",
  sat: "SA",
};

const pad2 = (value: number) => String(value).padStart(2, "0");

const parseYmdUtc = (value?: string): Date | null => {
  if (!value) return null;
  const ms = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(ms) ? new Date(ms) : null;
};

const formatYmdUtc = (date: Date) => `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;

const toDayStartUtcMs = (value: Date) => Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());

const addDaysUtc = (date: Date, days: number) => {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const addMonthsUtc = (date: Date, months: number) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));

const daysInMonth = (year: number, monthIndex0: number) => new Date(Date.UTC(year, monthIndex0 + 1, 0)).getUTCDate();

const clampPositiveInt = (value: number | undefined, fallback: number) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.max(1, Math.floor(value));
};

const normalizeWeekdays = (
  weekdays: EventRecurrenceWeekday[] | undefined,
  fallback: EventRecurrenceWeekday,
): EventRecurrenceWeekday[] => {
  const values = weekdays?.length ? weekdays : [fallback];
  return [...new Set(values)].sort((left, right) => weekdayToIndex[left] - weekdayToIndex[right]);
};

const isSkipped = (recurrence: EventRecurrence, date: Date) => Boolean(recurrence.skipDates?.includes(formatYmdUtc(date)));

const getNthWeekdayDateOfMonth = (
  year: number,
  monthIndex0: number,
  weekdayIndex: number,
  nthWeek: EventRecurrenceMonthlyWeek,
): Date | null => {
  if (nthWeek === -1) {
    const last = new Date(Date.UTC(year, monthIndex0 + 1, 0));
    const diff = (last.getUTCDay() - weekdayIndex + 7) % 7;
    return addDaysUtc(last, -diff);
  }
  const first = new Date(Date.UTC(year, monthIndex0, 1));
  const diff = (weekdayIndex - first.getUTCDay() + 7) % 7;
  const candidate = addDaysUtc(first, diff + (nthWeek - 1) * 7);
  return candidate.getUTCMonth() === monthIndex0 ? candidate : null;
};

const toOccurrenceIso = (seedStart: Date, occurrenceDate: Date) =>
  new Date(
    Date.UTC(
      occurrenceDate.getUTCFullYear(),
      occurrenceDate.getUTCMonth(),
      occurrenceDate.getUTCDate(),
      seedStart.getUTCHours(),
      seedStart.getUTCMinutes(),
      seedStart.getUTCSeconds(),
      seedStart.getUTCMilliseconds(),
    ),
  ).toISOString();

function* iterateWeeklyDates(
  seedDate: Date,
  intervalWeeks: number,
  weekdays: EventRecurrenceWeekday[],
): Generator<Date> {
  const weekdayIndexes = weekdays.length
    ? [...new Set(weekdays.map((day) => weekdayToIndex[day]))].sort((a, b) => a - b)
    : [seedDate.getUTCDay()];
  let weekStart = addDaysUtc(seedDate, -seedDate.getUTCDay());
  while (true) {
    for (const index of weekdayIndexes) {
      const candidate = addDaysUtc(weekStart, index);
      if (toDayStartUtcMs(candidate) < toDayStartUtcMs(seedDate)) continue;
      yield candidate;
    }
    weekStart = addDaysUtc(weekStart, intervalWeeks * 7);
  }
}

function* iterateMonthlyDates(
  seedDate: Date,
  intervalMonths: number,
  monthDay: number | undefined,
  nthWeek: EventRecurrenceMonthlyWeek | undefined,
  weekdays: EventRecurrenceWeekday[],
): Generator<Date> {
  let year = seedDate.getUTCFullYear();
  let monthIndex0 = seedDate.getUTCMonth();
  while (true) {
    const candidates: Date[] = [];
    if (nthWeek) {
      const resolvedWeekdays = weekdays.length ? weekdays : [weekdayOrder[seedDate.getUTCDay()]];
      for (const day of resolvedWeekdays) {
        const candidate = getNthWeekdayDateOfMonth(year, monthIndex0, weekdayToIndex[day], nthWeek);
        if (candidate) candidates.push(candidate);
      }
    } else {
      const day = monthDay ?? seedDate.getUTCDate();
      if (day <= daysInMonth(year, monthIndex0)) candidates.push(new Date(Date.UTC(year, monthIndex0, day)));
    }

    candidates.sort((a, b) => a.getTime() - b.getTime());
    for (const candidate of candidates) {
      if (toDayStartUtcMs(candidate) >= toDayStartUtcMs(seedDate)) yield candidate;
    }

    monthIndex0 += intervalMonths;
    year += Math.floor(monthIndex0 / 12);
    monthIndex0 = ((monthIndex0 % 12) + 12) % 12;
  }
}

function* iterateDailyDates(seedDate: Date, intervalDays: number): Generator<Date> {
  let cursor = seedDate;
  while (true) {
    yield cursor;
    cursor = addDaysUtc(cursor, intervalDays);
  }
}

/**
 * Computes the next live occurrence of a recurring event (the one currently happening,
 * or the next one still in the future). Returns null once the series has ended per
 * `recurrence.until` / `recurrence.count`, or if nothing is found within a ~400 day lookahead.
 * A date listed in `recurrence.skipDates` is passed over (still consumes its `count` slot,
 * matching RFC5545 EXDATE semantics) rather than being returned as "next."
 */
export function getNextOccurrence(
  recurrence: EventRecurrence,
  seedStartIso: string,
  seedEndIso: string,
  nowMs: number = Date.now(),
): EventOccurrence | null {
  const seedStartMs = Date.parse(seedStartIso);
  const seedEndMs = Date.parse(seedEndIso);
  if (!Number.isFinite(seedStartMs) || !Number.isFinite(seedEndMs) || seedEndMs < seedStartMs) return null;

  const seedStart = new Date(seedStartMs);
  const seedDate =
    parseYmdUtc(recurrence.startOn) ??
    new Date(Date.UTC(seedStart.getUTCFullYear(), seedStart.getUTCMonth(), seedStart.getUTCDate()));
  const durationMs = seedEndMs - seedStartMs;
  const untilDate = parseYmdUtc(recurrence.until);
  const upperBoundMs = nowMs + LOOKAHEAD_DAYS * MS_PER_DAY;

  const iterator =
    recurrence.frequency === "weekly"
      ? iterateWeeklyDates(seedDate, Math.max(1, Math.floor(recurrence.intervalWeeks ?? 1)), recurrence.weekdays ?? [])
      : recurrence.frequency === "monthly"
        ? iterateMonthlyDates(
            seedDate,
            Math.max(1, Math.floor(recurrence.intervalMonths ?? 1)),
            recurrence.monthDay,
            recurrence.nthWeek,
            recurrence.weekdays ?? [],
          )
        : iterateDailyDates(seedDate, Math.max(1, Math.floor(recurrence.intervalDays ?? 1)));

  let index = 0;
  for (const occurrenceDate of iterator) {
    index += 1;
    if (index > MAX_OCCURRENCES_SCANNED) return null;
    if (typeof recurrence.count === "number" && index > recurrence.count) return null;
    if (untilDate && toDayStartUtcMs(occurrenceDate) > toDayStartUtcMs(untilDate)) return null;
    if (toDayStartUtcMs(occurrenceDate) > upperBoundMs) return null;
    if (isSkipped(recurrence, occurrenceDate)) continue;

    const occurrenceStartIso = toOccurrenceIso(seedStart, occurrenceDate);
    const occurrenceStartMs = Date.parse(occurrenceStartIso);
    const occurrenceEndMs = occurrenceStartMs + durationMs;
    if (occurrenceEndMs < nowMs) continue;

    return { startAtIso: occurrenceStartIso, endAtIso: new Date(occurrenceEndMs).toISOString() };
  }
  return null;
}

/**
 * Resolves a recurrence rule into plain data (frequency, interval, resolved weekdays/month-day)
 * for the caller to interpolate into its own localized sentence templates. Intentionally returns
 * no English text — sites render their own strings (some are bilingual, some aren't).
 */
export function describeRecurrence(recurrence: EventRecurrence, seedStartIso: string): RecurrenceDescription {
  const seedStart = new Date(Date.parse(seedStartIso));
  const seedWeekday = weekdayOrder[seedStart.getUTCDay()];

  if (recurrence.frequency === "weekly") {
    return {
      frequency: "weekly",
      interval: Math.max(1, Math.floor(recurrence.intervalWeeks ?? 1)),
      weekdays: recurrence.weekdays?.length ? recurrence.weekdays : [seedWeekday],
      until: recurrence.until,
      count: recurrence.count,
    };
  }

  if (recurrence.frequency === "monthly") {
    return {
      frequency: "monthly",
      interval: Math.max(1, Math.floor(recurrence.intervalMonths ?? 1)),
      weekdays: recurrence.nthWeek ? (recurrence.weekdays?.length ? recurrence.weekdays : [seedWeekday]) : [],
      monthDay: recurrence.nthWeek ? undefined : recurrence.monthDay ?? seedStart.getUTCDate(),
      nthWeek: recurrence.nthWeek,
      until: recurrence.until,
      count: recurrence.count,
    };
  }

  return {
    frequency: "daily",
    interval: Math.max(1, Math.floor(recurrence.intervalDays ?? 1)),
    weekdays: [],
    until: recurrence.until,
    count: recurrence.count,
  };
}

/**
 * Expands a recurrence rule into every concrete occurrence date within [rangeStart, rangeEnd].
 * `maxOccurrences` and `count` cap the raw generated set first; `skipDates` is then applied to
 * that already-capped set, so a skipped date still consumes its slot (matches how Google
 * Calendar itself resolves a combined RRULE + EXDATE).
 */
export function getOccurrenceDates(recurrence: EventRecurrence, seedStartYmd: string, rangeStart: Date, rangeEnd: Date): Date[] {
  const seedStart = parseYmdUtc(recurrence.startOn ?? seedStartYmd);
  if (!seedStart) return [];

  const untilDate = parseYmdUtc(recurrence.until ?? formatYmdUtc(rangeEnd)) ?? rangeEnd;
  const seriesEnd = toDayStartUtcMs(untilDate) < toDayStartUtcMs(rangeEnd) ? untilDate : rangeEnd;
  if (toDayStartUtcMs(seriesEnd) < toDayStartUtcMs(seedStart)) return [];

  const seedWeekday = weekdayOrder[seedStart.getUTCDay()];
  const generated = new Set<string>();

  const withinRange = (occurrence: Date) => {
    const ms = toDayStartUtcMs(occurrence);
    return ms >= toDayStartUtcMs(seedStart) && ms >= toDayStartUtcMs(rangeStart) && ms <= toDayStartUtcMs(seriesEnd);
  };

  if (recurrence.frequency === "weekly") {
    const intervalWeeks = clampPositiveInt(recurrence.intervalWeeks, 1);
    const weekdays = normalizeWeekdays(recurrence.weekdays, seedWeekday);
    const seedWeekStart = addDaysUtc(seedStart, -seedStart.getUTCDay());

    for (
      let weekStart = seedWeekStart;
      toDayStartUtcMs(weekStart) <= toDayStartUtcMs(seriesEnd);
      weekStart = addDaysUtc(weekStart, intervalWeeks * 7)
    ) {
      for (const weekday of weekdays) {
        const occurrence = addDaysUtc(weekStart, weekdayToIndex[weekday]);
        if (withinRange(occurrence)) generated.add(formatYmdUtc(occurrence));
      }
    }
  } else if (recurrence.frequency === "monthly") {
    const intervalMonths = clampPositiveInt(recurrence.intervalMonths, 1);
    const monthDay = recurrence.monthDay;
    const nthWeek = recurrence.nthWeek;
    const weekdays = normalizeWeekdays(recurrence.weekdays, seedWeekday);

    for (
      let cursor = new Date(Date.UTC(seedStart.getUTCFullYear(), seedStart.getUTCMonth(), 1));
      toDayStartUtcMs(cursor) <= toDayStartUtcMs(seriesEnd);
      cursor = addMonthsUtc(cursor, intervalMonths)
    ) {
      const year = cursor.getUTCFullYear();
      const month = cursor.getUTCMonth();
      const monthOccurrences: Date[] = [];

      if (typeof monthDay === "number") {
        const day = Math.floor(monthDay);
        if (day >= 1 && day <= daysInMonth(year, month)) {
          monthOccurrences.push(new Date(Date.UTC(year, month, day)));
        }
      } else if (typeof nthWeek === "number") {
        for (const weekday of weekdays) {
          const candidate = getNthWeekdayDateOfMonth(year, month, weekdayToIndex[weekday], nthWeek);
          if (candidate) monthOccurrences.push(candidate);
        }
      } else {
        const seedDay = seedStart.getUTCDate();
        if (seedDay <= daysInMonth(year, month)) {
          monthOccurrences.push(new Date(Date.UTC(year, month, seedDay)));
        }
      }

      for (const occurrence of monthOccurrences) {
        if (withinRange(occurrence)) generated.add(formatYmdUtc(occurrence));
      }
    }
  } else {
    const intervalDays = clampPositiveInt(recurrence.intervalDays, 1);
    for (
      let cursor = seedStart;
      toDayStartUtcMs(cursor) <= toDayStartUtcMs(seriesEnd);
      cursor = addDaysUtc(cursor, intervalDays)
    ) {
      if (withinRange(cursor)) generated.add(formatYmdUtc(cursor));
    }
  }

  let ordered = [...generated]
    .map((ymd) => parseYmdUtc(ymd))
    .filter((date): date is Date => Boolean(date))
    .sort((left, right) => toDayStartUtcMs(left) - toDayStartUtcMs(right));

  const hardLimit = clampPositiveInt(recurrence.maxOccurrences, DEFAULT_MAX_OCCURRENCES);
  ordered = ordered.slice(0, hardLimit);

  if (typeof recurrence.count === "number" && Number.isFinite(recurrence.count)) {
    ordered = ordered.slice(0, Math.max(0, Math.floor(recurrence.count)));
  }

  if (recurrence.skipDates?.length) {
    ordered = ordered.filter((date) => !isSkipped(recurrence, date));
  }

  return ordered;
}

/**
 * Builds an RFC5545 RRULE (+ EXDATE when `skipDates` is set) for "Add to Calendar" links.
 * The two lines are newline-joined into one string; Google's quick-add `recur` query param
 * accepts this as a single value.
 */
export function buildRrule(recurrence: EventRecurrence): string | null {
  const parts: string[] = [];

  if (recurrence.frequency === "weekly") {
    parts.push("FREQ=WEEKLY");
    if (recurrence.intervalWeeks && recurrence.intervalWeeks > 1) parts.push(`INTERVAL=${recurrence.intervalWeeks}`);
    if (recurrence.weekdays?.length) parts.push(`BYDAY=${recurrence.weekdays.map((w) => weekdayToRrule[w]).join(",")}`);
  } else if (recurrence.frequency === "monthly") {
    parts.push("FREQ=MONTHLY");
    if (recurrence.intervalMonths && recurrence.intervalMonths > 1) parts.push(`INTERVAL=${recurrence.intervalMonths}`);
    if (recurrence.monthDay) {
      parts.push(`BYMONTHDAY=${recurrence.monthDay}`);
    } else if (recurrence.nthWeek && recurrence.weekdays?.length) {
      parts.push(`BYDAY=${recurrence.nthWeek}${weekdayToRrule[recurrence.weekdays[0]]}`);
    }
  } else {
    parts.push("FREQ=DAILY");
    if (recurrence.intervalDays && recurrence.intervalDays > 1) parts.push(`INTERVAL=${recurrence.intervalDays}`);
  }

  if (typeof recurrence.count === "number") {
    parts.push(`COUNT=${recurrence.count}`);
  } else if (recurrence.until) {
    const ms = Date.parse(recurrence.until);
    if (Number.isFinite(ms)) {
      const d = new Date(ms);
      parts.push(`UNTIL=${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}T000000Z`);
    }
  }

  if (!parts.length) return null;
  const lines = [`RRULE:${parts.join(";")}`];

  if (recurrence.skipDates?.length) {
    const exdates = recurrence.skipDates.map((ymd) => ymd.replace(/-/g, "")).join(",");
    lines.push(`EXDATE;VALUE=DATE:${exdates}`);
  }

  return lines.join("\n");
}
