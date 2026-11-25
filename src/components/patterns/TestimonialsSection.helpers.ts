/**
 * SHARED PATTERN: do not edit in a site repo.
 * Source: github.com/4LeggedIT/internal-tools
 *   4leggedit-websites/templates-sources/patterns/TestimonialsSection.helpers.ts
 * Change it there, then sync it to every site.
 *
 * Non-component helpers for TestimonialsSection.tsx, kept in their own module so that file exports only
 * components (react-refresh/only-export-components).
 */


/**
 * Normalizes authored line endings and splits a long quote into paragraphs.
 *
 * - `\r\n` and lone `\r` are normalized to `\n` first (letters pasted out of
 *   Word/Outlook arrive CRLF).
 * - Whitespace immediately before or after any newline is dropped, so a line
 *   with trailing spaces ("...ours.  \n\n") still registers as a real blank-line
 *   boundary, and indentation carried in from a wrapped source doesn't leak in.
 * - One or more blank lines (`\n{2,}`, i.e. 3+ consecutive newlines too) collapse
 *   to exactly one paragraph boundary.
 * - A single surviving `\n` stays inside its paragraph and is rendered as a
 *   `<br />` — this is what keeps a run of consecutive one-line dialogue lines
 *   visually grouped as one block instead of exploding into N paragraphs.
 *
 * Exported for unit tests; call sites should not need it.
 */
export const splitQuoteParagraphs = (quote: string): string[] =>
  quote
    .replace(/\r\n?/g, "\n")
    .replace(/[^\S\n]*\n[^\S\n]*/g, "\n")
    .trim()
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
