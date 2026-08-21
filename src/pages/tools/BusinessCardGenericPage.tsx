import BusinessCardGenericSection from "@/components/patterns/BusinessCardGenericSection";
import SEOHead from "@/components/patterns/SEOHead";
import { printableDocExampleConfig } from "@/data/printable-doc-example-config";

const BusinessCardGenericPage = () => {
  return (
    <>
      <SEOHead
        title="Business Card (Generic)"
        canonicalPath="/tools/business-card-generic"
        description="Printable front-and-back business cards — Printable Material Module example."
      />
      <BusinessCardGenericSection config={printableDocExampleConfig} layout="generic" />
    </>
  );
};

export default BusinessCardGenericPage;
