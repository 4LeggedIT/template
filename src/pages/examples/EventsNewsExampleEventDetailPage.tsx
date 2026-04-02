import { Link } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEventsNewsExampleEventBySlug } from "@/pages/examples/eventsNewsExampleData";

type EventsNewsExampleEventDetailPageProps = {
  eventSlug: string;
};

const EventsNewsExampleEventDetailPage = ({ eventSlug }: EventsNewsExampleEventDetailPageProps) => {
  const event = getEventsNewsExampleEventBySlug(eventSlug);
  const canonicalPath = `/examples/events-news/events/${eventSlug}`;

  if (!event) {
    return (
      <>
        <SEOHead
          title="Event Not Found"
          canonicalPath={canonicalPath}
          description="Requested event detail page was not found."
        />
        <PageHero
          eyebrow="Examples"
          title="Event not found"
          description="This event detail route does not match a configured event entry."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Examples", href: "/examples" },
            { label: "Events & News", href: "/examples/events-news" },
            { label: "Event detail" },
          ]}
        />
      </>
    );
  }

  return (
    <>
      <SEOHead
        title={`${event.title} | Event Example`}
        canonicalPath={canonicalPath}
        description={event.summary ?? "Event detail route for Events & News module examples."}
      />
      <PageHero
        eyebrow="Event"
        title={event.title}
        description={event.summary ?? "Event detail page linked from the Events & News module index."}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Examples", href: "/examples" },
          { label: "Events & News", href: "/examples/events-news" },
          { label: event.title },
        ]}
      />

      <section className="container px-4 py-10">
        <Card>
          <CardHeader className="space-y-3">
            <CardTitle className="text-2xl">{event.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {event.dateLabel ?? event.startAt}
              </span>
              {event.locationLabel ? (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {event.locationLabel}
                </span>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            {event.summary ? <p>{event.summary}</p> : null}
            {event.body ? (
              event.body
                .split("\n\n")
                .map((paragraph) => paragraph.trim())
                .filter(Boolean)
                .map((paragraph, idx) => <p key={idx}>{paragraph}</p>)
            ) : (
              <p>Add full event details here when publishing a real event detail page.</p>
            )}
            <p>
              <Link className="font-medium text-primary underline underline-offset-4" to="/examples/events-news">
                Back to Events & News index
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default EventsNewsExampleEventDetailPage;
