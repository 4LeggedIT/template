import AdoptablePetsSection from "@/components/patterns/AdoptablePetsSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AFV_ADOPT_A_PET_SHELTER_ID,
  AFV_ADOPT_A_PET_URL,
  AFV_DISCLOSURE,
  AFV_GETBUDDY_URL,
  AFV_PETFINDER_URL,
} from "@/data/afv-example-org";

const AdoptablePetsAdoptAPetStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Adoptable Pets — Adopt-a-Pet"
        canonicalPath="/standards/adoptable-pets/adopt-a-pet"
        description="AdoptablePetsSection in adoptapet mode: an Adopt-a-Pet shelter page linked out, with an optional live widget."
      />
      <PageHero
        eyebrow="Standards"
        title="Adoptable Pets — Adopt-a-Pet"
        description="Links out to an org's Adopt-a-Pet shelter page, with an optional live widget when a shelterId is available."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "Adoptable Pets", href: "/standards/adoptable-pets" },
          { label: "Adopt-a-Pet" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Example</h2>
          <p className="text-sm text-muted-foreground">{AFV_DISCLOSURE}</p>
          <AdoptablePetsSection
            mode="adoptapet"
            adoptAPet={{
              title: "Adopt-a-Pet listings",
              listingsUrl: AFV_ADOPT_A_PET_URL,
              shelterId: AFV_ADOPT_A_PET_SHELTER_ID,
              petfinderUrl: AFV_PETFINDER_URL,
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
            <p>- Use `mode="adoptapet"` (or the standalone `AdoptAPetEmbed`) for a site whose listings live on Adopt-a-Pet rather than Petfinder/GetBuddy/PawPlacer.</p>
            <p>- `listingsUrl` is the org's Adopt-a-Pet shelter page — strip tracking query params (utm_*, gclid, gbraid, gad_*) before using it as a canonical link.</p>
            <p>- `shelterId` is the numeric ID in that URL's slug (e.g. `74343` from `/shelter/74343-org-name`). When set, renders Adopt-a-Pet's real "Pet Scroller" widget — their script sets a global `AAPPetScrollerSettings` object and uses `document.write()`, so it's mounted inside an isolated iframe (`srcDoc`) rather than injected into the page directly, matching the exact embed code Adopt-a-Pet issues per shelter. `scrollerWidth`/`scrollerHeight` default to their own defaults (450×320).</p>
            <p>- The "Or view all pets on..." cross-link line is the no-JS-safe fallback — it always renders as a plain link regardless of whether `shelterId`'s widget loads.</p>
            <p>- Standard helper line is part of the adapter (`Or view all pets on Adopt-a-Pet`) — cross-links to `petfinderUrl`/`getbuddyUrl`/`pawPlacerUrl` render alongside it automatically when those props are set.</p>
            <p>- Component: `template/src/components/patterns/AdoptAPetEmbed.tsx`, wired into `AdoptablePetsSection.tsx` as mode `"adoptapet"`.</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default AdoptablePetsAdoptAPetStandardPage;
