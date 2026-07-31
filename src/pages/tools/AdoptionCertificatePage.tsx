import AdoptionCertificateSection from "@/components/patterns/AdoptionCertificateSection";
import SEOHead from "@/components/patterns/SEOHead";
import { printableDocExampleConfig } from "@/data/printable-doc-example-config";

const AdoptionCertificatePage = () => {
  return (
    <>
      <SEOHead
        title="Certificate of Adoption"
        canonicalPath="/tools/adoption-certificate"
        description="Printable certificate of adoption — Printable Material Module example."
      />
      <AdoptionCertificateSection config={printableDocExampleConfig} />
    </>
  );
};

export default AdoptionCertificatePage;
