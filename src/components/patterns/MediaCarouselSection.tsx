import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { safeContentUrl } from "@/lib/safe-url";

type MediaCarouselBase = {
  id: string;
  alt: string;
  /**
   * Optional display name for the subject (a dog, a person, a place). Renders bold at
   * the top of the caption block. Omit it and no name line appears -- several orgs
   * publish photos they cannot name, and inventing one is not an option.
   */
  name?: string;
  /**
   * Optional supporting line under the name. Independent of `name`: an item may carry a
   * description with no name, or the reverse.
   */
  description?: string;
  /**
   * Optional link target for the tile. Typically a same-page anchor (`#review-carly`)
   * pointing at whatever this photo illustrates, but a route (`/adopt`) or an external
   * URL works too. **Several items may share one target** -- one story often has more
   * than one photo. Passed through `safeContentUrl`; a disallowed scheme renders the
   * tile unlinked rather than dropping it.
   */
  href?: string;
};

export type MediaCarouselItem =
  | ({ kind: "image"; src: string } & MediaCarouselBase)
  | ({ kind: "video"; src: string; poster: string } & MediaCarouselBase);

type MediaCarouselSectionProps = {
  items: MediaCarouselItem[];
  className?: string;
  /**
   * Milliseconds between auto-advances. **Omit for a static carousel**, which is the
   * right default once tiles are links -- an auto-advancing carousel slides the link
   * out from under the pointer. `ui/carousel.tsx` pauses on hover/focus and never
   * starts under `prefers-reduced-motion: reduce`, so opting in stays safe.
   */
  autoPlayDelayMs?: number;
};

/**
 * Renders the tile's link wrapper, or the tile unchanged when there is nothing safe to
 * link to. Mirrors `SuccessStoriesSection`'s internal-vs-external split and adds the
 * same-page anchor case: a react-router `Link` would not scroll for a bare `#id`.
 */
const TileLink = ({
  href,
  label,
  children,
}: {
  href?: string;
  label: string;
  children: ReactNode;
}) => {
  const safeHref = safeContentUrl(href);
  if (!safeHref) return <>{children}</>;

  const className =
    "block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  if (safeHref.startsWith("/")) {
    return (
      <Link to={safeHref} aria-label={label} className={className}>
        {children}
      </Link>
    );
  }

  const isExternal = /^https?:/i.test(safeHref);
  return (
    <a
      href={safeHref}
      aria-label={label}
      className={className}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
};

const MediaCarouselSection = ({ items, className, autoPlayDelayMs }: MediaCarouselSectionProps) => {
  if (!items.length) return null;

  return (
    <Carousel
      opts={{ loop: true }}
      {...(autoPlayDelayMs ? { autoPlay: { delayMs: autoPlayDelayMs } } : {})}
      className={className}
    >
      <CarouselContent>
        {items.map((item) => {
          const caption =
            item.name || item.description ? (
              <div className="border-t border-border/70 px-4 py-3 text-left">
                {item.name ? <p className="text-sm font-semibold text-foreground">{item.name}</p> : null}
                {item.description ? (
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                ) : null}
              </div>
            ) : null;

          const media = (
            <div className="aspect-[3/4] overflow-hidden bg-muted">
              {item.kind === "video" ? (
                <video controls playsInline preload="metadata" poster={item.poster} className="h-full w-full object-contain">
                  <source src={item.src} type="video/mp4" />
                </video>
              ) : (
                <img src={item.src} alt={item.alt} loading="lazy" className="h-full w-full object-contain" />
              )}
            </div>
          );

          // A `<video controls>` inside an anchor is unusable -- pressing play would
          // navigate. So a video tile links from its caption only, while an image tile
          // links as a whole (caption included, so the text is part of the hit target).
          const body =
            item.kind === "video" ? (
              <>
                {media}
                <TileLink href={item.href} label={item.name ?? item.alt}>
                  {caption}
                </TileLink>
              </>
            ) : (
              <TileLink href={item.href} label={item.name ?? item.alt}>
                {media}
                {caption}
              </TileLink>
            );

          return (
            <CarouselItem key={item.id} className="basis-1/2 sm:basis-1/3">
              <div className="overflow-hidden rounded-xl border border-border bg-background">{body}</div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default MediaCarouselSection;
