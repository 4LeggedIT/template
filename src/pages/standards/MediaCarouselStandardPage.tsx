import { useTranslation } from "react-i18next";
import MediaCarouselSection, { type MediaCarouselItem } from "@/components/patterns/MediaCarouselSection";
import StandardSnippet from "@/components/StandardSnippet";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { exampleImages } from "@/data/examples/images";
import { buildExampleSnippet } from "@/lib/example-snippet";
import CollapsibleSection from "@/components/standards/CollapsibleSection";

const MediaCarouselStandardPage = () => {
  const { t } = useTranslation(["mediaCarousel", "common"]);

  const PHOTOS = [
    exampleImages.juniper,
    exampleImages.willow,
    exampleImages.ranger,
    exampleImages.poppy,
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

  const snippetExample = buildExampleSnippet({
    component: "MediaCarouselSection",
    props: { items: linkedItems },
  });

  return (
    <>
      <SEOHead
        title="Media Carousel Pattern"
        canonicalPath="/standards/media-carousel"
        description="Standardized photo carousel with optional names, descriptions and links, for featuring dogs, events, or partners in a compact strip."
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

        <StandardSnippet code={snippetExample} />

        <CollapsibleSection card title={t("mediaCarousel:standard.title")}>
          <div className="space-y-2 break-words text-sm text-muted-foreground">
            {(t("mediaCarousel:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </div>
        </CollapsibleSection>
      </section>
    </>
  );
};

export default MediaCarouselStandardPage;
