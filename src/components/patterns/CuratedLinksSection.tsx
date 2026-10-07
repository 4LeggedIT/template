import { ExternalLink } from "lucide-react";
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
  /** Where it lives, as a small badge (e.g. "Facebook"). */
  platform?: string;
};

export type CuratedLinksSectionLabels = {
  opensInNewTab?: string;
  sourcePrefix?: string;
};

type CuratedLinksSectionProps = {
  title?: string;
  description?: string;
  items: CuratedLinkItem[];
  columns?: 1 | 2;
  className?: string;
  labels?: CuratedLinksSectionLabels;
};

const DEFAULT_OPENS_IN_NEW_TAB = "(opens in a new tab)";
const DEFAULT_SOURCE_PREFIX = "From";

const externalHref = (href: string) => {
  const safe = safeContentUrl(href);
  return safe && /^https?:\/\//i.test(safe) ? safe : undefined;
};

const CuratedLinksSection = ({
  title,
  description,
  items,
  columns = 1,
  className,
  labels,
}: CuratedLinksSectionProps) => {
  const opensInNewTab = labels?.opensInNewTab ?? DEFAULT_OPENS_IN_NEW_TAB;
  const sourcePrefix = labels?.sourcePrefix ?? DEFAULT_SOURCE_PREFIX;

  const links = items.flatMap((item) => {
    const href = externalHref(item.href);
    return href ? [{ item, href }] : [];
  });

  if (!links.length) return null;

  return (
    <section className={cn("rounded-2xl border border-border bg-card/40 p-6", className)}>
      {title || description ? (
        <div className="mb-6">
          {title ? <h3 className="text-xl font-semibold tracking-tight">{title}</h3> : null}
          {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
        </div>
      ) : null}

      <ul className={cn("grid gap-4", columns === 2 && "md:grid-cols-2")}>
        {links.map(({ item, href }) => (
          <li key={item.id} className="flex">
            <Card className="w-full border-border/80 transition-shadow focus-within:shadow-md hover:shadow-md">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <CardContent className="flex h-full flex-col gap-3 p-5">
                  {item.platform ? (
                    <div className="flex w-fit items-center rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
                      {item.platform}
                    </div>
                  ) : null}
                  <h4 className="text-lg font-semibold leading-snug">{item.title}</h4>
                  {item.summary ? <p className="text-sm leading-6 text-muted-foreground">{item.summary}</p> : null}
                  <p className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-primary">
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
