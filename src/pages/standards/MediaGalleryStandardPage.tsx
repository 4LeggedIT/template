import { useTranslation } from "react-i18next";
import MediaGallerySection, { type MediaGalleryItem } from "@/components/patterns/MediaGallerySection";
import SplitMediaGallerySection from "@/components/patterns/SplitMediaGallerySection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MediaGalleryStandardPage = () => {
  const { t } = useTranslation(["mediaGallery", "common"]);

  const sampleItems: MediaGalleryItem[] = [
    {
      id: "photo-1",
      kind: "photo",
      src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
      alt: t("mediaGallery:items.photo1.alt"),
      caption: t("mediaGallery:items.photo1.caption"),
      category: t("mediaGallery:items.photo1.category"),
    },
    {
      id: "photo-2",
      kind: "photo",
      src: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
      alt: t("mediaGallery:items.photo2.alt"),
      caption: t("mediaGallery:items.photo2.caption"),
      category: t("mediaGallery:items.photo2.category"),
    },
    {
      id: "video-1",
      kind: "video",
      src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      title: t("mediaGallery:items.video1.title"),
      description: t("mediaGallery:items.video1.description"),
      category: t("mediaGallery:items.video1.category"),
    },
    {
      id: "video-2",
      kind: "video",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      title: t("mediaGallery:items.video2.title"),
      description: t("mediaGallery:items.video2.description"),
      category: t("mediaGallery:items.video2.category"),
    },
  ];

  return (
    <>
      <SEOHead
        title="Media Gallery Pattern"
        canonicalPath="/standards/media-gallery"
        description="Standardized media gallery pattern for mixed photo/video content."
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

        <Card>
          <CardHeader>
            <CardTitle>{t("mediaGallery:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("mediaGallery:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default MediaGalleryStandardPage;
