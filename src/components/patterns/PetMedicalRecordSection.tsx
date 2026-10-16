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

const StickerTable = ({ rows }: { rows: number }) => (
  <table className="med-table med-sticker-table">
    <thead>
      <tr>
        <th>Vaccine sticker</th>
        <th>Given / next due</th>
      </tr>
    </thead>
    <tbody>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index}>
          <td></td>
          <td>
            <div className="med-sticker-date">Given</div>
            <div className="med-sticker-date">Due</div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const DateGrid = ({ rows, columns = 3 }: { rows: number; columns?: number }) => (
  <div className="med-date-grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
    {Array.from({ length: rows * columns }).map((_, index) => (
      <div key={index} className="med-date-cell">Date</div>
    ))}
  </div>
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
          background: #fff;
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
          background: var(--doc-primary-light, hsl(30, 45%, 97%));
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
          background: var(--doc-primary-light, hsl(30, 55%, 96%));
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

        .med-sticker-table { table-layout: fixed; }
        .med-sticker-table th:first-child { width: 2.05in; }
        .med-sticker-table tr { break-inside: avoid; page-break-inside: avoid; }
        .med-sticker-table td { height: 1.05in; padding: 0; vertical-align: top; }
        .med-sticker-date {
          border-bottom: 1px dotted var(--doc-gray, hsl(212,15%,45%));
          color: var(--doc-gray, hsl(212,15%,45%));
          font-size: 6.4pt;
          height: 0.5in;
          padding: 3px;
        }

        .med-date-grid {
          display: grid;
          gap: 0 0.1in;
        }

        .med-date-cell {
          border-bottom: 1px dotted var(--doc-gray, hsl(212,15%,45%));
          color: var(--doc-gray, hsl(212,15%,45%));
          font-size: 6.8pt;
          font-weight: 800;
          height: 0.36in;
          line-height: 0.2in;
        }

        .med-note-lined {
          background-image: repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent calc(0.32in - 1px),
            var(--doc-border, hsl(30,20%,84%)) calc(0.32in - 1px),
            var(--doc-border, hsl(30,20%,84%)) 0.32in
          );
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
        <Panel title="Pets Information">
          <div className="med-field-grid">
            <Field label="Breed / mix" wide />
            <Field label="Color / markings" wide />
            <Field label="DOB / age" />
            <Field label="Weight" />
            <Field label="Gender" />
            <Field label="License / tag #" />
            <Field label="Microchip #" wide />
          </div>
          <div className="med-check-row" style={{ justifyContent: "flex-start" }}>
            <Check label="Spayed / neutered" />
          </div>
          <div className="med-panel-title" style={{ marginTop: "0.02in" }}>Contact Info</div>
          <div className="med-field-grid">
            <Field label="Name" wide />
            <Field label="Primary phone" />
            <Field label="Alternate phone" />
            <Field label="Email" wide />
          </div>
          <div className="med-panel-title" style={{ marginTop: "0.02in" }}>Vet Info</div>
          <div className="med-field-grid">
            <Field label="Primary vet / clinic" wide />
            <Field label="Clinic address" wide />
            <Field label="Vet phone" />
            <Field label="Emergency vet phone" />
            <Field label="Emergency vet" wide />
          </div>
        </Panel>

        <Panel title="Notes">
          <div className="med-note-box med-note-lined"></div>
          <p className="med-small-copy">
            Keep this record with adoption paperwork, vaccine receipts, and medication instructions.
          </p>
          {revisionDate ? <div className="med-footer">Pet Medical Record - Rev. {revisionDate}</div> : null}
        </Panel>

        <Panel cover>
          <img src={logoSrc} alt={orgName} className="med-logo" />
          <h1 className="med-cover-title">Pet Medical Record</h1>
          <div className="med-field-grid-single" style={{ width: "100%", marginTop: "0.08in" }}>
            <Field label="Pet name" />
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
          <StickerTable rows={6} />
          <p className="med-small-copy">Affix each vial label and write the dates.</p>
        </Panel>

        <Panel title="Vaccination Record (cont.)">
          <StickerTable rows={6} />
        </Panel>

        <Panel title="Flea & Tick Treatment">
          <div className="med-field-grid-single">
            <Field label="Product" />
          </div>
          <DateGrid rows={13} columns={2} />
          <div className="med-panel-title" style={{ marginTop: "0.04in" }}>Deworming</div>
          <div className="med-field-grid-single">
            <Field label="Product" />
          </div>
          <DateGrid rows={3} columns={2} />
        </Panel>
      </Page>
    </div>
  );
};

export default PetMedicalRecordSection;
