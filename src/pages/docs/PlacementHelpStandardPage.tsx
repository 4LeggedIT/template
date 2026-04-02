import { Link } from "react-router-dom";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PlacementHelpStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Placement Pattern"
        canonicalPath="/docs/standards/placement-help"
        description="Standardized placement/courtesy-listing module with default expiry and optional pet metadata."
      />
      <PageHero
        eyebrow="Docs"
        title="Placement pattern"
        description="Use this module for placement/courtesy listings with a default three-month expiry window."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "Placement Pattern" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Use `PlacementHelpSection` for all placement/courtesy listing sections.</p>
            <p>- Default expiry is 3 months when `postedAt` is set and `expiresAt` is omitted.</p>
            <p>- `expiresAt` is optional and overrides the default expiry window.</p>
            <p>- Keep expired listings hidden by default (`showExpiredListings=false`).</p>
            <p>- Include optional pet metadata when available (breed, size, color, gender, vaccination, etc.).</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reference</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              - Live example:{" "}
              <Link className="underline underline-offset-4" to="/examples/placement-help">
                Placement module example page
              </Link>
            </p>
            <p>- Component: `template/src/components/patterns/PlacementHelpSection.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default PlacementHelpStandardPage;
