import { useTranslation } from "react-i18next";
import DogSpotlightSection, { type DogSpotlightItem } from "@/components/patterns/DogSpotlightSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DogSpotlightStandardPage = () => {
  const { t } = useTranslation(["dogSpotlight", "common"]);

  const dogs: DogSpotlightItem[] = [
    {
      id: "juniper",
      name: "Juniper",
      rescueId: "example-rescue",
      rescueName: "Example Rescue",
      detailsUrl: "https://www.getbuddy.com/pet/example-juniper",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
      breed: t("dogSpotlight:dogs.juniper.breed"),
      gender: t("dogSpotlight:dogs.juniper.gender"),
      age: t("dogSpotlight:dogs.juniper.age"),
    },
    {
      id: "buster",
      name: "Buster",
      rescueId: "example-rescue",
      rescueName: "Example Rescue",
      detailsUrl: "https://www.getbuddy.com/pet/example-buster",
      image: "https://images.unsplash.com/photo-1442605527737-ed62b867591f?auto=format&fit=crop&w=800&q=80",
      breed: t("dogSpotlight:dogs.buster.breed"),
      gender: t("dogSpotlight:dogs.buster.gender"),
      age: t("dogSpotlight:dogs.buster.age"),
    },
    {
      id: "willow",
      name: "Willow",
      rescueId: "example-rescue",
      rescueName: "Example Rescue",
      detailsUrl: "https://www.getbuddy.com/pet/example-willow",
      image: "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&w=800&q=80",
      breed: t("dogSpotlight:dogs.willow.breed"),
      gender: t("dogSpotlight:dogs.willow.gender"),
      age: t("dogSpotlight:dogs.willow.age"),
    },
    {
      id: "atlas",
      name: "Atlas",
      rescueId: "example-rescue",
      rescueName: "Example Rescue",
      detailsUrl: "https://www.getbuddy.com/pet/example-atlas",
      image: "https://images.unsplash.com/photo-1587469889554-7b59b6365db6?auto=format&fit=crop&w=800&q=80",
      breed: t("dogSpotlight:dogs.atlas.breed"),
      gender: t("dogSpotlight:dogs.atlas.gender"),
      age: t("dogSpotlight:dogs.atlas.age"),
    },
  ];

  const dogWithoutLink: DogSpotlightItem[] = [
    {
      ...dogs[0],
      id: "juniper-no-link",
      detailsUrl: undefined,
    },
  ];

  return (
    <>
      <SEOHead
        title="Dog Spotlight Pattern"
        canonicalPath="/standards/dog-spotlight"
        description="Homepage grid highlighting a hand-curated set of dogs, four across on desktop."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("dogSpotlight:hero.title")}
        description={t("dogSpotlight:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("dogSpotlight:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("dogSpotlight:sections.example.title")}</h2>
          <p className="text-sm text-muted-foreground">
            <code>dogs</code> {t("dogSpotlight:sections.example.descriptionMid")} <code>LocalAdoptableManifestItem[]</code>{" "}
            {t("dogSpotlight:sections.example.descriptionRest")}
          </p>
          <DogSpotlightSection dogs={dogs} />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("dogSpotlight:sections.withHeader.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("dogSpotlight:sections.withHeader.description")}</p>
          <DogSpotlightSection
            dogs={dogs}
            title={t("dogSpotlight:sections.withHeader.sectionTitle")}
            description={t("dogSpotlight:sections.withHeader.sectionDescription")}
            labels={{ ctaPrefix: t("dogSpotlight:sections.withHeader.ctaPrefix") }}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("dogSpotlight:sections.withoutLink.title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("dogSpotlight:sections.withoutLink.descriptionBefore")} <code>detailsUrl</code>{" "}
            {t("dogSpotlight:sections.withoutLink.descriptionAfter")}
          </p>
          <DogSpotlightSection dogs={dogWithoutLink} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("dogSpotlight:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              - <code>dogs</code> {t("dogSpotlight:standard.manifestType.before")}{" "}
              <code>LocalAdoptableManifestItem[]</code> {t("dogSpotlight:standard.manifestType.mid1")}{" "}
              <code>adoptable-local-manifest.ts</code>
              {t("dogSpotlight:standard.manifestType.mid2")}
            </p>
            <p>- {t("dogSpotlight:standard.selection")}</p>
            <p>- {t("dogSpotlight:standard.grid")}</p>
            <p>- {t("dogSpotlight:standard.ageGender")}</p>
            <p>
              - {t("dogSpotlight:standard.ctaButton.before")} {"{"}Name{"}"}
              {t("dogSpotlight:standard.ctaButton.middle")} {"{"}
              {"{"}token{"}"}
              {"}"}
              {t("dogSpotlight:standard.ctaButton.after")}
            </p>
            <p>- {t("dogSpotlight:standard.emptyState")}</p>
            <p>- {t("dogSpotlight:standard.distinctFromAdoptablePets")}</p>
            <p>- {t("dogSpotlight:standard.sharedType")}</p>
            <p>- {t("dogSpotlight:standard.component")}</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default DogSpotlightStandardPage;
