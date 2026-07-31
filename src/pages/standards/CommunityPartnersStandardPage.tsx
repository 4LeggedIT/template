import { Trans, useTranslation } from "react-i18next";
import CommunityPartnersSection, {
  type CommunityPartner,
  type CommunityPartnersCategorySection,
} from "@/components/patterns/CommunityPartnersSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CommunityPartnersStandardPage = () => {
  const { t } = useTranslation(["communityPartners", "common"]);

  const sections: CommunityPartnersCategorySection[] = [
    {
      category: "rescuePartners",
      title: t("communityPartners:categories.rescuePartners.title"),
      description: t("communityPartners:categories.rescuePartners.description"),
    },
    {
      category: "veterinaryPartners",
      title: t("communityPartners:categories.veterinaryPartners.title"),
      description: t("communityPartners:categories.veterinaryPartners.description"),
    },
    {
      category: "businessPartners",
      title: t("communityPartners:categories.businessPartners.title"),
      description: t("communityPartners:categories.businessPartners.description"),
    },
    {
      category: "technologyPartners",
      title: t("communityPartners:categories.technologyPartners.title"),
      description: t("communityPartners:categories.technologyPartners.description"),
    },
  ];

  const samplePartners: CommunityPartner[] = [
    {
      id: "cedar-hollow-animal-sanctuary",
      name: "Cedar Hollow Animal Sanctuary",
      category: "rescuePartners",
      description: t("communityPartners:partners.cedarHollow.description"),
    },
    {
      id: "bright-meadow-rescue-network",
      name: "Bright Meadow Rescue Network",
      category: "rescuePartners",
      description: t("communityPartners:partners.brightMeadow.description"),
    },
    {
      id: "example-veterinary-clinic",
      name: "Example Veterinary Clinic",
      category: "veterinaryPartners",
      description: t("communityPartners:partners.exampleVeterinary.description"),
      url: "https://example.com",
    },
    {
      id: "example-sandwich-co",
      name: "Example Sandwich Co.",
      category: "businessPartners",
      description: t("communityPartners:partners.exampleSandwich.description"),
      url: "https://example.com",
    },
    {
      id: "4leggedit",
      name: "4leggedIT",
      category: "technologyPartners",
      description: t("communityPartners:partners.fourLeggedIt.description"),
      logoSrc: "https://www.4leggedit.com/assets/logo-BEMpJuuD.webp",
      url: "https://www.4leggedit.com",
    },
  ];

  return (
    <>
      <SEOHead
        title="Community Partners Pattern"
        canonicalPath="/standards/community-partners"
        description="Standardized pattern for thanking rescue collaborators and local business supporters without implying favoritism."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("communityPartners:hero.title")}
        description={t("communityPartners:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("communityPartners:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("communityPartners:example.title")}</h2>
          <CommunityPartnersSection
            partners={samplePartners}
            sections={sections}
            ctaTitle={t("communityPartners:example.ctaTitle")}
            ctaDescription={t("communityPartners:example.ctaDescription")}
            ctaLabel={t("communityPartners:example.ctaLabel")}
            ctaHref="/contact"
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("communityPartners:oneCategoryNoCta.title")}</h2>
          <p className="text-sm text-muted-foreground">
            <Trans
              i18nKey="communityPartners:oneCategoryNoCta.description"
              components={[<code key="0" />, <code key="1" />, <code key="2" />, <code key="3" />]}
            />
          </p>
          <CommunityPartnersSection
            partners={samplePartners.filter((p) => p.category === "businessPartners")}
            sections={sections}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("communityPartners:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("communityPartners:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default CommunityPartnersStandardPage;
