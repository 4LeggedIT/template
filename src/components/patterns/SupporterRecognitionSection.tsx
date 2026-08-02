import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Supporter = {
  id: string;
  name: string;
  category: string;
  /** Optional short line under the name, e.g. "In memory of Bella." */
  note?: string;
};

export type SupporterRecognitionCategorySection = {
  category: string;
  title: string;
  description?: string;
};

type SupporterRecognitionSectionProps = {
  supporters: Supporter[];
  sections: SupporterRecognitionCategorySection[];
  ctaTitle?: string;
  ctaDescription?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
};

/**
 * Renders individual supporters grouped by category, in the order `sections` lists them. A
 * category with zero matching supporters is skipped entirely (no empty-state heading). Within a
 * rendered category, supporters are always sorted alphabetically by name — a flat thank-you list,
 * never a giving-tier ranking. Unlike `CommunityPartnersSection`, entries have no logo/url: these
 * are private individuals, not self-publishing organizations.
 */
const SupporterRecognitionSection = ({
  supporters,
  sections,
  ctaTitle,
  ctaDescription,
  ctaLabel,
  ctaHref,
  className,
}: SupporterRecognitionSectionProps) => {
  const groups = sections
    .map((section) => ({
      section,
      items: supporters
        .filter((supporter) => supporter.category === section.category)
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .filter((group) => group.items.length > 0);

  if (!groups.length && !ctaHref) return null;

  return (
    <div className={cn("space-y-16", className)}>
      {groups.map(({ section, items }) => (
        <section key={section.category}>
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight">{section.title}</h2>
            {section.description ? (
              <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">{section.description}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {items.map((supporter) => (
              <div
                key={supporter.id}
                className="rounded-2xl border border-border bg-card px-4 py-2 text-center"
              >
                <p className="font-medium text-foreground">{supporter.name}</p>
                {supporter.note ? <p className="mt-0.5 text-xs text-muted-foreground">{supporter.note}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ))}

      {ctaHref ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center">
          {ctaTitle ? <h2 className="text-2xl font-bold tracking-tight">{ctaTitle}</h2> : null}
          {ctaDescription ? (
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">{ctaDescription}</p>
          ) : null}
          <Button asChild className="mt-4">
            <a href={ctaHref}>{ctaLabel ?? "Get in touch"}</a>
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default SupporterRecognitionSection;
