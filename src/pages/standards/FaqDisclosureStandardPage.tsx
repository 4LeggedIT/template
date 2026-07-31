import FaqAccordion from "@/components/patterns/FaqAccordion";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { flatFaqItems, sectionedFaqItems } from "@/data/faq-example";

const FaqDisclosureStandardPage = () => {
  return (
    <>
      <SEOHead
        title="FAQ Pattern"
        canonicalPath="/standards/faq-disclosure"
        description="Native details/summary standard for public FAQ and disclosure content."
      />
      <PageHero
        eyebrow="Standards"
        title="FAQ pattern"
        description="Use native `<details>/<summary>` for FAQ and expandable public content by default."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "FAQ Pattern" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Example — flat mode</h2>
          <p className="text-sm text-muted-foreground">A single card holding one flat list of questions.</p>
          <FaqAccordion items={flatFaqItems} title="FAQ example" />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Sectioned mode</h2>
          <p className="text-sm text-muted-foreground">One titled card per section, for longer FAQ pages grouped by topic.</p>
          <FaqAccordion sections={sectionedFaqItems} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Preferred for FAQ, informational disclosures, and "learn more" content.</p>
            <p>- Must work without JavaScript or hydration — content stays readable and expandable with JS off.</p>
            <p>- Style directly in the page/pattern component; do not require a JS accordion wrapper.</p>
            <p>- Use a custom accordion only with a documented exception.</p>
            <p>- Verify keyboard support (Enter/Space on summary) and focus visibility.</p>
            <p>- Component: `template/src/components/patterns/FaqAccordion.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default FaqDisclosureStandardPage;
