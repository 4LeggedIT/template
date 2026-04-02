import { Link } from "react-router-dom";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FoundStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Found Pattern"
        canonicalPath="/docs/standards/found"
        description="Standardized found-notices module with safe reunification and contact CTA guidance."
      />
      <PageHero
        eyebrow="Docs"
        title="Found pattern"
        description="Use this module for found-pet notices, intake checklist guidance, and safe reunification communication."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "Found Pattern" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Use `FoundListingsSection` for all found-notice pages.</p>
            <p>- Keep listing data normalized in `FoundListing` objects (`pet`, `location`, `source`, `status`).</p>
            <p>- Use mode controls (`local`, `external`, `hybrid`) instead of page-local filtering logic.</p>
            <p>- Keep warnings/checklists in module props so content is reusable and no-JS readable.</p>
            <p>- Source/media links should open in a new tab with safe rel attributes.</p>
            <p>- Keep CTA contact info anonymized in template/example content.</p>
            <p>- Use neutral styling defaults (no site-specific color branding in shared standards).</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reference</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              - Live example:{" "}
              <Link className="underline underline-offset-4" to="/examples/found">
                Found example page
              </Link>
            </p>
            <p>- Component: `template/src/components/patterns/FoundListingsSection.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default FoundStandardPage;
