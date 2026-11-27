// check-event-recurrence-ignore: fixed kind:"news" example entry — the "recurrence" field only
// exists on the "event" variant of EventsNewsEntry, so this page can never need it.
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import EventsNewsDetail from "@/components/patterns/EventsNewsDetail";
import { getEventsNewsExampleEntryBySlug } from "@/pages/examples/eventsNewsExampleData";
import { siteConfig } from "@/config/site";

const slug = "news-social-embed";
const canonicalPath = "/news/example-social-embed-article";

const NewsSocialEmbedArticleExamplePage = () => {
  const entry = getEventsNewsExampleEntryBySlug(slug);

  return (
    <>
      <SEOHead
        title="Social Post Embed Example"
        canonicalPath={canonicalPath}
        description="Example local news article page demonstrating the Events & News module's socialEmbed field, which shows a public Facebook, Instagram or TikTok post as posted."
      />
      <PageHero
        eyebrow="News"
        title="Social Post Embed Example"
        description="This entry demonstrates socialEmbed: a public Facebook, Instagram or TikTok post renders inline below via the platform's official embed, with a plain link to the original underneath. If the post is deleted, private or un-embeddable the embed is dropped and the entry's image shows instead. Priority is videoSrc, then videoEmbed, then socialEmbed, then images."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards", href: "/standards" },
          { label: "Events & News", href: "/standards/events-news" },
          { label: "Social Post Embed Example" },
        ]}
      />
      <section className="container px-4 py-10">
        {entry ? (
          <EventsNewsDetail
            entry={entry}
            backHref="/standards/events-news"
            shareUrl={`${siteConfig.siteUrl}${canonicalPath}`}
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

export default NewsSocialEmbedArticleExamplePage;
