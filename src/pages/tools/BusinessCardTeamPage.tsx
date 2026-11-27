import BusinessCardTeamSection from "@/components/patterns/BusinessCardTeamSection";
import SEOHead from "@/components/patterns/SEOHead";
import { printableDocExampleConfig } from "@/data/printable-doc-example-config";

const BusinessCardTeamPage = () => {
  return (
    <>
      <SEOHead
        title="Business Card (Team)"
        canonicalPath="/tools/business-card-team"
        description="Printable team-member business cards with a per-member contact QR — Printable Material Module example."
      />
      <BusinessCardTeamSection config={printableDocExampleConfig} />
    </>
  );
};

export default BusinessCardTeamPage;
