import "@/styles/documents.css";
import type { PrintableDocConfig } from "@/components/patterns/printable-doc-config";
import PrintPageHeader from "@/components/patterns/PrintPageHeader";

const Field = ({ label, wide = false }: { label: string; wide?: boolean }) => (
  <div className={wide ? "med-field med-field-wide" : "med-field"}>
    <div className="med-line"></div>
    <div className="med-label">{label}</div>
  </div>
);

const Check = ({ label }: { label: string }) => (
  <label className="med-check"><span></span>{label}</label>
);

const Panel = ({ title, children, cover = false }: { title?: string; children: React.ReactNode; cover?: boolean }) => (
  <section className={cover ? "med-panel med-cover-panel" : "med-panel"}>
    {title ? <div className="med-panel-title">{title}</div> : null}
    {children}
  </section>
);

const MedicalTable = ({ headers, rows }: { headers: string[]; rows: number }) => (
  <table className="med-table">
    <thead>
      <tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr>
    </thead>
    <tbody>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index}>{headers.map((header) => <td key={header}></td>)}</tr>
      ))}
    </tbody>
  </table>
);

const Page = ({ children }: { children: React.ReactNode }) => (
  <section className="doc-page med-trifold-page">
    <div className="med-trifold-grid">{children}</div>
  </section>
);

type PetMedicalRecordSectionProps = {
  config: PrintableDocConfig;
  revisionDate?: string;
};

const PetMedicalRecordSection = ({ config, revisionDate }: PetMedicalRecordSectionProps) => {
  const { orgName, logoSrc, contact } = config;
  const cleanUrl = contact.website.replace(/^https?:\/\//, "");

  return (
    <div className="doc-body pet-medical-record-doc">
      <style>{`
        @page { size: letter landscape; margin: 0.28in; }

        .pet-medical-record-doc {
          background: #f5ece3;
          color: var(--doc-dark, hsl(212,30%,20%));
          font-family: 'Segoe UI', system-ui, Arial, sans-serif;
        }

        .med-print-actions {
          align-items: center;
          color: var(--doc-gray, hsl(212,15%,45%));
          display: flex;
          font-size: 9pt;
          gap: 10px;
          margin: 20px auto -8px;
          max-width: 11in;
        }

        .med-trifold-page {
          box-sizing: border-box;
          height: 8in;
          max-width: 11in;
          padding: 0.24in;
          position: relative;
          width: 10.44in;
        }

        .med-trifold-page {
          break-after: page;
          page-break-after: always;
        }

        .med-trifold-page:last-child {
          break-after: auto;
          page-break-after: auto;
        }

        .med-trifold-grid {
          display: grid;
          gap: 0;
          grid-template-columns: repeat(3, 1fr);
          height: 100%;
        }

        .med-panel {
          border-left: 1px dashed var(--doc-border, hsl(30,20%,84%));
          display: flex;
          flex-direction: column;
          gap: 0.08in;
          padding: 0.12in 0.16in 0.08in;
          position: relative;
        }

        .med-panel:first-child { border-left: 0; }

        .med-cover-panel {
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .med-logo {
          height: 0.75in;
          object-fit: contain;
          width: auto;
        }

        .med-cover-title {
          color: var(--doc-primary, hsl(10,42%,58%));
          font-size: 25pt;
          font-weight: 850;
          letter-spacing: 0;
          line-height: 1.05;
          margin: 0.08in 0 0;
        }

        .med-cover-copy {
          color: var(--doc-gray, hsl(212,15%,45%));
          font-size: 8.3pt;
          line-height: 1.35;
          margin: 0;
        }

        .med-panel-title {
          background: var(--doc-primary, hsl(10,42%,58%));
          color: #fff;
          font-size: 7.2pt;
          font-weight: 850;
          letter-spacing: 0.08em;
          line-height: 1.2;
          padding: 4px 7px;
          text-transform: uppercase;
        }

        .med-field-grid {
          display: grid;
          gap: 0.07in 0.09in;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .med-field-grid-single {
          display: grid;
          gap: 0.07in;
        }

        .med-field-wide { grid-column: 1 / -1; }

        .med-line {
          border-bottom: 1.4px solid var(--doc-dark, hsl(212,30%,20%));
          height: 0.18in;
        }

        .med-label {
          color: var(--doc-gray, hsl(212,15%,45%));
          font-size: 6.8pt;
          font-weight: 800;
          letter-spacing: 0.03em;
          margin-top: 2px;
          text-transform: uppercase;
        }

        .med-check-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.05in 0.1in;
          justify-content: center;
        }

        .med-check {
          align-items: center;
          color: var(--doc-dark, hsl(212,30%,20%));
          display: inline-flex;
          font-size: 8pt;
          font-weight: 700;
          gap: 4px;
          white-space: nowrap;
        }

        .med-check span {
          border: 1.2px solid var(--doc-dark, hsl(212,30%,20%));
          display: inline-block;
          height: 10px;
          width: 10px;
        }

        .med-contact-card {
          background: hsl(30, 45%, 97%);
          border: 1px solid var(--doc-border, hsl(30,20%,84%));
          border-radius: 4px;
          color: var(--doc-dark, hsl(212,30%,20%));
          font-size: 8pt;
          line-height: 1.35;
          padding: 0.08in;
        }

        .med-contact-card strong {
          color: var(--doc-primary, hsl(10,42%,58%));
          display: block;
          font-size: 8.2pt;
          margin-bottom: 2px;
        }

        .med-emergency-note {
          background: hsl(30, 55%, 96%);
          border-left: 4px solid var(--doc-accent, hsl(30,50%,64%));
          color: var(--doc-dark, hsl(212,30%,20%));
          font-size: 8pt;
          font-weight: 700;
          line-height: 1.35;
          padding: 0.08in;
          text-align: left;
        }

        .med-emergency-contact {
          border-top: 1px solid var(--doc-border, hsl(30,20%,84%));
          color: var(--doc-dark, hsl(212,30%,20%));
          font-size: 7.8pt;
          font-weight: 700;
          line-height: 1.35;
          margin-top: 0.07in;
          padding-top: 0.06in;
        }

        .med-emergency-contact strong {
          color: var(--doc-primary, hsl(10,42%,58%));
          display: block;
          font-size: 8.2pt;
        }

        .med-table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
        }

        .med-table th {
          background: var(--doc-primary-light, hsl(30,45%,90%));
          border: 1px solid var(--doc-border, hsl(30,20%,84%));
          color: var(--doc-dark, hsl(212,30%,20%));
          font-size: 6.4pt;
          line-height: 1.15;
          padding: 3px;
          text-align: left;
        }

        .med-table td {
          border: 1px solid var(--doc-border, hsl(30,20%,84%));
          height: 0.25in;
        }

        .med-note-box {
          border: 1px solid var(--doc-border, hsl(30,20%,84%));
          border-radius: 4px;
          flex: 1;
          min-height: 0.48in;
        }

        .med-small-copy {
          color: var(--doc-gray, hsl(212,15%,45%));
          font-size: 7pt;
          line-height: 1.3;
          margin: 0;
        }

        .med-footer {
          border-top: 1px solid var(--doc-border, hsl(30,20%,84%));
          color: var(--doc-gray, hsl(212,15%,45%));
          font-size: 6.8pt;
          margin-top: auto;
          padding-top: 0.05in;
        }

        @media print {
          .pet-medical-record-doc {
            background: #fff;
            min-height: 0;
          }

          .pet-medical-record-doc .doc-page {
            box-shadow: none;
            margin: 0;
            max-width: 100%;
          }

          .med-trifold-page {
            height: 7.94in;
            width: 10.44in;
          }
        }
      `}</style>

      <PrintPageHeader
        buttonLabel="Print Medical Record"
        instructions="Print double-sided on Letter landscape, then fold into thirds."
      />

      <Page>
        <Panel title="Contact & Emergency">
          <div className="med-field-grid-single">
            <Field label="Owner / foster name" />
            <Field label="Primary phone" />
            <Field label="Alternate phone" />
            <Field label="Email" />
          </div>
          <div className="med-field-grid-single">
            <Field label="Primary vet / clinic" />
            <Field label="Vet phone" />
            <Field label="Emergency vet" />
            <Field label="Emergency vet phone" />
          </div>
        </Panel>

        <Panel title="Quick Profile">
          <div className="med-field-grid">
            <Field label="Breed / mix" wide />
            <Field label="Color / markings" wide />
            <Field label="DOB / age" />
            <Field label="Weight" />
            <Field label="Sex" />
            <Field label="License / tag #" />
            <Field label="Microchip #" wide />
          </div>
          <div className="med-check-row" style={{ justifyContent: "flex-start" }}>
            <Check label="Spayed / neutered" />
            <Check label="Not yet" />
          </div>
          <p className="med-small-copy">
            Keep this record with adoption paperwork, vaccine receipts, and medication instructions.
          </p>
          {revisionDate ? <div className="med-footer">Pet Medical Record - Rev. {revisionDate}</div> : null}
        </Panel>

        <Panel cover>
          <img src={logoSrc} alt={orgName} className="med-logo" />
          <h1 className="med-cover-title">Pet Medical Record</h1>
          <p className="med-cover-copy">A compact health and care reference for dogs, cats, and other pets.</p>
          <div className="med-field-grid-single" style={{ width: "100%", marginTop: "0.08in" }}>
            <Field label="Pet name" />
          </div>
          <div className="med-check-row">
            <Check label="Dog" />
            <Check label="Cat" />
            <Check label="Other" />
          </div>
          <div className="med-emergency-note">
            In an emergency, contact the pet's veterinary clinic first. If this pet is in foster care, notify {orgName} as soon as possible.
            <div className="med-emergency-contact">
              <strong>{orgName}</strong>
              {contact.phoneDisplay ? <>{contact.phoneDisplay}<br /></> : null}
              {contact.email ? <>{contact.email}<br /></> : null}
              {cleanUrl}
            </div>
          </div>
        </Panel>
      </Page>

      <Page>
        <Panel title="Vaccination Record">
          <MedicalTable
            headers={["Date", "Vaccine / care", "Provider", "Next due"]}
            rows={8}
          />
          <p className="med-small-copy">
            Common entries: Rabies, DHPP, Bordetella, FVRCP, deworming, flea/tick prevention, heartworm prevention, wellness exam.
          </p>
        </Panel>

        <Panel title="Medication & Conditions">
          <div className="med-field-grid-single">
            <Field label="Allergies" />
            <Field label="Medical conditions" />
            <Field label="Medication name" />
            <Field label="Dose / schedule" />
            <Field label="Prescribing vet" />
          </div>
          <div className="med-panel-title" style={{ marginTop: "0.02in" }}>Instructions</div>
          <div className="med-note-box"></div>
        </Panel>

        <Panel title="Visit Notes">
          <MedicalTable
            headers={["Date", "Clinic / provider", "Reason", "Follow-up"]}
            rows={7}
          />
          <div className="med-panel-title" style={{ marginTop: "0.04in" }}>Notes</div>
          <div className="med-note-box"></div>
        </Panel>
      </Page>
    </div>
  );
};

export default PetMedicalRecordSection;
