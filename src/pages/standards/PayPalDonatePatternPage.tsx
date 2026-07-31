import { useTranslation } from "react-i18next";
import PageHero from "@/components/patterns/PageHero";
import PayPalDonateButton from "@/components/patterns/PayPalDonateButton";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PayPalDonatePatternPage = () => {
  const { t } = useTranslation(["paypalDonate", "common"]);

  return (
    <>
      <SEOHead
        title="PayPal Donate Pattern"
        canonicalPath="/standards/paypal-donate"
        description="PayPal donate button standard and fallback helper link guidance."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("paypalDonate:hero.title")}
        description={t("paypalDonate:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("paypalDonate:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("paypalDonate:example.title")}</h2>
          <PayPalDonateButton className="max-w-md" hostedButtonId="DUMMY_HOSTED_BUTTON_ID_EXAMPLE_ONLY" />
          <a
            href="https://www.paypal.com/donate/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            {t("paypalDonate:example.helperLink")}
          </a>
          <p className="text-sm text-muted-foreground">{t("paypalDonate:example.configNote")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("paypalDonate:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("paypalDonate:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default PayPalDonatePatternPage;
