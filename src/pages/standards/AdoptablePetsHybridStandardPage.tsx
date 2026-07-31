import { useTranslation } from "react-i18next";
import AdoptablePetsSection from "@/components/patterns/AdoptablePetsSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveLocalPets } from "@/data/adoptable-pets";
import {
  AFV_ADOPT_A_PET_SHELTER_ID,
  AFV_ADOPT_A_PET_URL,
  AFV_GETBUDDY_ORG_ID,
  AFV_PETFINDER_ORG_ID,
  AFV_PETFINDER_URL,
} from "@/data/afv-example-org";
import { toContentLocale } from "@/lib/localized-content";

const AdoptablePetsHybridStandardPage = () => {
  const { t, i18n } = useTranslation(["adoptablePetsHybrid", "common"]);
  const localPets = resolveLocalPets(toContentLocale(i18n.resolvedLanguage));

  return (
    <>
      <SEOHead
        title="Adoptable Pets — Hybrid"
        canonicalPath="/standards/adoptable-pets/hybrid"
        description="AdoptablePetsSection in hybrid mode: local listings shown alongside one or more provider adapters at once."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("adoptablePetsHybrid:hero.title")}
        description={t("adoptablePetsHybrid:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("adoptablePetsHybrid:breadcrumb.parent"), href: "/standards/adoptable-pets" },
          { label: t("adoptablePetsHybrid:breadcrumb.current") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("adoptablePetsHybrid:example.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("adoptablePetsHybrid:disclosure")}</p>
          <AdoptablePetsSection
            mode="hybrid"
            localPets={localPets}
            petfinder={{
              organizationIds: [AFV_PETFINDER_ORG_ID],
              petfinderUrl: AFV_PETFINDER_URL,
            }}
            adoptAPet={{
              listingsUrl: AFV_ADOPT_A_PET_URL,
              shelterId: AFV_ADOPT_A_PET_SHELTER_ID,
            }}
            getBuddy={{ organizationId: AFV_GETBUDDY_ORG_ID, species: "dog", iframeHeight: 900 }}
            footerCta={{ label: t("adoptablePetsHybrid:footerCta.label"), href: "https://example.org/forms/adopt", external: true }}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("adoptablePetsHybrid:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("adoptablePetsHybrid:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default AdoptablePetsHybridStandardPage;
