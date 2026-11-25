/**
 * SHARED PATTERN: do not edit in a site repo.
 * Source: github.com/4LeggedIT/internal-tools
 *   4leggedit-websites/templates-sources/patterns/DetailedImpactSection.helpers.ts
 * Change it there, then sync it to every site.
 *
 * Non-component helpers for DetailedImpactSection.tsx, kept in their own module so that file exports only
 * components (react-refresh/only-export-components).
 */
import type { ImpactStat } from "./ImpactStatsSection";
import type { ImpactCategory, DetailedImpactEntry } from "./DetailedImpactSection";

export const DEFAULT_LOCALE = "en-US";

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
