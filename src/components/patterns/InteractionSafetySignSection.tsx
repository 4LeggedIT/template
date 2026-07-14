import "@/styles/documents.css";
import type { PrintableDocConfig } from "@/components/patterns/printable-doc-config";
import PrintPageHeader from "@/components/patterns/PrintPageHeader";

export type SafetyRule = {
  bold?: boolean;
  text: string;
};

const DEFAULT_RULES: SafetyRule[] = [
  { bold: true,  text: "Do NOT pet or handle any animal without a rescue team member present" },
  { bold: false, text: "Animals may be nervous, scared, or unpredictable in this environment" },
  { bold: true,  text: "Children must be supervised at ALL times" },
  { bold: false, text: "Do not put fingers inside crates or enclosures" },
  { bold: false, text: "Please ask before approaching any animal" },
  { bold: false, text: "Please sanitize your hands prior to handling puppies to help protect their developing immune systems" },
];

type InteractionSafetySignSectionProps = {
  config: PrintableDocConfig;
  rules?: SafetyRule[];
};

const InteractionSafetySignSection = ({ config, rules = DEFAULT_RULES }: InteractionSafetySignSectionProps) => {
  const { orgName, logoSrc } = config;

  return (
    <div className="doc-body">
      <style>{`
        @page { size: letter portrait; margin: 0.25in; }
        .safety-sign-page {
          border: 4px solid var(--doc-dark, hsl(212,30%,20%));
          border-radius: 6px;
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          height: 10in;
          overflow: hidden;
        }
        .safety-notice-label {
          font-size: 9pt;
          font-weight: 900;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #b91c1c;
          margin-bottom: 4px;
          text-align: center;
        }
        .safety-headline {
          font-size: 32pt;
          font-weight: 900;
          line-height: 1.1;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          text-align: center;
          color: var(--doc-dark, hsl(212,30%,20%));
          padding-bottom: 1rem;
          margin-bottom: 1.25rem;
          border-bottom: 4px solid var(--doc-dark, hsl(212,30%,20%));
        }
        .safety-intro { font-size: 12pt; font-weight: 700; margin-bottom: 1rem; }
        .safety-rule-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 10px;
          font-size: 11pt;
          line-height: 1.4;
          text-align: left;
        }
        .rule-bullet {
          flex-shrink: 0;
          margin-top: 2px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--doc-dark, hsl(212,30%,20%));
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9pt;
          font-weight: 900;
        }
        .rule-bold { font-weight: 700; }
        .safety-disclaimer {
          margin-top: auto;
          border-top: 2px solid var(--doc-dark, hsl(212,30%,20%));
          padding-top: 1rem;
          font-size: 8pt;
          color: var(--doc-dark, hsl(212,30%,20%));
          line-height: 1.5;
        }
        .safety-disclaimer p { margin-bottom: 6px; }
        .safety-disclaimer .closing { font-weight: 700; font-size: 9.5pt; text-align: center; padding-top: 6px; }
        .safety-footer {
          border-top: 1.5px solid var(--doc-border, hsl(30,20%,84%));
          padding-top: 0.75rem;
          margin-top: 0.75rem;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
        }
        @media print {
          body { background: #fff; }
          .no-print { display: none !important; }
          .safety-sign-page { height: 10in; overflow: hidden; page-break-inside: avoid; }
        }
      `}</style>

      <PrintPageHeader
        buttonLabel="Print Safety Sign"
        instructions="Print on Letter paper (8.5 × 11) in portrait orientation. Post where clearly visible to visitors."
      />

      <div style={{ background: "#fff", maxWidth: "8.5in", margin: "20px auto", padding: "0.25in", boxShadow: "0 3px 16px rgba(0,0,0,0.14)" }}>
        <div className="safety-sign-page">
          <div>
            <p className="safety-notice-label">Important Notice</p>
            <h1 className="safety-headline">Please Read Before<br />Interacting With Pets</h1>
          </div>

          <p className="safety-intro">For everyone's safety — including the animals — please follow these guidelines:</p>

          <ul style={{ listStyle: "none", padding: 0, marginBottom: "1.25rem" }}>
            {rules.map(({ bold, text }, i) => (
              <li key={i} className="safety-rule-item">
                <span className="rule-bullet">•</span>
                <span className={bold ? "rule-bold" : ""}>{text}</span>
              </li>
            ))}
          </ul>

          <div className="safety-disclaimer">
            <p>By entering this area and/or interacting with any animals, you acknowledge and accept all risks, including but not limited to bites, scratches, injury, illness, or property damage.</p>
            <p>You further agree to assume full responsibility for your actions and any minors in your care.</p>
            <p>{orgName}, along with its volunteers, fosters, event hosts, property owners, and representatives, shall not be held liable for any injuries, damages, or incidents that may occur.</p>
            <p style={{ fontWeight: 700 }}>Failure to follow these guidelines may result in removal from the event.</p>
            <p className="closing">Thank you for helping us keep everyone — both human and animal — safe.</p>
          </div>

          <div className="safety-footer">
            <img src={logoSrc} alt={orgName} style={{ maxHeight: 120 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractionSafetySignSection;
