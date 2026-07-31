import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { t } = useTranslation("home");

  return (
    <>
      <SEOHead canonicalPath="/" />
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        actions={
          <Button asChild>
            <Link to="/standards">{t("cta")}</Link>
          </Button>
        }
      />
      <section className="container px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 shadow-sm">
          <p className="text-sm text-muted-foreground">{t("bodyText")}</p>
        </div>
      </section>
    </>
  );
};

export default HomePage;
