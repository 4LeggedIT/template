import { useTranslation } from "react-i18next";
import { buildExampleSnippet } from "@/lib/example-snippet";
import StandardSnippet from "@/components/StandardSnippet";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import StructuredData from "@/components/patterns/StructuredData";
import FaqAccordion from "@/components/patterns/FaqAccordion";
import ExampleBlock from "@/components/standards/ExampleBlock";
import { faqItems, faqSections } from "@/data/faq";
import { buildFaqJsonLd } from "@/lib/faq-json-ld";
import CollapsibleSection from "@/components/standards/CollapsibleSection";

const FaqStandardPage = () => {
  const { t } = useTranslation(["faqPattern", "common"]);

  const snippetExample = buildExampleSnippet({
    component: "FaqAccordion",
    props: { sections: faqSections, title: t("faqPattern:sections.sectioned.sectionTitle") },
    imports: [
      'import StructuredData from "@/components/patterns/StructuredData";',
      'import { buildFaqJsonLd } from "@/lib/faq-json-ld";',
    ],
    beforeTag: ["<StructuredData data={buildFaqJsonLd(faqSections)} /> {/* FAQ JSON-LD derived from the same data */}"],
  });

  return (
    <>
      <SEOHead
        title="FAQ Pattern"
        canonicalPath="/standards/faq"
        description="FAQ content schema, i18n data rule and derived JSON-LD, plus the native details/summary standard for FAQ content that works without JavaScript."
      />
      <StructuredData data={buildFaqJsonLd(faqSections)} />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("faqPattern:hero.title")}
        description={t("faqPattern:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("faqPattern:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <ExampleBlock title={t("faqPattern:sections.flat.title")} description={t("faqPattern:sections.flat.description")}>
          <FaqAccordion items={faqItems} title={t("faqPattern:sections.flat.cardTitle")} />
        </ExampleBlock>

        <ExampleBlock title={t("faqPattern:sections.sectioned.title")} description={t("faqPattern:sections.sectioned.description")}>
          <FaqAccordion sections={faqSections} title={t("faqPattern:sections.sectioned.sectionTitle")} />
        </ExampleBlock>

        <StandardSnippet code={snippetExample} />

        <CollapsibleSection card title={t("faqPattern:standard.title")}>
          <div className="space-y-4 break-words text-sm text-muted-foreground">
            {(["data", "behavior"] as const).map((group) => (
              <div key={group} className="space-y-2">
                <h3 className="font-semibold text-foreground">{t(`faqPattern:standard.${group}.title`)}</h3>
                {(t(`faqPattern:standard.${group}.items`, { returnObjects: true }) as string[]).map((item) => (
                  <p key={item}>- {item}</p>
                ))}
              </div>
            ))}
            <p>- {t("faqPattern:standard.component")}</p>
          </div>
        </CollapsibleSection>
      </section>
    </>
  );
};

export default FaqStandardPage;
