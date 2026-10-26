import { useTranslation } from "react-i18next";
import FoundListingsSection, { type FoundListing } from "@/components/patterns/FoundListingsSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// The demo notices are dated relative to today so they never age past the default 30-day expiry.
const daysAgoISO = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
const notice1Date = daysAgoISO(5);
const notice2Date = daysAgoISO(2);

const sourceCommentExample = `{
  id: "sample-found-buddy",
  source: { type: "local", name: "Facebook", url: "https://www.facebook.com/example/posts/SAMPLE" }, // optional: the card links to the original post
  status: "open", // flip to "reunited" when the dog is home
  foundAtISO: "${notice1Date}", // the post date: printed on the card, and the notice hides 30 days after it
  ...
},`;

const FoundStandardPage = () => {
  const { t, i18n } = useTranslation(["found", "common"]);
  const formatFoundDate = (iso: string) =>
    new Intl.DateTimeFormat(i18n.language, { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`));

  const foundNotices: FoundListing[] = [
    {
      id: "SAMPLE-001",
      source: {
        type: "local",
        name: "Facebook",
        url: "https://www.facebook.com",
      },
      status: "open",
      foundAtISO: notice1Date,
      foundAt: formatFoundDate(notice1Date),
      location: {
        areaLabel: "Eastgate, Example City 90210",
        crossStreets: "Juniper Ave and 3rd St",
      },
      pet: {
        name: "Buddy",
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
        {
          id: "SAMPLE-001-image-2",
          src: "https://placehold.co/1200x800?text=Sample+Found+Dog+1+Side",
          alt: t("found:listings.notice1.mediaAlt2"),
        },
        {
          id: "SAMPLE-001-image-3",
          src: "https://placehold.co/1200x800?text=Sample+Found+Dog+1+Collar",
          alt: t("found:listings.notice1.mediaAlt3"),
        },
      ],
    },
    {
      id: "SAMPLE-002",
      source: {
        type: "local",
        name: "Template Intake Board",
      },
      status: "open",
      foundAtISO: notice2Date,
      foundAt: formatFoundDate(notice2Date),
      location: {
        areaLabel: "North Hills, Example City 90211",
        crossStreets: "Olive Dr and Canyon Rd",
      },
      pet: {
        name: "Luna",
        species: "dog",
        gender: t("found:listings.notice2.gender"),
        microchipStatus: t("found:listings.notice2.microchipStatus"),
      },
      notes: t("found:listings.notice2.notes"),
      media: [
        {
          id: "SAMPLE-002-image-1",
          src: "https://placehold.co/1200x800?text=Sample+Found+Dog+2",
          alt: t("found:listings.notice2.mediaAlt"),
          featured: true,
        },
      ],
    },
  ];

  return (
    <>
      <SEOHead
        title="Found Pattern"
        canonicalPath="/standards/found"
        description="Standardized list-only module for found-dog notices."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("found:hero.title")}
        description={t("found:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("found:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("found:example.title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("found:example.descriptionBefore")} <code>FoundListingsSection</code>{" "}
            {t("found:example.descriptionAfter")}
          </p>
          <FoundListingsSection
            mode="hybrid"
            listings={foundNotices}
            noticesTitle={t("found:section.noticesTitle")}
            emptyMessage={t("found:section.emptyMessage")}
            labels={{
              imageFallbackAltPrefix: t("found:section.labels.imageFallbackAltPrefix"),
              noticeTitle: t("found:section.labels.noticeTitle"),
              fieldPosted: t("found:section.labels.fieldPosted"),
              fieldGender: t("found:section.labels.fieldGender"),
              fieldFoundDate: t("found:section.labels.fieldFoundDate"),
              fieldFoundLocation: t("found:section.labels.fieldFoundLocation"),
              fieldCrossStreets: t("found:section.labels.fieldCrossStreets"),
              fieldMicrochip: t("found:section.labels.fieldMicrochip"),
              viewSourceLabel: t("found:section.labels.viewSourceLabel"),
            }}
            dateLocale={i18n.language}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("found:source.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("found:source.description")}</p>
          <pre className="overflow-x-auto rounded-md border bg-muted/30 p-4 text-xs">
            <code>{sourceCommentExample}</code>
          </pre>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("found:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("found:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default FoundStandardPage;
