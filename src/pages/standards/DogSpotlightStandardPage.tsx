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

const dogWithoutLink: DogSpotlightItem[] = [
  {
    ...dogs[0],
    id: "molly-no-link",
    detailsUrl: undefined,
  },
];

const DogSpotlightStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Dog Spotlight Pattern"
        canonicalPath="/standards/dog-spotlight"
        description="Homepage grid highlighting a hand-curated set of dogs, four across on desktop."
      />
      <PageHero
        eyebrow="Standards"
        title="Dog Spotlight pattern"
        description="Highlight a curated set of dogs — e.g. longest-waiting residents — in a 4-across grid, each linking out to their listing."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "Dog Spotlight Pattern" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Example</h2>
          <p className="text-sm text-muted-foreground">
            <code>dogs</code> accepts <code>LocalAdoptableManifestItem[]</code> — the same source-agnostic shape
            used by the local-manifest adoptable-pets loader, so hand-curated data and a future automated pull
            (GetBuddy, Petfinder, local manifest) share one type.
          </p>
          <DogSpotlightSection dogs={dogs} />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Without a detailsUrl</h2>
          <p className="text-sm text-muted-foreground">
            A dog without a <code>detailsUrl</code> still renders its card (photo, name, breed, age • gender) but
            with no CTA button — there is nothing to link to yet.
          </p>
          <DogSpotlightSection dogs={dogWithoutLink} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              - <code>dogs</code> is <code>LocalAdoptableManifestItem[]</code> (from <code>adoptable-local-manifest.ts</code>)
              — the same source-agnostic manifest shape used elsewhere in the ecosystem, so this data can start as a
              hand-curated array and later be swapped for an automated GetBuddy/Petfinder/local-manifest pull without
              changing the component.
            </p>
            <p>- Selection of which dogs to feature is entirely a call-site concern — pass in exactly the curated list, in the order you want it shown. There is no built-in sort/filter.</p>
            <p>- Grid is fixed at up to 4 across (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) — this component's whole purpose is the 4-card spotlight row, not a general-purpose gallery, so there is deliberately no `columns` prop.</p>
            <p>- Age • gender line is computed via `resolvePetAgeLabel()` from `lib/pet-age.ts` (never hand-rolled) using each item's `age`/`birthDate`.</p>
            <p>- The CTA button (default "Meet {'{'}Name{'}'}", via `labels.ctaPrefix`) renders only when `detailsUrl` is present — a dog without one still renders its card, just without a button. `ctaPrefix` is a plain word/phrase (e.g. "Meet", "Adopt"), never a `{'{'}{'{'}token{'}'}{'}'}`-style template string, so it's safe to pass straight through i18next's `t()` without colliding with its own interpolation syntax.</p>
            <p>- If `dogs` is empty, the component renders nothing — no empty-state placeholder.</p>
            <p>- Distinct from `AdoptablePetsSection` (the full adoptable-pets listing shell with Petfinder/Adopt-a-Pet/GetBuddy/local-manifest provider modes) — this is a small, separate curated highlight, not a listing provider.</p>
            <p>- Shared type: `LocalAdoptableManifestItem` in `adoptable-local-manifest.ts`</p>
            <p>- Component: `template/src/components/patterns/DogSpotlightSection.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default DogSpotlightStandardPage;
