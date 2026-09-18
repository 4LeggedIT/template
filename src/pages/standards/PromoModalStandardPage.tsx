import { useState } from "react";
import { useTranslation } from "react-i18next";
import PromoModal, { type PromoModalItem } from "@/components/patterns/PromoModal";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EXAMPLE_STORAGE_KEY_PREFIX = "standards_promo_modal_example_dismissed_until";
const EXAMPLE_PROMO_ID = "back-to-school-example";

const PromoModalStandardPage = () => {
  const { t } = useTranslation(["promoModal", "common"]);
  const [demoKey, setDemoKey] = useState(0);

  const promos: PromoModalItem[] = [
    {
      id: EXAMPLE_PROMO_ID,
      imageSrc:
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
      imageAlt: t("promoModal:example.imageAlt"),
      headline: t("promoModal:example.headline"),
      body: t("promoModal:example.body"),
      ctaLabel: t("promoModal:example.ctaLabel"),
      ctaHref: "/standards/promo-modal",
      expiresAtIso: "2099-01-01T00:00:00-07:00",
    },
  ];

  const reopenExample = () => {
    window.localStorage.removeItem(`${EXAMPLE_STORAGE_KEY_PREFIX}_${EXAMPLE_PROMO_ID}`);
    setDemoKey((key) => key + 1);
  };

  return (
    <>
      <SEOHead
        title="Promo Modal Pattern"
        canonicalPath="/standards/promo-modal"
        description="A dismissible, self-expiring promo popup that opens on the home page for a time-limited offer or announcement."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("promoModal:hero.title")}
        description={t("promoModal:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("promoModal:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("promoModal:sections.example.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("promoModal:sections.example.description")}</p>

          <Card className="overflow-hidden">
            <CardContent className="flex justify-center p-6">
              <Button onClick={reopenExample}>{t("promoModal:sections.reopen")}</Button>
              <PromoModal
                key={demoKey}
                promos={promos}
                storageKeyPrefix={EXAMPLE_STORAGE_KEY_PREFIX}
                openDelayMs={0}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("promoModal:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- {t("promoModal:standard.oneAtATime")}</p>
            <p>- {t("promoModal:standard.dateWindow")}</p>
            <p>- {t("promoModal:standard.dismiss")}</p>
            <p>- {t("promoModal:standard.homeOnly")}</p>
            <p>- {t("promoModal:standard.plainStrings")}</p>
            <p>- {t("promoModal:standard.component")}</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default PromoModalStandardPage;
