import PrintableImageSection from "@/components/patterns/PrintableImageSection";
import SEOHead from "@/components/patterns/SEOHead";
import sampleFlyer from "@/assets/flyers/adoption-fridays-flyer.svg";

const PrintableImagePage = () => {
  return (
    <>
      <SEOHead
        title="Printable Image"
        canonicalPath="/tools/printable-image"
        description="Print a supplied image (a certificate, sign, or flyer designed elsewhere) full-page — Printable Material Module example."
      />
      <PrintableImageSection
        imageSrc={sampleFlyer}
        imageAlt="Example flyer"
        orientation="portrait"
        printInstructions="Example only — swap imageSrc for a real image. Print on standard paper."
      />
    </>
  );
};

export default PrintableImagePage;
