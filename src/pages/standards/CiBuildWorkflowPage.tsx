import { useTranslation } from "react-i18next";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SECTION_KEYS = ["baseline", "keepingInSync", "securityMaintenance"] as const;

const CiBuildWorkflowPage = () => {
  const { t } = useTranslation(["ciBuild", "common"]);

  return (
    <>
      <SEOHead
        title="CI Build Workflow"
        canonicalPath="/standards/workflow/ci-build"
        description="Minimal GitHub Actions install/build workflow and sync guidance."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("ciBuild:hero.title")}
        description={t("ciBuild:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards"), href: "/standards" },
          { label: t("ciBuild:breadcrumb") },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        {SECTION_KEYS.map((key) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle>{t(`ciBuild:sections.${key}.title`)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {(t(`ciBuild:sections.${key}.items`, { returnObjects: true }) as string[]).map((item) => (
                <p key={item}>- {item}</p>
              ))}
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
};

export default CiBuildWorkflowPage;
