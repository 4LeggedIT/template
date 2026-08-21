import BusinessCardGenericSection from "@/components/patterns/BusinessCardGenericSection";
import SEOHead from "@/components/patterns/SEOHead";
import { printableDocExampleConfig } from "@/data/printable-doc-example-config";

const BusinessCardSimplePage = () => {
  return (
    <>
      <SEOHead
        title="Business Card (Simple)"
        canonicalPath="/tools/business-card-simple"
        description="Printable single-sided business card — Printable Material Module example."
      />
      <BusinessCardGenericSection config={printableDocExampleConfig} layout="simple" />
    </>
  );
};

export default BusinessCardSimplePage;
