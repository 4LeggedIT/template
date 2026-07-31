import { useState } from "react";
import "@/styles/documents.css";
import type { PrintableDocConfig } from "@/components/patterns/printable-doc-config";
import PrintPageHeader from "@/components/patterns/PrintPageHeader";

type TeamMember = {
  firstName: string;
  lastName: string;
  role: string;
  phone: string;
};

const emptyMember = (): TeamMember => ({ firstName: "", lastName: "", role: "", phone: "" });

type BusinessCardTeamSectionProps = {
  config: PrintableDocConfig;
};

const BusinessCardTeamSection = ({ config }: BusinessCardTeamSectionProps) => {
  const { orgName, orgTagline, logoSrc, contact } = config;
  const cleanUrl = contact.website.replace(/^https?:\/\//, "");
  const [member, setMember] = useState<TeamMember>(emptyMember());
  const cards = Array.from({ length: 10 });

  const TeamCard = ({ m }: { m: TeamMember }) => {
    const fullName = [m.firstName, m.lastName].filter(Boolean).join(" ") || "Your Name";
    const role = m.role || "Your Role";

    return (
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
            <div style={{ fontSize: "10pt", fontWeight: 700, color: "var(--doc-dark, hsl(212,30%,20%))", lineHeight: 1.4 }}>{fullName}</div>
            <div style={{ fontSize: "8.5pt", color: "var(--doc-primary, hsl(10,42%,58%))", fontWeight: 600, lineHeight: 1.5 }}>{role}</div>
            {m.phone ? <div style={{ fontSize: "8pt", color: "var(--doc-dark, hsl(212,30%,20%))", lineHeight: 1.5 }}>{m.phone}</div> : null}
          </div>
          <div style={{ fontSize: "7pt", color: "var(--doc-gray, hsl(212,15%,45%))", lineHeight: 1.6 }}>
            {contact.email ? <div>{contact.email}</div> : null}
            <div style={{ color: "var(--doc-primary, hsl(10,42%,58%))", fontWeight: 600 }}>{cleanUrl}</div>
          </div>
        </div>
      </div>
    );
  };

  const field = (label: string, key: keyof TeamMember, placeholder: string) => (
    <label key={key} style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: "9pt" }}>
      <span style={{ fontWeight: 600, color: "var(--doc-dark, hsl(212,30%,20%))" }}>{label}</span>
      <input
        type="text"
        value={member[key]}
        placeholder={placeholder}
        onChange={(e) => setMember((prev) => ({ ...prev, [key]: e.target.value }))}
        style={{ border: "1px solid hsl(210,20%,82%)", borderRadius: 4, padding: "5px 8px", fontSize: "9pt", fontFamily: "inherit", color: "var(--doc-dark, hsl(212,30%,20%))" }}
      />
    </label>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, Arial, sans-serif", background: "#f5ece3", minHeight: "100vh", padding: 24 }}>
      <style>{`
        @page { size: 8.5in 11in; margin: 0; }
        @media print {
          body { background: #fff; padding: 0; }
          .biz-print-info { display: none !important; }
          .biz-sheet { box-shadow: none; margin: 0; }
        }
      `}</style>

      <PrintPageHeader buttonLabel="Print Cards" instructions="Avery 8871 / 28371 Clean Edge stock — print at actual size (100%)." />
      <div className="biz-print-info no-print" style={{ maxWidth: "8.5in", margin: "0 auto 16px", background: "#fff", padding: "10px 16px", fontSize: "9.5pt", lineHeight: 1.6 }}>
        <strong>Team Member Cards</strong> — Fill in the person's details below. All 10 cards update live.
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
          {field("First Name", "firstName", "Jane")}
          {field("Last Name", "lastName", "Smith")}
          {field("Role / Title", "role", "Volunteer Coordinator")}
          {field("Phone (optional)", "phone", "(555) 555-5555")}
        </div>
      </div>

      <div className="biz-sheet" style={{ width: "8.5in", height: "11in", background: "#fff", margin: "0 auto", padding: ".5in .75in", boxShadow: "0 3px 16px rgba(0,0,0,.14)", display: "grid", gridTemplateColumns: "3.5in 3.5in", gridTemplateRows: "repeat(5, 2in)", gap: 0 }}>
        {cards.map((_, i) => <TeamCard key={i} m={member} />)}
      </div>
    </div>
  );
};

export default BusinessCardTeamSection;
