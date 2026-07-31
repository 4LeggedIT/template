import { CalendarDays, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { byNewestFirst, type EventsNewsEntry } from "@/components/patterns/EventsNewsSection";
import { cn } from "@/lib/utils";

export type NewsHighlightSectionLabels = {
  eyebrow?: string;
  eventBadge?: string;
  newsBadge?: string;
  ctaLabel?: string;
};

type NewsHighlightSectionProps = {
  entries: EventsNewsEntry[];
  title?: string;
  description?: string;
  className?: string;
  labels?: NewsHighlightSectionLabels;
};

const NewsHighlightSection = ({
  entries,
  title,
  description,
  className,
  labels = {},
}: NewsHighlightSectionProps) => {
  const {
    eyebrow = "Featured update",
    eventBadge = "Event",
    newsBadge = "News",
    ctaLabel = "Read more",
  } = labels;

  const entry = entries.filter((candidate) => candidate.highlightOnHome).sort(byNewestFirst)[0];

  if (!entry) return null;

  return (
    <section className={cn("rounded-2xl border border-border bg-card/40 p-6", className)}>
      {title || description ? (
        <div className="mb-6">
          {title ? <h3 className="text-xl font-semibold tracking-tight">{title}</h3> : null}
          {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
        </div>
      ) : null}

      <Card className="overflow-hidden border-border/80">
        <div className={cn("grid gap-0", entry.imageSrc ? "sm:grid-cols-[200px_1fr]" : undefined)}>
          {entry.imageSrc ? (
            <img
              src={entry.imageSrc}
              alt={entry.imageAlt ?? entry.title}
              className="h-40 w-full object-cover sm:h-full sm:max-h-48"
            />
          ) : null}
          <div>
            <CardHeader>
              <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
                {entry.kind === "news" ? (
                  <Newspaper className="h-3.5 w-3.5" />
                ) : (
                  <CalendarDays className="h-3.5 w-3.5" />
                )}
                <span>{eyebrow}</span>
                <span aria-hidden="true">&middot;</span>
                <span>{entry.kind === "news" ? newsBadge : eventBadge}</span>
              </div>
              <CardTitle className="text-xl">
                {entry.href ? (
                  <Link to={entry.href} className="hover:underline">
                    {entry.title}
                  </Link>
                ) : (
                  entry.title
                )}
              </CardTitle>
              {entry.summary ? <CardDescription>{entry.summary}</CardDescription> : null}
            </CardHeader>
            {entry.href ? (
              <CardContent className="pt-0">
                <Button asChild variant="link" className="px-0">
                  <Link to={entry.href}>{ctaLabel}</Link>
                </Button>
              </CardContent>
            ) : null}
          </div>
        </div>
      </Card>
    </section>
  );
};

export default NewsHighlightSection;
