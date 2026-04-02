import { Home, Mail, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import PetCard, { type PetCardItem } from "@/components/patterns/PetCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PetProfile } from "@/types/petProfile";
import { cn } from "@/lib/utils";

export type PlacementListingItem = PetProfile &
  PetCardItem & {
  id: string;
  imageSrc: string;
  imageAlt: string;
  placementType?: "owner-surrender" | "shelter-transfer" | "stray-hold" | "courtesy-listing";
  inquiryMailto?: string;
};

export type PlacementNeedItem = {
  id: string;
  title: string;
  description: string;
  icon?: "home" | "rescue" | "transport";
};

type PlacementHelpSectionProps = {
  title?: string;
  description?: string;
  className?: string;
  listingsTitle?: string;
  listingsDescription?: string;
  listings: PlacementListingItem[];
  listingLayout?: "grid" | "stacked";
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

const addMonthsUtc = (date: Date, months: number) => {
  const next = new Date(date.getTime());
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
};

const parseYmdUtc = (value?: string) => {
  if (!value) return null;
  const ms = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(ms) ? new Date(ms) : null;
};

const toExpiryMs = (listing: PlacementListingItem, defaultExpiryMonths: number) => {
  const explicit = parseYmdUtc(listing.expiresAt);
  if (explicit) return explicit.getTime();
  const posted = parseYmdUtc(listing.postedAt);
  if (!posted) return null;
  return addMonthsUtc(posted, defaultExpiryMonths).getTime();
};

const PlacementHelpSection = ({
  title = "Placement Help",
  description = "Courtesy listings and placement support requirements for time-sensitive rescue networking.",
  className,
  listingsTitle = "These are courtesy photos to help with networking. If you can help with placement, we’ll share more details.",
  listingsDescription,
  listings,
  listingLayout = "grid",
  showExpiredListings = false,
  defaultExpiryMonths = 3,
  needsTitle,
  needs = [],
  needsSummary,
  needsChecklistItems = [],
  primaryCta,
  secondaryCta,
  footnote = "Email is usually best so photos, location, and a short case summary can be shared quickly.",
}: PlacementHelpSectionProps) => {
  const showHeader = Boolean(title || description);
  const nowMs = Date.now();
  const processedListings = listings
    .map((listing) => {
      const expiryMs = toExpiryMs(listing, defaultExpiryMonths);
      const isExpired = typeof expiryMs === "number" ? nowMs >= expiryMs : false;
      return { listing, expiryMs, isExpired };
    })
    .sort((left, right) => {
      const leftUrgency = left.listing.urgency === "critical" ? 0 : left.listing.urgency === "high" ? 1 : 2;
      const rightUrgency = right.listing.urgency === "critical" ? 0 : right.listing.urgency === "high" ? 1 : 2;
      if (leftUrgency !== rightUrgency) return leftUrgency - rightUrgency;
      const leftPosted = parseYmdUtc(left.listing.postedAt)?.getTime() ?? 0;
      const rightPosted = parseYmdUtc(right.listing.postedAt)?.getTime() ?? 0;
      return rightPosted - leftPosted;
    });

  const visibleListings = showExpiredListings
    ? processedListings
    : processedListings.filter((item) => !item.isExpired);
  const expiredCount = processedListings.filter((item) => item.isExpired).length;

  return (
    <section className={cn("rounded-2xl border border-border bg-card/40 p-6", className)}>
      {showHeader ? (
        <div className="mb-6">
          {title ? <h3 className="text-xl font-semibold tracking-tight">{title}</h3> : null}
          {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
        </div>
      ) : null}

      <div className="space-y-6">
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="text-lg">{listingsTitle}</CardTitle>
            {listingsDescription ? <p className="text-sm text-muted-foreground">{listingsDescription}</p> : null}
            {!showExpiredListings && expiredCount ? (
              <p className="text-xs text-muted-foreground">
                {expiredCount} expired listing{expiredCount === 1 ? "" : "s"} hidden. Set `showExpiredListings` to
                review archive entries.
              </p>
            ) : null}
          </CardHeader>
          <CardContent>
            {visibleListings.length ? (
              <div className={cn("gap-3", listingLayout === "grid" ? "grid grid-cols-2 md:grid-cols-3" : "space-y-3")}>
                {visibleListings.map(({ listing, isExpired }) => (
                  <PetCard
                    key={listing.id}
                    pet={listing}
                    variant="placement"
                    imageFit="contain"
                    imageHref={listing.imageSrc}
                    isExpired={isExpired}
                    defaultExpiryMonths={defaultExpiryMonths}
                    className="border-border/70"
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                No active placement listings are posted right now.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/80">
          {needsTitle ? (
            <CardHeader>
              <CardTitle className="text-lg">{needsTitle}</CardTitle>
            </CardHeader>
          ) : null}
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PlacementHelpSection;
