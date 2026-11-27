import { useTranslation } from "react-i18next";
import DogSpotlightSection, { type DogSpotlightItem } from "@/components/patterns/DogSpotlightSection";
import StandardSnippet from "@/components/StandardSnippet";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { exampleCast, EXAMPLE_RESCUE } from "@/data/examples/cast";
import { buildExampleSnippet } from "@/lib/example-snippet";
import CollapsibleSection from "@/components/standards/CollapsibleSection";

const DogSpotlightStandardPage = () => {
  const { t } = useTranslation(["dogSpotlight", "common"]);

  const spotlight = (key: "juniper" | "buster" | "willow" | "atlas"): DogSpotlightItem => ({
    id: exampleCast[key].id,
    name: exampleCast[key].name,
    ...EXAMPLE_RESCUE,
    detailsUrl: `https://www.getbuddy.com/pet/example-${key}`,
    image: exampleCast[key].image,
    breed: t(`dogSpotlight:dogs.${key}.breed`),
    gender: t(`dogSpotlight:dogs.${key}.gender`),
    age: t(`dogSpotlight:dogs.${key}.age`),
  });

  const dogs: DogSpotlightItem[] = [spotlight("juniper"), spotlight("buster"), spotlight("willow"), spotlight("atlas")];

  const snippetExample = buildExampleSnippet({ component: "DogSpotlightSection", props: { dogs } });

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
        description="Homepage grid highlighting a hand-curated set of dogs, four across on desktop. Staff choose which dogs appear and in what order."
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
          <p className="text-sm text-muted-foreground">{t("dogSpotlight:sections.example.description")}</p>
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
          <p className="text-sm text-muted-foreground">{t("dogSpotlight:sections.withoutLink.description")}</p>
          <DogSpotlightSection dogs={dogWithoutLink} />
        </div>

        <StandardSnippet code={snippetExample} />

        <CollapsibleSection card title={t("dogSpotlight:standard.title")}>
          <div className="space-y-2 break-words text-sm text-muted-foreground">
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
          </div>
        </CollapsibleSection>
      </section>
    </>
  );
};

export default DogSpotlightStandardPage;
