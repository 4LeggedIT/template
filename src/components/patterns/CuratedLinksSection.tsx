import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { safeContentUrl } from "@/lib/safe-url";

export type CuratedLinkItem = {
  id: string;
  title: string;
  /** Absolute http(s) URL of the original. Anything else is dropped, never rendered as a link. */
  href: string;
  /** One line written by us pointing at the original — never text copied from it. */
  summary?: string;
  /** Who made the original, shown as the credit line (e.g. "Dogs Disclosed"). */
  sourceName: string;
  /** One topic label (e.g. "Body language") that groups links under a filter pill. Plain display text; no pill row appears unless two or more distinct topics exist. */
  topic?: string;
};

export type CuratedLinksSectionLabels = {
  allLabel?: string;
  opensInNewTab?: string;
  sourcePrefix?: string;
};

type CuratedLinksSectionProps = {
  title?: string;
  description?: string;
  items: CuratedLinkItem[];
  /** Topic filter pills (like the blog's category pills). Default true; the row only renders with two or more distinct topics. */
  showFilters?: boolean;
  /** Blog-card grid: 1 column on mobile, 2 from `md`, 3 from `lg` (default 3). */
  columns?: 1 | 2 | 3;
  className?: string;
  labels?: CuratedLinksSectionLabels;
};

const DEFAULT_OPENS_IN_NEW_TAB = "(opens in a new tab)";
const DEFAULT_SOURCE_PREFIX = "From";
const DEFAULT_ALL_LABEL = "All";

const externalHref = (href: string) => {
  const safe = safeContentUrl(href);
  return safe && /^https?:\/\//i.test(safe) ? safe : undefined;
};

const CuratedLinksSection = ({
  title,
  description,
  items,
  showFilters = true,
  columns = 3,
  className,
  labels,
}: CuratedLinksSectionProps) => {
  const opensInNewTab = labels?.opensInNewTab ?? DEFAULT_OPENS_IN_NEW_TAB;
  const sourcePrefix = labels?.sourcePrefix ?? DEFAULT_SOURCE_PREFIX;

  const allLabel = labels?.allLabel ?? DEFAULT_ALL_LABEL;
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const links = useMemo(
    () =>
      items.flatMap((item) => {
        const href = externalHref(item.href);
        return href ? [{ item, href }] : [];
      }),
    [items],
  );

  const topics = useMemo(
    () =>
      [...new Set(links.map(({ item }) => item.topic).filter((value): value is string => Boolean(value)))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [links],
  );

  if (!links.length) return null;

  const showPills = showFilters && topics.length > 1;
  const visible = showPills && activeTopic ? links.filter(({ item }) => item.topic === activeTopic) : links;

  return (
    <section className={cn("rounded-2xl border border-border bg-card/40 p-6", className)}>
      {title || description ? (
        <div className="mb-6">
          {title ? <h3 className="text-xl font-semibold tracking-tight">{title}</h3> : null}
          {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
        </div>
      ) : null}

      {showPills ? (
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={activeTopic === null ? "default" : "outline"}
            aria-pressed={activeTopic === null}
            onClick={() => setActiveTopic(null)}
          >
            {allLabel}
          </Button>
          {topics.map((topic) => (
            <Button
              key={topic}
              type="button"
              size="sm"
              variant={activeTopic === topic ? "default" : "outline"}
              aria-pressed={activeTopic === topic}
              onClick={() => setActiveTopic(topic)}
            >
              {topic}
            </Button>
          ))}
        </div>
      ) : null}

      <ul
        className={cn(
          "grid grid-cols-1 gap-6",
          columns === 2 && "md:grid-cols-2",
          columns === 3 && "md:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {visible.map(({ item, href }) => (
          <li key={item.id} className="flex">
            <Card className="group flex w-full flex-col overflow-hidden border-border/80 transition-shadow focus-within:shadow-md hover:shadow-md">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <CardContent className="flex h-full flex-1 flex-col gap-3 p-6">
                  <h4 className="text-lg font-semibold leading-snug tracking-tight group-hover:underline">{item.title}</h4>
                  {item.summary ? <p className="flex-1 text-sm text-muted-foreground">{item.summary}</p> : <div className="flex-1" />}
                  <p className="inline-flex w-fit items-center gap-2 text-sm font-medium text-primary">
                    <span>
                      {sourcePrefix} {item.sourceName}
                    </span>
                    <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                    <span className="sr-only">{opensInNewTab}</span>
                  </p>
                </CardContent>
              </a>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CuratedLinksSection;
