import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import EventBanner, { type EventBannerItem } from "@/components/patterns/EventBanner";
import EventsNewsSection from "@/components/patterns/EventsNewsSection";
import StandardSnippet from "@/components/StandardSnippet";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { eventsNewsExampleEntries, getEventsNewsExampleEventBySlug } from "@/pages/examples/eventsNewsExampleData";
import { buildExampleSnippet } from "@/lib/example-snippet";
import CollapsibleSection from "@/components/standards/CollapsibleSection";

const structuredPreviewEntries = eventsNewsExampleEntries.filter(
  (entry) => entry.id === "event-community-fundraiser",
);

const imageLayoutPreviewEntries = eventsNewsExampleEntries.filter((entry) =>
  [
    "event-adoption-fridays",
    "news-partner-spotlight",
    "event-basket-raffle-monthly",
    "news-field-rescue-spotlight",
  ].includes(entry.id),
);

const EventsNewsStandardPage = () => {
  const { t } = useTranslation(["eventsNews", "common"]);

  // Illustrative only — a real site computes this from its own entries via toBannerEvents()
  // inside EventsNewsSection; this standalone example exists only to show the banner in isolation.
  const adoptionFridays = getEventsNewsExampleEventBySlug("event-adoption-fridays")!;
  const basketRaffle = getEventsNewsExampleEventBySlug("event-basket-raffle-monthly")!;
  const homeBannerEvents: EventBannerItem[] = [
    {
      id: "event-adoption-fridays",
      title: t("eventsNews:banner.adoptionFridays.title"),
      startsAtIso: adoptionFridays.startAtIso!,
      endsAtIso: adoptionFridays.endAtIso!,
      locationLabel: t("eventsNews:banner.adoptionFridays.location"),
      recurrence: { frequency: "weekly", weekdays: ["fri"] },
      ctaHref: "/standards/events-news",
    },
    {
      id: "event-basket-raffle-monthly",
      title: t("eventsNews:banner.basketRaffle.title"),
      startsAtIso: basketRaffle.startAtIso!,
      endsAtIso: basketRaffle.endAtIso!,
      locationLabel: t("eventsNews:banner.basketRaffle.location"),
      recurrence: { frequency: "monthly", nthWeek: 1, weekdays: ["sat"] },
      ctaHref: "/standards/events-news",
    },
  ];

  const snippetExample = buildExampleSnippet({
    component: "EventsNewsSection",
    props: { entries: eventsNewsExampleEntries, maxLatest: 3, showFeatured: true, featuredEntryId: "news-community-grant" },
  });

  return (
    <>
      <SEOHead
        title="Events & News Pattern"
        canonicalPath="/standards/events-news"
        description="Standardized EventsNewsModule with archive and calendar ordering, so upcoming events, past recaps, and news posts live in one list."
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
          <p className="text-sm text-muted-foreground">{t("eventsNews:sections.listing.description")}</p>
          <EventsNewsSection
            entries={eventsNewsExampleEntries}
            maxLatest={3}
            showFeatured
            featuredEntryId="news-community-grant"
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
          <p className="text-sm text-muted-foreground">{t("eventsNews:sections.homeBanner.description")}</p>
          <EventBanner events={homeBannerEvents} storageKeyPrefix="template_events_news_example_banner" />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("eventsNews:sections.structuredContent.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("eventsNews:sections.structuredContent.description")}</p>
          <EventsNewsSection
            entries={structuredPreviewEntries}
            maxLatest={1}
            showFeatured={false}
            cardMode="full"
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("eventsNews:sections.imageLayout.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("eventsNews:sections.imageLayout.description")}</p>
          <EventsNewsSection
            entries={imageLayoutPreviewEntries}
            maxLatest={4}
            showFeatured={false}
            cardMode="index"
            imageLayout="alternating"
            eventDetailsBasePath="/examples/events-news/events"
          />
        </div>

        <StandardSnippet code={snippetExample} />

        <CollapsibleSection card title={t("eventsNews:standard.title")}>
          <div className="space-y-2 break-words text-sm text-muted-foreground">
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
              <Link className="underline underline-offset-4" to="/examples/events-news/events/event-community-fundraiser">
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
          </div>
        </CollapsibleSection>

        <Card>
          <CardHeader>
            <CardTitle>{t("eventsNews:localization.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 break-words text-sm text-muted-foreground">
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
