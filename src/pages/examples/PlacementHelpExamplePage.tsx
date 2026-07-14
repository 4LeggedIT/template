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


const PlacementHelpExamplePage = () => {
  return (
    <>
      <SEOHead
        title="Placement Help Example"
        canonicalPath="/examples/placement-help"
        description="Placement module example with expiry handling, metadata, and layout variants."
      />
      <PageHero
        eyebrow="Examples"
        title="Placement module"
        description="Reusable placement/courtesy-listing module with default expiry policy and optional pet metadata."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Examples", href: "/examples" },
          { label: "Placement Help" },
        ]}
      />

      <section className="container space-y-6 px-4 py-10">
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
          secondaryCta={{ label: "Placement process", href: "/docs/standards/placement-help" }}
        />

        <PlacementHelpSection
          title="Placement listings (show expired)"
          listingsTitle="Review queue"
          showExpiredListings
          listings={placementListings}
          needs={placementNeeds}
        />

        <PlacementHelpSection
          title="Placement listings (empty state)"
          listings={[]}
          needs={placementNeeds}
        />

        <Card>
          <CardHeader>
            <CardTitle>Validation checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Default expiry applies when `postedAt` is set and `expiresAt` is omitted.</p>
            <p>- Explicit `expiresAt` overrides default three-month expiration.</p>
            <p>- Expired listings are hidden unless `showExpiredListings` is enabled.</p>
            <p>- Optional pet metadata renders without breaking no-data cards.</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default PlacementHelpExamplePage;
