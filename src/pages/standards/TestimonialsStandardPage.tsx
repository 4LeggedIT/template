import { useTranslation } from "react-i18next";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import TestimonialsSection, { type TestimonialItem } from "@/components/patterns/TestimonialsSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TestimonialsStandardPage = () => {
  const { t } = useTranslation(["testimonials", "common"]);

  const sampleTestimonials: TestimonialItem[] = [
    {
      id: "t-1",
      quote: t("testimonials:items.t1.quote"),
      author: t("testimonials:items.t1.author"),
      authorMeta: t("testimonials:items.t1.authorMeta"),
      emoji: "🐾",
    },
    {
      id: "t-2",
      quote: t("testimonials:items.t2.quote"),
      author: t("testimonials:items.t2.author"),
      authorMeta: t("testimonials:items.t2.authorMeta"),
      emoji: "❤️",
    },
    {
      id: "t-3",
      quote: t("testimonials:items.t3.quote"),
      author: t("testimonials:items.t3.author"),
      authorMeta: t("testimonials:items.t3.authorMeta"),
    },
  ];

  const longformSample: TestimonialItem[] = [
    {
      id: "t-longform",
      quote: t("testimonials:items.longform.quote"),
      pullQuote: t("testimonials:items.longform.pullQuote"),
      author: t("testimonials:items.longform.author"),
      authorMeta: t("testimonials:items.longform.authorMeta"),
    },
  ];

  return (
    <>
      <SEOHead
        title="Testimonials Pattern"
        canonicalPath="/standards/testimonials"
        description="Standardized testimonials module for featured and grid content."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("testimonials:hero.title")}
        description={t("testimonials:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("testimonials:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("testimonials:sections.featured.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("testimonials:sections.featured.description")}</p>
          <TestimonialsSection
            title={t("testimonials:sections.featured.sectionTitle")}
            testimonials={sampleTestimonials}
            layout="featured"
            featuredStrategy="randomOnLoad"
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("testimonials:sections.grid.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("testimonials:sections.grid.description")}</p>
          <TestimonialsSection
            title={t("testimonials:sections.grid.sectionTitle")}
            testimonials={sampleTestimonials}
            layout="grid"
            columns={3}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("testimonials:sections.longform.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("testimonials:sections.longform.description")}</p>
          <TestimonialsSection
            title={t("testimonials:sections.longform.sectionTitle")}
            testimonials={longformSample}
            layout="longform"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("testimonials:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("testimonials:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default TestimonialsStandardPage;
