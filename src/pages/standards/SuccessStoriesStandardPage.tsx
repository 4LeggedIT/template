import { useTranslation } from "react-i18next";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import SuccessStoriesSection, { type SuccessStoryItem } from "@/components/patterns/SuccessStoriesSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SuccessStoriesStandardPage = () => {
  const { t } = useTranslation(["successStories", "common"]);

  const sampleStories: SuccessStoryItem[] = [
    {
      id: "story-1",
      name: "Remi",
      storyTitle: t("successStories:stories.remi.storyTitle"),
      imageSrc: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1200&q=80",
      imageAlt: t("successStories:stories.remi.imageAlt"),
      petType: t("successStories:stories.remi.petType"),
      breed: t("successStories:stories.remi.breed"),
      summary: t("successStories:stories.remi.summary"),
      storyContext: t("successStories:stories.remi.storyContext"),
      storyContent: [t("successStories:stories.remi.storyContent1"), t("successStories:stories.remi.storyContent2")],
      adoptedDateLabel: "2025-10-12",
      storyHref: "/news/example-article",
      storyCtaLabel: t("successStories:stories.remi.storyCtaLabel"),
      badgeLabel: t("successStories:stories.remi.badgeLabel"),
      featured: true,
    },
    {
      id: "story-2",
      name: "Nova",
      imageSrc: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1200&q=80",
      imageAlt: t("successStories:stories.nova.imageAlt"),
      petType: t("successStories:stories.nova.petType"),
      breed: t("successStories:stories.nova.breed"),
      summary: t("successStories:stories.nova.summary"),
      storyContext: t("successStories:stories.nova.storyContext"),
      adoptedDateLabel: "2025-08-03",
      badgeLabel: t("successStories:stories.nova.badgeLabel"),
    },
    {
      id: "story-3",
      name: "Peaches",
      imageSrc: "https://images.unsplash.com/photo-1494947665470-20322015e3a8?auto=format&fit=crop&w=1200&q=80",
      imageAlt: t("successStories:stories.peaches.imageAlt"),
      petType: t("successStories:stories.peaches.petType"),
      breed: t("successStories:stories.peaches.breed"),
      summary: t("successStories:stories.peaches.summary"),
      storyContent: t("successStories:stories.peaches.storyContent"),
      adoptedDateLabel: "2025-06-21",
      badgeLabel: t("successStories:stories.peaches.badgeLabel"),
    },
  ];

  return (
    <>
      <SEOHead
        title="Success Stories Pattern"
        canonicalPath="/standards/success-stories"
        description="Standardized success-stories module for narrative adoption outcomes and happy-tail cards."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("successStories:hero.title")}
        description={t("successStories:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("successStories:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("successStories:sections.example.title")}</h2>
          <SuccessStoriesSection
            title={t("successStories:sections.example.sectionTitle")}
            stories={sampleStories}
            columns={3}
            contentWidth="contained"
            showStoryContext
            showStoryContent
            showStoryCtas
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("successStories:sections.compact.title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("successStories:sections.compact.part1")} <code>stories</code>{" "}
            {t("successStories:sections.compact.part2")} <code>maxItems</code>{" "}
            {t("successStories:sections.compact.part3")}
          </p>
          <SuccessStoriesSection
            stories={sampleStories}
            showStoryContext={false}
            showStoryContent={false}
            showStoryCtas={false}
            showSummary
            columns={2}
            contentWidth="contained"
            maxItems={2}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("successStories:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("successStories:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default SuccessStoriesStandardPage;
