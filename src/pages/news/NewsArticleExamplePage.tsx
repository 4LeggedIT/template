import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";

const NewsArticleExamplePage = () => {
  return (
    <>
      <SEOHead
        title="News Article Example"
        canonicalPath="/news/example-article"
        description="Example local news article page linked from the Events & News module."
      />
      <PageHero
        eyebrow="News"
        title="News Article Example"
        description="This is a local article route example. Use this pattern when a news entry should open a page hosted in the site, not an external URL."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Examples", href: "/examples" },
          { label: "Events & News", href: "/examples/events-news" },
          { label: "News Article Example" },
        ]}
      />
      <section className="container space-y-4 px-4 py-10 text-sm leading-relaxed text-muted-foreground">
        <p>
          Replace this sample body with your full local article content. Keep article routes in `app-routes.mjs`
          and reference them from `EventsNewsSection` via `href: &quot;/news/your-article-slug&quot;`.
        </p>
        <p>
          If a news item points to an external source, keep using a full URL in `href` and the component will render
          the same details button as an external link.
        </p>
      </section>
    </>
  );
};

export default NewsArticleExamplePage;
