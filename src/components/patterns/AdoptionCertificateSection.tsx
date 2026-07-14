import "@/styles/documents.css";
import type { PrintableDocConfig } from "@/components/patterns/printable-doc-config";

type AdoptionCertificateSectionProps = {
  config: PrintableDocConfig;
  repLabel?: string;
  promise?: string;
  subtitle?: string;
};

const AdoptionCertificateSection = ({
  config,
  repLabel,
  promise = "May this new beginning be filled with safety, patience, good meals, cozy naps, and a lifetime of love.",
  subtitle = "Celebrating a pet's journey from waiting to home.",
}: AdoptionCertificateSectionProps) => {
  const { orgName, logoSrc, contact } = config;
  const cleanUrl = contact.website.replace(/^https?:\/\//, "");

  return (
    <div className="doc-body adoption-certificate-doc">
      <style>{`
        @page { size: letter landscape; margin: 0.32in; }

        .adoption-certificate-page {
          box-sizing: border-box;
          min-height: 7.85in;
          overflow: hidden;
          padding: 0.35in 0.48in;
          position: relative;
        }

        .adoption-cert-frame {
          border: 2px solid var(--doc-accent, hsl(30,50%,64%));
          box-shadow: inset 0 0 0 7px hsl(30, 55%, 96%), inset 0 0 0 9px var(--doc-primary, hsl(10,42%,58%));
          display: grid;
          min-height: 7.15in;
          padding: 0.25in 0.38in 0.18in;
          position: relative;
        }

        .adoption-cert-corner {
          border-color: var(--doc-primary, hsl(10,42%,58%));
          border-style: solid;
          height: 0.62in;
          opacity: 0.65;
          position: absolute;
          width: 0.62in;
        }

        .adoption-cert-corner-tl { border-width: 3px 0 0 3px; left: 0.16in; top: 0.16in; }
        .adoption-cert-corner-tr { border-width: 3px 3px 0 0; right: 0.16in; top: 0.16in; }
        .adoption-cert-corner-bl { border-width: 0 0 3px 3px; bottom: 0.16in; left: 0.16in; }
        .adoption-cert-corner-br { border-width: 0 3px 3px 0; bottom: 0.16in; right: 0.16in; }

        .adoption-cert-header {
          align-items: center;
          display: grid;
          gap: 5px;
          justify-items: center;
          margin-bottom: 0.18in;
          text-align: center;
        }

        .adoption-cert-logo {
          height: 1.05in;
          max-width: 3.4in;
          object-fit: contain;
          width: auto;
        }

        .adoption-cert-eyebrow {
          color: var(--doc-primary, hsl(10,42%,58%));
          font-size: 9pt;
          font-weight: 900;
          letter-spacing: 0.18em;
          margin: 0;
          text-transform: uppercase;
        }

        .adoption-cert-title {
          color: var(--doc-dark, hsl(212,30%,20%));
          font-size: 38pt;
          font-weight: 850;
          letter-spacing: 0;
          line-height: 1;
          margin: 0 0 3px;
        }

        .adoption-cert-subtitle {
          color: var(--doc-gray, hsl(212,15%,45%));
          font-size: 10.5pt;
          line-height: 1.35;
          margin: 0;
        }

        .adoption-cert-paws {
          display: flex;
          gap: 0.16in;
          justify-content: center;
          margin: 0.04in 0 0.07in;
        }

        .adoption-paw {
          height: 0.28in;
          opacity: 0.55;
          position: relative;
          width: 0.28in;
        }

        .adoption-paw::before {
          background: var(--doc-primary, hsl(10,42%,58%));
          border-radius: 50% 50% 45% 45%;
          bottom: 0.02in;
          content: "";
          height: 0.14in;
          left: 0.07in;
          position: absolute;
          width: 0.14in;
        }

        .adoption-paw span,
        .adoption-paw span::before,
        .adoption-paw span::after {
          background: var(--doc-primary, hsl(10,42%,58%));
          border-radius: 50%;
          content: "";
          height: 0.07in;
          position: absolute;
          top: 0.04in;
          width: 0.07in;
        }

        .adoption-paw span { left: 0.105in; }
        .adoption-paw span::before { left: -0.08in; top: 0.035in; }
        .adoption-paw span::after { left: 0.08in; top: 0.035in; }

        .adoption-cert-field-stack {
          display: grid;
          gap: 0.15in;
          margin: 0 auto 0.17in;
          max-width: 7.35in;
        }

        .adoption-cert-line {
          align-items: end;
          display: grid;
          gap: 0.12in;
          grid-template-columns: 1fr 1.36in 1fr;
        }

        .adoption-cert-line-word {
          color: var(--doc-dark, hsl(212,30%,20%));
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 14pt;
          font-style: italic;
          text-align: center;
        }

        .adoption-cert-blank {
          border-bottom: 1.8px solid var(--doc-dark, hsl(212,30%,20%));
          min-height: 0.28in;
        }

        .adoption-cert-label {
          color: var(--doc-gray, hsl(212,15%,45%));
          font-size: 8pt;
          font-weight: 800;
          letter-spacing: 0.08em;
          margin-top: 3px;
          text-transform: uppercase;
        }

        .adoption-cert-date-row {
          align-items: end;
          display: grid;
          gap: 0.12in;
          grid-template-columns: 1fr 0.95in 0.58in 0.72in 0.58in 0.95in 1fr;
        }

        .adoption-cert-promise {
          background: linear-gradient(90deg, hsl(30, 55%, 97%), #fff, hsl(30, 55%, 97%));
          border-bottom: 1px solid var(--doc-border, hsl(30,20%,84%));
          border-top: 1px solid var(--doc-border, hsl(30,20%,84%));
          color: var(--doc-dark, hsl(212,30%,20%));
          font-size: 11.2pt;
          font-weight: 650;
          line-height: 1.35;
          margin: 0 auto 0.16in;
          max-width: 7.8in;
          padding: 0.09in 0.18in;
          text-align: center;
        }

        .adoption-cert-footer-row {
          align-items: end;
          display: grid;
          gap: 0.22in;
          grid-template-columns: 1fr auto 1fr;
          margin: 0 auto 0.1in;
          max-width: 7.35in;
        }

        .adoption-cert-signature-line {
          border-bottom: 1.8px solid var(--doc-dark, hsl(212,30%,20%));
          height: 0.28in;
        }

        .adoption-cert-seal {
          align-items: center;
          background: radial-gradient(circle, hsl(30, 70%, 86%) 0 45%, var(--doc-accent, hsl(30,50%,64%)) 46% 58%, var(--doc-primary, hsl(10,42%,58%)) 59% 100%);
          border: 3px solid #fff;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.16);
          color: #fff;
          display: flex;
          font-size: 7pt;
          font-weight: 900;
          height: 0.9in;
          justify-content: center;
          letter-spacing: 0.08em;
          line-height: 1.15;
          text-align: center;
          text-transform: uppercase;
          width: 0.9in;
        }

        .adoption-cert-footer {
          color: var(--doc-gray, hsl(212,15%,45%));
          font-size: 8.2pt;
          line-height: 1.35;
          margin-top: 0.08in;
          text-align: center;
        }

        .adoption-cert-watermark-paw {
          opacity: 0.08;
          position: absolute;
          transform: rotate(-18deg) scale(2.5);
        }

        .adoption-cert-watermark-paw.paw-left { left: 0.62in; top: 2.35in; }
        .adoption-cert-watermark-paw.paw-right { bottom: 1.05in; right: 0.8in; transform: rotate(18deg) scale(2.2); }

        @media print {
          .adoption-certificate-doc .doc-page {
            box-shadow: none;
            margin: 0;
            max-width: 100%;
          }
        }
      `}</style>

      <div className="no-print binder-print-actions">
        <button type="button" className="binder-print-button" onClick={() => window.print()}>
          Print Certificate
        </button>
        <span>Print on Letter paper in landscape orientation.</span>
      </div>

      <section className="doc-page adoption-certificate-page">
        <div className="adoption-cert-frame">
          <div className="adoption-cert-corner adoption-cert-corner-tl" aria-hidden="true" />
          <div className="adoption-cert-corner adoption-cert-corner-tr" aria-hidden="true" />
          <div className="adoption-cert-corner adoption-cert-corner-bl" aria-hidden="true" />
          <div className="adoption-cert-corner adoption-cert-corner-br" aria-hidden="true" />
          <div className="adoption-cert-watermark-paw adoption-paw paw-left" aria-hidden="true"><span></span></div>
          <div className="adoption-cert-watermark-paw adoption-paw paw-right" aria-hidden="true"><span></span></div>

          <header className="adoption-cert-header">
            <img src={logoSrc} alt={orgName} className="adoption-cert-logo" />
            <p className="adoption-cert-eyebrow">Official welcome home keepsake</p>
            <h1 className="adoption-cert-title">Certificate of Adoption</h1>
            <div className="adoption-cert-paws" aria-hidden="true">
              <span className="adoption-paw"><span></span></span>
              <span className="adoption-paw"><span></span></span>
              <span className="adoption-paw"><span></span></span>
            </div>
            <p className="adoption-cert-subtitle">{subtitle}</p>
          </header>

          <div className="adoption-cert-field-stack">
            <div className="adoption-cert-line">
              <div>
                <div className="adoption-cert-blank"></div>
                <div className="adoption-cert-label">Adopter name</div>
              </div>
              <div className="adoption-cert-line-word">welcomed</div>
              <div>
                <div className="adoption-cert-blank"></div>
                <div className="adoption-cert-label">Pet name</div>
              </div>
            </div>

            <div className="adoption-cert-date-row">
              <div></div>
              <div className="adoption-cert-line-word">home on</div>
              <div>
                <div className="adoption-cert-blank"></div>
                <div className="adoption-cert-label">Month</div>
              </div>
              <div>
                <div className="adoption-cert-blank"></div>
                <div className="adoption-cert-label">Day</div>
              </div>
              <div>
                <div className="adoption-cert-blank"></div>
                <div className="adoption-cert-label">Year</div>
              </div>
              <div className="adoption-cert-line-word">with joy.</div>
              <div></div>
            </div>
          </div>

          <p className="adoption-cert-promise">{promise}</p>

          <div className="adoption-cert-footer-row">
            <div>
              <div className="adoption-cert-signature-line"></div>
              <div className="adoption-cert-label">{repLabel ?? `${orgName} representative`}</div>
            </div>
            <div className="adoption-cert-seal">Forever<br />Family</div>
            <div className="adoption-cert-paws" aria-hidden="true">
              <span className="adoption-paw"><span></span></span>
              <span className="adoption-paw"><span></span></span>
              <span className="adoption-paw"><span></span></span>
            </div>
          </div>

          <footer className="adoption-cert-footer">
            {orgName} - {cleanUrl}
          </footer>
        </div>
      </section>
    </div>
  );
};

export default AdoptionCertificateSection;
