import KennelBinder2UpSection from "@/components/patterns/KennelBinder2UpSection";
import SEOHead from "@/components/patterns/SEOHead";
import { kennelExamplePets } from "@/data/kennel-example-pets";

const KennelBinder2UpPage = () => {
  return (
    <>
      <SEOHead
        title="Kennel Binder Cards (2-Up)"
        canonicalPath="/tools/kennel-binder-2up"
        description="Print tool: choose two dogs and print a single letter page with two kennel binder cards side by side."
      />
      <KennelBinder2UpSection
        pets={kennelExamplePets}
        orgName="Example Rescue"
        orgTagline="Every Animal Deserves a Home"
        adoptUrl="https://example.org/adoptable-pets"
      />
    </>
  );
};

export default KennelBinder2UpPage;
