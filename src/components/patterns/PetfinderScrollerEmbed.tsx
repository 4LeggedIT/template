import { Helmet } from "react-helmet-async";
import { PawPrint } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { normalizePetfinderBaseUrl } from "@/components/patterns/petfinder-url";

export type PetfinderFallbackPet = {
  id: string;
  name: string;
  imageSrc?: string;
  imageAlt?: string;
  summary?: string;
  href: string;
};

type PetfinderScrollerEmbedProps = {
  title?: string;
  organizationIds: string[];
  className?: string;
  limit?: number;
  hideBreed?: boolean;
  petListTitle?: string;
  petfinderUrl?: string;
  getbuddyUrl?: string;
  adoptAPetUrl?: string;
  apiBase?: string;
  s3Url?: string;
  showScriptTag?: boolean;
  fallbackPets?: PetfinderFallbackPet[];
  labels?: {
    viewAllPrefix?: string;
    viewAllLink?: string;
    availableBadge?: string;
    viewOnLink?: string;
  };
};

const DEFAULT_SCRIPT_SRC = "https://www.petfinder.com/pet-scroller.bundle.js";
const DEFAULT_S3_URL = "https://dbw3zep4prcju.cloudfront.net/";
const DEFAULT_API_BASE = "https://psl.petfinder.com/graphql";
const DEFAULT_PETFINDER_URL = "https://www.petfinder.com/";

const PetfinderScrollerEmbed = ({
  title = "Adoptable Pets",
  organizationIds,
  className,
  limit = 24,
  hideBreed = false,
  petListTitle = "",
  petfinderUrl = DEFAULT_PETFINDER_URL,
  getbuddyUrl,
  adoptAPetUrl,
  apiBase = DEFAULT_API_BASE,
  s3Url = DEFAULT_S3_URL,
  showScriptTag = true,
  fallbackPets = [],
  labels = {},
}: PetfinderScrollerEmbedProps) => {
  const {
    viewAllPrefix = "Or view all pets on",
    viewAllLink = "Petfinder",
    availableBadge = "Available pet",
    viewOnLink = "View on Petfinder",
  } = labels;

  const organizationJson = JSON.stringify(organizationIds);
  const widgetPetfinderUrl = normalizePetfinderBaseUrl(petfinderUrl);
  const platforms = [
    { name: "Petfinder", url: petfinderUrl },
    ...(adoptAPetUrl ? [{ name: "Adopt-a-Pet", url: adoptAPetUrl }] : []),
    ...(getbuddyUrl ? [{ name: "GetBuddy", url: getbuddyUrl }] : []),
  ];

  return (
    <section className={className}>
      {showScriptTag ? (
        <Helmet>
          <script src={DEFAULT_SCRIPT_SRC} />
        </Helmet>
      ) : null}

      <div className="space-y-4 rounded-2xl border border-border bg-card/40 p-6">
        {title ? <h3 className="text-xl font-semibold tracking-tight">{title}</h3> : null}

        <pet-scroller
          s3Url={s3Url}
          apiBase={apiBase}
          organization={organizationJson}
          status="adoptable"
          petfinderUrl={widgetPetfinderUrl}
          hideBreed={hideBreed ? "true" : "false"}
          limit={String(limit)}
          petListTitle={petListTitle}
        />

        <p className="text-sm text-muted-foreground">
          {viewAllPrefix}{" "}
          {platforms.map((platform, idx) => (
            <span key={platform.name}>
              <a
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground"
              >
                {platform.name}
              </a>
              {idx < platforms.length - 2 ? ", " : idx < platforms.length - 1 ? " or " : ""}
            </span>
          ))}
          .
        </p>

        {fallbackPets.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fallbackPets.map((pet) => (
              <Card key={pet.id} className="overflow-hidden border-dashed border-border/80">
                <CardContent className="p-0">
                  {pet.imageSrc ? (
                    <img
                      src={pet.imageSrc}
                      alt={pet.imageAlt ?? pet.name}
                      className="h-40 w-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                  <div className="space-y-2 p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                      <PawPrint className="h-3.5 w-3.5" />
                      <span>{availableBadge}</span>
                    </div>
                    <p className="font-medium">{pet.name}</p>
                    {pet.summary ? <p className="text-sm text-muted-foreground">{pet.summary}</p> : null}
                    <a
                      href={pet.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex text-sm font-medium text-primary underline underline-offset-4"
                    >
                      {viewOnLink}
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default PetfinderScrollerEmbed;
