import KennelBinder2UpSection from "@/components/patterns/KennelBinder2UpSection";
import { kennelExamplePets } from "@/data/kennel-example-pets";

const KennelBinder2UpExamplePage = () => {
  return (
    <KennelBinder2UpSection
      pets={kennelExamplePets}
      orgName="Example Rescue"
      orgTagline="Every Animal Deserves a Home"
      adoptUrl="https://example.org/adoptable-pets"
    />
  );
};

export default KennelBinder2UpExamplePage;
