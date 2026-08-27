import { PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Content-authoring rule: never assign blame for how the animal came to be
 * lost, in distress, sick, or passed away — not toward an owner, Animal
 * Control, a rescuer, or circumstance. Focus on the care given and gratitude.
 */
export type MemorialEntry = {
  id: string;
  /** Proper noun — never machine-translated. */
  name: string;
  /** 1+ typically; an empty array renders the paw-icon fallback, never a broken image. */
  photos: string[];
  /** Free-text, e.g. "January 2026 – May 2026" — never computed/parsed. */
  dates?: string;
  /** Paragraphs — primary narrative. */
  message: string[];
  /** Short tag, e.g. "Our founding rescue". */
  badge?: string;
  /** Standalone bold reflective closing line, e.g. "Our fight continues." */
  closingLine?: string;
  /** General-purpose link-out (e.g. a Facebook reflection post) — not donate-specific. */
  externalHref?: { label: string; href: string };
};

export type MemorialSectionLabels = {
  externalLinkDefaultLabel?: string;
};

type MemorialSectionProps = {
  title?: string;
  description?: string;
  entries: MemorialEntry[];
  emptyMessage?: string;
  className?: string;
  labels?: MemorialSectionLabels;
};

const MemorialSection = ({
  title = "In Loving Memory",
  description,
  entries,
  emptyMessage = "This page is being prepared with photos and messages for the animals we've loved and lost. Check back soon.",
  className,
  labels = {},
}: MemorialSectionProps) => {
  const { externalLinkDefaultLabel = "Read more" } = labels;

  return (
    <section className={cn("space-y-8", className)}>
      {title || description ? (
        <div className="text-center">
          {title ? <h2 className="text-3xl font-bold tracking-tight">{title}</h2> : null}
          {description ? (
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">{description}</p>
          ) : null}
        </div>
      ) : null}

      {entries.length ? (
        <ul className="space-y-8">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="grid gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:grid-cols-[auto_1fr] sm:p-8"
            >
              <div className="mx-auto flex shrink-0 gap-2 sm:mx-0">
                {entry.photos.length ? (
                  entry.photos.map((photo, index) => (
                    <img
                      key={photo}
                      src={photo}
                      alt={index === 0 ? entry.name : `${entry.name}, additional photo`}
                      className="h-36 w-36 rounded-2xl object-cover ring-2 ring-primary/30"
                    />
                  ))
                ) : (
                  <div className="flex h-36 w-36 items-center justify-center rounded-2xl bg-muted ring-2 ring-primary/30">
                    <PawPrint className="h-10 w-10 text-primary" />
                  </div>
                )}
              </div>

              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold">{entry.name}</h3>
                {entry.badge ? (
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-primary">
                    {entry.badge}
                  </p>
                ) : null}
                {entry.dates ? (
                  <p className="mt-1 text-sm font-medium text-muted-foreground">{entry.dates}</p>
                ) : null}

                <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                  {entry.message.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {entry.closingLine ? (
                  <p className="mt-4 text-lg font-bold text-foreground">{entry.closingLine}</p>
                ) : null}

                {entry.externalHref ? (
                  <div className="mt-6">
                    <Button variant="outline" asChild>
                      <a href={entry.externalHref.href} target="_blank" rel="noreferrer">
                        {entry.externalHref.label || externalLinkDefaultLabel}
                      </a>
                    </Button>
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <PawPrint className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-3 text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </section>
  );
};

export default MemorialSection;
