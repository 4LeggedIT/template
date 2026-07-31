import AdoptablePetsSection from "@/components/patterns/AdoptablePetsSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AFV_ADOPT_A_PET_URL,
  AFV_DISCLOSURE,
  AFV_GETBUDDY_ORG_ID,
  AFV_GETBUDDY_URL,
  AFV_PETFINDER_URL,
} from "@/data/afv-example-org";

const AdoptablePetsGetBuddyStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Adoptable Pets — GetBuddy"
        canonicalPath="/standards/adoptable-pets/getbuddy"
        description="AdoptablePetsSection in getbuddy mode: GetBuddy's embeddable listings iframe, keyed off an organization ID."
      />
      <PageHero
        eyebrow="Standards"
        title="Adoptable Pets — GetBuddy"
        description="GetBuddy's embeddable listings iframe, keyed off an organization ID."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "Adoptable Pets", href: "/standards/adoptable-pets" },
          { label: "GetBuddy" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Example</h2>
          <p className="text-sm text-muted-foreground">{AFV_DISCLOSURE}</p>
          <AdoptablePetsSection
            mode="getbuddy"
            getBuddy={{
              title: "GetBuddy listings",
              organizationId: AFV_GETBUDDY_ORG_ID,
              species: "dog",
              iframeHeight: 900,
              listingsUrl: AFV_GETBUDDY_URL,
              petfinderUrl: AFV_PETFINDER_URL,
              adoptAPetUrl: AFV_ADOPT_A_PET_URL,
            }}
            footerCta={{ label: "Apply to Adopt", href: "https://example.org/forms/adopt", external: true }}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Use `mode="getbuddy"` (or the standalone `GetBuddyEmbed`) for a site whose listings are managed on GetBuddy.</p>
            <p>- `organizationId` is GetBuddy's own org ID — found in the org's GetBuddy shelter page URL.</p>
            <p>- `species` filters the embed (e.g. `"dog"`); `iframeHeight` controls the mounted iframe's height, `showIframe=false` renders link-out only.</p>
            <p>- `listingsUrl` (optional) is the org's own GetBuddy shelter page — used for the "Or view all pets on GetBuddy" link and as the no-JS fallback destination.</p>
            <p>- Standard helper line is part of the adapter (`Or view all pets on GetBuddy`) — cross-links to `petfinderUrl`/`adoptAPetUrl`/`pawPlacerUrl` render alongside it automatically when those props are set.</p>
            <p>- Component: `template/src/components/patterns/GetBuddyEmbed.tsx`, wired into `AdoptablePetsSection.tsx` as mode `"getbuddy"`.</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default AdoptablePetsGetBuddyStandardPage;
