import { cn } from "@/lib/utils";

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
};

type JourneyTimelineProps = {
  stages: JourneyTimelineStage[];
  className?: string;
};

const JourneyTimeline = ({ stages, className }: JourneyTimelineProps) => {
  if (!stages.length) return null;

  return (
    <ol className={cn("relative space-y-8 border-l border-border pl-8", className)}>
      {stages.map((stage, index) => (
        <li key={`${stage.label}-${index}`} className="relative">
          <span className="absolute -left-[calc(2rem+5px)] top-1 flex h-[10px] w-[10px] items-center justify-center rounded-full bg-primary ring-4 ring-background" />
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-lg font-semibold tracking-tight">{stage.label}</h3>
            {stage.date ? <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{stage.date}</span> : null}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{stage.description}</p>
          {stage.partnerLinks?.length ? (
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
          {stage.videoSrc ? (
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
      ))}
    </ol>
  );
};

export default JourneyTimeline;
