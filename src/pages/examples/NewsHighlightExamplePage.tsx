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

const NewsHighlightExamplePage = () => {
  return (
    <>
      <SEOHead
        title="News Highlight Module Example"
        canonicalPath="/examples/news-highlight"
        description="Homepage card that surfaces a single editor-flagged event or news entry."
      />
      <PageHero
        eyebrow="Examples"
        title="News Highlight module"
        description="Flag one event or news entry to surface on the homepage as an image + text + link card."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Examples", href: "/examples" },
          { label: "News Highlight" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">With an image</h2>
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
            <CardTitle>Nothing flagged</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              When no entry in the array has <code>highlightOnHome: true</code>, <code>NewsHighlightSection</code>{" "}
              renders nothing at all — there is deliberately no fallback to "most recent entry" and no empty-state
              placeholder. An editor must explicitly flag the entry they want surfaced.
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default NewsHighlightExamplePage;
