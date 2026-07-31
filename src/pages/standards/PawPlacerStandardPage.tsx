import PawPlacerEmbed from "@/components/patterns/PawPlacerEmbed";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EXAMPLE_ORG_ID = "f2dde60b-b590-419c-8433-3df89bebf641";

const PawPlacerStandardPage = () => {
  return (
    <>
      <SEOHead
        title="PawPlacer Pattern"
        canonicalPath="/standards/pawplacer"
        description="Live PawPlacer adoptable-pets widget embed, keyed off an organization ID."
      />
      <PageHero
        eyebrow="Standards"
        title="PawPlacer pattern"
        description="Embeds an organization's live PawPlacer pet listings via their embed script — the PawPlacer equivalent of the Petfinder scroller."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "PawPlacer Pattern" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Example</h2>
          <p className="text-sm text-muted-foreground">
            <code>organizationId</code> is the only required prop — PawPlacer's own script renders that
            organization's real listings into the mounted <code>&lt;div&gt;</code>. It's always PawPlacer's own
            live widget, or nothing — there's no local fallback-data mode. The illustrative sibling URLs below
            demonstrate the "Or view all pets on..." cross-link line shared by every adoptable-pets embed.
          </p>
          <PawPlacerEmbed
            organizationId={EXAMPLE_ORG_ID}
            petfinderUrl="https://example.org/petfinder"
            adoptAPetUrl="https://example.org/adoptapet"
            getbuddyUrl="https://example.org/getbuddy"
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Filtered to one species</h2>
          <p className="text-sm text-muted-foreground">
            Pass <code>species</code> to filter the embed (mirrors PawPlacer's own{" "}
            <code>{"{ species: 'dog' }"}</code> options argument).
          </p>
          <PawPlacerEmbed organizationId={EXAMPLE_ORG_ID} species="dog" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              - On the client, lazily injects PawPlacer's <code>embed/component</code> script (once per page,
              shared across multiple instances) and calls their global{" "}
              <code>embedPawPlacerComponent('pets', organizationId, targetId, options)</code>. The mount target uses
              a generated unique DOM id (<code>useId()</code>-based) so multiple instances never collide.
            </p>
            <p>
              - <code>listingsUrl</code> defaults to{" "}
              <code>https://www.pawplacer.com/shelters/&#123;organizationId&#125;</code> — PawPlacer's equivalent
              of a Petfinder org profile page or an Adopt-a-Pet shelter page. Override only if the org's real
              listings page differs from that pattern.
            </p>
            <p>
              - Cross-links to <code>petfinderUrl</code> / <code>adoptAPetUrl</code> / <code>getbuddyUrl</code>{" "}
              render as "Or view all pets on X, Y, or Z." — the same sentence structure already used by{" "}
              <code>PetfinderScrollerEmbed</code>, <code>AdoptAPetEmbed</code>, and <code>GetBuddyEmbed</code>,
              which all accept a <code>pawPlacerUrl</code> in return, so every adoptable-pets embed can cross-link
              to every other one.
            </p>
            <p>
              - Wired into <code>AdoptablePetsSection</code> as mode <code>"pawplacer"</code> (and as one of the
              feeds shown in <code>"hybrid"</code> mode), matching how <code>getbuddy</code> is wired.
            </p>
            <p>- Component: `template/src/components/patterns/PawPlacerEmbed.tsx`</p>
            <p>
              - Not yet wired into any real site — built as fleet-wide tooling ahead of a confirmed org account.
              The organization ID used above is illustrative, not a real account.
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default PawPlacerStandardPage;
