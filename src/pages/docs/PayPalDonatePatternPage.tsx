import { Link } from "react-router-dom";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PayPalDonatePatternPage = () => {
  return (
    <>
      <SEOHead
        title="PayPal Donate Pattern"
        canonicalPath="/docs/standards/paypal-donate"
        description="PayPal donate button standard and fallback helper link guidance."
      />
      <PageHero
        eyebrow="Docs"
        title="PayPal donate pattern"
        description="Use the shared PayPal donate component plus a direct-link helper for popup/SKD failure cases."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "PayPal Donate Pattern" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Render `PayPalDonateButton` as the primary donate action.</p>
            <p>- Add a small helper link below it that opens PayPal in a new tab.</p>
            <p>- Avoid a second full-size button fallback.</p>
            <p>- Production pages must provide a valid hosted button ID (`hostedButtonId` prop or `VITE_PAYPAL_DONATE_HOSTED_BUTTON_ID`).</p>
            <p>- Template/example pages may use a clearly labeled dummy ID only for visual documentation.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reference</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              - Live example:{" "}
              <Link className="underline underline-offset-4" to="/examples/paypal-donate">
                PayPal donate example page
              </Link>
            </p>
            <p>- Component: `template/src/components/patterns/PayPalDonateButton.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default PayPalDonatePatternPage;
