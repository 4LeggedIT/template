import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import SuccessStoriesSection, { type SuccessStoryItem } from "@/components/patterns/SuccessStoriesSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sampleStories: SuccessStoryItem[] = [
  {
    id: "story-1",
    name: "Remi",
    storyTitle: "Remi's Journey",
    imageSrc: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Tan rescue dog resting comfortably after adoption",
    petType: "Dog",
    breed: "Mixed Breed",
    summary: "From abandoned stray to forever loved family member.",
    storyContext: "Remi arrived underweight and fearful, then stabilized in foster care before adoption.",
    storyContent: [
      "After intake, Remi received veterinary care, nutrition support, and confidence-building routines.",
      "Once matched with an adopter, the transition plan focused on structure, decompression, and ongoing support.",
    ],
    adoptedDateLabel: "2025-10-12",
    storyHref: "/news/example-article",
    storyCtaLabel: "Read full happy tail",
    badgeLabel: "Forever Loved",
    featured: true,
  },
  {
    id: "story-2",
    name: "Nova",
    imageSrc: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Smiling black rescue dog outdoors",
    petType: "Dog",
    breed: "Labrador Mix",
    summary: "Medical recovery followed by a successful family placement.",
    storyContext: "Nova needed post-op foster support and a low-stress home match.",
    adoptedDateLabel: "2025-08-03",
    badgeLabel: "Adopted",
  },
  {
    id: "story-3",
    name: "Peaches",
    imageSrc: "https://images.unsplash.com/photo-1494947665470-20322015e3a8?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Small rescue dog with pink harness",
    petType: "Dog",
    breed: "Terrier Mix",
    summary: "Shy intake that became a confident companion at home.",
    storyContent: "Peaches needed a quieter placement and did well with slow introductions and consistency.",
    adoptedDateLabel: "2025-06-21",
    badgeLabel: "Happy Tail",
  },
];

const SuccessStoriesStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Success Stories Pattern"
        canonicalPath="/standards/success-stories"
        description="Standardized success-stories module for narrative adoption outcomes and happy-tail cards."
      />
      <PageHero
        eyebrow="Standards"
        title="Success stories pattern"
        description="Narrative/story-first pattern for happy tails and adopted-pet outcomes — full context and CTA on a dedicated stories page, or a compact card grid for a home-page preview."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "Success Stories Pattern" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Example</h2>
          <SuccessStoriesSection
            title="Recent happy tails"
            stories={sampleStories}
            columns={3}
            contentWidth="contained"
            showStoryContext
            showStoryContent
            showStoryCtas
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Compact variant (home-page preview)</h2>
          <p className="text-sm text-muted-foreground">
            Same <code>stories</code> data, with context/content/CTAs turned off and <code>maxItems</code> capping the
            grid — the settings a home page uses instead of a separate card component.
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
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Use `SuccessStoriesSection` for adoption outcomes and happy-tail story collections.</p>
            <p>- Store stories as normalized `SuccessStoryItem` objects and pass them through `stories`.</p>
            <p>- Use module toggles (`showSummary`, `showStoryContext`, `showStoryContent`, `showStoryCtas`) instead of page-local branching.</p>
            <p>- For home-page previews, use compact settings (`maxItems`, `columns`, and content toggles) rather than a separate card implementation — see the variant above.</p>
            <p>- Cards are no-JS readable; the portrait image and the optional story link (`storyHref`) both render as plain anchors — internal routes use `Link`, external URLs get `target="_blank" rel="noreferrer"`.</p>
            <p>- `contentWidth="contained"` narrows the section to a centered column; default is `"full"` width.</p>
            <p>- `labels` overrides section copy (`adoptedLabel`, `readStoryLabel`, `adoptedPrefix`) for i18n/site customization.</p>
            <p>- Component: `template/src/components/patterns/SuccessStoriesSection.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default SuccessStoriesStandardPage;
