/**
 * SHARED PATTERN: do not edit in a site repo.
 * Source: github.com/4LeggedIT/internal-tools
 *   4leggedit-websites/templates-sources/patterns/petfinder-url.ts
 * Change it there, then sync it to every site.
 */
const DEFAULT_PETFINDER_URL = "https://www.petfinder.com/";

export function normalizePetfinderBaseUrl(value?: string) {
  if (!value) return DEFAULT_PETFINDER_URL;
  try {
    const parsed = new URL(value);
    return `${parsed.origin}/`;
  } catch {
    return DEFAULT_PETFINDER_URL;
  }
}
