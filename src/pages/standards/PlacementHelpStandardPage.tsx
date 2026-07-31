import PlacementHelpSection, { type PlacementNeedItem } from "@/components/patterns/PlacementHelpSection";
import { placementListings } from "@/data/placement-listings";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const placementNeeds: PlacementNeedItem[] = [
  { id: "need-1", title: "Safe temporary home", description: "Foster or transfer partner with intake availability.", icon: "home" },
  { id: "need-2", title: "Rescue commitment", description: "Named organization contact with communication response time.", icon: "rescue" },
  { id: "need-3", title: "Transport support", description: "Pickup or transport plan with a confirmed handoff window.", icon: "transport" },
];

const PlacementHelpStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Placement Pattern"
        canonicalPath="/standards/placement-help"
        description="Standardized placement/courtesy-listing module with default expiry and optional pet metadata."
      />
      <PageHero
        eyebrow="Standards"
        title="Placement pattern"
        description="Use this module for placement/courtesy listings with a default three-month expiry window."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "Placement Pattern" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Example</h2>
          <PlacementHelpSection
            listings={placementListings}
            needsSummary="Courtesy listings shared after evaluation by the rescue team."
            needsChecklistItems={[
              "Temperament evaluated",
              "Fully vaccinated",
              "Spayed or neutered",
              "Owner/guardian contact information provided with inquiry",
            ]}
            primaryCta={{ label: "Submit placement request", href: "mailto:placements@example.org", external: true }}
            secondaryCta={{ label: "Placement process", href: "/standards/placement-help" }}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Showing expired listings</h2>
          <p className="text-sm text-muted-foreground">
            <code>showExpiredListings</code> is opt-in — this is what a review queue (rather than the public page)
            would set to see listings past their expiry window.
          </p>
          <PlacementHelpSection
            title="Placement listings (show expired)"
            listingsTitle="Review queue"
            showExpiredListings
            listings={placementListings}
            needs={placementNeeds}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Use `PlacementHelpSection` for all placement/courtesy listing sections.</p>
            <p>- Default expiry is 3 months when `postedAt` is set and `expiresAt` is omitted.</p>
            <p>- `expiresAt` is optional and overrides the default expiry window.</p>
            <p>- Keep expired listings hidden by default (`showExpiredListings=false`); expired listings are hidden unless explicitly enabled.</p>
            <p>- Include optional pet metadata when available (breed, size, color, gender, vaccination, etc.) — it renders without breaking no-data cards when omitted.</p>
            <p>- Use `needs`/`needsTitle`/`needsSummary`/`needsChecklistItems` for a separate "what's needed" section (fosters, supplies, volunteers) alongside the courtesy listings.</p>
            <p>- `primaryCta`/`secondaryCta` provide the section-level call-to-action links (for example, "Submit placement request").</p>
            <p>- `labels` overrides section copy for i18n/site customization.</p>
            <p>- Component: `template/src/components/patterns/PlacementHelpSection.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default PlacementHelpStandardPage;
