import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type SpendCategoryId =
  | "animalCare"
  | "rescueOperations"
  | "marketingOutreach"
  | "administrative"
  | "fundraising"
  | (string & {});

export type SpendCategory = {
  id: SpendCategoryId;
  /** Always freeform, even though `id` is drawn from a recommended set — e.g. "Dog Recovery & Trapping Supplies" (Rovers Return) vs. "Community Feeding Routes" (Feeding Perris Strays) can both be the "rescueOperations" id. */
  label: string;
  amount: number;
  icon?: LucideIcon;
};

export type SpendBreakdownSectionLabels = {
  totalLabel?: string; // default "Total Expenses"
  sourceLabel?: string; // default "View our filed tax return"
};

type SpendBreakdownSectionProps = {
  title?: string;
  description?: string;
  categories: SpendCategory[];
  /** Required, not optional — financial figures are always a snapshot of one filing period, never "current." e.g. "Fiscal Year 2025, as filed on Form 990-EZ". */
  periodLabel: string;
  /** Site-computed, not derived by this component — it would otherwise have to guess which spend category maps to which outcome. e.g. {amountLabel: "$298", outcomeLabel: "per dog rescued"}. */
  costPerOutcome?: { amountLabel: string; outcomeLabel: string };
  /** Optional link to the actual filed Form 990/990-EZ or a public database profile (IRS Tax Exempt Organization Search, Candid/GuideStar, ProPublica Nonprofit Explorer). */
  sourceHref?: string;
  className?: string;
  labels?: SpendBreakdownSectionLabels;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/**
 * Deliberately not merged with ImpactStatsSection — this is a separate, standalone
 * pattern so a site can show spend-only, impact-only, or both side by side by
 * composing the two components on one page, rather than being forced into either.
 * Renders nothing if `categories` is empty — never a placeholder $0 total.
 */
const SpendBreakdownSection = ({
  title,
  description,
  categories,
  periodLabel,
  costPerOutcome,
  sourceHref,
  className,
  labels = {},
}: SpendBreakdownSectionProps) => {
  if (!categories.length) return null;

  const { totalLabel = "Total Expenses", sourceLabel = "View our filed tax return" } = labels;
  const total = categories.reduce((sum, category) => sum + category.amount, 0);

  return (
    <section className={cn("space-y-8", className)}>
      {title || description || periodLabel ? (
        <div className="space-y-2 text-center">
          {title ? <h2 className="text-3xl font-bold tracking-tight">{title}</h2> : null}
          {description ? <p className="mx-auto max-w-2xl text-muted-foreground">{description}</p> : null}
          <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {periodLabel}
          </span>
        </div>
      ) : null}

      <div className="text-center">
        <span className="text-sm text-muted-foreground">{totalLabel}</span>
        <p className="text-4xl font-bold tabular-nums">{currencyFormatter.format(total)}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.id}
              className="flex w-[calc(50%-0.5rem)] flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center sm:w-[calc(33.333%-0.667rem)] lg:w-[calc(16.666%-0.833rem)]"
            >
              {Icon ? <Icon className="h-6 w-6 text-primary" aria-hidden="true" /> : null}
              <span className="text-xl font-bold tabular-nums">{currencyFormatter.format(category.amount)}</span>
              <span className="text-sm text-muted-foreground">{category.label}</span>
            </div>
          );
        })}
      </div>

      {costPerOutcome ? (
        <div className="mx-auto max-w-md rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 text-center">
          <p className="text-2xl font-bold tabular-nums text-primary">{costPerOutcome.amountLabel}</p>
          <p className="text-sm text-muted-foreground">{costPerOutcome.outcomeLabel}</p>
        </div>
      ) : null}

      {sourceHref ? (
        <div className="text-center">
          <a
            href={sourceHref}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {sourceLabel}
          </a>
        </div>
      ) : null}
    </section>
  );
};

export default SpendBreakdownSection;
