import { useTranslation } from "react-i18next";
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

const imageLayoutPreviewEntries = eventsNewsExampleEntries.filter((entry) =>
  [
    "event-adoption-fridays",
    "news-local-spotlight-2026-02-24",
    "event-basket-raffle-monthly",
    "news-field-rescue-2026-02-10",
  ].includes(entry.id),
);

const EventsNewsStandardPage = () => {
  const { t } = useTranslation(["eventsNews", "common"]);

  // Illustrative only — a real site computes this from its own entries via toBannerEvents()
  // inside EventsNewsSection; this standalone example exists only to show the banner in isolation.
  const homeBannerEvents: EventBannerItem[] = [
    {
      id: "event-adoption-fridays",
      title: t("eventsNews:banner.adoptionFridays.title"),
      startsAtIso: "2026-01-02T17:00:00-08:00",
      endsAtIso: "2026-01-02T19:00:00-08:00",
      locationLabel: t("eventsNews:banner.adoptionFridays.location"),
      recurrence: { frequency: "weekly", weekdays: ["fri"] },
      ctaHref: "/standards/events-news",
    },
    {
      id: "event-basket-raffle-monthly",
      title: t("eventsNews:banner.basketRaffle.title"),
      startsAtIso: "2026-03-07T11:00:00-08:00",
      endsAtIso: "2026-03-07T15:00:00-08:00",
      locationLabel: t("eventsNews:banner.basketRaffle.location"),
      recurrence: { frequency: "monthly", nthWeek: 1, weekdays: ["sat"] },
      ctaHref: "/standards/events-news",
    },
  ];

  return (
    <>
      <SEOHead
        title="Events & News Pattern"
        canonicalPath="/standards/events-news"
        description="Standardized EventsNewsModule with archive and calendar ordering."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("eventsNews:hero.title")}
        description={t("eventsNews:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("eventsNews:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("eventsNews:sections.listing.title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("eventsNews:sections.listing.descriptionBefore")}{" "}
            <strong>{t("eventsNews:sections.listing.descriptionStrong")}</strong>{" "}
            {t("eventsNews:sections.listing.descriptionAfter")}
          </p>
          <EventsNewsSection
            entries={eventsNewsExampleEntries}
            maxLatest={3}
            showFeatured
            featuredEntryId="news-grant-2026-03-01"
            archiveOpenByDefault={false}
            archiveMaxItems={5}
            description={t("eventsNews:sections.listing.moduleDescription")}
            eventDetailsBasePath="/examples/events-news/events"
            cardMode="index"
            socialCta={{
              title: t("eventsNews:sections.listing.socialCtaTitle"),
              description: t("eventsNews:sections.listing.socialCtaDescription"),
              links: [
                { id: "facebook", label: "Facebook", href: "https://example.org/facebook", external: true },
                { id: "instagram", label: "Instagram", href: "https://example.org/instagram", external: true },
              ],
            }}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("eventsNews:sections.homeBanner.title")}</h2>
          <p className="text-sm text-muted-foreground">
            <code>showFutureEventsBanner</code> {t("eventsNews:sections.homeBanner.part1")} <code>EventBanner</code>{" "}
            {t("eventsNews:sections.homeBanner.part2")}{" "}
            <strong>{t("eventsNews:sections.homeBanner.strong")}</strong>{" "}
            {t("eventsNews:sections.homeBanner.part3")} <code>EventsNewsSection</code>
            {t("eventsNews:sections.homeBanner.part4")} <code>toBannerEvents()</code>{" "}
            {t("eventsNews:sections.homeBanner.part5")} <code>showFutureEventsBanner</code>{" "}
            {t("eventsNews:sections.homeBanner.part6")}
          </p>
          <EventBanner events={homeBannerEvents} storageKeyPrefix="template_events_news_example_banner" />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("eventsNews:sections.structuredContent.title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("eventsNews:sections.structuredContent.part1")} <code>contentBlocks</code>{" "}
            {t("eventsNews:sections.structuredContent.part2")} <code>"index"</code>{" "}
            {t("eventsNews:sections.structuredContent.part3")}
          </p>
          <EventsNewsSection
            entries={structuredPreviewEntries}
            maxLatest={1}
            showFeatured={false}
            cardMode="full"
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("eventsNews:sections.imageLayout.title")}</h2>
          <p className="text-sm text-muted-foreground">
            <code>imageLayout</code> {t("eventsNews:sections.imageLayout.part1")} <code>cardMode</code>
            {t("eventsNews:sections.imageLayout.part2")} <code>imageSrc</code>
            {t("eventsNews:sections.imageLayout.part3")} <code>imageLayout="side"</code>{" "}
            {t("eventsNews:sections.imageLayout.part4")} <code>"auto"</code>{" "}
            {t("eventsNews:sections.imageLayout.part5")}
          </p>
          <EventsNewsSection
            entries={imageLayoutPreviewEntries}
            maxLatest={4}
            showFeatured={false}
            cardMode="index"
            imageLayout="alternating"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("eventsNews:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("eventsNews:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
            <p>
              - {t("eventsNews:standard.eventRoutesBefore")}{" "}
              <Link className="underline underline-offset-4" to="/examples/events-news/events/event-adoption-fridays">
                {t("eventsNews:standard.eventLinks.adoptionFridays")}
              </Link>
              ,{" "}
              <Link className="underline underline-offset-4" to="/examples/events-news/events/event-biweekly-supply-drive">
                {t("eventsNews:standard.eventLinks.biweeklySupplyDrive")}
              </Link>
              ,{" "}
              <Link className="underline underline-offset-4" to="/examples/events-news/events/event-second-weekend-fair">
                {t("eventsNews:standard.eventLinks.weekendFair")}
              </Link>
              ,{" "}
              <Link className="underline underline-offset-4" to="/examples/events-news/events/event-monthly-5th-orientation">
                {t("eventsNews:standard.eventLinks.volunteerOrientation")}
              </Link>
              , {t("eventsNews:standard.and")}{" "}
              <Link className="underline underline-offset-4" to="/examples/events-news/events/event-yard-sale-2026-02-21">
                {t("eventsNews:standard.eventLinks.communityFundraiser")}
              </Link>
              .
            </p>
            <p>
              - {t("eventsNews:standard.localArticleBefore")}{" "}
              <Link className="underline underline-offset-4" to="/news/example-article">
                {t("eventsNews:standard.localArticleLink")}
              </Link>
            </p>
            <p>- {t("eventsNews:standard.component")}</p>
            <p>- {t("eventsNews:standard.localizationLib")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("eventsNews:localization.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("eventsNews:localization.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default EventsNewsStandardPage;
