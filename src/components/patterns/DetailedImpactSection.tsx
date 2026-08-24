import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ImpactStat } from "./ImpactStatsSection";

/**
 * Recommended starting taxonomy, kept open for a site to add categories as its program grows
 * (mirrors `SpendCategoryId`'s `(string & {})` escape hatch exactly) — a site is never limited to
 * these 5, and `id`/`label` stay freeform per-site the same way `SpendCategory.label` does.
 */
export type ImpactCategoryId =
  | "animals-helped"
  | "feeding-supplies"
  | "veterinary-assistance"
  | "rescue-partnerships"
  | "volunteers-community"
  | (string & {});

export type ImpactCategory = {
  id: ImpactCategoryId;
  label: string;
  icon?: LucideIcon;
  description?: string;
};

export type ImpactContribution = {
  categoryId: ImpactCategoryId;
  /**
   * Optional richer detail for this one entry — e.g. `40` "lbs" of food, `2` "animals" treated.
   * Deliberately never summed across entries: two entries touching the same category may measure
   * it completely differently (a bag of food dropped off vs. treats handed out vs. a scale
   * weight), so there's no safe fleet-wide unit to add them in. Every category's lifetime count
   * and running total are always "how many logged entries touched this category," not a sum of
   * these amounts — `amount`/`unit` are shown on the entry's own card as extra context only, never
   * rolled up. Omit both when there's nothing meaningful to quantify (e.g. "gave out treats").
   */
  amount?: number;
  unit?: string;
  /** Why THIS category was touched by this entry. Falls back to the entry's own `summary` when
   * omitted — a single-category entry rarely needs a separate note. */
  note?: string;
};

export type DetailedImpactEntry = {
  id: string;
  title: string;
  /** YYYY-MM-DD — the day the write-up covers, or the first day of a multi-day event. Sort key. */
  date: string;
  /** YYYY-MM-DD — set only when real-world work spanned more than one day. */
  endDate?: string;
  /** Short "why"/narrative blurb — not the full write-up (that lives at relatedHref). */
  summary: string;
  contributions: ImpactContribution[];
  /** Link out to the full /blog/:slug or /news/:slug write-up. Internal (Link) or external (new tab). */
  relatedHref?: string;
  imageSrc?: string;
  imageAlt?: string;
  /**
   * Internal record of where this entry's content originated — a Facebook/Instagram post URL, etc.
   * Editorial reference only, never rendered on the page. Pass an array when one entry draws on
   * more than one original source post. Mirrors `BlogPostEntry.source` / `EventsNewsEntry.source`
   * exactly.
   */
  source?: string | string[];
  /** Reserved for future HomeHighlightSection reuse — mirrors the fleet's "no auto-pin" convention. Not required for the timeline/category pages themselves. */
  highlightOnHome?: boolean;
};

export type DetailedImpactSectionLabels = {
  emptyMessage?: string;
  readMoreLabel?: string;
  runningTotalLabel?: string;
};

type DetailedImpactSectionProps = {
  title?: string;
  description?: string;
  /** Pre-filtered by the page (e.g. via getEntriesForCategory) — this component sorts internally, newest first. */
  entries: DetailedImpactEntry[];
  /** Full category config, for badge label/icon/href lookups on each entry card. */
  categories: ImpactCategory[];
  /** When set, renders a running-total card above the list counting how many entries touch this
   * category, and prefers each contribution's own `note` over the entry's general `summary` —
   * i.e. "category detail page" mode. Omit for the combined timeline. */
  totalForCategoryId?: string;
  maxEntries?: number;
  /** Contribution badges link to `${categoryBasePath}/${categoryId}` when set; render unlinked otherwise. */
  categoryBasePath?: string;
  className?: string;
  labels?: DetailedImpactSectionLabels;
  /** BCP 47 tag (e.g. "es-US") for date formatting — mirrors EventBanner's `locale` prop exactly. */
  locale?: string;
};

const isExternalContentHref = (href: string) => !href.startsWith("/");

const DEFAULT_LOCALE = "en-US";

export const byNewestFirst = (a: DetailedImpactEntry, b: DetailedImpactEntry) =>
  a.date < b.date ? 1 : a.date > b.date ? -1 : 0;

/** "August 21, 2026" for a single day, or "August 10 – 14, 2026" for a multi-day entry. */
export const formatDetailedImpactDateLabel = (entry: DetailedImpactEntry, locale: string = DEFAULT_LOCALE) => {
  const dateFormatter = new Intl.DateTimeFormat(locale, { month: "long", day: "numeric", year: "numeric" });
  const dateFormatterNoYear = new Intl.DateTimeFormat(locale, { month: "long", day: "numeric" });
  const start = new Date(`${entry.date}T00:00:00`);
  if (!entry.endDate || entry.endDate === entry.date) return dateFormatter.format(start);
  const end = new Date(`${entry.endDate}T00:00:00`);
  const startLabel = start.getFullYear() === end.getFullYear() ? dateFormatterNoYear.format(start) : dateFormatter.format(start);
  return `${startLabel} – ${dateFormatter.format(end)}`;
};

/** Newest-first, only entries with a contribution matching categoryId. */
export const getEntriesForCategory = (entries: DetailedImpactEntry[], categoryId: string) =>
  entries.filter((entry) => entry.contributions.some((c) => c.categoryId === categoryId)).sort(byNewestFirst);

/**
 * How many logged entries touched a category — the fleet-wide counting rule (see
 * `ImpactContribution.amount`'s doc comment for why this counts entries rather than summing
 * amounts: entries touching the same category may measure it in completely incomparable ways).
 */
export const countCategoryEntries = (entries: DetailedImpactEntry[], categoryId: string) =>
  getEntriesForCategory(entries, categoryId).length;

/**
 * Produces ImpactStatsSection-ready tiles counting how many entries touched each category. Per
 * the fleet's "never show a fabricated placeholder number" rule, a category with zero entries is
 * OMITTED entirely, not rendered as a "0" tile.
 */
export const getImpactLifetimeStats = (
  entries: DetailedImpactEntry[],
  categories: ImpactCategory[],
  categoryBasePath = "/impact",
): ImpactStat[] =>
  categories
    .map((category) => ({ category, count: countCategoryEntries(entries, category.id) }))
    .filter(({ count }) => count > 0)
    .map(({ category, count }) => ({
      id: category.id,
      value: count.toLocaleString(),
      label: category.label,
      icon: category.icon,
      href: `${categoryBasePath}/${category.id}`,
    }));

const ContributionBadge = ({
  contribution,
  categories,
  categoryBasePath,
}: {
  contribution: ImpactContribution;
  categories: ImpactCategory[];
  categoryBasePath?: string;
}) => {
  const category = categories.find((option) => option.id === contribution.categoryId);
  const Icon = category?.icon;
  const label = category?.label ?? contribution.categoryId;
  const amountLabel =
    typeof contribution.amount === "number"
      ? `+${contribution.amount.toLocaleString()}${contribution.unit ? ` ${contribution.unit}` : ""}`
      : undefined;

  const content = (
    <>
      {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
      <span>{label}</span>
      {amountLabel ? <span className="text-primary/70">{amountLabel}</span> : null}
    </>
  );

  const className =
    "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary";

  return categoryBasePath ? (
    <Link key={contribution.categoryId} to={`${categoryBasePath}/${contribution.categoryId}`} className={cn(className, "hover:bg-primary/20")}>
      {content}
    </Link>
  ) : (
    <span key={contribution.categoryId} className={className}>
      {content}
    </span>
  );
};

/**
 * Renders both the combined chronological log (totalForCategoryId omitted) and a single
 * category's filtered view (totalForCategoryId set) — the page pre-filters `entries` and decides
 * which mode to use; this component stays a dumb renderer, matching how BlogSection/
 * EventsNewsSection keep filtering logic at the page level.
 */
const DetailedImpactSection = ({
  title,
  description,
  entries,
  categories,
  totalForCategoryId,
  maxEntries,
  categoryBasePath,
  className,
  labels = {},
  locale = DEFAULT_LOCALE,
}: DetailedImpactSectionProps) => {
  const {
    emptyMessage = "No updates shared yet.",
    readMoreLabel = "Read the full story",
    runningTotalLabel = "Updates Shared So Far",
  } = labels;

  const sorted = [...entries].sort(byNewestFirst);
  const visible = typeof maxEntries === "number" ? sorted.slice(0, maxEntries) : sorted;
  const runningTotal = totalForCategoryId ? countCategoryEntries(entries, totalForCategoryId) : null;
  const runningTotalCategory = totalForCategoryId ? categories.find((c) => c.id === totalForCategoryId) : undefined;

  return (
    <section className={cn("space-y-8", className)}>
      {title || description ? (
        <div className="space-y-2 text-center">
          {title ? <h2 className="text-3xl font-bold tracking-tight">{title}</h2> : null}
          {description ? <p className="mx-auto max-w-2xl text-muted-foreground">{description}</p> : null}
        </div>
      ) : null}

      {runningTotal !== null ? (
        <div className="mx-auto max-w-xs text-center">
          <span className="text-sm text-muted-foreground">{runningTotalLabel}</span>
          <p className="text-4xl font-bold tabular-nums">
            <span>{runningTotal.toLocaleString()}</span>
            {runningTotalCategory?.label ? (
              <span className="ml-2 text-base font-medium text-muted-foreground">{runningTotalCategory.label}</span>
            ) : null}
          </p>
        </div>
      ) : null}

      {visible.length ? (
        <ol className="space-y-6">
          {visible.map((entry) => {
            const activeContribution = totalForCategoryId
              ? entry.contributions.find((c) => c.categoryId === totalForCategoryId)
              : undefined;
            const bodyText = activeContribution?.note ?? entry.summary;
            const external = entry.relatedHref ? isExternalContentHref(entry.relatedHref) : false;

            return (
              <li key={entry.id}>
                <Card className="overflow-hidden border-border/80">
                  <div className={cn("grid gap-0", entry.imageSrc ? "sm:grid-cols-[220px_1fr]" : undefined)}>
                    {entry.imageSrc ? (
                      <div className="h-40 overflow-hidden sm:h-full">
                        <img
                          src={entry.imageSrc}
                          alt={entry.imageAlt ?? entry.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : null}
                    <CardContent className="flex flex-col gap-3 p-6">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        {formatDetailedImpactDateLabel(entry, locale)}
                      </span>
                      <h3 className="text-xl font-semibold tracking-tight">{entry.title}</h3>
                      <p className="text-sm text-muted-foreground">{bodyText}</p>
                      <div className="flex flex-wrap gap-2">
                        {entry.contributions.map((contribution) => (
                          <ContributionBadge
                            key={contribution.categoryId}
                            contribution={contribution}
                            categories={categories}
                            categoryBasePath={categoryBasePath}
                          />
                        ))}
                      </div>
                      {entry.relatedHref ? (
                        <Button asChild variant="link" className="w-fit px-0">
                          {external ? (
                            <a href={entry.relatedHref} target="_blank" rel="noopener noreferrer" className="gap-2">
                              {readMoreLabel}
                              <ArrowRight className="h-4 w-4" />
                            </a>
                          ) : (
                            <Link to={entry.relatedHref} className="gap-2">
                              {readMoreLabel}
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          )}
                        </Button>
                      ) : null}
                    </CardContent>
                  </div>
                </Card>
              </li>
            );
          })}
        </ol>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-6 text-center text-sm text-muted-foreground">{emptyMessage}</CardContent>
        </Card>
      )}
    </section>
  );
};

export default DetailedImpactSection;
