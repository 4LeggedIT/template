import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CiBuildWorkflowPage = () => {
  return (
    <>
      <SEOHead
        title="CI Build Workflow"
        canonicalPath="/docs/workflow/ci-build"
        description="Minimal GitHub Actions install/build workflow and sync guidance."
      />
      <PageHero
        eyebrow="Docs"
        title="CI build workflow guard"
        description="Each repo should include a minimal GitHub Actions workflow that runs install + build to catch dependency/build drift early."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "CI Build Workflow" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Baseline workflow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- `actions/checkout`</p>
            <p>- `actions/setup-node` (Node 22 + npm cache)</p>
            <p>- `npm clean-install --progress=false`</p>
            <p>- `npm run build`</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Keeping repos in sync</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Source of truth: `template/.github/workflows/build.yml`</p>
            <p>- Sync script: `tools/scripts/repo-maintenance/sync-build-workflow.mjs`</p>
            <p>- Wrapper: `tools/scripts/repo-maintenance/sync-build-workflow.sh --check`</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Security maintenance expectation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- CI build guard catches breakage after lockfile security patches.</p>
            <p>- Run periodic dependency audit + patch passes across migrated repos.</p>
            <p>- Lockfile updates should be followed by repo-by-repo `npm run build` verification.</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default CiBuildWorkflowPage;
