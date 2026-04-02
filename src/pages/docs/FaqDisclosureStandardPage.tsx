import { Link } from "react-router-dom";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FaqDisclosureStandardPage = () => {
  return (
    <>
      <SEOHead
        title="FAQ / Disclosure Standard"
        canonicalPath="/docs/standards/faq-disclosure"
        description="Native details/summary standard for public FAQ and disclosure content."
      />
      <PageHero
        eyebrow="Docs"
        title="FAQ / Disclosure standard"
        description="Use native `<details>/<summary>` for FAQ and expandable public content by default."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "FAQ / Disclosure Standard" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Preferred for FAQ, informational disclosures, and "learn more" content.</p>
            <p>- Must work without JavaScript or hydration.</p>
            <p>- Style directly in the page/pattern component; do not require a JS accordion wrapper.</p>
            <p>- Use a custom accordion only with a documented exception.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Validation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- JS on: expand/collapse behavior and spacing/chevron styling are correct.</p>
            <p>- JS off: content is still readable and interactive.</p>
            <p>
              - Live reference:{" "}
              <Link className="underline underline-offset-4" to="/examples/faq-disclosure">
                FAQ / Disclosure example page
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default FaqDisclosureStandardPage;
