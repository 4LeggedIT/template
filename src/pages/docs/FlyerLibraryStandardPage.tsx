import { Link } from "react-router-dom";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FlyerLibraryStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Flyer Library Pattern"
        canonicalPath="/docs/standards/flyer-library"
        description="Standardized pattern for timeless, undated awareness and informational flyers."
      />
      <PageHero
        eyebrow="Docs"
        title="Flyer library pattern"
        description="Use FlyerLibrarySection for evergreen awareness flyers that have no event date and are not a news article."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "Flyer Library Pattern" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Use `FlyerLibrarySection` for undated, non-news awareness/informational flyers (foster recruitment, volunteer recruitment, spay/neuter awareness, safety education).</p>
            <p>- Never combine flyer content with `EventsNewsSection`'s dated event/news data — a flyer belongs here specifically because it has no date or venue.</p>
            <p>- `category` is required on every `FlyerLibraryItem` so filter pills stay meaningful; an uncategorized flyer would otherwise be unreachable in a filtered view.</p>
            <p>- Core flyer images render via anchor + `img`, so browsing works without JavaScript.</p>
            <p>- Category filter pills and the lightbox are optional progressive enhancements, not the primary access path.</p>
            <p>- Download uses a plain `&lt;a download&gt;` link, not the Printable Material Module's print layout — flyers are pre-made images, not generated documents.</p>
            <p>- Use `categoryFilter` to lock the section to a single category and hide the pills, for embedding a filtered teaser on another page (e.g. a foster flyer on the Foster page).</p>
            <p>- Defaults: `columns=3`, `showFilters=true`, `enableLightbox=true`.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reference</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              - Live example:{" "}
              <Link className="underline underline-offset-4" to="/examples/flyer-library">
                Flyer library example page
              </Link>
            </p>
            <p>- Component: `template/src/components/patterns/FlyerLibrarySection.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default FlyerLibraryStandardPage;
