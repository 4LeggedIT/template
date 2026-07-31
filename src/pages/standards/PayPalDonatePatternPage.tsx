import PageHero from "@/components/patterns/PageHero";
import PayPalDonateButton from "@/components/patterns/PayPalDonateButton";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PayPalDonatePatternPage = () => {
  return (
    <>
      <SEOHead
        title="PayPal Donate Pattern"
        canonicalPath="/standards/paypal-donate"
        description="PayPal donate button standard and fallback helper link guidance."
      />
      <PageHero
        eyebrow="Standards"
        title="PayPal donate pattern"
        description="Use the shared PayPal donate component plus a direct-link helper for popup/SDK failure cases."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "PayPal Donate Pattern" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Example</h2>
          <PayPalDonateButton className="max-w-md" hostedButtonId="DUMMY_HOSTED_BUTTON_ID_EXAMPLE_ONLY" />
          <a
            href="https://www.paypal.com/donate/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Having trouble? Open PayPal in a new tab
          </a>
          <p className="text-sm text-muted-foreground">
            Configure the hosted button ID via `hostedButtonId` or `VITE_PAYPAL_DONATE_HOSTED_BUTTON_ID`.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Render `PayPalDonateButton` as the primary donate action.</p>
            <p>- Add a small helper link below it that opens PayPal in a new tab — it must always be visible in JS and no-JS, and stay a helper, not a second full-size button fallback.</p>
            <p>- Production pages must provide a valid hosted button ID (`hostedButtonId` prop or `VITE_PAYPAL_DONATE_HOSTED_BUTTON_ID`).</p>
            <p>- Template/example pages may use a clearly labeled dummy ID only for visual documentation.</p>
            <p>- `env=&quot;sandbox&quot;` switches the PayPal SDK to sandbox mode for testing; default is `&quot;production&quot;`.</p>
            <p>- `onComplete`/`onError` callbacks are available for analytics/tracking hooks around the donation flow.</p>
            <p>- `imageSrc`/`imageAlt`/`imageTitle` override the default PayPal button graphic if a custom donate button image is needed.</p>
            <p>- If the SDK fails to load or config is missing, the component renders non-breaking fallback messaging rather than a blank area.</p>
            <p>- Component: `template/src/components/patterns/PayPalDonateButton.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default PayPalDonatePatternPage;
