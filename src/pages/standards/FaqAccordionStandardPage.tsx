import { useTranslation } from "react-i18next";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import StructuredData from "@/components/patterns/StructuredData";
import FaqAccordion from "@/components/patterns/FaqAccordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { faqSections } from "@/data/faq";
import { buildFaqJsonLd } from "@/lib/faq-json-ld";

const FaqAccordionStandardPage = () => {
  const { t } = useTranslation(["faqAccordion", "common"]);

  return (
    <>
      <SEOHead
        title="FAQ Accordion Pattern"
        canonicalPath="/standards/faq-accordion"
        description="Canonical FAQ content schema, i18n data-location rule, and derived JSON-LD requirement."
      />
      <StructuredData data={buildFaqJsonLd(faqSections)} />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("faqAccordion:hero.title")}
        description={t("faqAccordion:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("faqAccordion:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("faqAccordion:sections.sectioned.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("faqAccordion:sections.sectioned.description")}</p>
          <FaqAccordion sections={faqSections} title={t("faqAccordion:sections.sectioned.sectionTitle")} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("faqAccordion:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("faqAccordion:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default FaqAccordionStandardPage;
