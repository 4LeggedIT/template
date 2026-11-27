import { type EventsNewsEntry, type EventsNewsEventEntry } from "@/components/patterns/EventsNewsSection";
import { exampleImages } from "@/data/examples/images";
import { exampleVideos } from "@/data/examples/videos";
import { daysAgoISO, formatDateLabel, formatLongDateLabel, monthDayAgoISO, weekdayOnOrBeforeISO } from "@/data/examples/dates";

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
// Every date below is computed from today (src/data/examples/dates.ts) so the list never goes stale: recurring series start
// a few weeks back, one-off events sit in the future, news is dated in the recent past.
const FRIDAY = 5;
const SATURDAY = 6;

const fridayAnchor = weekdayOnOrBeforeISO(FRIDAY, 28);
const supplyDriveAnchor = weekdayOnOrBeforeISO(SATURDAY, 28);
const fairAnchor = weekdayOnOrBeforeISO(SATURDAY, 60);
const orientationAnchor = monthDayAgoISO(5, 2);
const raffleAnchor = weekdayOnOrBeforeISO(SATURDAY, 45);
const fundraiserDate = weekdayOnOrBeforeISO(SATURDAY, -21);
const grantDate = daysAgoISO(12);
const partnerDate = daysAgoISO(21);
const videoDate = daysAgoISO(30);
const socialDate = daysAgoISO(40);
const fieldRescueDate = daysAgoISO(55);
const volunteerCallDate = daysAgoISO(70);

export const eventsNewsExampleEntries: EventsNewsEntry[] = [
  {
    id: "event-adoption-fridays",
    kind: "event",
    title: "Friday Adoption Meet-and-Greet",
    startAt: fridayAnchor,
    startAtIso: `${fridayAnchor}T17:00:00-08:00`,
    endAtIso: `${fridayAnchor}T19:00:00-08:00`,
    locationLabel: "123 Main St, Example City, ST",
    registrationUrl: "https://example.org/register/adoption-fridays",
    registrationLabel: "Save your spot",
    summary: "Meet Juniper, Buster, Willow and Atlas every Friday evening, talk with volunteers, and learn how fostering works.",
    highlights: [
      "Held weekly, every Friday evening",
      "Meet adoptable dogs in a calm, relaxed setting",
      "Volunteer Q&A table",
      "Family-friendly",
    ],
    imageSrc: exampleImages.groupWalk,
    imageAlt: "Volunteers walking several dogs together in a park",
    recurrence: {
      frequency: "weekly",
      weekdays: ["fri"],
    },
  },
  {
    id: "event-biweekly-supply-drive",
    kind: "event",
    title: "Biweekly Supply Drive",
    startAt: supplyDriveAnchor,
    startAtIso: `${supplyDriveAnchor}T09:00:00-08:00`,
    endAtIso: `${supplyDriveAnchor}T12:00:00-08:00`,
    locationLabel: "Warehouse Pickup Hub, Example City, ST",
    summary: "Every two weeks, volunteers sort donations and neighbors can drop off food, blankets and other supplies for the dogs in our care.",
    highlights: ["Held every 2 weeks", "On-site donation sorting", "Supply drop-off available"],
    imageSrc: exampleImages.suppliesBasket,
    imageAlt: "A basket of donated supplies ready to be sorted",
    recurrence: {
      frequency: "weekly",
      intervalWeeks: 2,
    },
  },
  {
    id: "event-second-weekend-fair",
    kind: "event",
    title: "Second Weekend Foster Fair",
    startAt: fairAnchor,
    startAtIso: `${fairAnchor}T10:00:00-08:00`,
    endAtIso: `${fairAnchor}T16:00:00-08:00`,
    locationLabel: "Riverside Park, Example City, ST",
    summary: "Runs on the second weekend of each month, Saturday and Sunday: adoptable dogs, local vendors and family-friendly activities all weekend.",
    highlights: ["Held the second weekend of every month", "Runs Saturday and Sunday"],
    imageSrc: exampleImages.dogPair,
    imageAlt: "Two small dogs trotting along a country path",
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
    startAt: orientationAnchor,
    startAtIso: `${orientationAnchor}T18:00:00-08:00`,
    endAtIso: `${orientationAnchor}T19:30:00-08:00`,
    locationLabel: "Rescue Office, Example City, ST",
    summary: "Held on the 5th of every month: learn how the rescue works and find the volunteer role that fits you best.",
    highlights: ["Held on the 5th day of every month"],
    recurrence: {
      frequency: "monthly",
      monthDay: 5,
    },
  },
  {
    id: "news-community-grant",
    kind: "news",
    title: "Regional Grant Funds a Year of Vaccinations and Transport",
    publishedAt: grantDate,
    articleType: "external",
    dateLabel: formatDateLabel(grantDate),
    summary: "A regional community grant will cover core vaccinations, spay and neuter surgeries and transport to foster homes for the next twelve months.",
    href: "https://example.org/grant-story",
  },
  {
    id: "news-partner-spotlight",
    kind: "news",
    title: "Partner Spotlight: Spay and Neuter Days at Example Veterinary Clinic",
    publishedAt: partnerDate,
    articleType: "local",
    dateLabel: formatDateLabel(partnerDate),
    summary: "Example Veterinary Clinic has donated surgery days to the dogs in our program all year. Here is what a typical day looks like.",
    body:
      "Once a month, Example Veterinary Clinic closes its regular appointments and opens its surgery suite to our rescue dogs. Juniper, Willow and Atlas were all seen there this season.\n\nVolunteers drive each dog in the morning, the clinic team handles the surgery and recovery, and a foster picks the dog up that afternoon. It is a long day for everyone, and it is the reason our dogs go to their new homes already spayed or neutered, vaccinated and microchipped.\n\nThank you to the whole clinic team.",
    href: "/news/example-article",
    imageSrc: exampleImages.willow,
    imageAlt: "Willow, a border collie mix, looking up at the camera",
  },
  {
    id: "news-self-hosted-video",
    kind: "news",
    title: "Meet the Dogs: A Short Video From This Week's Intake",
    publishedAt: videoDate,
    articleType: "local",
    dateLabel: formatDateLabel(videoDate),
    summary: "A quick look at four dogs who joined the program this week and are looking for foster or adoptive homes.",
    body:
      "Four new dogs arrived this week: Juniper, Buster, Willow and Atlas. They have all had their wellness checks and are settling in with their fosters.\n\nPress play to meet them, and if one of them catches your eye, come say hello at Friday's adoption meet-and-greet.",
    href: "/news/example-video-article",
    videoSrc: exampleVideos.meetTheDogs,
    imageSrc: exampleImages.juniper,
    imageAlt: "Juniper, a golden dog, holding a flower in her mouth",
  },
  {
    id: "news-social-embed",
    kind: "news",
    title: "Say Hello: Our Latest Update on Facebook",
    publishedAt: socialDate,
    articleType: "local",
    dateLabel: formatDateLabel(socialDate),
    summary: "Follow our latest update on Facebook, shown right here exactly as we posted it.",
    body:
      "We share quick updates on Facebook between newsletters. The post below is shown as posted, so you can read it, like it and share it without leaving the page.",
    href: "/news/example-social-embed-article",
    imageSrc: exampleImages.nova,
    imageAlt: "Nova, an Australian shepherd mix, smiling on a beach",
    // A public post by 4leggedIT itself (the same one the /standards/social-post-embed example uses).
    socialEmbed: {
      url: "https://www.facebook.com/4leggedIT/posts/pfbid0ijdsw58B9RRFNyXkkdGksAvbuapsScqNETdiMCw1F5WjTGqNstbVVv53YVdoXyKRl",
    },
    source: "https://www.facebook.com/4leggedIT/posts/pfbid0ijdsw58B9RRFNyXkkdGksAvbuapsScqNETdiMCw1F5WjTGqNstbVVv53YVdoXyKRl",
  },
  {
    id: "event-community-fundraiser",
    kind: "event",
    title: "Community Yard Sale Fundraiser",
    startAt: fundraiserDate,
    dateLabel: formatLongDateLabel(fundraiserDate),
    locationLabel: "Example City, ST",
    moreInfoUrl: "https://example.org/events/community-fundraiser-details",
    summary: "One-day yard sale supporting ongoing rescue operations: browse donated goods and help cover food, vet care and supplies.",
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
    id: "news-field-rescue-spotlight",
    kind: "news",
    title: "Field Rescue Team Spotlight",
    publishedAt: fieldRescueDate,
    dateLabel: formatDateLabel(fieldRescueDate),
    summary: "How retrieval specialists and fosters coordinate each rescue, from the first call about a dog in need to a safe, permanent home.",
    imageSrc: exampleImages.ranger,
    imageAlt: "Ranger, a black and white terrier mix, standing on a sidewalk",
  },
  {
    id: "news-volunteer-recruitment",
    kind: "news",
    title: "Volunteer Recruitment Drive",
    publishedAt: volunteerCallDate,
    dateLabel: formatDateLabel(volunteerCallDate),
    summary: "New volunteer openings for transport, events and foster support. No experience needed; training is provided for every role.",
  },
  {
    id: "event-basket-raffle-monthly",
    kind: "event",
    title: "Monthly Basket Raffle",
    startAt: raffleAnchor,
    startAtIso: `${raffleAnchor}T11:00:00-08:00`,
    endAtIso: `${raffleAnchor}T15:00:00-08:00`,
    locationLabel: "Community Hall, 456 Oak Ave, Example City, ST",
    registrationUrl: "https://example.org/events/basket-raffle",
    summary: "First Saturday of every month: dog-themed gift baskets, tickets $5 each or 5 for $20. Every ticket helps support the rescue.",
    imageSrc: exampleImages.suppliesBasket,
    imageAlt: "Gift baskets set out for a fundraiser raffle",
    highlights: [
      "Held the first Saturday of every month",
      "20+ donated gift baskets, all dog-themed",
      "Tickets available at the door or in advance: $5 each or 5 for $20",
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
