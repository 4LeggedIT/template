import { useTranslation } from "react-i18next";
import RecognitionSection, {
  type Supporter,
  type RecognitionCategorySection,
} from "@/components/patterns/RecognitionSection";
import StandardSnippet from "@/components/StandardSnippet";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { buildExampleSnippet } from "@/lib/example-snippet";
import CollapsibleSection from "@/components/standards/CollapsibleSection";

const RecognitionStandardPage = () => {
  const { t } = useTranslation(["recognitionPattern", "common"]);

  const sections: RecognitionCategorySection[] = [
    {
      category: "supporters",
      title: t("recognitionPattern:categories.supporters.title"),
      description: t("recognitionPattern:categories.supporters.description"),
    },
  ];

  const sampleSupporters: Supporter[] = [
    { id: "annette", name: "Annette", category: "supporters" },
    { id: "heather", name: "Heather", category: "supporters" },
    { id: "jess", name: "Jess", category: "supporters", note: "Monthly supporter" },
    { id: "susan", name: "Susan", category: "supporters" },
    { id: "tiffany", name: "Tiffany", category: "supporters" },
  ];

  const snippetExample = buildExampleSnippet({
    component: "RecognitionSection",
    props: { supporters: sampleSupporters, sections },
  });

  return (
    <>
      <SEOHead
        title="Recognition Pattern"
        canonicalPath="/standards/recognition"
        description="Standardized pattern for publicly thanking individual donors and supporters with a flat, unranked list."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("recognitionPattern:hero.title")}
        description={t("recognitionPattern:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("recognitionPattern:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("recognitionPattern:example.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("recognitionPattern:example.description")}</p>
          <RecognitionSection
            supporters={sampleSupporters}
            sections={sections}
            ctaTitle={t("recognitionPattern:example.ctaTitle")}
            ctaDescription={t("recognitionPattern:example.ctaDescription")}
            ctaLabel={t("recognitionPattern:example.ctaLabel")}
            ctaHref="/standards/paypal-buttons"
            omissionNoteText={t("recognitionPattern:example.omissionNoteText")}
            omissionNoteLinkLabel={t("recognitionPattern:example.omissionNoteLinkLabel")}
            omissionNoteHref="/standards"
          />
        </div>

        <StandardSnippet code={snippetExample} />

        <CollapsibleSection card title={t("recognitionPattern:standard.title")}>
          <div className="space-y-2 break-words text-sm text-muted-foreground">
            {(t("recognitionPattern:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </div>
        </CollapsibleSection>
      </section>
    </>
  );
};

export default RecognitionStandardPage;
