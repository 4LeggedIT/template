import { useTranslation } from "react-i18next";
import MediaCarouselTile, { type MediaCarouselTileItem } from "@/components/patterns/MediaCarouselTile";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PHOTOS = [
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
];

const MediaCarouselTileStandardPage = () => {
  const { t } = useTranslation(["mediaCarouselTile", "common"]);

  const singleItem: MediaCarouselTileItem[] = [
    { id: "single-1", kind: "photo", src: PHOTOS[0], label: t("mediaCarouselTile:items.i1.label") },
  ];

  const groupedItems: MediaCarouselTileItem[] = PHOTOS.map((src, index) => ({
    id: `grouped-${index + 1}`,
    kind: "photo",
    src,
    label: t(`mediaCarouselTile:items.i${index + 1}.label`),
  }));

  return (
    <>
      <SEOHead
        title="Media Carousel Tile Pattern"
        canonicalPath="/standards/media-carousel-tile"
        description="Shared primitive for rendering one or more media items as a single tile, with an inline carousel and count badge for more than one."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("mediaCarouselTile:hero.title")}
        description={t("mediaCarouselTile:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("mediaCarouselTile:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("mediaCarouselTile:sections.single.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("mediaCarouselTile:sections.single.description")}</p>
          <div className="max-w-sm">
            <MediaCarouselTile media={singleItem} />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("mediaCarouselTile:sections.grouped.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("mediaCarouselTile:sections.grouped.description")}</p>
          <div className="max-w-sm">
            <MediaCarouselTile media={groupedItems} />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("mediaCarouselTile:sections.contain.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("mediaCarouselTile:sections.contain.description")}</p>
          <div className="max-w-sm">
            <MediaCarouselTile media={groupedItems} fit="contain" aspect="portrait" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("mediaCarouselTile:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("mediaCarouselTile:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default MediaCarouselTileStandardPage;
