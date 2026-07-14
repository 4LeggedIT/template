import "@/styles/documents.css";
import type { PrintableDocConfig } from "@/components/patterns/printable-doc-config";
import PrintPageHeader from "@/components/patterns/PrintPageHeader";

type BusinessCardGenericSectionProps = {
  config: PrintableDocConfig;
};

const BusinessCardGenericSection = ({ config }: BusinessCardGenericSectionProps) => {
  const { orgName, orgTagline, logoSrc, contact, adoptUrl, social } = config;
  const cleanUrl = contact.website.replace(/^https?:\/\//, "");
  const qrWebSrc = `https://api.qrserver.com/v1/create-qr-code/?size=144x144&data=${encodeURIComponent(contact.website)}`;
  const qrAdoptSrc = adoptUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=144x144&data=${encodeURIComponent(adoptUrl)}`
    : null;

  const cards = Array.from({ length: 10 });

  const FrontCard = () => (
    <div style={{
      width: "3.5in", height: "2in", overflow: "hidden",
      display: "flex", flexDirection: "column",
      boxShadow: "inset 0 0 0 0.5px hsl(210,20%,82%)",
    }}>
      <div style={{ flex: 1, padding: "10px 13px 5px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
          <img src={logoSrc} alt={orgName} style={{ height: 64, width: "auto", objectFit: "contain", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "10.5pt", fontWeight: 700, color: "var(--doc-primary, hsl(10,42%,58%))", lineHeight: 1.2 }}>{orgName}</div>
            {orgTagline ? <div style={{ fontSize: "7pt", color: "var(--doc-gray, hsl(212,15%,45%))", fontStyle: "italic", marginTop: 2, lineHeight: 1.3 }}>{orgTagline}</div> : null}
          </div>
        </div>
        <div style={{ height: 1, background: "linear-gradient(90deg, var(--doc-accent, hsl(30,50%,64%)), transparent)" }}></div>
        <div>
          {contact.email ? <div style={{ fontSize: "8pt", color: "var(--doc-dark, hsl(212,30%,20%))", lineHeight: 1.6 }}>{contact.email}</div> : null}
          <div style={{ fontSize: "8pt", color: "var(--doc-primary, hsl(10,42%,58%))", fontWeight: 600, lineHeight: 1.6 }}>{cleanUrl}</div>
        </div>
        {(social?.instagram || social?.facebook || social?.tiktok) ? (
          <div style={{ fontSize: "7pt", color: "var(--doc-gray, hsl(212,15%,45%))", lineHeight: 1.6 }}>
            {[social.instagram, social.facebook, social.tiktok].filter(Boolean).join(" · ")}
          </div>
        ) : null}
      </div>
    </div>
  );

  const BackCard = () => (
    <div style={{
      width: "3.5in", height: "2in", overflow: "hidden",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "space-between",
      padding: "18px 14px 10px",
      position: "relative",
      boxShadow: "inset 0 0 0 0.5px hsl(210,20%,82%)",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, var(--doc-primary, hsl(10,42%,46%)) 0%, var(--doc-accent, hsl(30,50%,64%)) 50%, var(--doc-primary, hsl(10,42%,46%)) 100%)" }}></div>
      <img src={qrWebSrc} alt={`QR code for ${cleanUrl}`} style={{ width: 72, height: 72, display: "block" }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "9pt", fontWeight: 700, color: "var(--doc-primary, hsl(10,42%,58%))", lineHeight: 1.3 }}>{orgName}</div>
        {orgTagline ? <div style={{ fontSize: "7pt", color: "var(--doc-gray, hsl(212,15%,45%))", fontStyle: "italic", marginTop: 1 }}>{orgTagline}</div> : null}
      </div>
      {(social?.instagram || social?.facebook || social?.tiktok) ? (
        <div style={{ fontSize: "7pt", color: "var(--doc-gray, hsl(212,15%,45%))", textAlign: "center", lineHeight: 1.6 }}>
          {[social.instagram, social.facebook, social.tiktok].filter(Boolean).join(" · ")}
        </div>
      ) : null}
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, Arial, sans-serif", background: "#f5ece3", minHeight: "100vh", padding: 24 }}>
      <style>{`
        @page { size: 8.5in 11in; margin: 0; }
        @media print {
          body { background: #fff; padding: 0; }
          .biz-print-info { display: none !important; }
          .biz-sheet { box-shadow: none; margin: 0; }
          .biz-back-sheet { break-before: page; page-break-before: always; }
        }
      `}</style>

      <PrintPageHeader
        buttonLabel="Print Cards"
        instructions="Avery Clean Edge Business Cards (8871 / 28371) — Print at actual size (100%). Page 1 = fronts · Page 2 = backs. For double-sided: print page 1, flip on long edge, then print page 2."
      />

      <div className="biz-sheet" style={{ width: "8.5in", height: "11in", background: "#fff", margin: "0 auto 24px", padding: ".5in .75in", boxShadow: "0 3px 16px rgba(0,0,0,.14)", display: "grid", gridTemplateColumns: "3.5in 3.5in", gridTemplateRows: "repeat(5, 2in)", gap: 0 }}>
        {cards.map((_, i) => <FrontCard key={i} />)}
      </div>

      <div className="biz-sheet biz-back-sheet" style={{ width: "8.5in", height: "11in", background: "#fff", margin: "0 auto 24px", padding: ".5in .75in", boxShadow: "0 3px 16px rgba(0,0,0,.14)", display: "grid", gridTemplateColumns: "3.5in 3.5in", gridTemplateRows: "repeat(5, 2in)", gap: 0 }}>
        {cards.map((_, i) => <BackCard key={i} />)}
      </div>

      {qrAdoptSrc ? (
        <>
          <div className="no-print" style={{ maxWidth: "8.5in", margin: "0 auto 16px", padding: "8px 16px", fontSize: "9.5pt", color: "var(--doc-gray, hsl(212,15%,45%))" }}>
            <strong>Bonus:</strong> Adopt-focused back cards (QR links to adoptable pets page) — printed on pages 3–4 when you scroll and print all.
          </div>
          <div className="biz-sheet biz-back-sheet" style={{ width: "8.5in", height: "11in", background: "#fff", margin: "0 auto 24px", padding: ".5in .75in", boxShadow: "0 3px 16px rgba(0,0,0,.14)", display: "grid", gridTemplateColumns: "3.5in 3.5in", gridTemplateRows: "repeat(5, 2in)", gap: 0 }}>
            {cards.map((_, i) => (
              <div key={i} style={{
                width: "3.5in", height: "2in", overflow: "hidden",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "space-between",
                padding: "18px 14px 10px",
                position: "relative",
                boxShadow: "inset 0 0 0 0.5px hsl(210,20%,82%)",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, var(--doc-primary, hsl(10,42%,46%)) 0%, var(--doc-accent, hsl(30,50%,64%)) 50%, var(--doc-primary, hsl(10,42%,46%)) 100%)" }}></div>
                <img src={qrAdoptSrc} alt="QR code to adoptable pets" style={{ width: 72, height: 72, display: "block" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "9pt", fontWeight: 700, color: "var(--doc-primary, hsl(10,42%,58%))", lineHeight: 1.3 }}>Adopt a Pet!</div>
                  <div style={{ fontSize: "7pt", color: "var(--doc-gray, hsl(212,15%,45%))", fontStyle: "italic", marginTop: 1 }}>{adoptUrl}</div>
                </div>
                <div style={{ fontSize: "7pt", color: "var(--doc-gray, hsl(212,15%,45%))", textAlign: "center", lineHeight: 1.6 }}>
                  <div>{orgName}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default BusinessCardGenericSection;
