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
  urgency?: "low" | "high" | "critical";
  postedAt?: string;
  expiresAt?: string;
  isSpayedNeutered?: boolean;
  isVaccinated?: boolean;
  isMicrochipped?: boolean;
};

type PetCardProps = {
  pet: PetCardItem;
  variant: "adoptable" | "placement";
  className?: string;
  imageHref?: string;
  imageFit?: "cover" | "contain";
  isExpired?: boolean;
  defaultExpiryMonths?: number;
};

const toBooleanLabel = (label: string, value?: boolean) =>
  typeof value === "boolean" ? `${label}: ${value ? "Yes" : "No"}` : null;

const PetCard = ({
  pet,
  variant,
  className,
  imageHref,
  imageFit = "contain",
  isExpired = false,
  defaultExpiryMonths = 3,
}: PetCardProps) => {
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
      typeof pet.isSpayedNeutered === "boolean" ||
      typeof pet.isVaccinated === "boolean" ||
      typeof pet.isMicrochipped === "boolean",
  );

  return (
    <Card className={cn("overflow-hidden border-border/80", pet.featured ? "ring-1 ring-primary/30" : "", className)}>
      <CardContent className={cn("p-0", variant === "adoptable" ? "space-y-0" : undefined)}>
        {variant === "adoptable" ? (
          <>
            <div className="relative">
              <img
                src={activeImageSrc}
                alt={pet.imageAlt ?? `Meet ${pet.name ?? "this pet"}`}
                className={cn("h-56 w-full", imageObjectFit)}
                loading="lazy"
                decoding="async"
              />
              {hasGallery ? (
                <>
                  <button
                    type="button"
                    aria-label="Previous photo"
                    onClick={() =>
                      setActiveImageIndex((current) => (current - 1 + gallery.length) % gallery.length)
                    }
                    className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-1 text-xs text-white hover:bg-black/70"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    aria-label="Next photo"
                    onClick={() => setActiveImageIndex((current) => (current + 1) % gallery.length)}
                    className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-1 text-xs text-white hover:bg-black/70"
                  >
                    Next
                  </button>
                  <span className="absolute right-2 bottom-2 rounded-full bg-black/55 px-2 py-0.5 text-[11px] text-white">
                    {activeImageIndex + 1}/{gallery.length}
                  </span>
                </>
              ) : null}
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
                      Featured
                    </span>
                  ) : null}
                </div>
                {displayName ? <h5 className="mt-2 text-lg font-semibold text-white">{displayName}</h5> : null}
                <p className="text-sm text-white/90">{[ageLabel, pet.gender, pet.breed].filter(Boolean).join(" • ")}</p>
              </div>
            </div>
            <div className="space-y-3 p-4">
              {pet.summary ? <p className="text-sm text-muted-foreground">{pet.summary}</p> : null}
              {pet.description ? (
                <details className="group rounded-lg border border-border px-3 py-2">
                  <summary className="cursor-pointer list-none text-sm font-medium text-foreground">
                    About {pet.name ?? "this pet"}
                    <span className="ml-2 text-xs text-muted-foreground group-open:hidden">(expand)</span>
                    <span className="ml-2 hidden text-xs text-muted-foreground group-open:inline">(collapse)</span>
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
              ) : null}
            </div>
          </>
        ) : (
          <>
            {imageHref ? (
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
            {hasPlacementMeta ? (
              <div className="space-y-1 p-3">
                {displayName ? <p className="text-sm font-medium">{displayName}</p> : null}
                {(pet.urgency || pet.statusLabel || isExpired) ? (
                  <p className="text-xs text-muted-foreground">
                    {[pet.urgency ? `Urgency: ${pet.urgency}` : null, pet.statusLabel ? `Status: ${pet.statusLabel}` : null, isExpired ? "Expired" : null]
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
                {(typeof pet.isSpayedNeutered === "boolean" ||
                  typeof pet.isVaccinated === "boolean" ||
                  typeof pet.isMicrochipped === "boolean") ? (
                    <p className="text-xs text-muted-foreground">
                      {[
                        toBooleanLabel("Spay/Neuter", pet.isSpayedNeutered),
                        toBooleanLabel("Vaccinated", pet.isVaccinated),
                        toBooleanLabel("Microchipped", pet.isMicrochipped),
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  ) : null}
                {pet.temperament ? <p className="line-clamp-2 text-xs text-muted-foreground">{pet.temperament}</p> : null}
                {(pet.postedAt || pet.expiresAt) ? (
                  <p className="text-[11px] text-muted-foreground">
                    {pet.postedAt ? `Posted: ${pet.postedAt}` : null}
                    {pet.postedAt && pet.expiresAt ? " • " : null}
                    {pet.expiresAt ? `Expires: ${pet.expiresAt}` : null}
                    {!pet.expiresAt && pet.postedAt ? ` • Default expiry: +${defaultExpiryMonths} months` : null}
                  </p>
                ) : null}
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PetCard;
