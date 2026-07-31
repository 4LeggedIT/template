import AdoptableSlideshowSection from "@/components/patterns/AdoptableSlideshowSection";
import SEOHead from "@/components/patterns/SEOHead";
import { kennelExamplePets } from "@/data/kennel-example-pets";

const AdoptableSlideshowPage = () => {
  return (
    <>
      <SEOHead
        title="Adoptable Pets Slideshow"
        canonicalPath="/tools/adoptable-slideshow"
        description="Full-screen, auto-advancing slideshow of adoptable pets for kiosk or lobby display."
      />
      <AdoptableSlideshowSection
        pets={kennelExamplePets}
        orgName="Example Rescue"
        adoptUrl="https://example.org/adoptable-pets"
      />
    </>
  );
};

export default AdoptableSlideshowPage;
