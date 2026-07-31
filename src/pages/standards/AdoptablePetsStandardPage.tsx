import { Link } from "react-router-dom";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const modePages = [
  {
    title: "Local",
    href: "/standards/adoptable-pets/local",
    description: "Pets managed directly in a site's own data file, no external provider needed.",
  },
  {
    title: "Petfinder",
    href: "/standards/adoptable-pets/petfinder",
    description: "Petfinder's own live pet-scroller widget, embedded via organization ID.",
  },
  {
    title: "Adopt-a-Pet",
    href: "/standards/adoptable-pets/adopt-a-pet",
    description: "Links out to an org's Adopt-a-Pet shelter page, with fallback preview cards.",
  },
  {
    title: "GetBuddy",
    href: "/standards/adoptable-pets/getbuddy",
    description: "GetBuddy's embeddable listings iframe, keyed off an organization ID.",
  },
  {
    title: "PawPlacer",
    href: "/standards/pawplacer",
    description: "PawPlacer's own live embed script, keyed off an organization ID — has its own dedicated pattern page.",
  },
  {
    title: "Hybrid",
    href: "/standards/adoptable-pets/hybrid",
    description: "Local listings shown alongside one or more provider adapters at once.",
  },
];

const AdoptablePetsStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Adoptable Pets Pattern"
        canonicalPath="/standards/adoptable-pets"
        description="Standardized adoptable pets module with provider adapters."
      />
      <PageHero
        eyebrow="Standards"
        title="Adoptable pets pattern"
        description="One module for local listings and provider adapters (petfinder, adoptapet, getbuddy, pawplacer) — pick a mode per site, or combine them with hybrid. Each mode has its own dedicated page with a live example."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "Adoptable Pets Pattern" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modePages.map((page) => (
            <Link key={page.href} to={page.href} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="text-lg">{page.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{page.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Use `AdoptablePetsSection` as the single public adoptable-pets shell.</p>
            <p>- Supported modes: `local`, `petfinder`, `adoptapet`, `getbuddy`, `pawplacer`, and `hybrid` — see the dedicated page above for each mode's own example and rules.</p>
            <p>- Keep provider configuration in adapter props, not page-local embed logic.</p>
            <p>- Always provide provider fallbacks (links/cards) so content is usable without JS.</p>
            <p>- Keep provider fallback text in the adapter component only (no page-level duplicates).</p>
            <p>- Standard helper line is part of provider adapters (`Or view all pets on ...`) — set the sibling `petfinderUrl`/`adoptAPetUrl`/`getbuddyUrl`/`pawPlacerUrl` props on whichever adapter is active so it cross-links to every platform the org is actually listed on.</p>
            <p>- Keep conversion actions at section level (`ctas` + `footerCta`) instead of per-card apply buttons.</p>
            <p>- `headless=true` renders local listings/cards only, skipping provider embeds and the section title, for embedding inside a custom layout.</p>
            <p>- `petVariant="placement"` switches card styling/copy for placement (vs adoptable) listings; default is `"adoptable"`.</p>
            <p>- `labels` overrides section copy (empty-state text, feed names) for i18n/site customization.</p>
            <p>- Component: `template/src/components/patterns/AdoptablePetsSection.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default AdoptablePetsStandardPage;
