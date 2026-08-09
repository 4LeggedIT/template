import { useTranslation } from "react-i18next";
import HomeHighlightSection, { type HomeHighlightItem } from "@/components/patterns/HomeHighlightSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEventsNewsHighlightItems, type EventsNewsEntry } from "@/components/patterns/EventsNewsSection";
import { getBlogHighlightItems } from "@/components/patterns/BlogSection";
import { eventsNewsExampleEntries } from "@/pages/examples/eventsNewsExampleData";
import { blogExamplePosts } from "@/pages/examples/blogExampleData";

const NewsHighlightStandardPage = () => {
  const { t } = useTranslation(["newsHighlight", "common"]);

  const withImageEntries: EventsNewsEntry[] = eventsNewsExampleEntries.map((entry) =>
    entry.id === "news-local-spotlight-2026-02-24"
      ? {
          ...entry,
          highlightOnHome: true,
          imageSrc: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1200&q=80",
          imageAlt: t("newsHighlight:example.imageAlt"),
        }
      : entry,
  );

  const withoutImageEntries: EventsNewsEntry[] = eventsNewsExampleEntries.map((entry) =>
    entry.id === "news-grant-2026-03-01" ? { ...entry, highlightOnHome: true } : entry,
  );

  const blogHighlightPosts = blogExamplePosts.map((post) =>
    post.slug === "lunas-journey-home" ? { ...post, highlightOnHome: true } : post,
  );

  // Mixed showcase: flag two Events/News entries plus one Blog post, then merge both selectors'
  // output by sortMs (newest first) before handing the combined list to a single
  // HomeHighlightSection — the pattern a real site's Home.tsx follows to mix content types.
  const mixedEventsNewsEntries: EventsNewsEntry[] = eventsNewsExampleEntries.map((entry) =>
    entry.id === "news-local-spotlight-2026-02-24" || entry.id === "news-grant-2026-03-01"
      ? { ...entry, highlightOnHome: true }
      : entry,
  );
  const mixedItems: HomeHighlightItem[] = [
    ...getEventsNewsHighlightItems(mixedEventsNewsEntries),
    ...getBlogHighlightItems(blogHighlightPosts, "/examples/blog"),
  ]
    .sort((a, b) => b.sortMs - a.sortMs)
    .slice(0, 3);

  return (
    <>
      <SEOHead
        title="News Highlight Pattern"
        canonicalPath="/standards/news-highlight"
        description="Homepage card that surfaces a single editor-flagged event, news entry, or blog post via the shared HomeHighlightSection component."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("newsHighlight:hero.title")}
        description={t("newsHighlight:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("newsHighlight:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("newsHighlight:sections.withImage.title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("newsHighlight:sections.withImage.part1")}
            <code>news-local-spotlight-2026-02-24</code>
            {t("newsHighlight:sections.withImage.part2")} <code>imageSrc</code>
            {t("newsHighlight:sections.withImage.part3")}
          </p>
          <HomeHighlightSection items={getEventsNewsHighlightItems(withImageEntries)} />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("newsHighlight:sections.withoutImage.title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("newsHighlight:sections.withoutImage.part1")}
            <code>news-grant-2026-03-01</code>
            {t("newsHighlight:sections.withoutImage.part2")} <code>imageSrc</code>{" "}
            {t("newsHighlight:sections.withoutImage.part3")}
          </p>
          <HomeHighlightSection items={getEventsNewsHighlightItems(withoutImageEntries)} />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("newsHighlight:sections.blog.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("newsHighlight:sections.blog.description")}</p>
          <HomeHighlightSection items={getBlogHighlightItems(blogHighlightPosts, "/examples/blog")} />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("newsHighlight:sections.mixed.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("newsHighlight:sections.mixed.description")}</p>
          <HomeHighlightSection items={mixedItems} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("newsHighlight:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("newsHighlight:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default NewsHighlightStandardPage;
