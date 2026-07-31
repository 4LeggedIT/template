import { Trans, useTranslation } from "react-i18next";
import PawPlacerEmbed from "@/components/patterns/PawPlacerEmbed";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EXAMPLE_ORG_ID = "f2dde60b-b590-419c-8433-3df89bebf641";

const PawPlacerStandardPage = () => {
  const { t } = useTranslation(["pawPlacer", "common"]);

  return (
    <>
      <SEOHead
        title="PawPlacer Pattern"
        canonicalPath="/standards/pawplacer"
        description="Live PawPlacer adoptable-pets widget embed, keyed off an organization ID."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("pawPlacer:hero.title")}
        description={t("pawPlacer:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("pawPlacer:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("pawPlacer:example.title")}</h2>
          <p className="text-sm text-muted-foreground">
            <code>organizationId</code> {t("pawPlacer:example.paragraphPart1")}{" "}
            <code>&lt;div&gt;</code>
            {t("pawPlacer:example.paragraphPart2")}
          </p>
          <PawPlacerEmbed
            organizationId={EXAMPLE_ORG_ID}
            petfinderUrl="https://example.org/petfinder"
            adoptAPetUrl="https://example.org/adoptapet"
            getbuddyUrl="https://example.org/getbuddy"
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("pawPlacer:filtered.title")}</h2>
          <p className="text-sm text-muted-foreground">
            <Trans i18nKey="pawPlacer:filtered.paragraph" components={{ code: <code /> }} />
          </p>
          <PawPlacerEmbed organizationId={EXAMPLE_ORG_ID} species="dog" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("pawPlacer:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              - <Trans i18nKey="pawPlacer:standard.items.inject" components={{ code: <code /> }} />
            </p>
            <p>
              - <Trans i18nKey="pawPlacer:standard.items.listingsUrl" components={{ code: <code /> }} />
            </p>
            <p>
              - <Trans i18nKey="pawPlacer:standard.items.crossLinks" components={{ code: <code /> }} />
            </p>
            <p>
              - <Trans i18nKey="pawPlacer:standard.items.wired" components={{ code: <code /> }} />
            </p>
            <p>- {t("pawPlacer:standard.items.component")}</p>
            <p>- {t("pawPlacer:standard.items.notWired")}</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default PawPlacerStandardPage;
