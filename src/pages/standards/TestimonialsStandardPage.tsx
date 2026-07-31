import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import TestimonialsSection, { type TestimonialItem } from "@/components/patterns/TestimonialsSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sampleTestimonials: TestimonialItem[] = [
  {
    id: "t-1",
    quote:
      "Fostering with our rescue has been an amazing experience. The support, supplies, and guidance made everything manageable.",
    author: "Alex",
    authorMeta: "Foster Family",
    emoji: "🐾",
  },
  {
    id: "t-2",
    quote:
      "The adoption process was clear and thoughtful. We felt supported the entire time and found the right dog for our home.",
    author: "Jordan",
    authorMeta: "Adopter",
    emoji: "❤️",
  },
  {
    id: "t-3",
    quote:
      "Our volunteer team works hard, but these stories keep us going. Seeing dogs settle into loving homes is everything.",
    author: "Team Volunteer",
    authorMeta: "Community Member",
  },
];

const TestimonialsStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Testimonials Pattern"
        canonicalPath="/standards/testimonials"
        description="Standardized testimonials module for featured and grid content."
      />
      <PageHero
        eyebrow="Standards"
        title="Testimonials pattern"
        description="Use the shared testimonials module for adopter/foster/community stories."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "Testimonials Pattern" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Example — featured (default)</h2>
          <p className="text-sm text-muted-foreground">
            Featured layout supports a single highlighted story with optional random selection on load.
          </p>
          <TestimonialsSection
            title="Featured testimonial"
            testimonials={sampleTestimonials}
            layout="featured"
            featuredStrategy="randomOnLoad"
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Grid</h2>
          <p className="text-sm text-muted-foreground">Grid layout works for standard multi-card sections.</p>
          <TestimonialsSection
            title="Grid testimonials"
            testimonials={sampleTestimonials}
            layout="grid"
            columns={3}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Use `TestimonialsSection` instead of page-local testimonial markup.</p>
            <p>- Default behavior shows one random testimonial (`layout=&quot;featured&quot;`, `featuredStrategy=&quot;randomOnLoad&quot;`) to avoid clutter — just pass `testimonials` and let the defaults apply.</p>
            <p>- Opt into `layout=&quot;grid&quot;` only when a page intentionally wants multiple testimonials shown at once.</p>
            <p>- An empty `testimonials` array renders nothing.</p>
            <p>- Keep testimonials in page/site data files, not inline component internals.</p>
            <p>- Text content renders server-side without JS — preserve SSR rendering, testimonials must remain readable without JS.</p>
            <p>- Component: `template/src/components/patterns/TestimonialsSection.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default TestimonialsStandardPage;
