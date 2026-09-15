import type { ReactNode } from "react";

export type PlaceholderSectionProps = {
  /** Section heading, as a visitor will read it. */
  title: string;
  /** Visitor-safe standing text — the `details coming soon` line of `M0-05`. */
  publicText: string;
  /** The ask, addressed to the client: exactly what we need from them. */
  children: ReactNode;
  /** Optional footnote — where the request came from, how to send it. */
  why?: string;
  /** Badge text. Override for non-English sites, e.g. `Nos falta tu parte`. */
  label?: string;
};

/**
 * Marks a whole section the CLIENT still owes — content only they can supply:
 * their story, their team, their credentials. We cannot draft these, and
 * inventing them would breach `M0-04`.
 *
 * Distinct from `Placeholder`, which marks wording we drafted for them to
 * confirm. This marks an actual hole.
 *
 * **Build the page anyway.** A section that does not exist is invisible, and
 * invisible gaps do not get filled — they quietly become permanent. A loud
 * placeholder on the page the client reviews is a standing reminder addressed to
 * the one person who can close it.
 *
 * Renders two layers: a visitor-safe "coming soon" line so the page reads
 * sensibly to anyone who lands on it, and the ask itself. Neither is suppressed
 * in production — a page should not go live still asking its owner for content
 * without someone deciding to let it.
 *
 * Styled only with the shadcn semantic tokens every fleet site defines
 * (`accent`, `accent-foreground`, `foreground`, `muted-foreground`) — never a
 * site's brand tokens, or the pattern renders unstyled everywhere but its
 * origin site.
 *
 * Governance: `M0-05a`. Listed by `npm run drafts` (`M0-05b`).
 */
const PlaceholderSection = ({
  title,
  publicText,
  children,
  why,
  label = "We need your part",
}: PlaceholderSectionProps) => (
  <section data-placeholder-section="true" aria-label={`${label}: ${title}`}>
    <h2 className="text-2xl font-bold text-foreground">{title}</h2>
    <p className="mt-3 text-lg leading-relaxed text-foreground/85">{publicText}</p>

    <div className="mt-5 rounded-3xl border-2 border-dashed border-accent bg-accent/10 p-6">
      <p className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-accent-foreground">
        {label}
      </p>
      <div className="mt-3 text-foreground/85">{children}</div>
      {why ? (
        <p className="mt-4 border-t border-accent/40 pt-4 text-sm text-muted-foreground">{why}</p>
      ) : null}
    </div>
  </section>
);

export default PlaceholderSection;
