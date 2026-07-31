import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Briefcase, HandCoins, Megaphone, Stethoscope, Truck } from "lucide-react";
import ImpactStatsSection, { type ImpactStatsPeriod } from "@/components/patterns/ImpactStatsSection";
import SpendBreakdownSection, {
  type SpendCategory,
} from "@/components/patterns/SpendBreakdownSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const relatedPages = [
  { key: "impactStats", href: "/standards/impact-stats" },
  { key: "spendBreakdown", href: "/standards/spend-breakdown" },
];

const ImpactAccountabilityStandardPage = () => {
  const { t } = useTranslation(["impactAccountability", "common"]);

  const categories: SpendCategory[] = [
    {
      id: "animalCare",
      label: t("impactAccountability:sampleData.animalCare"),
      amount: 24300,
      icon: Stethoscope,
    },
    {
      id: "rescueOperations",
      label: t("impactAccountability:sampleData.rescueOperations"),
      amount: 15750,
      icon: Truck,
    },
    {
      id: "marketingOutreach",
      label: t("impactAccountability:sampleData.marketingOutreach"),
      amount: 1850,
      icon: Megaphone,
    },
    {
      id: "administrative",
      label: t("impactAccountability:sampleData.administrative"),
      amount: 6420,
      icon: Briefcase,
    },
    {
      id: "fundraising",
      label: t("impactAccountability:sampleData.fundraising"),
      amount: 3100,
      icon: HandCoins,
    },
  ];

  const periods: ImpactStatsPeriod[] = [
    { id: "fy2026", label: "FY2026", metrics: { adopted: 480, helped: 610 } },
  ];

  return (
    <>
      <SEOHead
        title="Impact & Accountability"
        canonicalPath="/standards/impact-accountability"
        description="A worked example of composing the Impact Stats and Spend Breakdown patterns together on one page."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("impactAccountability:hero.title")}
        description={t("impactAccountability:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("impactAccountability:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("impactAccountability:sections.example.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("impactAccountability:sections.example.description")}</p>
          <div className="space-y-8">
            <ImpactStatsSection
              title={t("impactAccountability:sampleData.combinedTitle")}
              description={t("impactAccountability:sampleData.combinedDescription")}
              lifetimeStats={[]}
              periods={periods}
              periodMetrics={{
                adopted: { label: t("impactAccountability:sampleData.metrics.adopted") },
                helped: { label: t("impactAccountability:sampleData.metrics.helped") },
              }}
            />
            <SpendBreakdownSection
              categories={categories}
              periodLabel={t("impactAccountability:sampleData.periodLabel")}
              costPerOutcome={{
                amountLabel: "$84",
                outcomeLabel: t("impactAccountability:sampleData.costPerOutcomeLabel"),
              }}
              labels={{ totalLabel: t("impactAccountability:sampleData.totalLabel") }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("impactAccountability:sections.links.title")}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {relatedPages.map((page) => (
              <Link key={page.href} to={page.href} className="group">
                <Card className="h-full transition-colors group-hover:border-primary/50">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {t(`impactAccountability:links.${page.key}.title`)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {t(`impactAccountability:links.${page.key}.description`)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("impactAccountability:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- {t("impactAccountability:standard.twoComponents")}</p>
            <p>- {t("impactAccountability:standard.samePeriod")}</p>
            <p>- {t("impactAccountability:standard.sharedHeading")}</p>
            <p>- {t("impactAccountability:standard.costPerOutcome")}</p>
            <p>- {t("impactAccountability:standard.onlyWhenBothReady")}</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default ImpactAccountabilityStandardPage;
