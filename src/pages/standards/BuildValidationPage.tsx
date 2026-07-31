import { useTranslation } from "react-i18next";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SECTION_KEYS = ["coreCommands", "dependencySecurity", "whenToUseNoJs"] as const;

const BuildValidationPage = () => {
  const { t } = useTranslation(["buildValidation", "common"]);

  return (
    <>
      <SEOHead
        title="Build & Validation"
        canonicalPath="/standards/workflow/build-validation"
        description="Template build, preview, no-JS preview, and link-check commands."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("buildValidation:hero.title")}
        description={t("buildValidation:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards"), href: "/standards" },
          { label: t("buildValidation:breadcrumb") },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        {SECTION_KEYS.map((key) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle>{t(`buildValidation:sections.${key}.title`)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {(t(`buildValidation:sections.${key}.items`, { returnObjects: true }) as string[]).map((item) => (
                <p key={item}>- {item}</p>
              ))}
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
};

export default BuildValidationPage;
