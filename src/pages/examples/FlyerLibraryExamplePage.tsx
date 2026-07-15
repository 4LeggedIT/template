import FlyerLibrarySection, { type FlyerLibraryItem } from "@/components/patterns/FlyerLibrarySection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sampleFlyers: FlyerLibraryItem[] = [
  {
    id: "fostering-saves-lives",
    src: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=900&q=80",
    alt: "Fostering saves lives — foster recruitment flyer",
    category: "foster",
    caption: "Foster recruitment flyer with no event date — always relevant.",
    featured: true,
  },
  {
    id: "volunteer-orientation",
    src: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80",
    alt: "Volunteer with us — general volunteer recruitment flyer",
    category: "volunteer",
  },
  {
    id: "spay-neuter-awareness",
    src: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80",
    alt: "Spay and neuter awareness flyer",
    category: "spay-neuter",
  },
  {
    id: "safe-greeting",
    src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80",
    alt: "How to safely greet a shelter dog — safety education flyer",
    category: "safety",
    downloadFileName: "safe-greeting-flyer.jpg",
  },
];

const FlyerLibraryExamplePage = () => {
  return (
    <>
      <SEOHead
        title="Flyer Library Example"
        canonicalPath="/examples/flyer-library"
        description="Timeless, undated awareness flyer library module example with category filtering."
      />
      <PageHero
        eyebrow="Examples"
        title="Flyer library module"
        description="Evergreen awareness flyers with no event date, browsable by category, with no-JS-safe content rendering."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Examples", href: "/examples" },
          { label: "Flyer Library" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        <FlyerLibrarySection
          title="Flyer library"
          description="Printable flyers for fostering, volunteering, spay/neuter awareness, and safety education."
          flyers={sampleFlyers}
        />

        <FlyerLibrarySection
          title="Flyer library (locked to one category)"
          description="Pass `categoryFilter` to embed a single-category teaser elsewhere, e.g. a Foster page — pills are hidden."
          flyers={sampleFlyers}
          categoryFilter="foster"
          showFilters={false}
        />

        <FlyerLibrarySection title="Flyer library (empty state)" flyers={[]} />

        <Card>
          <CardHeader>
            <CardTitle>Validation checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Flyers render without JavaScript via anchor + image markup.</p>
            <p>- Category filter pills are optional and only appear when more than one category is present.</p>
            <p>- `categoryFilter` locks the grid to one category and hides the pills entirely, even with mixed-category data.</p>
            <p>- Lightbox is optional progressive enhancement and supports previous/next controls plus keyboard arrows/Escape.</p>
            <p>- The lightbox download control is a plain `&lt;a download&gt;` link to `downloadHref ?? src`, never a print-layout wrapper.</p>
            <p>- Empty-state copy is visible when no flyers are provided.</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default FlyerLibraryExamplePage;
