import DogSpotlightSection, { type DogSpotlightItem } from "@/components/patterns/DogSpotlightSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const dogs: DogSpotlightItem[] = [
  {
    id: "molly",
    name: "Molly",
    rescueId: "example-rescue",
    rescueName: "Example Rescue",
    detailsUrl: "https://www.getbuddy.com/pet/example-molly",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
    breed: "German Shepherd Dog, Mixed Breed",
    gender: "Female",
    age: "1 year old",
  },
  {
    id: "dexter",
    name: "Dexter",
    rescueId: "example-rescue",
    rescueName: "Example Rescue",
    detailsUrl: "https://www.getbuddy.com/pet/example-dexter",
    image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&q=80",
    breed: "German Shepherd Dog, Mixed Breed",
    gender: "Male",
    age: "1 year old",
  },
  {
    id: "king",
    name: "King",
    rescueId: "example-rescue",
    rescueName: "Example Rescue",
    detailsUrl: "https://www.getbuddy.com/pet/example-king",
    image: "https://images.unsplash.com/photo-1568572933382-74d440642117?auto=format&fit=crop&w=800&q=80",
    breed: "Cattle Dog, Mixed Breed",
    gender: "Male",
    age: "10 months old",
  },
  {
    id: "zuko",
    name: "Zuko",
    rescueId: "example-rescue",
    rescueName: "Example Rescue",
    detailsUrl: "https://www.getbuddy.com/pet/example-zuko",
    image: "https://images.unsplash.com/photo-1553882809-a4f57e59501d?auto=format&fit=crop&w=800&q=80",
    breed: "Belgian Shepherd / Malinois",
    gender: "Male",
    age: "6 months old",
  },
];

const DogSpotlightExamplePage = () => {
  return (
    <>
      <SEOHead
        title="Dog Spotlight Module Example"
        canonicalPath="/examples/dog-spotlight"
        description="Homepage grid highlighting a hand-curated set of dogs, four across on desktop."
      />
      <PageHero
        eyebrow="Examples"
        title="Dog Spotlight module"
        description="Highlight a curated set of dogs (e.g. longest-waiting residents) in a 4-across grid, each linking out to their listing."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Examples", href: "/examples" },
          { label: "Dog Spotlight" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Four dogs</h2>
          <p className="text-sm text-muted-foreground">
            <code>dogs</code> accepts <code>LocalAdoptableManifestItem[]</code> — the same source-agnostic shape
            used by the local-manifest adoptable-pets loader, so hand-curated data and a future automated pull
            (GetBuddy, Petfinder, local manifest) share one type.
          </p>
          <DogSpotlightSection dogs={dogs} />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">No dogs</h2>
          <p className="text-sm text-muted-foreground">
            When <code>dogs</code> is empty, the component renders nothing — no empty-state placeholder.
          </p>
          <DogSpotlightSection dogs={[]} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Missing detailsUrl</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              A dog without a <code>detailsUrl</code> still renders its card (photo, name, breed, age • gender) but
              with no CTA button — there is nothing to link to yet.
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default DogSpotlightExamplePage;
