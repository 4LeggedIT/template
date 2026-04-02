import { Link } from "react-router-dom";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdoptablePetsStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Adoptable Pets Pattern"
        canonicalPath="/docs/standards/adoptable-pets"
        description="Standardized adoptable pets module with provider adapters."
      />
      <PageHero
        eyebrow="Docs"
        title="Adoptable pets pattern"
        description="Use one module for local listings and provider adapters (`petfinder`, `adopt_a_pet`, `getbuddy`)."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "Adoptable Pets Pattern" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Use `AdoptablePetsSection` as the single public adoptable-pets shell.</p>
            <p>- Supported modes: `local`, `petfinder`, `adopt_a_pet`, `getbuddy`, and `hybrid`.</p>
            <p>- Keep provider configuration in adapter props, not page-local embed logic.</p>
            <p>- Always provide provider fallbacks (links/cards) so content is usable without JS.</p>
            <p>- Keep provider fallback text in the adapter component only (no page-level duplicates).</p>
            <p>- Standard helper line is part of provider adapters (`Or view all pets on ...`).</p>
            <p>- For local listings, prefer `birthDate` over static age text so age can update automatically.</p>
            <p>- Local age rendering supports dynamic puppy/young-dog labels from `birthDate` (weeks for very young pets, then months/years).</p>
            <p>- Local listings sort alphabetically by default (`localSort=&quot;none&quot;` to preserve input order).</p>
            <p>- Local card images default to full-photo display (`object-contain`); use `localImageFit`/`imageFit` to override.</p>
            <p>- Local cards support optional aliases (`name (aka alias)`) and multi-photo galleries (`images` array).</p>
            <p>- Use `gender` in local/adaptable pet metadata (do not use `sex`).</p>
            <p>- Use `loadLocalAdoptablePets` + `mapLocalAdoptableManifest` for local JSON manifests shaped like Petfinder scrape output.</p>
            <p>- Keep conversion actions at section level (`ctas` + `footerCta`) instead of per-card apply buttons.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reference</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              - Live example:{" "}
              <Link className="underline underline-offset-4" to="/examples/adoptable-pets">
                Adoptable pets example page
              </Link>
            </p>
            <p>- Component: `template/src/components/patterns/AdoptablePetsSection.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default AdoptablePetsStandardPage;
