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
};

const AdoptAPetEmbed = ({
  title = "Adopt-a-Pet Listings",
  listingsUrl,
  iframeUrl,
  iframeHeight = 760,
  showIframe = false,
  fallbackPets = [],
  className,
}: AdoptAPetEmbedProps) => {
  return (
    <section className={className}>
      <div className="space-y-4 rounded-2xl border border-border bg-card/40 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Adopt-a-Pet provider integration with direct-listing links and optional inline embed.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <a href={listingsUrl} target="_blank" rel="noreferrer">
              Open Adopt-a-Pet
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
          Or view all pets on{" "}
          <a
            href={listingsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Adopt-a-Pet
          </a>
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
                      <span>Fallback preview</span>
                    </div>
                    <p className="font-medium">{pet.name}</p>
                    {pet.summary ? <p className="text-sm text-muted-foreground">{pet.summary}</p> : null}
                    <a
                      href={pet.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex text-sm font-medium text-primary underline underline-offset-4"
                    >
                      View on Adopt-a-Pet
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

