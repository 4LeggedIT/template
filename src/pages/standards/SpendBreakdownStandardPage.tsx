import { useTranslation } from "react-i18next";
import { Briefcase, HandCoins, Megaphone, Stethoscope, Truck } from "lucide-react";
import SpendBreakdownSection, {
  type SpendCategory,
} from "@/components/patterns/SpendBreakdownSection";
import ImpactStatsSection, { type ImpactStatsPeriod } from "@/components/patterns/ImpactStatsSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SpendBreakdownStandardPage = () => {
  const { t } = useTranslation(["spendBreakdown", "common"]);

  const categories: SpendCategory[] = [
    { id: "animalCare", label: t("spendBreakdown:sampleData.animalCare"), amount: 24300, icon: Stethoscope },
    {
      id: "rescueOperations",
      label: t("spendBreakdown:sampleData.rescueOperations"),
      amount: 15750,
      icon: Truck,
    },
    {
      id: "marketingOutreach",
      label: t("spendBreakdown:sampleData.marketingOutreach"),
      amount: 1850,
      icon: Megaphone,
    },
    {
      id: "administrative",
      label: t("spendBreakdown:sampleData.administrative"),
      amount: 6420,
      icon: Briefcase,
    },
    { id: "fundraising", label: t("spendBreakdown:sampleData.fundraising"), amount: 3100, icon: HandCoins },
  ];

  const pairedPeriods: ImpactStatsPeriod[] = [
    { id: "fy2026", label: "FY2026", metrics: { adopted: 480, helped: 610 } },
  ];

  return (
    <>
      <SEOHead
        title="Spend Breakdown Pattern"
        canonicalPath="/standards/spend-breakdown"
        description="Rolled-up spend category tiles for rescue-organization accountability reporting, composable with the Impact Stats pattern."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("spendBreakdown:hero.title")}
        description={t("spendBreakdown:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("spendBreakdown:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("spendBreakdown:sections.standalone.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("spendBreakdown:sections.standalone.description")}</p>
          <SpendBreakdownSection
            categories={categories}
            periodLabel={t("spendBreakdown:sampleData.periodLabel")}
            sourceHref="https://projects.propublica.org/nonprofits/"
            labels={{
              totalLabel: t("spendBreakdown:sampleData.totalLabel"),
              sourceLabel: t("spendBreakdown:sampleData.sourceLabel"),
            }}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("spendBreakdown:sections.paired.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("spendBreakdown:sections.paired.description")}</p>
          <div className="space-y-8">
            <ImpactStatsSection
              title={t("spendBreakdown:sampleData.combinedTitle")}
              description={t("spendBreakdown:sampleData.combinedDescription")}
              lifetimeStats={[]}
              periods={pairedPeriods}
              periodMetrics={{
                adopted: { label: t("spendBreakdown:sampleData.metrics.adopted") },
                helped: { label: t("spendBreakdown:sampleData.metrics.helped") },
              }}
            />
            <SpendBreakdownSection
              categories={categories}
              periodLabel={t("spendBreakdown:sampleData.periodLabel")}
              costPerOutcome={{
                amountLabel: "$84",
                outcomeLabel: t("spendBreakdown:sampleData.costPerOutcomeLabel"),
              }}
              labels={{ totalLabel: t("spendBreakdown:sampleData.totalLabel") }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("spendBreakdown:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              - {t("spendBreakdown:standard.notMerged.before")} <code>ImpactStatsSection</code>{" "}
              {t("spendBreakdown:standard.notMerged.after")}
            </p>
            <p>
              - {t("spendBreakdown:standard.idVsLabel.before")} <code>id</code>{" "}
              {t("spendBreakdown:standard.idVsLabel.mid")} <code>label</code>{" "}
              {t("spendBreakdown:standard.idVsLabel.after")}
            </p>
            <p>- {t("spendBreakdown:standard.categorySet")}</p>
            <p>
              - {t("spendBreakdown:standard.periodRequired.before")} <code>periodLabel</code>{" "}
              {t("spendBreakdown:standard.periodRequired.after")}
            </p>
            <p>
              - {t("spendBreakdown:standard.costPerOutcome.before")} <code>costPerOutcome</code>{" "}
              {t("spendBreakdown:standard.costPerOutcome.after")}
            </p>
            <p>- {t("spendBreakdown:standard.noInventedNumbers")}</p>
            <p>- {t("spendBreakdown:standard.noDonorInfo")}</p>
            <p>- {t("spendBreakdown:standard.emptyState")}</p>
            <p>
              - {t("spendBreakdown:standard.component.before")}{" "}
              <code>template/src/components/patterns/SpendBreakdownSection.tsx</code>
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default SpendBreakdownStandardPage;
