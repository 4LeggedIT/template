import AdoptablePetsSection from "@/components/patterns/AdoptablePetsSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AFV_ADOPT_A_PET_URL,
  AFV_DISCLOSURE,
  AFV_GETBUDDY_URL,
  AFV_PETFINDER_ORG_ID,
  AFV_PETFINDER_URL,
} from "@/data/afv-example-org";

const AdoptablePetsPetfinderStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Adoptable Pets — Petfinder"
        canonicalPath="/standards/adoptable-pets/petfinder"
        description="AdoptablePetsSection in petfinder mode: Petfinder's own pet-scroller widget, keyed off an organization ID."
      />
      <PageHero
        eyebrow="Standards"
        title="Adoptable Pets — Petfinder"
        description="Petfinder's own live pet-scroller widget, embedded via organization ID."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "Adoptable Pets", href: "/standards/adoptable-pets" },
          { label: "Petfinder" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Example</h2>
          <p className="text-sm text-muted-foreground">{AFV_DISCLOSURE}</p>
          <AdoptablePetsSection
            mode="petfinder"
            petfinder={{
              organizationIds: [AFV_PETFINDER_ORG_ID],
              petfinderUrl: AFV_PETFINDER_URL,
              adoptAPetUrl: AFV_ADOPT_A_PET_URL,
              getbuddyUrl: AFV_GETBUDDY_URL,
            }}
            footerCta={{ label: "Apply to Adopt", href: "https://example.org/forms/adopt", external: true }}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Use `mode="petfinder"` (or the standalone `PetfinderScrollerEmbed`) to render Petfinder's own `pet-scroller` widget for one or more `organizationIds`.</p>
            <p>- `organizationIds` are Petfinder's own org ID(s) (e.g. `CA542`) — found in the org's Petfinder profile URL slug.</p>
            <p>- The "Or view all pets on..." cross-link line is the no-JS-safe fallback — always provide `adoptAPetUrl`/`getbuddyUrl`/`pawPlacerUrl` for whichever sibling platforms the org is actually on, so content stays reachable if the widget script fails or JS is unavailable.</p>
            <p>- Standard helper line is part of the adapter (`Or view all pets on Petfinder`) — cross-links to `adoptAPetUrl`/`getbuddyUrl`/`pawPlacerUrl` render alongside it automatically when those props are set.</p>
            <p>- Component: `template/src/components/patterns/PetfinderScrollerEmbed.tsx`, wired into `AdoptablePetsSection.tsx` as mode `"petfinder"`.</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default AdoptablePetsPetfinderStandardPage;
