import { useTranslation } from "react-i18next";
import AdoptablePetsSection from "@/components/patterns/AdoptablePetsSection";
import StandardSnippet from "@/components/StandardSnippet";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { resolveLocalPets } from "@/data/adoptable-pets";
import { toContentLocale } from "@/lib/localized-content";
import { buildExampleSnippet } from "@/lib/example-snippet";
import CollapsibleSection from "@/components/standards/CollapsibleSection";

const AdoptablePetsLocalStandardPage = () => {
  const { t, i18n } = useTranslation(["adoptablePetsLocal", "common"]);
  const localPets = resolveLocalPets(toContentLocale(i18n.resolvedLanguage));

  const snippetExample = buildExampleSnippet({
    component: "AdoptablePetsSection",
    props: { mode: "local", title: t("adoptablePetsLocal:localPets.title"), localPets },
  });

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
          <p className="text-sm text-muted-foreground">{t("adoptablePetsLocal:example.description")}</p>
          <AdoptablePetsSection
            mode="local"
            title={t("adoptablePetsLocal:localPets.title")}
            localPets={localPets}
            footerCta={{ label: t("adoptablePetsLocal:footerCta.label"), href: "https://example.org/forms/adopt", external: true }}
          />
        </div>

        <StandardSnippet code={snippetExample} />

        <CollapsibleSection card title={t("adoptablePetsLocal:standard.title")}>
          <div className="space-y-2 break-words text-sm text-muted-foreground">
            {(t("adoptablePetsLocal:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </div>
        </CollapsibleSection>
      </section>
    </>
  );
};

export default AdoptablePetsLocalStandardPage;
