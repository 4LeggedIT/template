import PageHero from "@/components/patterns/PageHero";
import PayPalDonateButton from "@/components/patterns/PayPalDonateButton";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PayPalDonateExamplePage = () => {
  return (
    <>
      <SEOHead
        title="PayPal Donate Example"
        canonicalPath="/examples/paypal-donate"
        description="PayPal donate button pattern with fallback helper link guidance."
      />
      <PageHero
        eyebrow="Examples"
        title="PayPal donate pattern"
        description="Use the shared PayPal donate component and always include a direct PayPal helper link below it."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Examples", href: "/examples" },
          { label: "PayPal Donate" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Donate button example</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <PayPalDonateButton
              className="max-w-md"
              hostedButtonId="DUMMY_HOSTED_BUTTON_ID_EXAMPLE_ONLY"
            />
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Validation checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- SDK load success renders the button in the container.</p>
            <p>- Missing config shows the component’s non-breaking fallback messaging.</p>
            <p>- Helper link always opens PayPal in a new tab and remains visible in JS/no-JS.</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default PayPalDonateExamplePage;
