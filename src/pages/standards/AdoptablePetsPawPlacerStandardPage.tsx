import { useTranslation } from "react-i18next";
import AdoptablePetsSection from "@/components/patterns/AdoptablePetsSection";
import StandardSnippet from "@/components/StandardSnippet";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { buildExampleSnippet } from "@/lib/example-snippet";
import CollapsibleSection from "@/components/standards/CollapsibleSection";

const EXAMPLE_ORG_ID = "f2dde60b-b590-419c-8433-3df89bebf641";

const AdoptablePetsPawPlacerStandardPage = () => {
  const { t } = useTranslation(["adoptablePetsPawPlacer", "common"]);

  const snippetExample = buildExampleSnippet({
    component: "AdoptablePetsSection",
    props: {
      mode: "pawplacer",
      pawPlacer: {
        organizationId: EXAMPLE_ORG_ID,
        petfinderUrl: "https://example.org/petfinder",
        adoptAPetUrl: "https://example.org/adoptapet",
        getbuddyUrl: "https://example.org/getbuddy",
      },
    },
  });

  return (
    <>
      <SEOHead
        title="Adoptable Pets — PawPlacer"
        canonicalPath="/standards/adoptable-pets/pawplacer"
        description="AdoptablePetsSection in pawplacer mode: PawPlacer's live listings widget, keyed off an organization ID."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("adoptablePetsPawPlacer:hero.title")}
        description={t("adoptablePetsPawPlacer:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("adoptablePetsPawPlacer:breadcrumb.parent"), href: "/standards/adoptable-pets" },
          { label: t("adoptablePetsPawPlacer:breadcrumb.current") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("adoptablePetsPawPlacer:example.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("adoptablePetsPawPlacer:example.description")}</p>
          <p className="text-sm text-muted-foreground">{t("adoptablePetsPawPlacer:disclosure")}</p>
          <AdoptablePetsSection
            mode="pawplacer"
            pawPlacer={{
              organizationId: EXAMPLE_ORG_ID,
              petfinderUrl: "https://example.org/petfinder",
              adoptAPetUrl: "https://example.org/adoptapet",
              getbuddyUrl: "https://example.org/getbuddy",
            }}
            footerCta={{ label: t("adoptablePetsPawPlacer:footerCta.label"), href: "https://example.org/forms/adopt", external: true }}
          />
        </div>

        <StandardSnippet code={snippetExample} />

        <CollapsibleSection card title={t("adoptablePetsPawPlacer:standard.title")}>
          <div className="space-y-2 break-words text-sm text-muted-foreground">
            {(t("adoptablePetsPawPlacer:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </div>
        </CollapsibleSection>
      </section>
    </>
  );
};

export default AdoptablePetsPawPlacerStandardPage;
