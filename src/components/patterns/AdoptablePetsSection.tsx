import { Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import AdoptAPetEmbed, { type AdoptAPetFallbackPet } from "@/components/patterns/AdoptAPetEmbed";
import GetBuddyEmbed from "@/components/patterns/GetBuddyEmbed";
import PetCard, { type PetCardItem, type PetCardLabels } from "@/components/patterns/PetCard";
import PetfinderScrollerEmbed, {
  type PetfinderFallbackPet,
} from "@/components/patterns/PetfinderScrollerEmbed";
import { parseYmdUtc, toExpiryMs } from "@/lib/pet-expiry";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type AdoptablePetLocalItem = PetCardItem;

export type AdoptablePetsSectionLabels = PetCardLabels & {
  noLocalListings?: string;
  petfinderFeed?: string;
  adoptAPetFeed?: string;
};

type AdoptablePetsSectionProps = {
  title?: string;
  description?: string;
  mode: "petfinder" | "adopt_a_pet" | "getbuddy" | "local" | "hybrid";
  className?: string;
  localPets?: AdoptablePetLocalItem[];
  localSort?: "name_asc" | "urgency" | "none";
  localImageFit?: "cover" | "contain";
  headless?: boolean;
  petVariant?: "adoptable" | "placement";
  showExpiredListings?: boolean;
  defaultExpiryMonths?: number;
  labels?: AdoptablePetsSectionLabels;
  petfinder?: {
    organizationIds: string[];
    title?: string;
    fallbackPets?: PetfinderFallbackPet[];
    limit?: number;
    hideBreed?: boolean;
    petListTitle?: string;
    petfinderUrl?: string;
    adoptAPetUrl?: string;
    getbuddyUrl?: string;
    labels?: {
      viewAllPrefix?: string;
      viewAllLink?: string;
      availableBadge?: string;
      viewOnLink?: string;
      listConjunction?: string;
    };
  };
  adoptAPet?: {
    title?: string;
    listingsUrl: string;
    iframeUrl?: string;
    iframeHeight?: number;
    showIframe?: boolean;
    fallbackPets?: AdoptAPetFallbackPet[];
    petfinderUrl?: string;
    getbuddyUrl?: string;
    labels?: {
      openButton?: string;
      viewAllPrefix?: string;
      viewAllLink?: string;
      fallbackBadge?: string;
      viewOnLink?: string;
      listConjunction?: string;
    };
  };
  getBuddy?: {
    title?: string;
    organizationId: string;
    species?: string;
    embedUrl?: string;
    listingsUrl?: string;
    iframeHeight?: number;
    showIframe?: boolean;
    petfinderUrl?: string;
    adoptAPetUrl?: string;
    labels?: {
      viewAllPrefix?: string;
      viewAllLink?: string;
      listConjunction?: string;
    };
  };
  externalRegistries?: {
    petfinderProfileUrl?: string;
    adoptAPetProfileUrl?: string;
    label?: string;
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

const urgencyRank = (urgency?: "low" | "high" | "critical") =>
  urgency === "critical" ? 0 : urgency === "high" ? 1 : 2;

const AdoptablePetsSection = ({
  title = "Adoptable Pets",
  description,
  mode,
  className,
  localPets = [],
  localSort = "name_asc",
  localImageFit = "contain",
  headless = false,
  petVariant = "adoptable",
  showExpiredListings = false,
  defaultExpiryMonths = 3,
  labels = {},
  petfinder,
  adoptAPet,
  getBuddy,
  externalRegistries,
  ctas = [],
  footerCta,
}: AdoptablePetsSectionProps) => {
  const {
    noLocalListings = "No local adoptable listings are posted right now.",
    petfinderFeed = "Petfinder feed",
    adoptAPetFeed = "Adopt-a-Pet feed",
    ...petCardLabels
  } = labels;

  const showLocal = mode === "local" || mode === "hybrid";
  const showPetfinder = !headless && (mode === "petfinder" || mode === "hybrid");
  const showAdoptAPet = !headless && (mode === "adopt_a_pet" || mode === "hybrid");
  const showGetBuddy = !headless && (mode === "getbuddy" || mode === "hybrid");

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

  const getBuddyListingsUrl = (() => {
    if (!getBuddy) return undefined;
    if (getBuddy.listingsUrl?.trim()) return getBuddy.listingsUrl.trim();
    const orgId = getBuddy.organizationId?.trim();
    if (!orgId) return undefined;
    return `https://www.getbuddy.com/adoption-center/${encodeURIComponent(orgId)}`;
  })();

  const nowMs = Date.now();

  const processedLocalPets = (() => {
    const withExpiry = localPets.map((pet) => {
      const expiryMs = toExpiryMs(pet, defaultExpiryMonths);
      const isExpired = typeof expiryMs === "number" ? nowMs >= expiryMs : false;
      return { pet, isExpired };
    });

    const filtered = showExpiredListings
      ? withExpiry
      : withExpiry.filter((item) => !item.isExpired);

    if (localSort === "urgency") {
      return [...filtered].sort((a, b) => {
        const rankDiff = urgencyRank(a.pet.urgency) - urgencyRank(b.pet.urgency);
        if (rankDiff !== 0) return rankDiff;
        const aPosted = parseYmdUtc(a.pet.postedAt)?.getTime() ?? 0;
        const bPosted = parseYmdUtc(b.pet.postedAt)?.getTime() ?? 0;
        return bPosted - aPosted;
      });
    }
    if (localSort === "name_asc") {
      return [...filtered].sort((a, b) =>
        (a.pet.name ?? "").localeCompare(b.pet.name ?? "", undefined, { sensitivity: "base" }),
      );
    }
    return filtered;
  })();

  const localGrid = showLocal ? (
    <div className="space-y-4">
      {processedLocalPets.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {processedLocalPets.map(({ pet, isExpired }) => (
            <PetCard
              key={pet.id}
              pet={pet}
              variant={petVariant}
              imageFit={localImageFit}
              imageHref={pet.imageSrc}
              isExpired={isExpired}
              defaultExpiryMonths={defaultExpiryMonths}
              labels={petCardLabels}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-6 text-sm text-muted-foreground">
            {noLocalListings}
          </CardContent>
        </Card>
      )}
    </div>
  ) : null;

  if (headless) {
    return <>{localGrid}</>;
  }

  return (
    <section className={cn("rounded-2xl border border-border bg-card/40 p-6", className)}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
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
        {localGrid}

        {showPetfinder && petfinder ? (
          <div className="space-y-4">
            {mode === "hybrid" ? (
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <h4 className="font-medium">{petfinderFeed}</h4>
              </div>
            ) : null}
            <PetfinderScrollerEmbed
              title={petfinder.title ?? (mode === "hybrid" ? "Petfinder Listings" : "")}
              organizationIds={petfinder.organizationIds}
              fallbackPets={petfinder.fallbackPets}
              limit={petfinder.limit}
              hideBreed={petfinder.hideBreed}
              petfinderUrl={petfinder.petfinderUrl}
              adoptAPetUrl={petfinder.adoptAPetUrl}
              getbuddyUrl={petfinder.getbuddyUrl}
              petListTitle={petfinder.petListTitle}
              labels={petfinder.labels}
            />
          </div>
        ) : null}

        {showAdoptAPet && adoptAPet ? (
          <div className="space-y-4">
            {mode === "hybrid" ? (
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <h4 className="font-medium">{adoptAPetFeed}</h4>
              </div>
            ) : null}
            <AdoptAPetEmbed
              title={adoptAPet.title ?? (mode === "hybrid" ? "Adopt-a-Pet Listings" : "")}
              listingsUrl={adoptAPet.listingsUrl}
              iframeUrl={adoptAPet.iframeUrl}
              iframeHeight={adoptAPet.iframeHeight}
              showIframe={adoptAPet.showIframe}
              fallbackPets={adoptAPet.fallbackPets}
              petfinderUrl={adoptAPet.petfinderUrl}
              getbuddyUrl={adoptAPet.getbuddyUrl}
              labels={adoptAPet.labels}
            />
          </div>
        ) : null}

        {showGetBuddy && getBuddy && getBuddyEmbedUrl ? (
          <GetBuddyEmbed
            title={getBuddy.title ?? "GetBuddy Listings"}
            embedUrl={getBuddyEmbedUrl}
            listingsUrl={getBuddyListingsUrl}
            iframeHeight={getBuddy.iframeHeight}
            showIframe={getBuddy.showIframe}
            petfinderUrl={getBuddy.petfinderUrl}
            adoptAPetUrl={getBuddy.adoptAPetUrl}
            labels={getBuddy.labels}
          />
        ) : null}

        {externalRegistries && (externalRegistries.petfinderProfileUrl || externalRegistries.adoptAPetProfileUrl) ? (
          <p className="text-sm text-muted-foreground">
            {externalRegistries.label ?? "Find our animals for adoption on:"}{" "}
            {[
              externalRegistries.petfinderProfileUrl
                ? { name: "Petfinder", url: externalRegistries.petfinderProfileUrl }
                : null,
              externalRegistries.adoptAPetProfileUrl
                ? { name: "Adopt-a-Pet", url: externalRegistries.adoptAPetProfileUrl }
                : null,
            ]
              .filter((platform): platform is { name: string; url: string } => Boolean(platform))
              .map((platform, idx, arr) => (
                <span key={platform.name}>
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-foreground"
                  >
                    {platform.name}
                  </a>
                  {idx < arr.length - 1 ? " or " : ""}
                </span>
              ))}
          </p>
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
