import { useTranslation } from "react-i18next";
import MissingListingsSection from "@/components/patterns/MissingListingsSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLocalizedSampleMissingNotices } from "@/data/missing-dog-example-notices";
import { toContentLocale } from "@/lib/localized-content";

// Dated relative to today so the sample stays inside the default 60-day expiry and the snippet below matches it.
const samplePostedISO = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

const sourceCommentExample = `{
  id: "sample-missing-biscuit",
  name: "Biscuit",
  status: "missing", // flip to "found" when the dog is home
  reportedAtISO: "${samplePostedISO}", // the post date: printed on the card, and the notice hides 60 days after it
  sourceUrl: "https://www.facebook.com/example/posts/SAMPLE", // optional: the card links to the original post
  sourceName: "Facebook",
  ...
},`;

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

  return (
    <>
      <SEOHead
        title="Missing Pattern"
        canonicalPath="/standards/missing"
        description="Standardized list-only module for missing-dog notices."
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

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("missing:source.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("missing:source.description")}</p>
          <pre className="overflow-x-auto rounded-md border bg-muted/30 p-4 text-xs">
            <code>{sourceCommentExample}</code>
          </pre>
          <p className="text-sm text-muted-foreground">{t("missing:source.caption")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("missing:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("missing:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default MissingStandardPage;
