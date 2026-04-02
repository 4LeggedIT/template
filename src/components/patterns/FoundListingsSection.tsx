import { Link } from "react-router-dom";
import { AlertTriangle, FileText, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type FoundListingsMode = "local" | "external" | "hybrid";
export type FoundListingStatus = "open" | "reunited" | "archived" | "hold";
export type FoundSourceType = "local" | "external";
export type FoundSpecies = "dog" | "cat" | "other";

export interface FoundListingSource {
  type: FoundSourceType;
  name?: string;
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
  sex?: string;
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
  featured?: boolean;
}

export interface FoundListingContact {
  rescuePhoneLabel?: string;
  rescuePhoneHref?: string;
  rescueEmailLabel?: string;
  rescueEmailHref?: string;
  claimFormHref?: string;
}

export interface FoundListingVerification {
  ownershipVerificationRequired: boolean;
  checklist?: string[];
}

export interface FoundListing {
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
  media: FoundListingMedia[];
  contact?: FoundListingContact;
  verification?: FoundListingVerification;
}

export interface FoundExternalProviderConfig {
  providerId: string;
  providerLabel?: string;
  listingBaseUrl?: string;
}

type FoundListingsSectionProps = {
  title?: string;
  description?: string;
  className?: string;
  mode: FoundListingsMode;
  listings: FoundListing[];
  externalProviders?: FoundExternalProviderConfig[];
  warningTitle?: string;
  warningBody?: string;
  checklistTitle?: string;
  checklistItems?: string[];
  processTitle?: string;
  processSteps?: string[];
  noticesTitle?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  phoneCta?: { label: string; href: string };
  emailCta?: { label: string; href: string };
  helpLink?: { label: string; href: string; external?: boolean };
  statusFilter?: FoundListingStatus[];
  showReunited?: boolean;
  showArchived?: boolean;
  emptyMessage?: string;
};

const defaultChecklistItems = [
  "Date, time, and exact location where the dog was found",
  "Photos or short video from a safe distance",
  "Estimated breed, size, color, and any collar/harness details",
  "Whether the dog appears injured, frightened, or approachable",
  "Your preferred contact details for owner outreach",
];

const defaultProcessSteps = [
  "We review your found-dog details and create a local notice.",
  "Owners contact us and provide identifying details for verification.",
  "We coordinate the safest handoff plan for the owner and finder.",
];

const FoundListingsSection = ({
  title = "Found Dog Notices",
  description = "Found a dog? Share a notice so owners can reconnect and reunite safely.",
  className,
  mode,
  listings,
  warningTitle = "Please Keep Them Safe",
  warningBody = "If the dog is safely contained, keep holding them while owner matching is in progress. Do not hand a found dog to anyone unless ownership is verified.",
  checklistTitle = "What to Include in Your Notice",
  checklistItems = defaultChecklistItems,
  processTitle = "How Reunification Works",
  processSteps = defaultProcessSteps,
  noticesTitle = "Current Found Dog Notices",
  ctaTitle = "Submit a Found Notice",
  ctaDescription = "Share the details and a coordinator can help verify ownership and support safe reunification.",
  phoneCta,
  emailCta,
  helpLink,
  statusFilter,
  showReunited = false,
  showArchived = false,
  emptyMessage = "No active found notices are posted right now.",
}: FoundListingsSectionProps) => {
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
      <div className="rounded-2xl border bg-card px-6 py-10 text-center">
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-3xl text-muted-foreground">{description}</p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-7 w-7 flex-shrink-0 text-amber-600" />
          <div>
            <h3 className="text-lg font-bold text-amber-800">{warningTitle}</h3>
            <p className="mt-1 text-sm text-amber-700">{warningBody}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border bg-card p-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold">{checklistTitle}</h3>
          <ul className="mt-4 space-y-2">
            {checklistItems.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border bg-card p-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold">{processTitle}</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {processSteps.map((step, index) => (
              <li key={`${index}-${step}`} className="flex items-start gap-2">
                {index === 0 ? (
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                ) : index === 1 ? (
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                ) : (
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                )}
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div>
        <h3 className="mb-5 text-2xl font-bold">{noticesTitle}</h3>
        {visibleListings.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {visibleListings.map((listing) => {
              const featuredMedia = listing.media.find((item) => item.featured) ?? listing.media[0];
              const imageHref = featuredMedia?.href ?? featuredMedia?.src;
              const locationLabel =
                listing.location?.areaLabel ??
                [listing.location?.city, listing.location?.state, listing.location?.postalCode]
                  .filter(Boolean)
                  .join(", ");

              return (
                <article key={listing.id} className="overflow-hidden rounded-xl border bg-card shadow-sm">
                  {featuredMedia && imageHref ? (
                    <a
                      href={imageHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-muted/30 p-3"
                      aria-label={`Open full-size image for found dog notice ${listing.id}`}
                    >
                      <img
                        src={featuredMedia.src}
                        alt={featuredMedia.alt ?? `Found notice ${listing.id}`}
                        className="h-80 w-full rounded-md object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </a>
                  ) : null}
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-foreground">
                      {listing.pet?.name ? `${listing.pet.name} (Found Dog Notice #${listing.id})` : `Found Dog Notice #${listing.id}`}
                    </h4>
                    <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                      {listing.pet?.sex ? (
                        <li>
                          <strong className="text-foreground">Sex:</strong> {listing.pet.sex}
                        </li>
                      ) : null}
                      {listing.foundAt ? (
                        <li>
                          <strong className="text-foreground">Found date:</strong> {listing.foundAt}
                        </li>
                      ) : null}
                      {locationLabel ? (
                        <li>
                          <strong className="text-foreground">Found location:</strong> {locationLabel}
                        </li>
                      ) : null}
                      {listing.location?.crossStreets ? (
                        <li>
                          <strong className="text-foreground">Cross streets:</strong> {listing.location.crossStreets}
                        </li>
                      ) : null}
                      {listing.pet?.microchipStatus ? (
                        <li>
                          <strong className="text-foreground">Microchip:</strong> {listing.pet.microchipStatus}
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
                        {listing.source.name ? `View source listing (${listing.source.name})` : "View source listing"}
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

      {(phoneCta || emailCta || helpLink) ? (
        <div className="rounded-2xl bg-primary px-6 py-10 text-center text-primary-foreground">
          <h3 className="text-2xl font-bold">{ctaTitle}</h3>
          <p className="mx-auto mt-3 max-w-2xl opacity-90">{ctaDescription}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            {phoneCta ? (
              <a
                href={phoneCta.href}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-primary transition-colors hover:bg-gray-100"
              >
                <Phone className="h-5 w-5" />
                {phoneCta.label}
              </a>
            ) : null}
            {emailCta ? (
              <a
                href={emailCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-primary transition-colors hover:bg-gray-100"
              >
                <Mail className="h-5 w-5" />
                {emailCta.label}
              </a>
            ) : null}
          </div>
          {helpLink ? (
            <p className="mt-5 text-sm text-primary-foreground/90">
              Need first-step guidance?{" "}
              {helpLink.external ? (
                <a
                  className="underline underline-offset-2 hover:no-underline"
                  href={helpLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {helpLink.label}
                </a>
              ) : (
                <Link className="underline underline-offset-2 hover:no-underline" to={helpLink.href}>
                  {helpLink.label}
                </Link>
              )}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};

export default FoundListingsSection;
