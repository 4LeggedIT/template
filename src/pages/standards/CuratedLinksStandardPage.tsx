import { useTranslation } from "react-i18next";
import CuratedLinksSection, { type CuratedLinkItem } from "@/components/patterns/CuratedLinksSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CuratedLinksStandardPage = () => {
  const { t } = useTranslation(["curatedLinks", "common"]);

  const sampleItems: CuratedLinkItem[] = [
    {
      id: "first",
      title: t("curatedLinks:example.items.first.title"),
      summary: t("curatedLinks:example.items.first.summary"),
      sourceName: t("curatedLinks:example.items.first.sourceName"),
      topic: t("curatedLinks:example.items.first.topic"),
      href: "https://example.org/first-post",
    },
    {
      id: "second",
      title: t("curatedLinks:example.items.second.title"),
      summary: t("curatedLinks:example.items.second.summary"),
      sourceName: t("curatedLinks:example.items.second.sourceName"),
      topic: t("curatedLinks:example.items.second.topic"),
      href: "https://example.org/second-post",
    },
  ];

  return (
    <>
      <SEOHead
        title="Curated Links Pattern"
        canonicalPath="/standards/curated-links"
        description="Standardized pattern for linking out to other people's work, credited and uncopied, as a section of cards."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("curatedLinks:hero.title")}
        description={t("curatedLinks:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("curatedLinks:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("curatedLinks:example.title")}</h2>
          <CuratedLinksSection
            title={t("curatedLinks:example.sectionTitle")}
            description={t("curatedLinks:example.sectionDescription")}
            items={sampleItems}
            labels={{
              opensInNewTab: t("curatedLinks:example.opensInNewTab"),
              allLabel: t("curatedLinks:example.allLabel"),
              sourcePrefix: t("curatedLinks:example.sourcePrefix"),
            }}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("curatedLinks:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("curatedLinks:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default CuratedLinksStandardPage;
