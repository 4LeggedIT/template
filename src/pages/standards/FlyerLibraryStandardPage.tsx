import FlyerLibrarySection, { type FlyerLibraryItem } from "@/components/patterns/FlyerLibrarySection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import adoptionFridaysFlyer from "@/assets/flyers/adoption-fridays-flyer.svg";
import basketRaffleFlyer from "@/assets/flyers/basket-raffle-flyer.svg";

const sampleFlyers: FlyerLibraryItem[] = [
  {
    id: "adoption-fridays",
    src: adoptionFridaysFlyer,
    alt: "Friday Adoption Meet-and-Greet flyer — every Friday, 5-7 PM, 123 Main St",
    category: "general",
    caption: "Designed flyer graphic for a recurring event — same data as the Events & News example's \"Friday Adoption Meet-and-Greet\".",
    featured: true,
  },
  {
    id: "basket-raffle",
    src: basketRaffleFlyer,
    alt: "Monthly Basket Raffle flyer — first Saturday of every month, Community Hall",
    category: "general",
    caption: "Designed flyer graphic for a recurring fundraiser — same data as the Events & News example's \"Monthly Basket Raffle\".",
  },
];

const FlyerLibraryStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Flyer Library Pattern"
        canonicalPath="/standards/flyer-library"
        description="Standardized pattern for timeless, undated awareness and informational flyers."
      />
      <PageHero
        eyebrow="Standards"
        title="Flyer library pattern"
        description="Use FlyerLibrarySection for evergreen awareness flyers that have no event date and are not a news article."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "Flyer Library Pattern" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Example</h2>
          <p className="text-sm text-muted-foreground">
            Real flyer graphics, not stock photos — a flyer should read as an actual flyer, not a placeholder image.
          </p>
          <FlyerLibrarySection
            title="Flyer library"
            description="Printable flyers for recurring rescue events."
            flyers={sampleFlyers}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Use `FlyerLibrarySection` for undated, non-news awareness/informational flyers (foster recruitment, volunteer recruitment, spay/neuter awareness, safety education, recurring-event promotion, etc.).</p>
            <p>- Never combine flyer content with `EventsNewsSection`'s dated event/news data — a flyer belongs here specifically because it has no date or venue. A flyer advertising a *recurring* event (e.g. "every Friday" or "first Saturday of the month," like the two examples above) still qualifies as evergreen — it never goes stale the way a one-time, dated event flyer would.</p>
            <p>- Use a designed flyer graphic (poster-style artwork) rather than a stock/generic photo — it reads as an actual flyer rather than a placeholder image, as shown in the two examples above.</p>
            <p>- `category` is required on every `FlyerLibraryItem` so filter pills stay meaningful; an uncategorized flyer would otherwise be unreachable in a filtered view. Supported categories: `foster`, `volunteer`, `spay-neuter`, `safety`, `general`.</p>
            <p>- Core flyer images render via anchor + `img`, so browsing works without JavaScript.</p>
            <p>- Category filter pills are optional and only appear when more than one category is present in the data; the lightbox is an optional progressive enhancement, not the primary access path, and supports previous/next controls plus keyboard arrows/Escape.</p>
            <p>- Download uses a plain `&lt;a download&gt;` link to `downloadHref ?? src`, not the Printable Material Module's print layout — flyers are pre-made images, not generated documents.</p>
            <p>- `categoryFilter` locks the grid to one category and hides the pills entirely, even with mixed-category data — use it to embed a filtered teaser on another page (e.g. a foster flyer on the Foster page).</p>
            <p>- Empty-state copy is visible when no flyers are provided.</p>
            <p>- Defaults: `columns=3`, `showFilters=true`, `enableLightbox=true`.</p>
            <p>- Component: `template/src/components/patterns/FlyerLibrarySection.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default FlyerLibraryStandardPage;
