import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/patterns/SEOHead";

const NotFound = () => {
  return (
    <>
      <SEOHead
        title="Page not found"
        canonicalPath="/404"
        description="The page you requested could not be found."
      />
      <section className="container px-4 py-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">Page not found</p>
          <h1 className="mt-2 text-2xl font-semibold">We couldn't find that page</h1>
          <p className="mt-3 text-muted-foreground">
            The link may be outdated, or the page may have moved.
          </p>
          <div className="mt-6">
            <Button asChild variant="outline">
              <Link to="/">Back home</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
