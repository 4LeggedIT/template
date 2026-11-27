import { useTranslation } from "react-i18next";
import StandardSnippet from "@/components/StandardSnippet";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import GivebutterWidget from "@/components/patterns/GivebutterWidget";
import CollapsibleSection from "@/components/standards/CollapsibleSection";

const snippetExample = `import GivebutterWidget from "@/components/patterns/GivebutterWidget";

<GivebutterWidget
  widgetId="your-widget-id"
  accountId="your-account-id"
  campaignUrl="https://givebutter.com/your-campaign"
/>`;

const GivebutterPatternPage = () => {
  const { t } = useTranslation(["givebutter", "common"]);

  return (
    <>
      <SEOHead
        title="Givebutter Pattern"
        canonicalPath="/standards/givebutter"
        description="Givebutter campaign widget standard and no-JS-safe fallback guidance, so donors always have a working link even if the widget cannot load."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("givebutter:hero.title")}
        description={t("givebutter:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("givebutter:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("givebutter:example.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("givebutter:example.description")}</p>
          <GivebutterWidget
            className="max-w-md"
            widgetId="DUMMY-WIDGET-ID-EXAMPLE-ONLY"
            accountId="DUMMY-ACCOUNT-ID-EXAMPLE-ONLY"
            campaignUrl="https://givebutter.com/example-campaign"
          />
          <p className="text-sm text-muted-foreground">{t("givebutter:example.configNote")}</p>
        </div>

        <StandardSnippet code={snippetExample} />

        <CollapsibleSection card title={t("givebutter:standard.title")}>
          <div className="space-y-2 break-words text-sm text-muted-foreground">
            {(t("givebutter:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </div>
        </CollapsibleSection>
      </section>
    </>
  );
};

export default GivebutterPatternPage;
