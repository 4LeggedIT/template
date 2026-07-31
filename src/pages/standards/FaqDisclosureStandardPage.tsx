import { useTranslation } from "react-i18next";
import FaqAccordion, { type FaqAccordionItem, type FaqAccordionSection } from "@/components/patterns/FaqAccordion";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TranslatedFaqItem = { question: string; answer: string };
type TranslatedFaqGroup = { title: string; items: TranslatedFaqItem[] };

const FaqDisclosureStandardPage = () => {
  const { t } = useTranslation(["faqDisclosure", "common"]);

  const flatFaqItems: FaqAccordionItem[] = (
    t("faqDisclosure:sections.flat.items", { returnObjects: true }) as TranslatedFaqItem[]
  ).map((item, index) => ({ id: `faq-${index + 1}`, question: item.question, answer: item.answer }));

  const sectionedFaqItems: FaqAccordionSection[] = (
    t("faqDisclosure:sections.sectioned.groups", { returnObjects: true }) as TranslatedFaqGroup[]
  ).map((group, groupIndex) => ({
    id: `faq-group-${groupIndex + 1}`,
    title: group.title,
    items: group.items.map((item, itemIndex) => ({
      id: `faq-group-${groupIndex + 1}-${itemIndex + 1}`,
      question: item.question,
      answer: item.answer,
    })),
  }));

  return (
    <>
      <SEOHead
        title="FAQ Pattern"
        canonicalPath="/standards/faq-disclosure"
        description="Native details/summary standard for public FAQ and disclosure content."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("faqDisclosure:hero.title")}
        description={t("faqDisclosure:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("faqDisclosure:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("faqDisclosure:sections.flat.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("faqDisclosure:sections.flat.description")}</p>
          <FaqAccordion items={flatFaqItems} title={t("faqDisclosure:sections.flat.cardTitle")} />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("faqDisclosure:sections.sectioned.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("faqDisclosure:sections.sectioned.description")}</p>
          <FaqAccordion sections={sectionedFaqItems} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("faqDisclosure:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("faqDisclosure:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default FaqDisclosureStandardPage;
