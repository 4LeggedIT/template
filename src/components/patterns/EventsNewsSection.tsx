import { Calendar, ExternalLink, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EventBanner, { type EventBannerItem } from "@/components/patterns/EventBanner";
import FormEmbedModal from "@/components/patterns/FormEmbedModal";
import EventActions from "@/components/patterns/EventActions";
import SocialFollowCta, { type SocialFollowCtaProps } from "@/components/patterns/SocialFollowCta";
import { cn } from "@/lib/utils";
import { type EventRecurrence, buildRrule, getOccurrenceDates } from "@/lib/event-recurrence";

type EventsNewsEntryKind = "event" | "news";
type EventsNewsArticleType = "external" | "local";
type EventsNewsCalloutTone = "info" | "success" | "warning";

export type EventsNewsEventRecurrence = EventRecurrence;

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

export type EventsNewsImage = {
  src: string;
  alt?: string;
};

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
  images?: EventsNewsImage[];
  dateLabel?: string;
  highlights?: string[];
  highlightOnHome?: boolean;
};

export type EventsNewsEventEntry = EventsNewsBaseEntry & {
  kind: "event";
  startAt: string;
  endAt?: string;
  startAtIso?: string;
  endAtIso?: string;
  allDay?: boolean;
  locationLabel?: string;
  locationAddress?: string;
  calendarTitle?: string;
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

export type EventsNewsSectionLabels = {
  eventBadge?: string;
  newsBadge?: string;
  detailsLabel?: string;
  openInMaps?: string;
  addToCalendar?: string;
  register?: string;
  moreInfo?: string;
  featuredLabel?: string;
  recurringBadge?: string;
  statusPrefix?: string;
  highlightsTitle?: string;
  shareOpenInMaps?: string;
  shareAddToCalendar?: string;
  shareWhatsapp?: string;
  shareFacebook?: string;
  shareX?: string;
  shareEmail?: string;
  shareCopyEvent?: string;
  share?: string;
  shareCopied?: string;
  shareShared?: string;
};

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
  labels?: EventsNewsSectionLabels;
  socialCta?: SocialFollowCtaProps;
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

const formatYmdUtc = (date: Date) => {
  const y = date.getUTCFullYear();
  const m = pad2(date.getUTCMonth() + 1);
  const d = pad2(date.getUTCDate());
  return `${y}-${m}-${d}`;
};

const toUtcDayMs = (date: Date) => Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

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
  const recurrence = entry.recurrence;
  if (!recurrence) return [entry];

  const occurrenceDates = getOccurrenceDates(recurrence, entry.startAt, rangeStart, rangeEnd);
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

  return entries.flatMap((entry): EventsNewsRenderableEntry[] => {
    if (entry.kind === "news") return [entry];
    return expandEventEntry(entry, rangeStart, rangeEnd);
  });
};

export const getSortMs = (entry: EventsNewsRenderableEntry) => {
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

const toDetailsPath = (id: string, basePath: string) => {
  const trimmedBase = basePath.trim();
  if (!trimmedBase) return null;
  const normalizedBase = trimmedBase === "/" ? "" : trimmedBase.replace(/\/+$/, "");
  const slug = normalizeSlugToken(id);
  if (!slug) return null;
  return `${normalizedBase}/${slug}`;
};

const toEventDetailsHref = (entry: EventsNewsRenderableEventEntry, basePath: string) =>
  toDetailsPath(entry.sourceEventId ?? entry.id, basePath);

const hasLocalEventDetailContent = (entry: EventsNewsRenderableEventEntry) =>
  Boolean(
    entry.body?.trim() ||
      entry.contentBlocks?.length ||
      entry.highlights?.length ||
      entry.imageSrc ||
      entry.imageAlt ||
      entry.images?.length,
  );

const getDetailsHref = (entry: EventsNewsRenderableEntry, eventDetailsBasePath?: string) => {
  const href = entry.href?.trim();
  if (href) return href;
  if (!eventDetailsBasePath) return null;
  if (entry.kind === "event") {
    if (!hasLocalEventDetailContent(entry)) return null;
    return toEventDetailsHref(entry, eventDetailsBasePath);
  }
  // Local news articles always have a prerendered /news/{id} detail page
  // (see news-entry-routes.mjs), so unlike events they don't need a content gate.
  return toDetailsPath(entry.id, eventDetailsBasePath);
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

export const formatFallbackDateLabel = (entry: EventsNewsRenderableEntry) => {
  if (entry.kind === "event") {
    if (entry.allDay) {
      const ymd = parseYmdUtc(entry.startAt);
      if (ymd) return humanDateFormatter.format(ymd);
    }

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

export const byNewestFirst = (left: EventsNewsRenderableEntry, right: EventsNewsRenderableEntry) =>
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
  detailsLabel = "Details",
): EventBannerItem[] => {
  return getBannerUpcomingEvents(entries)
    .map((entry) => {
      const detailsHref = getDetailsHref(entry, eventDetailsBasePath) ?? defaultCtaHref;
      return {
        id: `event-banner-${entry.id}`,
        title: entry.calendarTitle ?? entry.title,
        startsAtIso: entry.startAtIso ?? `${entry.startAt}T12:00:00Z`,
        endsAtIso: entry.endAtIso ?? (entry.endAt ? `${entry.endAt}T23:59:59Z` : undefined),
        locationLabel: entry.locationLabel,
        ctaHref: detailsHref,
        ctaLabel: detailsHref ? detailsLabel : undefined,
      };
    });
};

export const getMapsUrl = (entry: EventsNewsRenderableEventEntry) => {
  if (entry.mapsUrl) return entry.mapsUrl;
  const query = entry.locationAddress ?? entry.locationLabel;
  if (!query) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

export const getGoogleCalendarUrl = (entry: EventsNewsRenderableEventEntry) => {
  const details = [entry.summary, entry.body]
    .filter(Boolean)
    .join("\n\n");

  let dates: string | null = null;
  if (entry.allDay) {
    const start = parseYmdUtc(entry.startAt);
    const endInclusive = parseYmdUtc(entry.endAt ?? entry.startAt);
    if (!start || !endInclusive) return null;
    const endExclusive = addDaysUtc(endInclusive, 1);
    dates = `${toUtcDateForGoogle(start)}/${toUtcDateForGoogle(endExclusive)}`;
  } else if (entry.startAtIso) {
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

  const calLocation = entry.locationAddress ?? entry.locationLabel;
  const rrule = entry.recurrence ? buildRrule(entry.recurrence) : null;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: entry.calendarTitle ?? entry.title,
    dates,
    ...(details ? { details } : {}),
    ...(calLocation ? { location: calLocation } : {}),
    ...(rrule ? { recur: rrule } : {}),
    sf: "true",
    output: "xml",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const getEntryContentBlocks = (entry: EventsNewsRenderableEntry, highlightsTitle: string): EventsNewsContentBlock[] => {
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
      ? [{ type: "list", items: entry.highlights, title: highlightsTitle }]
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

export const renderContentBlock = (entryId: string, block: EventsNewsContentBlock, index: number) => {
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
  cardMode: EventsNewsCardMode = "index",
  labels: Required<EventsNewsSectionLabels> = {
    eventBadge: "Event",
    newsBadge: "News",
    detailsLabel: "Details",
    openInMaps: "Open in Maps",
    addToCalendar: "Add to Google Calendar",
    register: "Register",
    moreInfo: "More info",
    featuredLabel: "Featured update",
    recurringBadge: "Recurring",
    statusPrefix: "Status: ",
    highlightsTitle: "Highlights",
    shareOpenInMaps: "Open in Maps",
    shareAddToCalendar: "Add to Calendar",
    shareWhatsapp: "WhatsApp",
    shareFacebook: "Facebook",
    shareX: "X",
    shareEmail: "Email",
    shareCopyEvent: "Copy event",
    share: "Share",
    shareCopied: "Copied",
    shareShared: "Shared",
  },
) => {
  const detailsHref = getDetailsHref(entry, eventDetailsBasePath);
  const mapsUrl = entry.kind === "event" ? getMapsUrl(entry) : null;
  const calendarUrl = entry.kind === "event" ? getGoogleCalendarUrl(entry) : null;
  const registrationUrl = entry.kind === "event" ? entry.registrationUrl?.trim() : null;
  const moreInfoUrl = entry.kind === "event" ? entry.moreInfoUrl?.trim() : null;
  const shareUrl = entry.kind === "event" && detailsHref ? toAbsoluteShareUrl(detailsHref) : null;
  const contentBlocks = getEntryContentBlocks(entry, labels.highlightsTitle);

  const eventStatus = entry.kind === "event" ? getEventStatus(entry) : null;
  const articleType = entry.kind === "news" ? getArticleType(entry) : null;
  const metadataLabel = [
    eventStatus ? `${labels.statusPrefix}${eventStatus}` : null,
    entry.kind === "event" && entry.recurrenceInstance ? labels.recurringBadge : null,
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
            <span>{entry.kind === "event" ? labels.eventBadge : labels.newsBadge}</span>
          </div>
        </div>
        {metadataLabel ? <p className="text-xs text-muted-foreground">{metadataLabel}</p> : null}
        <CardTitle className="text-xl">
          {entry.kind === "event" ? (entry.calendarTitle ?? entry.title) : entry.title}
        </CardTitle>
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
                <Link to={detailsHref}>{labels.detailsLabel}</Link>
              </Button>
            ) : (
              <Button asChild size="sm" variant="outline">
                <a href={detailsHref} target="_blank" rel="noopener noreferrer">
                  {labels.detailsLabel}
                </a>
              </Button>
            )
          ) : null}
          {!isIndexMode && entry.kind === "event" && registrationUrl ? (
            <FormEmbedModal
              formUrl={registrationUrl}
              title={`${entry.title} Registration`}
              asButton={false}
              triggerClassName="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <>
                {labels.register}
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
              {labels.moreInfo}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
          {!isIndexMode && entry.kind === "event" && shareUrl ? (
            <EventActions
              url={shareUrl}
              title={entry.calendarTitle ?? entry.title}
              text={entry.summary}
              mapsUrl={mapsUrl ?? undefined}
              calendarUrl={calendarUrl ?? undefined}
              eventDetails={{
                date: entry.dateLabel ?? formatFallbackDateLabel(entry),
                location: entry.locationLabel,
              }}
              channels={["maps", "calendar", "whatsapp", "facebook", "copy-url", "copy-message"]}
              labels={{
                openInMaps: labels.shareOpenInMaps,
                addToCalendar: labels.shareAddToCalendar,
                whatsapp: labels.shareWhatsapp,
                facebook: labels.shareFacebook,
                x: labels.shareX,
                email: labels.shareEmail,
                copyMessage: labels.shareCopyEvent,
                share: labels.share,
                copied: labels.shareCopied,
                shared: labels.shareShared,
              }}
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
  cardMode = "index",
  labels = {},
  socialCta,
}: EventsNewsSectionProps) => {
  const resolvedLabels: Required<EventsNewsSectionLabels> = {
    eventBadge: labels.eventBadge ?? "Event",
    newsBadge: labels.newsBadge ?? "News",
    detailsLabel: labels.detailsLabel ?? "Details",
    openInMaps: labels.openInMaps ?? "Open in Maps",
    addToCalendar: labels.addToCalendar ?? "Add to Google Calendar",
    register: labels.register ?? "Register",
    moreInfo: labels.moreInfo ?? "More info",
    featuredLabel: labels.featuredLabel ?? "Featured update",
    recurringBadge: labels.recurringBadge ?? "Recurring",
    statusPrefix: labels.statusPrefix ?? "Status: ",
    highlightsTitle: labels.highlightsTitle ?? "Highlights",
    shareOpenInMaps: labels.shareOpenInMaps ?? "Open in Maps",
    shareAddToCalendar: labels.shareAddToCalendar ?? "Add to Calendar",
    shareWhatsapp: labels.shareWhatsapp ?? "WhatsApp",
    shareFacebook: labels.shareFacebook ?? "Facebook",
    shareX: labels.shareX ?? "X",
    shareEmail: labels.shareEmail ?? "Email",
    shareCopyEvent: labels.shareCopyEvent ?? "Copy event",
    share: labels.share ?? "Share",
    shareCopied: labels.shareCopied ?? "Copied",
    shareShared: labels.shareShared ?? "Shared",
  };
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
    ? toBannerEvents(renderableEntries, futureEventsBannerDefaultCtaHref, eventDetailsBasePath, resolvedLabels.detailsLabel)
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
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{resolvedLabels.featuredLabel}</p>
          {renderEntryCard(featured, eventDetailsBasePath, cardMode, resolvedLabels)}
        </div>
      ) : null}

      {latest.length ? (
        <div className="space-y-6">{latest.map((entry) => renderEntryCard(entry, eventDetailsBasePath, cardMode, resolvedLabels))}</div>
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
          <div className="mt-4 space-y-4">{archive.map((entry) => renderEntryCard(entry, eventDetailsBasePath, cardMode, resolvedLabels))}</div>
        </details>
      ) : null}

      {socialCta?.links?.length ? (
        <SocialFollowCta title={socialCta.title} description={socialCta.description} links={socialCta.links} />
      ) : null}
    </section>
  );
};

export default EventsNewsSection;
