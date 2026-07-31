import { useTranslation } from "react-i18next";
import FlyerLibrarySection, { type FlyerLibraryItem } from "@/components/patterns/FlyerLibrarySection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import adoptionFridaysFlyer from "@/assets/flyers/adoption-fridays-flyer.svg";
import basketRaffleFlyer from "@/assets/flyers/basket-raffle-flyer.svg";

const FlyerLibraryStandardPage = () => {
  const { t } = useTranslation(["flyerLibrary", "common"]);

  const sampleFlyers: FlyerLibraryItem[] = [
    {
      id: "adoption-fridays",
      src: adoptionFridaysFlyer,
      alt: t("flyerLibrary:flyers.adoptionFridays.alt"),
      category: "general",
      caption: t("flyerLibrary:flyers.adoptionFridays.caption"),
      featured: true,
    },
    {
      id: "basket-raffle",
      src: basketRaffleFlyer,
      alt: t("flyerLibrary:flyers.basketRaffle.alt"),
      category: "general",
      caption: t("flyerLibrary:flyers.basketRaffle.caption"),
    },
  ];

  return (
    <>
      <SEOHead
        title="Flyer Library Pattern"
        canonicalPath="/standards/flyer-library"
        description="Standardized pattern for timeless, undated awareness and informational flyers."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("flyerLibrary:hero.title")}
        description={t("flyerLibrary:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("flyerLibrary:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("flyerLibrary:sections.example.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("flyerLibrary:sections.example.description")}</p>
          <FlyerLibrarySection
            title={t("flyerLibrary:sections.example.libraryTitle")}
            description={t("flyerLibrary:sections.example.libraryDescription")}
            flyers={sampleFlyers}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("flyerLibrary:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("flyerLibrary:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default FlyerLibraryStandardPage;
