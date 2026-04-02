import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type PhotoGalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  href?: string;
  featured?: boolean;
};

type PhotoGallerySectionProps = {
  title?: string;
  description?: string;
  photos: PhotoGalleryItem[];
  className?: string;
  columns?: 2 | 3 | 4;
  enableLightbox?: boolean;
};

const columnClassMap: Record<NonNullable<PhotoGallerySectionProps["columns"]>, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

const PhotoGallerySection = ({
  title = "Photo Gallery",
  description = "Browse recent photos and open any image for a closer look.",
  photos,
  className,
  columns = 4,
  enableLightbox = true,
}: PhotoGallerySectionProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const resolvedPhotos = useMemo(() => photos.filter((photo) => Boolean(photo.src)), [photos]);

  const openLightbox = (index: number) => {
    if (!enableLightbox) return;
    setSelectedIndex(index);
  };

  const closeLightbox = () => setSelectedIndex(null);
  const goPrevious = () => {
    setSelectedIndex((current) => {
      if (current === null || resolvedPhotos.length === 0) return current;
      return current === 0 ? resolvedPhotos.length - 1 : current - 1;
    });
  };
  const goNext = () => {
    setSelectedIndex((current) => {
      if (current === null || resolvedPhotos.length === 0) return current;
      return current === resolvedPhotos.length - 1 ? 0 : current + 1;
    });
  };

  const activePhoto = selectedIndex !== null ? resolvedPhotos[selectedIndex] : null;

  return (
    <section className={cn("rounded-2xl border border-border bg-card/40 p-6", className)}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>

      {resolvedPhotos.length ? (
        <>
          <div className={cn("grid gap-4", columnClassMap[columns])}>
            {resolvedPhotos.map((photo, index) => {
              const imageHref = photo.href ?? photo.src;
              const isFeatured = photo.featured && columns !== 2;

              return (
                <Card
                  key={photo.id}
                  className={cn(
                    "group overflow-hidden border-border/80",
                    isFeatured ? "md:col-span-2 lg:col-span-2" : "",
                  )}
                >
                  <CardContent className="p-0">
                    <a
                      href={imageHref}
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                      onClick={(event) => {
                        if (!enableLightbox) return;
                        event.preventDefault();
                        openLightbox(index);
                      }}
                    >
                      <div className={cn("relative overflow-hidden", isFeatured ? "aspect-[16/10]" : "aspect-square")}>
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                        {enableLightbox ? (
                          <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/65 p-2 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <Expand className="h-4 w-4" />
                          </div>
                        ) : null}
                        {photo.caption ? (
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full p-3 text-sm text-white transition-transform duration-200 group-hover:translate-y-0">
                            {photo.caption}
                          </div>
                        ) : null}
                      </div>
                    </a>
                    {photo.caption ? (
                      <div className="border-t border-border/70 px-4 py-3 text-sm text-muted-foreground">
                        {photo.caption}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Core images and captions render in HTML without JavaScript. Lightbox controls are progressive enhancement.
          </p>
        </>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-6 text-sm text-muted-foreground">
            Gallery images coming soon.
          </CardContent>
        </Card>
      )}

      {activePhoto ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery lightbox"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={(event) => {
              event.stopPropagation();
              closeLightbox();
            }}
            aria-label="Close gallery image"
          >
            <X className="h-6 w-6" />
          </button>

          {resolvedPhotos.length > 1 ? (
            <>
              <button
                type="button"
                className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                onClick={(event) => {
                  event.stopPropagation();
                  goPrevious();
                }}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                onClick={(event) => {
                  event.stopPropagation();
                  goNext();
                }}
                aria-label="Next image"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          ) : null}

          <div
            className="mx-auto w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={activePhoto.src}
              alt={activePhoto.alt}
              className="mx-auto max-h-[78vh] w-auto max-w-full rounded-lg object-contain"
            />
            {activePhoto.caption ? (
              <div className="mx-auto mt-4 max-w-3xl rounded-md bg-white/10 px-4 py-3 text-center text-sm text-white">
                {activePhoto.caption}
              </div>
            ) : null}
            <div className="mt-3 text-center">
              <Button asChild size="sm" variant="secondary">
                <a href={activePhoto.href ?? activePhoto.src} target="_blank" rel="noreferrer">
                  Open original image
                </a>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default PhotoGallerySection;
