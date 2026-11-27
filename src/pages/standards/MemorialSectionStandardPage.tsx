import { useTranslation } from "react-i18next";
import MemorialSection, { type MemorialEntry } from "@/components/patterns/MemorialSection";
import StandardSnippet from "@/components/StandardSnippet";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { exampleImages } from "@/data/examples/images";
import { buildExampleSnippet } from "@/lib/example-snippet";
import CollapsibleSection from "@/components/standards/CollapsibleSection";

const MemorialSectionStandardPage = () => {
  const { t } = useTranslation(["memorialSection", "common"]);

  const entries: MemorialEntry[] = [
    {
      id: "founder",
      name: t("memorialSection:entries.founder.name"),
      badge: t("memorialSection:entries.founder.badge"),
      photos: [ exampleImages.hudson,
      ],
      message: [t("memorialSection:entries.founder.message")],
    },
    {
      id: "cooper",
      name: t("memorialSection:entries.cooper.name"),
      dates: t("memorialSection:entries.cooper.dates"),
      photos: [ exampleImages.cooper,
      ],
      message: [
        t("memorialSection:entries.cooper.message1"),
        t("memorialSection:entries.cooper.message2"),
      ],
      closingLine: t("memorialSection:entries.cooper.closingLine"),
      externalHref: {
        label: t("memorialSection:entries.cooper.readReflection"),
        href: "https://example.org/reflection",
      },
    },
  ];

  const snippetExample = buildExampleSnippet({
    component: "MemorialSection",
    props: { entries },
  });

  return (
    <>
      <SEOHead
        title="Memorial Pattern"
        canonicalPath="/standards/memorial-section"
        description="An 'In Loving Memory' tribute pattern for animals who couldn't be saved, giving each one a respectful place on the rescue's website."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("memorialSection:hero.title")}
        description={t("memorialSection:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("memorialSection:breadcrumb") },
        ]}
      />

      <section className="container space-y-10 px-4 py-10">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("memorialSection:sections.example.title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("memorialSection:sections.example.description")}
          </p>

          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <MemorialSection entries={entries} />
            </CardContent>
          </Card>
        </div>

        <StandardSnippet code={snippetExample} />

        <CollapsibleSection card title={t("memorialSection:standard.title")}>
          <div className="space-y-2 break-words text-sm text-muted-foreground">
            <p>
              - {t("memorialSection:standard.emptyPhotos.before")} <code>photos</code>{" "}
              {t("memorialSection:standard.emptyPhotos.after")}
            </p>
            <p>
              - {t("memorialSection:standard.emptyState.before")} <code>entries</code>{" "}
              {t("memorialSection:standard.emptyState.after")}{" "}
              <code>{t("memorialSection:standard.emptyState.emptyMessageWord")}</code>.
            </p>
            <p>
              - {t("memorialSection:standard.import.before")} <code>data/memorials.ts</code>{" "}
              {t("memorialSection:standard.import.after")}{" "}
              <code>{t("memorialSection:standard.import.typeWord")}</code>{" "}
              {t("memorialSection:standard.import.fromWord")}{" "}
              <code>{t("memorialSection:standard.import.componentPath")}</code>{" "}
              {t("memorialSection:standard.import.never")}
            </p>
            <p>- {t("memorialSection:standard.oneTemplate")}</p>
            <p>- {t("memorialSection:standard.component")}</p>
          </div>
        </CollapsibleSection>
      </section>
    </>
  );
};

export default MemorialSectionStandardPage;
