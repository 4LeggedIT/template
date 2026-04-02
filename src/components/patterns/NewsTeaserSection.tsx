import { CalendarDays, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export type NewsTeaserEntry = {
  id: string;
  title: string;
  href: string;
  summary?: string;
  type?: "event" | "news";
  dateLabel?: string;
  locationLabel?: string;
  ctaLabel?: string;
};

type NewsTeaserSectionProps = {
  title?: string;
  description?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  entries: NewsTeaserEntry[];
};

const NewsTeaserSection = ({
  title = "Events & News",
  description = "Upcoming events and recent updates.",
  viewAllHref,
  viewAllLabel = "View all",
  entries,
}: NewsTeaserSectionProps) => {
  const [featured, ...rest] = entries;

  return (
    <section className="rounded-2xl border border-border bg-card/40 p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
        {viewAllHref ? (
          <Button asChild variant="outline" size="sm">
            <Link to={viewAllHref}>{viewAllLabel}</Link>
          </Button>
        ) : null}
      </div>

      {featured ? (
        <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
          <Card className="border-border/80">
            <CardHeader>
              <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
                {featured.type === "news" ? (
                  <Newspaper className="h-3.5 w-3.5" />
                ) : (
                  <CalendarDays className="h-3.5 w-3.5" />
                )}
                <span>{featured.type === "news" ? "News" : "Event"}</span>
              </div>
              <CardTitle className="text-lg">
                <Link to={featured.href} className="hover:underline">
                  {featured.title}
                </Link>
              </CardTitle>
              {(featured.dateLabel || featured.locationLabel) ? (
                <CardDescription>
                  {[featured.dateLabel, featured.locationLabel].filter(Boolean).join(" • ")}
                </CardDescription>
              ) : null}
            </CardHeader>
            {featured.summary ? (
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">{featured.summary}</p>
                <Button asChild variant="link" className="mt-3 px-0">
                  <Link to={featured.href}>{featured.ctaLabel ?? "Read details"}</Link>
                </Button>
              </CardContent>
            ) : null}
          </Card>

          <div className="space-y-3">
            {rest.slice(0, 3).map((entry) => (
              <Card key={entry.id} className="border-border/80">
                <CardContent className="flex items-start justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {entry.type === "news" ? "News" : "Event"}
                    </p>
                    <Link to={entry.href} className="line-clamp-2 text-sm font-medium hover:underline">
                      {entry.title}
                    </Link>
                    {(entry.dateLabel || entry.locationLabel) ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {[entry.dateLabel, entry.locationLabel].filter(Boolean).join(" • ")}
                      </p>
                    ) : null}
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link to={entry.href}>{entry.ctaLabel ?? "Open"}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-6 text-sm text-muted-foreground">
            No events or news entries yet.
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default NewsTeaserSection;
