import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DocSection = {
  key: string;
  href: string;
  group: string;
};

const docSections: DocSection[] = [
  { key: "adoptablePets", href: "/standards/adoptable-pets", group: "petsAdoption" },
  { key: "dogSpotlight", href: "/standards/dog-spotlight", group: "petsAdoption" },
  { key: "found", href: "/standards/found", group: "petsAdoption" },
  { key: "placement", href: "/standards/placement-help", group: "petsAdoption" },
  { key: "eventsNews", href: "/standards/events-news", group: "contentEngagement" },
  { key: "newsHighlight", href: "/standards/news-highlight", group: "contentEngagement" },
  { key: "blog", href: "/standards/blog", group: "contentEngagement" },
  { key: "journeyTimeline", href: "/standards/journey-timeline", group: "contentEngagement" },
  { key: "successStories", href: "/standards/success-stories", group: "contentEngagement" },
  { key: "testimonials", href: "/standards/testimonials", group: "contentEngagement" },
  { key: "flyerLibrary", href: "/standards/flyer-library", group: "contentEngagement" },
  { key: "mediaGallery", href: "/standards/media-gallery", group: "contentEngagement" },
  { key: "faq", href: "/standards/faq-disclosure", group: "contentEngagement" },
  { key: "formEmbedModal", href: "/standards/form-embed-modal", group: "formsPayments" },
  { key: "paypalDonate", href: "/standards/paypal-donate", group: "formsPayments" },
  { key: "communityPartners", href: "/standards/community-partners", group: "community" },
  { key: "supporterRecognition", href: "/standards/supporter-recognition", group: "community" },
  { key: "impactStats", href: "/standards/impact-stats", group: "community" },
  { key: "spendBreakdown", href: "/standards/spend-breakdown", group: "community" },
  { key: "impactAccountability", href: "/standards/impact-accountability", group: "community" },
  { key: "kennelDisplayTools", href: "/standards/kennel-display-tools", group: "tools" },
  { key: "documents", href: "/standards/documents", group: "tools" },
  { key: "buildValidation", href: "/standards/workflow/build-validation", group: "workflow" },
  { key: "ciBuild", href: "/standards/workflow/ci-build", group: "workflow" },
  { key: "noJsFallbacks", href: "/standards/workflow/no-js-fallbacks", group: "workflow" },
];

const groupOrder = ["petsAdoption", "contentEngagement", "formsPayments", "community", "tools", "workflow"];

const TemplateStandardsHomePage = () => {
  const { t } = useTranslation(["standardsHome", "common"]);

  const groupedSections = groupOrder.map((group) => ({
    group,
    sections: docSections.filter((section) => section.group === group),
  }));

  return (
    <>
      <SEOHead
        title="Template Standards"
        canonicalPath="/standards"
        description="Template standards and migration documentation for the standardized website baseline."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("standardsHome:hero.title")}
        description={t("standardsHome:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
        ]}
      />
      <section className="container px-4 pt-6">
        <div className="mx-auto max-w-5xl rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">{t("standardsHome:status.label")}</span>{" "}
            {t("standardsHome:status.text")}
          </p>
        </div>
      </section>
      <section className="container space-y-8 px-4 py-10">
        {groupedSections.map(({ group, sections }) => (
          <div key={group} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t(`common:groups.${group}`)}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {sections.map((section) => (
                <Link key={section.href} to={section.href} className="group">
                  <Card className="h-full transition-colors group-hover:border-primary/50">
                    <CardHeader>
                      <CardTitle className="text-lg">{t(`standardsHome:sections.${section.key}.title`)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {t(`standardsHome:sections.${section.key}.description`)}
                      </p>
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
