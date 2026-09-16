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
