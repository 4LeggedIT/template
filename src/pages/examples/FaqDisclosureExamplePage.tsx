import FaqAccordion from "@/components/patterns/FaqAccordion";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { flatFaqItems, sectionedFaqItems } from "@/data/faq-example";

const FaqDisclosureExamplePage = () => {
  return (
    <>
      <SEOHead
        title="FAQ Disclosure Example"
        canonicalPath="/examples/faq-disclosure"
        description="Native details/summary FAQ pattern example and validation notes."
      />
      <PageHero
        eyebrow="Examples"
        title="FAQ / Disclosure standard"
        description="Public FAQ and disclosure content should use native `<details>/<summary>` so the experience works with and without JavaScript."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Examples", href: "/examples" },
          { label: "FAQ / Disclosure" },
        ]}
      />
      <section className="container space-y-8 px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Flat mode — single card</CardTitle>
          </CardHeader>
          <CardContent>
            <FaqAccordion items={flatFaqItems} title="FAQ example" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sectioned mode — one titled card per section</CardTitle>
          </CardHeader>
          <CardContent>
            <FaqAccordion sections={sectionedFaqItems} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Validation checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- JS on: disclosures expand/collapse and chevron alignment remains correct.</p>
            <p>- JS off: content is still accessible and no hydration mismatch blocks interaction.</p>
            <p>- Verify keyboard support (Enter/Space on summary) and focus visibility.</p>
            <p>- Confirm no duplicate fallback content blocks were left behind from prior migrations.</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default FaqDisclosureExamplePage;
