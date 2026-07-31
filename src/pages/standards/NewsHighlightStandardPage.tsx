import NewsHighlightSection from "@/components/patterns/NewsHighlightSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EventsNewsEntry } from "@/components/patterns/EventsNewsSection";
import { eventsNewsExampleEntries } from "@/pages/examples/eventsNewsExampleData";

const withImageEntries: EventsNewsEntry[] = eventsNewsExampleEntries.map((entry) =>
  entry.id === "news-local-spotlight-2026-02-24"
    ? {
        ...entry,
        highlightOnHome: true,
        imageSrc: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Volunteers and a rescued dog at a community adoption event",
      }
    : entry,
);

const withoutImageEntries: EventsNewsEntry[] = eventsNewsExampleEntries.map((entry) =>
  entry.id === "news-grant-2026-03-01" ? { ...entry, highlightOnHome: true } : entry,
);

const NewsHighlightStandardPage = () => {
  return (
    <>
      <SEOHead
        title="News Highlight Pattern"
        canonicalPath="/standards/news-highlight"
        description="Homepage card that surfaces a single editor-flagged event or news entry."
      />
      <PageHero
        eyebrow="Standards"
        title="News Highlight pattern"
        description="Let an editor flag one event or news entry to surface on the homepage."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "News Highlight Pattern" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Example — with an image</h2>
          <p className="text-sm text-muted-foreground">
            The flagged entry (<code>news-local-spotlight-2026-02-24</code>) has an <code>imageSrc</code>, so the
            card renders it.
          </p>
          <NewsHighlightSection entries={withImageEntries} />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Without an image</h2>
          <p className="text-sm text-muted-foreground">
            The flagged entry (<code>news-grant-2026-03-01</code>) has no <code>imageSrc</code> — the card renders
            text-only, never a broken-image placeholder.
          </p>
          <NewsHighlightSection entries={withoutImageEntries} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Set `highlightOnHome: true` on a single entry in the site's `EventsNewsEntry[]` data (event or news) to surface it on the homepage.</p>
            <p>- Pass the site's full combined `entries` array directly to `NewsHighlightSection` — do not pre-filter at the call site; selection happens inside the component.</p>
            <p>- If more than one entry is flagged at once, the component auto-resolves to the most recently dated one (never fails the build).</p>
            <p>- When no entry has `highlightOnHome: true`, the component renders nothing at all — deliberately no fallback to "most recent entry" and no empty-state placeholder. An editor must explicitly flag the entry they want surfaced.</p>
            <p>- Renders `imageSrc`/`imageAlt` only when present; never a broken-image placeholder for entries without one.</p>
            <p>- Distinct from `HomeEventBanner` (dismissible, time-bound event announcements) and from a full `EventsNewsSection` listing (shows everything) — this is a single curated highlight.</p>
            <p>- No dedicated site-specific wrapper file is required; a site's `Index.tsx` (or equivalent home page) imports `NewsHighlightSection` directly and passes its combined entries straight through.</p>
            <p>- Shared field: `highlightOnHome?: boolean` on `EventsNewsBaseEntry` in `EventsNewsSection.tsx`</p>
            <p>- Component: `template/src/components/patterns/NewsHighlightSection.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default NewsHighlightStandardPage;
