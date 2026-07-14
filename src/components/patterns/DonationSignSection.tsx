import "@/styles/documents.css";
import type { PrintableDocConfig } from "@/components/patterns/printable-doc-config";
import PrintPageHeader from "@/components/patterns/PrintPageHeader";

const DEFAULT_USES = [
  "Veterinary care & medical supplies",
  "Spay & neuter surgeries",
  "Food & feeding supplies",
  "Rescue transport",
  "Foster family support",
];

type DonationSignSectionProps = {
  config: PrintableDocConfig;
};

const DonationSignSection = ({ config }: DonationSignSectionProps) => {
  const { orgName, logoSrc, contact, donation } = config;
  const uses = donation?.donationUses ?? DEFAULT_USES;
  const cleanUrl = contact.website.replace(/^https?:\/\//, "");

  return (
    <div className="doc-body">
      <style>{`
        @page { size: letter portrait; margin: 0.25in; }
        .donation-sign {
          border: 4px solid var(--doc-dark, hsl(212,30%,20%));
          border-radius: 6px;
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          height: 10in;
          overflow: hidden;
        }
        .donation-label {
          font-size: 9pt;
          font-weight: 900;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--doc-dark, hsl(212,30%,20%));
          margin-bottom: 4px;
          text-align: center;
        }
        .donation-headline {
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
        .donation-intro {
          font-size: 11.5pt;
          font-weight: 500;
          text-align: center;
          color: var(--doc-gray, hsl(212,20%,30%));
          margin-bottom: 1.5rem;
          line-height: 1.55;
        }
        .qr-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
          flex: 1;
        }
        .qr-card {
          border: 2px solid var(--doc-dark, hsl(212,30%,20%));
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem 0.75rem;
          gap: 0.75rem;
        }
        .qr-card-label {
          font-size: 9pt;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--doc-dark, hsl(212,30%,20%));
        }
        .qr-image {
          max-width: 100%;
          width: 200px;
          height: 200px;
          object-fit: contain;
        }
        .qr-platform-logo {
          height: 28px;
          object-fit: contain;
        }
        .qr-coming-soon {
          width: 200px;
          height: 200px;
          border: 2px dashed var(--doc-gray, hsl(212,30%,70%));
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--doc-gray, hsl(212,30%,60%));
          font-size: 10pt;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-align: center;
          line-height: 1.4;
        }
        .donation-uses {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .donation-use-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 10pt;
          line-height: 1.4;
          color: var(--doc-gray, hsl(212,20%,30%));
        }
        .use-bullet {
          flex-shrink: 0;
          margin-top: 2px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--doc-dark, hsl(212,30%,20%));
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9pt;
        }
        .donation-footer-strip {
          margin-top: auto;
          border-top: 2px solid var(--doc-dark, hsl(212,30%,20%));
          padding-top: 1rem;
          text-align: center;
          font-size: 9pt;
          color: var(--doc-dark, hsl(212,30%,20%));
          line-height: 1.5;
          font-weight: 600;
        }
        .donation-sign-footer {
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
          .doc-body { min-height: 0 !important; }
          .no-print { display: none !important; }
          .donation-sign { height: 10in; overflow: hidden; page-break-inside: avoid; }
          .donation-page-wrapper { margin: 0 !important; padding: 0 !important; box-shadow: none !important; }
        }
      `}</style>

      <PrintPageHeader
        buttonLabel="Print Donation Sign"
        instructions="Print on Letter paper (8.5 × 11) in portrait orientation."
      />

      <div className="donation-page-wrapper" style={{ background: "#fff", maxWidth: "8.5in", margin: "20px auto", padding: "0.25in", boxShadow: "0 3px 16px rgba(0,0,0,0.14)" }}>
        <div className="donation-sign">
          <div>
            <p className="donation-label">Support Our Mission</p>
            <h1 className="donation-headline">Help Us Help Them</h1>
          </div>

          <p className="donation-intro">
            Every dollar goes directly toward caring for animals in need.<br />
            {donation?.zelleQrSrc || donation?.venmoQrSrc
              ? "Scan a code below to donate — no account required for Zelle through your bank."
              : `Donate at ${cleanUrl}`}
          </p>

          {(donation?.zelleQrSrc || donation?.venmoQrSrc) ? (
            <div className="qr-grid">
              {donation?.zelleQrSrc ? (
                <div className="qr-card">
                  <span className="qr-card-label">Donate via</span>
                  <img src={donation.zelleQrSrc} alt={`Zelle QR Code for ${orgName}`} className="qr-image" />
                  <span style={{ fontWeight: 900, fontSize: "16pt", color: "#6d1ed4", letterSpacing: "0.03em" }}>Zelle®</span>
                  {donation.zelleEmailOrPhone ? (
                    <span style={{ fontSize: "9pt", fontWeight: 700, color: "var(--doc-dark, hsl(212,30%,20%))", letterSpacing: "0.01em" }}>
                      {donation.zelleEmailOrPhone}
                    </span>
                  ) : null}
                </div>
              ) : null}
              {donation?.venmoQrSrc ? (
                <div className="qr-card">
                  <span className="qr-card-label">Donate via</span>
                  <img src={donation.venmoQrSrc} alt={`Venmo QR Code for ${orgName}`} className="qr-image" />
                  <span style={{ fontWeight: 900, fontSize: "15pt", color: "#3396cd", letterSpacing: "0.03em" }}>Venmo</span>
                  {donation.venmoHandle ? (
                    <span style={{ fontSize: "9pt", fontWeight: 700, color: "var(--doc-dark, hsl(212,30%,20%))", letterSpacing: "0.01em" }}>
                      {donation.venmoHandle}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="donation-uses">
            {uses.map((use, i) => (
              <div key={i} className="donation-use-item">
                <span className="use-bullet">♥</span>
                <span>{use}</span>
              </div>
            ))}
          </div>

          <div className="donation-footer-strip">
            {orgName} is an all-volunteer animal rescue. 100% of donations support animals in need.<br />
            <span style={{ fontWeight: 400 }}>Questions? Visit </span>{cleanUrl}
          </div>

          <div className="donation-sign-footer">
            <img src={logoSrc} alt={orgName} style={{ maxHeight: 110 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationSignSection;
