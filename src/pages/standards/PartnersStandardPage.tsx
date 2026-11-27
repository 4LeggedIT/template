import { useTranslation } from "react-i18next";
import PartnersSection, {
  type Partner,
  type PartnersCategorySection,
} from "@/components/patterns/PartnersSection";
import StandardSnippet from "@/components/StandardSnippet";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { exampleImages } from "@/data/examples/images";
import { buildExampleSnippet } from "@/lib/example-snippet";
import CollapsibleSection from "@/components/standards/CollapsibleSection";

const PartnersStandardPage = () => {
  const { t } = useTranslation(["partnersPattern", "common"]);

  const sections: PartnersCategorySection[] = [
    {
      category: "rescuePartners",
      title: t("partnersPattern:categories.rescuePartners.title"),
      description: t("partnersPattern:categories.rescuePartners.description"),
    },
    {
      category: "veterinaryPartners",
      title: t("partnersPattern:categories.veterinaryPartners.title"),
      description: t("partnersPattern:categories.veterinaryPartners.description"),
    },
    {
      category: "businessPartners",
      title: t("partnersPattern:categories.businessPartners.title"),
      description: t("partnersPattern:categories.businessPartners.description"),
    },
    {
      category: "technologyPartners",
      title: t("partnersPattern:categories.technologyPartners.title"),
      description: t("partnersPattern:categories.technologyPartners.description"),
    },
  ];

  const samplePartners: Partner[] = [
    {
      id: "example-rescue-network-1",
      name: "Example Rescue Network 1",
      category: "rescuePartners",
      logoSrc: exampleImages.rescueNetwork1Logo,
      url: "https://example.org",
      description: t("partnersPattern:partners.exampleRescueNetwork1.description"),
    },
    {
      id: "example-rescue-network-2",
      name: "Example Rescue Network 2",
      category: "rescuePartners",
      logoSrc: exampleImages.rescueNetwork2Logo,
      url: "https://example.org",
      description: t("partnersPattern:partners.exampleRescueNetwork2.description"),
    },
    {
      id: "example-veterinary-clinic",
      name: "Example Veterinary Clinic",
      category: "veterinaryPartners",
      logoSrc: exampleImages.veterinaryClinicLogo,
      description: t("partnersPattern:partners.exampleVeterinary.description"),
      url: "https://example.org",
    },
    {
      id: "example-sandwich-co",
      name: "Example Sandwich Co.",
      category: "businessPartners",
      logoSrc: exampleImages.sandwichCoLogo,
      description: t("partnersPattern:partners.exampleSandwich.description"),
      url: "https://example.org",
    },
    {
      id: "4leggedit",
      name: "4leggedIT",
      category: "technologyPartners",
      description: t("partnersPattern:partners.fourLeggedIt.description"),
      logoSrc: exampleImages.fourLeggedItLogo,
      url: "https://www.4leggedit.com",
    },
  ];

  const snippetExample = buildExampleSnippet({
    component: "PartnersSection",
    props: { partners: samplePartners, sections },
  });

  return (
    <>
      <SEOHead
        title="Partners Pattern"
        canonicalPath="/standards/partners"
        description="Standardized pattern for thanking rescue collaborators and local business supporters without implying favoritism."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("partnersPattern:hero.title")}
        description={t("partnersPattern:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("partnersPattern:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("partnersPattern:example.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("partnersPattern:example.description")}</p>
          <PartnersSection
            partners={samplePartners}
            sections={sections}
            ctaTitle={t("partnersPattern:example.ctaTitle")}
            ctaDescription={t("partnersPattern:example.ctaDescription")}
            ctaLabel={t("partnersPattern:example.ctaLabel")}
            ctaHref="/standards"
            omissionNoteText={t("partnersPattern:example.omissionNoteText")}
            omissionNoteLinkLabel={t("partnersPattern:example.omissionNoteLinkLabel")}
            omissionNoteHref="/standards"
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("partnersPattern:oneCategoryNoCta.title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("partnersPattern:oneCategoryNoCta.description")}
          </p>
          <PartnersSection
            partners={samplePartners.filter((p) => p.category === "businessPartners")}
            sections={sections}
          />
        </div>

        <StandardSnippet code={snippetExample} />

        <CollapsibleSection card title={t("partnersPattern:standard.title")}>
          <div className="space-y-2 break-words text-sm text-muted-foreground">
            {(t("partnersPattern:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </div>
        </CollapsibleSection>
      </section>
    </>
  );
};

export default PartnersStandardPage;
