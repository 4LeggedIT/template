import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Expand, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type MediaGalleryItem =
  | {
      id: string;
      kind: "photo";
      src: string;
      alt: string;
      caption?: string;
      href?: string;
      featured?: boolean;
      category?: string;
    }
  | {
      id: string;
      kind: "video";
      src: string;
      title: string;
      description?: string;
      poster?: string;
      category?: string;
    };

export type MediaGalleryNotice = {
  title?: string;
  text: string;
};

export type MediaGallerySocialLink = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
};

export type MediaGallerySocialCta = {
  title: string;
  description?: string;
  links: MediaGallerySocialLink[];
};

export type MediaGallerySectionProps = {
  title?: string;
  description?: string;
  items: MediaGalleryItem[];
  className?: string;
  columns?: 2 | 3 | 4;
  showFilters?: boolean;
  enablePhotoLightbox?: boolean;
  emptyMessage?: string;
  shuffleOnLoad?: boolean;
  maxPhotos?: number;
  maxVideos?: number;
  infoNotice?: MediaGalleryNotice;
  socialCta?: MediaGallerySocialCta;
};

const columnClassMap: Record<NonNullable<MediaGallerySectionProps["columns"]>, string> = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4",
};

const shuffleArray = <T,>(array: T[]) => {
  const shuffled = [...array];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[nextIndex]] = [shuffled[nextIndex], shuffled[index]];
  }
  return shuffled;
};

const MediaGallerySection = ({
  title = "Media Gallery",
  description = "Unified photo + video gallery with optional filtering.",
  items,
  className,
  columns = 3,
  showFilters = true,
  enablePhotoLightbox = true,
  emptyMessage = "Media items coming soon.",
  shuffleOnLoad = false,
  maxPhotos,
  maxVideos,
  infoNotice,
  socialCta,
}: MediaGallerySectionProps) => {
  const orderedItems = useMemo(
    () => (shuffleOnLoad ? shuffleArray(items) : items),
    [items, shuffleOnLoad],
  );

  const categories = useMemo(
    () =>
      [...new Set(orderedItems.map((item) => item.category).filter(Boolean))]
        .map((category) => String(category))
        .sort((left, right) => left.localeCompare(right)),
    [orderedItems],
  );
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);

  const visibleItems = useMemo(() => {
    const filtered = activeFilter === "all"
      ? orderedItems
      : orderedItems.filter((item) => item.category === activeFilter);

    if (typeof maxPhotos !== "number" && typeof maxVideos !== "number") return filtered;

    let remainingPhotos = typeof maxPhotos === "number" ? Math.max(0, maxPhotos) : Number.POSITIVE_INFINITY;
    let remainingVideos = typeof maxVideos === "number" ? Math.max(0, maxVideos) : Number.POSITIVE_INFINITY;

    const limited: MediaGalleryItem[] = [];
    for (const item of filtered) {
      if (item.kind === "photo") {
        if (remainingPhotos <= 0) continue;
        remainingPhotos -= 1;
      } else {
        if (remainingVideos <= 0) continue;
        remainingVideos -= 1;
      }
      limited.push(item);
    }
    return limited;
  }, [activeFilter, orderedItems, maxPhotos, maxVideos]);

  const photoItems = useMemo(
    () => visibleItems.filter((item): item is Extract<MediaGalleryItem, { kind: "photo" }> => item.kind === "photo"),
    [visibleItems],
  );
  const activePhoto = selectedPhotoId
    ? photoItems.find((photo) => photo.id === selectedPhotoId) ?? null
    : null;
  const activePhotoIndex = activePhoto ? photoItems.findIndex((photo) => photo.id === activePhoto.id) : -1;
  const hasAdjacentPhotos = photoItems.length > 1;

  const goToPreviousPhoto = useCallback(() => {
    if (!hasAdjacentPhotos || activePhotoIndex < 0) return;
    const nextIndex = activePhotoIndex === 0 ? photoItems.length - 1 : activePhotoIndex - 1;
    setSelectedPhotoId(photoItems[nextIndex].id);
  }, [activePhotoIndex, hasAdjacentPhotos, photoItems]);

  const goToNextPhoto = useCallback(() => {
    if (!hasAdjacentPhotos || activePhotoIndex < 0) return;
    const nextIndex = activePhotoIndex === photoItems.length - 1 ? 0 : activePhotoIndex + 1;
    setSelectedPhotoId(photoItems[nextIndex].id);
  }, [activePhotoIndex, hasAdjacentPhotos, photoItems]);

  useEffect(() => {
    if (!activePhoto) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPhotoId(null);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPreviousPhoto();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNextPhoto();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activePhoto, goToNextPhoto, goToPreviousPhoto]);

  return (
    <section className={cn("rounded-2xl border border-border bg-card/40 p-6", className)}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>

      {infoNotice ? (
        <Card className="mb-6 border-border/80 bg-muted/30">
          <CardContent className="space-y-1 py-4">
            {infoNotice.title ? <p className="text-sm font-medium">{infoNotice.title}</p> : null}
            <p className="text-sm text-muted-foreground">{infoNotice.text}</p>
          </CardContent>
        </Card>
      ) : null}

      {showFilters && categories.length > 1 ? (
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => setActiveFilter("all")}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              type="button"
              size="sm"
              variant={activeFilter === category ? "default" : "outline"}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      ) : null}

      {visibleItems.length ? (
        <>
          <div className={cn("grid gap-4", columnClassMap[columns])}>
            {visibleItems.map((item) => (
              <Card key={item.id} className="overflow-hidden border-border/80">
                {item.kind === "photo" ? (
                  <CardContent className="p-0">
                    <a
                      href={item.href ?? item.src}
                      target="_blank"
                      rel="noreferrer"
                      className="group block"
                      onClick={(event) => {
                        if (!enablePhotoLightbox) return;
                        event.preventDefault();
                        setSelectedPhotoId(item.id);
                      }}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        <img
                          src={item.src}
                          alt={item.alt}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                        {enablePhotoLightbox ? (
                          <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/65 p-2 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <Expand className="h-4 w-4" />
                          </div>
                        ) : null}
                      </div>
                    </a>
                    {item.caption ? (
                      <div className="border-t border-border/70 px-4 py-3 text-sm text-muted-foreground">{item.caption}</div>
                    ) : null}
                  </CardContent>
                ) : (
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
                )}
              </Card>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Browse photos and videos, and open any image for a closer look.
          </p>
        </>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-6 text-sm text-muted-foreground">{emptyMessage}</CardContent>
        </Card>
      )}

      {activePhoto ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Media gallery lightbox"
          onClick={() => setSelectedPhotoId(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedPhotoId(null);
            }}
            aria-label="Close media image"
          >
            <X className="h-6 w-6" />
          </button>

          {hasAdjacentPhotos ? (
            <button
              type="button"
              className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              onClick={(event) => {
                event.stopPropagation();
                goToPreviousPhoto();
              }}
              aria-label="Show previous media image"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
          ) : null}

          <div className="mx-auto w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
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
                  Open original media
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
            {hasAdjacentPhotos ? (
              <p className="mt-2 text-center text-xs text-white/80">
                Use arrow keys or on-screen controls to browse the gallery.
              </p>
            ) : null}
          </div>

          {hasAdjacentPhotos ? (
            <button
              type="button"
              className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              onClick={(event) => {
                event.stopPropagation();
                goToNextPhoto();
              }}
              aria-label="Show next media image"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          ) : null}
        </div>
      ) : null}

      {socialCta?.links?.length ? (
        <Card className="mt-6 border-border/80">
          <CardHeader>
            <CardTitle className="text-base">{socialCta.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {socialCta.description ? <p className="text-sm text-muted-foreground">{socialCta.description}</p> : null}
            <div className="flex flex-wrap gap-2">
              {socialCta.links.map((socialLink) => (
                socialLink.external || !socialLink.href.startsWith("/") ? (
                  <Button key={socialLink.id} asChild variant="outline" size="sm">
                    <a href={socialLink.href} target="_blank" rel="noopener noreferrer">
                      {socialLink.label}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <Button key={socialLink.id} asChild variant="outline" size="sm">
                    <Link to={socialLink.href}>{socialLink.label}</Link>
                  </Button>
                )
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
};

export default MediaGallerySection;
