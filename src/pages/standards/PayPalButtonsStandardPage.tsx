import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const modePages = [
  { key: "donateButton", href: "/standards/paypal-buttons/donate-button" },
  { key: "hostedButtons", href: "/standards/paypal-buttons/hosted-buttons" },
];

const PayPalButtonsStandardPage = () => {
  const { t } = useTranslation(["paypalButtons", "common"]);

  return (
    <>
      <SEOHead
        title="PayPal Buttons Pattern"
        canonicalPath="/standards/paypal-buttons"
        description="PayPal has two incompatible button products/SDKs — pick the mode matching the org's real button."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("paypalButtons:hero.title")}
        description={t("paypalButtons:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("paypalButtons:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="grid gap-4 md:grid-cols-2">
          {modePages.map((page) => (
            <Link key={page.href} to={page.href} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="text-lg">{t(`paypalButtons:modes.${page.key}.title`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{t(`paypalButtons:modes.${page.key}.description`)}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("paypalButtons:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("paypalButtons:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default PayPalButtonsStandardPage;
