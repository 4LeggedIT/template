import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageHero from "@/components/patterns/PageHero";
import SEOHead from "@/components/patterns/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tools = [
  {
    key: "documentsIndex",
    href: "/tools/documents-index",
    component: "DocumentsIndexSection.tsx",
  },
  {
    key: "adoptionCertificate",
    href: "/tools/adoption-certificate",
    component: "AdoptionCertificateSection.tsx",
  },
  {
    key: "petMedicalRecord",
    href: "/tools/pet-medical-record",
    component: "PetMedicalRecordSection.tsx",
  },
  {
    key: "businessCardSimple",
    href: "/tools/business-card-simple",
    component: "BusinessCardGenericSection.tsx (layout=\"simple\")",
  },
  {
    key: "businessCardGeneric",
    href: "/tools/business-card-generic",
    component: "BusinessCardGenericSection.tsx (layout=\"generic\")",
  },
  {
    key: "businessCardTeam",
    href: "/tools/business-card-team",
    component: "BusinessCardTeamSection.tsx",
  },
];

const DocumentsStandardPage = () => {
  const { t } = useTranslation(["documents", "common"]);

  return (
    <>
      <SEOHead
        title="Documents / Printable Material Pattern"
        canonicalPath="/standards/documents"
        description="Standalone, full-viewport print-ready documents for animal-rescue sites — adoption certificate, medical record, and a generic document wrapper."
      />
      <PageHero
        eyebrow={t("common:nav.standards")}
        title={t("documents:hero.title")}
        description={t("documents:hero.description")}
        breadcrumbs={[
          { label: t("common:nav.home"), href: "/" },
          { label: t("common:nav.standards") },
          { label: t("documents:breadcrumb") },
        ]}
      />

      <section className="container space-y-6 px-4 py-10">
        <div className="grid gap-4 md:grid-cols-2">
          {tools.map((tool) => (
            <Card key={tool.href}>
              <CardHeader>
                <CardTitle className="text-lg">{t(`documents:tools.${tool.key}.title`)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{t(`documents:tools.${tool.key}.description`)}</p>
                <Link className="text-sm underline underline-offset-4" to={tool.href}>
                  {t("documents:openLiveExample")}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("documents:standard.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {(t("documents:standard.items", { returnObjects: true }) as string[]).map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default DocumentsStandardPage;
