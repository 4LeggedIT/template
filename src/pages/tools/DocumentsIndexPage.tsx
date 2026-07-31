import DocumentsIndexSection from "@/components/patterns/DocumentsIndexSection";
import SEOHead from "@/components/patterns/SEOHead";
import { printableDocExampleConfig } from "@/data/printable-doc-example-config";

const DocumentsIndexPage = () => {
  return (
    <>
      <SEOHead
        title="Documents"
        canonicalPath="/tools/documents-index"
        description="Printable documents index — Printable Material Module example."
      />
      <DocumentsIndexSection
        orgName={printableDocExampleConfig.orgName}
        logoSrc={printableDocExampleConfig.logoSrc}
        groups={[
          {
            title: "Printable Materials",
            items: [
              { label: "Certificate of Adoption", to: "/tools/adoption-certificate" },
              { label: "Pet Medical Record", to: "/tools/pet-medical-record" },
            ],
          },
        ]}
      />
    </>
  );
};

export default DocumentsIndexPage;
