import { Link } from "react-router-dom";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MediaGalleryStandardPage = () => {
  return (
    <>
      <SEOHead
        title="Media Gallery Pattern"
        canonicalPath="/docs/standards/media-gallery"
        description="Standardized media gallery pattern for mixed photo/video content."
      />
      <PageHero
        eyebrow="Docs"
        title="Media gallery pattern"
        description="Use split galleries by default when photos and videos should appear in distinct sections."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "Media Gallery Pattern" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
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
            <p>- Use optional photo lightbox as enhancement only, not as primary access path.</p>
            <p>- Lightbox navigation (prev/next controls + keyboard arrows) is part of the standard behavior.</p>
            <p>- Optional page behaviors (shuffle, max photos/videos, info notice, social CTA) are module props.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reference</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              - Live example:{" "}
              <Link className="underline underline-offset-4" to="/examples/media-gallery">
                Media gallery example page
              </Link>
            </p>
            <p>- Component: `template/src/components/patterns/MediaGallerySection.tsx`</p>
            <p>- Wrapper: `template/src/components/patterns/SplitMediaGallerySection.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default MediaGalleryStandardPage;
