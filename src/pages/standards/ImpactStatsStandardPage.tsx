import { useTranslation } from "react-i18next";
import { ArrowLeftRight, Heart, HeartHandshake, Home, Syringe, Users, Utensils } from "lucide-react";
import ImpactStatsSection, {
  type ImpactStat,
  type ImpactStatsPeriod,
} from "@/components/patterns/ImpactStatsSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ImpactStatsStandardPage = () => {
  const { t } = useTranslation(["impactStats", "common"]);

  const lifetimeStats: ImpactStat[] = [
    { id: "adopted", value: "1,240", label: t("impactStats:sampleData.lifetime.adopted"), icon: Heart },
    { id: "fostered", value: "340", label: t("impactStats:sampleData.lifetime.fostered"), icon: Home },
    { id: "helped", value: "2,100", label: t("impactStats:sampleData.lifetime.helped"), icon: HeartHandshake },
    { id: "spayNeuter", value: "980", label: t("impactStats:sampleData.lifetime.spayNeuter"), icon: Syringe },
    {
      id: "transferred",
      value: "215",
      label: t("impactStats:sampleData.lifetime.transferred"),
      icon: ArrowLeftRight,
    },
    { id: "straysFed", value: "6,400", label: t("impactStats:sampleData.lifetime.straysFed"), icon: Utensils },
    { id: "volunteers", value: "85", label: t("impactStats:sampleData.lifetime.volunteers"), icon: Users },
  ];

  const periodMetrics = {
    adopted: { label: t("impactStats:sampleData.metrics.adopted") },
    fostered: { label: t("impactStats:sampleData.metrics.fostered") },
  };

  const periods: ImpactStatsPeriod[] = [
    { id: "2023", label: "2023", metrics: { adopted: 280, fostered: 70 } },
    { id: "2024", label: "2024", metrics: { adopted: 340, fostered: 85 } },
    { id: "2025", label: "2025", metrics: { adopted: 410, fostered: 120 } },
    { id: "2026", label: "2026", metrics: { adopted: 480, fostered: 140 } },
  ];

  return (
    <>
      <SEOHead
        title="Impact Stats Pattern"
        canonicalPath="/standards/impact-stats"
        description="Lifetime impact stat tiles plus an optional period-by-period bar chart for rescue-organization impact reporting."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("impactStats:hero.title")}
        description={t("impactStats:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("impactStats:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("impactStats:sections.lifetime.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("impactStats:sections.lifetime.description")}</p>
          <ImpactStatsSection lifetimeStats={lifetimeStats} />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("impactStats:sections.trend.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("impactStats:sections.trend.description")}</p>
          <ImpactStatsSection
            lifetimeStats={[]}
            periods={periods}
            periodMetrics={periodMetrics}
            granularityLabel={t("impactStats:granularity.yearly")}
            labels={{ chartCaption: t("impactStats:chart.caption") }}
            ctaHref="/donate"
            ctaLabel={t("impactStats:cta.label")}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("impactStats:sections.singlePeriod.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("impactStats:sections.singlePeriod.description")}</p>
          <ImpactStatsSection
            lifetimeStats={[]}
            periods={[periods[periods.length - 1]]}
            periodMetrics={periodMetrics}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("impactStats:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              - {t("impactStats:standard.metricSet.before")} <code>lifetimeStats</code>{" "}
              {t("impactStats:standard.metricSet.after")}
            </p>
            <p>- {t("impactStats:standard.lifetimeAlwaysOn")}</p>
            <p>- {t("impactStats:standard.chartThreshold")}</p>
            <p>- {t("impactStats:standard.noInventedNumbers")}</p>
            <p>
              - {t("impactStats:standard.chartImplementation.before")} <code>recharts</code>{" "}
              {t("impactStats:standard.chartImplementation.mid")} <code>ui/chart.tsx</code>{" "}
              {t("impactStats:standard.chartImplementation.after")}
            </p>
            <p>
              - {t("impactStats:standard.component.before")}{" "}
              <code>template/src/components/patterns/ImpactStatsSection.tsx</code>
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default ImpactStatsStandardPage;
