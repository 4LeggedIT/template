import KennelCards2UpSection from "@/components/patterns/KennelCards2UpSection";
import { kennelExamplePets } from "@/data/kennel-example-pets";

const KennelCards2UpExamplePage = () => {
  return (
    <KennelCards2UpSection
      pets={kennelExamplePets}
      orgName="Example Rescue"
      adoptUrl="https://example.org/adoptable-pets"
    />
  );
};

export default KennelCards2UpExamplePage;
