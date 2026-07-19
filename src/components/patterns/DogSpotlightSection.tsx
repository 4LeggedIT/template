import type { LocalAdoptableManifestItem } from "@/components/patterns/adoptable-local-manifest";
import { resolvePetAgeLabel } from "@/lib/pet-age";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DogSpotlightItem = LocalAdoptableManifestItem;

export type DogSpotlightSectionLabels = {
  ctaPrefix?: string; // rendered as "{ctaPrefix} {dog.name}", e.g. "Meet Molly"
};

type DogSpotlightSectionProps = {
  title?: string;
  description?: string;
  dogs: DogSpotlightItem[];
  className?: string;
  labels?: DogSpotlightSectionLabels;
};

const DogSpotlightSection = ({
  title = "Dog Spotlight",
  description,
  dogs,
  className,
  labels = {},
}: DogSpotlightSectionProps) => {
  const { ctaPrefix = "Meet" } = labels;

  if (!dogs.length) return null;

  return (
    <section className={cn("rounded-2xl border border-border bg-card/40 p-6", className)}>
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {description ? (
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dogs.map((dog) => {
          const imageSrc = dog.images?.[0] ?? dog.image;
          const ageLabel = resolvePetAgeLabel({ ageLabel: dog.age, birthDate: dog.birthDate });
          const metaLine = [ageLabel, dog.gender].filter(Boolean).join(" • ");

          return (
            <div
              key={dog.id}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={`Meet ${dog.name}`}
                  className="aspect-[3/4] w-full bg-muted object-contain"
                />
              ) : null}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-xl font-bold">{dog.name}</h3>
                {dog.breed ? <p className="text-muted-foreground">{dog.breed}</p> : null}
                {metaLine ? <p className="text-sm text-muted-foreground">{metaLine}</p> : null}
                <div className="flex-1" />
                {dog.detailsUrl ? (
                  <Button asChild className="mt-4 w-full">
                    <a href={dog.detailsUrl} target="_blank" rel="noreferrer">
                      {ctaPrefix} {dog.name}
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DogSpotlightSection;
