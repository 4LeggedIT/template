import { Button } from "@/components/ui/button";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <SEOHead canonicalPath="/" />
      <PageHero
        eyebrow="Hello World"
        title="Standardized website template baseline"
        description="This home page intentionally stays minimal. Use the examples section to validate shared patterns before propagating changes to client sites."
        actions={
          <Button asChild>
            <Link to="/examples">Open Examples</Link>
          </Button>
        }
      />
      <section className="container px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Keep org-specific copy, data, and branding out of this repo. Add shared patterns here and
            verify them on dedicated example pages first.
          </p>
        </div>
      </section>
    </>
  );
};

export default HomePage;
