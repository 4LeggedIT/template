import { Link } from "react-router-dom";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TestimonialsStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Testimonials Pattern"
        canonicalPath="/docs/standards/testimonials"
        description="Standardized testimonials module for featured and grid content."
      />
      <PageHero
        eyebrow="Docs"
        title="Testimonials pattern"
        description="Use the shared testimonials module for adopter/foster/community stories."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "Testimonials Pattern" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Use `TestimonialsSection` instead of page-local testimonial markup.</p>
            <p>- Use `layout=&quot;featured&quot;` for single highlighted stories.</p>
            <p>- Use `layout=&quot;grid&quot;` for multi-testimonial sections.</p>
            <p>- Keep testimonials in page/site data files, not inline component internals.</p>
            <p>- Preserve SSR rendering; testimonials must remain readable without JS.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reference</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              - Live example:{" "}
              <Link className="underline underline-offset-4" to="/examples/testimonials">
                Testimonials example page
              </Link>
            </p>
            <p>- Component: `template/src/components/patterns/TestimonialsSection.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default TestimonialsStandardPage;
