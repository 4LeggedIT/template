/**
 * SHARED PATTERN: do not edit in a site repo.
 * Source: github.com/4LeggedIT/internal-tools
 *   4leggedit-websites/templates-sources/lib/media-host.ts
 * Change it there, then sync it to every site.
 */
/**
 * Fleet media host. Every self-hosted video is served from ONE
 * Cloudflare R2 bucket behind https://media.4leggedit.com, keyed by a
 * per-site prefix. Video never lives in this repo (not under public/, not
 * under src/assets/) -- the link checker's media pass fails the build on
 * either form.
 *
 * Call with string literals only:
 *
 *   src: mediaUrl("site-prefix", "example-video.mp4")
 *
 * The link checker resolves these calls by text scan (no evaluation), so a
 * computed argument would silently escape the "does this object exist?"
 * HEAD check that runs on every `npm run links:check`.
 */
export const MEDIA_HOST = "https://media.4leggedit.com";

/**
 * Bucket key prefix for the calling site. Deliberately plain `string`, not a
 * closed union of every fleet site's real prefix — this file is synced
 * verbatim to every site (patterns/lib travel unchanged), so a shared file is
 * the wrong place to enumerate which real organizations use it. The
 * authoritative site → prefix table is kept outside this file. Typos are still caught functionally by the link checker's
 * HEAD check against the real bucket, not by the type system.
 */
export type MediaSitePrefix = string;

export function mediaUrl(site: MediaSitePrefix, relPath: string): string {
  return `${MEDIA_HOST}/${site}/${relPath.replace(/^\/+/, "")}`;
}
