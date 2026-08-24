import { useTranslation } from "react-i18next";
import { Heart, HeartHandshake, Stethoscope, Users, Utensils } from "lucide-react";
import DetailedImpactSection, {
  type ImpactCategory,
  type DetailedImpactEntry,
  getEntriesForCategory,
  getImpactLifetimeStats,
} from "@/components/patterns/DetailedImpactSection";
import ImpactStatsSection from "@/components/patterns/ImpactStatsSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DetailedImpactStandardPage = () => {
  const { t } = useTranslation(["impactLog", "common"]);

  const categories: ImpactCategory[] = [
    { id: "animals-helped", label: t("detailedImpact:sampleData.categories.animalsHelped"), icon: Heart },
    { id: "feeding-supplies", label: t("detailedImpact:sampleData.categories.feedingSupplies"), icon: Utensils },
    {
      id: "veterinary-assistance",
      label: t("detailedImpact:sampleData.categories.veterinaryAssistance"),
      icon: Stethoscope,
    },
    {
      id: "rescue-partnerships",
      label: t("detailedImpact:sampleData.categories.rescuePartnerships"),
      icon: HeartHandshake,
    },
    { id: "volunteers-community", label: t("detailedImpact:sampleData.categories.volunteersCommunity"), icon: Users },
  ];

  const entries: DetailedImpactEntry[] = [
    {
      id: "feeding-route",
      title: t("detailedImpact:sampleData.entries.feedingRoute.title"),
      date: "2026-06-02",
      endDate: "2026-06-03",
      summary: t("detailedImpact:sampleData.entries.feedingRoute.summary"),
      relatedHref: "/standards/blog",
      contributions: [
        { categoryId: "feeding-supplies", amount: 40, unit: "meals", note: t("detailedImpact:sampleData.entries.feedingRoute.feedingNote") },
        { categoryId: "veterinary-assistance", amount: 3, unit: "dogs treated", note: t("detailedImpact:sampleData.entries.feedingRoute.vetNote") },
        { categoryId: "rescue-partnerships", amount: 1, unit: "partner rescue", note: t("detailedImpact:sampleData.entries.feedingRoute.partnerNote") },
      ],
    },
    {
      id: "clinic-day",
      title: t("detailedImpact:sampleData.entries.clinicDay.title"),
      date: "2026-05-14",
      summary: t("detailedImpact:sampleData.entries.clinicDay.summary"),
      contributions: [
        { categoryId: "animals-helped", amount: 12, unit: "dogs", note: t("detailedImpact:sampleData.entries.clinicDay.note") },
        { categoryId: "veterinary-assistance", amount: 12, unit: "surgeries", note: t("detailedImpact:sampleData.entries.clinicDay.note") },
      ],
    },
    {
      id: "supply-drive",
      title: t("detailedImpact:sampleData.entries.supplyDrive.title"),
      date: "2026-04-18",
      summary: t("detailedImpact:sampleData.entries.supplyDrive.summary"),
      contributions: [
        { categoryId: "volunteers-community", amount: 8, unit: "volunteers", note: t("detailedImpact:sampleData.entries.supplyDrive.volunteersNote") },
        { categoryId: "feeding-supplies", amount: 150, unit: "lbs", note: t("detailedImpact:sampleData.entries.supplyDrive.suppliesNote") },
      ],
    },
  ];

  const labels = {
    readMoreLabel: t("detailedImpact:sampleData.readMoreLabel"),
    runningTotalLabel: t("detailedImpact:sampleData.runningTotalLabel"),
  };

  return (
    <>
      <SEOHead
        title="Detailed Impact Pattern"
        canonicalPath="/standards/detailed-impact"
        description="A dated, taggable impact record connecting real-world events to Impact Stats counters and per-category detail pages."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("detailedImpact:hero.title")}
        description={t("detailedImpact:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("detailedImpact:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("detailedImpact:sections.timeline.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("detailedImpact:sections.timeline.description")}</p>
          <DetailedImpactSection entries={entries} categories={categories} categoryBasePath="/impact" labels={labels} />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("detailedImpact:sections.categoryPage.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("detailedImpact:sections.categoryPage.description")}</p>
          <DetailedImpactSection
            entries={getEntriesForCategory(entries, "feeding-supplies")}
            categories={categories}
            totalForCategoryId="feeding-supplies"
            categoryBasePath="/impact"
            labels={labels}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("detailedImpact:sections.derivedStats.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("detailedImpact:sections.derivedStats.description")}</p>
          <ImpactStatsSection
            description={t("detailedImpact:sampleData.derivedStatsNote")}
            lifetimeStats={getImpactLifetimeStats(entries, categories)}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("detailedImpact:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- {t("detailedImpact:standard.oneEntryManyCategories")}</p>
            <p>- {t("detailedImpact:standard.titleIndependentOfCategories")}</p>
            <p>
              - {t("detailedImpact:standard.composedNotMerged.before")} <code>relatedHref</code>{" "}
              {t("detailedImpact:standard.composedNotMerged.after")}
            </p>
            <p>- {t("detailedImpact:standard.noInventedNumbers")}</p>
            <p>- {t("detailedImpact:standard.categoryCardsAlwaysRender")}</p>
            <p>- {t("detailedImpact:standard.countingRule")}</p>
            <p>- {t("detailedImpact:standard.multiDay")}</p>
            <p>- {t("detailedImpact:standard.categoryIdStability")}</p>
            <p>
              - {t("detailedImpact:standard.component.before")}{" "}
              <code>template/src/components/patterns/DetailedImpactSection.tsx</code>
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default DetailedImpactStandardPage;
