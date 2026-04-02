import PlacementHelpSection, { type PlacementListingItem, type PlacementNeedItem } from "@/components/patterns/PlacementHelpSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const placementNeeds: PlacementNeedItem[] = [
  { id: "need-1", title: "Safe temporary home", description: "Foster or transfer partner with intake availability.", icon: "home" },
  { id: "need-2", title: "Rescue commitment", description: "Named organization contact with communication response time.", icon: "rescue" },
  { id: "need-3", title: "Transport support", description: "Pickup or transport plan with a confirmed handoff window.", icon: "transport" },
];

const placementListings: PlacementListingItem[] = [
  {
    id: "placement-1",
    imageSrc: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Brown dog looking at camera",
    name: "Maple",
    breed: "Mixed Breed",
    ageLabel: "2 years",
    sex: "Female",
    size: "Medium",
    color: "Brown/White",
    isSpayedNeutered: true,
    isVaccinated: true,
    isMicrochipped: true,
    urgency: "high",
    postedAt: "2026-02-01",
    locationLabel: "Example County, ST",
    temperament: "Social with people, dog-selective, crate trained.",
    inquiryMailto: "mailto:placements@example.org?subject=Placement%20Inquiry%20-%20Maple",
  },
  {
    id: "placement-2",
    imageSrc: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Dog standing on grass",
    name: "Ranger",
    breed: "Labrador Mix",
    ageLabel: "4 years",
    sex: "Male",
    size: "Large",
    color: "Black",
    isSpayedNeutered: true,
    isVaccinated: true,
    postedAt: "2026-01-15",
    expiresAt: "2026-05-01",
    locationLabel: "Example City, ST",
    temperament: "Calm indoors, enjoys walks, no cats.",
    inquiryMailto: "mailto:placements@example.org?subject=Placement%20Inquiry%20-%20Ranger",
  },
  {
    id: "placement-3",
    imageSrc: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Small tan dog close-up",
    name: "Poppy",
    breed: "Terrier Mix",
    ageLabel: "1 year",
    sex: "Female",
    size: "Small",
    color: "Tan",
    urgency: "critical",
    postedAt: "2025-08-01",
    locationLabel: "Example Region, ST",
    statusLabel: "Urgent foster needed",
    temperament: "Friendly and active. Needs placement this week.",
    inquiryMailto: "mailto:placements@example.org?subject=Urgent%20Placement%20-%20Poppy",
  },
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
          title="Placement listings (stacked variant)"
          listingsTitle="Review queue"
          listingLayout="stacked"
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
