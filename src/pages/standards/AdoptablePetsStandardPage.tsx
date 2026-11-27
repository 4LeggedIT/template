import { useTranslation } from "react-i18next";
import { resolveLocalPets } from "@/data/adoptable-pets";
import { toContentLocale } from "@/lib/localized-content";
import { buildExampleSnippet } from "@/lib/example-snippet";
import { Link } from "react-router-dom";
import StandardSnippet from "@/components/StandardSnippet";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CollapsibleSection from "@/components/standards/CollapsibleSection";

const modePages = [
  { key: "local", href: "/standards/adoptable-pets/local" },
  { key: "petfinder", href: "/standards/adoptable-pets/petfinder" },
  { key: "adoptAPet", href: "/standards/adoptable-pets/adopt-a-pet" },
  { key: "getbuddy", href: "/standards/adoptable-pets/getbuddy" },
  { key: "pawPlacer", href: "/standards/adoptable-pets/pawplacer" },
  { key: "hybrid", href: "/standards/adoptable-pets/hybrid" },
];

const AdoptablePetsStandardPage = () => {
  const { t, i18n } = useTranslation(["adoptablePets", "common"]);
  const localPets = resolveLocalPets(toContentLocale(i18n.resolvedLanguage));

  // One component, six modes: local is shown here; the dedicated pages cover petfinder, adoptapet, getbuddy, pawplacer and hybrid.
  const snippetExample = buildExampleSnippet({
    component: "AdoptablePetsSection",
    props: { mode: "local", title: "Adoptable Dogs", localPets },
  });

  return (
    <>
      <SEOHead
        title="Adoptable Pets Pattern"
        canonicalPath="/standards/adoptable-pets"
        description="Standardized adoptable pets module with provider adapters, so one page can show listings from Petfinder, PawPlacer, or hand-entered data."
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

        <StandardSnippet code={snippetExample} />

        <CollapsibleSection card title={t("adoptablePets:standard.title")}>
          <div className="space-y-2 break-words text-sm text-muted-foreground">
            {(t("adoptablePets:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </div>
        </CollapsibleSection>
      </section>
    </>
  );
};

export default AdoptablePetsStandardPage;
