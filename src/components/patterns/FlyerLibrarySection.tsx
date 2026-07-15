import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Expand, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type FlyerLibraryCategory = "foster" | "volunteer" | "spay-neuter" | "safety" | "general";

export type FlyerLibraryItem = {
  id: string;
  src: string;
  alt: string;
  category: FlyerLibraryCategory;
  caption?: string;
  /** Defaults to `src` when omitted (e.g. a higher-res original differs from the display asset). */
  downloadHref?: string;
  downloadFileName?: string;
  featured?: boolean;
};

export type FlyerLibrarySectionLabels = {
  emptyMessage?: string;
  filterAllLabel?: string;
  downloadLabel?: string;
  lightboxLabel?: string;
  closeLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
};

type FlyerLibraryCategoryOption = {
  value: FlyerLibraryCategory;
  label: string;
};

type FlyerLibrarySectionProps = {
  title?: string;
  description?: string;
  flyers: FlyerLibraryItem[];
  className?: string;
  columns?: 2 | 3 | 4;
  /** Display labels for filter pills; auto-derived (title-cased) from `flyers` when omitted. */
  categories?: FlyerLibraryCategoryOption[];
  /** Locks the section to a single category and hides the filter pills — for embedding a filtered teaser on another page. */
  categoryFilter?: FlyerLibraryCategory;
  showFilters?: boolean;
  enableLightbox?: boolean;
  labels?: FlyerLibrarySectionLabels;
};

const columnClassMap: Record<NonNullable<FlyerLibrarySectionProps["columns"]>, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

const formatCategoryLabel = (category: string) =>
  category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const FlyerLibrarySection = ({
  title = "Flyer Library",
  description,
  flyers,
  className,
  columns = 3,
  categories,
  categoryFilter,
  showFilters = true,
  enableLightbox = true,
  labels = {},
}: FlyerLibrarySectionProps) => {
  const {
    emptyMessage = "Flyers coming soon.",
    filterAllLabel = "All",
    downloadLabel = "Download flyer",
    lightboxLabel = "Flyer lightbox",
    closeLabel = "Close flyer",
    previousLabel = "Previous flyer",
    nextLabel = "Next flyer",
  } = labels;

  const distinctCategories = useMemo(
    () => [...new Set(flyers.map((flyer) => flyer.category))],
    [flyers],
  );

  const categoryOptions = useMemo<FlyerLibraryCategoryOption[]>(() => {
    if (categories) {
      return categories.filter((option) => distinctCategories.includes(option.value));
    }
    return [...distinctCategories]
      .sort((left, right) => left.localeCompare(right))
      .map((value) => ({ value, label: formatCategoryLabel(value) }));
  }, [categories, distinctCategories]);

  const [activeFilter, setActiveFilter] = useState<FlyerLibraryCategory | "all">("all");

  const visibleFlyers = useMemo(() => {
    if (categoryFilter) return flyers.filter((flyer) => flyer.category === categoryFilter);
    if (activeFilter === "all") return flyers;
    return flyers.filter((flyer) => flyer.category === activeFilter);
  }, [flyers, categoryFilter, activeFilter]);

  const resolvedFlyers = useMemo(
    () => visibleFlyers.filter((flyer) => Boolean(flyer.src)),
    [visibleFlyers],
  );

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    if (!enableLightbox) return;
    setSelectedIndex(index);
  };

  const closeLightbox = () => setSelectedIndex(null);

  const goPrevious = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null || resolvedFlyers.length === 0) return current;
      return current === 0 ? resolvedFlyers.length - 1 : current - 1;
    });
  }, [resolvedFlyers.length]);

  const goNext = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null || resolvedFlyers.length === 0) return current;
      return current === resolvedFlyers.length - 1 ? 0 : current + 1;
    });
  }, [resolvedFlyers.length]);

  const activeFlyer = selectedIndex !== null ? resolvedFlyers[selectedIndex] : null;

  useEffect(() => {
    if (!activeFlyer) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeFlyer, goNext, goPrevious]);

  const showPills = !categoryFilter && showFilters && categoryOptions.length > 1;

  return (
    <section className={cn("rounded-2xl border border-border bg-card/40 p-6", className)}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
      </div>

      {showPills ? (
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => setActiveFilter("all")}
          >
            {filterAllLabel}
          </Button>
          {categoryOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={activeFilter === option.value ? "default" : "outline"}
              onClick={() => setActiveFilter(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      ) : null}

      {resolvedFlyers.length ? (
        <div className={cn("grid gap-4", columnClassMap[columns])}>
          {resolvedFlyers.map((flyer, index) => {
            const imageHref = flyer.downloadHref ?? flyer.src;
            const isFeatured = flyer.featured && columns !== 2;

            return (
              <Card
                key={flyer.id}
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
                    <div className={cn("relative overflow-hidden", isFeatured ? "aspect-[16/10]" : "aspect-[3/4]")}>
                      <img
                        src={flyer.src}
                        alt={flyer.alt}
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
                      {flyer.caption ? (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full p-3 text-sm text-white transition-transform duration-200 group-hover:translate-y-0">
                          {flyer.caption}
                        </div>
                      ) : null}
                    </div>
                  </a>
                  {flyer.caption ? (
                    <div className="border-t border-border/70 px-4 py-3 text-sm text-muted-foreground">
                      {flyer.caption}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-6 text-sm text-muted-foreground">{emptyMessage}</CardContent>
        </Card>
      )}

      {activeFlyer ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxLabel}
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={(event) => {
              event.stopPropagation();
              closeLightbox();
            }}
            aria-label={closeLabel}
          >
            <X className="h-6 w-6" />
          </button>

          {resolvedFlyers.length > 1 ? (
            <>
              <button
                type="button"
                className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                onClick={(event) => {
                  event.stopPropagation();
                  goPrevious();
                }}
                aria-label={previousLabel}
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
                aria-label={nextLabel}
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          ) : null}

          <div className="mx-auto w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <img
              src={activeFlyer.src}
              alt={activeFlyer.alt}
              className="mx-auto max-h-[78vh] w-auto max-w-full rounded-lg object-contain"
            />
            {activeFlyer.caption ? (
              <div className="mx-auto mt-4 max-w-3xl rounded-md bg-white/10 px-4 py-3 text-center text-sm text-white">
                {activeFlyer.caption}
              </div>
            ) : null}
            <div className="mt-3 text-center">
              <Button asChild size="sm" variant="secondary">
                <a
                  href={activeFlyer.downloadHref ?? activeFlyer.src}
                  download={activeFlyer.downloadFileName ?? true}
                  rel="noreferrer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {downloadLabel}
                </a>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default FlyerLibrarySection;
