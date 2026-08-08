import { useSearchParams } from "react-router-dom";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import EventsNewsDetail from "@/components/patterns/EventsNewsDetail";
import { getAdjacentEntries, resolveEventOccurrence } from "@/components/patterns/EventsNewsSection";
import { eventsNewsExampleEntries, getEventsNewsExampleEventBySlug } from "@/pages/examples/eventsNewsExampleData";
import { describeRecurrence, type EventRecurrence } from "@/lib/event-recurrence";

const EVENT_DETAILS_BASE_PATH = "/examples/events-news/events";

type EventsNewsExampleEventDetailPageProps = {
  eventSlug: string;
};

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeStyle: "short" });
const dateOnlyFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeZone: "UTC" });

const weekdayLabel: Record<string, string> = {
  sun: "Sunday", mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday",
};
const nthWeekLabel: Record<number, string> = { 1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th", "-1": "last" };

// Demonstrates the recurrence treatment new sites should follow on a real detail page:
// a live next-occurrence date (not a frozen seed date) plus a plain-language recurrence summary.
function formatRecurrenceSummary(recurrence: EventRecurrence, seedStartIso: string) {
  const description = describeRecurrence(recurrence, seedStartIso);
  const days = description.weekdays.map((day) => weekdayLabel[day]);
  const dayPhrase = days.length > 1 ? `${days.slice(0, -1).join(", ")} and ${days[days.length - 1]}` : days[0];

  let summary: string;
  if (description.frequency === "weekly") {
    const cadence = description.interval > 1 ? `Repeats every ${description.interval} weeks` : "Repeats every week";
    summary = `${cadence} on ${dayPhrase}`;
  } else if (description.nthWeek) {
    const cadence = description.interval > 1 ? `Repeats every ${description.interval} months` : "Repeats every month";
    summary = `${cadence} on the ${nthWeekLabel[description.nthWeek]} ${dayPhrase}`;
  } else {
    const cadence = description.interval > 1 ? `Repeats every ${description.interval} months` : "Repeats every month";
    summary = `${cadence} on day ${description.monthDay}`;
  }

  if (description.until) {
    summary += ` until ${dateOnlyFormatter.format(new Date(`${description.until}T00:00:00Z`))}`;
  }
  return summary;
}

const EventsNewsExampleEventDetailPage = ({ eventSlug }: EventsNewsExampleEventDetailPageProps) => {
  const rawEvent = getEventsNewsExampleEventBySlug(eventSlug);
  const canonicalPath = `/examples/events-news/events/${eventSlug}`;

  // `resolveEventOccurrence()` is the one shared entry point every site's detail page should call
  // for this: it resolves a recurring event to the `?date=` occurrence a list card linked to (see
  // EventsNewsSection.tsx's expandEventEntry(), which stamps that param onto each occurrence's
  // href), falling back to the live next occurrence when the param is absent or invalid.
  const [searchParams] = useSearchParams();
  const requestedDate = searchParams.get("date") ?? undefined;
  const event = rawEvent ? resolveEventOccurrence(rawEvent, new Date(), requestedDate) : rawEvent;

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
            { label: "Standards", href: "/standards" },
            { label: "Events & News", href: "/standards/events-news" },
            { label: "Event detail" },
          ]}
        />
      </>
    );
  }

  const recurrenceSummary =
    event.recurrence && event.startAtIso ? formatRecurrenceSummary(event.recurrence, event.startAtIso) : null;
  const dateLabel = event.startAtIso
    ? dateTimeFormatter.format(new Date(event.startAtIso))
    : event.dateLabel ?? event.startAt;

  // "event-basket-raffle-monthly" has local detail content (highlights + an image) but no
  // registered example route (see AppRoutes.tsx) — excluded here so the Previous/Next demo
  // never links to a 404. A real site's entries/routes stay in sync, so this exclusion is
  // reference-example-only.
  const adjacencyEntries = eventsNewsExampleEntries.filter((entry) => entry.id !== "event-basket-raffle-monthly");
  // Pass the resolved event's own occurrence date so a recurring series' Previous/Next match the
  // exact occurrence being viewed, not whichever occurrence of that series sorts first — see
  // getAdjacentEntries()'s doc comment in EventsNewsSection.tsx.
  const { previous, next } = getAdjacentEntries(
    adjacencyEntries,
    eventSlug,
    EVENT_DETAILS_BASE_PATH,
    event.recurrence ? event.startAt : undefined,
  );

  // Fold the live-computed occurrence date (and recurrence summary) into the entry passed to
  // EventsNewsDetail — the shared pattern always prefers an explicit dateLabel/summary over its
  // own fallback formatter, so this is the correct extension point rather than duplicating markup.
  const displayEvent = {
    ...event,
    dateLabel,
    summary: [event.summary, recurrenceSummary].filter(Boolean).join(" · ") || event.summary,
  };

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
          { label: "Standards", href: "/standards" },
          { label: "Events & News", href: "/standards/events-news" },
          { label: event.title },
        ]}
      />

      <section className="container px-4 py-10">
        <EventsNewsDetail
          entry={displayEvent}
          backHref="/standards/events-news"
          shareUrl={typeof window !== "undefined" ? window.location.href : canonicalPath}
          previous={previous}
          next={next}
          labels={{ backToIndex: "Back to Events & News index" }}
        />
      </section>
    </>
  );
};

export default EventsNewsExampleEventDetailPage;
