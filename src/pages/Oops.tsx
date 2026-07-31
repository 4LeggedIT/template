import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import StructuredData from "@/components/patterns/StructuredData";

const Oops = () => {
  const { t } = useTranslation("errors");

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
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Oops" },
        ]}
        actions={
          <>
            <Button asChild>
              <Link to="/">{t("goHome")}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/standards">{t("openStandards")}</Link>
            </Button>
          </>
        }
      />
      <section className="container px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8">
          <h2 className="text-xl font-semibold">{t("whenToUseTitle")}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>{t("whenToUse1")}</li>
            <li>{t("whenToUse2")}</li>
            <li>{t("whenToUse3")}</li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Oops;
