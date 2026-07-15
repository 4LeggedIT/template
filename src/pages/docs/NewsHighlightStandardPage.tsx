import { Link } from "react-router-dom";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NewsHighlightStandardPage = () => {
  return (
    <>
      <SEOHead
        title="News Highlight Pattern"
        canonicalPath="/docs/standards/news-highlight"
        description="Homepage card that surfaces a single editor-flagged event or news entry."
      />
      <PageHero
        eyebrow="Docs"
        title="News Highlight pattern"
        description="Let an editor flag one event or news entry to surface on the homepage."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "News Highlight Pattern" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Set `highlightOnHome: true` on a single entry in the site's `EventsNewsEntry[]` data (event or news) to surface it on the homepage.</p>
            <p>- Pass the site's full combined `entries` array directly to `NewsHighlightSection` — do not pre-filter at the call site; selection happens inside the component.</p>
            <p>- If more than one entry is flagged at once, the component auto-resolves to the most recently dated one (never fails the build).</p>
            <p>- If nothing is flagged, the component renders nothing — deliberately no fallback to "most recent entry" and no empty-state placeholder. An editor must explicitly flag an entry.</p>
            <p>- Renders `imageSrc`/`imageAlt` only when present; never a broken-image placeholder for entries without one.</p>
            <p>- Distinct from `HomeEventBanner` (dismissible, time-bound event announcements) and from a full `EventsNewsSection` listing (shows everything) — this is a single curated highlight.</p>
            <p>- No dedicated site-specific wrapper file is required; a site's `Index.tsx` (or equivalent home page) imports `NewsHighlightSection` directly and passes its combined entries straight through.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reference</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              - Live example:{" "}
              <Link className="underline underline-offset-4" to="/examples/news-highlight">
                News Highlight example page
              </Link>
            </p>
            <p>- Component: `template/src/components/patterns/NewsHighlightSection.tsx`</p>
            <p>- Shared field: `highlightOnHome?: boolean` on `EventsNewsBaseEntry` in `EventsNewsSection.tsx`</p>
            <p>- Governance contract: `internal-tools/4leggedit-websites/docs/governance/module-wiring-contracts.md`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default NewsHighlightStandardPage;
