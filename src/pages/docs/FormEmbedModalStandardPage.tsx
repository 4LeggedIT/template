import { Link } from "react-router-dom";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FormEmbedModalStandardPage = () => {
  return (
    <>
      <SEOHead
        title="FormEmbedModal Standard"
        canonicalPath="/docs/standards/form-embed-modal"
        description="Provider-agnostic form modal standard with JS and no-JS fallback requirements."
      />
      <PageHero
        eyebrow="Docs"
        title="FormEmbedModal standard"
        description="Primary form CTAs should use the shared modal pattern instead of navigating directly to the provider form."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "FormEmbedModal Standard" },
        ]}
      />
      <section className="container space-y-6 px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Required behavior</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- In-modal direct link ("Open in new tab") is required.</p>
            <p>- On-page helper link is required and must use `js-only`.</p>
            <p>- `{"<noscript>"}` direct-link fallback is required.</p>
            <p>- Modal trigger anchors must use `target="_blank"` + `rel="noopener noreferrer"`.</p>
            <p>- Modifier-key trigger clicks (Cmd/Ctrl/Shift/Alt) must preserve direct new-tab navigation.</p>
            <p>- Controlled mode (`open` + `onOpenChange`) is required for external trigger use cases.</p>
            <p>- No duplicate fallback links in no-JS mode.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Standard helper text</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>`Having trouble? Open the application in a new tab`</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>References</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              - Live example (Google Forms):{" "}
              <Link className="underline underline-offset-4" to="/examples/form-embed-modal">
                FormEmbedModal example page
              </Link>
            </p>
            <p>- Component: `template/src/components/patterns/FormEmbedModal.tsx`</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default FormEmbedModalStandardPage;
