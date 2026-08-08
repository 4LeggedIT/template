import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Generic homepage-highlight shape, produced by a source module's own selector
 * (`getEventsNewsHighlightItem` in `EventsNewsSection.tsx`, `getBlogHighlightItem` in
 * `BlogSection.tsx`) rather than by this component itself — `HomeHighlightSection` only
 * renders the already-selected item.
 */
export type HomeHighlightItem = {
  id: string;
  title: string;
  summary?: string;
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  badgeLabel: string;
  badgeIcon: ReactNode;
};

export type HomeHighlightSectionLabels = {
  eyebrow?: string;
  ctaLabel?: string;
};

type HomeHighlightSectionProps = {
  /** Pre-selected via a source module's `get*HighlightItem()` selector. `null` renders nothing — no empty-state card. */
  item: HomeHighlightItem | null;
  title?: string;
  description?: string;
  className?: string;
  labels?: HomeHighlightSectionLabels;
};

const HomeHighlightSection = ({ item, title, description, className, labels = {} }: HomeHighlightSectionProps) => {
  const { eyebrow = "Featured update", ctaLabel = "Read more" } = labels;

  if (!item) return null;

  return (
    <section className={cn("rounded-2xl border border-border bg-card/40 p-6", className)}>
      {title || description ? (
        <div className="mb-6">
          {title ? <h3 className="text-xl font-semibold tracking-tight">{title}</h3> : null}
          {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
        </div>
      ) : null}

      <Card className="overflow-hidden border-border/80">
        <div className={cn("grid gap-0", item.imageSrc ? "sm:grid-cols-[200px_1fr]" : undefined)}>
          {item.imageSrc ? (
            <img
              src={item.imageSrc}
              alt={item.imageAlt ?? item.title}
              className="h-40 w-full object-cover sm:h-full sm:max-h-48"
            />
          ) : null}
          <div>
            <CardHeader>
              <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
                {item.badgeIcon}
                <span>{eyebrow}</span>
                <span aria-hidden="true">&middot;</span>
                <span>{item.badgeLabel}</span>
              </div>
              <CardTitle className="text-xl">
                {item.href ? (
                  <Link to={item.href} className="hover:underline">
                    {item.title}
                  </Link>
                ) : (
                  item.title
                )}
              </CardTitle>
              {item.summary ? <CardDescription>{item.summary}</CardDescription> : null}
            </CardHeader>
            {item.href ? (
              <CardContent className="pt-0">
                <Button asChild variant="link" className="px-0">
                  <Link to={item.href} aria-label={`${ctaLabel}: ${item.title}`}>
                    {ctaLabel}
                  </Link>
                </Button>
              </CardContent>
            ) : null}
          </div>
        </div>
      </Card>
    </section>
  );
};

export default HomeHighlightSection;
