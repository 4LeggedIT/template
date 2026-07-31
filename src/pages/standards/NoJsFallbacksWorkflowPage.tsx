import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NoJsFallbacksWorkflowPage = () => {
  return (
    <>
      <SEOHead
        title="No-JS Fallback Checklist"
        canonicalPath="/standards/workflow/no-js-fallbacks"
        description="Template no-JS fallback validation checklist and migration cleanup reminders."
      />
      <PageHero
        eyebrow="Standards"
        title="No-JS fallback validation checklist"
        description="Use this page as the review checklist when migrating CTAs, disclosures, and embeds to the template standards. This is a cross-cutting review checklist, not a single component's pattern doc — see each pattern's own page for its component-level standard."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "No-JS Fallbacks" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Required checks (all migrations)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Disable JavaScript, reload, and verify primary CTAs still navigate.</p>
            <p>- Modal-trigger anchors must use `target="_blank"` + `rel="noopener noreferrer"`.</p>
            <p>- Helper fallback links shown only in JS mode must have `className="js-only"`.</p>
            <p>- {"<noscript>"} fallback links must not duplicate visible helper links in no-JS.</p>
            <p>- FAQ/disclosure content must remain interactive via native {"<details>/<summary>"}.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common migration cleanup misses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Helper text drift ("Having trouble?" wording not standardized).</p>
            <p>- Missing no-JS `.js-only` hide rule in `index.html`.</p>
            <p>- New fallback link opens in same tab when modal trigger is an anchor.</p>
            <p>- Old accordion wrapper imports left in public FAQ/disclosure pages.</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default NoJsFallbacksWorkflowPage;
