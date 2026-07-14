import { useMemo } from "react";
import MediaGallerySection, {
  type MediaGalleryItem,
  type MediaGallerySectionProps,
} from "@/components/patterns/MediaGallerySection";
import { cn } from "@/lib/utils";

type SplitMediaGallerySideProps = Omit<MediaGallerySectionProps, "items">;

type SplitMediaGallerySectionProps = {
  items: MediaGalleryItem[];
  className?: string;
  photosProps?: SplitMediaGallerySideProps;
  videosProps?: SplitMediaGallerySideProps;
  labels?: {
    photosTitle?: string;
    videosTitle?: string;
  };
};

const SplitMediaGallerySection = ({
  items,
  className,
  photosProps,
  videosProps,
  labels = {},
}: SplitMediaGallerySectionProps) => {
  const { photosTitle = "Photos", videosTitle = "Videos" } = labels;

  const photoItems = useMemo(
    () => items.filter((item): item is Extract<MediaGalleryItem, { kind: "photo" }> => item.kind === "photo"),
    [items],
  );
  const videoItems = useMemo(
    () => items.filter((item): item is Extract<MediaGalleryItem, { kind: "video" }> => item.kind === "video"),
    [items],
  );

  return (
    <div className={cn("space-y-8", className)}>
      <MediaGallerySection
        title={photosTitle}
        showFilters={false}
        items={photoItems}
        {...photosProps}
      />
      <MediaGallerySection
        title={videosTitle}
        showFilters={false}
        enablePhotoLightbox={false}
        items={videoItems}
        {...videosProps}
      />
    </div>
  );
};

export default SplitMediaGallerySection;
