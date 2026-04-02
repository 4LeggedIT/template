import { Link } from "react-router-dom";
import EventsNewsSection from "@/components/patterns/EventsNewsSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { eventsNewsExampleEntries } from "@/pages/examples/eventsNewsExampleData";

const EventsNewsExamplePage = () => {
  const structuredPreviewEntries = eventsNewsExampleEntries.filter((entry) => entry.id === "event-yard-sale-2026-02-21");

  return (
    <>
      <SEOHead
        title="Events & News Module Example"
        canonicalPath="/examples/events-news"
        description="Standardized EventsNewsModule example with latest + archive behavior."
      />
      <PageHero
        eyebrow="Examples"
        title="Events & News module"
        description="Unified event/news rendering with latest entries and built-in archive support."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Examples", href: "/examples" },
          { label: "Events & News" },
        ]}
      />

      <section className="container space-y-6 px-4 py-10">
        <EventsNewsSection
          entries={eventsNewsExampleEntries}
          maxLatest={3}
          showFeatured
          featuredEntryId="news-grant-2026-03-01"
          archiveOpenByDefault={false}
          archiveMaxItems={5}
          description="Latest entries are shown first in calendar order; older entries move into archive."
          showFutureEventsBanner
          futureEventsBannerStorageKeyPrefix="template_events_news_example_banner"
          futureEventsBannerDefaultCtaHref="/examples/events-news"
          eventDetailsBasePath="/examples/events-news/events"
          cardMode="index"
        />

        <EventsNewsSection
          title="Structured Content Blocks Preview"
          description="This card demonstrates the richer `contentBlocks` renderer used on detail-style cards."
          entries={structuredPreviewEntries}
          maxLatest={1}
          showFeatured={false}
          cardMode="full"
        />

        <Card>
          <CardHeader>
            <CardTitle>Validation checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Event actions (maps/calendar/share link) render only for event entries.</p>
            <p>- Index mode keeps cards summary-only and hides full body/highlights/images.</p>
            <p>- Latest list is ordered by date and capped by `maxLatest`.</p>
            <p>- Remaining entries are preserved in archive (no data loss over time).</p>
            <p>- News details can link to either external sources or local article routes.</p>
            <p>- Future-event top banner can be enabled/disabled per page.</p>
            <p>- Recurrence supports weekly/biweekly, monthly by day, and monthly nth weekday patterns.</p>
            <p>- Optional featured card and archive controls are available.</p>
            <div className="pt-2">
              <p className="font-medium text-foreground">Event detail routes (for sitemap + prerender)</p>
              <p>- <Link className="underline underline-offset-4" to="/examples/events-news/events/event-adoption-fridays">Friday Adoption Meet-and-Greet</Link></p>
              <p>- <Link className="underline underline-offset-4" to="/examples/events-news/events/event-biweekly-supply-drive">Biweekly Supply Drive</Link></p>
              <p>- <Link className="underline underline-offset-4" to="/examples/events-news/events/event-second-weekend-fair">Second Weekend of the Month Foster Fair</Link></p>
              <p>- <Link className="underline underline-offset-4" to="/examples/events-news/events/event-monthly-5th-orientation">Monthly New Volunteer Orientation</Link></p>
              <p>- <Link className="underline underline-offset-4" to="/examples/events-news/events/event-yard-sale-2026-02-21">Community Fundraiser</Link></p>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default EventsNewsExamplePage;
