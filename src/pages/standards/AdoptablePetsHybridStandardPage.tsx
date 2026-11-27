import { useTranslation } from "react-i18next";
import AdoptablePetsSection from "@/components/patterns/AdoptablePetsSection";
import StandardSnippet from "@/components/StandardSnippet";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { resolveLocalPets } from "@/data/adoptable-pets";
import { AFV_PETFINDER_ORG_ID, AFV_PETFINDER_URL } from "@/data/afv-example-org";
import { toContentLocale } from "@/lib/localized-content";
import { buildExampleSnippet } from "@/lib/example-snippet";
import CollapsibleSection from "@/components/standards/CollapsibleSection";

const AdoptablePetsHybridStandardPage = () => {
  const { t, i18n } = useTranslation(["adoptablePetsHybrid", "common"]);
  const localPets = resolveLocalPets(toContentLocale(i18n.resolvedLanguage));

  const snippetExample = buildExampleSnippet({
    component: "AdoptablePetsSection",
    props: {
      mode: "hybrid",
      localPets,
      petfinder: { organizationIds: [AFV_PETFINDER_ORG_ID], limit: 15, petfinderUrl: AFV_PETFINDER_URL },
    },
  });

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
          <p className="text-sm text-muted-foreground">{t("adoptablePetsHybrid:example.description")}</p>
          <p className="text-sm text-muted-foreground">{t("adoptablePetsHybrid:disclosure")}</p>
          <AdoptablePetsSection
            mode="hybrid"
            localPets={localPets}
            petfinder={{
              organizationIds: [AFV_PETFINDER_ORG_ID],
              limit: 15,
              petfinderUrl: AFV_PETFINDER_URL,
            }}
            footerCta={{ label: t("adoptablePetsHybrid:footerCta.label"), href: "https://example.org/forms/adopt", external: true }}
          />
        </div>

        <StandardSnippet code={snippetExample} />

        <CollapsibleSection card title={t("adoptablePetsHybrid:standard.title")}>
          <div className="space-y-2 break-words text-sm text-muted-foreground">
            {(t("adoptablePetsHybrid:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </div>
        </CollapsibleSection>
      </section>
    </>
  );
};

export default AdoptablePetsHybridStandardPage;
