import type { ReactNode } from "react";

export type PlaceholderProps = {
  children: ReactNode;
  /** Badge text. Override for non-English sites, e.g. `borrador`. */
  label?: string;
  /** Tooltip explaining what is provisional about this passage. */
  note?: string;
};

/**
 * Marks copy that WE drafted and the client has not confirmed — plausible
 * wording written so a page has something to hold, standing in for words the
 * client has not yet supplied.
 *
 * Governance: `M0-05a`. `M0-04` forbids invented facts and `M0-05` covers facts
 * that are simply absent (`details coming soon`). This is the third case:
 * drafted-but-unconfirmed.
 *
 * **Deliberately not suppressed in production.** The only way to ship a page
 * without the badge is to delete the wrapper, which is a conscious act taken
 * once the client confirms. These are claims about someone else's business, in
 * their voice, on their domain — shipping one unconfirmed should require a
 * decision, not an oversight.
 *
 * Wrap statements about how the business operates. Do NOT wrap interface labels,
 * button text, error-page copy, or anything sourced from the client's own
 * material — that is already theirs (`M0-05c`).
 *
 * Styled only with the shadcn semantic tokens every fleet site defines
 * (`muted`, `muted-foreground`, `background`) — never a site's brand tokens, or
 * the pattern renders unstyled everywhere but its origin site.
 *
 * `npm run drafts` lists every outstanding instance (`M0-05b`).
 */
const Placeholder = ({ children, label = "draft", note }: PlaceholderProps) => (
  <span
    data-placeholder="true"
    className="relative -mx-1 inline-block rounded-md border border-dashed border-muted-foreground/40 bg-muted px-1"
  >
    {children}
    <span
      className="ml-1.5 inline-block select-none rounded-full bg-muted-foreground px-1.5 align-[2px] text-[0.6rem] font-extrabold uppercase leading-relaxed tracking-wider text-background"
      title={note ?? "Drafted by us — awaiting the client's confirmation"}
    >
      {label}
    </span>
  </span>
);

export default Placeholder;
