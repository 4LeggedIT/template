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
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
    title: "Foster Update",
    description: "Progress update from a temporary foster placement.",
    category: "Foster",
  },
];

const MediaGalleryExamplePage = () => {
  return (
    <>
      <SEOHead
        title="Media Gallery Example"
        canonicalPath="/examples/media-gallery"
        description="Unified photo and video gallery module example with optional filtering."
      />
      <PageHero
        eyebrow="Examples"
        title="Media gallery module"
        description="Split or unified media gallery patterns with no-JS-safe content rendering."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Examples", href: "/examples" },
          { label: "Media Gallery" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        <SplitMediaGallerySection
          items={sampleItems}
          photosProps={{
            title: "Photos",
            description: "Photos are intentionally split from videos for parity with sites that use distinct sections.",
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

        <MediaGallerySection
          title="Media gallery (unified variant)"
          description="Use unified mode when photos and videos should appear in one section."
          items={sampleItems}
          columns={3}
          showFilters
          enablePhotoLightbox
          shuffleOnLoad
          maxPhotos={2}
          maxVideos={2}
        />

        <MediaGallerySection
          title="Media gallery (empty state)"
          items={[]}
        />

        <Card>
          <CardHeader>
            <CardTitle>Validation checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Photos and videos render without JavaScript.</p>
            <p>- Filter controls are optional and only enhance browsing behavior.</p>
            <p>- Photo lightbox is optional and must not replace direct media links.</p>
            <p>- Lightbox supports previous/next navigation via on-screen controls and keyboard arrows.</p>
            <p>- Empty-state copy is visible when no media items are provided.</p>
            <p>- Optional shuffle/limits/info/social blocks can be enabled per page.</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default MediaGalleryExamplePage;
