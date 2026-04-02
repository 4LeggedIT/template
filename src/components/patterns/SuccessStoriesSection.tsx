import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PetProfile } from "@/types/petProfile";
import { resolvePetAgeLabel } from "@/lib/pet-age";
import { cn } from "@/lib/utils";

export type SuccessStoryItem = PetProfile & {
  id: string;
  name: string;
  imageSrc: string;
  imageAlt?: string;
  petType?: string;
  ageLabel?: string;
  ageLabelOverride?: string;
  birthDate?: string;
  ageAtReferenceMonths?: number;
  ageReferenceDate?: string;
  summary?: string;
  storyTitle?: string;
  storyContext?: string;
  storyContent?: string | string[];
  storyHref?: string;
  storyCtaLabel?: string;
  badgeLabel?: string;
  adoptedDateLabel?: string;
  featured?: boolean;
};

type SuccessStoriesSectionProps = {
  title?: string;
  description?: string;
  stories: SuccessStoryItem[];
  maxItems?: number;
  showSummary?: boolean;
  showStoryContext?: boolean;
  showStoryContent?: boolean;
  showStoryCtas?: boolean;
  columns?: 2 | 3;
  contentWidth?: "full" | "contained";
  className?: string;
  emptyMessage?: string;
};

const SuccessStoriesSection = ({
  title = "Success Stories",
  description = "Reusable grid pattern for adopted pet stories and happy-tail highlights.",
  stories,
  maxItems,
  showSummary = true,
  showStoryContext = true,
  showStoryContent = true,
  showStoryCtas = true,
  columns = 3,
  contentWidth = "full",
  className,
  emptyMessage = "Success stories coming soon.",
}: SuccessStoriesSectionProps) => {
  const visibleStories = typeof maxItems === "number" ? stories.slice(0, Math.max(0, maxItems)) : stories;
  const gridColumnsClass = columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 2xl:grid-cols-3";

  return (
    <section className={cn("rounded-2xl border border-border bg-card/40 p-6", className)}>
      <div className={cn(contentWidth === "contained" ? "mx-auto w-full max-w-5xl" : undefined)}>
        <div className="mb-6">
          <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>

        {visibleStories.length ? (
          <div className={cn("grid gap-4", gridColumnsClass)}>
            {visibleStories.map((story) => (
              <Card key={story.id} className={cn("overflow-hidden border-border/80", story.featured ? "ring-1 ring-primary/35" : "")}>
                <div className="relative">
                  <AspectRatio ratio={1}>
                    <img
                      src={story.imageSrc}
                      alt={story.imageAlt ?? story.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </AspectRatio>
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
                    <Heart className="h-3 w-3 fill-current" />
                    <span>{story.badgeLabel ?? "Adopted"}</span>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{story.storyTitle ?? story.name}</CardTitle>
                  {story.petType || resolvePetAgeLabel(story) || story.breed ? (
                    <CardDescription>
                      {[story.petType, resolvePetAgeLabel(story), story.breed].filter(Boolean).join(" • ")}
                    </CardDescription>
                  ) : null}
                </CardHeader>
                {(showSummary || showStoryContext || showStoryContent || showStoryCtas || story.adoptedDateLabel) ? (
                  <CardContent className="space-y-3 pt-0">
                    {showSummary && story.summary ? (
                      <p className="text-sm text-muted-foreground">{story.summary}</p>
                    ) : null}
                    {showStoryContext && story.storyContext ? (
                      <p className="text-sm text-muted-foreground">{story.storyContext}</p>
                    ) : null}
                    {showStoryContent && story.storyContent ? (
                      Array.isArray(story.storyContent) ? (
                        <div className="space-y-2 text-sm text-muted-foreground">
                          {story.storyContent.map((paragraph, index) => (
                            <p key={`${story.id}-p-${index}`}>{paragraph}</p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">{story.storyContent}</p>
                      )
                    ) : null}
                    {story.adoptedDateLabel ? (
                      <p className="text-xs text-muted-foreground">Adopted: {story.adoptedDateLabel}</p>
                    ) : null}
                    {showStoryCtas && story.storyHref ? (
                      story.storyHref.startsWith("/") ? (
                        <Button asChild variant="outline" size="sm">
                          <Link to={story.storyHref}>{story.storyCtaLabel ?? "Read story"}</Link>
                        </Button>
                      ) : (
                        <Button asChild variant="outline" size="sm">
                          <a href={story.storyHref} target="_blank" rel="noreferrer">
                            {story.storyCtaLabel ?? "Read story"}
                          </a>
                        </Button>
                      )
                    ) : null}
                  </CardContent>
                ) : null}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-6 text-sm text-muted-foreground">
              {emptyMessage}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
