import AdoptablePetsSection from "@/components/patterns/AdoptablePetsSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { localPets } from "@/data/adoptable-pets";
import { AFV_DISCLOSURE, AFV_PETFINDER_URL } from "@/data/afv-example-org";

const AdoptablePetsLocalStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Adoptable Pets — Local Listings"
        canonicalPath="/standards/adoptable-pets/local"
        description="AdoptablePetsSection in local mode: pets managed directly in a site's own data file, no external provider needed."
      />
      <PageHero
        eyebrow="Standards"
        title="Adoptable Pets — local listings"
        description="The simplest mode: pets managed directly in a site's own data file, no external provider needed."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "Adoptable Pets", href: "/standards/adoptable-pets" },
          { label: "Local" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Example</h2>
          <p className="text-sm text-muted-foreground">
            {AFV_DISCLOSURE} See their{" "}
            <a className="underline underline-offset-4" href={AFV_PETFINDER_URL} target="_blank" rel="noopener noreferrer">
              full current listing
            </a>{" "}
            for details beyond what's shown here.
          </p>
          <AdoptablePetsSection
            mode="local"
            title="Local listings"
            localPets={localPets}
            footerCta={{ label: "Apply to Adopt", href: "https://example.org/forms/adopt", external: true }}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Use `mode="local"` when pets are managed directly in the site's own data (no external listings provider).</p>
            <p>- For local listings, prefer `birthDate` over static age text so age can update automatically — dynamic age supports puppy/young-dog labels in weeks, then rolls into months/years. Use `ageLabel` only when a precise `birthDate` isn't available, as in the example above.</p>
            <p>- Local listings sort alphabetically by default (`localSort="none"` to preserve input order).</p>
            <p>- Local card images default to full-photo display (`object-contain`); use `localImageFit`/`imageFit` to override.</p>
            <p>- Local cards support optional aliases (`name (aka alias)`) and multi-photo galleries (`images` array).</p>
            <p>- Use `loadLocalAdoptablePets` + `mapLocalAdoptableManifest` for local JSON manifests shaped like Petfinder scrape output.</p>
            <p>- Use `gender` in local pet metadata (never `sex`).</p>
            <p>- `showExpiredListings`/`defaultExpiryMonths` mirror the placement pattern: expired local listings are hidden by default (3-month window) unless `showExpiredListings=true`.</p>
            <p>- `externalRegistries` adds Petfinder/Adopt-a-Pet profile links alongside local cards without switching provider mode.</p>
            <p>- Component: `template/src/components/patterns/AdoptablePetsSection.tsx`</p>
            <p>- Data: `template/src/data/adoptable-pets.ts`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default AdoptablePetsLocalStandardPage;
