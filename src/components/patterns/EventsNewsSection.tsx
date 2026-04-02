import { Calendar, CalendarPlus, ExternalLink, MapPin, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EventBanner, { type EventBannerItem } from "@/components/patterns/EventBanner";
import FormEmbedModal from "@/components/patterns/FormEmbedModal";
import ShareActions from "@/components/patterns/ShareActions";
import { cn } from "@/lib/utils";

type EventsNewsEntryKind = "event" | "news";
type EventsNewsArticleType = "external" | "local";
type EventsNewsWeekday = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
type EventsNewsMonthlyWeek = 1 | 2 | 3 | 4 | 5 | -1;
type EventsNewsCalloutTone = "info" | "success" | "warning";

type EventsNewsEventRecurrenceBase = {
  startOn?: string;
  until?: string;
  count?: number;
  maxOccurrences?: number;
};

type EventsNewsWeeklyRecurrence = EventsNewsEventRecurrenceBase & {
  frequency: "weekly";
  intervalWeeks?: number;
  weekdays?: EventsNewsWeekday[];
};

type EventsNewsMonthlyRecurrence = EventsNewsEventRecurrenceBase & {
  frequency: "monthly";
  intervalMonths?: number;
  monthDay?: number;
  nthWeek?: EventsNewsMonthlyWeek;
  weekdays?: EventsNewsWeekday[];
};

export type EventsNewsEventRecurrence = EventsNewsWeeklyRecurrence | EventsNewsMonthlyRecurrence;

type EventsNewsParagraphBlock = {
  type: "paragraph";
  text: string;
};

type EventsNewsListBlock = {
  type: "list";
  items: string[];
  ordered?: boolean;
  title?: string;
};

type EventsNewsQuoteBlock = {
  type: "quote";
  quote: string;
  cite?: string;
};

type EventsNewsCalloutBlock = {
  type: "callout";
  text: string;
  title?: string;
  tone?: EventsNewsCalloutTone;
};

type EventsNewsCtaAction = {
  label: string;
  href: string;
  external?: boolean;
};

type EventsNewsCtaRowBlock = {
  type: "ctaRow";
  actions: EventsNewsCtaAction[];
};

export type EventsNewsContentBlock =
  | EventsNewsParagraphBlock
  | EventsNewsListBlock
  | EventsNewsQuoteBlock
  | EventsNewsCalloutBlock
  | EventsNewsCtaRowBlock;

type EventsNewsBaseEntry = {
  id: string;
  kind: EventsNewsEntryKind;
  title: string;
  summary?: string;
  body?: string;
  contentBlocks?: EventsNewsContentBlock[];
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  dateLabel?: string;
  highlights?: string[];
};

export type EventsNewsEventEntry = EventsNewsBaseEntry & {
  kind: "event";
  startAt: string;
  endAt?: string;
  startAtIso?: string;
  endAtIso?: string;
  locationLabel?: string;
  mapsUrl?: string;
  registrationUrl?: string;
  moreInfoUrl?: string;
  recurrence?: EventsNewsEventRecurrence;
};

export type EventsNewsArticleEntry = EventsNewsBaseEntry & {
  kind: "news";
  publishedAt: string;
  articleType?: EventsNewsArticleType;
};

export type EventsNewsEntry = EventsNewsEventEntry | EventsNewsArticleEntry;

type EventsNewsRenderableEventEntry = EventsNewsEventEntry & {
  sourceEventId?: string;
  recurrenceInstance?: boolean;
};

type EventsNewsRenderableEntry = EventsNewsRenderableEventEntry | EventsNewsArticleEntry;
type EventsNewsCardMode = "full" | "index";

type EventsNewsSectionProps = {
  title?: string;
  description?: string;
  entries: EventsNewsEntry[];
  maxLatest?: number;
  archiveTitle?: string;
  archiveOpenByDefault?: boolean;
  archiveMaxItems?: number;
  emptyMessage?: string;
  className?: string;
  showFeatured?: boolean;
  featuredEntryId?: string;
  showFutureEventsBanner?: boolean;
  futureEventsBannerMaxVisible?: number;
  futureEventsBannerStorageKeyPrefix?: string;
  futureEventsBannerTimeZone?: string;
  futureEventsBannerClassName?: string;
  futureEventsBannerDefaultCtaHref?: string;
  eventDetailsBasePath?: string;
  cardMode?: EventsNewsCardMode;
};

const pad2 = (value: number) => String(value).padStart(2, "0");

const toUtcDateTimeForGoogle = (date: Date) => {
  const y = date.getUTCFullYear();
  const m = pad2(date.getUTCMonth() + 1);
  const d = pad2(date.getUTCDate());
  const hh = pad2(date.getUTCHours());
  const mm = pad2(date.getUTCMinutes());
  const ss = pad2(date.getUTCSeconds());
  return `${y}${m}${d}T${hh}${mm}${ss}Z`;
};

const toUtcDateForGoogle = (date: Date) => {
  const y = date.getUTCFullYear();
  const m = pad2(date.getUTCMonth() + 1);
  const d = pad2(date.getUTCDate());
  return `${y}${m}${d}`;
};

const parseYmdUtc = (value: string) => {
  const ms = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(ms) ? new Date(ms) : null;
};

const addDaysUtc = (date: Date, days: number) => {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const addMonthsUtc = (date: Date, months: number) => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
};

const formatYmdUtc = (date: Date) => {
  const y = date.getUTCFullYear();
  const m = pad2(date.getUTCMonth() + 1);
  const d = pad2(date.getUTCDate());
  return `${y}-${m}-${d}`;
};

const daysInUtcMonth = (year: number, monthIndex: number) => {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
};

const toUtcDayMs = (date: Date) => Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

const clampPositiveInt = (value: number | undefined, fallback: number) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.max(1, Math.floor(value));
};

const weekdayToIndex: Record<EventsNewsWeekday, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

const indexToWeekday: EventsNewsWeekday[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const normalizeWeekdays = (weekdays: EventsNewsWeekday[] | undefined, fallback: EventsNewsWeekday): EventsNewsWeekday[] => {
  const values = weekdays?.length ? weekdays : [fallback];
  return [...new Set(values)].sort((left, right) => weekdayToIndex[left] - weekdayToIndex[right]);
};

const getNthWeekdayInMonthUtc = (
  year: number,
  monthIndex: number,
  weekdayIndex: number,
  nthWeek: EventsNewsMonthlyWeek,
) => {
  if (nthWeek === -1) {
    const lastDay = daysInUtcMonth(year, monthIndex);
    const lastDate = new Date(Date.UTC(year, monthIndex, lastDay));
    const diff = (lastDate.getUTCDay() - weekdayIndex + 7) % 7;
    return addDaysUtc(lastDate, -diff);
  }

  const firstDate = new Date(Date.UTC(year, monthIndex, 1));
  const offset = (weekdayIndex - firstDate.getUTCDay() + 7) % 7;
  const dayOfMonth = 1 + offset + (nthWeek - 1) * 7;
  if (dayOfMonth > daysInUtcMonth(year, monthIndex)) return null;
  return new Date(Date.UTC(year, monthIndex, dayOfMonth));
};

const getRecurringOccurrenceDates = (
  entry: EventsNewsEventEntry,
  rangeStart: Date,
  rangeEnd: Date,
): Date[] => {
  const recurrence = entry.recurrence;
  if (!recurrence) return [];

  const seedStart = parseYmdUtc(recurrence.startOn ?? entry.startAt);
  if (!seedStart) return [];

  const untilDate = parseYmdUtc(recurrence.until ?? formatYmdUtc(rangeEnd)) ?? rangeEnd;
  const seriesEnd = toUtcDayMs(untilDate) < toUtcDayMs(rangeEnd) ? untilDate : rangeEnd;
  if (toUtcDayMs(seriesEnd) < toUtcDayMs(seedStart)) return [];

  const seedWeekday = indexToWeekday[seedStart.getUTCDay()];
  const generated = new Set<string>();

  if (recurrence.frequency === "weekly") {
    const intervalWeeks = clampPositiveInt(recurrence.intervalWeeks, 1);
    const weekdays = normalizeWeekdays(recurrence.weekdays, seedWeekday);
    const seedWeekStart = addDaysUtc(seedStart, -seedStart.getUTCDay());

    for (
      let weekStart = seedWeekStart;
      toUtcDayMs(weekStart) <= toUtcDayMs(seriesEnd);
      weekStart = addDaysUtc(weekStart, intervalWeeks * 7)
    ) {
      for (const weekday of weekdays) {
        const occurrence = addDaysUtc(weekStart, weekdayToIndex[weekday]);
        const occurrenceMs = toUtcDayMs(occurrence);
        if (occurrenceMs < toUtcDayMs(seedStart) || occurrenceMs < toUtcDayMs(rangeStart) || occurrenceMs > toUtcDayMs(seriesEnd)) {
          continue;
        }
        generated.add(formatYmdUtc(occurrence));
      }
    }
  } else {
    const intervalMonths = clampPositiveInt(recurrence.intervalMonths, 1);
    const monthDay = recurrence.monthDay;
    const nthWeek = recurrence.nthWeek;
    const weekdays = normalizeWeekdays(recurrence.weekdays, seedWeekday);

    for (
      let cursor = new Date(Date.UTC(seedStart.getUTCFullYear(), seedStart.getUTCMonth(), 1));
      toUtcDayMs(cursor) <= toUtcDayMs(seriesEnd);
      cursor = addMonthsUtc(cursor, intervalMonths)
    ) {
      const year = cursor.getUTCFullYear();
      const month = cursor.getUTCMonth();
      const monthOccurrences: Date[] = [];

      if (typeof monthDay === "number") {
        const day = Math.floor(monthDay);
        if (day >= 1 && day <= daysInUtcMonth(year, month)) {
          monthOccurrences.push(new Date(Date.UTC(year, month, day)));
        }
      } else if (typeof nthWeek === "number") {
        for (const weekday of weekdays) {
          const candidate = getNthWeekdayInMonthUtc(year, month, weekdayToIndex[weekday], nthWeek);
          if (candidate) monthOccurrences.push(candidate);
        }
      } else {
        const seedDay = seedStart.getUTCDate();
        if (seedDay <= daysInUtcMonth(year, month)) {
          monthOccurrences.push(new Date(Date.UTC(year, month, seedDay)));
        }
      }

      for (const occurrence of monthOccurrences) {
        const occurrenceMs = toUtcDayMs(occurrence);
        if (occurrenceMs < toUtcDayMs(seedStart) || occurrenceMs < toUtcDayMs(rangeStart) || occurrenceMs > toUtcDayMs(seriesEnd)) {
          continue;
        }
        generated.add(formatYmdUtc(occurrence));
      }
    }
  }

  let ordered = [...generated]
    .map((ymd) => parseYmdUtc(ymd))
    .filter((date): date is Date => Boolean(date))
    .sort((left, right) => toUtcDayMs(left) - toUtcDayMs(right));

  const hardLimit = clampPositiveInt(recurrence.maxOccurrences, 120);
  ordered = ordered.slice(0, hardLimit);

  if (typeof recurrence.count === "number" && Number.isFinite(recurrence.count)) {
    ordered = ordered.slice(0, Math.max(0, Math.floor(recurrence.count)));
  }

  return ordered;
};

const getTimedOccurrenceIso = (seedIso: string, occurrenceDate: Date) => {
  const seedMs = Date.parse(seedIso);
  if (!Number.isFinite(seedMs)) return null;
  const seed = new Date(seedMs);
  return new Date(
    Date.UTC(
      occurrenceDate.getUTCFullYear(),
      occurrenceDate.getUTCMonth(),
      occurrenceDate.getUTCDate(),
      seed.getUTCHours(),
      seed.getUTCMinutes(),
      seed.getUTCSeconds(),
      seed.getUTCMilliseconds(),
    ),
  ).toISOString();
};

const expandEventEntry = (
  entry: EventsNewsEventEntry,
  rangeStart: Date,
  rangeEnd: Date,
): EventsNewsRenderableEventEntry[] => {
  if (!entry.recurrence) return [entry];

  const occurrenceDates = getRecurringOccurrenceDates(entry, rangeStart, rangeEnd);
  if (!occurrenceDates.length) return [];

  const seedStartDate = parseYmdUtc(entry.startAt);
  const seedEndDate = parseYmdUtc(entry.endAt ?? entry.startAt);
  const daySpan =
    seedStartDate && seedEndDate
      ? Math.max(0, Math.round((toUtcDayMs(seedEndDate) - toUtcDayMs(seedStartDate)) / (24 * 60 * 60 * 1000)))
      : 0;

  const seedTimedStartMs = entry.startAtIso ? Date.parse(entry.startAtIso) : NaN;
  const seedTimedEndMs = entry.endAtIso ? Date.parse(entry.endAtIso) : NaN;
  const timedDurationMs =
    Number.isFinite(seedTimedStartMs) && Number.isFinite(seedTimedEndMs) && seedTimedEndMs >= seedTimedStartMs
      ? seedTimedEndMs - seedTimedStartMs
      : 0;

  return occurrenceDates.map((occurrenceDate) => {
    const startAt = formatYmdUtc(occurrenceDate);
    const endAtDate = addDaysUtc(occurrenceDate, daySpan);
    const endAt = entry.endAt || daySpan > 0 ? formatYmdUtc(endAtDate) : undefined;

    const startAtIso = entry.startAtIso ? getTimedOccurrenceIso(entry.startAtIso, occurrenceDate) ?? undefined : undefined;
    const endAtIso =
      entry.endAtIso && startAtIso
        ? new Date(Date.parse(startAtIso) + timedDurationMs).toISOString()
        : entry.endAtIso
          ? undefined
          : undefined;

    return {
      ...entry,
      id: `${entry.id}__${startAt}`,
      sourceEventId: entry.id,
      recurrenceInstance: true,
      startAt,
      endAt,
      startAtIso,
      endAtIso,
    };
  });
};

const getRenderableEntries = (entries: EventsNewsEntry[]): EventsNewsRenderableEntry[] => {
  const todayUtc = new Date();
  const rangeStart = addDaysUtc(new Date(Date.UTC(todayUtc.getUTCFullYear(), todayUtc.getUTCMonth(), todayUtc.getUTCDate())), -365);
  const rangeEnd = addDaysUtc(new Date(Date.UTC(todayUtc.getUTCFullYear(), todayUtc.getUTCMonth(), todayUtc.getUTCDate())), 365);

  return entries.flatMap((entry) => {
    if (entry.kind === "news") return [entry];
    return expandEventEntry(entry, rangeStart, rangeEnd);
  });
};

const getSortMs = (entry: EventsNewsRenderableEntry) => {
  if (entry.kind === "news") {
    const ms = Date.parse(`${entry.publishedAt}T12:00:00Z`);
    return Number.isFinite(ms) ? ms : 0;
  }

  const timed = entry.startAtIso ? Date.parse(entry.startAtIso) : NaN;
  if (Number.isFinite(timed)) return timed;
  const dateOnly = Date.parse(`${entry.startAt}T12:00:00Z`);
  return Number.isFinite(dateOnly) ? dateOnly : 0;
};

const getEventEndMs = (entry: EventsNewsRenderableEventEntry) => {
  const explicitEnd = entry.endAtIso ? Date.parse(entry.endAtIso) : NaN;
  if (Number.isFinite(explicitEnd)) return explicitEnd;
  const endDate = Date.parse(`${entry.endAt ?? entry.startAt}T23:59:59Z`);
  return Number.isFinite(endDate) ? endDate : null;
};

const getEventStatus = (entry: EventsNewsRenderableEventEntry): "upcoming" | "ongoing" | "past" => {
  const now = Date.now();
  const startMs = getEventStartMs(entry);
  const endMs = getEventEndMs(entry);
  if (startMs <= now && (endMs === null || endMs >= now)) return "ongoing";
  if (startMs > now) return "upcoming";
  return "past";
};

const getArticleType = (entry: EventsNewsArticleEntry): EventsNewsArticleType => {
  if (entry.articleType) return entry.articleType;
  if (entry.href?.startsWith("/")) return "local";
  return "external";
};

const normalizeSlugToken = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

const toEventDetailsHref = (entry: EventsNewsRenderableEventEntry, basePath: string) => {
  const trimmedBase = basePath.trim();
  if (!trimmedBase) return null;
  const normalizedBase = trimmedBase === "/" ? "" : trimmedBase.replace(/\/+$/, "");
  const sourceId = entry.sourceEventId ?? entry.id;
  const slug = normalizeSlugToken(sourceId);
  if (!slug) return null;
  return `${normalizedBase}/${slug}`;
};

const getDetailsHref = (entry: EventsNewsRenderableEntry, eventDetailsBasePath?: string) => {
  const href = entry.href?.trim();
  if (href) return href;
  if (entry.kind !== "event" || !eventDetailsBasePath) return null;
  return toEventDetailsHref(entry, eventDetailsBasePath);
};

const toAbsoluteShareUrl = (href: string) => {
  if (/^https?:\/\//i.test(href)) return href;
  if (href.startsWith("/") && typeof window !== "undefined") {
    return new URL(href, window.location.origin).toString();
  }
  return href;
};

const humanDateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const humanDateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const formatFallbackDateLabel = (entry: EventsNewsRenderableEntry) => {
  if (entry.kind === "event") {
    const timedMs = entry.startAtIso ? Date.parse(entry.startAtIso) : NaN;
    if (Number.isFinite(timedMs)) return humanDateTimeFormatter.format(new Date(timedMs));

    const ymd = parseYmdUtc(entry.startAt);
    if (ymd) return humanDateFormatter.format(ymd);

    const parsedMs = Date.parse(entry.startAt);
    if (Number.isFinite(parsedMs)) return humanDateTimeFormatter.format(new Date(parsedMs));

    return entry.startAt;
  }

  const ymd = parseYmdUtc(entry.publishedAt);
  if (ymd) return humanDateFormatter.format(ymd);

  const parsedMs = Date.parse(entry.publishedAt);
  if (Number.isFinite(parsedMs)) return humanDateFormatter.format(new Date(parsedMs));

  return entry.publishedAt;
};

const getEventStartMs = (entry: EventsNewsRenderableEventEntry) => {
  const timed = entry.startAtIso ? Date.parse(entry.startAtIso) : NaN;
  if (Number.isFinite(timed)) return timed;
  const dateOnly = Date.parse(`${entry.startAt}T12:00:00Z`);
  return Number.isFinite(dateOnly) ? dateOnly : 0;
};

const getEventSeriesKey = (entry: EventsNewsRenderableEventEntry) => entry.sourceEventId ?? entry.id;

const isRecurringEventEntry = (entry: EventsNewsRenderableEventEntry) =>
  Boolean(entry.recurrence || entry.recurrenceInstance || entry.sourceEventId);

const byNewestFirst = (left: EventsNewsRenderableEntry, right: EventsNewsRenderableEntry) =>
  getSortMs(right) - getSortMs(left);

const bySoonestFirst = (left: EventsNewsRenderableEventEntry, right: EventsNewsRenderableEventEntry) =>
  getEventStartMs(left) - getEventStartMs(right);

const toEventDisplayBuckets = (entries: EventsNewsRenderableEntry[]) => {
  const eventEntries = entries.filter((entry): entry is EventsNewsRenderableEventEntry => entry.kind === "event");
  const groupedEvents = new Map<string, EventsNewsRenderableEventEntry[]>();

  for (const entry of eventEntries) {
    const key = getEventSeriesKey(entry);
    const existing = groupedEvents.get(key);
    if (existing) {
      existing.push(entry);
      continue;
    }
    groupedEvents.set(key, [entry]);
  }

  const activeEvents: EventsNewsRenderableEventEntry[] = [];
  const archivedEvents: EventsNewsRenderableEventEntry[] = [];

  for (const group of groupedEvents.values()) {
    const recurringSeries = group.some((entry) => isRecurringEventEntry(entry));

    if (recurringSeries) {
      const next = group
        .filter((entry) => getEventStatus(entry) !== "past")
        .sort(bySoonestFirst)[0];
      if (next) activeEvents.push(next);

      archivedEvents.push(...group.filter((entry) => getEventStatus(entry) === "past"));
      continue;
    }

    for (const entry of group) {
      if (getEventStatus(entry) === "past") archivedEvents.push(entry);
      else activeEvents.push(entry);
    }
  }

  return {
    activeEvents: activeEvents.sort(byNewestFirst),
    archivedEvents: archivedEvents.sort(byNewestFirst),
  };
};

const getBannerUpcomingEvents = (entries: EventsNewsRenderableEntry[]) => {
  const now = Date.now();
  const eventEntries = entries
    .filter((entry): entry is EventsNewsRenderableEventEntry => entry.kind === "event")
    .filter((entry) => getEventStartMs(entry) > now);

  const recurringBySeries = new Map<string, EventsNewsRenderableEventEntry[]>();
  const singleEvents: EventsNewsRenderableEventEntry[] = [];

  for (const entry of eventEntries) {
    if (!isRecurringEventEntry(entry)) {
      singleEvents.push(entry);
      continue;
    }

    const key = getEventSeriesKey(entry);
    const existing = recurringBySeries.get(key);
    if (existing) {
      existing.push(entry);
      continue;
    }
    recurringBySeries.set(key, [entry]);
  }

  const recurringNext = [...recurringBySeries.values()]
    .map((group) => group.sort(bySoonestFirst)[0])
    .filter((entry): entry is EventsNewsRenderableEventEntry => Boolean(entry));

  return [...singleEvents, ...recurringNext].sort(bySoonestFirst);
};

const toBannerEvents = (
  entries: EventsNewsRenderableEntry[],
  defaultCtaHref?: string,
  eventDetailsBasePath?: string,
): EventBannerItem[] => {
  return getBannerUpcomingEvents(entries)
    .map((entry) => {
      const detailsHref = getDetailsHref(entry, eventDetailsBasePath) ?? defaultCtaHref;
      return {
        id: `event-banner-${entry.id}`,
        title: entry.title,
        startsAtIso: entry.startAtIso ?? `${entry.startAt}T12:00:00Z`,
        endsAtIso: entry.endAtIso ?? (entry.endAt ? `${entry.endAt}T23:59:59Z` : undefined),
        locationLabel: entry.locationLabel,
        ctaHref: detailsHref,
        ctaLabel: detailsHref ? "Details" : undefined,
      };
    });
};

const getMapsUrl = (entry: EventsNewsRenderableEventEntry) => {
  if (entry.mapsUrl) return entry.mapsUrl;
  if (!entry.locationLabel) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(entry.locationLabel)}`;
};

const getGoogleCalendarUrl = (entry: EventsNewsRenderableEventEntry) => {
  const details = [entry.summary, entry.body]
    .filter(Boolean)
    .join("\n\n");

  let dates: string | null = null;
  if (entry.startAtIso) {
    const startMs = Date.parse(entry.startAtIso);
    const endMs = Date.parse(entry.endAtIso ?? entry.startAtIso);
    if (Number.isFinite(startMs) && Number.isFinite(endMs) && endMs >= startMs) {
      dates = `${toUtcDateTimeForGoogle(new Date(startMs))}/${toUtcDateTimeForGoogle(new Date(endMs))}`;
    }
  }

  if (!dates) {
    const start = parseYmdUtc(entry.startAt);
    const endInclusive = parseYmdUtc(entry.endAt ?? entry.startAt);
    if (!start || !endInclusive) return null;
    const endExclusive = addDaysUtc(endInclusive, 1);
    dates = `${toUtcDateForGoogle(start)}/${toUtcDateForGoogle(endExclusive)}`;
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: entry.title,
    dates,
    ...(details ? { details } : {}),
    ...(entry.locationLabel ? { location: entry.locationLabel } : {}),
    sf: "true",
    output: "xml",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const getEntryContentBlocks = (entry: EventsNewsRenderableEntry): EventsNewsContentBlock[] => {
  if (entry.contentBlocks?.length) return entry.contentBlocks;

  const bodyBlocks: EventsNewsParagraphBlock[] = entry.body
    ? entry.body
      .split("\n\n")
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map((text) => ({ type: "paragraph", text }))
    : [];

  const highlightBlocks: EventsNewsListBlock[] =
    entry.highlights?.length
      ? [{ type: "list", items: entry.highlights, title: "Highlights" }]
      : [];

  return [...bodyBlocks, ...highlightBlocks];
};

const calloutToneClass: Record<EventsNewsCalloutTone, string> = {
  info: "border-primary/30 bg-primary/5",
  success: "border-emerald-500/30 bg-emerald-500/10",
  warning: "border-amber-500/30 bg-amber-500/10",
};

const isExternalContentHref = (href: string, external?: boolean) =>
  typeof external === "boolean" ? external : !href.startsWith("/");

const renderContentBlock = (entryId: string, block: EventsNewsContentBlock, index: number) => {
  if (block.type === "paragraph") {
    return (
      <p key={`${entryId}-paragraph-${index}`} className="text-sm leading-relaxed text-muted-foreground">
        {block.text}
      </p>
    );
  }

  if (block.type === "list") {
    const ListTag = block.ordered ? "ol" : "ul";
    return (
      <div key={`${entryId}-list-${index}`} className="space-y-2">
        {block.title ? <p className="text-sm font-medium text-foreground">{block.title}</p> : null}
        <ListTag className={cn("pl-5 text-sm text-muted-foreground space-y-1", block.ordered ? "list-decimal" : "list-disc")}>
          {block.items.map((item) => (
            <li key={`${entryId}-list-${index}-${item}`}>{item}</li>
          ))}
        </ListTag>
      </div>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote key={`${entryId}-quote-${index}`} className="border-l-2 border-primary/40 pl-4 text-sm italic text-muted-foreground">
        <p>{block.quote}</p>
        {block.cite ? <cite className="mt-2 block text-xs not-italic text-muted-foreground/90">- {block.cite}</cite> : null}
      </blockquote>
    );
  }

  if (block.type === "callout") {
    const toneClass = calloutToneClass[block.tone ?? "info"];
    return (
      <div key={`${entryId}-callout-${index}`} className={cn("rounded-lg border p-3", toneClass)}>
        {block.title ? <p className="text-sm font-medium text-foreground">{block.title}</p> : null}
        <p className="text-sm text-muted-foreground">{block.text}</p>
      </div>
    );
  }

  return (
    <div key={`${entryId}-ctas-${index}`} className="flex flex-wrap items-center gap-2">
      {block.actions.map((action) => {
        const external = isExternalContentHref(action.href, action.external);
        if (external) {
          return (
            <Button key={`${entryId}-${index}-${action.href}`} asChild size="sm" variant="outline">
              <a href={action.href} target="_blank" rel="noopener noreferrer">
                {action.label}
              </a>
            </Button>
          );
        }
        return (
          <Button key={`${entryId}-${index}-${action.href}`} asChild size="sm" variant="outline">
            <Link to={action.href}>{action.label}</Link>
          </Button>
        );
      })}
    </div>
  );
};

const renderEntryCard = (
  entry: EventsNewsRenderableEntry,
  eventDetailsBasePath?: string,
  cardMode: EventsNewsCardMode = "full",
) => {
  const detailsHref = getDetailsHref(entry, eventDetailsBasePath);
  const mapsUrl = entry.kind === "event" ? getMapsUrl(entry) : null;
  const calendarUrl = entry.kind === "event" ? getGoogleCalendarUrl(entry) : null;
  const registrationUrl = entry.kind === "event" ? entry.registrationUrl?.trim() : null;
  const moreInfoUrl = entry.kind === "event" ? entry.moreInfoUrl?.trim() : null;
  const shareUrl = entry.kind === "event" && detailsHref ? toAbsoluteShareUrl(detailsHref) : null;
  const contentBlocks = getEntryContentBlocks(entry);

  const eventStatus = entry.kind === "event" ? getEventStatus(entry) : null;
  const articleType = entry.kind === "news" ? getArticleType(entry) : null;
  const metadataLabel = [
    eventStatus ? `Status: ${eventStatus}` : null,
    entry.kind === "event" && entry.recurrenceInstance ? "Recurring" : null,
    articleType ? `${articleType} article` : null,
  ]
    .filter(Boolean)
    .join(" • ");
  const isIndexMode = cardMode === "index";

  return (
    <Card key={entry.id} className="overflow-hidden border-border/80">
      {!isIndexMode && entry.imageSrc ? (
        <a
          href={entry.imageSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-muted"
        >
          <img
            src={entry.imageSrc}
            alt={entry.imageAlt ?? entry.title}
            className="w-full max-h-[520px] object-contain"
            loading="lazy"
          />
        </a>
      ) : null}
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
            {entry.kind === "event" ? <Calendar className="h-3.5 w-3.5" /> : <Newspaper className="h-3.5 w-3.5" />}
            <span>{entry.kind === "event" ? "Event" : "News"}</span>
          </div>
        </div>
        {metadataLabel ? <p className="text-xs text-muted-foreground">{metadataLabel}</p> : null}
        <CardTitle className="text-xl">{entry.title}</CardTitle>
        <CardDescription>
          {entry.dateLabel ?? formatFallbackDateLabel(entry)}
          {entry.kind === "event" && entry.locationLabel ? ` • ${entry.locationLabel}` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {entry.summary ? <p className="text-sm text-muted-foreground">{entry.summary}</p> : null}
        {!isIndexMode && contentBlocks.length ? <div className="space-y-4">{contentBlocks.map((block, idx) => renderContentBlock(entry.id, block, idx))}</div> : null}
        <div className="flex flex-wrap items-center gap-3">
          {detailsHref ? (
            detailsHref.startsWith("/") ? (
              <Button asChild size="sm" variant="outline">
                <Link to={detailsHref}>Details</Link>
              </Button>
            ) : (
              <Button asChild size="sm" variant="outline">
                <a href={detailsHref} target="_blank" rel="noopener noreferrer">
                  Details
                </a>
              </Button>
            )
          ) : null}
          {!isIndexMode && entry.kind === "event" && mapsUrl ? (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <MapPin className="h-4 w-4" />
              Open in Maps
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
          {!isIndexMode && entry.kind === "event" && calendarUrl ? (
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <CalendarPlus className="h-4 w-4" />
              Add to Google Calendar
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
          {!isIndexMode && entry.kind === "event" && registrationUrl ? (
            <FormEmbedModal
              formUrl={registrationUrl}
              title={`${entry.title} Registration`}
              asButton={false}
              triggerClassName="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <>
                Register
                <ExternalLink className="h-3.5 w-3.5" />
              </>
            </FormEmbedModal>
          ) : null}
          {!isIndexMode && entry.kind === "event" && moreInfoUrl ? (
            <a
              href={moreInfoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              More info
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
          {!isIndexMode && entry.kind === "event" && shareUrl ? (
            <ShareActions
              url={shareUrl}
              title={entry.title}
              text={entry.summary}
              channels={["copy"]}
            />
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

const EventsNewsSection = ({
  title = "Events & News",
  description = "Latest updates in calendar order. Older entries are kept in the archive.",
  entries,
  maxLatest = 6,
  archiveTitle = "Archive",
  archiveOpenByDefault = false,
  archiveMaxItems,
  emptyMessage = "No events or news entries yet.",
  className,
  showFeatured = false,
  featuredEntryId,
  showFutureEventsBanner = false,
  futureEventsBannerMaxVisible = 2,
  futureEventsBannerStorageKeyPrefix = "template_events_news_future_banner_dismissed_until",
  futureEventsBannerTimeZone,
  futureEventsBannerClassName,
  futureEventsBannerDefaultCtaHref,
  eventDetailsBasePath,
  cardMode = "full",
}: EventsNewsSectionProps) => {
  const renderableEntries = getRenderableEntries(entries);
  const { activeEvents, archivedEvents } = toEventDisplayBuckets(renderableEntries);
  const sortedNews = renderableEntries
    .filter((entry): entry is EventsNewsArticleEntry => entry.kind === "news")
    .sort(byNewestFirst);
  const sorted = [...activeEvents, ...sortedNews].sort(byNewestFirst);
  const featured = showFeatured
    ? (
      featuredEntryId
        ? sorted.find((entry) =>
          entry.id === featuredEntryId ||
          (entry.kind === "event" && entry.sourceEventId === featuredEntryId),
        )
        : sorted[0]
    ) ?? null
    : null;
  const nonFeatured = featured ? sorted.filter((entry) => entry.id !== featured.id) : sorted;
  const latest = nonFeatured.slice(0, maxLatest);
  const archiveRaw = [...archivedEvents, ...nonFeatured.slice(maxLatest)].sort(byNewestFirst);
  const archive = typeof archiveMaxItems === "number" ? archiveRaw.slice(0, Math.max(0, archiveMaxItems)) : archiveRaw;
  const bannerEvents = showFutureEventsBanner
    ? toBannerEvents(renderableEntries, futureEventsBannerDefaultCtaHref, eventDetailsBasePath)
    : [];

  return (
    <section className={cn("rounded-2xl border border-border bg-card/40 p-6", className)}>
      {showFutureEventsBanner && bannerEvents.length ? (
        <EventBanner
          events={bannerEvents}
          maxVisible={futureEventsBannerMaxVisible}
          storageKeyPrefix={futureEventsBannerStorageKeyPrefix}
          timeZone={futureEventsBannerTimeZone}
          className={cn("mb-6 rounded-xl border border-primary/20", futureEventsBannerClassName)}
        />
      ) : null}
      <div className="mb-6">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>

      {featured ? (
        <div className="mb-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Featured update</p>
          {renderEntryCard(featured, eventDetailsBasePath, cardMode)}
        </div>
      ) : null}

      {latest.length ? (
        <div className="space-y-6">{latest.map((entry) => renderEntryCard(entry, eventDetailsBasePath, cardMode))}</div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-6 text-sm text-muted-foreground">{emptyMessage}</CardContent>
        </Card>
      )}

      {archive.length ? (
        <details
          className="mt-6 rounded-xl border border-border bg-background/60 p-4"
          open={archiveOpenByDefault}
        >
          <summary className="cursor-pointer list-none text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
            {archiveTitle} ({archive.length})
          </summary>
          <div className="mt-4 space-y-4">{archive.map((entry) => renderEntryCard(entry, eventDetailsBasePath, cardMode))}</div>
        </details>
      ) : null}
    </section>
  );
};

export default EventsNewsSection;
