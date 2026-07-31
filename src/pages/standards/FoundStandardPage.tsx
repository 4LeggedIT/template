import { useTranslation } from "react-i18next";
import FoundListingsSection, { type FoundListing } from "@/components/patterns/FoundListingsSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FoundStandardPage = () => {
  const { t } = useTranslation(["found", "common"]);

  const foundNotices: FoundListing[] = [
    {
      id: "SAMPLE-001",
      source: {
        type: "local",
        name: "Template Intake Board",
      },
      status: "open",
      foundAt: "3/26/2026",
      location: {
        areaLabel: "Eastgate, Example City 90210",
        crossStreets: "Juniper Ave and 3rd St",
      },
      pet: {
        name: "Buddy",
        species: "dog",
        sex: t("found:listings.notice1.sex"),
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
    },
    {
      id: "SAMPLE-002",
      source: {
        type: "local",
        name: "Template Intake Board",
      },
      status: "open",
      foundAt: "3/29/2026",
      location: {
        areaLabel: "North Hills, Example City 90211",
        crossStreets: "Olive Dr and Canyon Rd",
      },
      pet: {
        name: "Luna",
        species: "dog",
        sex: t("found:listings.notice2.sex"),
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
        description="Standardized found-notices module with safe reunification and contact CTA guidance."
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
            ctaTitle={t("found:example.ctaTitle")}
            ctaDescription={t("found:example.ctaDescription")}
            phoneCta={{ label: "(555) 010-0000", href: "tel:+15550100000" }}
            emailCta={{
              label: t("found:example.emailCtaLabel"),
              href: "mailto:hello@example.org?subject=Found%20Notice",
            }}
            helpLink={{ label: t("found:example.helpLinkLabel"), href: "/standards/found" }}
          />
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
