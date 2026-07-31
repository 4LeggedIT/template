import { useTranslation } from "react-i18next";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SECTION_KEYS = ["requiredChecks", "commonMisses"] as const;

const NoJsFallbacksWorkflowPage = () => {
  const { t } = useTranslation(["noJsFallbacks", "common"]);

  return (
    <>
      <SEOHead
        title="No-JS Fallback Checklist"
        canonicalPath="/standards/workflow/no-js-fallbacks"
        description="Template no-JS fallback validation checklist and migration cleanup reminders."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("noJsFallbacks:hero.title")}
        description={t("noJsFallbacks:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("noJsFallbacks:breadcrumb") },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        {SECTION_KEYS.map((key) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle>{t(`noJsFallbacks:sections.${key}.title`)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {(t(`noJsFallbacks:sections.${key}.items`, { returnObjects: true }) as string[]).map((item) => (
                <p key={item}>- {item}</p>
              ))}
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
};

export default NoJsFallbacksWorkflowPage;
