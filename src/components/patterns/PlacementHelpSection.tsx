import { Home, Mail, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import AdoptablePetsSection from "@/components/patterns/AdoptablePetsSection";
import { type PetCardItem, type PetCardLabels } from "@/components/patterns/PetCard";
import { toExpiryMs } from "@/lib/pet-expiry";
import { Button } from "@/components/ui/button";
import type { PetProfile } from "@/types/petProfile";
import { cn } from "@/lib/utils";

export type PlacementListingItem = PetProfile & PetCardItem;

export type PlacementHelpSectionLabels = PetCardLabels & {
  noActiveListings?: string;
};

export type PlacementNeedItem = {
  id: string;
  title: string;
  description: string;
  icon?: "home" | "rescue" | "transport";
};

type PlacementHelpSectionProps = {
  labels?: PlacementHelpSectionLabels;
  title?: string;
  description?: string;
  className?: string;
  listingsTitle?: string;
  listingsDescription?: string;
  listings: PlacementListingItem[];
  showExpiredListings?: boolean;
  defaultExpiryMonths?: number;
  needsTitle?: string;
  needs?: PlacementNeedItem[];
  needsSummary?: string;
  needsChecklistItems?: string[];
  primaryCta?: {
    label: string;
    href: string;
    external?: boolean;
  };
  secondaryCta?: {
    label: string;
    href: string;
    external?: boolean;
  };
  footnote?: string;
};

const iconMap = {
  home: Home,
  rescue: ShieldCheck,
  transport: Truck,
} as const;

const PlacementHelpSection = ({
  title = "Placement Help",
  description = "Courtesy listings and placement support requirements for time-sensitive rescue networking.",
  className,
  listingsTitle = "These are courtesy photos to help with networking. If you can help with placement, we'll share more details.",
  listingsDescription,
  listings,
  showExpiredListings = false,
  defaultExpiryMonths = 3,
  needsTitle,
  needs = [],
  needsSummary,
  needsChecklistItems = [],
  primaryCta,
  secondaryCta,
  footnote = "Email is usually best so photos, location, and a short case summary can be shared quickly.",
  labels = {},
}: PlacementHelpSectionProps) => {
  const { noActiveListings = "No active placement listings are posted right now.", ...petCardLabels } = labels;
  const showHeader = Boolean(title || description);

  const nowMs = Date.now();
  const expiredCount = listings.filter((listing) => {
    const expiryMs = toExpiryMs(listing, defaultExpiryMonths);
    return typeof expiryMs === "number" && nowMs >= expiryMs;
  }).length;

  return (
    <section className={cn("space-y-4", className)}>
      {showHeader ? (
        <div>
          {title ? <h3 className="text-xl font-semibold tracking-tight">{title}</h3> : null}
          {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-3">
          {listingsTitle ? <p className="text-sm text-muted-foreground">{listingsTitle}</p> : null}
          {listingsDescription ? <p className="text-sm text-muted-foreground">{listingsDescription}</p> : null}
          {!showExpiredListings && expiredCount ? (
            <p className="text-xs text-muted-foreground">
              {expiredCount} expired listing{expiredCount === 1 ? "" : "s"} hidden.
            </p>
          ) : null}
          <AdoptablePetsSection
            headless
            mode="local"
            petVariant="adoptable"
            localSort="urgency"
            localPets={listings}
            showExpiredListings={showExpiredListings}
            defaultExpiryMonths={defaultExpiryMonths}
            labels={{ noLocalListings: noActiveListings, ...petCardLabels }}
          />
        </div>

        <aside className="space-y-4 rounded-xl border border-border/60 bg-muted/40 p-4 lg:self-start">
          {needsTitle ? <p className="text-sm font-semibold text-foreground">{needsTitle}</p> : null}
          {needsChecklistItems.length ? (
            <div className="space-y-3">
              {needsSummary ? <p className="text-sm text-muted-foreground">{needsSummary}</p> : null}
              <ul className="space-y-2 text-sm text-foreground">
                {needsChecklistItems.map((item, index) => (
                  <li key={`${index}-${item}`} className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            needs.map((need) => {
              const Icon = iconMap[need.icon ?? "home"];
              return (
                <div key={need.id} className="flex gap-3">
                  <Icon className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{need.title}</p>
                    <p className="text-sm text-muted-foreground">{need.description}</p>
                  </div>
                </div>
              );
            })
          )}

          {(primaryCta || secondaryCta) ? (
            <div className="space-y-3 pt-2">
              {primaryCta ? (
                primaryCta.external ? (
                  <Button asChild className="w-full">
                    <a href={primaryCta.href} target="_blank" rel="noreferrer">
                      <Mail className="mr-2 h-4 w-4" />
                      {primaryCta.label}
                    </a>
                  </Button>
                ) : (
                  <Button asChild className="w-full">
                    <Link to={primaryCta.href}>
                      <Mail className="mr-2 h-4 w-4" />
                      {primaryCta.label}
                    </Link>
                  </Button>
                )
              ) : null}
              {secondaryCta ? (
                secondaryCta.external ? (
                  <Button asChild variant="outline" className="w-full">
                    <a href={secondaryCta.href} target="_blank" rel="noreferrer">
                      {secondaryCta.label}
                    </a>
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="w-full">
                    <Link to={secondaryCta.href}>{secondaryCta.label}</Link>
                  </Button>
                )
              ) : null}
            </div>
          ) : null}

          <p className="text-xs text-muted-foreground">{footnote}</p>
        </aside>
      </div>
    </section>
  );
};

export default PlacementHelpSection;
