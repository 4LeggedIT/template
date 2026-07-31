import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tools = [
  {
    key: "adoptableSlideshow",
    href: "/tools/adoptable-slideshow",
    component: "AdoptableSlideshowSection.tsx",
  },
  {
    key: "kennelBinder2Up",
    href: "/tools/kennel-binder-2up",
    component: "KennelBinder2UpSection.tsx",
  },
  {
    key: "kennelCards2Up",
    href: "/tools/kennel-cards-2up",
    component: "KennelCards2UpSection.tsx",
  },
];

const KennelDisplayToolsStandardPage = () => {
  const { t } = useTranslation(["kennelDisplayTools", "common"]);

  return (
    <>
      <SEOHead
        title="Kennel & Display Tools Pattern"
        canonicalPath="/standards/kennel-display-tools"
        description="Standalone, full-viewport print and kiosk-display tools for shelter/kennel use — slideshow display and 2-up print sheets."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("kennelDisplayTools:hero.title")}
        description={t("kennelDisplayTools:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("kennelDisplayTools:breadcrumb") },
        ]}
      />

      <section className="container space-y-6 px-4 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {tools.map((tool) => (
            <Card key={tool.href}>
              <CardHeader>
                <CardTitle className="text-lg">{t(`kennelDisplayTools:tools.${tool.key}.title`)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t(`kennelDisplayTools:tools.${tool.key}.description`)}
                </p>
                <Link className="text-sm underline underline-offset-4" to={tool.href}>
                  {t("kennelDisplayTools:openLiveTool")}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("kennelDisplayTools:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("kennelDisplayTools:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default KennelDisplayToolsStandardPage;
