import { Facebook, Instagram } from "lucide-react";
import "@/styles/documents.css";
import type { PrintableDocConfig } from "@/components/patterns/printable-doc-config";
import PrintPageHeader from "@/components/patterns/PrintPageHeader";

const TikTokIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.6 5.82c-.9-.9-1.4-2.03-1.4-3.32h-3.4v13.6c0 1.53-1.25 2.78-2.78 2.78a2.78 2.78 0 0 1-2.78-2.78 2.78 2.78 0 0 1 2.78-2.78c.28 0 .55.04.8.12v-3.47a6.27 6.27 0 0 0-.8-.05A6.28 6.28 0 0 0 3 16.28a6.28 6.28 0 0 0 6.28 6.28 6.28 6.28 0 0 0 6.28-6.28V9.4a8.05 8.05 0 0 0 4.72 1.51V7.5c-1.14 0-2.21-.36-3.68-1.68z" />
  </svg>
);

export const SocialIconRow = ({ social, color = "var(--doc-primary, hsl(10,42%,58%))", size = 14 }: {
  social?: PrintableDocConfig["social"];
  color?: string;
  size?: number;
}) => {
  if (!social || (!social.facebook && !social.instagram && !social.tiktok)) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, color }}>
      {social.facebook ? <Facebook size={size} /> : null}
      {social.instagram ? <Instagram size={size} /> : null}
      {social.tiktok ? <TikTokIcon size={size} /> : null}
    </div>
  );
};

type BusinessCardGenericSectionProps = {
  config: PrintableDocConfig;
  /**
   * "generic" (default) — "Business Card (Generic)": front + back cards, printed as two Avery sheets.
   * "simple" — "Business Card (Simple)": one single-sided card, logo as-is on one side, QR + one line of text on the other, printed as one Avery sheet.
   */
  layout?: "generic" | "simple";
};

const BusinessCardGenericSection = ({ config, layout = "generic" }: BusinessCardGenericSectionProps) => {
  const { orgName, orgTagline, logoSrc, contact, social, businessCardCta } = config;
  const cleanUrl = contact.website.replace(/^https?:\/\//, "");
  const qrWebSrc = `https://api.qrserver.com/v1/create-qr-code/?size=144x144&data=${encodeURIComponent(contact.website)}`;

  const cards = Array.from({ length: 10 });

  const SimpleCard = () => (
    <div style={{
      width: "3.5in", height: "2in", overflow: "hidden",
      display: "flex",
      boxShadow: "inset 0 0 0 0.5px hsl(210,20%,82%)",
    }}>
      <div style={{ flex: 1, minWidth: 0, padding: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={logoSrc} alt={orgName} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
      </div>

      <div style={{ flex: 1, minWidth: 0, padding: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <img src={qrWebSrc} alt={`QR code for ${cleanUrl}`} style={{ width: 76, height: 76, display: "block" }} />
        {businessCardCta ? (
          <div style={{ fontSize: "8pt", fontWeight: 600, color: "var(--doc-primary, hsl(10,42%,58%))", textAlign: "center" }}>
            {businessCardCta}
          </div>
        ) : null}
        <div style={{ fontSize: "8pt", fontWeight: 600, color: "var(--doc-dark, hsl(212,30%,20%))", textAlign: "center" }}>
          {cleanUrl}
        </div>
      </div>
    </div>
  );

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
        <div>
          {contact.email ? <div style={{ fontSize: "8pt", color: "var(--doc-dark, hsl(212,30%,20%))", lineHeight: 1.6 }}>{contact.email}</div> : null}
          <div style={{ fontSize: "8pt", color: "var(--doc-primary, hsl(10,42%,58%))", fontWeight: 600, lineHeight: 1.6 }}>{cleanUrl}</div>
        </div>
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
      <SocialIconRow social={social} />
    </div>
  );

  if (layout === "simple") {
    return (
      <div style={{ fontFamily: "'Segoe UI', system-ui, Arial, sans-serif", background: "#fff", minHeight: "100vh", padding: 24 }}>
        <style>{`
          @page { size: 8.5in 11in; margin: 0; }
          @media print {
            body { background: #fff; padding: 0; }
            .biz-print-info { display: none !important; }
            .biz-sheet { box-shadow: none; margin: 0; }
          }
        `}</style>

        <PrintPageHeader
          buttonLabel="Print Cards"
          instructions="Avery Clean Edge Business Cards (8871 / 28371) — Business Card (Simple), single-sided. Print at actual size (100%)."
        />

        <div className="biz-sheet" style={{ width: "8.5in", height: "11in", background: "#fff", margin: "0 auto 24px", padding: ".5in .75in", boxShadow: "0 3px 16px rgba(0,0,0,.14)", display: "grid", gridTemplateColumns: "3.5in 3.5in", gridTemplateRows: "repeat(5, 2in)", gap: 0 }}>
          {cards.map((_, i) => <SimpleCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, Arial, sans-serif", background: "#fff", minHeight: "100vh", padding: 24 }}>
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
        instructions="Avery Clean Edge Business Cards (8871 / 28371) — Business Card (Generic), front + back. Print at actual size (100%). Page 1 = fronts · Page 2 = backs. For double-sided: print page 1, flip on long edge, then print page 2."
      />

      <div className="biz-sheet" style={{ width: "8.5in", height: "11in", background: "#fff", margin: "0 auto 24px", padding: ".5in .75in", boxShadow: "0 3px 16px rgba(0,0,0,.14)", display: "grid", gridTemplateColumns: "3.5in 3.5in", gridTemplateRows: "repeat(5, 2in)", gap: 0 }}>
        {cards.map((_, i) => <FrontCard key={i} />)}
      </div>

      <div className="biz-sheet biz-back-sheet" style={{ width: "8.5in", height: "11in", background: "#fff", margin: "0 auto 24px", padding: ".5in .75in", boxShadow: "0 3px 16px rgba(0,0,0,.14)", display: "grid", gridTemplateColumns: "3.5in 3.5in", gridTemplateRows: "repeat(5, 2in)", gap: 0 }}>
        {cards.map((_, i) => <BackCard key={i} />)}
      </div>
    </div>
  );
};

export default BusinessCardGenericSection;
