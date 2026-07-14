import "@/styles/documents.css";
import type { PrintableDocConfig } from "@/components/patterns/printable-doc-config";
import PrintPageHeader from "@/components/patterns/PrintPageHeader";

type KennelBinderCoverSectionProps = {
  config: PrintableDocConfig;
  eyebrow?: string;
  title?: string;
  intro?: string;
  binderNote?: string;
  adoptLabel?: string;
  adoptBody?: string;
  fosterLabel?: string;
  fosterBody?: string;
};

const qrFor = (url: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}`;

const PawWatermark = ({ style }: { style: React.CSSProperties }) => (
  <div
    aria-hidden="true"
    style={{
      pointerEvents: "none",
      position: "absolute",
      ...style,
    }}
  >
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <div style={{
        background: "var(--doc-primary, hsl(10,42%,58%))",
        borderRadius: "50% 50% 45% 45%",
        bottom: "18%",
        height: "44%",
        left: "22%",
        position: "absolute",
        width: "44%",
      }} />
      <span style={{
        background: "var(--doc-primary, hsl(10,42%,58%))",
        borderRadius: "50%",
        height: "22%",
        left: "33%",
        position: "absolute",
        top: "12%",
        width: "22%",
      }} />
      <span style={{
        background: "var(--doc-primary, hsl(10,42%,58%))",
        borderRadius: "50%",
        height: "22%",
        left: "7%",
        position: "absolute",
        top: "22%",
        width: "22%",
      }} />
      <span style={{
        background: "var(--doc-primary, hsl(10,42%,58%))",
        borderRadius: "50%",
        height: "22%",
        position: "absolute",
        right: "7%",
        top: "22%",
        width: "22%",
      }} />
    </div>
  </div>
);

const KennelBinderCoverSection = ({
  config,
  eyebrow,
  title = "Adoptable Pet Binder",
  intro = "Meet the pets currently looking for foster or adoptive homes.",
  binderNote = "",
  adoptLabel = "Ready to Adopt?",
  adoptBody = "Apply to adopt a pet and our team will follow up about fit, next steps, and current availability.",
  fosterLabel = "Able to Foster?",
  fosterBody = "Apply to foster and help provide temporary care while pets wait for placement or adoption.",
}: KennelBinderCoverSectionProps) => {
  const { orgName, orgTagline, logoSrc, adoptUrl, fosterUrl, contact, social } = config;
  const cleanUrl = contact.website.replace(/^https?:\/\//, "");

  const actions = [
    {
      title: adoptLabel,
      body: adoptBody,
      url: adoptUrl,
      displayUrl: `${cleanUrl}/adopt`,
    },
    ...(fosterUrl ? [{
      title: fosterLabel,
      body: fosterBody,
      url: fosterUrl,
      displayUrl: `${cleanUrl}/foster`,
    }] : []),
  ];

  const socialHandles = [
    social?.facebook ? `Facebook: ${social.facebook}` : null,
    social?.instagram ? `Instagram: ${social.instagram}` : null,
    social?.tiktok ? `TikTok: ${social.tiktok}` : null,
  ].filter(Boolean);

  const pawConfigs: React.CSSProperties[] = [
    { bottom: "1.2in", left: "0.3in", height: "0.9in", width: "0.9in", opacity: 0.05, transform: "rotate(-30deg)" },
    { top: "1.8in", right: "0.25in", height: "1.3in", width: "1.3in", opacity: 0.04, transform: "rotate(22deg)" },
    { top: "4.5in", left: "0.15in", height: "0.65in", width: "0.65in", opacity: 0.06, transform: "rotate(-12deg)" },
    { bottom: "3.2in", right: "0.35in", height: "0.5in", width: "0.5in", opacity: 0.05, transform: "rotate(40deg)" },
    { top: "7.5in", left: "0.55in", height: "1.05in", width: "1.05in", opacity: 0.04, transform: "rotate(15deg)" },
  ];

  return (
    <div className="doc-body kennel-cover-doc">
      <style>{`
        @page { size: letter portrait; margin: 0.35in; }

        .kennel-cover-doc {
          background: #fff;
        }

        .kennel-cover-page {
          box-sizing: border-box;
          min-height: 10.3in;
          overflow: hidden;
          padding: 0.48in 0.52in 0.38in;
          position: relative;
        }

        .kennel-cover-rule {
          background: linear-gradient(90deg, var(--doc-primary, hsl(10,42%,58%)), var(--doc-accent, hsl(30,50%,64%)), var(--doc-primary, hsl(10,42%,58%)));
          height: 8px;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
        }

        .kennel-cover-header {
          align-items: center;
          display: grid;
          gap: 14px;
          justify-items: center;
          margin-bottom: 0.25in;
          text-align: center;
        }

        .kennel-cover-logo {
          height: 1.95in;
          max-width: 5.25in;
          object-fit: contain;
          width: auto;
        }

        .kennel-cover-eyebrow {
          color: var(--doc-primary, hsl(10,42%,58%));
          font-size: 8pt;
          font-weight: 900;
          letter-spacing: 0.15em;
          margin: 0;
          text-transform: uppercase;
        }

        .kennel-cover-title {
          color: var(--doc-dark, hsl(212,30%,20%));
          font-size: 34pt;
          font-weight: 850;
          letter-spacing: 0;
          line-height: 1.05;
          margin: 0;
        }

        .kennel-cover-intro {
          color: var(--doc-dark, hsl(212,30%,20%));
          font-size: 13pt;
          line-height: 1.45;
          margin: 0 auto;
          max-width: 6.4in;
        }

        .kennel-cover-note {
          background: hsl(30, 55%, 96%);
          border-left: 5px solid var(--doc-accent, hsl(30,50%,64%));
          color: var(--doc-dark, hsl(212,30%,20%));
          font-size: 10.5pt;
          font-weight: 650;
          line-height: 1.45;
          margin: 0 0 0.26in;
          padding: 0.12in 0.18in;
        }

        .kennel-cover-actions {
          display: grid;
          gap: 0.18in;
          grid-template-columns: 1fr 1fr;
          margin-bottom: 0.24in;
        }

        .kennel-cover-action {
          border: 1px solid var(--doc-border, hsl(30,20%,84%));
          border-radius: 6px;
          display: grid;
          gap: 0.1in;
          justify-items: center;
          min-height: 2.35in;
          padding: 0.18in;
          text-align: center;
        }

        .kennel-cover-action-title {
          color: var(--doc-primary, hsl(10,42%,58%));
          font-size: 14pt;
          font-weight: 850;
          line-height: 1.15;
        }

        .kennel-cover-action p {
          color: var(--doc-gray, hsl(212,15%,45%));
          font-size: 9.5pt;
          line-height: 1.35;
          margin: 0;
        }

        .kennel-cover-qr {
          height: 1.2in;
          object-fit: contain;
          width: 1.2in;
        }

        .kennel-cover-action-url {
          color: var(--doc-dark, hsl(212,30%,20%));
          font-size: 8.4pt;
          font-weight: 800;
          line-height: 1.25;
          word-break: break-word;
        }

        .kennel-cover-contact {
          display: grid;
          gap: 0.08in;
          grid-template-columns: 1fr 1.25fr 1.2fr;
          margin-bottom: 0.18in;
        }

        .kennel-cover-contact div {
          background: hsl(30, 45%, 97%);
          border: 1px solid var(--doc-border, hsl(30,20%,84%));
          border-radius: 5px;
          padding: 0.1in 0.12in;
        }

        .kennel-cover-contact span {
          color: var(--doc-gray, hsl(212,15%,45%));
          display: block;
          font-size: 7.8pt;
          font-weight: 800;
          letter-spacing: 0.06em;
          margin-bottom: 3px;
          text-transform: uppercase;
        }

        .kennel-cover-contact strong {
          color: var(--doc-dark, hsl(212,30%,20%));
          display: block;
          font-size: 10.5pt;
          line-height: 1.2;
          word-break: break-word;
        }

        .kennel-cover-socials {
          border-top: 1px solid var(--doc-border, hsl(30,20%,84%));
          color: var(--doc-gray, hsl(212,15%,45%));
          display: flex;
          flex-wrap: wrap;
          font-size: 9pt;
          gap: 0.06in 0.18in;
          justify-content: center;
          padding-top: 0.12in;
          text-align: center;
        }

        @media print {
          .kennel-cover-doc .doc-page {
            box-shadow: none;
            margin: 0;
            max-width: 100%;
          }

          .kennel-cover-page {
            min-height: 10.3in;
            padding: 0.3in 0.32in 0.18in !important;
          }

          .kennel-cover-header {
            gap: 9px;
            margin-bottom: 0.18in;
          }

          .kennel-cover-logo { height: 1.58in; }
          .kennel-cover-title { font-size: 29pt; }
          .kennel-cover-intro { font-size: 11pt; line-height: 1.35; }
          .kennel-cover-note { font-size: 9.2pt; margin-bottom: 0.17in; padding: 0.09in 0.13in; }
          .kennel-cover-actions { gap: 0.12in; margin-bottom: 0.16in; }
          .kennel-cover-action { gap: 0.07in; min-height: 2.05in; padding: 0.12in; }
          .kennel-cover-action-title { font-size: 12pt; }
          .kennel-cover-action p { font-size: 8.1pt; line-height: 1.3; }
          .kennel-cover-qr { height: 1.05in; width: 1.05in; }
          .kennel-cover-action-url { font-size: 7.7pt; }
          .kennel-cover-contact { gap: 0.06in; margin-bottom: 0.12in; }
          .kennel-cover-contact div { padding: 0.07in 0.09in; }
          .kennel-cover-contact strong { font-size: 8.5pt; }
          .kennel-cover-socials { font-size: 7.8pt; padding-top: 0.08in; }
        }
      `}</style>

      <PrintPageHeader
        buttonLabel="Print Cover Page"
        instructions="Print on Letter paper in portrait orientation."
      />

      <section className="doc-page kennel-cover-page">
        {pawConfigs.map((style, i) => (
          <PawWatermark key={i} style={style} />
        ))}

        <div className="kennel-cover-rule" aria-hidden="true" />

        <header className="kennel-cover-header">
          <img src={logoSrc} alt={orgName} className="kennel-cover-logo" />
          {(eyebrow ?? orgTagline) ? <p className="kennel-cover-eyebrow">{eyebrow ?? orgTagline}</p> : null}
          <h1 className="kennel-cover-title">{title}</h1>
          <p className="kennel-cover-intro">{intro}</p>
        </header>

        {binderNote ? <p className="kennel-cover-note">{binderNote}</p> : null}

        <div className="kennel-cover-actions">
          {actions.map((action) => (
            <article key={action.title} className="kennel-cover-action">
              <div className="kennel-cover-action-title">{action.title}</div>
              <p>{action.body}</p>
              <img src={qrFor(action.url)} alt={`QR code for ${action.title}`} className="kennel-cover-qr" />
              <div className="kennel-cover-action-url">{action.displayUrl}</div>
            </article>
          ))}
        </div>

        <div className="kennel-cover-contact">
          {contact.phoneDisplay ? (
            <div>
              <span>Phone</span>
              <strong>{contact.phoneDisplay}</strong>
            </div>
          ) : null}
          {contact.email ? (
            <div>
              <span>Email</span>
              <strong>{contact.email}</strong>
            </div>
          ) : null}
          <div>
            <span>Website</span>
            <strong>{cleanUrl}</strong>
          </div>
        </div>

        {socialHandles.length > 0 ? (
          <div className="kennel-cover-socials">
            {socialHandles.map((handle) => <span key={handle}>{handle}</span>)}
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default KennelBinderCoverSection;
