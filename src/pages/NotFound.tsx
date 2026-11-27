import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/patterns/SEOHead";

const NotFound = () => {
  const { t } = useTranslation("errors");

  return (
    <>
      <SEOHead
        title="Page not found"
        canonicalPath="/404"
        description="The page you requested could not be found."
      />
      <section className="container px-4 py-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">{t("notFound.eyebrow")}</p>
          <h1 className="mt-2 text-2xl font-semibold">{t("notFound.title")}</h1>
          <p className="mt-3 text-muted-foreground">{t("notFound.description")}</p>
          <div className="mt-6">
            <Button asChild variant="outline">
              <Link to="/">{t("notFound.backHome")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
