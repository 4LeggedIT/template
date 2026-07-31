import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const modePages = [
  { key: "local", href: "/standards/adoptable-pets/local" },
  { key: "petfinder", href: "/standards/adoptable-pets/petfinder" },
  { key: "adoptAPet", href: "/standards/adoptable-pets/adopt-a-pet" },
  { key: "getbuddy", href: "/standards/adoptable-pets/getbuddy" },
  { key: "pawPlacer", href: "/standards/pawplacer" },
  { key: "hybrid", href: "/standards/adoptable-pets/hybrid" },
];

const AdoptablePetsStandardPage = () => {
  const { t } = useTranslation(["adoptablePets", "common"]);

  return (
    <>
      <SEOHead
        title="Adoptable Pets Pattern"
        canonicalPath="/standards/adoptable-pets"
        description="Standardized adoptable pets module with provider adapters."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("adoptablePets:hero.title")}
        description={t("adoptablePets:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("adoptablePets:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modePages.map((page) => (
            <Link key={page.href} to={page.href} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="text-lg">{t(`adoptablePets:modes.${page.key}.title`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{t(`adoptablePets:modes.${page.key}.description`)}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("adoptablePets:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("adoptablePets:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default AdoptablePetsStandardPage;
