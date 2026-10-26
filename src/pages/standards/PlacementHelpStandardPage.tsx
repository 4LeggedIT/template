import { useTranslation } from "react-i18next";
import PlacementHelpSection, { type PlacementNeedItem } from "@/components/patterns/PlacementHelpSection";
import { placementListings } from "@/data/placement-listings";
import StandardSnippet from "@/components/StandardSnippet";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const snippetExample = `import PlacementHelpSection from "@/components/patterns/PlacementHelpSection";

<PlacementHelpSection
  title="Help Place a Dog"
  listings={placementListings}
  needs={[{ id: "foster", title: "Foster homes", description: "Short-term homes while we find adopters.", icon: "home" }]}
  primaryCta={{ label: "Offer help", href: "/contact" }}
/>

// placementListings: PlacementListingItem[] (a PetCardItem)
{
  id: "buddy",
  name: "Buddy",
  imageSrc: "/pets/buddy.webp",
  placementType: "owner-surrender",
  summary: "Needs a new home by the end of the month.",
  postedAt: "2026-10-10",
}`;

const PlacementHelpStandardPage = () => {
  const { t } = useTranslation(["placementHelp", "common"]);

  const placementNeeds: PlacementNeedItem[] = [
    {
      id: "need-1",
      title: t("placementHelp:needs.need1.title"),
      description: t("placementHelp:needs.need1.description"),
      icon: "home",
    },
    {
      id: "need-2",
      title: t("placementHelp:needs.need2.title"),
      description: t("placementHelp:needs.need2.description"),
      icon: "rescue",
    },
    {
      id: "need-3",
      title: t("placementHelp:needs.need3.title"),
      description: t("placementHelp:needs.need3.description"),
      icon: "transport",
    },
  ];

  return (
    <>
      <SEOHead
        title="Placement Pattern"
        canonicalPath="/standards/placement-help"
        description="Standardized placement/courtesy-listing module with default expiry and optional pet metadata."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("placementHelp:hero.title")}
        description={t("placementHelp:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("placementHelp:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("placementHelp:example.title")}</h2>
          <PlacementHelpSection
            listings={placementListings}
            needsSummary={t("placementHelp:example.needsSummary")}
            needsChecklistItems={
              t("placementHelp:example.checklistItems", { returnObjects: true }) as string[]
            }
            primaryCta={{
              label: t("placementHelp:example.primaryCtaLabel"),
              href: "mailto:placements@example.org",
              external: true,
            }}
            secondaryCta={{ label: t("placementHelp:example.secondaryCtaLabel"), href: "/standards/placement-help" }}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("placementHelp:showExpired.title")}</h2>
          <p className="text-sm text-muted-foreground">
            <code>showExpiredListings</code> {t("placementHelp:showExpired.descriptionAfter")}
          </p>
          <PlacementHelpSection
            title={t("placementHelp:showExpired.sectionTitle")}
            listingsTitle={t("placementHelp:showExpired.listingsTitle")}
            showExpiredListings
            listings={placementListings}
            needs={placementNeeds}
          />
        </div>

        <StandardSnippet code={snippetExample} />

        <Card>
          <CardHeader>
            <CardTitle>{t("placementHelp:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("placementHelp:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default PlacementHelpStandardPage;
