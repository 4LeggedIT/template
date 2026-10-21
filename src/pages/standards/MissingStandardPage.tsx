import { useTranslation } from "react-i18next";
import FoundListingsSection, { type FoundListing } from "@/components/patterns/FoundListingsSection";
import MissingListingsSection from "@/components/patterns/MissingListingsSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLocalizedSampleMissingNotices } from "@/data/missing-dog-example-notices";
import { toContentLocale } from "@/lib/localized-content";

const sourceCommentExample = `// Source: Facebook post 2026-03-26 (sample missing dog flyer) —
// https://www.facebook.com/example/posts/SAMPLE
{
  id: "sample-missing-biscuit",
  name: "Biscuit",
  status: "missing", // flip to "found" when the dog is home
  reportedAtISO: "2026-03-26",
  ...
},`;

const MissingStandardPage = () => {
  const { t, i18n } = useTranslation(["missing", "found", "common"]);
  const locale = toContentLocale(i18n.resolvedLanguage);
  const notices = getLocalizedSampleMissingNotices(locale, (phone) => t("missing:section.sightingLabel", { phone }));

  const foundNotice: FoundListing = {
    id: "SAMPLE-001",
    source: { type: "local" },
    status: "open",
    pet: {
      species: "dog",
      gender: t("found:listings.notice1.gender"),
      microchipStatus: t("found:listings.notice1.microchipStatus"),
    },
    notes: t("found:listings.notice1.notes"),
    media: [
      {
        id: "SAMPLE-001-image-1",
        src: "https://placehold.co/1200x800?text=Sample+Found+Dog+1",
        alt: t("found:listings.notice1.mediaAlt"),
        featured: true,
      },
    ],
  };

  const labels = {
    imageOpenAriaLabelPrefix: t("missing:section.labels.imageOpenAriaLabelPrefix"),
    imageFallbackAltPrefix: t("missing:section.labels.imageFallbackAltPrefix"),
    noticeTitle: t("missing:section.labels.noticeTitle"),
    fieldReported: t("missing:section.labels.fieldReported"),
    fieldArea: t("missing:section.labels.fieldArea"),
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

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("missing:together.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("missing:together.description")}</p>
          <div className="space-y-10 rounded-xl border p-4">
            <MissingListingsSection
              listings={notices}
              noticesTitle={t("missing:section.noticesTitle")}
              emptyMessage={t("missing:section.emptyMessage")}
              labels={labels}
            />
            <FoundListingsSection
              mode="local"
              listings={[foundNotice]}
              noticesTitle={t("found:section.noticesTitle")}
              emptyMessage={t("found:section.emptyMessage")}
              labels={{
                imageOpenAriaLabelPrefix: t("found:section.labels.imageOpenAriaLabelPrefix"),
                imageFallbackAltPrefix: t("found:section.labels.imageFallbackAltPrefix"),
                noticeTitle: t("found:section.labels.noticeTitle"),
                fieldGender: t("found:section.labels.fieldGender"),
                fieldFoundDate: t("found:section.labels.fieldFoundDate"),
                fieldFoundLocation: t("found:section.labels.fieldFoundLocation"),
                fieldCrossStreets: t("found:section.labels.fieldCrossStreets"),
                fieldMicrochip: t("found:section.labels.fieldMicrochip"),
              }}
            />
            <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
              {t("missing:together.pageLocalNote")}
            </p>
          </div>
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
