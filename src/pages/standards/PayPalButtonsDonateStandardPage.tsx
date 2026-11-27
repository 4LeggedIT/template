import { useTranslation } from "react-i18next";
import StandardSnippet from "@/components/StandardSnippet";
import PageHero from "@/components/patterns/PageHero";
import PayPalDonateButton from "@/components/patterns/PayPalDonateButton";
import SEOHead from "@/components/patterns/SEOHead";
import CollapsibleSection from "@/components/standards/CollapsibleSection";

const snippetExample = `import PayPalDonateButton from "@/components/patterns/PayPalDonateButton";

<PayPalDonateButton hostedButtonId="YOUR_HOSTED_BUTTON_ID" env="production" />`;

const PayPalButtonsDonateStandardPage = () => {
  const { t } = useTranslation(["paypalButtonsDonate", "common"]);

  return (
    <>
      <SEOHead
        title="PayPal Donate Button"
        canonicalPath="/standards/paypal-buttons/donate-button"
        description="PayPal's legacy Donate Button product (donate-sdk.js) — hosted button ID + env, plus a fallback helper link."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("paypalButtonsDonate:hero.title")}
        description={t("paypalButtonsDonate:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("paypalButtonsDonate:breadcrumb.parent"), href: "/standards/paypal-buttons" },
          { label: t("paypalButtonsDonate:breadcrumb.current") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("paypalButtonsDonate:example.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("paypalButtonsDonate:example.description")}</p>
          <PayPalDonateButton className="max-w-md" hostedButtonId="DUMMY_HOSTED_BUTTON_ID_EXAMPLE_ONLY" />
          <a
            href="https://www.paypal.com/donate/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            {t("paypalButtonsDonate:example.helperLink")}
          </a>
          <p className="text-sm text-muted-foreground">{t("paypalButtonsDonate:example.configNote")}</p>
          <p className="text-sm">
            <a
              href="https://developer.paypal.com/sdk/donate"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 text-muted-foreground hover:text-foreground"
            >
              {t("paypalButtonsDonate:example.docsLink")}
            </a>
          </p>
        </div>

        <StandardSnippet code={snippetExample} />

        <CollapsibleSection card title={t("paypalButtonsDonate:standard.title")}>
          <div className="space-y-2 break-words text-sm text-muted-foreground">
            {(t("paypalButtonsDonate:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </div>
        </CollapsibleSection>
      </section>
    </>
  );
};

export default PayPalButtonsDonateStandardPage;
