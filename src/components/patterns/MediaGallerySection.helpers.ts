/**
 * SHARED PATTERN: do not edit in a site repo.
 * Source: github.com/4LeggedIT/internal-tools
 *   4leggedit-websites/templates-sources/patterns/MediaGallerySection.helpers.ts
 * Change it there, then sync it to every site.
 *
 * Non-component helpers for MediaGallerySection.tsx, kept in their own module so that file exports only
 * components (react-refresh/only-export-components).
 */


export const DEFAULT_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Parses "MM/YY" or "YY". Throws on anything else so a typo fails the build instead of silently mis-sorting. */
export const parseGalleryDate = (value: string): { year: number; month: number | null } => {
  const match = /^(?:(0[1-9]|1[0-2])\/)?(\d{2})$/.exec(value);
  if (!match) throw new Error(`MediaGallerySection: invalid date "${value}" (expected "MM/YY" or "YY")`);
  return { year: 2000 + Number(match[2]), month: match[1] ? Number(match[1]) : null };
};

/** Sort key: year-only = month 0, so it ranks after every dated month of its year. */
export const galleryDateKey = (value: string | undefined) => {
  if (!value) return null;
  const { year, month } = parseGalleryDate(value);
  return year * 13 + (month ?? 0);
};

export const formatGalleryDate = (value: string, months: string[] = DEFAULT_MONTHS) => {
  const { year, month } = parseGalleryDate(value);
  return month ? `${months[month - 1]} ${year}` : String(year);
};
