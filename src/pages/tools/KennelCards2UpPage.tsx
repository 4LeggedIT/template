import KennelCards2UpSection from "@/components/patterns/KennelCards2UpSection";
import SEOHead from "@/components/patterns/SEOHead";
import { kennelExamplePets } from "@/data/kennel-example-pets";

const KennelCards2UpPage = () => {
  return (
    <>
      <SEOHead
        title="Kennel Cards (2-Up)"
        canonicalPath="/tools/kennel-cards-2up"
        description="Print tool: fill in or load two dogs from the manifest and print both kennel cards on one letter page."
      />
      <KennelCards2UpSection
        pets={kennelExamplePets}
        orgName="Example Rescue"
        adoptUrl="https://example.org/adoptable-pets"
      />
    </>
  );
};

export default KennelCards2UpPage;
