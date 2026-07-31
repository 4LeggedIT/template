import { Link } from "react-router-dom";
import EventBanner, { type EventBannerItem } from "@/components/patterns/EventBanner";
import EventsNewsSection from "@/components/patterns/EventsNewsSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { eventsNewsExampleEntries } from "@/pages/examples/eventsNewsExampleData";

const structuredPreviewEntries = eventsNewsExampleEntries.filter(
  (entry) => entry.id === "event-yard-sale-2026-02-21",
);

// Illustrative only — a real site computes this from its own entries via toBannerEvents()
// inside EventsNewsSection; this standalone example exists only to show the banner in isolation.
const homeBannerEvents: EventBannerItem[] = [
  {
    id: "event-adoption-fridays",
    title: "Friday Adoption Meet-and-Greet",
    startsAtIso: "2026-01-02T17:00:00-08:00",
    endsAtIso: "2026-01-02T19:00:00-08:00",
    locationLabel: "123 Main St, Example City, ST",
    recurrence: { frequency: "weekly", weekdays: ["fri"] },
    ctaHref: "/standards/events-news",
  },
  {
    id: "event-basket-raffle-monthly",
    title: "Monthly Basket Raffle",
    startsAtIso: "2026-03-07T11:00:00-08:00",
    endsAtIso: "2026-03-07T15:00:00-08:00",
    locationLabel: "Community Hall, 456 Oak Ave, Example City, ST",
    recurrence: { frequency: "monthly", nthWeek: 1, weekdays: ["sat"] },
    ctaHref: "/standards/events-news",
  },
];

const EventsNewsStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Events & News Pattern"
        canonicalPath="/standards/events-news"
        description="Standardized EventsNewsModule with archive and calendar ordering."
      />
      <PageHero
        eyebrow="Standards"
        title="Events & News pattern"
        description="One module for event and news content, with latest + archive behavior."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "Events & News Pattern" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Example — listing (News/Events index page)</h2>
          <p className="text-sm text-muted-foreground">
            This is what a News/Events index page renders — the future-events banner is deliberately{" "}
            <strong>not</strong> shown here; see the separate "Home page banner" example below for why.
          </p>
          <EventsNewsSection
            entries={eventsNewsExampleEntries}
            maxLatest={3}
            showFeatured
            featuredEntryId="news-grant-2026-03-01"
            archiveOpenByDefault={false}
            archiveMaxItems={5}
            description="Latest entries are shown first in calendar order; older entries move into archive."
            eventDetailsBasePath="/examples/events-news/events"
            cardMode="index"
            socialCta={{
              title: "Follow Us on Social Media",
              description: "Stay up to date with new arrivals, events, and rescue stories.",
              links: [
                { id: "facebook", label: "Facebook", href: "https://example.org/facebook", external: true },
                { id: "instagram", label: "Instagram", href: "https://example.org/instagram", external: true },
              ],
            }}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Home page banner (separate from the listing above)</h2>
          <p className="text-sm text-muted-foreground">
            <code>showFutureEventsBanner</code> renders <code>EventBanner</code> — a dismissible announcement banner
            for upcoming events. It's a <strong>home-page-only</strong> element, shown here in isolation (no
            listing, no archive) to make that clear — never enable it on the same instance used for a News/Events
            index or archive page, as shown above. In practice, a real site computes this same event list from its
            own entries via <code>EventsNewsSection</code>'s internal <code>toBannerEvents()</code> helper (by
            passing <code>showFutureEventsBanner</code> on the home page's own instance); the array below is
            constructed directly only so this example can render the banner with nothing else underneath it.
          </p>
          <EventBanner events={homeBannerEvents} storageKeyPrefix="template_events_news_example_banner" />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Structured content blocks (cardMode="full")</h2>
          <p className="text-sm text-muted-foreground">
            The richer <code>contentBlocks</code> renderer used on detail-style cards, instead of the
            summary-only <code>"index"</code> mode shown above.
          </p>
          <EventsNewsSection
            entries={structuredPreviewEntries}
            maxLatest={1}
            showFeatured={false}
            cardMode="full"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Use `EventsNewsSection` with a unified `event | news` entry contract.</p>
            <p>- Always keep full history in data; render latest entries + archive.</p>
            <p>- Keep entries in calendar order (newest first for combined feed).</p>
            <p>- Show event-only links (`Open in Maps`, `Add to Google Calendar`, `Share event`) only for events.</p>
            <p>- Do not duplicate event actions for news-only items.</p>
            <p>- Event-action parity rule: every migrated site news/events implementation must expose these three event actions.</p>
            <p>- News entries may link to external URLs or local article routes (for in-site articles).</p>
            <p>- For event detail pages, use index + detail routing (for example `/events` plus `/events/my-event-slug`).</p>
            <p>- Use lightweight metadata labels for status/type context on cards.</p>
            <p>- `showFutureEventsBanner` is home-page-only — enable it only on the `EventsNewsSection` instance mounted on the home page (see the "Home page banner" example above), never on a News/Events index or archive page instance.</p>
            <p>- Use `eventDetailsBasePath` when events should auto-link to local event detail routes.</p>
            <p>- Recurring event banner cards should resolve to local detail links when `eventDetailsBasePath` is configured.</p>
            <p>- For index pages, use `cardMode="index"` so cards stay summary-only (no body/highlights/images).</p>
            <p>- Recurring events are supported via `event.recurrence` (weekly, biweekly, monthly by day, monthly nth-week weekday).</p>
            <p>- Keep `EnvironmentBanner` and event banner separated (never merged into one banner).</p>
            <p>- If both render on a page, order must be `EnvironmentBanner` first, then event banner.</p>
            <p>- Render event banner only when there are active future events; if none exist, do not render event banner row.</p>
            <p>- Banner placement standard: render both in page flow directly under the header; do not mount globally in shared layout.</p>
            <p>- Content seeding standard: do not add fake/sample events in migrated production-like sites; start with empty entries until real events exist.</p>
            <p>- Optional featured card and archive controls are built in (`showFeatured`, archive props).</p>
            <p>- `socialCta` is a required governance default (not opt-in) for sites on the current generation — populate it from `siteConfig.social.*` so a "follow us" row renders via `SocialFollowCta`; never hand-roll a page-local version.</p>
            <p>- Set `entry.videoEmbed` (provider `"facebook"`, plus `url`, optional `aspectRatio`, optional `title`) on a `local` news entry to embed the source Facebook video/Reel inline on the detail page (and full-mode card) instead of a static image. `aspectRatio` defaults to `"portrait"` for `/reel/` URLs, `"landscape"` otherwise. Card thumbnails (news index, homepage highlight) still use `imageSrc`/`imageAlt` — keep both set so the thumbnail looks right even though the embed wins on the full/detail view. Prefer a self-hosted `videoSrc` (see `JourneyTimeline`) over this embed when the source clip uses licensed audio — a prior fleet attempt at embedding Facebook video was reverted after hitting a rights-block on a post with non-original audio.</p>
            <p>- Local article workflow: create a local page route (e.g. `/news/my-article-slug`), add it to `AppRoutes.tsx`, and point the news entry's `href` at it. Build-time route discovery (`tools/app-routes.mjs`) picks it up for prerender + sitemap; for dynamic routes, enumerate concrete URLs via `PRERENDER_EXTRA_ROUTES`. Apply the same rule to event detail routes. Validate with `npm run build` and `npm run qa:smoke:nojs`.</p>
            <p>
              - Event detail route examples (for sitemap + prerender):{" "}
              <Link className="underline underline-offset-4" to="/examples/events-news/events/event-adoption-fridays">
                Friday Adoption Meet-and-Greet
              </Link>
              ,{" "}
              <Link className="underline underline-offset-4" to="/examples/events-news/events/event-biweekly-supply-drive">
                Biweekly Supply Drive
              </Link>
              ,{" "}
              <Link className="underline underline-offset-4" to="/examples/events-news/events/event-second-weekend-fair">
                Second Weekend Foster Fair
              </Link>
              ,{" "}
              <Link className="underline underline-offset-4" to="/examples/events-news/events/event-monthly-5th-orientation">
                Monthly Volunteer Orientation
              </Link>
              , and{" "}
              <Link className="underline underline-offset-4" to="/examples/events-news/events/event-yard-sale-2026-02-21">
                Community Fundraiser
              </Link>
              .
            </p>
            <p>
              - Local article route example:{" "}
              <Link className="underline underline-offset-4" to="/news/example-article">
                News Article Example
              </Link>
            </p>
            <p>- Component: `template/src/components/patterns/EventsNewsSection.tsx`</p>
            <p>- Localization lib: `template/src/lib/localized-content.ts`</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Localization (bilingual sites)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- `EventsNewsSection`/`EventBanner` themselves stay plain-`string` and single-language — do not add localized fields to the shared components.</p>
            <p>- For a bilingual (EN/ES-toggle) site's real event/news content, author each translatable field as `LocalizedText` (from `lib/localized-content.ts`): a plain string, or an en/es record.</p>
            <p>- Keep a `resolve*Entry(entry, locale)` mapper in the site's own `data/events.ts`/`data/news-items.ts` that resolves `LocalizedText` fields down to the plain-`string` `EventsNewsEventEntry`/`EventsNewsArticleEntry` shape via `resolveText(value, locale)` — call it from the page component with `toContentLocale(i18n.resolvedLanguage)` before handing `entries` to `EventsNewsSection`.</p>
            <p>- `EventBanner` takes an optional `locale` prop (string, default `"en-US"`) for its `Intl.DateTimeFormat` date/time display. On a bilingual site, pass it `toIntlLocaleTag(toContentLocale(i18n.resolvedLanguage))` — otherwise the banner's date/time stays English-formatted even when the rest of the page is in Spanish.</p>
            <p>- Real reference implementations: `the-comeback-pack` and `feedingperrisstrays` (`src/data/events.ts`, `src/pages/Home.tsx`/`src/components/HomeEventBanner.tsx`).</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default EventsNewsStandardPage;
