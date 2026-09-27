export type EventRecurrenceWeekday = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
export type EventRecurrenceMonthlyWeek = 1 | 2 | 3 | 4 | 5 | -1;

type EventRecurrenceBase = {
  startOn?: string;
  until?: string;
  count?: number;
  maxOccurrences?: number;
  skipDates?: string[];
  /**
   * IANA zone (e.g. "America/Los_Angeles") the seed's wall-clock time is authored in. When set,
   * each occurrence's UTC offset is recomputed per its own calendar date via `Intl.DateTimeFormat`
   * instead of reusing the seed's literal offset forever — so a recurring event keeps rendering at
   * the same local time across a DST transition. Omit to keep the seed's fixed offset (the
   * pre-existing, backward-compatible behavior — correct for a series that never crosses a DST
   * change, wrong for one that does). See event-module-wiring-contract.md §6, TPL-048.
   */
  timeZone?: string;
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

/**
 * One resolved occurrence. `startAtIso`/`endAtIso` carry the seed's literal local time and UTC
 * offset (e.g. "2026-10-01T17:00:00-07:00"), NOT a UTC ("Z") string — `Date.parse` of them is
 * still the correct instant. `startDateYmd`/`endDateYmd` are the local calendar dates. Callers
 * must read the calendar date from those fields, never by slicing the ISO string, and must never
 * re-seed a recurrence from an already-generated occurrence's date derived any other way.
 */
export type EventOccurrence = {
  startAtIso: string;
  endAtIso: string;
  startDateYmd: string;
  endDateYmd: string;
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

const formatOffsetLabel = (minutes: number): string => {
  const sign = minutes < 0 ? "-" : "+";
  const abs = Math.abs(minutes);
  return `${sign}${pad2(Math.floor(abs / 60))}:${pad2(abs % 60)}`;
};

// The UTC offset (in minutes) a zone observes on a given calendar date, e.g. -420 for
// America/Los_Angeles in August (PDT), -480 in December (PST). Looked up via a noon-UTC
// reference instant on that date — safe from any real-world transition, which always happens in
// the small hours of local time, never near noon. Returns null for an invalid/unsupported zone
// (e.g. `Intl.DateTimeFormat` throws) so the caller can fall back to the seed's fixed offset.
const getZoneOffsetMinutes = (timeZone: string, ymd: string): number | null => {
  try {
    const refMs = Date.parse(`${ymd}T12:00:00Z`);
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(refMs);
    const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
    const asIfUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
    return Math.round((asIfUtc - refMs) / 60_000);
  } catch {
    return null;
  }
};

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

// Matches the literal local wall-clock time and UTC offset in an authored ISO string, e.g.
// "2026-08-06T17:00:00-07:00" -> time "17:00:00", offset "-07:00".
const LOCAL_DATE_RE = /^(\d{4}-\d{2}-\d{2})T/;
const LOCAL_TIME_OFFSET_RE = /T(\d{2}:\d{2}:\d{2}(?:\.\d+)?)(Z|[+-]\d{2}:?\d{2})$/;

const getLocalDatePart = (iso: string): string | null => LOCAL_DATE_RE.exec(iso)?.[1] ?? null;

const getLocalTimeOffsetPart = (iso: string): { time: string; offset: string } | null => {
  const match = LOCAL_TIME_OFFSET_RE.exec(iso);
  if (!match) return null;
  return { time: match[1], offset: match[2] === "Z" ? "+00:00" : match[2] };
};

type LocalOffset = { label: string; minutes: number };

const parseOffset = (raw: string): LocalOffset => {
  if (raw === "Z") return { label: "+00:00", minutes: 0 };
  const match = /^([+-])(\d{2}):?(\d{2})$/.exec(raw);
  if (!match) return { label: "+00:00", minutes: 0 };
  const minutes = (match[1] === "-" ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3]));
  return { label: `${match[1]}${match[2]}:${match[3]}`, minutes };
};

// Formats an absolute instant as a local ISO string in a fixed UTC offset, e.g.
// (ms of 2026-10-02T00:00Z, -07:00) -> "2026-10-01T17:00:00-07:00". Shifts by the offset and reads
// the UTC getters of the shifted date, so the calendar date is the local one.
const formatIsoAtOffset = (ms: number, offset: LocalOffset, zulu = false): string => {
  const shifted = new Date(ms + (zulu ? 0 : offset.minutes) * 60_000);
  const millis = shifted.getUTCMilliseconds();
  const frac = millis ? `.${String(millis).padStart(3, "0")}` : "";
  const time = `${pad2(shifted.getUTCHours())}:${pad2(shifted.getUTCMinutes())}:${pad2(shifted.getUTCSeconds())}${frac}`;
  return `${formatYmdUtc(shifted)}T${time}${zulu ? "Z" : offset.label}`;
};

// Builds the occurrence by splicing the generated calendar date onto the seed's literal local
// time-of-day + UTC offset — read directly from the ISO string, never derived via
// `.getUTCHours()` on a real converted instant. That conversion silently rolls the calendar day
// whenever the local time + offset crosses a UTC day boundary (e.g. any evening event in a
// negative-offset zone: 17:00-07:00 = 00:00 UTC the *next* day). The output keeps that local
// time + offset (rather than `toISOString()`), so the calendar date can never be read off a UTC
// string, and the result is safe to feed back in as a seed.
const toOccurrence = (
  seedStartIso: string,
  durationMs: number,
  occurrenceDate: Date,
  timeZone?: string,
): EventOccurrence => {
  const ymd = formatYmdUtc(occurrenceDate);
  const timeOffset = getLocalTimeOffsetPart(seedStartIso);

  if (timeOffset) {
    const seedOffset = parseOffset(timeOffset.offset);
    // With no timeZone, this is exactly the seed's fixed offset — unchanged, backward-compatible
    // behavior. With a timeZone, recompute the offset for the *occurrence's own* calendar date, so
    // a series that crosses a DST boundary keeps rendering at the same local wall-clock time.
    const startOffsetMinutes = timeZone ? getZoneOffsetMinutes(timeZone, ymd) ?? seedOffset.minutes : seedOffset.minutes;
    const startOffset = { label: formatOffsetLabel(startOffsetMinutes), minutes: startOffsetMinutes };
    const startAtIso = `${ymd}T${timeOffset.time}${startOffset.label}`;
    const startMs = Date.parse(startAtIso);
    const endMs = startMs + durationMs;

    // The end may fall on a different local date than the start (an overnight event) and, in the
    // rare case of an event spanning the transition instant itself, a different offset. Estimate
    // the end's local date using the start offset, then re-look-up the zone for that date — a
    // second pass rather than true fixed-point iteration, sufficient since real transitions move
    // the clock by exactly one hour in the small hours, never mid-event for anything but that
    // vanishingly rare case.
    const provisionalEndYmd = timeZone ? formatYmdUtc(new Date(endMs + startOffsetMinutes * 60_000)) : ymd;
    const endOffsetMinutes = timeZone ? getZoneOffsetMinutes(timeZone, provisionalEndYmd) ?? startOffsetMinutes : startOffsetMinutes;
    const endAtIso = formatIsoAtOffset(endMs, { label: formatOffsetLabel(endOffsetMinutes), minutes: endOffsetMinutes });
    return { startAtIso, endAtIso, startDateYmd: ymd, endDateYmd: endAtIso.slice(0, 10) };
  }

  // Defensive fallback for a malformed seed ISO string (shouldn't happen for valid input): UTC.
  const seedStart = new Date(Date.parse(seedStartIso));
  const startMs = Date.UTC(
    occurrenceDate.getUTCFullYear(),
    occurrenceDate.getUTCMonth(),
    occurrenceDate.getUTCDate(),
    seedStart.getUTCHours(),
    seedStart.getUTCMinutes(),
    seedStart.getUTCSeconds(),
    seedStart.getUTCMilliseconds(),
  );
  const utc: LocalOffset = { label: "+00:00", minutes: 0 };
  const startAtIso = formatIsoAtOffset(startMs, utc, true);
  const endAtIso = formatIsoAtOffset(startMs + durationMs, utc, true);
  return { startAtIso, endAtIso, startDateYmd: startAtIso.slice(0, 10), endDateYmd: endAtIso.slice(0, 10) };
};

/**
 * Public counterpart to `toOccurrence`, for callers that expand every occurrence in a date range
 * themselves (e.g. `EventsNewsSection`'s list-view card expansion via `getOccurrenceDates`)
 * rather than going through `getNextOccurrence`/`getOccurrenceOnDate`. Exists so there is exactly
 * one implementation of the local-time/offset splicing — do not reimplement this logic locally in
 * a pattern component; that duplication is exactly how the day-off-by-one bug this fixes shipped
 * undetected for months. Returns null (instead of throwing) for an unparseable seed ISO string
 * or an end before the start.
 */
export const resolveOccurrence = (
  seedStartIso: string,
  seedEndIso: string,
  occurrenceDate: Date,
  timeZone?: string,
): EventOccurrence | null => {
  const seedStartMs = Date.parse(seedStartIso);
  const seedEndMs = Date.parse(seedEndIso);
  if (!Number.isFinite(seedStartMs) || !Number.isFinite(seedEndMs) || seedEndMs < seedStartMs) return null;
  return toOccurrence(seedStartIso, seedEndMs - seedStartMs, occurrenceDate, timeZone);
};

/** Start-only variant of `resolveOccurrence` (no seed end needed). Null for an unparseable seed. */
export const resolveOccurrenceStartIso = (seedStartIso: string, occurrenceDate: Date, timeZone?: string): string | null => {
  if (!Number.isFinite(Date.parse(seedStartIso))) return null;
  return toOccurrence(seedStartIso, 0, occurrenceDate, timeZone).startAtIso;
};

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
    parseYmdUtc(getLocalDatePart(seedStartIso)) ??
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

    const occurrence = toOccurrence(seedStartIso, durationMs, occurrenceDate, recurrence.timeZone);
    if (Date.parse(occurrence.endAtIso) < nowMs) continue;

    return occurrence;
  }
  return null;
}

/**
 * Resolves one specific occurrence date to its start/end ISO timestamps, honoring the seed's
 * time-of-day and duration — used to deep-link a specific past/future occurrence (e.g. the one a
 * user clicked in a list of expanded occurrences) instead of always resolving to the "next live"
 * occurrence relative to now. Returns null if `dateYmd` isn't actually a generated occurrence of
 * this recurrence (respects `until`/`count`/`skipDates`, same as `getOccurrenceDates`).
 */
export function getOccurrenceOnDate(
  recurrence: EventRecurrence,
  seedStartIso: string,
  seedEndIso: string,
  seedStartYmd: string,
  dateYmd: string,
): EventOccurrence | null {
  const seedStartMs = Date.parse(seedStartIso);
  const seedEndMs = Date.parse(seedEndIso);
  if (!Number.isFinite(seedStartMs) || !Number.isFinite(seedEndMs) || seedEndMs < seedStartMs) return null;

  const requestedDate = parseYmdUtc(dateYmd);
  if (!requestedDate) return null;

  const matches = getOccurrenceDates(recurrence, seedStartYmd, requestedDate, requestedDate);
  if (!matches.length) return null;

  const durationMs = seedEndMs - seedStartMs;
  return toOccurrence(seedStartIso, durationMs, requestedDate, recurrence.timeZone);
}

/**
 * Resolves a recurrence rule into plain data (frequency, interval, resolved weekdays/month-day)
 * for the caller to interpolate into its own localized sentence templates. Intentionally returns
 * no English text — sites render their own strings (some are bilingual, some aren't).
 */
export function describeRecurrence(recurrence: EventRecurrence, seedStartIso: string): RecurrenceDescription {
  const seedDateOnly = parseYmdUtc(getLocalDatePart(seedStartIso)) ?? new Date(Date.parse(seedStartIso));
  const seedWeekday = weekdayOrder[seedDateOnly.getUTCDay()];

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
      monthDay: recurrence.nthWeek ? undefined : recurrence.monthDay ?? seedDateOnly.getUTCDate(),
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
