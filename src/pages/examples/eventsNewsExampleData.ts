import { type EventsNewsEntry, type EventsNewsEventEntry } from "@/components/patterns/EventsNewsSection";

export const eventsNewsExampleEntries: EventsNewsEntry[] = [
  {
    id: "event-adoption-fridays",
    kind: "event",
    title: "Friday Adoption Meet-and-Greet",
    startAt: "2026-01-02",
    startAtIso: "2026-01-02T17:00:00-08:00",
    endAtIso: "2026-01-02T19:00:00-08:00",
    locationLabel: "123 Main St, Example City, ST",
    registrationUrl: "https://example.org/register/adoption-fridays",
    summary: "Recurring weekly event every Friday evening.",
    highlights: ["Meet-and-greet with adoptable dogs", "Volunteer Q&A table", "Family-friendly event"],
    recurrence: {
      frequency: "weekly",
      weekdays: ["fri"],
    },
  },
  {
    id: "event-biweekly-supply-drive",
    kind: "event",
    title: "Biweekly Supply Drive",
    startAt: "2026-01-10",
    locationLabel: "Warehouse Pickup Hub, Example City, ST",
    summary: "Every 2 weeks donation sorting and supply drop-off.",
    recurrence: {
      frequency: "weekly",
      intervalWeeks: 2,
    },
  },
  {
    id: "event-second-weekend-fair",
    kind: "event",
    title: "Second Weekend of the Month Foster Fair",
    startAt: "2026-01-10",
    locationLabel: "Riverside Park, Example City, ST",
    summary: "Runs on the second weekend each month (Saturday + Sunday).",
    recurrence: {
      frequency: "monthly",
      nthWeek: 2,
      weekdays: ["sat", "sun"],
    },
  },
  {
    id: "event-monthly-5th-orientation",
    kind: "event",
    title: "Monthly New Volunteer Orientation",
    startAt: "2026-01-05",
    locationLabel: "Rescue Office, Example City, ST",
    summary: "Occurs on the 5th day of each month.",
    recurrence: {
      frequency: "monthly",
      monthDay: 5,
    },
  },
  {
    id: "news-grant-2026-03-01",
    kind: "news",
    title: "Community Grant Award Supports Rescue Operations",
    publishedAt: "2026-03-01",
    articleType: "external",
    dateLabel: "March 1, 2026",
    summary: "A regional grant will support vaccinations, transport, and placement assistance.",
    href: "https://example.org/grant-story",
  },
  {
    id: "news-local-spotlight-2026-02-24",
    kind: "news",
    title: "Community Partner Spotlight (Local Article)",
    publishedAt: "2026-02-24",
    articleType: "local",
    dateLabel: "February 24, 2026",
    summary: "Example of a news entry that links to a local article page hosted inside the site.",
    href: "/news/example-article",
  },
  {
    id: "event-yard-sale-2026-02-21",
    kind: "event",
    title: "Community Fundraiser",
    startAt: "2026-02-21",
    dateLabel: "Saturday, February 21, 2026",
    locationLabel: "Example City, ST",
    moreInfoUrl: "https://example.org/events/community-fundraiser-details",
    summary: "One-day fundraiser supporting ongoing rescue operations.",
    contentBlocks: [
      {
        type: "paragraph",
        text: "Join us for a neighborhood fundraiser supporting emergency foster placements and transport costs.",
      },
      {
        type: "list",
        title: "What to expect",
        items: [
          "Adoption information booth and volunteer sign-ups",
          "Pet supply donation drop-off lane",
          "Local sponsor raffle every hour",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Bring donation receipts",
        text: "Some partner organizations offer matching gifts when donation receipts are submitted within 7 days.",
      },
      {
        type: "ctaRow",
        actions: [
          { label: "Sponsor info", href: "https://example.org/events/community-fundraiser-details" },
          { label: "Volunteer form", href: "/examples/form-embed-modal", external: false },
        ],
      },
    ],
  },
  {
    id: "news-field-rescue-2026-02-10",
    kind: "news",
    title: "Field Rescue Team Spotlight",
    publishedAt: "2026-02-10",
    dateLabel: "February 10, 2026",
    summary: "How retrieval specialists and fosters coordinate rescue-to-home outcomes.",
  },
  {
    id: "news-volunteer-call-2026-01-10",
    kind: "news",
    title: "Volunteer Recruitment Drive",
    publishedAt: "2026-01-10",
    dateLabel: "January 10, 2026",
    summary: "New volunteer openings for transport, events, and foster support.",
  },
];

export const eventsNewsExampleEventEntries: EventsNewsEventEntry[] = eventsNewsExampleEntries.filter(
  (entry): entry is EventsNewsEventEntry => entry.kind === "event",
);

export const eventsNewsExampleEventSlugs = eventsNewsExampleEventEntries.map((entry) => entry.id);

export const getEventsNewsExampleEventBySlug = (slug: string) =>
  eventsNewsExampleEventEntries.find((entry) => entry.id === slug) ?? null;
