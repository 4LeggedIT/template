const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);
const PLACEHOLDER_ORIGIN = "https://placeholder.invalid";

/**
 * Validates a content-authored URL (blog/news markdown links, partner
 * records, pet photo links, etc.) before it reaches an href. Content data
 * is edited by non-technical volunteers via GitHub and should never be
 * able to produce a `javascript:` (or other executable-scheme) link, or a
 * value that looks like a same-site relative path but actually navigates
 * off-site (WHATWG URL parsing normalizes backslashes to slashes and
 * strips tab/newline/CR, so a raw prefix check like `startsWith("/")` can
 * be fooled into trusting something that resolves to another origin).
 *
 * Returns the original string if safe, or undefined if it should not be
 * rendered as a link at all.
 */
export function safeContentUrl(href: string | undefined | null): string | undefined {
  if (!href) return undefined;
  const trimmed = href.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("#")) return trimmed;
  if (/[\\\t\n\r]/.test(trimmed)) return undefined;

  try {
    const asAbsolute = new URL(trimmed);
    return ALLOWED_PROTOCOLS.has(asAbsolute.protocol) ? trimmed : undefined;
  } catch {
    // Not an absolute URL on its own; fall through to relative-path handling.
  }

  try {
    const resolved = new URL(trimmed, PLACEHOLDER_ORIGIN);
    return resolved.origin === PLACEHOLDER_ORIGIN ? trimmed : undefined;
  } catch {
    return undefined;
  }
}

/**
 * True when a (safe) href is a same-site path. `//host` is protocol-relative
 * and navigates off-site, so a bare `startsWith("/")` check is not enough.
 */
export function isInternalPath(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

const SAFE_DATA_IMAGE = /^data:image\/(png|jpe?g|gif|webp|avif);base64,[a-z0-9+/=]+$/i;

/**
 * Like safeContentUrl, for links that wrap or open an image the site itself
 * ships. Bundlers inline small assets as `data:image/...;base64,` URLs, so
 * those raster data URLs are accepted here. `data:text/html`, SVG and every
 * other non-web scheme still return undefined.
 */
export function safeMediaUrl(href: string | undefined | null): string | undefined {
  const safe = safeContentUrl(href);
  if (safe) return safe;
  const trimmed = href?.trim();
  return trimmed && SAFE_DATA_IMAGE.test(trimmed) ? trimmed : undefined;
}
