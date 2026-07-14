import FoundListingsSection, { type FoundListing } from "@/components/patterns/FoundListingsSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const foundNotices: FoundListing[] = [
  {
    id: "SAMPLE-001",
    source: {
      type: "local",
      name: "Template Intake Board",
    },
    status: "open",
    foundAt: "3/26/2026",
    location: {
      areaLabel: "Eastgate, Example City 90210",
      crossStreets: "Juniper Ave and 3rd St",
    },
    pet: {
      name: "Buddy",
      species: "dog",
      sex: "Male",
      microchipStatus: "Unknown",
    },
    notes: "Friendly tan dog found near a grocery parking lot wearing a blue collar and no tags.",
    media: [
      {
        id: "SAMPLE-001-image-1",
        src: "https://placehold.co/1200x800?text=Sample+Found+Dog+1",
        alt: "Sample found dog notice 1",
        featured: true,
      },
    ],
  },
  {
    id: "SAMPLE-002",
    source: {
      type: "local",
      name: "Template Intake Board",
    },
    status: "open",
    foundAt: "3/29/2026",
    location: {
      areaLabel: "North Hills, Example City 90211",
      crossStreets: "Olive Dr and Canyon Rd",
    },
    pet: {
      name: "Luna",
      species: "dog",
      sex: "Female",
      microchipStatus: "Not Detected",
    },
    notes: "Small black-and-white dog found near a trailhead with a red harness and no owner nearby.",
    media: [
      {
        id: "SAMPLE-002-image-1",
        src: "https://placehold.co/1200x800?text=Sample+Found+Dog+2",
        alt: "Sample found dog notice 2",
        featured: true,
      },
    ],
  },
];

const FoundExamplePage = () => {
  return (
    <>
      <SEOHead
        title="Found Module Example"
        canonicalPath="/examples/found"
        description="Found dog module example with anonymized sample listings for documentation and testing."
      />
      <PageHero
        eyebrow="Examples"
        title="Found module"
        description="Reusable found-dog notices module with checklist, reunification guidance, and notice cards."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Examples", href: "/examples" },
          { label: "Found" },
        ]}
      />

      <section className="container space-y-6 px-4 py-10">
        <FoundListingsSection
          mode="hybrid"
          listings={foundNotices}
          ctaTitle="Submit a Found Notice"
          ctaDescription="Use this example contact block to test your local intake flow and response messaging."
          phoneCta={{ label: "(555) 010-0000", href: "tel:+15550100000" }}
          emailCta={{ label: "Email Notice Details", href: "mailto:hello@example.org?subject=Found%20Notice" }}
          helpLink={{ label: "Visit Found a Stray guidance", href: "/examples/no-js-fallbacks" }}
        />

        <Card>
          <CardHeader>
            <CardTitle>Validation checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Cards render from normalized `FoundListing` metadata (`pet`, `location`, `status`, `source`).</p>
            <p>- Image and source links open safely in a new tab.</p>
            <p>- Contact CTAs support direct `tel:` and `mailto:` actions.</p>
            <p>- Internal support links use Link components and remain no-JS readable as anchors.</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default FoundExamplePage;
