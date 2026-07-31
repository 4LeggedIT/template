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

const FoundStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Found Pattern"
        canonicalPath="/standards/found"
        description="Standardized found-notices module with safe reunification and contact CTA guidance."
      />
      <PageHero
        eyebrow="Standards"
        title="Found pattern"
        description="Use this module for found-pet notices, intake checklist guidance, and safe reunification communication."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "Found Pattern" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Example</h2>
          <p className="text-sm text-muted-foreground">
            The CTA title, contact details, and help link below are all page-local props passed to{" "}
            <code>FoundListingsSection</code> — never hardcoded in the shared component — so every real site swaps
            in its own intake contact info here, not by editing the module.
          </p>
          <FoundListingsSection
            mode="hybrid"
            listings={foundNotices}
            ctaTitle="Submit a Found Notice"
            ctaDescription="Use this example contact block to test your local intake flow and response messaging."
            phoneCta={{ label: "(555) 010-0000", href: "tel:+15550100000" }}
            emailCta={{ label: "Email Notice Details", href: "mailto:hello@example.org?subject=Found%20Notice" }}
            helpLink={{ label: "Visit Found a Stray guidance", href: "/standards/found" }}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Use `FoundListingsSection` for all found-notice pages.</p>
            <p>- Keep listing data normalized in `FoundListing` objects (`pet`, `location`, `source`, `status`).</p>
            <p>- Use mode controls (`local`, `external`, `hybrid`) instead of page-local filtering logic.</p>
            <p>- Keep warnings/checklists in module props so content is reusable and no-JS readable.</p>
            <p>- Source/media links should open in a new tab with safe rel attributes.</p>
            <p>- Keep CTA contact info (title, phone, email, help link) anonymized in template/example content — real sites pass their own via props (`ctaTitle`, `phoneCta`, `emailCta`, `helpLink`), never by editing the module.</p>
            <p>- Use neutral styling defaults (no site-specific color branding in shared standards).</p>
            <p>- Use `statusFilter` plus `showReunited`/`showArchived` (both default `false`) to control found-notice lifecycle visibility — active notices show by default; reunited/archived are opt-in.</p>
            <p>- Cards render from normalized `FoundListing` metadata (`pet`, `location`, `status`, `source`); image and source links open safely in a new tab; internal support links use `Link` components and remain no-JS readable as anchors.</p>
            <p>- Component: `template/src/components/patterns/FoundListingsSection.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default FoundStandardPage;
