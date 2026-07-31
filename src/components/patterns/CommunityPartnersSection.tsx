import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CommunityPartner = {
  id: string;
  name: string;
  category: string;
  description: string;
  logoSrc?: string;
  /** Optional background classes (e.g. "bg-slate-900") for logos whose artwork needs a specific backing to stay legible — e.g. light/white marks. Omit for logos that already read fine on the card's default background. */
  logoBackgroundClassName?: string;
  /** When set, the card links to this URL — via the logo when `logoSrc` is present, otherwise via a "Visit Website" text link (the logo doubling as the link is enough; a redundant text link under it would be noise). */
  url?: string;
};

export type CommunityPartnersCategorySection = {
  category: string;
  title: string;
  description?: string;
};

export type CommunityPartnersSectionLabels = {
  visitLabel?: string; // default "Visit Website"
};

type CommunityPartnersSectionProps = {
  partners: CommunityPartner[];
  sections: CommunityPartnersCategorySection[];
  ctaTitle?: string;
  ctaDescription?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
  labels?: CommunityPartnersSectionLabels;
};

/**
 * Renders partners grouped by category, in the order `sections` lists them. A category with zero
 * matching partners is skipped entirely (no empty-state heading) so the page never shows a dead
 * "coming soon" subsection alongside real content. Within a rendered category, partners are always
 * sorted alphabetically by name — ordering must never imply a ranking between supporters.
 */
const CommunityPartnersSection = ({
  partners,
  sections,
  ctaTitle,
  ctaDescription,
  ctaLabel,
  ctaHref,
  className,
  labels = {},
}: CommunityPartnersSectionProps) => {
  const { visitLabel = "Visit Website" } = labels;

  const groups = sections
    .map((section) => ({
      section,
      items: partners
        .filter((partner) => partner.category === section.category)
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((partner) => (
              <div
                key={partner.id}
                className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
              >
                {partner.logoSrc ? (
                  (() => {
                    const logo = (
                      <div
                        className={cn(
                          "mb-4 flex h-16 items-center justify-center",
                          partner.logoBackgroundClassName ? "rounded-lg px-4 py-2" : undefined,
                          partner.logoBackgroundClassName,
                        )}
                      >
                        <img
                          src={partner.logoSrc}
                          alt={partner.name}
                          loading="lazy"
                          className="h-full w-auto object-contain"
                        />
                      </div>
                    );
                    return partner.url ? (
                      <a href={partner.url} target="_blank" rel="noreferrer">
                        {logo}
                      </a>
                    ) : (
                      logo
                    );
                  })()
                ) : null}
                <p className="font-display text-xl text-ink">{partner.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">{partner.description}</p>
                {partner.url && !partner.logoSrc ? (
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {visitLabel}
                  </a>
                ) : null}
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

export default CommunityPartnersSection;
