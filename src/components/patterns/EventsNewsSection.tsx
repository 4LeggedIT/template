/**
 * SHARED PATTERN: do not edit in a site repo.
 * Source: github.com/4LeggedIT/internal-tools
 *   4leggedit-websites/templates-sources/patterns/EventsNewsSection.tsx
 * Change it there, then sync it to every site.
 */
import { Calendar, ExternalLink, Newspaper, Search, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EventBanner from "@/components/patterns/EventBanner";
import FormEmbedModal from "@/components/patterns/FormEmbedModal";
import EventActions from "@/components/patterns/EventActions";
import SocialFollowCta, { type SocialFollowCtaProps } from "@/components/patterns/SocialFollowCta";
import { cn } from "@/lib/utils";
import type { EventRecurrence } from "@/lib/event-recurrence";
import { useEffect, useState, type ReactNode } from "react";
import ContentLink from "./ContentLink";
import { byNewestFirst, formatFallbackDateLabel, getArticleType, getDefaultExpandedGroupCount, getDetailsHref, getEntryContentBlocks, getEventStatus, getGoogleCalendarUrl, getMapsUrl, getRenderableEntries, groupEntriesByMonth, matchesSearchQuery, renderContentBlock, renderHostedVideo, renderVideoEmbed, resolveThumbnailImage, toAbsoluteShareUrl, toBannerEvents, toEventDisplayBuckets } from "./EventsNewsSection.helpers";

// Structurally identical to HomeHighlightSection.tsx's `HomeHighlightItem` — declared locally
// (rather than imported) so this module has no dependency on the highlight-card pattern. Sites
// that don't carry HomeHighlightSection.tsx can still sync this file standalone.
export type EventsNewsHighlightItem = {
  id: string;
  title: string;
  summary?: string;
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  badgeLabel: string;
  badgeIcon: ReactNode;
  sortMs: number;
};

type EventsNewsEntryKind = "event" | "news";
export type EventsNewsArticleType = "external" | "local";
export type EventsNewsCalloutTone = "info" | "success" | "warning";

export type EventsNewsEventRecurrence = EventRecurrence;

export type EventsNewsParagraphBlock = {
  type: "paragraph";
  text: string;
};

export type EventsNewsListBlock = {
  type: "list";
  items: string[];
  ordered?: boolean;
  title?: string;
};

export type EventsNewsQuoteBlock = {
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

export type EventsNewsImageOverride = {
  /** YYYY-MM-DD — matches a recurring event's generated occurrence `startAt`. */
  date: string;
  imageSrc?: string;
  imageAlt?: string;
  images?: EventsNewsImage[];
};

export type EventsNewsVideoEmbed = {
  provider: "facebook";
  /** Full URL to the source Facebook video or Reel post, e.g. https://www.facebook.com/reel/123... */
  url: string;
  /** Defaults to "portrait" for /reel/ URLs, "landscape" otherwise. */
  aspectRatio?: "landscape" | "portrait";
  /** Accessible iframe title; falls back to the entry's title. */
  title?: string;
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
  /**
   * A real mp4 served from the fleet media host (`mediaUrl("<site>", "<name>.mp4")`, see
   * lib/media-host.ts; never a file in this repo) — renders a native `<video>` in place of imageSrc/images/videoEmbed in
   * full/detail views (card thumbnails still use imageSrc as the video's poster). Takes priority
   * over `videoEmbed` when both are set. Prefer this over `videoEmbed` when possible — a self-hosted
   * file always plays, where a Facebook iframe embed can be blocked by Rights Manager depending on
   * the source post's audio track.
   */
  videoSrc?: string;
  /** Defaults to "landscape". Set "portrait" for a vertical Reel-shaped clip (e.g. 720x1280). */
  videoAspectRatio?: "landscape" | "portrait";
  /** Renders in place of imageSrc/images in full/detail views (card thumbnails still use imageSrc). Ignored when videoSrc is set. */
  videoEmbed?: EventsNewsVideoEmbed;
  /**
   * Internal record of where this entry's content originated — a Facebook/Instagram post URL, an
   * external article URL, etc. Editorial reference only, never rendered on the page. Leave unset
   * when the content has no external source (e.g. an org-authored announcement). Pass an array
   * when one entry draws on more than one original source post.
   */
  source?: string | string[];
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
  /** Per-event text for the registration button, e.g. "Get tickets" for a paid event. Falls back to `labels.register`. */
  registrationLabel?: string;
  moreInfoUrl?: string;
  recurrence?: EventsNewsEventRecurrence;
  /** Per-occurrence image swap for recurring events — falls back to imageSrc/imageAlt/images when no entry matches the occurrence date. */
  imageOverrides?: EventsNewsImageOverride[];
  /**
   * Curated, content-author-controlled homepage announcement window — the counterpart to
   * `showFutureEventsBanner`'s automatic "every upcoming event" selection (see that prop below).
   * Pair with `getHomeAnnouncementBannerItems()` to build the `EventBannerItem[]` a site's own
   * homepage banner renders. Shared so the
   * `{ enabled, expiresAtIso }` shape is not duplicated per site.
   */
  homeAnnouncement?: {
    enabled: boolean;
    expiresAtIso: string;
  };
};

export type EventsNewsArticleEntry = EventsNewsBaseEntry & {
  kind: "news";
  publishedAt: string;
  articleType?: EventsNewsArticleType;
};

export type EventsNewsEntry = EventsNewsEventEntry | EventsNewsArticleEntry;

export type EventsNewsRenderableEventEntry = EventsNewsEventEntry & {
  sourceEventId?: string;
  recurrenceInstance?: boolean;
};

export type EventsNewsRenderableEntry = EventsNewsRenderableEventEntry | EventsNewsArticleEntry;
type EventsNewsCardMode = "full" | "index";
export type EventsNewsImageLayout = "auto" | "none" | "top" | "side" | "alternating";

export type EventsNewsAdjacentEntry = {
  id: string;
  title: string;
  dateLabel: string;
  href: string;
};

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
  shareSection?: string;
  openInNewTab?: string;
  searchPlaceholder?: string;
  searchClearAriaLabel?: string;
  searchEmptyMessage?: string;
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
  /**
   * IANA zone (e.g. "America/Los_Angeles") used to render every timed date/time label computed
   * by `formatFallbackDateLabel()` — list-card `dateLabel`s, the share-sheet `eventDetails.date`,
   * and `getAdjacentEntries()`'s Previous/Next labels. Unset (the default) preserves the prior
   * behavior of formatting in whatever zone the rendering runtime defaults to, which differs
   * between the prerender build server and a visitor's browser. Distinct from `futureEventsBannerTimeZone`, which only
   * covers the separate `EventBanner` sub-component; a site using both should normally pass the
   * same value to each. All-day/date-only labels are unaffected — they're always rendered in UTC
   * regardless of this prop, since they're calendar dates with no time-of-day to shift.
   */
  timeZone?: string;
  cardMode?: EventsNewsCardMode;
  /**
   * Controls image placement on list cards, independent of `cardMode`.
   * "auto" (default) preserves the existing contract: image on top only in `cardMode="full"`,
   * hidden in `cardMode="index"`. "side"/"alternating" render the image beside the text
   * (alternating flips sides every other card), matching `HomeHighlightSection`'s featured-card
   * treatment, and work in either `cardMode`.
   */
  imageLayout?: EventsNewsImageLayout;
  /**
   * Replaces the `maxLatest`-then-single-archive-blob structure with sections grouped by
   * calendar month (newest first), each with a visible heading — a scan landmark so a reader
   * looking for "did we already post about X" can jump straight to the right month instead of
   * eyeballing an undifferentiated scroll. Also avoids the flat cutoff silently archiving items
   * out of view sooner just because a given month was unusually active. Default `false` — every
   * existing call site keeps today's `maxLatest`/archive rendering unless it opts in.
   */
  groupByMonth?: boolean;
  /**
   * Minimum number of entries to keep expanded (across the most recent month groups) before
   * folding the rest behind per-month `<details>`. Only used when `groupByMonth` is true.
   * Defaults to 6, matching `maxLatest`'s default, so the first paint looks the same as today.
   */
  defaultExpandedGroupCount?: number;
  /**
   * Renders a lightweight client-side text filter (title/summary/body/dateLabel/locationLabel,
   * case-insensitive substring) above the list. A backstop for the rare case someone remembers
   * exact wording but not roughly when something was posted — `groupByMonth`'s visible headers
   * are what make content findable during normal browsing. Searches the full entry set,
   * including anything folded into a collapsed month or the archive. Default `false`.
   */
  enableSearch?: boolean;
  labels?: EventsNewsSectionLabels;
  socialCta?: SocialFollowCtaProps;
};


const renderEntryCard = (
  entry: EventsNewsRenderableEntry,
  eventDetailsBasePath?: string,
  cardMode: EventsNewsCardMode = "index",
  imageLayout: EventsNewsImageLayout = "auto",
  renderIndex = 0,
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
    shareSection: "Share this event",
    openInNewTab: "Open in new tab",
    searchPlaceholder: "Search events & news…",
    searchClearAriaLabel: "Clear search",
    searchEmptyMessage: "No events or news match your search.",
  },
  now: number = Date.now(),
  timeZone?: string,
) => {
  const detailsHref = getDetailsHref(entry, eventDetailsBasePath);
  const mapsUrl = entry.kind === "event" ? getMapsUrl(entry) : null;
  const calendarUrl = entry.kind === "event" ? getGoogleCalendarUrl(entry) : null;
  const registrationUrl = entry.kind === "event" ? entry.registrationUrl?.trim() : null;
  const moreInfoUrl = entry.kind === "event" ? entry.moreInfoUrl?.trim() : null;
  const shareUrl = entry.kind === "event" && detailsHref ? toAbsoluteShareUrl(detailsHref) : null;
  const contentBlocks = getEntryContentBlocks(entry, labels.highlightsTitle);

  const eventStatus = entry.kind === "event" ? getEventStatus(entry, now) : null;
  const articleType = entry.kind === "news" ? getArticleType(entry) : null;
  const metadataLabel = [
    eventStatus ? `${labels.statusPrefix}${eventStatus}` : null,
    entry.kind === "event" && entry.recurrenceInstance ? labels.recurringBadge : null,
    articleType ? `${articleType} article` : null,
  ]
    .filter(Boolean)
    .join(" • ");
  const isIndexMode = cardMode === "index";
  const resolvedImageLayout: EventsNewsImageLayout =
    imageLayout === "auto" ? (isIndexMode ? "none" : "top") : imageLayout;
  const isSideLayout = resolvedImageLayout === "side" || resolvedImageLayout === "alternating";
  const imageOnRight = resolvedImageLayout === "alternating" && renderIndex % 2 === 1;

  // Card thumbnails link to the entry's own detail page, same as the Details button below —
  // internal routes use <Link>, external hrefs open in a new tab. Renders unlinked when there's
  // no detailsHref to point to.
  const renderImageLink = (children: ReactNode, className: string) => {
    if (!detailsHref) return <div className={className}>{children}</div>;
    return (
      <ContentLink href={detailsHref} className={className} whenUnsafe="children">
        {children}
      </ContentLink>
    );
  };

  // Falls back to the entry's first `images[]` entry when `imageSrc` isn't set — see
  // `resolveThumbnailImage`. Matters for entries/overrides authored with only a gallery.
  const cardThumb = resolveThumbnailImage(entry);

  const topImage =
    resolvedImageLayout === "top" && entry.videoSrc ? (
      <div className="bg-muted p-4">
        {renderHostedVideo(entry.videoSrc, cardThumb.imageSrc, entry.title, entry.videoAspectRatio)}
      </div>
    ) : resolvedImageLayout === "top" && entry.videoEmbed ? (
      <div className="bg-muted p-4">{renderVideoEmbed(entry.videoEmbed, entry.title)}</div>
    ) : resolvedImageLayout === "top" && cardThumb.imageSrc ? (
      renderImageLink(
        <img
          src={cardThumb.imageSrc}
          alt={cardThumb.imageAlt ?? entry.title}
          className="w-full max-h-[520px] object-contain"
          loading="lazy"
        />,
        "block bg-muted",
      )
    ) : null;

  // Side/alternating card thumbnails always use imageSrc, never videoEmbed — same rule as
  // HomeHighlightSection's featured card thumbnail.
  const sideImage =
    isSideLayout && cardThumb.imageSrc
      ? renderImageLink(
          <img
            src={cardThumb.imageSrc}
            alt={cardThumb.imageAlt ?? entry.title}
            className="h-full w-full object-contain"
            loading="lazy"
          />,
          "block h-40 bg-muted sm:h-full",
        )
      : null;

  const cardBody = (
    <>
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
          {entry.dateLabel ?? formatFallbackDateLabel(entry, timeZone)}
          {entry.kind === "event" && entry.locationLabel ? ` • ${entry.locationLabel}` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {entry.summary ? <p className="text-sm text-muted-foreground">{entry.summary}</p> : null}
        {!isIndexMode && contentBlocks.length ? <div className="space-y-4">{contentBlocks.map((block, idx) => renderContentBlock(entry.id, block, idx))}</div> : null}
        <div className="flex flex-wrap items-center gap-3">
          {detailsHref ? (
            <Button asChild size="sm" variant="outline">
              <ContentLink href={detailsHref}>{labels.detailsLabel}</ContentLink>
            </Button>
          ) : null}
          {!isIndexMode && entry.kind === "event" && registrationUrl && !shareUrl && eventStatus !== "past" ? (
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
            <ContentLink
              href={moreInfoUrl}
              external
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              {labels.moreInfo}
              <ExternalLink className="h-3.5 w-3.5" />
            </ContentLink>
          ) : null}
          {!isIndexMode && entry.kind === "event" && shareUrl ? (
            <EventActions
              url={shareUrl}
              title={entry.calendarTitle ?? entry.title}
              text={entry.summary}
              mapsUrl={mapsUrl ?? undefined}
              calendarUrl={calendarUrl ?? undefined}
              eventDetails={{
                date: entry.dateLabel ?? formatFallbackDateLabel(entry, timeZone),
                location: entry.locationLabel,
              }}
              registration={
                registrationUrl && eventStatus !== "past"
                  ? {
                      url: registrationUrl,
                      label: entry.registrationLabel,
                      formTitle: `${entry.title} Registration`,
                    }
                  : undefined
              }
              channels={["maps", "calendar", "whatsapp", "facebook", "copy-url", "copy-message"]}
              labels={{
                register: labels.register,
                openInNewTab: labels.openInNewTab,
                shareSection: labels.shareSection,
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
    </>
  );

  if (isSideLayout && sideImage) {
    return (
      <Card key={entry.id} className="overflow-hidden border-border/80">
        <div
          className={cn("grid gap-0", imageOnRight ? "sm:grid-cols-[1fr_200px]" : "sm:grid-cols-[200px_1fr]")}
        >
          {imageOnRight ? null : sideImage}
          <div>{cardBody}</div>
          {imageOnRight ? sideImage : null}
        </div>
      </Card>
    );
  }

  return (
    <Card key={entry.id} className="overflow-hidden border-border/80">
      {topImage}
      {cardBody}
    </Card>
  );
};

const EventsNewsSection = ({
  title,
  description,
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
  timeZone,
  cardMode = "index",
  imageLayout = "auto",
  groupByMonth = false,
  defaultExpandedGroupCount = 6,
  enableSearch = false,
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
    shareSection: labels.shareSection ?? "Share this event",
    openInNewTab: labels.openInNewTab ?? "Open in new tab",
    searchPlaceholder: labels.searchPlaceholder ?? "Search events & news…",
    searchClearAriaLabel: labels.searchClearAriaLabel ?? "Clear search",
    searchEmptyMessage: labels.searchEmptyMessage ?? "No events or news match your search.",
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    // Deliberately deferred to post-hydration: this page is statically
    // prerendered, so computing event status (upcoming/ongoing/past) from
    // Date.now() during render would compare the build-time snapshot against
    // the client's real time at view, desyncing server and client output.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
  }, []);
  // Until mounted, treat every event as not-yet-past so the first render
  // (server and client) always agrees — real status is applied right after hydration.
  const safeNow = now ?? Number.NEGATIVE_INFINITY;

  const renderableEntries = getRenderableEntries(entries);
  const { activeEvents, archivedEvents } = toEventDisplayBuckets(renderableEntries, safeNow);
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
    ? toBannerEvents(renderableEntries, futureEventsBannerDefaultCtaHref, eventDetailsBasePath, resolvedLabels.detailsLabel, safeNow)
    : [];

  // Unified pool backing both `groupByMonth` and `enableSearch` — everything not pinned as
  // `featured`, past events included, so a folded-away month or the old single archive blob
  // can't hide a match from search. Cheap to compute unconditionally; only rendered when one of
  // those props is on.
  const combinedNonFeatured = [...nonFeatured, ...archivedEvents].sort(byNewestFirst);
  const monthGroups = groupByMonth ? groupEntriesByMonth(combinedNonFeatured) : [];
  const expandedGroupCount = getDefaultExpandedGroupCount(monthGroups, defaultExpandedGroupCount);

  const trimmedQuery = enableSearch ? searchQuery.trim().toLowerCase() : "";
  const isSearching = trimmedQuery.length > 0;
  const searchPool = featured ? [featured, ...combinedNonFeatured] : combinedNonFeatured;
  const searchResults = isSearching
    ? searchPool.filter((entry) => matchesSearchQuery(entry, trimmedQuery))
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
      {title || description ? (
        <div className="mb-6">
          {title ? <h3 className="text-xl font-semibold tracking-tight">{title}</h3> : null}
          {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
        </div>
      ) : null}

      {enableSearch ? (
        <div className="relative mb-6">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={resolvedLabels.searchPlaceholder}
            aria-label={resolvedLabels.searchPlaceholder}
            className="pl-9 pr-9"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label={resolvedLabels.searchClearAriaLabel}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      ) : null}

      {isSearching ? (
        searchResults.length ? (
          <div className="space-y-6">
            {searchResults.map((entry, index) =>
              renderEntryCard(entry, eventDetailsBasePath, cardMode, imageLayout, index, resolvedLabels, safeNow, timeZone),
            )}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-6 text-sm text-muted-foreground">{resolvedLabels.searchEmptyMessage}</CardContent>
          </Card>
        )
      ) : (
        <>
          {featured ? (
            <div className="mb-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{resolvedLabels.featuredLabel}</p>
              {renderEntryCard(featured, eventDetailsBasePath, cardMode, imageLayout, 0, resolvedLabels, safeNow, timeZone)}
            </div>
          ) : null}

          {groupByMonth ? (
            monthGroups.length ? (
              <div className="space-y-4">
                {monthGroups.map((group, groupIndex) =>
                  groupIndex < expandedGroupCount ? (
                    <div key={group.key}>
                      <h4 className="mb-3 text-sm font-semibold text-foreground">{group.label}</h4>
                      <div className="space-y-6">
                        {group.entries.map((entry, index) =>
                          renderEntryCard(entry, eventDetailsBasePath, cardMode, imageLayout, index, resolvedLabels, safeNow, timeZone),
                        )}
                      </div>
                    </div>
                  ) : (
                    <details key={group.key} className="rounded-xl border border-border bg-background/60 p-4">
                      <summary className="cursor-pointer list-none text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
                        {group.label} ({group.entries.length})
                      </summary>
                      <div className="mt-4 space-y-4">
                        {group.entries.map((entry, index) =>
                          renderEntryCard(entry, eventDetailsBasePath, cardMode, imageLayout, index, resolvedLabels, safeNow, timeZone),
                        )}
                      </div>
                    </details>
                  ),
                )}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-6 text-sm text-muted-foreground">{emptyMessage}</CardContent>
              </Card>
            )
          ) : (
            <>
              {latest.length ? (
                <div className="space-y-6">
                  {latest.map((entry, index) =>
                    renderEntryCard(entry, eventDetailsBasePath, cardMode, imageLayout, index, resolvedLabels, safeNow, timeZone),
                  )}
                </div>
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
                  <div className="mt-4 space-y-4">
                    {archive.map((entry, index) =>
                      renderEntryCard(entry, eventDetailsBasePath, cardMode, imageLayout, index, resolvedLabels, safeNow, timeZone),
                    )}
                  </div>
                </details>
              ) : null}
            </>
          )}
        </>
      )}

      {socialCta?.links?.length ? (
        <SocialFollowCta title={socialCta.title} description={socialCta.description} links={socialCta.links} />
      ) : null}
    </section>
  );
};

export default EventsNewsSection;

export type { EventsNewsMonthGroup, GoogleCalendarUrlOptions } from "./EventsNewsSection.helpers";
