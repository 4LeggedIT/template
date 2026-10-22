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
 * Where a notice came from (for example a Facebook post) is tracked in an inline `// Source:`
 * comment on the entry in the site's data file. There is deliberately no field for it, so the card
 * never links out. Every string is passed in by the caller, so the pattern has no i18n or router
 * dependency.
 */

/** `found` means the dog is home: flip the status instead of deleting the notice. */
export type MissingListingStatus = "missing" | "found" | "archived";

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
  /** Printed as-is: pass a locale-formatted string (store an ISO date and format per locale). */
  reportedAt?: string;
  /** Where the dog was last seen, as area-level text rather than an exact address. */
  area?: string;
  /** Prominent safety line, for example "Very fearful. Please do not chase." */
  safetyNote?: string;
  notes?: string;
  /** Any number of images (flyer, photos): one shows as a plain image, two or more get prev/next arrows and a count badge. */
  media?: MissingListingMedia[];
  sightingsAction?: MissingListingAction;
}

export type MissingListingsSectionLabels = {
  imageFallbackAltPrefix?: string;
  /** Generic card heading: "<name> (<noticeTitle>)", or just this when the dog has no name. */
  noticeTitle?: string;
  fieldReported?: string;
  fieldArea?: string;
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
  emptyMessage?: string;
  labels?: MissingListingsSectionLabels;
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
  emptyMessage = "No missing dog notices are posted right now.",
  labels = {},
}: MissingListingsSectionProps) => {
  const {
    imageFallbackAltPrefix = "Missing dog image for ",
    noticeTitle = "Missing Dog",
    fieldReported = "Posted:",
    fieldArea = "Last seen:",
  } = labels;
  const allowedStatuses = statusFilter ?? [
    "missing",
    ...(showFound ? (["found"] as MissingListingStatus[]) : []),
    ...(showArchived ? (["archived"] as MissingListingStatus[]) : []),
  ];

  const visibleListings = listings.filter((listing) => allowedStatuses.includes(listing.status));

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
                      {listing.reportedAt ? (
                        <li>
                          <strong className="text-foreground">{fieldReported}</strong> {listing.reportedAt}
                        </li>
                      ) : null}
                      {listing.area ? (
                        <li>
                          <strong className="text-foreground">{fieldArea}</strong> {listing.area}
                        </li>
                      ) : null}
                    </ul>
                    {listing.notes ? <p className="mt-3 text-sm text-muted-foreground">{listing.notes}</p> : null}
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
