import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BuildValidationPage = () => {
  return (
    <>
      <SEOHead
        title="Build & Validation"
        canonicalPath="/docs/workflow/build-validation"
        description="Template build, preview, no-JS preview, and link-check commands."
      />
      <PageHero
        eyebrow="Docs"
        title="Build and validation workflow"
        description="Use these commands as the baseline validation flow when changing shared patterns or build tooling."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "Build & Validation" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Core commands</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- `npm run build` → internal link check + SSR/prerender build</p>
            <p>- `npm run preview` → standard Vite preview</p>
            <p>- `npm run preview:nojs` → serve prerendered output for no-JS QA</p>
            <p>- `npm run preview:nojs:build` → rebuild then no-JS preview</p>
            <p>- `npm test` → `vitest run`</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dependency security maintenance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Run `npm audit` to identify lockfile-level dependency vulnerabilities.</p>
            <p>- Apply low-risk remediations with `npm audit fix`.</p>
            <p>- Re-run `npm run build` after lockfile updates before merging.</p>
            <p>- Treat this as required maintenance across all template-based repos.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>When to use no-JS preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Form modal fallback changes (`FormEmbedModal`, helper links, `js-only` behavior)</p>
            <p>- FAQ/disclosure migrations</p>
            <p>- Header/menu behavior that depends on `details/summary` or CSS-only fallbacks</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default BuildValidationPage;
