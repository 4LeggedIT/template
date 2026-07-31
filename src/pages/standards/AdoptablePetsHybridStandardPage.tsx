import AdoptablePetsSection from "@/components/patterns/AdoptablePetsSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { localPets } from "@/data/adoptable-pets";
import {
  AFV_ADOPT_A_PET_SHELTER_ID,
  AFV_ADOPT_A_PET_URL,
  AFV_DISCLOSURE,
  AFV_GETBUDDY_ORG_ID,
  AFV_PETFINDER_ORG_ID,
  AFV_PETFINDER_URL,
} from "@/data/afv-example-org";

const AdoptablePetsHybridStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Adoptable Pets — Hybrid"
        canonicalPath="/standards/adoptable-pets/hybrid"
        description="AdoptablePetsSection in hybrid mode: local listings shown alongside one or more provider adapters at once."
      />
      <PageHero
        eyebrow="Standards"
        title="Adoptable Pets — hybrid mode"
        description="Local listings shown alongside one or more provider adapters at once — for a site that curates its own featured pets but also pulls a live feed."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "Adoptable Pets", href: "/standards/adoptable-pets" },
          { label: "Hybrid" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Example</h2>
          <p className="text-sm text-muted-foreground">{AFV_DISCLOSURE}</p>
          <AdoptablePetsSection
            mode="hybrid"
            localPets={localPets}
            petfinder={{
              organizationIds: [AFV_PETFINDER_ORG_ID],
              petfinderUrl: AFV_PETFINDER_URL,
            }}
            adoptAPet={{
              listingsUrl: AFV_ADOPT_A_PET_URL,
              shelterId: AFV_ADOPT_A_PET_SHELTER_ID,
            }}
            getBuddy={{ organizationId: AFV_GETBUDDY_ORG_ID, species: "dog", iframeHeight: 900 }}
            footerCta={{ label: "Apply to Adopt", href: "https://example.org/forms/adopt", external: true }}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Use `mode="hybrid"` when a site curates its own featured pets locally but also wants one or more live provider feeds on the same page.</p>
            <p>- Combine `localPets` with any of `petfinder`, `adoptAPet`, `getBuddy` — each renders its own section in the order: local, then Petfinder, then Adopt-a-Pet, then GetBuddy.</p>
            <p>- Every provider adapter used in hybrid mode still needs its own `listingsUrl`/sibling cross-link URLs — hybrid doesn't relax the no-JS-fallback requirement (the "Or view all pets on..." line) for any individual adapter.</p>
            <p>- Keep conversion actions at section level (`ctas` + `footerCta`) instead of per-card apply buttons — this applies across every mode, including hybrid's multiple sub-sections.</p>
            <p>- `headless=true` renders local listings/cards only, skipping provider embeds and the section title, for embedding inside a custom layout.</p>
            <p>- `labels` overrides section copy (empty-state text, feed names) for i18n/site customization.</p>
            <p>- Component: `template/src/components/patterns/AdoptablePetsSection.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default AdoptablePetsHybridStandardPage;
