import { useTranslation } from "react-i18next";
import AdoptablePetsSection from "@/components/patterns/AdoptablePetsSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveLocalPets } from "@/data/adoptable-pets";
import { AFV_PETFINDER_URL } from "@/data/afv-example-org";
import { toContentLocale } from "@/lib/localized-content";

const AdoptablePetsLocalStandardPage = () => {
  const { t, i18n } = useTranslation(["adoptablePetsLocal", "common"]);
  const localPets = resolveLocalPets(toContentLocale(i18n.resolvedLanguage));

  return (
    <>
      <SEOHead
        title="Adoptable Pets — Local Listings"
        canonicalPath="/standards/adoptable-pets/local"
        description="AdoptablePetsSection in local mode: pets managed directly in a site's own data file, no external provider needed."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("adoptablePetsLocal:hero.title")}
        description={t("adoptablePetsLocal:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("adoptablePetsLocal:breadcrumb.parent"), href: "/standards/adoptable-pets" },
          { label: t("adoptablePetsLocal:breadcrumb.current") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("adoptablePetsLocal:example.title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("adoptablePetsLocal:disclosure")} {t("adoptablePetsLocal:example.linkIntro")}{" "}
            <a className="underline underline-offset-4" href={AFV_PETFINDER_URL} target="_blank" rel="noopener noreferrer">
              {t("adoptablePetsLocal:example.linkText")}
            </a>{" "}
            {t("adoptablePetsLocal:example.linkOutro")}
          </p>
          <AdoptablePetsSection
            mode="local"
            title={t("adoptablePetsLocal:localPets.title")}
            localPets={localPets}
            footerCta={{ label: t("adoptablePetsLocal:footerCta.label"), href: "https://example.org/forms/adopt", external: true }}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("adoptablePetsLocal:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("adoptablePetsLocal:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default AdoptablePetsLocalStandardPage;
