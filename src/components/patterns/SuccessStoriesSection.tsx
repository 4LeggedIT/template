/**
 * SHARED PATTERN: do not edit in a site repo.
 * Source: github.com/4LeggedIT/internal-tools
 *   4leggedit-websites/templates-sources/patterns/SuccessStoriesSection.tsx
 * Change it there, then sync it to every site.
 */
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PetProfile } from "@/types/petProfile";
import { resolvePetAgeLabel } from "@/lib/pet-age";
import { cn } from "@/lib/utils";
import ContentLink from "./ContentLink";

export type SuccessStoryItem = PetProfile & {
  id: string;
  name: string;
  imageSrc: string;
  imageAlt?: string;
  /** Fine-tune framing for `fit="cover"` (the section-level default) — e.g. "50% 0%" to favor
   * the top of a portrait/off-center photo instead of the center-cropped default. Ignored in
   * `fit="contain"` mode, where the full image is always shown uncropped. */
  imageObjectPosition?: string;
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
  /** Optional extra CTA button(s) rendered before the "read story" link — e.g. a badge-driven
   * "Apply to Adopt"/"Apply to Foster" so an index card can offer the actual next step, not just
   * a link through to the detail page. Piloted on a live rescue-journeys index page. */
  ctaLinks?: { label: string; href: string; external?: boolean }[];
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
  /** "cover" (default) center-crops every photo into a square — fine for evenly-framed
   * portraits, but clips off-center subjects (e.g. a candid photo, a video still). "contain"
   * shows the full image uncropped, letterboxed as needed. See MediaGallerySection's identical
   * `fit` prop for precedent. */
  fit?: "cover" | "contain";
  className?: string;
  emptyMessage?: string;
  labels?: {
    adoptedLabel?: string;
    readStoryLabel?: string;
    adoptedPrefix?: string;
  };
};

const SuccessStoriesSection = ({
  title,
  description,
  stories,
  maxItems,
  showSummary = true,
  showStoryContext = true,
  showStoryContent = true,
  showStoryCtas = true,
  columns = 3,
  contentWidth = "full",
  fit = "cover",
  className,
  emptyMessage = "Success stories coming soon.",
  labels = {},
}: SuccessStoriesSectionProps) => {
  const {
    adoptedLabel = "Adopted",
    readStoryLabel = "Read story",
    adoptedPrefix = "Adopted:",
  } = labels;
  const visibleStories = typeof maxItems === "number" ? stories.slice(0, Math.max(0, maxItems)) : stories;
  const effectiveColumns = Math.min(columns, visibleStories.length);
  const gridColumnsClass = effectiveColumns <= 1 ? "" : effectiveColumns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 2xl:grid-cols-3";

  return (
    <section className={cn("rounded-2xl border border-border bg-card/40 p-6", className)}>
      <div className={cn(contentWidth === "contained" ? "mx-auto w-full max-w-5xl" : undefined)}>
        {title || description ? (
          <div className="mb-6">
            {title ? <h3 className="text-xl font-semibold tracking-tight">{title}</h3> : null}
            {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
          </div>
        ) : null}

        {visibleStories.length ? (
          <div className={cn("grid gap-4", gridColumnsClass)}>
            {visibleStories.map((story) => (
              <Card
                key={story.id}
                className={cn(
                  "flex h-full flex-col overflow-hidden border-border/80",
                  story.featured ? "ring-1 ring-primary/35" : "",
                )}
              >
                <div className="relative">
                  {(() => {
                    const image =
                      fit === "contain" ? (
                        <div className="flex aspect-square items-center justify-center overflow-hidden bg-muted">
                          <img
                            src={story.imageSrc}
                            alt={story.imageAlt ?? story.name}
                            className="h-full w-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <AspectRatio ratio={1}>
                          <img
                            src={story.imageSrc}
                            alt={story.imageAlt ?? story.name}
                            className="h-full w-full object-cover"
                            style={{ objectPosition: story.imageObjectPosition ?? "50% 50%" }}
                            loading="lazy"
                          />
                        </AspectRatio>
                      );
                    return story.storyHref ? (
                      <ContentLink
                        href={story.storyHref}
                        whenUnsafe="children"
                        aria-label={story.storyCtaLabel ?? readStoryLabel}
                      >
                        {image}
                      </ContentLink>
                    ) : (
                      image
                    );
                  })()}
                  <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
                    <Heart className="h-3 w-3 fill-current" />
                    <span>{story.badgeLabel ?? adoptedLabel}</span>
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
                  <CardContent className="flex flex-1 flex-col pt-0">
                    <div className="space-y-3">
                      {showSummary && story.summary ? (
                        <p className="text-sm text-muted-foreground">{story.summary}</p>
                      ) : null}
                      {showStoryContext && story.storyContext ? (
                        <p className="text-sm text-muted-foreground">{story.storyContext}</p>
                      ) : null}
                      {showStoryContent && story.storyContent ? (
                        Array.isArray(story.storyContent) ? (
                          <div className="space-y-2 break-words text-sm text-muted-foreground">
                            {story.storyContent.map((paragraph, index) => (
                              <p key={`${story.id}-p-${index}`}>{paragraph}</p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">{story.storyContent}</p>
                        )
                      ) : null}
                      {story.adoptedDateLabel ? (
                        <p className="text-xs text-muted-foreground">{adoptedPrefix} {story.adoptedDateLabel}</p>
                      ) : null}
                    </div>
                    {showStoryCtas && (story.ctaLinks?.length || story.storyHref) ? (
                      <div className="mt-auto flex flex-wrap gap-2 pt-3">
                        {story.ctaLinks?.map((cta) =>
                          <Button key={cta.href} asChild size="sm">
                            <ContentLink href={cta.href} external={Boolean(cta.external)}>
                              {cta.label}
                            </ContentLink>
                          </Button>,
                        )}
                        {story.storyHref ? (
                          <Button asChild variant="outline" size="sm">
                            <ContentLink href={story.storyHref}>{story.storyCtaLabel ?? readStoryLabel}</ContentLink>
                          </Button>
                        ) : null}
                      </div>
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
