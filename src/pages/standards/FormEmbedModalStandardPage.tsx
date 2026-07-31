import { useState } from "react";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import FormEmbedModal from "@/components/patterns/FormEmbedModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EXAMPLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScTemplateExampleGoogleForm/viewform?embedded=true";

const FormEmbedModalStandardPage = () => {
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <>
      <SEOHead
        title="FormEmbedModal Pattern"
        canonicalPath="/standards/form-embed-modal"
        description="Provider-agnostic form modal standard with JS and no-JS fallback requirements."
      />
      <PageHero
        eyebrow="Standards"
        title="FormEmbedModal pattern"
        description="Primary form CTAs should use the shared modal pattern instead of navigating directly to the provider form."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Standards" },
          { label: "FormEmbedModal Pattern" },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Example</h2>
          <p className="text-sm text-muted-foreground">
            The trigger is an anchor so no-JS fallback navigation still opens in a new tab. This component is
            provider-agnostic — swap in a JotForm, Google Forms, or any other iframe-embeddable form URL; the
            example below happens to use a Google Forms URL only because it's an easy one to demo live.
          </p>
          <div className="flex flex-col items-start gap-2">
            <FormEmbedModal
              formUrl={EXAMPLE_FORM_URL}
              title="Embedded Form Example"
              triggerClassName="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Open application
            </FormEmbedModal>
            <a
              href={EXAMPLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="js-only text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Having trouble? Open the application in a new tab
            </a>
            <noscript>
              <a href={EXAMPLE_FORM_URL} target="_blank" rel="noopener noreferrer">
                Open application
              </a>
            </noscript>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Controlled mode</h2>
          <p className="text-sm text-muted-foreground">
            Use controlled mode when page logic needs to open/close the form modal from non-anchor UI controls.
          </p>
          <Button type="button" variant="outline" onClick={() => setControlledOpen(true)}>
            Open modal from external trigger
          </Button>
          <FormEmbedModal
            formUrl={EXAMPLE_FORM_URL}
            title="Controlled Form Example"
            open={controlledOpen}
            onOpenChange={setControlledOpen}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- In-modal direct link ("Open in new tab") is required.</p>
            <p>- On-page helper link is required and must use `js-only`.</p>
            <p>- `{"<noscript>"}` direct-link fallback is required.</p>
            <p>- Modal trigger anchors must use `target="_blank"` + `rel="noopener noreferrer"`.</p>
            <p>- Modifier-key trigger clicks (Cmd/Ctrl/Shift/Alt) must preserve direct new-tab navigation.</p>
            <p>- Controlled mode (`open` + `onOpenChange`) is required for external trigger use cases.</p>
            <p>- No duplicate fallback links in no-JS mode.</p>
            <p>- `asButton` (default `true`) renders the trigger as a styled button; pass `false` with custom `children` to use your own trigger element.</p>
            <p>- `triggerVariant`/`triggerSize` (both default `&quot;default&quot;`) control button styling when `asButton` is used.</p>
            <p>- Standard helper text: `Having trouble? Open the application in a new tab`</p>
            <p>- Component: `template/src/components/patterns/FormEmbedModal.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default FormEmbedModalStandardPage;
