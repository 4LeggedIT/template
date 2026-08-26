import { useTranslation } from "react-i18next";
import MediaCarouselSection, { type MediaCarouselItem } from "@/components/patterns/MediaCarouselSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MediaCarouselStandardPage = () => {
  const { t } = useTranslation(["mediaCarousel", "common"]);

  const PHOTOS = [
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=900&q=80",
  ];

  // Nothing optional set -- the plainest form, and what a site uses when it cannot name
  // the animals in its own photos.
  const bareItems: MediaCarouselItem[] = PHOTOS.map((src, index) => ({
    id: `bare-${index + 1}`,
    kind: "image",
    src,
    alt: t(`mediaCarousel:items.i${index + 1}.alt`),
  }));

  // Every optional field set, with two tiles deliberately pointing at the same anchor.
  const linkedItems: MediaCarouselItem[] = PHOTOS.map((src, index) => ({
    id: `linked-${index + 1}`,
    kind: "image",
    src,
    alt: t(`mediaCarousel:items.i${index + 1}.alt`),
    name: t(`mediaCarousel:items.i${index + 1}.name`),
    description: t(`mediaCarousel:items.i${index + 1}.description`),
    href: index < 2 ? "#story-one" : "#story-two",
  }));

  return (
    <>
      <SEOHead
        title="Media Carousel Pattern"
        canonicalPath="/standards/media-carousel"
        description="Standardized photo carousel with optional names, descriptions and links."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("mediaCarousel:hero.title")}
        description={t("mediaCarousel:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("mediaCarousel:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("mediaCarousel:sections.bare.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("mediaCarousel:sections.bare.description")}</p>
          <MediaCarouselSection items={bareItems} className="mt-6 px-10" />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("mediaCarousel:sections.linked.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("mediaCarousel:sections.linked.description")}</p>
          <MediaCarouselSection items={linkedItems} className="mt-6 px-10" />

          <div id="story-one" className="scroll-mt-24 rounded-xl border border-border bg-card/40 p-4">
            <p className="text-sm text-muted-foreground">{t("mediaCarousel:anchors.one")}</p>
          </div>
          <div id="story-two" className="scroll-mt-24 rounded-xl border border-border bg-card/40 p-4">
            <p className="text-sm text-muted-foreground">{t("mediaCarousel:anchors.two")}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("mediaCarousel:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("mediaCarousel:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default MediaCarouselStandardPage;
