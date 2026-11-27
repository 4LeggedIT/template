import { useTranslation } from "react-i18next";
import HomeHighlightSection, { type HomeHighlightItem } from "@/components/patterns/HomeHighlightSection";
import StandardSnippet from "@/components/StandardSnippet";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { type EventsNewsEntry } from "@/components/patterns/EventsNewsSection";
import { getEventsNewsHighlightItems } from "@/components/patterns/EventsNewsSection.helpers";
import { getBlogHighlightItems } from "@/components/patterns/BlogSection.helpers";
import { eventsNewsExampleEntries } from "@/pages/examples/eventsNewsExampleData";
import { blogExamplePosts } from "@/pages/examples/blogExampleData";
import { exampleImages } from "@/data/examples/images";
import { buildExampleSnippet, rawCode } from "@/lib/example-snippet";
import CollapsibleSection from "@/components/standards/CollapsibleSection";

const NewsHighlightStandardPage = () => {
  const { t } = useTranslation(["newsHighlight", "common"]);

  const withImageEntries: EventsNewsEntry[] = eventsNewsExampleEntries.map((entry) =>
    entry.id === "news-partner-spotlight"
      ? {
          ...entry,
          highlightOnHome: true,
          imageSrc: exampleImages.peaches,
          imageAlt: t("newsHighlight:example.imageAlt"),
        }
      : entry,
  );

  const withoutImageEntries: EventsNewsEntry[] = eventsNewsExampleEntries.map((entry) =>
    entry.id === "news-community-grant" ? { ...entry, highlightOnHome: true } : entry,
  );

  const blogHighlightPosts = blogExamplePosts.map((post) =>
    post.slug === "maples-journey-home" ? { ...post, highlightOnHome: true } : post,
  );

  // Mixed showcase: flag two Events/News entries plus one Blog post, then merge both selectors'
  // output by sortMs (newest first) before handing the combined list to a single
  // HomeHighlightSection — the pattern a real site's Home.tsx follows to mix content types.
  const mixedEventsNewsEntries: EventsNewsEntry[] = eventsNewsExampleEntries.map((entry) =>
    entry.id === "news-partner-spotlight" || entry.id === "news-community-grant"
      ? { ...entry, highlightOnHome: true }
      : entry,
  );
  const mixedItems: HomeHighlightItem[] = [
    ...getEventsNewsHighlightItems(mixedEventsNewsEntries),
    ...getBlogHighlightItems(blogHighlightPosts, "/examples/blog"),
  ]
    .sort((a, b) => b.sortMs - a.sortMs)
    .slice(0, 3);

  const snippetExample = buildExampleSnippet({
    component: "HomeHighlightSection",
    imports: ['import { getEventsNewsHighlightItems } from "@/components/patterns/EventsNewsSection.helpers";'],
    props: { items: rawCode("getEventsNewsHighlightItems(eventsNewsEntries)") },
  });

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
          <p className="text-sm text-muted-foreground">{t("newsHighlight:sections.withImage.description")}</p>
          <HomeHighlightSection items={getEventsNewsHighlightItems(withImageEntries)} />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("newsHighlight:sections.withoutImage.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("newsHighlight:sections.withoutImage.description")}</p>
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

        <StandardSnippet code={snippetExample} />

        <CollapsibleSection card title={t("newsHighlight:standard.title")}>
          <div className="space-y-2 break-words text-sm text-muted-foreground">
            {(t("newsHighlight:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </div>
        </CollapsibleSection>
      </section>
    </>
  );
};

export default NewsHighlightStandardPage;
