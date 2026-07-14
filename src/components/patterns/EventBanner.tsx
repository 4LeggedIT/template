import { useEffect, useRef, useState } from "react";
import { Calendar, Clock, X } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { type EventRecurrence, getNextOccurrence } from "@/lib/event-recurrence";

export type EventBannerRecurrence = EventRecurrence;

export type EventBannerItem = {
  id: string;
  title: string;
  startsAtIso?: string;
  endsAtIso?: string;
  expiresAtIso?: string;
  allDay?: boolean;
  recurrence?: EventBannerRecurrence;
  locationLabel?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type EventBannerLabels = {
  dismissAriaLabel?: string;
  detailsFallback?: string;
};

type EventBannerProps = {
  events: EventBannerItem[];
  storageKeyPrefix?: string;
  maxVisible?: number;
  timeZone?: string;
  className?: string;
  labels?: EventBannerLabels;
};

const DEFAULT_TIME_ZONE = "America/Los_Angeles";

const toMs = (iso?: string) => {
  if (!iso) return null;
  const value = Date.parse(iso);
  return Number.isFinite(value) ? value : null;
};

const getRecurringEffectiveEvent = (event: EventBannerItem, nowMs: number): EventBannerItem | null => {
  const recurrence = event.recurrence;
  if (!recurrence || !event.startsAtIso || !event.endsAtIso) return event;

  const occurrence = getNextOccurrence(recurrence, event.startsAtIso, event.endsAtIso, nowMs);
  if (!occurrence) return null;

  return {
    ...event,
    startsAtIso: occurrence.startAtIso,
    endsAtIso: occurrence.endAtIso,
    expiresAtIso: occurrence.endAtIso,
  };
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

const getRenderableEvents = (events: EventBannerItem[], nowMs: number) =>
  events
    .map((event) => getRecurringEffectiveEvent(event, nowMs))
    .filter((event): event is EventBannerItem => Boolean(event))
    .sort((a, b) => (toMs(a.startsAtIso ?? a.expiresAtIso) ?? 0) - (toMs(b.startsAtIso ?? b.expiresAtIso) ?? 0));

const EventBanner = ({
  events,
  storageKeyPrefix = "template_event_banner_dismissed_until",
  maxVisible = 2,
  timeZone = DEFAULT_TIME_ZONE,
  className,
  labels = {},
}: EventBannerProps) => {
  const {
    dismissAriaLabel = "Dismiss event banner",
    detailsFallback = "Details",
  } = labels;
  const [visibleIds, setVisibleIds] = useState<string[]>(() => {
    const now = Date.now();
    return getRenderableEvents(events, now)
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
      const renderableEvents = getRenderableEvents(events, now);

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

  const visibleEvents = getRenderableEvents(events, Date.now()).filter((event) => visibleIds.includes(event.id));
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
            const hasTime = !event.allDay && event.startsAtIso && event.endsAtIso;
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
                        {event.ctaLabel ?? detailsFallback}
                      </Link>
                    ) : (
                      <a
                        href={event.ctaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        {event.ctaLabel ?? detailsFallback}
                      </a>
                    )
                  ) : null}
                  <button
                    type="button"
                    onClick={() => dismissEvent(event)}
                    className="inline-flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-background/60 hover:text-foreground"
                    aria-label={dismissAriaLabel}
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
