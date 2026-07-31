import { useTranslation } from "react-i18next";
import AdoptablePetsSection from "@/components/patterns/AdoptablePetsSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AFV_ADOPT_A_PET_URL,
  AFV_GETBUDDY_URL,
  AFV_PETFINDER_ORG_ID,
  AFV_PETFINDER_URL,
} from "@/data/afv-example-org";

const AdoptablePetsPetfinderStandardPage = () => {
  const { t } = useTranslation(["adoptablePetsPetfinder", "common"]);

  return (
    <>
      <SEOHead
        title="Adoptable Pets — Petfinder"
        canonicalPath="/standards/adoptable-pets/petfinder"
        description="AdoptablePetsSection in petfinder mode: Petfinder's own pet-scroller widget, keyed off an organization ID."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("adoptablePetsPetfinder:hero.title")}
        description={t("adoptablePetsPetfinder:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("adoptablePetsPetfinder:breadcrumb.parent"), href: "/standards/adoptable-pets" },
          { label: t("adoptablePetsPetfinder:breadcrumb.current") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("adoptablePetsPetfinder:example.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("adoptablePetsPetfinder:disclosure")}</p>
          <AdoptablePetsSection
            mode="petfinder"
            petfinder={{
              organizationIds: [AFV_PETFINDER_ORG_ID],
              petfinderUrl: AFV_PETFINDER_URL,
              adoptAPetUrl: AFV_ADOPT_A_PET_URL,
              getbuddyUrl: AFV_GETBUDDY_URL,
            }}
            footerCta={{ label: t("adoptablePetsPetfinder:footerCta.label"), href: "https://example.org/forms/adopt", external: true }}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("adoptablePetsPetfinder:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("adoptablePetsPetfinder:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default AdoptablePetsPetfinderStandardPage;
