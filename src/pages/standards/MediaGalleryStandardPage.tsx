import MediaGallerySection, { type MediaGalleryItem } from "@/components/patterns/MediaGallerySection";
import SplitMediaGallerySection from "@/components/patterns/SplitMediaGallerySection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sampleItems: MediaGalleryItem[] = [
  {
    id: "photo-1",
    kind: "photo",
    src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
    alt: "Dog running in grass",
    caption: "Weekend adoption event highlights.",
    category: "Events",
  },
  {
    id: "photo-2",
    kind: "photo",
    src: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
    alt: "Dog portrait close-up",
    caption: "Recent intake after medical check.",
    category: "Intake",
  },
  {
    id: "video-1",
    kind: "video",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    title: "Volunteer Day Recap",
    description: "Short recap from the latest volunteer and enrichment day.",
    category: "Events",
  },
  {
    id: "video-2",
    kind: "video",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    title: "Foster Update",
    description: "Progress update from a temporary foster placement.",
    category: "Foster",
  },
];

const MediaGalleryStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Media Gallery Pattern"
        canonicalPath="/standards/media-gallery"
        description="Standardized media gallery pattern for mixed photo/video content."
      />
      <PageHero
        eyebrow="Standards"
        title="Media gallery pattern"
        description="Use split galleries by default when photos and videos should appear in distinct sections."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "Media Gallery Pattern" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Example — split (default)</h2>
          <p className="text-sm text-muted-foreground">
            Photos are intentionally split from videos for parity with sites that use distinct sections.
          </p>
          <SplitMediaGallerySection
            items={sampleItems}
            photosProps={{
              title: "Photos",
              columns: 2,
              shuffleOnLoad: true,
              maxPhotos: 2,
              infoNotice: {
                title: "Media note",
                text: "Media shown here are examples and may include non-adoptable dogs. Use this optional notice for context/disclaimers.",
              },
              socialCta: {
                title: "Follow updates",
                description: "Optional social CTA block for gallery pages.",
                links: [
                  { id: "social-1", label: "Instagram", href: "https://example.org/instagram", external: true },
                  { id: "social-2", label: "Facebook", href: "https://example.org/facebook", external: true },
                ],
              },
            }}
            videosProps={{
              title: "Videos",
              description: "Videos are rendered in their own gallery section.",
              columns: 2,
              shuffleOnLoad: true,
              maxVideos: 2,
            }}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Unified variant</h2>
          <p className="text-sm text-muted-foreground">
            Use unified mode when photos and videos should appear in one section instead.
          </p>
          <MediaGallerySection
            title="Media gallery (unified variant)"
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
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Use `SplitMediaGallerySection` when photos and videos must render in separate sections (default recommendation).</p>
            <p>- Use `MediaGallerySection` for mixed photo and video sections when a unified gallery is desired.</p>
            <p>- Keep media items in normalized arrays and pass them as props.</p>
            <p>- Keep `showFilters` optional and default to user-friendly category groups.</p>
            <p>- Core media visibility must not depend on JavaScript.</p>
            <p>- Use optional photo lightbox as enhancement only, not as primary access path; navigation (prev/next controls + keyboard arrows) is part of the standard behavior.</p>
            <p>- Optional page behaviors (shuffle, max photos/videos, info notice, social CTA) are module props.</p>
            <p>- Empty-state copy is visible when no media items are provided (`items={"{[]}"}`).</p>
            <p>- Defaults: `columns=3`, `showFilters=true`, `enablePhotoLightbox=true`, `shuffleOnLoad=false`.</p>
            <p>- Component: `template/src/components/patterns/MediaGallerySection.tsx`</p>
            <p>- Wrapper: `template/src/components/patterns/SplitMediaGallerySection.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default MediaGalleryStandardPage;
