import { useTranslation } from "react-i18next";
import AdoptablePetsSection from "@/components/patterns/AdoptablePetsSection";
import StandardSnippet from "@/components/StandardSnippet";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import {
  AFV_ADOPT_A_PET_URL,
  AFV_GETBUDDY_ORG_ID,
  AFV_GETBUDDY_URL,
  AFV_PETFINDER_URL,
} from "@/data/afv-example-org";
import { buildExampleSnippet } from "@/lib/example-snippet";
import CollapsibleSection from "@/components/standards/CollapsibleSection";

const AdoptablePetsGetBuddyStandardPage = () => {
  const { t } = useTranslation(["adoptablePetsGetBuddy", "common"]);

  const snippetExample = buildExampleSnippet({
    component: "AdoptablePetsSection",
    props: {
      mode: "getbuddy",
      getBuddy: { organizationId: AFV_GETBUDDY_ORG_ID, species: "dog", listingsUrl: AFV_GETBUDDY_URL, petfinderUrl: AFV_PETFINDER_URL, adoptAPetUrl: AFV_ADOPT_A_PET_URL },
    },
  });

  return (
    <>
      <SEOHead
        title="Adoptable Pets — GetBuddy"
        canonicalPath="/standards/adoptable-pets/getbuddy"
        description="AdoptablePetsSection in getbuddy mode: GetBuddy's embeddable listings iframe, keyed off an organization ID."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("adoptablePetsGetBuddy:hero.title")}
        description={t("adoptablePetsGetBuddy:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("adoptablePetsGetBuddy:breadcrumb.parent"), href: "/standards/adoptable-pets" },
          { label: t("adoptablePetsGetBuddy:breadcrumb.current") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("adoptablePetsGetBuddy:example.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("adoptablePetsGetBuddy:example.description")}</p>
          <p className="text-sm text-muted-foreground">{t("adoptablePetsGetBuddy:disclosure")}</p>
          <AdoptablePetsSection
            mode="getbuddy"
            getBuddy={{
              title: t("adoptablePetsGetBuddy:getBuddy.title"),
              organizationId: AFV_GETBUDDY_ORG_ID,
              species: "dog",
              listingsUrl: AFV_GETBUDDY_URL,
              petfinderUrl: AFV_PETFINDER_URL,
              adoptAPetUrl: AFV_ADOPT_A_PET_URL,
            }}
            footerCta={{ label: t("adoptablePetsGetBuddy:footerCta.label"), href: "https://example.org/forms/adopt", external: true }}
          />
        </div>

        <StandardSnippet code={snippetExample} />

        <CollapsibleSection card title={t("adoptablePetsGetBuddy:standard.title")}>
          <div className="space-y-2 break-words text-sm text-muted-foreground">
            {(t("adoptablePetsGetBuddy:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </div>
        </CollapsibleSection>
      </section>
    </>
  );
};

export default AdoptablePetsGetBuddyStandardPage;
