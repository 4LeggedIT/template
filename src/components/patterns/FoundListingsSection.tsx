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
  foundAt?: string;
  publishedAt?: string;
  updatedAt?: string;
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
  emptyMessage?: string;
  labels?: FoundListingsSectionLabels;
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
  emptyMessage = "No active found notices are posted right now.",
  labels = {},
}: FoundListingsSectionProps) => {
  const {
    imageFallbackAltPrefix = "Found notice ",
    noticeTitle = "Found Dog",
    fieldGender = "Gender:",
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

  const visibleListings = modeFiltered.filter((listing) => allowedStatuses.includes(listing.status));

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
                <article key={listing.id} className="overflow-hidden rounded-xl border bg-card shadow-xs">
                  {tileMedia.length ? (
                    <MediaCarouselTile
                      media={tileMedia}
                      fit="contain"
                      onPhotoClick={(item) => {
                        const source = orderedMedia.find((entry) => entry.id === item.id);
                        openFullSize(source?.href ?? item.src);
                      }}
                    />
                  ) : null}
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-foreground">
                      {listing.pet?.name ? `${listing.pet.name} (${noticeTitle})` : noticeTitle}
                    </h4>
                    <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                      {listing.pet?.gender ? (
                        <li>
                          <strong className="text-foreground">{fieldGender}</strong> {listing.pet.gender}
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
                    <p className="mt-3 text-sm text-muted-foreground">{listing.notes}</p>
                    {listing.source.url ? (
                      <a
                        href={listing.source.url}
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
