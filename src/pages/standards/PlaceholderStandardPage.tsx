// drafts:ignore-file — this page renders <Placeholder>/<PlaceholderSection> on purpose,
// as live examples. `npm run drafts` must not report them as unconfirmed site copy.
import { useTranslation } from "react-i18next";
import PageHero from "@/components/patterns/PageHero";
import Placeholder from "@/components/patterns/Placeholder";
import PlaceholderSection from "@/components/patterns/PlaceholderSection";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PlaceholderStandardPage = () => {
  const { t } = useTranslation(["placeholder", "common"]);

  const list = (key: string) =>
    (t(key, { returnObjects: true }) as string[]).map((item) => <p key={item}>- {item}</p>);

  return (
    <>
      <SEOHead
        title="Placeholder Markers Pattern"
        canonicalPath="/standards/placeholder"
        description="Shared markers for drafted-but-unconfirmed copy and for sections only the site owner can supply, visible in production until confirmed."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("placeholder:hero.title")}
        description={t("placeholder:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("placeholder:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="max-w-3xl space-y-3">
          <h2 className="text-lg font-semibold">{t("placeholder:sections.inline.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("placeholder:sections.inline.description")}</p>
          <div className="rounded-2xl border bg-card p-6">
            <p className="text-lg leading-relaxed">
              {t("placeholder:examples.inline.before")}{" "}
              <Placeholder note={t("placeholder:examples.inline.note")}>
                {t("placeholder:examples.inline.drafted")}
              </Placeholder>
            </p>
          </div>
        </div>

        <div className="max-w-3xl space-y-3">
          <h2 className="text-lg font-semibold">{t("placeholder:sections.label.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("placeholder:sections.label.description")}</p>
          <div className="rounded-2xl border bg-card p-6">
            <p className="text-lg leading-relaxed">
              <Placeholder label="borrador" note={t("placeholder:examples.label.note")}>
                {t("placeholder:examples.label.drafted")}
              </Placeholder>
            </p>
          </div>
        </div>

        <div className="max-w-3xl space-y-3">
          <h2 className="text-lg font-semibold">{t("placeholder:sections.section.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("placeholder:sections.section.description")}</p>
          <div className="rounded-2xl border bg-card p-6">
            <PlaceholderSection
              title={t("placeholder:examples.section.title")}
              publicText={t("placeholder:examples.section.publicText")}
              why={t("placeholder:examples.section.why")}
            >
              <p>{t("placeholder:examples.section.ask")}</p>
            </PlaceholderSection>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("placeholder:whenToUse.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">{list("placeholder:whenToUse.items")}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("placeholder:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">{list("placeholder:standard.items")}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("placeholder:lifecycle.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">{list("placeholder:lifecycle.items")}</CardContent>
        </Card>
      </section>
    </>
  );
};

export default PlaceholderStandardPage;
