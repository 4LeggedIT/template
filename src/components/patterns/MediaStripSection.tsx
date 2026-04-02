import { ExternalLink, PlayCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MediaStripItem =
  | {
      id: string;
      kind: "video";
      src: string;
      title: string;
      description?: string;
      poster?: string;
    }
  | {
      id: string;
      kind: "link";
      href: string;
      title: string;
      description?: string;
      thumbnailSrc?: string;
      thumbnailAlt?: string;
      ctaLabel?: string;
    };

type MediaStripSectionProps = {
  title?: string;
  description?: string;
  items: MediaStripItem[];
  className?: string;
  compact?: boolean;
};

const MediaStripSection = ({
  title = "Media",
  description = "Reusable media strip for local MP4 clips and external media links.",
  items,
  className,
  compact = false,
}: MediaStripSectionProps) => {
  return (
    <section className={cn("rounded-2xl border border-border bg-card/40 p-6", className)}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>

      {items.length ? (
        <>
          <div className="-mx-1 overflow-x-auto px-1 pb-2">
            <div className="flex min-w-full snap-x snap-mandatory gap-4">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className={cn(
                    "w-[300px] shrink-0 snap-start overflow-hidden border-border/80",
                    compact ? "w-[260px]" : "w-[320px]",
                  )}
                >
                  {item.kind === "video" ? (
                    <>
                      <div className="aspect-video bg-black">
                        <video
                          src={item.src}
                          controls
                          preload="metadata"
                          playsInline
                          poster={item.poster}
                          className="h-full w-full object-cover"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{item.title}</CardTitle>
                      </CardHeader>
                      {item.description ? (
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </CardContent>
                      ) : null}
                    </>
                  ) : (
                    <>
                      {item.thumbnailSrc ? (
                        <a href={item.href} target="_blank" rel="noreferrer" className="block">
                          <div className="relative aspect-video overflow-hidden bg-muted">
                            <img
                              src={item.thumbnailSrc}
                              alt={item.thumbnailAlt ?? item.title}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30" />
                            <div className="absolute inset-0 flex items-center justify-center text-white">
                              <PlayCircle className="h-10 w-10" />
                            </div>
                          </div>
                        </a>
                      ) : null}
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-0">
                        {item.description ? (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        ) : null}
                        <Button asChild variant="outline" size="sm">
                          <a href={item.href} target="_blank" rel="noreferrer">
                            {item.ctaLabel ?? "Open media"}
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      </CardContent>
                    </>
                  )}
                </Card>
              ))}
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Media tiles render in HTML without JavaScript; browser video controls provide progressive enhancement.
          </p>
        </>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-6 text-sm text-muted-foreground">
            Media items coming soon.
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default MediaStripSection;
