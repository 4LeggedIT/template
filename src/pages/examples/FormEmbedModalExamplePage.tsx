import { useState } from "react";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import FormEmbedModal from "@/components/patterns/FormEmbedModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScTemplateExampleGoogleForm/viewform?embedded=true";

const FormEmbedModalExamplePage = () => {
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <>
      <SEOHead
        title="Form Embed Modal Example"
        canonicalPath="/examples/form-embed-modal"
        description="Provider-agnostic form embed modal example using a Google Forms URL and standardized fallback links."
      />
      <PageHero
        eyebrow="Examples"
        title="FormEmbedModal (Google Forms example)"
        description="Provider-agnostic modal trigger pattern. The trigger is an anchor so no-JS fallback navigation still opens in a new tab."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Examples", href: "/examples" },
          { label: "Form Embed Modal" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Live example</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-start gap-2">
              <FormEmbedModal
                formUrl={GOOGLE_FORM_URL}
                title="Google Form Example"
                triggerClassName="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Open application
              </FormEmbedModal>
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="js-only text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Having trouble? Open the application in a new tab
              </a>
              <noscript>
                <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer">
                  Open application
                </a>
              </noscript>
            </div>
            <p className="text-sm text-muted-foreground">
              Replace the example Google Forms URL with the live provider URL. The same component is used for
              JotForm and other providers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Controlled mode example</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button type="button" variant="outline" onClick={() => setControlledOpen(true)}>
              Open modal from external trigger
            </Button>
            <p className="text-sm text-muted-foreground">
              Use controlled mode when page logic needs to open/close the form modal from non-anchor UI controls.
            </p>
            <FormEmbedModal
              formUrl={GOOGLE_FORM_URL}
              title="Controlled Google Form Example"
              open={controlledOpen}
              onOpenChange={setControlledOpen}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What to validate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- JS on: main CTA opens modal and the in-modal "Open in new tab" link works.</p>
            <p>- Cmd/Ctrl/Shift/Alt click on trigger opens form directly in a new tab.</p>
            <p>- JS off: trigger anchor opens the provider URL in a new tab (`target="_blank"` + `rel`).</p>
            <p>- Controlled mode works when modal is opened from external page state.</p>
            <p>- No duplicate fallback links in no-JS (helper link must be `js-only`, {"<noscript>"} remains).</p>
            <p>- Page-level helper text uses the standard wording exactly.</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default FormEmbedModalExamplePage;
