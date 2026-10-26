import { useState } from "react";
import MediaCarouselTile, { type MediaCarouselTileItem } from "@/components/patterns/MediaCarouselTile";
import { cn } from "@/lib/utils";

/**
 * A plain list of missing dogs: a card grid with status filtering, field labels and an empty state.
 * The companion to `FoundListingsSection` (separate on purpose: a site renders either, both or
 * neither). Like it, this is list-only: it does NOT render any page-level "help people" content
 * (what-to-do checklists, process steps, contact call-to-action buttons). That stays page-local
 * content around the list. What it does render is the notice's own facts, supplied by the caller:
 * images (a flyer, photos) shown by `MediaCarouselTile` that open full-size, a last-seen line, a prominent safety line and one optional action
 * link (for example a text-a-sighting `sms:` link with the number in its label).
 *
 * When the original post or another source exists, `sourceUrl` adds a "view original post" link on the
 * card (http(s) only, new tab); no `// Source:` comment is needed. Leave it unset to link nowhere. The card also prints `reportedAtISO` (the date that starts the expiry clock). Every string is passed in by the caller, so the pattern has no i18n or router
 * dependency.
 */

/** `found` means the dog is home: flip the status instead of deleting the notice. */
export type MissingListingStatus = "missing" | "found" | "archived";

/** How long a `missing` notice stays visible after `reportedAtISO`. Sites can override it per list. */
export const DEFAULT_MISSING_LISTING_EXPIRY_DAYS = 60;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface MissingListingMedia {
  src: string;
  alt?: string;
  /** Where a click on the image goes; defaults to `src` so it opens full-size in a new tab. */
  href?: string;
  /** The featured image shows first; the rest follow in the given order. */
  featured?: boolean;
}

export interface MissingListingAction {
  /** Final, already-localized button text, for example "Text a sighting to (555) 555-0100". */
  label: string;
  /** `sms:`, `tel:`, `mailto:` or `http(s):` only; anything else is dropped. */
  href: string;
}

export interface MissingListing {
  /** React key and the image aria/alt fallback; not shown. */
  id: string;
  status: MissingListingStatus;
  name?: string;
  /**
   * Required ISO date (`YYYY-MM-DD`) the notice was posted (the Facebook post date unless the client says
   * otherwise). It is printed on the card (formatted with the `dateLocale` prop) and starts the expiry
   * clock (see `expireAfterDays`), so the date people see is the date the notice expires from.
   */
  reportedAtISO: string;
  /**
   * Optional ISO date that replaces `reportedAtISO + expireAfterDays` for this notice, to keep a long
   * search visible (later date) or retire one early (earlier date). The notice hides after that day ends.
   */
  expiresAt?: string;
  /** Where the dog was last seen, as area-level text rather than an exact address. */
  area?: string;
  /** Prominent safety line, for example "Very fearful. Please do not chase." */
  safetyNote?: string;
  notes?: string;
  /** Any number of images (flyer, photos): one shows as a plain image, two or more get prev/next arrows and a count badge. */
  media?: MissingListingMedia[];
  sightingsAction?: MissingListingAction;
  /** Link to the original post (Facebook or another source), http(s) only; anything else is dropped. Leave unset when there is none. */
  sourceUrl?: string;
  /** Optional name of the source, for example "Facebook", appended to the link text. */
  sourceName?: string;
}

export type MissingListingsSectionLabels = {
  imageFallbackAltPrefix?: string;
  /** Generic card heading: "<name> (<noticeTitle>)", or just this when the dog has no name. */
  noticeTitle?: string;
  fieldReported?: string;
  fieldArea?: string;
  viewSourceLabel?: string;
};

type MissingListingsSectionProps = {
  title?: string;
  description?: string;
  className?: string;
  listings: MissingListing[];
  noticesTitle?: string;
  statusFilter?: MissingListingStatus[];
  showFound?: boolean;
  showArchived?: boolean;
  /**
   * Days a `missing` notice stays visible after `reportedAtISO` before it is hidden (not deleted).
   * Expiry cannot be switched off; the default is `DEFAULT_MISSING_LISTING_EXPIRY_DAYS` (60). A site
   * overrides it with a positive whole number. A listing's own `expiresAt` wins over it.
   */
  expireAfterDays?: number;
  /** BCP 47 locale used to print `reportedAtISO` (default "en-US"). */
  dateLocale?: string;
  emptyMessage?: string;
  labels?: MissingListingsSectionLabels;
};

const parseISODate = (value: string | undefined): number => (value ? Date.parse(`${value.slice(0, 10)}T00:00:00Z`) : Number.NaN);

/** True when a `missing` notice is past its expiry. Unparseable dates never expire (they stay visible). */
const isMissingListingExpired = (listing: MissingListing, expireAfterDays: number, now: number): boolean => {
  const explicitEnd = parseISODate(listing.expiresAt);
  const endMs = Number.isFinite(explicitEnd)
    ? explicitEnd + DAY_MS
    : parseISODate(listing.reportedAtISO) + expireAfterDays * DAY_MS;
  return Number.isFinite(endMs) && now >= endMs;
};

const formatReportedDate = (iso: string, locale: string): string | undefined => {
  const ms = parseISODate(iso);
  return Number.isFinite(ms) ? new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(ms)) : undefined;
};

const SAFE_ACTION_HREF = /^(sms:|tel:|mailto:|https?:\/\/)/i;

const safeActionHref = (href: string | undefined): string | undefined => {
  const trimmed = href?.trim();
  return trimmed && SAFE_ACTION_HREF.test(trimmed) ? trimmed : undefined;
};

const openFullSize = (href: string) => {
  window.open(href, "_blank", "noopener,noreferrer");
};

const MissingListingsSection = ({
  title,
  description,
  className,
  listings,
  noticesTitle = "Current Missing Dog Notices",
  statusFilter,
  showFound = false,
  showArchived = false,
  expireAfterDays = DEFAULT_MISSING_LISTING_EXPIRY_DAYS,
  dateLocale = "en-US",
  emptyMessage = "No missing dog notices are posted right now.",
  labels = {},
}: MissingListingsSectionProps) => {
  const {
    imageFallbackAltPrefix = "Missing dog image for ",
    noticeTitle = "Missing Dog",
    fieldReported = "Posted:",
    fieldArea = "Last seen:",
    viewSourceLabel = "View original post",
  } = labels;
  const allowedStatuses = statusFilter ?? [
    "missing",
    ...(showFound ? (["found"] as MissingListingStatus[]) : []),
    ...(showArchived ? (["archived"] as MissingListingStatus[]) : []),
  ];

  const [now] = useState(() => Date.now());
  const days =
    Number.isFinite(expireAfterDays) && expireAfterDays > 0 ? expireAfterDays : DEFAULT_MISSING_LISTING_EXPIRY_DAYS;
  const visibleListings = listings.filter(
    (listing) =>
      allowedStatuses.includes(listing.status) &&
      !(listing.status === "missing" && isMissingListingExpired(listing, days, now)),
  );

  return (
    <section className={cn("space-y-10", className)}>
      {title || description ? (
        <div className="rounded-2xl bg-linear-to-br from-primary/5 to-primary/10 px-6 py-10 text-center">
          {title ? <h2 className="text-3xl font-bold text-foreground md:text-4xl">{title}</h2> : null}
          {description ? <p className="mx-auto mt-3 max-w-3xl text-muted-foreground">{description}</p> : null}
        </div>
      ) : null}

      <div>
        <h3 className="mb-5 text-2xl font-bold">{noticesTitle}</h3>
        {visibleListings.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {visibleListings.map((listing) => {
              const label = listing.name ?? listing.id;
              const media = listing.media ?? [];
              const featuredMedia = media.find((item) => item.featured) ?? media[0];
              const orderedMedia = featuredMedia ? [featuredMedia, ...media.filter((item) => item !== featuredMedia)] : [];
              const tileMedia: MediaCarouselTileItem[] = orderedMedia.map((item, index) => ({
                id: `${listing.id}-${index}`,
                kind: "photo",
                src: item.src,
                label: item.alt ?? `${imageFallbackAltPrefix}${label}`,
              }));
              const actionHref = safeActionHref(listing.sightingsAction?.href);
              const sourceHref = safeActionHref(listing.sourceUrl);
              const reportedLabel = formatReportedDate(listing.reportedAtISO, dateLocale);

              return (
                <article key={listing.id} className="overflow-hidden rounded-xl border bg-card shadow-xs">
                  {tileMedia.length ? (
                    <MediaCarouselTile
                      media={tileMedia}
                      fit="contain"
                      onPhotoClick={(item) => {
                        const index = tileMedia.findIndex((entry) => entry.id === item.id);
                        openFullSize(orderedMedia[index]?.href ?? item.src);
                      }}
                    />
                  ) : null}
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-foreground">
                      {listing.name ? `${listing.name} (${noticeTitle})` : noticeTitle}
                    </h4>
                    {listing.safetyNote ? (
                      <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">
                        {listing.safetyNote}
                      </p>
                    ) : null}
                    <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                      {reportedLabel ? (
                        <li>
                          <strong className="text-foreground">{fieldReported}</strong> {reportedLabel}
                        </li>
                      ) : null}
                      {listing.area ? (
                        <li>
                          <strong className="text-foreground">{fieldArea}</strong> {listing.area}
                        </li>
                      ) : null}
                    </ul>
                    {listing.notes ? <p className="mt-3 text-sm text-muted-foreground">{listing.notes}</p> : null}
                    {sourceHref && /^https?:\/\//i.test(sourceHref) ? (
                      <a
                        href={sourceHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 block text-sm font-medium text-primary underline underline-offset-2"
                      >
                        {listing.sourceName ? `${viewSourceLabel} (${listing.sourceName})` : viewSourceLabel}
                      </a>
                    ) : null}
                    {listing.sightingsAction && actionHref ? (
                      <a
                        href={actionHref}
                        className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 hover:bg-primary/90"
                      >
                        {listing.sightingsAction.label}
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">{emptyMessage}</div>
        )}
      </div>
    </section>
  );
};

export default MissingListingsSection;
