import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import FacebookPostEmbed from "@/components/patterns/FacebookPostEmbed";
import { useCachedFacebookVerdict } from "@/lib/facebook-post-status";

export type JourneyTimelineStage = {
  label: string;
  date?: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  /** When set, renders a native <video> (poster={imageSrc}) instead of a plain image. */
  videoSrc?: string;
  /** Optional credit links rendered below the description — e.g. partner rescues named in the
   * stage's own text (`description` is plain text, so it can't carry inline links itself). */
  partnerLinks?: { label: string; href: string }[];
  /** Optional "read more" links to related content — e.g. the news post or blog entry that
   * announced what this stage describes. Distinct from `partnerLinks`, which credits outside
   * organizations named in the stage's text: these are follow-the-story actions, so an internal
   * href (starting with "/") renders as a client-side <Link> rather than a new tab. */
  relatedLinks?: { label: string; href: string }[];
  /** Original Facebook post; when set the stage shows the post instead of the stored copy, and the whole stage is dropped if the post is gone or Facebook refuses to embed it (see facebook-post-status.ts). */
  embedUrl?: string;
};

const isExternalContentHref = (href: string) => !href.startsWith("/");

type JourneyTimelineProps = {
  stages: JourneyTimelineStage[];
  className?: string;
  /** Site-owned seed list of `embedUrl`s already confirmed deleted; those stages are dropped without any
   * live check. Optional: without it every stage is still verified live (see lib/facebook-post-status.ts). */
  knownUnavailableEmbeds?: ReadonlySet<string>;
};

const JourneyTimeline = ({ stages, className, knownUnavailableEmbeds }: JourneyTimelineProps) => {
  if (!stages.length) return null;

  return (
    <ol className={cn("relative space-y-8 border-l border-border pl-8", className)}>
      {stages.map((stage, index) => (
        <Stage key={`${stage.label}-${index}`} stage={stage} knownUnavailableEmbeds={knownUnavailableEmbeds} />
      ))}
    </ol>
  );
};

const Stage = ({ stage, knownUnavailableEmbeds }: { stage: JourneyTimelineStage; knownUnavailableEmbeds?: ReadonlySet<string> }) => {
  const [dropped, setDropped] = useState(false);
  const drop = useCallback(() => setDropped(true), []);
  const known = useCachedFacebookVerdict(stage.embedUrl, knownUnavailableEmbeds);
  const pointer = Boolean(stage.embedUrl);
  if (dropped || (known && known !== "ok")) return null;
  return (
        <li className="relative">
          <span className="absolute -left-[calc(2rem+5px)] top-1 flex h-[10px] w-[10px] items-center justify-center rounded-full bg-primary ring-4 ring-background" />
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-lg font-semibold tracking-tight">{stage.label}</h3>
            {stage.date ? <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{stage.date}</span> : null}
          </div>
          {pointer ? <FacebookPostEmbed url={stage.embedUrl!} onUnavailable={drop} knownGone={knownUnavailableEmbeds} /> : <p className="mt-2 text-sm text-muted-foreground">{stage.description}</p>}
          {!pointer && stage.partnerLinks?.length ? (
            <p className="mt-2 flex flex-wrap gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
              {stage.partnerLinks.map((partner, partnerIndex) => (
                <span key={partner.href}>
                  <a
                    href={partner.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                  >
                    {partner.label}
                  </a>
                  {partnerIndex < stage.partnerLinks!.length - 1 ? "," : ""}
                </span>
              ))}
            </p>
          ) : null}
          {!pointer && stage.relatedLinks?.length ? (
            <ul className="mt-3 space-y-1">
              {stage.relatedLinks.map((related) => {
                const linkClassName = "inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline";
                return (
                  <li key={related.href}>
                    {isExternalContentHref(related.href) ? (
                      <a href={related.href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
                        {related.label}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    ) : (
                      <Link to={related.href} className={linkClassName}>
                        {related.label}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : null}
          {pointer ? null : stage.videoSrc ? (
            <figure className="mt-4 flex justify-center overflow-hidden rounded-2xl border border-border bg-card sm:max-w-sm">
              <video
                controls
                playsInline
                preload="metadata"
                poster={stage.imageSrc}
                className="block max-h-[420px] w-auto max-w-full"
              >
                <source src={stage.videoSrc} type="video/mp4" />
              </video>
            </figure>
          ) : stage.imageSrc ? (
            <figure className="mt-4 overflow-hidden rounded-2xl border border-border bg-card sm:max-w-sm">
              <img
                src={stage.imageSrc}
                alt={stage.imageAlt ?? stage.label}
                loading="lazy"
                className="block h-auto w-full"
              />
            </figure>
          ) : null}
        </li>
  );
};

export default JourneyTimeline;
