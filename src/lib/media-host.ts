/**
 * Fleet media host (TPL-042). Every self-hosted video is served from ONE
 * Cloudflare R2 bucket behind https://media.4leggedit.com, keyed by a
 * per-site prefix. Video never lives in this repo (not under public/, not
 * under src/assets/) -- the link checker's media pass fails the build on
 * either form. See docs/standards/media-hosting-standard.md.
 *
 * Call with string literals only:
 *
 *   src: mediaUrl("rovers", "field-rescue-billy-bundy-2026-09-05.mp4")
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
 * authoritative site → prefix table lives in the internal-only
 * `docs/standards/media-hosting-standard.md`; add a site there when
 * onboarding it. Typos are still caught functionally by the link checker's
 * HEAD check against the real bucket, not by the type system.
 */
export type MediaSitePrefix = string;

export function mediaUrl(site: MediaSitePrefix, relPath: string): string {
  return `${MEDIA_HOST}/${site}/${relPath.replace(/^\/+/, "")}`;
}
