import AdoptableSlideshowSection from "@/components/patterns/AdoptableSlideshowSection";
import { kennelExamplePets } from "@/data/kennel-example-pets";

const AdoptableSlideshowExamplePage = () => {
  return (
    <AdoptableSlideshowSection
      pets={kennelExamplePets}
      orgName="Example Rescue"
      adoptUrl="https://example.org/adoptable-pets"
    />
  );
};

export default AdoptableSlideshowExamplePage;
