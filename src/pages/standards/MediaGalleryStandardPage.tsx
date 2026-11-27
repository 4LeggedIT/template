import { useTranslation } from "react-i18next";
import MediaGallerySection, { type MediaGalleryItem } from "@/components/patterns/MediaGallerySection";
import SplitMediaGallerySection from "@/components/patterns/SplitMediaGallerySection";
import StandardSnippet from "@/components/StandardSnippet";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { buildExampleSnippet } from "@/lib/example-snippet";
import { exampleImages } from "@/data/examples/images";
import { exampleVideos } from "@/data/examples/videos";
import CollapsibleSection from "@/components/standards/CollapsibleSection";

const MediaGalleryStandardPage = () => {
  const { t } = useTranslation(["mediaGallery", "common"]);

  const sampleItems: MediaGalleryItem[] = [
    {
      id: "photo-1",
      kind: "photo",
      src: exampleImages.dogPair,
      alt: t("mediaGallery:items.photo1.alt"),
      caption: t("mediaGallery:items.photo1.caption"),
      category: t("mediaGallery:items.photo1.category"),
    },
    {
      id: "photo-2",
      kind: "photo",
      src: exampleImages.atlas,
      alt: t("mediaGallery:items.photo2.alt"),
      caption: t("mediaGallery:items.photo2.caption"),
      category: t("mediaGallery:items.photo2.category"),
    },
    {
      id: "video-1",
      kind: "video",
      src: exampleVideos.meetTheDogs,
      poster: exampleImages.juniper,
      title: t("mediaGallery:items.video1.title"),
      description: t("mediaGallery:items.video1.description"),
      category: t("mediaGallery:items.video1.category"),
    },
    {
      id: "video-2",
      kind: "video",
      src: exampleVideos.moreDogs,
      poster: exampleImages.maple,
      title: t("mediaGallery:items.video2.title"),
      description: t("mediaGallery:items.video2.description"),
      category: t("mediaGallery:items.video2.category"),
    },
  ];

  const groupedSampleItems: MediaGalleryItem[] = [
    {
      id: "grouped-photo-1",
      kind: "photo",
      src: exampleImages.ranger,
      alt: t("mediaGallery:items.groupedPhoto1.alt"),
      category: t("mediaGallery:items.groupedPhoto1.category"),
      groupId: "story-1",
    },
    {
      id: "grouped-photo-2",
      kind: "photo",
      src: exampleImages.biscuit,
      alt: t("mediaGallery:items.groupedPhoto2.alt"),
      category: t("mediaGallery:items.groupedPhoto2.category"),
      groupId: "story-1",
    },
    {
      id: "grouped-photo-3",
      kind: "photo",
      src: exampleImages.remi,
      alt: t("mediaGallery:items.groupedPhoto3.alt"),
      category: t("mediaGallery:items.groupedPhoto3.category"),
    },
  ];

  const snippetExample = buildExampleSnippet({
    component: "MediaGallerySection",
    props: { title: "Gallery", items: sampleItems, columns: 3, showFilters: true, enablePhotoLightbox: true },
  });

  return (
    <>
      <SEOHead
        title="Media Gallery Pattern"
        canonicalPath="/standards/media-gallery"
        description="Standardized media gallery pattern for mixed photo/video content, with a consistent grid and viewer on every site that has a gallery page."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("mediaGallery:hero.title")}
        description={t("mediaGallery:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("mediaGallery:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("mediaGallery:sections.split.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("mediaGallery:sections.split.description")}</p>
          <SplitMediaGallerySection
            items={sampleItems}
            photosProps={{
              title: t("mediaGallery:sections.split.photosTitle"),
              columns: 2,
              shuffleOnLoad: true,
              maxPhotos: 2,
              infoNotice: {
                title: t("mediaGallery:sections.split.infoNoticeTitle"),
                text: t("mediaGallery:sections.split.infoNoticeText"),
              },
              socialCta: {
                title: t("mediaGallery:sections.split.socialCtaTitle"),
                description: t("mediaGallery:sections.split.socialCtaDescription"),
                links: [
                  { id: "social-1", label: "Instagram", href: "https://example.org/instagram", external: true },
                  { id: "social-2", label: "Facebook", href: "https://example.org/facebook", external: true },
                ],
              },
            }}
            videosProps={{
              title: t("mediaGallery:sections.split.videosTitle"),
              description: t("mediaGallery:sections.split.videosDescription"),
              columns: 2,
              shuffleOnLoad: true,
              maxVideos: 2,
            }}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("mediaGallery:sections.unified.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("mediaGallery:sections.unified.description")}</p>
          <MediaGallerySection
            title={t("mediaGallery:sections.unified.sectionTitle")}
            items={sampleItems}
            columns={3}
            showFilters
            enablePhotoLightbox
            shuffleOnLoad
            maxPhotos={2}
            maxVideos={2}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("mediaGallery:sections.contain.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("mediaGallery:sections.contain.description")}</p>
          <MediaGallerySection
            title={t("mediaGallery:sections.contain.sectionTitle")}
            items={sampleItems}
            columns={3}
            fit="contain"
            showFilters={false}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("mediaGallery:sections.grouped.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("mediaGallery:sections.grouped.description")}</p>
          <MediaGallerySection
            title={t("mediaGallery:sections.grouped.sectionTitle")}
            items={groupedSampleItems}
            columns={3}
            showFilters={false}
          />
        </div>

        <StandardSnippet code={snippetExample} />

        <CollapsibleSection card title={t("mediaGallery:standard.title")}>
          <div className="space-y-2 break-words text-sm text-muted-foreground">
            {(t("mediaGallery:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </div>
        </CollapsibleSection>
      </section>
    </>
  );
};

export default MediaGalleryStandardPage;
