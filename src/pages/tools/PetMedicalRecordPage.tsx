import PetMedicalRecordSection from "@/components/patterns/PetMedicalRecordSection";
import SEOHead from "@/components/patterns/SEOHead";
import { printableDocExampleConfig } from "@/data/printable-doc-example-config";

const PetMedicalRecordPage = () => {
  return (
    <>
      <SEOHead
        title="Pet Medical Record"
        canonicalPath="/tools/pet-medical-record"
        description="Printable pet medical record — Printable Material Module example."
      />
      <PetMedicalRecordSection config={printableDocExampleConfig} />
    </>
  );
};

export default PetMedicalRecordPage;
