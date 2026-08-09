import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import SuccessStoriesSection, { type SuccessStoryItem } from "@/components/patterns/SuccessStoriesSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Demonstrates the "splitting by status" convention (see the Standard card below): `status` is a
// site-owned field, not part of SuccessStoryItem itself — a real site's own extended story type
// carries it the same way (e.g. the-comeback-pack's LocalizedPackJourneyItem).
type DemoStoryItem = SuccessStoryItem & { status: "available" | "adopted" };

const SuccessStoriesStandardPage = () => {
  const { t } = useTranslation(["successStories", "common"]);

  const sampleStories: DemoStoryItem[] = [
    {
      id: "story-1",
      name: "Remi",
      status: "adopted",
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
      status: "adopted",
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
      status: "adopted",
      imageSrc: "https://images.unsplash.com/photo-1494947665470-20322015e3a8?auto=format&fit=crop&w=1200&q=80",
      imageAlt: t("successStories:stories.peaches.imageAlt"),
      petType: t("successStories:stories.peaches.petType"),
      breed: t("successStories:stories.peaches.breed"),
      summary: t("successStories:stories.peaches.summary"),
      storyContent: t("successStories:stories.peaches.storyContent"),
      adoptedDateLabel: "2025-06-21",
      badgeLabel: t("successStories:stories.peaches.badgeLabel"),
    },
    {
      id: "story-4",
      name: "Buddy",
      status: "available",
      imageSrc: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80",
      imageAlt: t("successStories:stories.buddy.imageAlt"),
      petType: t("successStories:stories.buddy.petType"),
      breed: t("successStories:stories.buddy.breed"),
      summary: t("successStories:stories.buddy.summary"),
      badgeLabel: t("successStories:stories.buddy.badgeLabel"),
    },
  ];

  const availableStories = sampleStories.filter((story) => story.status === "available");
  const adoptedStories = sampleStories.filter((story) => story.status === "adopted");

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
            stories={adoptedStories}
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
            stories={adoptedStories}
            showStoryContext={false}
            showStoryContent={false}
            showStoryCtas={false}
            showSummary
            columns={2}
            contentWidth="contained"
            maxItems={2}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("successStories:sections.split.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("successStories:sections.split.description")}</p>
          <div className="space-y-8">
            <SuccessStoriesSection
              title={t("successStories:sections.split.availableTitle")}
              stories={availableStories}
              showStoryContext={false}
              showStoryContent={false}
              showStoryCtas={false}
              columns={2}
              contentWidth="contained"
            />
            <SuccessStoriesSection
              title={t("successStories:sections.split.adoptedTitle")}
              stories={adoptedStories}
              showStoryContext={false}
              showStoryContent={false}
              showStoryCtas={false}
              columns={2}
              contentWidth="contained"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("successStories:sections.carousel.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("successStories:sections.carousel.description")}</p>
          <Carousel opts={{ loop: true }} autoPlay={{ delayMs: 4000 }} className="mx-auto max-w-3xl px-10">
            <CarouselContent>
              {sampleStories.map((story) => (
                <CarouselItem key={story.id} className="basis-1/2 sm:basis-1/3">
                  <div className="overflow-hidden rounded-xl border border-border bg-background">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={story.imageSrc}
                        alt={story.imageAlt ?? story.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      {story.badgeLabel ? (
                        <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
                          <Heart className="h-3 w-3 fill-current" />
                          <span>{story.badgeLabel}</span>
                        </div>
                      ) : null}
                    </div>
                    <p className="p-3 text-center font-semibold">{story.name}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("successStories:sections.badgeDictionary.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("successStories:sections.badgeDictionary.description")}</p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 text-xs leading-relaxed">
            <code>{`type StoryCtaAction = "adopt" | "foster" | "volunteer" | "contact" | "donate";

const STORY_STATUS_BADGES = {
  availableForAdoption: {
    label: { en: "Available for Adoption", es: "Disponible para Adopción" },
    ctaActions: ["adopt"],
  },
  needsFosterHome: {
    label: { en: "Needs a Foster Home", es: "Necesita un Hogar de Acogida" },
    ctaActions: ["foster"],
  },
  inFosterCare: {
    label: { en: "In Foster Care", es: "En Hogar de Acogida" },
    // Already has a foster — point people at other ways to help instead.
    ctaActions: ["contact", "foster", "volunteer"],
  },
  adopted: {
    label: { en: "Found Their Forever Home", es: "Encontró Su Hogar Para Siempre" },
    // Ask shifts from "help this one" to "help the next one".
    ctaActions: ["adopt", "donate", "volunteer"],
  },
} satisfies Record<string, { label: LocalizedText; ctaActions?: StoryCtaAction[] }>;

// Detail page: look up STORY_STATUS_BADGES[story.badge] once — same object drives
// both the badge pill text and which CTA button(s) to render, in order.`}</code>
          </pre>
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
