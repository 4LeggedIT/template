import { useTranslation } from "react-i18next";
import MemorialSection, { type MemorialEntry } from "@/components/patterns/MemorialSection";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MemorialSectionStandardPage = () => {
  const { t } = useTranslation(["memorialSection", "common"]);

  const entries: MemorialEntry[] = [
    {
      id: "founder",
      name: t("memorialSection:entries.founder.name"),
      badge: t("memorialSection:entries.founder.badge"),
      photos: [
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80",
      ],
      message: [t("memorialSection:entries.founder.message")],
    },
    {
      id: "sweet-hops",
      name: t("memorialSection:entries.sweetHops.name"),
      dates: t("memorialSection:entries.sweetHops.dates"),
      photos: [
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=400&q=80",
      ],
      message: [
        t("memorialSection:entries.sweetHops.message1"),
        t("memorialSection:entries.sweetHops.message2"),
      ],
      closingLine: t("memorialSection:entries.sweetHops.closingLine"),
      externalHref: {
        label: t("memorialSection:entries.sweetHops.readReflection"),
        href: "https://example.org/reflection",
      },
    },
  ];

  return (
    <>
      <SEOHead
        title="Memorial Pattern"
        canonicalPath="/standards/memorial-section"
        description="An 'In Loving Memory' tribute pattern for animals who couldn't be saved."
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

        <Card>
          <CardHeader>
            <CardTitle>{t("memorialSection:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- {t("memorialSection:standard.noBlame")}</p>
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
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default MemorialSectionStandardPage;
