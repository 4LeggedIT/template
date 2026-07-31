import { Link } from "react-router-dom";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DocSection = {
  title: string;
  href: string;
  description: string;
  group: string;
};

const docSections: DocSection[] = [
  {
    title: "Adoptable Pets Pattern",
    href: "/standards/adoptable-pets",
    description: "Unified adoptable pets shell with provider adapters and fallback behavior.",
    group: "Pets & Adoption",
  },
  {
    title: "Dog Spotlight Pattern",
    href: "/standards/dog-spotlight",
    description: "Homepage grid highlighting a hand-curated set of dogs, four across on desktop.",
    group: "Pets & Adoption",
  },
  {
    title: "Found Pattern",
    href: "/standards/found",
    description: "Found notices module with safe-reunification checklist, status filtering, and CTA guidance.",
    group: "Pets & Adoption",
  },
  {
    title: "Placement Pattern",
    href: "/standards/placement-help",
    description: "Placement listings with default three-month expiry and optional pet metadata.",
    group: "Pets & Adoption",
  },
  {
    title: "Events & News Pattern",
    href: "/standards/events-news",
    description: "Unified event/news feed with archive behavior, recurrence support, and banner guidance.",
    group: "Content & Engagement",
  },
  {
    title: "News Highlight Pattern",
    href: "/standards/news-highlight",
    description: "Homepage card that surfaces a single editor-flagged event or news entry.",
    group: "Content & Engagement",
  },
  {
    title: "Journey Timeline Pattern",
    href: "/standards/journey-timeline",
    description: "Vertical rescue-to-today timeline for an individual dog's detail page, one card per stage.",
    group: "Content & Engagement",
  },
  {
    title: "Success Stories Pattern",
    href: "/standards/success-stories",
    description: "Narrative story-card module for adoption outcomes and happy tails.",
    group: "Content & Engagement",
  },
  {
    title: "Testimonials Pattern",
    href: "/standards/testimonials",
    description: "Featured and grid testimonial patterns for reusable social-proof sections.",
    group: "Content & Engagement",
  },
  {
    title: "Flyer Library Pattern",
    href: "/standards/flyer-library",
    description: "Timeless, undated awareness flyer library with category filtering — distinct from dated events/news.",
    group: "Content & Engagement",
  },
  {
    title: "Media Gallery Pattern",
    href: "/standards/media-gallery",
    description: "Unified photo/video gallery with optional filtering and no-JS-safe rendering.",
    group: "Content & Engagement",
  },
  {
    title: "FAQ Pattern",
    href: "/standards/faq-disclosure",
    description: "Native `<details>/<summary>` requirement for public FAQ/disclosure content.",
    group: "Content & Engagement",
  },
  {
    title: "FormEmbedModal Standard",
    href: "/standards/form-embed-modal",
    description: "Provider-agnostic form modal pattern with helper and no-JS fallbacks.",
    group: "Forms & Payments",
  },
  {
    title: "PayPal Donate Pattern",
    href: "/standards/paypal-donate",
    description: "Donate SDK button usage and direct-link fallback helper pattern.",
    group: "Forms & Payments",
  },
  {
    title: "Community Partners Pattern",
    href: "/standards/community-partners",
    description: "Thanking rescue collaborators and local business supporters without implying favoritism.",
    group: "Community",
  },
  {
    title: "Kennel & Display Tools Pattern",
    href: "/standards/kennel-display-tools",
    description: "Standalone full-viewport print/kiosk tools: adoptable slideshow and 2-up kennel card/binder print sheets.",
    group: "Tools",
  },
  {
    title: "Documents Pattern",
    href: "/standards/documents",
    description: "Print-ready adoption certificate, medical record, and generic document wrapper, plus the /documents index.",
    group: "Tools",
  },
  {
    title: "Build & Validation",
    href: "/standards/workflow/build-validation",
    description: "Build, preview, no-JS preview, and link-check commands.",
    group: "Workflow",
  },
  {
    title: "CI Build Workflow",
    href: "/standards/workflow/ci-build",
    description: "Minimal GitHub Actions install/build guard and sync approach.",
    group: "Workflow",
  },
  {
    title: "No-JS Fallbacks",
    href: "/standards/workflow/no-js-fallbacks",
    description: "Review checklist for `js-only`, `<noscript>`, and duplicate fallback cleanup.",
    group: "Workflow",
  },
];

const groupOrder = [
  "Pets & Adoption",
  "Content & Engagement",
  "Forms & Payments",
  "Community",
  "Tools",
  "Workflow",
];

const groupedSections = groupOrder.map((group) => ({
  group,
  sections: docSections.filter((section) => section.group === group),
}));

const TemplateStandardsHomePage = () => {
  return (
    <>
      <SEOHead
        title="Template Standards"
        canonicalPath="/standards"
        description="Template standards and migration documentation for the standardized website baseline."
      />
      <PageHero
        eyebrow="Standards"
        title="Template standards"
        description="Operational standards and migration guidance for the template. Each pattern page below includes its own live example."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
        ]}
      />
      <section className="container px-4 pt-6">
        <div className="mx-auto max-w-5xl rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Status:</span> Standards are maintained in this hub.
            Changes should include a standards update and migration notes.
          </p>
        </div>
      </section>
      <section className="container space-y-8 px-4 py-10">
        {groupedSections.map(({ group, sections }) => (
          <div key={group} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{group}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {sections.map((section) => (
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
          </div>
        ))}
      </section>
    </>
  );
};

export default TemplateStandardsHomePage;
