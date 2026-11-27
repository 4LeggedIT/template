/**
 * SHARED PATTERN: do not edit in a site repo.
 * Source: github.com/4LeggedIT/internal-tools
 *   4leggedit-websites/templates-sources/lib/event-banner-window.ts
 * Change it there, then sync it to every site.
 */
/**
 * Home-banner visibility window.
 *
 * An event belongs in the home banner until it ENDS, not until it STARTS. Filtering on the start
 * time (`startAtIso >= now`) made a multi-day event vanish the moment it began. `EventBanner` already
 * hides an item by its own end/expiry; this helper is the data-layer half, so a site's banner
 * builder never re-implements the filter.
 *
 * Usage (site data file):
 *   getActiveBannerEvents(events).map((entry) => ({ id, title, startsAtIso, endsAtIso, recurrence, ... }))
 *
 * Rules:
 * - End = `endAtIso`, else the end of the `endAt` (or `startAt`) day. An entry with only a start
 *   time and no end keeps `EventBanner`'s own fallback: it stays up for 24 hours after it starts.
 * - Recurring entries are always kept: the seed's dates are frozen in the past, and `EventBanner`
 *   computes the next occurrence itself (it needs `recurrence` passed through on the item).
 * - Result is sorted by start time, soonest first.
 */
export type BannerWindowEntry = {
  startAt: string;
  endAt?: string;
  startAtIso?: string;
  endAtIso?: string;
  recurrence?: unknown;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const toMs = (value?: string) => {
  if (!value) return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
};

/** Millisecond timestamp after which the entry no longer belongs in the banner. */
export const getBannerEndMs = (entry: BannerWindowEntry): number | null => {
  const explicitEnd = toMs(entry.endAtIso);
  if (explicitEnd !== null) return explicitEnd;
  // Date-only end: the whole day counts, so an all-day or date-range event stays up through it.
  if (entry.endAt || !entry.startAtIso) return toMs(`${entry.endAt ?? entry.startAt}T23:59:59`);
  const start = toMs(entry.startAtIso);
  return start === null ? null : start + DAY_MS;
};

export const isBannerEventActive = (entry: BannerWindowEntry, nowMs: number = Date.now()): boolean => {
  if (entry.recurrence) return true;
  const endMs = getBannerEndMs(entry);
  return endMs === null ? true : endMs >= nowMs;
};

const getStartMs = (entry: BannerWindowEntry) => toMs(entry.startAtIso ?? entry.startAt) ?? 0;

export const getActiveBannerEvents = <T extends BannerWindowEntry>(entries: readonly T[], nowMs: number = Date.now()): T[] =>
  entries.filter((entry) => isBannerEventActive(entry, nowMs)).sort((a, b) => getStartMs(a) - getStartMs(b));
