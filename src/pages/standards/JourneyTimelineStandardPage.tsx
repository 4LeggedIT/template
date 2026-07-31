import JourneyTimeline, { type JourneyTimelineStage } from "@/components/patterns/JourneyTimeline";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stages: JourneyTimelineStage[] = [
  {
    label: "Rescued",
    date: "July 17, 2026",
    description:
      "Found at an overcrowded shelter as the longest resident with no adoption applications. Named Rickey after baseball's greatest leadoff hitter, because every great game begins with one opportunity.",
    imageSrc: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
    imageAlt: "A volunteer greeting the dog on the day of rescue",
  },
  {
    label: "Clean Bill of Health",
    date: "July 22, 2026",
    description: "A wellness exam confirmed he's healthy and ready for the next step — finding his family.",
  },
  {
    label: "Today",
    description: "Settling into foster care and looking for the right forever home.",
    imageSrc: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
    imageAlt: "The dog relaxing at home today",
  },
];

const JourneyTimelineStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Journey Timeline Pattern"
        canonicalPath="/standards/journey-timeline"
        description="Vertical rescue-to-today timeline for an individual dog's own detail page."
      />
      <PageHero
        eyebrow="Standards"
        title="Journey Timeline pattern"
        description="A vertical timeline of real, dated stages (rescued, foster, today) for a single dog's own detail page — the page a success-story card's storyHref links out to."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "Journey Timeline Pattern" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Example — a dog's own detail page</h2>
          <p className="text-sm text-muted-foreground">
            This is the composition, not just the bare timeline: a per-dog page pairs a short intro (name, status
            badge, summary — usually via <code>PageHero</code>) with <code>JourneyTimeline</code> for the story so
            far, then a foster/adopt CTA. A <code>SuccessStoriesSection</code> card's <code>storyHref</code> links
            straight here.
          </p>

          <Card className="overflow-hidden">
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Badge>Looking for a Forever Home</Badge>
                <h3 className="text-2xl font-semibold tracking-tight">Rickey</h3>
                <p className="text-sm text-muted-foreground">
                  Rickey was the shelter's longest resident with no adoption applications — now healthy, safe, and
                  looking for his family.
                </p>
              </div>

              <h4 className="text-base font-semibold">Their journey so far</h4>
              <JourneyTimeline stages={stages} />

              <Card className="border-border/80 bg-card/60">
                <CardHeader>
                  <CardTitle className="text-base">Want to help write the next chapter?</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button size="sm">Apply to Foster</Button>
                  <Button size="sm" variant="outline">
                    Apply to Adopt
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              - <code>stages: JourneyTimelineStage[]</code> — plain, site-owned array. No built-in sort/filter and
              no fixed stage vocabulary; labels are free text (e.g. "Rescued", "In Foster Care", "Today").
            </p>
            <p>
              - Every field except <code>label</code>/<code>description</code> is optional — a stage without a{" "}
              <code>date</code> just omits the date line, and a stage without <code>imageSrc</code>/
              <code>videoSrc</code> renders text only. Early stages of a real story often don't have media yet.
            </p>
            <p>
              - <code>videoSrc</code> renders a native{" "}
              <code>&lt;video controls playsInline poster=&#123;imageSrc&#125;&gt;</code> instead of an image — for
              a self-hosted, real rescue-day video. Prefer this over a third-party embed: a prior fleet attempt at
              embedding Facebook video was reverted after hitting a rights-block on posts using licensed
              (non-original) audio.
            </p>
            <p>
              - Content must be real, sourced from the org's own posts/records — never invented backstory. This
              pattern exists specifically to hold a dog's actual rescue-to-today story.
            </p>
            <p>- Renders nothing if <code>stages</code> is empty — no empty-state placeholder.</p>
            <p>
              - Pairs with <code>SuccessStoriesSection</code>: that component's curated grid is the "wall," this is
              the detail page each card's <code>storyHref</code> points to — see the composed example above.
            </p>
            <p>- Component: `template/src/components/patterns/JourneyTimeline.tsx`</p>
            <p>
              - First real-site implementation: `the-comeback-pack`'s "Pack Journeys" feature
              (`/pack-journeys`, `/pack-journeys/:slug`).
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default JourneyTimelineStandardPage;
