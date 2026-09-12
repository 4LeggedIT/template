import { Images } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export type MediaCarouselTileItem = {
  id: string;
  kind: "photo" | "video";
  src: string;
  /** Alt text (photo) or an accessible label (video) — the caller resolves this from whatever field its own item type uses. */
  label: string;
  /** Video only. */
  poster?: string;
  /** Photo only. CSS object-position, for off-center subjects. */
  objectPosition?: string;
};

export type MediaCarouselTileProps = {
  /** One or more media items rendered as a single tile. A single item renders with no carousel chrome; more than one gets prev/next controls and a count badge. */
  media: MediaCarouselTileItem[];
  fit?: "cover" | "contain";
  /** The tile always renders in a fixed-ratio box (default "landscape"); "contain" letterboxes within it rather than cropping, it never switches to a natural, un-boxed height. */
  aspect?: "landscape" | "portrait" | "square";
  /** Called when a photo in the tile is clicked (e.g. to open a lightbox). Omit for no click-through — videos are never click-through since they already have their own controls. */
  onPhotoClick?: (item: MediaCarouselTileItem) => void;
  videoFallback?: string;
};

const aspectClassMap: Record<NonNullable<MediaCarouselTileProps["aspect"]>, string> = {
  landscape: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
  square: "aspect-square",
};

const renderMediaItem = (
  item: MediaCarouselTileItem,
  fit: NonNullable<MediaCarouselTileProps["fit"]>,
  videoFallback: string,
  onPhotoClick?: (item: MediaCarouselTileItem) => void,
) => {
  const fitClass = cn("h-full w-full", fit === "contain" ? "object-contain" : "object-cover");

  if (item.kind === "video") {
    return (
      <video controls preload="metadata" playsInline poster={item.poster} className={fitClass}>
        <source src={item.src} type="video/mp4" />
        {videoFallback}
      </video>
    );
  }

  const img = (
    <img
      src={item.src}
      alt={item.label}
      loading="lazy"
      decoding="async"
      style={fit === "cover" ? { objectPosition: item.objectPosition ?? "50% 50%" } : undefined}
      className={fitClass}
    />
  );

  if (!onPhotoClick) return img;

  return (
    <button
      type="button"
      className="block h-full w-full"
      onClick={() => onPhotoClick(item)}
      aria-label={item.label}
    >
      {img}
    </button>
  );
};

const MediaCarouselTile = ({
  media,
  fit = "cover",
  aspect = "landscape",
  onPhotoClick,
  videoFallback = "Your browser does not support the video tag.",
}: MediaCarouselTileProps) => {
  const boxClass = cn(aspectClassMap[aspect], "overflow-hidden bg-muted");

  if (media.length === 1) {
    return <div className={boxClass}>{renderMediaItem(media[0], fit, videoFallback, onPhotoClick)}</div>;
  }

  return (
    <Carousel opts={{ loop: true }} aria-label={media[0].label}>
      <CarouselContent className="ml-0">
        {media.map((item) => (
          <CarouselItem key={item.id} className="pl-0">
            <div className={boxClass}>{renderMediaItem(item, fit, videoFallback, onPhotoClick)}</div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 top-1/2 h-7 w-7 -translate-y-1/2 border-none bg-black/60 text-white hover:bg-black/80 hover:text-white" />
      <CarouselNext className="right-2 top-1/2 h-7 w-7 -translate-y-1/2 border-none bg-black/60 text-white hover:bg-black/80 hover:text-white" />
      <span className="pointer-events-none absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
        <Images className="h-3 w-3" />
        {media.length}
      </span>
    </Carousel>
  );
};

export default MediaCarouselTile;
