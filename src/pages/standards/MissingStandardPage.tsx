import { useTranslation } from "react-i18next";
import MissingListingsSection from "@/components/patterns/MissingListingsSection";
import StandardSnippet from "@/components/StandardSnippet";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { getLocalizedSampleMissingNotices } from "@/data/missing-dog-example-notices";
import { toContentLocale } from "@/lib/localized-content";
import { buildExampleSnippet } from "@/lib/example-snippet";
import CollapsibleSection from "@/components/standards/CollapsibleSection";

// Dated relative to today so the sample stays inside the default 60-day expiry and the snippet below matches it.

const MissingStandardPage = () => {
  const { t, i18n } = useTranslation(["missing", "common"]);
  const locale = toContentLocale(i18n.resolvedLanguage);
  const notices = getLocalizedSampleMissingNotices(locale, (phone) => t("missing:section.sightingLabel", { phone }));

  const labels = {
    imageFallbackAltPrefix: t("missing:section.labels.imageFallbackAltPrefix"),
    noticeTitle: t("missing:section.labels.noticeTitle"),
    fieldReported: t("missing:section.labels.fieldReported"),
    fieldArea: t("missing:section.labels.fieldArea"),
    viewSourceLabel: t("missing:section.labels.viewSourceLabel"),
  };

  const snippetExample = buildExampleSnippet({
    component: "MissingListingsSection",
    props: { listings: notices, noticesTitle: t("missing:section.noticesTitle"), emptyMessage: t("missing:section.emptyMessage") },
  });

  return (
    <>
      <SEOHead
        title="Missing Pattern"
        canonicalPath="/standards/missing"
        description="Standardized list-only module for missing-dog notices: a simple list of dogs reported lost, so neighbors can help reunite them with their families."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("missing:hero.title")}
        description={t("missing:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("missing:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("missing:example.title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("missing:example.descriptionBefore")} <code>MissingListingsSection</code>{" "}
            {t("missing:example.descriptionAfter")}
          </p>
          <MissingListingsSection
            listings={notices}
            noticesTitle={t("missing:section.noticesTitle")}
            emptyMessage={t("missing:section.emptyMessage")}
            labels={labels}
            dateLocale={i18n.language}
          />
        </div>

        <StandardSnippet code={snippetExample} />

        <CollapsibleSection card title={t("missing:standard.title")}>
          <div className="space-y-2 break-words text-sm text-muted-foreground">
            {(t("missing:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </div>
        </CollapsibleSection>
      </section>
    </>
  );
};

export default MissingStandardPage;
