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

const TestimonialsExamplePage = () => {
  return (
    <>
      <SEOHead
        title="Testimonials Example"
        canonicalPath="/examples/testimonials"
        description="Reusable testimonials module with featured and grid layouts."
      />
      <PageHero
        eyebrow="Examples"
        title="Testimonials module"
        description="Featured and grid testimonial patterns standardized for template reuse."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Examples", href: "/examples" },
          { label: "Testimonials" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        <TestimonialsSection
          title="Featured testimonial"
          description="Featured layout supports a single highlighted story with optional random selection on load."
          testimonials={sampleTestimonials}
          layout="featured"
          featuredStrategy="randomOnLoad"
        />

        <TestimonialsSection
          title="Grid testimonials"
          description="Grid layout works for standard multi-card sections."
          testimonials={sampleTestimonials}
          layout="grid"
          columns={3}
        />

        <Card>
          <CardHeader>
            <CardTitle>Validation checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Text content renders server-side without JS.</p>
            <p>- `layout=&quot;featured&quot;` renders one highlighted testimonial.</p>
            <p>- Empty-state message appears when testimonials list is empty.</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default TestimonialsExamplePage;
