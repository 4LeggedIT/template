import { useTranslation } from "react-i18next";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import ZeffyDonateEmbed from "@/components/patterns/ZeffyDonateEmbed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ZeffyDonatePatternPage = () => {
  const { t } = useTranslation(["zeffyDonate", "common"]);

  return (
    <>
      <SEOHead
        title="Zeffy Donate Pattern"
        canonicalPath="/standards/zeffy-donate"
        description="Zeffy donation form embed standard and no-JS-safe fallback guidance."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("zeffyDonate:hero.title")}
        description={t("zeffyDonate:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("zeffyDonate:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("zeffyDonate:example.title")}</h2>
          <ZeffyDonateEmbed className="max-w-md" formSlug="DUMMY-FORM-SLUG-EXAMPLE-ONLY" />
          <p className="text-sm text-muted-foreground">{t("zeffyDonate:example.configNote")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("zeffyDonate:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("zeffyDonate:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default ZeffyDonatePatternPage;
