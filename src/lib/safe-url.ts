const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

/**
 * Validates a content-authored URL (blog/news markdown links, partner
 * records, pet photo links, etc.) before it reaches an href. Content data
 * is edited by non-technical volunteers via GitHub and should never be
 * able to produce a `javascript:` (or other executable-scheme) link just
 * by pasting an odd value into a data file or markdown body.
 *
 * Returns the original string if safe, or undefined if it should not be
 * rendered as a link at all.
 */
export function safeContentUrl(href: string | undefined | null): string | undefined {
  if (!href) return undefined;
  const trimmed = href.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("#")) return trimmed;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  try {
    const parsed = new URL(trimmed, "https://placeholder.invalid");
    return ALLOWED_PROTOCOLS.has(parsed.protocol) ? trimmed : undefined;
  } catch {
    return undefined;
  }
}
