// check-event-recurrence-ignore: fixed kind:"news" example entry — the "recurrence" field only
// exists on the "event" variant of EventsNewsEntry, so this page can never need it.
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import EventsNewsDetail from "@/components/patterns/EventsNewsDetail";
import { getEventsNewsExampleEntryBySlug } from "@/pages/examples/eventsNewsExampleData";

const slug = "news-self-hosted-video-2026-03-05";
const canonicalPath = "/news/example-video-article";

const NewsVideoArticleExamplePage = () => {
  const entry = getEventsNewsExampleEntryBySlug(slug);

  return (
    <>
      <SEOHead
        title="Self-Hosted Video Example"
        canonicalPath={canonicalPath}
        description="Example local news article page demonstrating the Events & News module's self-hosted videoSrc field."
      />
      <PageHero
        eyebrow="News"
        title="Self-Hosted Video Example"
        description="This entry demonstrates videoSrc — a real, self-hosted mp4 renders inline below via a native <video> element, using imageSrc as the poster frame. Prefer this over videoEmbed whenever the source clip can be downloaded (e.g. via yt-dlp from a Facebook Reel), since a self-hosted file always plays where an iframe embed can be rights-blocked."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards", href: "/standards" },
          { label: "Events & News", href: "/standards/events-news" },
          { label: "Self-Hosted Video Example" },
        ]}
      />
      <section className="container px-4 py-10">
        {entry ? (
          <EventsNewsDetail
            entry={entry}
            backHref="/standards/events-news"
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

export default NewsVideoArticleExamplePage;
