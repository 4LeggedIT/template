import { useTranslation } from "react-i18next";
import PageHero from "@/components/patterns/PageHero";
import PayPalHostedButton from "@/components/patterns/PayPalHostedButton";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PayPalButtonsHostedStandardPage = () => {
  const { t } = useTranslation(["paypalButtonsHosted", "common"]);

  return (
    <>
      <SEOHead
        title="PayPal Hosted Buttons"
        canonicalPath="/standards/paypal-buttons/hosted-buttons"
        description="PayPal's newer Hosted Buttons product (paypal.com/sdk/js?components=hosted-buttons) — client-id + hosted button ID, distinct from the legacy Donate Button."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("paypalButtonsHosted:hero.title")}
        description={t("paypalButtonsHosted:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("paypalButtonsHosted:breadcrumb.parent"), href: "/standards/paypal-buttons" },
          { label: t("paypalButtonsHosted:breadcrumb.current") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("paypalButtonsHosted:example.title")}</h2>
          <PayPalHostedButton className="max-w-md" />
          <p className="text-sm text-muted-foreground">{t("paypalButtonsHosted:example.note")}</p>
          <p className="text-sm">
            <a
              href="https://developer.paypal.com/guides/low-code-buy-button"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 text-muted-foreground hover:text-foreground"
            >
              {t("paypalButtonsHosted:example.docsLink")}
            </a>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("paypalButtonsHosted:gotcha.title")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>{t("paypalButtonsHosted:gotcha.text")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("paypalButtonsHosted:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("paypalButtonsHosted:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default PayPalButtonsHostedStandardPage;
