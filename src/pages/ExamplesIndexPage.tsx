import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";

const examplePages = [
  {
    title: "Adoptable Pets",
    href: "/examples/adoptable-pets",
    description: "Provider-agnostic adoptable pets shell (`local`, `petfinder`, `adopt_a_pet`, `getbuddy`, `hybrid`).",
  },
  {
    title: "Events & News",
    href: "/examples/events-news",
    description: "Unified event/news feed with archive and calendar ordering.",
  },
  {
    title: "Form Embed Modal",
    href: "/examples/form-embed-modal",
    description: "Provider-agnostic modal embeds (JotForm, Google Forms) with no-JS-safe fallbacks.",
  },
  {
    title: "Found",
    href: "/examples/found",
    description: "Found-dog notices module with verification-safe reunification guidance and contact CTAs.",
  },
  {
    title: "FAQ / Disclosure",
    href: "/examples/faq-disclosure",
    description: "Native `<details>/<summary>` FAQ patterns and validation expectations.",
  },
  {
    title: "Media Gallery",
    href: "/examples/media-gallery",
    description: "Unified photo/video gallery with optional category filters.",
  },
  {
    title: "Placement",
    href: "/examples/placement-help",
    description: "Placement/courtesy listings with default expiry and optional pet metadata.",
  },
  {
    title: "PayPal Donate",
    href: "/examples/paypal-donate",
    description: "SDK-backed donate button with direct-link fallback guidance.",
  },
  {
    title: "No-JS Fallbacks",
    href: "/examples/no-js-fallbacks",
    description: "Review checklist for `js-only`, `<noscript>`, and duplicate fallback cleanup.",
  },
  {
    title: "Success Stories",
    href: "/examples/success-stories",
    description: "Narrative/story-first adopted-pet module with image cards and story context.",
  },
  {
    title: "Testimonials",
    href: "/examples/testimonials",
    description: "Featured + grid testimonial module for reusable story sections.",
  },
];

const ExamplesIndexPage = () => {
  return (
    <>
      <SEOHead
        title="Examples"
        canonicalPath="/examples"
        description="Public examples and pattern references for the standardized template."
      />
      <PageHero
        eyebrow="Examples"
        title="Pattern examples and validation references"
        description="Use these pages instead of the old playground for feature-level validation. Each page includes implementation notes and what to verify in JS and no-JS browsers."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Examples" },
        ]}
      />
      <section className="container px-4 py-10">
        <div className="grid gap-4 md:grid-cols-2">
          {examplePages.map((page) => (
            <Link key={page.href} to={page.href} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="text-lg">{page.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{page.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default ExamplesIndexPage;
