import { ExternalLink, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type AdoptAPetFallbackPet = {
  id: string;
  name: string;
  imageSrc?: string;
  imageAlt?: string;
  summary?: string;
  href: string;
};

type AdoptAPetEmbedProps = {
  title?: string;
  listingsUrl: string;
  iframeUrl?: string;
  iframeHeight?: number;
  showIframe?: boolean;
  fallbackPets?: AdoptAPetFallbackPet[];
  className?: string;
  getbuddyUrl?: string;
  petfinderUrl?: string;
  labels?: {
    openButton?: string;
    viewAllPrefix?: string;
    viewAllLink?: string;
    fallbackBadge?: string;
    viewOnLink?: string;
  };
};

const AdoptAPetEmbed = ({
  title = "Adopt-a-Pet Listings",
  listingsUrl,
  iframeUrl,
  iframeHeight = 760,
  showIframe = false,
  fallbackPets = [],
  className,
  getbuddyUrl,
  petfinderUrl,
  labels = {},
}: AdoptAPetEmbedProps) => {
  const {
    openButton = "Open Adopt-a-Pet",
    viewAllPrefix = "Or view all pets on",
    viewAllLink = "Adopt-a-Pet",
    fallbackBadge = "Fallback preview",
    viewOnLink = "View on Adopt-a-Pet",
  } = labels;

  const platforms = [
    { name: "Adopt-a-Pet", url: listingsUrl },
    ...(petfinderUrl ? [{ name: "Petfinder", url: petfinderUrl }] : []),
    ...(getbuddyUrl ? [{ name: "GetBuddy", url: getbuddyUrl }] : []),
  ];

  return (
    <section className={className}>
      <div className="space-y-4 rounded-2xl border border-border bg-card/40 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {title ? <h3 className="text-xl font-semibold tracking-tight">{title}</h3> : <span />}
          <Button asChild variant="outline" size="sm">
            <a href={listingsUrl} target="_blank" rel="noreferrer">
              {openButton}
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        {showIframe && iframeUrl ? (
          <div className="overflow-hidden rounded-xl border border-border/80">
            <iframe
              src={iframeUrl}
              title={title}
              className="w-full"
              style={{ height: `${iframeHeight}px` }}
              loading="lazy"
            />
          </div>
        ) : null}

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
                      <span>{fallbackBadge}</span>
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

export default AdoptAPetEmbed;
