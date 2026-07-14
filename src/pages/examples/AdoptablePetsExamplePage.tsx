import AdoptablePetsSection from "@/components/patterns/AdoptablePetsSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { localPets } from "@/data/adoptable-pets";

const AdoptablePetsExamplePage = () => {
  return (
    <>
      <SEOHead
        title="Adoptable Pets Example"
        canonicalPath="/examples/adoptable-pets"
        description="Provider-agnostic adoptable pets example with petfinder, adopt-a-pet, getbuddy, and local listings."
      />
      <PageHero
        eyebrow="Examples"
        title="Adoptable pets module"
        description="Unified adoptable pets module with provider adapters and no-JS-safe fallbacks."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Examples", href: "/examples" },
          { label: "Adoptable Pets" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        <AdoptablePetsSection
          mode="local"
          title="Local listings"
          description="Pets managed directly in src/data/adoptable-pets.ts — no external provider needed."
          localPets={localPets}
          footerCta={{ label: "Apply to Adopt", href: "https://example.org/forms/adopt", external: true }}
        />

        <AdoptablePetsSection
          mode="adopt_a_pet"
          adoptAPet={{
            title: "Adopt-a-Pet listings",
            listingsUrl: "https://www.adoptapet.com/",
            fallbackPets: [
              {
                id: "aap-1",
                name: "Example Pup",
                summary: "Fallback preview listing for adapter validation.",
                href: "https://www.adoptapet.com/",
              },
            ],
          }}
          footerCta={{ label: "Apply to Adopt", href: "https://example.org/forms/adopt", external: true }}
        />

        <AdoptablePetsSection
          mode="getbuddy"
          getBuddy={{
            title: "GetBuddy listings",
            organizationId: "698df87638deec858362b42b",
            species: "dog",
            iframeHeight: 900,
          }}
          footerCta={{ label: "Apply to Adopt", href: "https://example.org/forms/adopt", external: true }}
        />

        <AdoptablePetsSection
          title="Hybrid mode"
          description="Hybrid mode can show local listings with one or more provider adapters."
          mode="hybrid"
          localPets={localPets}
          petfinder={{
            organizationIds: ["CA0000"],
            fallbackPets: [
              {
                id: "pf-1",
                name: "Example Dog",
                href: "https://www.petfinder.com/",
              },
            ],
          }}
          adoptAPet={{
            listingsUrl: "https://www.adoptapet.com/",
            fallbackPets: [
              {
                id: "aap-2",
                name: "Example Senior",
                href: "https://www.adoptapet.com/",
              },
            ],
          }}
          getBuddy={{
            organizationId: "698df87638deec858362b42b",
            species: "dog",
            iframeHeight: 900,
          }}
          footerCta={{ label: "Apply to Adopt", href: "https://example.org/forms/adopt", external: true }}
        />

        <Card>
          <CardHeader>
            <CardTitle>Validation checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- `mode=&quot;local&quot;` renders local listings from src/data/adoptable-pets.ts.</p>
            <p>- `mode=&quot;adopt_a_pet&quot;` renders Adopt-a-Pet adapter only.</p>
            <p>- `mode=&quot;getbuddy&quot;` renders GetBuddy adapter only.</p>
            <p>- `mode=&quot;hybrid&quot;` supports local + provider adapters together.</p>
            <p>- Provider fallback links/cards remain available with or without JS.</p>
            <p>- Local pet age is derived dynamically from `birthDate` — no manual update needed.</p>
            <p>- `size` appears in the photo overlay alongside age, gender, and breed.</p>
            <p>- `temperament` and `goodWith*` appear as chips below the summary.</p>
            <p>- All module labels are overridable via the `labels` prop for i18n support.</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default AdoptablePetsExamplePage;
