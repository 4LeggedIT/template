import { useState } from "react";
import { useTranslation } from "react-i18next";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import FormEmbedModal from "@/components/patterns/FormEmbedModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EXAMPLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScTemplateExampleGoogleForm/viewform?embedded=true";

const FormEmbedModalStandardPage = () => {
  const { t } = useTranslation(["formEmbedModal", "common"]);
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <>
      <SEOHead
        title="FormEmbedModal Pattern"
        canonicalPath="/standards/form-embed-modal"
        description="Provider-agnostic form modal standard with JS and no-JS fallback requirements."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("formEmbedModal:hero.title")}
        description={t("formEmbedModal:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("formEmbedModal:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("formEmbedModal:example.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("formEmbedModal:example.description")}</p>
          <div className="flex flex-col items-start gap-2">
            <FormEmbedModal
              formUrl={EXAMPLE_FORM_URL}
              title={t("formEmbedModal:example.modalTitle")}
              triggerClassName="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {t("formEmbedModal:example.openApplication")}
            </FormEmbedModal>
            <a
              href={EXAMPLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="js-only text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              {t("formEmbedModal:example.helperLink")}
            </a>
            <noscript>
              <a href={EXAMPLE_FORM_URL} target="_blank" rel="noopener noreferrer">
                {t("formEmbedModal:example.openApplication")}
              </a>
            </noscript>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("formEmbedModal:controlled.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("formEmbedModal:controlled.description")}</p>
          <Button type="button" variant="outline" onClick={() => setControlledOpen(true)}>
            {t("formEmbedModal:controlled.buttonLabel")}
          </Button>
          <FormEmbedModal
            formUrl={EXAMPLE_FORM_URL}
            title={t("formEmbedModal:controlled.modalTitle")}
            open={controlledOpen}
            onOpenChange={setControlledOpen}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("formEmbedModal:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("formEmbedModal:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default FormEmbedModalStandardPage;
