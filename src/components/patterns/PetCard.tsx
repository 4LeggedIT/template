import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { resolvePetAgeLabel } from "@/lib/pet-age";
import { cn } from "@/lib/utils";

export type PetCardItem = {
  id: string;
  name?: string;
  alias?: string;
  imageSrc: string;
  images?: string[];
  imageAlt?: string;
  imageFit?: "cover" | "contain";
  breed?: string;
  secondaryBreed?: string;
  ageLabel?: string;
  ageLabelOverride?: string;
  birthDate?: string;
  ageAtReferenceMonths?: number;
  ageReferenceDate?: string;
  gender?: string;
  size?: string;
  color?: string;
  weightLabel?: string;
  summary?: string;
  description?: string;
  statusLabel?: string;
  featured?: boolean;
  locationLabel?: string;
  temperament?: string;
  goodWithDogs?: boolean;
  goodWithKids?: boolean;
  goodWithCats?: boolean;
  urgency?: "low" | "high" | "critical";
  postedAt?: string;
  expiresAt?: string;
  isSpayedNeutered?: boolean;
  isVaccinated?: boolean;
  isMicrochipped?: boolean;
  placementType?: "owner-surrender" | "shelter-transfer" | "stray-hold" | "courtesy-listing";
  inquiryMailto?: string;
  shortDescription?: string;
};

export type PetCardLabels = {
  featured?: string;
  galleryPrev?: string;
  galleryNext?: string;
  descriptionSummary?: string;
  descriptionExpand?: string;
  descriptionCollapse?: string;
  goodWith?: string;
  goodWithDogs?: string;
  goodWithKids?: string;
  goodWithCats?: string;
  urgencyPrefix?: string;
  statusPrefix?: string;
  expiredLabel?: string;
  spayNeuterLabel?: string;
  vaccinatedLabel?: string;
  microchippedLabel?: string;
  postedPrefix?: string;
  expiresPrefix?: string;
  defaultExpiryPrefix?: string;
  monthsLabel?: string;
  yesLabel?: string;
  noLabel?: string;
};

type PetCardProps = {
  pet: PetCardItem;
  variant: "adoptable" | "placement";
  className?: string;
  imageHref?: string;
  imageFit?: "cover" | "contain";
  isExpired?: boolean;
  defaultExpiryMonths?: number;
  labels?: PetCardLabels;
};

const toBooleanLabel = (label: string, value: boolean | undefined, yesLabel: string, noLabel: string) =>
  typeof value === "boolean" ? `${label}: ${value ? yesLabel : noLabel}` : null;

const urgencyBadgeClass = (urgency: "low" | "high" | "critical") =>
  urgency === "critical"
    ? "bg-destructive text-destructive-foreground"
    : urgency === "high"
      ? "bg-orange-500 text-white"
      : "bg-muted text-muted-foreground";

const hasHealthData = (pet: PetCardItem) =>
  typeof pet.isSpayedNeutered === "boolean" ||
  typeof pet.isVaccinated === "boolean" ||
  typeof pet.isMicrochipped === "boolean";

const PetCard = ({
  pet,
  variant,
  className,
  imageHref,
  imageFit = "contain",
  isExpired = false,
  defaultExpiryMonths = 3,
  labels = {},
}: PetCardProps) => {
  const {
    featured: featuredLabel = "Featured",
    galleryPrev = "Prev",
    galleryNext = "Next",
    descriptionSummary = "About",
    descriptionExpand = "(expand)",
    descriptionCollapse = "(collapse)",
    goodWith: goodWithLabel = "Good with:",
    goodWithDogs: goodWithDogsLabel = "Dogs",
    goodWithKids: goodWithKidsLabel = "Kids",
    goodWithCats: goodWithCatsLabel = "Cats",
    urgencyPrefix = "Urgency:",
    statusPrefix = "Status:",
    expiredLabel = "Expired",
    spayNeuterLabel = "Spay/Neuter",
    vaccinatedLabel = "Vaccinated",
    microchippedLabel = "Microchipped",
    postedPrefix = "Posted:",
    expiresPrefix = "Expires:",
    defaultExpiryPrefix = "Default expiry:",
    monthsLabel = "months",
    yesLabel = "Yes",
    noLabel = "No",
  } = labels;

  const ageLabel = resolvePetAgeLabel(pet);
  const displayName = pet.name && pet.alias ? `${pet.name} (aka ${pet.alias})` : pet.name;
  const imageObjectFit = (pet.imageFit ?? imageFit) === "contain" ? "object-contain bg-muted" : "object-cover";
  const gallery = pet.images?.filter(Boolean).length ? (pet.images?.filter(Boolean) as string[]) : [pet.imageSrc];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImageSrc = gallery[Math.min(activeImageIndex, gallery.length - 1)] ?? pet.imageSrc;
  const hasGallery = gallery.length > 1;

  useEffect(() => {
    setActiveImageIndex(0);
  }, [pet.id, gallery.length]);

  const goodWithItems = [
    pet.goodWithDogs ? goodWithDogsLabel : null,
    pet.goodWithKids ? goodWithKidsLabel : null,
    pet.goodWithCats ? goodWithCatsLabel : null,
  ].filter(Boolean) as string[];

  const healthLine = hasHealthData(pet) ? (
    <p className="text-xs text-muted-foreground">
      {[
        toBooleanLabel(spayNeuterLabel, pet.isSpayedNeutered, yesLabel, noLabel),
        toBooleanLabel(vaccinatedLabel, pet.isVaccinated, yesLabel, noLabel),
        toBooleanLabel(microchippedLabel, pet.isMicrochipped, yesLabel, noLabel),
      ]
        .filter(Boolean)
        .join(" • ")}
    </p>
  ) : null;

  const descriptionBlock = pet.description ? (
    <details className="group rounded-lg border border-border px-3 py-2">
      <summary className="cursor-pointer list-none text-sm font-medium text-foreground">
        {descriptionSummary} {pet.name ?? "this pet"}
        <span className="ml-2 text-xs text-muted-foreground group-open:hidden">{descriptionExpand}</span>
        <span className="ml-2 hidden text-xs text-muted-foreground group-open:inline">{descriptionCollapse}</span>
      </summary>
      <div className="mt-2 space-y-2 text-sm text-muted-foreground">
        {pet.description
          .split("\n\n")
          .map((paragraph) => paragraph.trim())
          .filter(Boolean)
          .map((paragraph, index) => (
            <p key={`${pet.id}-p-${index}`}>{paragraph}</p>
          ))}
      </div>
    </details>
  ) : null;

  const galleryNav = hasGallery ? (
    <>
      <button
        type="button"
        aria-label={galleryPrev}
        onClick={() => setActiveImageIndex((current) => (current - 1 + gallery.length) % gallery.length)}
        className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-1 text-xs text-white hover:bg-black/70"
      >
        {galleryPrev}
      </button>
      <button
        type="button"
        aria-label={galleryNext}
        onClick={() => setActiveImageIndex((current) => (current + 1) % gallery.length)}
        className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-1 text-xs text-white hover:bg-black/70"
      >
        {galleryNext}
      </button>
      <span className="absolute right-2 bottom-2 rounded-full bg-black/55 px-2 py-0.5 text-[11px] text-white">
        {activeImageIndex + 1}/{gallery.length}
      </span>
    </>
  ) : null;

  const hasPlacementMeta = Boolean(
    pet.name ||
      pet.ageLabel ||
      pet.breed ||
      pet.locationLabel ||
      pet.urgency ||
      pet.statusLabel ||
      pet.gender ||
      pet.size ||
      pet.color ||
      pet.weightLabel ||
      pet.temperament ||
      pet.postedAt ||
      pet.expiresAt ||
      hasHealthData(pet),
  );

  return (
    <Card className={cn("overflow-hidden border-border/80", pet.featured ? "ring-1 ring-primary/30" : "", className)}>
      <CardContent className={cn("p-0", variant === "adoptable" ? "space-y-0" : undefined)}>
        {variant === "adoptable" ? (
          <>
            <div className="relative">
              {imageHref ? (
                <a href={activeImageSrc} target="_blank" rel="noreferrer" className="block">
                  <img
                    src={activeImageSrc}
                    alt={pet.imageAlt ?? `Meet ${pet.name ?? "this pet"}`}
                    className={cn("h-56 w-full", imageObjectFit)}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              ) : (
                <img
                  src={activeImageSrc}
                  alt={pet.imageAlt ?? `Meet ${pet.name ?? "this pet"}`}
                  className={cn("h-56 w-full", imageObjectFit)}
                  loading="lazy"
                  decoding="async"
                />
              )}
              {galleryNav}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  {pet.statusLabel ? (
                    <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-foreground">
                      {pet.statusLabel}
                    </span>
                  ) : null}
                  {pet.featured ? (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                      {featuredLabel}
                    </span>
                  ) : null}
                  {pet.urgency ? (
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", urgencyBadgeClass(pet.urgency))}>
                      {pet.urgency}
                    </span>
                  ) : null}
                </div>
                {displayName ? <h5 className="mt-2 text-lg font-semibold text-white">{displayName}</h5> : null}
                <p className="text-sm text-white/90">
                  {[ageLabel, pet.gender, pet.breed, pet.size].filter(Boolean).join(" • ")}
                </p>
              </div>
            </div>
            <div className="space-y-3 p-4">
              {pet.summary ? <p className="text-sm text-muted-foreground">{pet.summary}</p> : null}
              {(pet.temperament || goodWithItems.length > 0) ? (
                <div className="space-y-1.5">
                  {pet.temperament ? (
                    <p className="text-xs italic text-muted-foreground">{pet.temperament}</p>
                  ) : null}
                  {goodWithItems.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">{goodWithLabel}</span>
                      {goodWithItems.map((label) => (
                        <span
                          key={label}
                          className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
              {descriptionBlock}
              {healthLine}
              {pet.expiresAt ? (
                <p className="text-[11px] text-muted-foreground">{expiresPrefix} {pet.expiresAt}</p>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <div className="relative">
              {hasGallery ? (
                <img
                  src={activeImageSrc}
                  alt={pet.imageAlt ?? pet.name ?? "Pet photo"}
                  loading="lazy"
                  decoding="async"
                  className={cn("h-40 w-full", imageObjectFit)}
                />
              ) : imageHref ? (
                <a href={imageHref} target="_blank" rel="noreferrer" className="block">
                  <img
                    src={activeImageSrc}
                    alt={pet.imageAlt ?? pet.name ?? "Pet photo"}
                    loading="lazy"
                    decoding="async"
                    className={cn("h-40 w-full", imageObjectFit)}
                  />
                </a>
              ) : (
                <img
                  src={activeImageSrc}
                  alt={pet.imageAlt ?? pet.name ?? "Pet photo"}
                  loading="lazy"
                  decoding="async"
                  className={cn("h-40 w-full", imageObjectFit)}
                />
              )}
              {galleryNav}
            </div>
            {hasPlacementMeta ? (
              <div className="space-y-1 p-3">
                {displayName ? <p className="text-sm font-medium">{displayName}</p> : null}
                {(pet.urgency || pet.statusLabel || isExpired) ? (
                  <p className="text-xs text-muted-foreground">
                    {[
                      pet.urgency ? `${urgencyPrefix} ${pet.urgency}` : null,
                      pet.statusLabel ? `${statusPrefix} ${pet.statusLabel}` : null,
                      isExpired ? expiredLabel : null,
                    ]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                ) : null}
                <p className="text-xs text-muted-foreground">
                  {[ageLabel, pet.breed, pet.secondaryBreed, pet.locationLabel].filter(Boolean).join(" • ")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {[pet.gender, pet.size, pet.color, pet.weightLabel].filter(Boolean).join(" • ")}
                </p>
                {healthLine}
                {pet.temperament ? <p className="line-clamp-2 text-xs text-muted-foreground">{pet.temperament}</p> : null}
                {(pet.postedAt || pet.expiresAt) ? (
                  <p className="text-[11px] text-muted-foreground">
                    {pet.postedAt ? `${postedPrefix} ${pet.postedAt}` : null}
                    {pet.postedAt && pet.expiresAt ? " • " : null}
                    {pet.expiresAt ? `${expiresPrefix} ${pet.expiresAt}` : null}
                    {!pet.expiresAt && pet.postedAt ? ` • ${defaultExpiryPrefix} +${defaultExpiryMonths} ${monthsLabel}` : null}
                  </p>
                ) : null}
                {descriptionBlock}
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PetCard;
