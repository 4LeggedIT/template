import { useEffect, useRef, useState } from "react";
import { Calendar, Clock, X } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type EventBannerWeekday = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
type EventBannerMonthlyWeek = 1 | 2 | 3 | 4 | 5 | -1;

type EventBannerRecurrenceBase = {
  startOn?: string;
  until?: string;
  count?: number;
  maxOccurrences?: number;
};

type EventBannerWeeklyRecurrence = EventBannerRecurrenceBase & {
  frequency: "weekly";
  intervalWeeks?: number;
  weekdays?: EventBannerWeekday[];
};

type EventBannerMonthlyRecurrence = EventBannerRecurrenceBase & {
  frequency: "monthly";
  intervalMonths?: number;
  monthDay?: number;
  nthWeek?: EventBannerMonthlyWeek;
  weekdays?: EventBannerWeekday[];
};

type EventBannerRecurrence = EventBannerWeeklyRecurrence | EventBannerMonthlyRecurrence;

export type EventBannerItem = {
  id: string;
  title: string;
  startsAtIso?: string;
  endsAtIso?: string;
  expiresAtIso?: string;
  recurrence?: EventBannerRecurrence;
  locationLabel?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

type EventBannerProps = {
  events: EventBannerItem[];
  storageKeyPrefix?: string;
  maxVisible?: number;
  timeZone?: string;
  className?: string;
};

const DEFAULT_TIME_ZONE = "America/Los_Angeles";
const weekdayToIndex: Record<EventBannerWeekday, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};
const indexToWeekday: EventBannerWeekday[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const toMs = (iso?: string) => {
  if (!iso) return null;
  const value = Date.parse(iso);
  return Number.isFinite(value) ? value : null;
};

const toDayStartUtcMs = (value: Date) =>
  Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());

const parseYmdUtc = (value?: string) => {
  if (!value) return null;
  const ms = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(ms) ? new Date(ms) : null;
};

const addDaysUtc = (date: Date, days: number) => {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const toOccurrenceStartIso = (seedStart: Date, occurrenceDate: Date) =>
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

const getRecurringEffectiveEvent = (event: EventBannerItem, nowMs: number): EventBannerItem | null => {
  const recurrence = event.recurrence;
  if (!recurrence || recurrence.frequency !== "weekly") return event;
  if (!event.startsAtIso || !event.endsAtIso) return event;

  const seedStartMs = Date.parse(event.startsAtIso);
  const seedEndMs = Date.parse(event.endsAtIso);
  if (!Number.isFinite(seedStartMs) || !Number.isFinite(seedEndMs) || seedEndMs < seedStartMs) return event;

  const seedStart = new Date(seedStartMs);
  const seedDate =
    parseYmdUtc(recurrence.startOn) ??
    new Date(Date.UTC(seedStart.getUTCFullYear(), seedStart.getUTCMonth(), seedStart.getUTCDate()));
  const seedWeekStart = addDaysUtc(seedDate, -seedDate.getUTCDay());
  const intervalWeeks = Math.max(1, Math.floor(recurrence.intervalWeeks ?? 1));
  const recurrenceWeekdays = recurrence.weekdays?.length
    ? [...new Set(recurrence.weekdays)]
    : [indexToWeekday[seedDate.getUTCDay()]];
  const durationMs = seedEndMs - seedStartMs;
  const untilDate = parseYmdUtc(recurrence.until);
  const upperBound = addDaysUtc(new Date(nowMs), 400);

  for (let week = seedWeekStart; toDayStartUtcMs(week) <= toDayStartUtcMs(upperBound); week = addDaysUtc(week, intervalWeeks * 7)) {
    for (const weekday of recurrenceWeekdays) {
      const occurrenceDate = addDaysUtc(week, weekdayToIndex[weekday]);
      const occurrenceDayMs = toDayStartUtcMs(occurrenceDate);
      if (occurrenceDayMs < toDayStartUtcMs(seedDate)) continue;
      if (untilDate && occurrenceDayMs > toDayStartUtcMs(untilDate)) return null;

      const occurrenceStartIso = toOccurrenceStartIso(seedStart, occurrenceDate);
      const occurrenceStartMs = Date.parse(occurrenceStartIso);
      const occurrenceEndMs = occurrenceStartMs + durationMs;
      if (occurrenceEndMs < nowMs) continue;

      return {
        ...event,
        startsAtIso: occurrenceStartIso,
        endsAtIso: new Date(occurrenceEndMs).toISOString(),
        expiresAtIso: new Date(occurrenceEndMs).toISOString(),
      };
    }
  }

  return null;
};

const formatDate = (iso: string, timeZone: string) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));

const formatTime = (iso: string, timeZone: string) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));

const getExpiryMs = (event: EventBannerItem) => {
  if (event.expiresAtIso) return toMs(event.expiresAtIso);
  if (event.endsAtIso) return toMs(event.endsAtIso);
  if (event.startsAtIso) {
    const start = toMs(event.startsAtIso);
    return typeof start === "number" ? start + 24 * 60 * 60 * 1000 : null;
  }
  return null;
};

const EventBanner = ({
  events,
  storageKeyPrefix = "template_event_banner_dismissed_until",
  maxVisible = 2,
  timeZone = DEFAULT_TIME_ZONE,
  className,
}: EventBannerProps) => {
  const getRenderableEvents = (nowMs: number) =>
    events
      .map((event) => getRecurringEffectiveEvent(event, nowMs))
      .filter((event): event is EventBannerItem => Boolean(event))
      .sort((a, b) => (toMs(a.startsAtIso ?? a.expiresAtIso) ?? 0) - (toMs(b.startsAtIso ?? b.expiresAtIso) ?? 0));

  const [visibleIds, setVisibleIds] = useState<string[]>(() => {
    const now = Date.now();
    return getRenderableEvents(now)
      .filter((event) => {
        const expiresAtMs = getExpiryMs(event);
        return typeof expiresAtMs === "number" ? now < expiresAtMs : true;
      })
      .slice(0, maxVisible)
      .map((event) => event.id);
  });
  const expiryTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const clearTimer = () => {
      if (expiryTimeoutRef.current !== null) {
        window.clearTimeout(expiryTimeoutRef.current);
        expiryTimeoutRef.current = null;
      }
    };

    const computeVisible = () => {
      clearTimer();
      const now = Date.now();
      const renderableEvents = getRenderableEvents(now);

      const eligible = renderableEvents.filter((event) => {
        const expiresAtMs = getExpiryMs(event);
        if (typeof expiresAtMs === "number" && now >= expiresAtMs) return false;

        const storageKey = `${storageKeyPrefix}_${event.id}`;
        const dismissedUntilMs = Number(window.localStorage.getItem(storageKey) ?? "0");
        if (typeof expiresAtMs === "number" && Number.isFinite(dismissedUntilMs) && dismissedUntilMs >= expiresAtMs) {
          return false;
        }

        return true;
      });

      const chosen = eligible.slice(0, maxVisible);
      setVisibleIds(chosen.map((event) => event.id));

      const nextExpiry = chosen
        .map((event) => getExpiryMs(event))
        .filter((ms): ms is number => typeof ms === "number")
        .sort((a, b) => a - b)[0];

      if (nextExpiry && nextExpiry > now) {
        expiryTimeoutRef.current = window.setTimeout(
          computeVisible,
          Math.min(nextExpiry - now + 250, 2_147_483_647),
        );
      }
    };

    computeVisible();
    return clearTimer;
  }, [events, storageKeyPrefix, maxVisible]);

  const visibleEvents = getRenderableEvents(Date.now()).filter((event) => visibleIds.includes(event.id));
  if (!visibleEvents.length) return null;

  const dismissEvent = (event: EventBannerItem) => {
    const expiresAtMs = getExpiryMs(event);
    if (typeof expiresAtMs === "number") {
      window.localStorage.setItem(`${storageKeyPrefix}_${event.id}`, String(expiresAtMs));
    }
    setVisibleIds((prev) => prev.filter((id) => id !== event.id));
  };

  return (
    <div className={cn("border-y border-primary/20 bg-primary/10", className)}>
      <div className="container px-4 py-2">
        <div className="flex flex-col gap-2">
          {visibleEvents.map((event) => {
            const hasTime = event.startsAtIso && event.endsAtIso;
            return (
              <div
                key={event.id}
                className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center"
              >
                <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-4">
                  <div className="font-semibold text-foreground">📣 {event.title}</div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
                    {event.startsAtIso ? (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(event.startsAtIso, timeZone)}
                      </span>
                    ) : null}
                    {hasTime ? (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatTime(event.startsAtIso!, timeZone)}–{formatTime(event.endsAtIso!, timeZone)}
                      </span>
                    ) : null}
                    {event.locationLabel ? <span>{event.locationLabel}</span> : null}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {event.ctaHref ? (
                    event.ctaHref.startsWith("/") ? (
                      <Link to={event.ctaHref} className="text-sm font-semibold text-primary hover:underline">
                        {event.ctaLabel ?? "Details"}
                      </Link>
                    ) : (
                      <a
                        href={event.ctaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        {event.ctaLabel ?? "Details"}
                      </a>
                    )
                  ) : null}
                  <button
                    type="button"
                    onClick={() => dismissEvent(event)}
                    className="inline-flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-background/60 hover:text-foreground"
                    aria-label="Dismiss event banner"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventBanner;
