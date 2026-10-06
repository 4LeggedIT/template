import { useTranslation } from "react-i18next";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import GivebutterWidget from "@/components/patterns/GivebutterWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GivebutterPatternPage = () => {
  const { t } = useTranslation(["givebutter", "common"]);

  return (
    <>
      <SEOHead
        title="Givebutter Pattern"
        canonicalPath="/standards/givebutter"
        description="Givebutter campaign widget standard and no-JS-safe fallback guidance."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("givebutter:hero.title")}
        description={t("givebutter:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("givebutter:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("givebutter:example.title")}</h2>
          <GivebutterWidget
            className="max-w-md"
            widgetId="DUMMY-WIDGET-ID-EXAMPLE-ONLY"
            accountId="DUMMY-ACCOUNT-ID-EXAMPLE-ONLY"
            campaignUrl="https://givebutter.com/example-campaign"
          />
          <p className="text-sm text-muted-foreground">{t("givebutter:example.configNote")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("givebutter:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("givebutter:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default GivebutterPatternPage;
