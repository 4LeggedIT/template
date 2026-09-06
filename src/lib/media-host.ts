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

/** Bucket key prefix per site. Add a site here AND in media-hosting-standard.md. */
export type MediaSitePrefix =
  | "rovers"
  | "comeback"
  | "unidad51"
  | "better-together"
  | "feeding"
  | "enders-wish";

export function mediaUrl(site: MediaSitePrefix, relPath: string): string {
  return `${MEDIA_HOST}/${site}/${relPath.replace(/^\/+/, "")}`;
}
