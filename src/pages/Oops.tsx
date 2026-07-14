import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import StructuredData from "@/components/patterns/StructuredData";

const Oops = () => {
  return (
    <>
      <SEOHead
        title="Oops"
        canonicalPath="/oops"
        description="Friendly generic error page for the standardized template."
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Oops",
          url: "https://template.4leggedit.com/oops",
          description: "Friendly generic error page for the standardized template.",
        }}
      />
      <PageHero
        eyebrow="Error Pattern"
        title="Oops, something went wrong"
        description="Use this page as the standardized non-404 error destination for recoverable issues and graceful fallbacks."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Oops" },
        ]}
        actions={
          <>
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/examples">Open Examples</Link>
            </Button>
          </>
        }
      />
      <section className="container px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8">
          <h2 className="text-xl font-semibold">When to use this page</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Temporary integration failures (API unavailable, form embed blocked, etc.)</li>
            <li>Feature fallbacks where the page shell still loads correctly</li>
            <li>User-safe recovery paths with a clear next action</li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Oops;
