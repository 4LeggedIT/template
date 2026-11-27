import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type CollapsibleSectionProps = {
  title: string;
  /** Wraps the section in a card (used by both Usage rules and Snippet). */
  card?: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
};

/**
 * Closed-by-default titled section on a `/standards/*` page. Template-only.
 * A native `<details>` so the content is in the prerendered HTML and readable without JavaScript.
 */
const CollapsibleSection = ({ title, card = false, defaultOpen = false, children }: CollapsibleSectionProps) => (
  <details
    open={defaultOpen || undefined}
    className={`group ${card ? "rounded-xl border bg-card text-card-foreground shadow-xs" : ""}`}
  >
    <summary
      className={`flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden ${
        card ? "p-6" : ""
      }`}
    >
      <h2 className={card ? "text-2xl font-semibold leading-none tracking-tight" : "text-lg font-semibold"}>{title}</h2>
      <ChevronDown
        aria-hidden="true"
        className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
      />
    </summary>
    <div className={card ? "px-6 pb-6" : "pt-3"}>{children}</div>
  </details>
);

export default CollapsibleSection;
