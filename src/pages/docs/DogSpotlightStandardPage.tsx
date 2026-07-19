import { Link } from "react-router-dom";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DogSpotlightStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Dog Spotlight Pattern"
        canonicalPath="/docs/standards/dog-spotlight"
        description="Homepage grid highlighting a hand-curated set of dogs, four across on desktop."
      />
      <PageHero
        eyebrow="Docs"
        title="Dog Spotlight pattern"
        description="Highlight a curated set of dogs — e.g. longest-waiting residents — in a 4-across grid, each linking out to their listing."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "Dog Spotlight Pattern" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              - <code>dogs</code> is <code>LocalAdoptableManifestItem[]</code> (from <code>adoptable-local-manifest.ts</code>)
              — the same source-agnostic manifest shape used elsewhere in the ecosystem, so this data can start as a
              hand-curated array and later be swapped for an automated GetBuddy/Petfinder/local-manifest pull without
              changing the component.
            </p>
            <p>- Selection of which dogs to feature is entirely a call-site concern — pass in exactly the curated list, in the order you want it shown. There is no built-in sort/filter.</p>
            <p>- Grid is fixed at up to 4 across (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) — this component's whole purpose is the 4-card spotlight row, not a general-purpose gallery, so there is deliberately no `columns` prop.</p>
            <p>- Age • gender line is computed via `resolvePetAgeLabel()` from `lib/pet-age.ts` (never hand-rolled) using each item's `age`/`birthDate`.</p>
            <p>- The CTA button (default "Meet {'{'}Name{'}'}", via `labels.ctaPrefix`) renders only when `detailsUrl` is present — a dog without one still renders its card, just without a button. `ctaPrefix` is a plain word/phrase (e.g. "Meet", "Adopt"), never a `{'{'}{'{'}token{'}'}{'}'}`-style template string, so it's safe to pass straight through i18next's `t()` without colliding with its own interpolation syntax.</p>
            <p>- If `dogs` is empty, the component renders nothing — no empty-state placeholder.</p>
            <p>- Distinct from `AdoptablePetsSection` (the full adoptable-pets listing shell with Petfinder/Adopt-a-Pet/GetBuddy/local-manifest provider modes) — this is a small, separate curated highlight, not a listing provider.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reference</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              - Live example:{" "}
              <Link className="underline underline-offset-4" to="/examples/dog-spotlight">
                Dog Spotlight example page
              </Link>
            </p>
            <p>- Component: `template/src/components/patterns/DogSpotlightSection.tsx`</p>
            <p>- Shared type: `LocalAdoptableManifestItem` in `adoptable-local-manifest.ts`</p>
            <p>- Governance contract: `internal-tools/4leggedit-websites/docs/governance/module-wiring-contracts.md`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default DogSpotlightStandardPage;
