import { useTranslation } from "react-i18next";
import AdoptablePetsSection from "@/components/patterns/AdoptablePetsSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AFV_ADOPT_A_PET_SHELTER_ID,
  AFV_ADOPT_A_PET_URL,
  AFV_GETBUDDY_URL,
  AFV_PETFINDER_URL,
} from "@/data/afv-example-org";

const AdoptablePetsAdoptAPetStandardPage = () => {
  const { t } = useTranslation(["adoptablePetsAdoptAPet", "common"]);

  return (
    <>
      <SEOHead
        title="Adoptable Pets — Adopt-a-Pet"
        canonicalPath="/standards/adoptable-pets/adopt-a-pet"
        description="AdoptablePetsSection in adoptapet mode: an Adopt-a-Pet shelter page linked out, with an optional live widget."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("adoptablePetsAdoptAPet:hero.title")}
        description={t("adoptablePetsAdoptAPet:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("adoptablePetsAdoptAPet:breadcrumb.parent"), href: "/standards/adoptable-pets" },
          { label: t("adoptablePetsAdoptAPet:breadcrumb.current") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("adoptablePetsAdoptAPet:example.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("adoptablePetsAdoptAPet:disclosure")}</p>
          <AdoptablePetsSection
            mode="adoptapet"
            adoptAPet={{
              title: t("adoptablePetsAdoptAPet:adoptAPet.title"),
              listingsUrl: AFV_ADOPT_A_PET_URL,
              shelterId: AFV_ADOPT_A_PET_SHELTER_ID,
              petfinderUrl: AFV_PETFINDER_URL,
              getbuddyUrl: AFV_GETBUDDY_URL,
            }}
            footerCta={{ label: t("adoptablePetsAdoptAPet:footerCta.label"), href: "https://example.org/forms/adopt", external: true }}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("adoptablePetsAdoptAPet:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("adoptablePetsAdoptAPet:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default AdoptablePetsAdoptAPetStandardPage;
