import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import EventsNewsDetail from "@/components/patterns/EventsNewsDetail";
import { getEventsNewsExampleEntryBySlug } from "@/pages/examples/eventsNewsExampleData";

const slug = "news-local-spotlight-2026-02-24";
const canonicalPath = "/news/example-article";

const NewsArticleExamplePage = () => {
  const entry = getEventsNewsExampleEntryBySlug(slug);

  return (
    <>
      <SEOHead
        title="News Article Example"
        canonicalPath={canonicalPath}
        description="Example local news article page linked from the Events & News module."
      />
      <PageHero
        eyebrow="News"
        title="News Article Example"
        description="This is a local article route example. Use this pattern when a news entry should open a page hosted in the site, not an external URL. It renders through the shared EventsNewsDetail pattern, the same component used for event detail pages."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Examples", href: "/examples" },
          { label: "Events & News", href: "/examples/events-news" },
          { label: "News Article Example" },
        ]}
      />
      <section className="container px-4 py-10">
        {entry ? (
          <EventsNewsDetail
            entry={entry}
            backHref="/examples/events-news"
            shareUrl={typeof window !== "undefined" ? window.location.href : canonicalPath}
            labels={{ backToIndex: "Back to Events & News index" }}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Example entry not found. Real sites look up the entry by <code>slug</code> from the route param via a
            data-layer helper (e.g. <code>getEntryBySlug(slug)</code>) instead of a hardcoded id.
          </p>
        )}
      </section>
    </>
  );
};

export default NewsArticleExamplePage;
