import { Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import AdoptAPetEmbed, { type AdoptAPetFallbackPet } from "@/components/patterns/AdoptAPetEmbed";
import GetBuddyEmbed from "@/components/patterns/GetBuddyEmbed";
import PetCard, { type PetCardItem } from "@/components/patterns/PetCard";
import PetfinderScrollerEmbed, {
  type PetfinderFallbackPet,
} from "@/components/patterns/PetfinderScrollerEmbed";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type AdoptablePetLocalItem = PetCardItem;

type AdoptablePetsSectionProps = {
  title?: string;
  description?: string;
  mode: "petfinder" | "adopt_a_pet" | "getbuddy" | "local" | "hybrid";
  className?: string;
  localPets?: AdoptablePetLocalItem[];
  localSort?: "name_asc" | "none";
  localImageFit?: "cover" | "contain";
  petfinder?: {
    organizationIds: string[];
    title?: string;
    fallbackPets?: PetfinderFallbackPet[];
    limit?: number;
    hideBreed?: boolean;
    petListTitle?: string;
  };
  adoptAPet?: {
    title?: string;
    listingsUrl: string;
    iframeUrl?: string;
    iframeHeight?: number;
    showIframe?: boolean;
    fallbackPets?: AdoptAPetFallbackPet[];
  };
  getBuddy?: {
    title?: string;
    organizationId: string;
    species?: string;
    embedUrl?: string;
    listingsUrl?: string;
    iframeHeight?: number;
    showIframe?: boolean;
  };
  ctas?: Array<{
    label: string;
    href: string;
    variant?: "default" | "secondary" | "outline";
    external?: boolean;
  }>;
  footerCta?: {
    label: string;
    href: string;
    variant?: "default" | "secondary" | "outline";
    external?: boolean;
  };
};

const AdoptablePetsSection = ({
  title = "Adoptable Pets",
  description = "Reusable adoptable-pets pattern supporting local listings and provider adapters.",
  mode,
  className,
  localPets = [],
  localSort = "name_asc",
  localImageFit = "contain",
  petfinder,
  adoptAPet,
  getBuddy,
  ctas = [],
  footerCta,
}: AdoptablePetsSectionProps) => {
  const showLocal = mode === "local" || mode === "hybrid";
  const showPetfinder = mode === "petfinder" || mode === "hybrid";
  const showAdoptAPet = mode === "adopt_a_pet" || mode === "hybrid";
  const showGetBuddy = mode === "getbuddy" || mode === "hybrid";
  const getBuddyEmbedUrl = (() => {
    if (!getBuddy) return null;
    if (getBuddy.embedUrl?.trim()) return getBuddy.embedUrl.trim();

    const orgId = getBuddy.organizationId?.trim();
    if (!orgId) return null;
    const baseUrl = `https://www.getbuddy.com/embed/${encodeURIComponent(orgId)}`;
    if (!getBuddy.species?.trim()) return baseUrl;

    const params = new URLSearchParams({ species: getBuddy.species.trim() });
    return `${baseUrl}?${params.toString()}`;
  })();
  const orderedLocalPets =
    localSort === "name_asc"
      ? [...localPets].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
      : localPets;

  return (
    <section className={cn("rounded-2xl border border-border bg-card/40 p-6", className)}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>

      {ctas.length ? (
        <div className="mb-6 flex flex-wrap gap-3">
          {ctas.map((cta) =>
            cta.external ? (
              <Button key={`${cta.label}-${cta.href}`} asChild variant={cta.variant ?? "default"} size="sm">
                <a href={cta.href} target="_blank" rel="noreferrer">
                  {cta.label}
                </a>
              </Button>
            ) : (
              <Button key={`${cta.label}-${cta.href}`} asChild variant={cta.variant ?? "default"} size="sm">
                <Link to={cta.href}>{cta.label}</Link>
              </Button>
            ),
          )}
        </div>
      ) : null}

      <div className="space-y-6">
        {showLocal ? (
          <div className="space-y-4">
            {orderedLocalPets.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {orderedLocalPets.map((pet) => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    variant="adoptable"
                    imageFit={localImageFit}
                  />
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-6 text-sm text-muted-foreground">
                  No local adoptable listings are posted right now.
                </CardContent>
              </Card>
            )}
          </div>
        ) : null}

        {showPetfinder && petfinder ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              <h4 className="font-medium">Petfinder feed</h4>
            </div>
            <PetfinderScrollerEmbed
              title={petfinder.title ?? "Petfinder Listings"}
              organizationIds={petfinder.organizationIds}
              fallbackPets={petfinder.fallbackPets}
              limit={petfinder.limit}
              hideBreed={petfinder.hideBreed}
              petListTitle={petfinder.petListTitle}
            />
          </div>
        ) : null}

        {showAdoptAPet && adoptAPet ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              <h4 className="font-medium">Adopt-a-Pet feed</h4>
            </div>
            <AdoptAPetEmbed
              title={adoptAPet.title ?? "Adopt-a-Pet Listings"}
              listingsUrl={adoptAPet.listingsUrl}
              iframeUrl={adoptAPet.iframeUrl}
              iframeHeight={adoptAPet.iframeHeight}
              showIframe={adoptAPet.showIframe}
              fallbackPets={adoptAPet.fallbackPets}
            />
          </div>
        ) : null}

        {showGetBuddy && getBuddy && getBuddyEmbedUrl ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              <h4 className="font-medium">GetBuddy feed</h4>
            </div>
            <GetBuddyEmbed
              title={getBuddy.title ?? "GetBuddy Listings"}
              embedUrl={getBuddyEmbedUrl}
              listingsUrl={getBuddy.listingsUrl}
              iframeHeight={getBuddy.iframeHeight}
              showIframe={getBuddy.showIframe}
            />
          </div>
        ) : null}
      </div>

      {footerCta ? (
        <div className="mt-8 flex justify-center">
          {footerCta.external ? (
            <Button asChild variant={footerCta.variant ?? "default"} size="lg">
              <a href={footerCta.href} target="_blank" rel="noreferrer">
                <Heart className="mr-2 h-5 w-5" />
                {footerCta.label}
              </a>
            </Button>
          ) : (
            <Button asChild variant={footerCta.variant ?? "default"} size="lg">
              <Link to={footerCta.href}>
                <Heart className="mr-2 h-5 w-5" />
                {footerCta.label}
              </Link>
            </Button>
          )}
        </div>
      ) : null}
    </section>
  );
};

export default AdoptablePetsSection;
