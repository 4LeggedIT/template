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

const SuccessStoriesExamplePage = () => {
  return (
    <>
      <SEOHead
        title="Success Stories Example"
        canonicalPath="/examples/success-stories"
        description="Narrative/story-first success stories module with pet cards, story context, and CTA support."
      />
      <PageHero
        eyebrow="Examples"
        title="Success stories module"
        description="Narrative/story-first pattern for happy tails and adopted-pet outcomes."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Examples", href: "/examples" },
          { label: "Success Stories" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        <SuccessStoriesSection
          title="Recent happy tails"
          description="Use for adopted-pet stories that need image cards plus narrative context."
          stories={sampleStories}
          columns={3}
          contentWidth="contained"
          showStoryContext
          showStoryContent
          showStoryCtas
        />

        <SuccessStoriesSection
          title="Compact variant"
          description="Use compact mode for home page previews."
          stories={sampleStories}
          showStoryContext={false}
          showStoryContent={false}
          showStoryCtas={false}
          showSummary
          columns={2}
          contentWidth="contained"
          maxItems={2}
        />

        <Card>
          <CardHeader>
            <CardTitle>Validation checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Story cards render image, title, and context in HTML without JS.</p>
            <p>- Optional long-form story content supports one paragraph or paragraph arrays.</p>
            <p>- Optional CTA supports both local routes and external links.</p>
            <p>- Compact mode keeps parity with legacy home-page card-grid usage.</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default SuccessStoriesExamplePage;
