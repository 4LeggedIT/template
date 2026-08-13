import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const MAX_HOME_HIGHLIGHT_ITEMS = 3;

/**
 * Generic homepage-highlight shape, produced by a source module's own selector
 * (`getEventsNewsHighlightItems` in `EventsNewsSection.tsx`, `getBlogHighlightItems` in
 * `BlogSection.tsx`) rather than by this component itself — `HomeHighlightSection` only
 * renders the already-selected items. `sortMs` lets a page merge items from more than one
 * source module (e.g. events/news + blog) and re-sort the combined list newest-first before
 * slicing to `MAX_HOME_HIGHLIGHT_ITEMS`.
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
  sortMs: number;
};

export type HomeHighlightSectionLabels = {
  eyebrow?: string;
  ctaLabel?: string;
};

type HomeHighlightSectionProps = {
  /**
   * Pre-selected via one or more source modules' `get*HighlightItems()` selectors — merge and
   * sort by `sortMs` (descending) before passing in if combining more than one source. An empty
   * array renders nothing (no empty-state card). Only the first `MAX_HOME_HIGHLIGHT_ITEMS` (3)
   * are rendered; pass an already-capped list if you need fewer.
   */
  items: HomeHighlightItem[];
  title?: string;
  description?: string;
  className?: string;
  labels?: HomeHighlightSectionLabels;
};

const FeaturedHighlightCard = ({
  item,
  eyebrow,
  ctaLabel,
}: {
  item: HomeHighlightItem;
  eyebrow: string;
  ctaLabel: string;
}) => (
  <Card className="overflow-hidden border-border/80">
    <div className={cn("grid gap-0", item.imageSrc ? "sm:grid-cols-[200px_1fr]" : undefined)}>
      {item.imageSrc ? (
        <img
          src={item.imageSrc}
          alt={item.imageAlt ?? item.title}
          className="h-40 w-full bg-muted object-contain sm:h-full sm:max-h-48"
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
);

const CompactHighlightCard = ({
  item,
  eyebrow,
  ctaLabel,
}: {
  item: HomeHighlightItem;
  eyebrow: string;
  ctaLabel: string;
}) => (
  <Card className="flex h-full flex-col overflow-hidden border-border/80">
    {item.imageSrc ? (
      <img
        src={item.imageSrc}
        alt={item.imageAlt ?? item.title}
        className="h-36 w-full bg-muted object-contain"
      />
    ) : null}
    <CardHeader className="flex-1">
      <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
        {item.badgeIcon}
        <span>{eyebrow}</span>
        <span aria-hidden="true">&middot;</span>
        <span>{item.badgeLabel}</span>
      </div>
      <CardTitle className="text-base">
        {item.href ? (
          <Link to={item.href} className="hover:underline">
            {item.title}
          </Link>
        ) : (
          item.title
        )}
      </CardTitle>
      {item.summary ? <CardDescription className="line-clamp-3">{item.summary}</CardDescription> : null}
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
  </Card>
);

const HomeHighlightSection = ({ items, title, description, className, labels = {} }: HomeHighlightSectionProps) => {
  const { eyebrow = "Featured update", ctaLabel = "Read more" } = labels;
  const visibleItems = items.slice(0, MAX_HOME_HIGHLIGHT_ITEMS);

  if (visibleItems.length === 0) return null;

  return (
    <section className={cn("rounded-2xl border border-border bg-card/40 p-6", className)}>
      {title || description ? (
        <div className="mb-6">
          {title ? <h3 className="text-xl font-semibold tracking-tight">{title}</h3> : null}
          {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
        </div>
      ) : null}

      {visibleItems.length === 1 ? (
        <FeaturedHighlightCard item={visibleItems[0]} eyebrow={eyebrow} ctaLabel={ctaLabel} />
      ) : (
        <div className={cn("grid gap-4 sm:grid-cols-2", visibleItems.length >= 3 ? "lg:grid-cols-3" : undefined)}>
          {visibleItems.map((item) => (
            <CompactHighlightCard key={item.id} item={item} eyebrow={eyebrow} ctaLabel={ctaLabel} />
          ))}
        </div>
      )}
    </section>
  );
};

export default HomeHighlightSection;
