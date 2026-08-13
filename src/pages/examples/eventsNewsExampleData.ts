import { type EventsNewsEntry, type EventsNewsEventEntry } from "@/components/patterns/EventsNewsSection";

// This example site has no i18n toggle, so every entry below authors plain-string fields
// directly. A bilingual site instead authors translatable fields as LocalizedText (see
// src/lib/localized-content.ts) and resolves to plain strings per render, e.g.:
//
//   title: { en: "Friday Adoption Meet-and-Greet", es: "Encuentro de Adopción los Viernes" }
//   // ...at the page component:
//   const locale = toContentLocale(i18n.resolvedLanguage);
//   const entries = rawEntries.map((entry) => resolveEventEntry(entry, locale));
//
// See /standards/events-news's "Localization (bilingual sites)" section for the full
// pattern.
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
    imageSrc: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "A dog waiting to be adopted at a meet-and-greet event",
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
    startAtIso: "2026-01-10T09:00:00-08:00",
    endAtIso: "2026-01-10T12:00:00-08:00",
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
    startAtIso: "2026-01-10T10:00:00-08:00",
    endAtIso: "2026-01-10T16:00:00-08:00",
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
    startAtIso: "2026-01-05T18:00:00-08:00",
    endAtIso: "2026-01-05T19:30:00-08:00",
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
    summary:
      "Example of a news entry that links to a local article page hosted inside the site, with the source Facebook video embedded via videoEmbed instead of a static image.",
    href: "/news/example-article",
    imageSrc: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=60",
    imageAlt: "Placeholder thumbnail (ignored on the detail page below since videoEmbed is set)",
    videoEmbed: {
      provider: "facebook",
      // Real public Reel used as a working demo URL (The Comeback Pack's first-rescue story).
      url: "https://www.facebook.com/reel/901691332360741",
    },
  },
  {
    id: "news-self-hosted-video-2026-03-05",
    kind: "news",
    title: "Self-Hosted Video Example",
    publishedAt: "2026-03-05",
    articleType: "local",
    dateLabel: "March 5, 2026",
    summary:
      "Example of a news entry using videoSrc (a real, self-hosted mp4) instead of videoEmbed — prefer this whenever the source clip can be downloaded, since a self-hosted file always plays.",
    href: "/news/example-video-article",
    // A small public-domain sample clip standing in for a real downloaded Reel/video file.
    videoSrc: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    imageSrc: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=60",
    imageAlt: "Poster frame shown before the video plays / used for the card thumbnail",
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
          { label: "Volunteer form", href: "/standards/form-embed-modal", external: false },
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
  {
    id: "event-basket-raffle-monthly",
    kind: "event",
    title: "Monthly Basket Raffle",
    startAt: "2026-03-07",
    startAtIso: "2026-03-07T11:00:00-08:00",
    endAtIso: "2026-03-07T15:00:00-08:00",
    locationLabel: "Community Hall, 456 Oak Ave, Example City, ST",
    registrationUrl: "https://example.org/events/basket-raffle",
    summary: "First Saturday of every month — dog-themed gift baskets, tickets $5 each or 5 for $20.",
    imageSrc: "https://images.unsplash.com/photo-1517849845537-4d257902861a?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Gift baskets set out for a fundraiser raffle",
    highlights: [
      "20+ donated gift baskets, all dog-themed",
      "Tickets available at the door or in advance",
      "Winners drawn on-site at 3:00 PM",
    ],
    recurrence: {
      frequency: "monthly",
      nthWeek: 1,
      weekdays: ["sat"],
    },
  },
];

export const eventsNewsExampleEventEntries: EventsNewsEventEntry[] = eventsNewsExampleEntries.filter(
  (entry): entry is EventsNewsEventEntry => entry.kind === "event",
);

export const eventsNewsExampleEventSlugs = eventsNewsExampleEventEntries.map((entry) => entry.id);

export const getEventsNewsExampleEventBySlug = (slug: string) =>
  eventsNewsExampleEventEntries.find((entry) => entry.id === slug) ?? null;

export const getEventsNewsExampleEntryBySlug = (slug: string) =>
  eventsNewsExampleEntries.find((entry) => entry.id === slug) ?? null;
