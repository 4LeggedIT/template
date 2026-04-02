import { Link } from "react-router-dom";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SuccessStoriesStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Success Stories Pattern"
        canonicalPath="/docs/standards/success-stories"
        description="Standardized success-stories module for narrative adoption outcomes and happy-tail cards."
      />
      <PageHero
        eyebrow="Docs"
        title="Success stories pattern"
        description="Use the shared success-stories module for narrative pet outcomes, context blocks, and optional story CTAs."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "Success Stories Pattern" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Use `SuccessStoriesSection` for adoption outcomes and happy-tail story collections.</p>
            <p>- Store stories as normalized objects and pass them through `stories` props.</p>
            <p>- Use module toggles (`showSummary`, `showStoryContext`, `showStoryContent`, `showStoryCtas`) instead of page-local branching.</p>
            <p>- For home-page previews, use compact settings (`maxItems`, `columns`, and content toggles) rather than separate card implementations.</p>
            <p>- Keep cards no-JS readable; optional story links must work as regular anchors/links.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reference</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              - Live example:{" "}
              <Link className="underline underline-offset-4" to="/examples/success-stories">
                Success stories example page
              </Link>
            </p>
            <p>- Component: `template/src/components/patterns/SuccessStoriesSection.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default SuccessStoriesStandardPage;
