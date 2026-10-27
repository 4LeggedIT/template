import { useState } from "react";
import MediaCarouselTile, { type MediaCarouselTileItem } from "@/components/patterns/MediaCarouselTile";
import { cn } from "@/lib/utils";

/**
 * A plain list of found dogs: a card grid with status/mode filtering, field labels and an empty
 * state. Each notice can carry several images, shown by `MediaCarouselTile`. Nothing else. It deliberately does NOT render any "help people" content (keep-them-safe
 * warnings, notice checklists, reunification steps, submit-a-notice buttons, trapping advice):
 * that belongs to the site that actually offers those services (Rovers Return Dog Rescue), as
 * page-local content around this list. Every string is passed in by the caller, so the pattern
 * has no i18n or router dependency.
 */

export type FoundListingsMode = "local" | "external" | "hybrid";
export type FoundListingStatus = "open" | "reunited" | "archived" | "hold";
export type FoundSourceType = "local" | "external";
export type FoundSpecies = "dog" | "cat" | "other";

/** How long an `open`/`hold` notice stays visible after `foundAtISO`. Sites can override it per list. */
export const DEFAULT_FOUND_LISTING_EXPIRY_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface FoundListingSource {
  type: FoundSourceType;
  name?: string;
  /** When set, the card shows a "view source listing" link to it. Leave unset to link nowhere. */
  url?: string;
  externalId?: string;
}

export interface FoundListingLocation {
  city?: string;
  state?: string;
  postalCode?: string;
  crossStreets?: string;
  areaLabel?: string;
  latitude?: number;
  longitude?: number;
}

export interface FoundListingPetProfile {
  name?: string;
  species?: FoundSpecies;
  gender?: string;
  ageEstimate?: string;
  size?: string;
  color?: string;
  breedEstimate?: string;
  markings?: string;
  microchipStatus?: string;
}

export interface FoundListingMedia {
  id: string;
  src: string;
  alt?: string;
  href?: string;
  /** The featured image shows first; the rest follow in the given order. */
  featured?: boolean;
}

export interface FoundListing {
  /** React key and the image aria/alt fallback; not shown as a notice number. */
  id: string;
  source: FoundListingSource;
  status: FoundListingStatus;
  /** Display text printed under the "found date" label; pass a locale-formatted string. */
  foundAt?: string;
  /**
   * Required ISO date (`YYYY-MM-DD`) the notice was posted (the Facebook post date unless the client says
   * otherwise). It is printed on the card as the posted date (formatted with the `dateLocale` prop) and
   * starts the expiry clock (see `expireAfterDays`), so the date people see is the date the notice expires from.
   */
  foundAtISO: string;
  publishedAt?: string;
  updatedAt?: string;
  /**
   * Optional ISO date that replaces `foundAtISO + expireAfterDays` for this notice, to keep a long
   * case visible (later date) or retire one early (earlier date). The notice hides after this day ends.
   */
  expiresAt?: string;
  location?: FoundListingLocation;
  pet?: FoundListingPetProfile;
  notes: string;
  /** Any number of images: one shows as a plain image, two or more get prev/next arrows and a count badge. */
  media: FoundListingMedia[];
}

export type FoundListingsSectionLabels = {
  imageFallbackAltPrefix?: string;
  /** Generic card heading shown on every notice (no per-notice number). */
  noticeTitle?: string;
  fieldGender?: string;
  fieldPosted?: string;
  fieldFoundDate?: string;
  fieldFoundLocation?: string;
  fieldCrossStreets?: string;
  fieldMicrochip?: string;
  viewSourceLabel?: string;
};

type FoundListingsSectionProps = {
  title?: string;
  description?: string;
  className?: string;
  mode: FoundListingsMode;
  listings: FoundListing[];
  noticesTitle?: string;
  statusFilter?: FoundListingStatus[];
  showReunited?: boolean;
  showArchived?: boolean;
  /**
   * Days an `open`/`hold` notice stays visible after `foundAtISO` before it is hidden (not deleted).
   * Expiry cannot be switched off; the default is `DEFAULT_FOUND_LISTING_EXPIRY_DAYS` (30). A site
   * overrides it with a positive whole number. A listing's own `expiresAt` wins over it.
   */
  expireAfterDays?: number;
  /** BCP 47 locale used to print `foundAtISO` as the posted date (default "en-US"). */
  dateLocale?: string;
  emptyMessage?: string;
  labels?: FoundListingsSectionLabels;
};

const parseISODate = (value: string | undefined): number => (value ? Date.parse(`${value.slice(0, 10)}T00:00:00Z`) : Number.NaN);

const formatPostedDate = (iso: string, locale: string): string | undefined => {
  const ms = parseISODate(iso);
  return Number.isFinite(ms) ? new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(ms)) : undefined;
};

/** True when an open/hold notice is past its expiry. Unparseable dates never expire (they stay visible). */
const isFoundListingExpired = (listing: FoundListing, expireAfterDays: number, now: number): boolean => {
  const explicitEnd = parseISODate(listing.expiresAt);
  const endMs = Number.isFinite(explicitEnd)
    ? explicitEnd + DAY_MS
    : parseISODate(listing.foundAtISO) + expireAfterDays * DAY_MS;
  return Number.isFinite(endMs) && now >= endMs;
};

const openFullSize = (href: string) => {
  window.open(href, "_blank", "noopener,noreferrer");
};

const FoundListingsSection = ({
  title,
  description,
  className,
  mode,
  listings,
  noticesTitle = "Current Found Dog Notices",
  statusFilter,
  showReunited = false,
  showArchived = false,
  expireAfterDays = DEFAULT_FOUND_LISTING_EXPIRY_DAYS,
  dateLocale = "en-US",
  emptyMessage = "No active found notices are posted right now.",
  labels = {},
}: FoundListingsSectionProps) => {
  const {
    imageFallbackAltPrefix = "Found notice ",
    noticeTitle = "Found Dog",
    fieldGender = "Gender:",
    fieldPosted = "Posted:",
    fieldFoundDate = "Found date:",
    fieldFoundLocation = "Found location:",
    fieldCrossStreets = "Cross streets:",
    fieldMicrochip = "Microchip:",
    viewSourceLabel = "View source listing",
  } = labels;
  const allowedStatuses = statusFilter ?? [
    "open",
    "hold",
    ...(showReunited ? (["reunited"] as FoundListingStatus[]) : []),
    ...(showArchived ? (["archived"] as FoundListingStatus[]) : []),
  ];

  const modeFiltered = listings.filter((listing) => {
    if (mode === "hybrid") return true;
    return listing.source.type === mode;
  });

  const [now] = useState(() => Date.now());
  const days = Number.isFinite(expireAfterDays) && expireAfterDays > 0 ? expireAfterDays : DEFAULT_FOUND_LISTING_EXPIRY_DAYS;
  const visibleListings = modeFiltered.filter(
    (listing) =>
      allowedStatuses.includes(listing.status) &&
      !((listing.status === "open" || listing.status === "hold") && isFoundListingExpired(listing, days, now)),
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
              const featuredMedia = listing.media.find((item) => item.featured) ?? listing.media[0];
              const orderedMedia = featuredMedia
                ? [featuredMedia, ...listing.media.filter((item) => item !== featuredMedia)]
                : [];
              const tileMedia: MediaCarouselTileItem[] = orderedMedia.map((item) => ({
                id: item.id,
                kind: "photo",
                src: item.src,
                label: item.alt ?? `${imageFallbackAltPrefix}${listing.id}`,
              }));
              const locationLabel =
                listing.location?.areaLabel ??
                [listing.location?.city, listing.location?.state, listing.location?.postalCode]
                  .filter(Boolean)
                  .join(", ");

              return (
                <article
                  key={listing.id}
                  className="grid grid-rows-subgrid gap-y-0 row-span-4 overflow-hidden rounded-xl border bg-card shadow-xs"
                >
                  {tileMedia.length ? (
                    <MediaCarouselTile
                      media={tileMedia}
                      fit="contain"
                      onPhotoClick={(item) => {
                        const source = orderedMedia.find((entry) => entry.id === item.id);
                        openFullSize(source?.href ?? item.src);
                      }}
                    />
                  ) : (
                    <div />
                  )}
                  <div className="px-5 pt-5">
                    <h4 className="text-lg font-bold text-foreground">
                      {listing.pet?.name ? `${listing.pet.name} (${noticeTitle})` : noticeTitle}
                    </h4>
                  </div>
                  <div className="px-5">
                    <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                      {listing.pet?.gender ? (
                        <li>
                          <strong className="text-foreground">{fieldGender}</strong> {listing.pet.gender}
                        </li>
                      ) : null}
                      {formatPostedDate(listing.foundAtISO, dateLocale) ? (
                        <li>
                          <strong className="text-foreground">{fieldPosted}</strong>{" "}
                          {formatPostedDate(listing.foundAtISO, dateLocale)}
                        </li>
                      ) : null}
                      {listing.foundAt ? (
                        <li>
                          <strong className="text-foreground">{fieldFoundDate}</strong> {listing.foundAt}
                        </li>
                      ) : null}
                      {locationLabel ? (
                        <li>
                          <strong className="text-foreground">{fieldFoundLocation}</strong> {locationLabel}
                        </li>
                      ) : null}
                      {listing.location?.crossStreets ? (
                        <li>
                          <strong className="text-foreground">{fieldCrossStreets}</strong> {listing.location.crossStreets}
                        </li>
                      ) : null}
                      {listing.pet?.microchipStatus ? (
                        <li>
                          <strong className="text-foreground">{fieldMicrochip}</strong> {listing.pet.microchipStatus}
                        </li>
                      ) : null}
                    </ul>
                  </div>
                  <div className="px-5 pb-5">
                    <p className="mt-3 text-sm text-muted-foreground">{listing.notes}</p>
                    {listing.source.url && /^https?:\/\//i.test(listing.source.url.trim()) ? (
                      <a
                        href={listing.source.url.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-sm font-medium text-primary underline underline-offset-2"
                      >
                        {listing.source.name ? `${viewSourceLabel} (${listing.source.name})` : viewSourceLabel}
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

export default FoundListingsSection;
