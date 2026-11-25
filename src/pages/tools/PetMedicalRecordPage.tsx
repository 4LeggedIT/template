import PetMedicalRecordSection from "@/components/patterns/PetMedicalRecordSection";
import SEOHead from "@/components/patterns/SEOHead";
import { printableDocExampleConfig } from "@/data/printable-doc-example-config";

const PetMedicalRecordPage = () => {
  return (
    <>
      <SEOHead
        title="Pet Medical Record"
        canonicalPath="/tools/pet-medical-record"
        description="Printable pet medical record — Printable Material Module example, a one-page form for vaccines, treatments, and vet visit notes."
      />
      <PetMedicalRecordSection config={printableDocExampleConfig} />
    </>
  );
};

export default PetMedicalRecordPage;
