import { Link } from "react-router-dom";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const docSections = [
  {
    title: "Adoptable Pets Pattern",
    href: "/docs/standards/adoptable-pets",
    description: "Unified adoptable pets shell with provider adapters and fallback behavior.",
  },
  {
    title: "Events & News Pattern",
    href: "/docs/standards/events-news",
    description: "Unified event/news feed with archive behavior, recurrence support, and banner guidance.",
  },
  {
    title: "FAQ / Disclosure Standard",
    href: "/docs/standards/faq-disclosure",
    description: "Native `<details>/<summary>` requirement for public FAQ/disclosure content.",
  },
  {
    title: "Found Pattern",
    href: "/docs/standards/found",
    description: "Found notices module with safe-reunification checklist, status filtering, and CTA guidance.",
  },
  {
    title: "FormEmbedModal Standard",
    href: "/docs/standards/form-embed-modal",
    description: "Provider-agnostic form modal pattern with helper and no-JS fallbacks.",
  },
  {
    title: "Media Gallery Pattern",
    href: "/docs/standards/media-gallery",
    description: "Unified photo/video gallery with optional filtering and no-JS-safe rendering.",
  },
  {
    title: "Placement Pattern",
    href: "/docs/standards/placement-help",
    description: "Placement listings with default three-month expiry and optional pet metadata.",
  },
  {
    title: "PayPal Donate Pattern",
    href: "/docs/standards/paypal-donate",
    description: "Donate SDK button usage and direct-link fallback helper pattern.",
  },
  {
    title: "Success Stories Pattern",
    href: "/docs/standards/success-stories",
    description: "Narrative story-card module for adoption outcomes and happy tails.",
  },
  {
    title: "Testimonials Pattern",
    href: "/docs/standards/testimonials",
    description: "Featured and grid testimonial patterns for reusable social-proof sections.",
  },
  {
    title: "Build & Validation",
    href: "/docs/workflow/build-validation",
    description: "Build, preview, no-JS preview, and link-check commands.",
  },
  {
    title: "CI Build Workflow",
    href: "/docs/workflow/ci-build",
    description: "Minimal GitHub Actions install/build guard and sync approach.",
  },
];

const TemplateDocsHomePage = () => {
  return (
    <>
      <SEOHead
        title="Template Docs"
        canonicalPath="/docs"
        description="Template standards and migration documentation for the standardized website baseline."
      />
      <PageHero
        eyebrow="Docs"
        title="Template documentation"
        description="Operational standards and migration guidance for the template. Examples pages remain the live reference implementations."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Docs" },
        ]}
        actions={
          <Link
            to="/examples"
            className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Open Examples
          </Link>
        }
      />
      <section className="container px-4 pt-6">
        <div className="mx-auto max-w-5xl rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Status:</span> Standards are maintained in this docs hub.
            Changes should include docs updates and migration notes.
          </p>
        </div>
      </section>
      <section className="container px-4 py-10">
        <div className="grid gap-4 md:grid-cols-2">
          {docSections.map((section) => (
            <Link key={section.href} to={section.href} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default TemplateDocsHomePage;
