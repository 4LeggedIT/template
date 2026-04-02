import { Link } from "react-router-dom";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EventsNewsStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Events & News Pattern"
        canonicalPath="/docs/standards/events-news"
        description="Standardized EventsNewsModule with archive and calendar ordering."
      />
      <PageHero
        eyebrow="Docs"
        title="Events & News pattern"
        description="Use one module for event and news content, with latest + archive behavior."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "Events & News Pattern" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
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
            <p>- Optional future-events banner is available for home/main page announcements.</p>
            <p>- Use `eventDetailsBasePath` when events should auto-link to local event detail routes.</p>
            <p>- Recurring event banner cards should resolve to local detail links when `eventDetailsBasePath` is configured.</p>
            <p>- For index pages, use `cardMode=&quot;index&quot;` so cards stay summary-only (no body/highlights/images).</p>
            <p>- Recurring events are supported via `event.recurrence` (weekly, biweekly, monthly by day, monthly nth-week weekday).</p>
            <p>- Keep `EnvironmentBanner` and event banner separated (never merged into one banner).</p>
            <p>- If both render on a page, order must be `EnvironmentBanner` first, then event banner.</p>
            <p>- Render event banner only when there are active future events; if none exist, do not render event banner row.</p>
            <p>- Banner placement standard: render both in page flow directly under the header; do not mount globally in shared layout.</p>
            <p>- Content seeding standard: do not add fake/sample events in migrated production-like sites; start with empty entries until real events exist.</p>
            <p>- Optional featured card and archive controls are built in (`showFeatured`, archive props).</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reference</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              - Live example:{" "}
              <Link className="underline underline-offset-4" to="/examples/events-news">
                Events & News example page
              </Link>
            </p>
            <p>
              - Local article route example:{" "}
              <Link className="underline underline-offset-4" to="/news/example-article">
                News Article Example
              </Link>
            </p>
            <p>- Component: `template/src/components/patterns/EventsNewsSection.tsx`</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Local article workflow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Create a local page route (for example `/news/my-article-slug`) and add it to `AppRoutes.tsx`.</p>
            <p>- Point the news entry `href` to that local route.</p>
            <p>- Build-time route discovery (`tools/app-routes.mjs`) picks up the route for prerender + sitemap.</p>
            <p>- If using dynamic routes, enumerate concrete article URLs via `PRERENDER_EXTRA_ROUTES`.</p>
            <p>- Apply the same rule for event detail routes so each event URL is present in sitemap output.</p>
            <p>- Validate with `npm run build` and `npm run qa:smoke:nojs`.</p>
            <p>- Prefer rendering event banner as a separate page-level block under header for deterministic ordering with `EnvironmentBanner`.</p>
            <p>- For archived history controls, use `archiveOpenByDefault` and `archiveMaxItems`.</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default EventsNewsStandardPage;
