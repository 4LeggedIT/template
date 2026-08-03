import { useTranslation } from "react-i18next";
import SupporterRecognitionSection, {
  type Supporter,
  type SupporterRecognitionCategorySection,
} from "@/components/patterns/SupporterRecognitionSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SupporterRecognitionStandardPage = () => {
  const { t } = useTranslation(["supporterRecognition", "common"]);

  const sections: SupporterRecognitionCategorySection[] = [
    {
      category: "supporters",
      title: t("supporterRecognition:categories.supporters.title"),
      description: t("supporterRecognition:categories.supporters.description"),
    },
  ];

  const sampleSupporters: Supporter[] = [
    { id: "annette", name: "Annette", category: "supporters" },
    { id: "heather", name: "Heather", category: "supporters" },
    { id: "jess", name: "Jess", category: "supporters", note: "Monthly supporter" },
    { id: "susan", name: "Susan", category: "supporters" },
    { id: "tiffany", name: "Tiffany", category: "supporters" },
  ];

  return (
    <>
      <SEOHead
        title="Supporter Recognition Pattern"
        canonicalPath="/standards/supporter-recognition"
        description="Standardized pattern for publicly thanking individual donors and supporters with a flat, unranked list."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("supporterRecognition:hero.title")}
        description={t("supporterRecognition:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("supporterRecognition:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("supporterRecognition:example.title")}</h2>
          <SupporterRecognitionSection
            supporters={sampleSupporters}
            sections={sections}
            ctaTitle={t("supporterRecognition:example.ctaTitle")}
            ctaDescription={t("supporterRecognition:example.ctaDescription")}
            ctaLabel={t("supporterRecognition:example.ctaLabel")}
            ctaHref="/donate"
            omissionNoteText={t("supporterRecognition:example.omissionNoteText")}
            omissionNoteLinkLabel={t("supporterRecognition:example.omissionNoteLinkLabel")}
            omissionNoteHref="/contact"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("supporterRecognition:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("supporterRecognition:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default SupporterRecognitionStandardPage;
