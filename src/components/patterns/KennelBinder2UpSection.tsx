import { useState } from "react";
import { resolvePetAgeLabel } from "@/lib/pet-age";
import type { PetCardItem } from "@/components/patterns/PetCard";

export type KennelBinder2UpSectionLabels = {
  loadingPets?: string;
  emptySlot?: string;
  printButton?: string;
  scanToAdopt?: string;
  fieldGender?: string;
  fieldAge?: string;
  fieldBreed?: string;
  fieldSize?: string;
};

const SLOT_COUNT = 2;

type KennelBinder2UpSectionProps = {
  pets: PetCardItem[];
  isLoading?: boolean;
  orgName: string;
  orgLogoSrc?: string;
  orgTagline?: string;
  adoptUrl: string;
  labels?: KennelBinder2UpSectionLabels;
};

const KennelBinder2UpSection = ({
  pets,
  isLoading = false,
  orgName,
  orgLogoSrc,
  orgTagline,
  adoptUrl,
  labels = {},
}: KennelBinder2UpSectionProps) => {
  const {
    loadingPets = "Loading dogs…",
    emptySlot = "Empty slot",
    printButton = "Print 2-Up Page",
    scanToAdopt = "Scan to Adopt",
    fieldGender = "Gender:",
    fieldAge = "Age:",
    fieldBreed = "Breed:",
    fieldSize = "Size:",
  } = labels;

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(adoptUrl)}`;

  const [slotIds, setSlotIds] = useState<string[]>(Array.from({ length: SLOT_COUNT }, () => ""));

  const setSlot = (index: number, id: string) =>
    setSlotIds((prev) => prev.map((v, i) => (i === index ? id : v)));

  const selectedDogs = slotIds.map((id) => pets.find((p) => p.id === id) ?? null);

  const selectStyle = { width: "100%", border: "1px solid #d1d5db", borderRadius: 6, padding: "6px 10px", fontSize: 13, fontFamily: "inherit" };

  return (
    <div className="binder-root" style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'Segoe UI', system-ui, Arial, sans-serif" }}>
      <style>{`
        @page { size: letter portrait; margin: 0.25in; }
        @media print {
          .binder-root { min-height: 0 !important; background: #fff !important; }
          .binder-section { padding: 0 !important; }
          .binder-sheet { width: 8in; height: 10.5in; margin: 0 auto; display: flex; flex-direction: column; gap: 0.14in; }
          .binder-grid { flex: 1; min-height: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.14in; }
          .binder-card { break-inside: avoid; display: flex; flex-direction: column; }
          .binder-card-img { flex: 1; min-height: 0; }
          .binder-card-img img { width: 100%; height: 100%; object-fit: contain; display: block; }
        }
      `}</style>

      <header style={{ borderBottom: "1px solid #e5e7eb", background: "#fdf8f3", padding: "24px 16px" }} className="print:hidden">
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Kennel Binder Cards (2 per page)</h1>
          <p style={{ color: "#6b7280", fontSize: 14 }}>Choose up to 2 dogs and print a single letter page with 2 cards side by side. Empty slots print as blank placeholders.</p>
        </div>
      </header>

      <section className="binder-section" style={{ padding: "24px 16px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", display: "grid", gap: 24, gridTemplateColumns: "1.1fr 1fr" }} className="print:block">
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24 }} className="print:hidden">
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Page Setup</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {Array.from({ length: SLOT_COUNT }).map((_, index) => (
                <label key={index} style={{ fontSize: 13 }}>
                  <span style={{ display: "block", marginBottom: 4, color: "#6b7280" }}>Card Slot #{index + 1}</span>
                  <select value={slotIds[index]} onChange={(e) => setSlot(index, e.target.value)} disabled={isLoading} style={selectStyle}>
                    <option value="">{isLoading ? loadingPets : emptySlot}</option>
                    {pets.map((pet) => (
                      <option key={pet.id} value={pet.id}>{pet.name}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <button type="button" onClick={() => window.print()}
              style={{ background: "hsl(10,42%,58%)", color: "#fff", border: "none", fontWeight: 700, padding: "10px 20px", borderRadius: 6, cursor: "pointer", fontSize: 14 }}>
              {printButton}
            </button>
          </div>

          <div className="binder-sheet" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <header style={{ background: "#fff", color: "#000", border: "1px solid #e5e7eb", borderRadius: 12, padding: "12px 16px" }} className="print:rounded-none print:shadow-none">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  {orgLogoSrc ? (
                    <img src={orgLogoSrc} alt={orgName} style={{ height: 56, width: 56, objectFit: "contain", flexShrink: 0 }} />
                  ) : null}
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.2 }}>{orgName}</p>
                    {orgTagline ? <p style={{ fontSize: 11, color: "#6b7280", fontStyle: "italic" }}>{orgTagline}</p> : null}
                  </div>
                </div>
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <img src={qrSrc} alt="QR code" style={{ height: 80, width: 80, border: "1px solid #e5e7eb", borderRadius: 4, padding: 4, background: "#fff" }} />
                  <p style={{ fontSize: 10, lineHeight: 1.3, marginTop: 4, fontWeight: 700 }}>{scanToAdopt}</p>
                </div>
              </div>
            </header>

            <div className="binder-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {selectedDogs.map((dog, index) =>
                dog ? (
                  <article key={index} className="binder-card" style={{ background: "#fff", color: "#000", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <div className="binder-card-img" style={{ height: 320, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      {dog.imageSrc
                        ? <img src={dog.imageSrc} alt={dog.name} style={{ height: "100%", width: "100%", objectFit: "contain", display: "block" }} />
                        : null}
                    </div>
                    <div style={{ padding: "10px 12px" }}>
                      <h2 style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.2, margin: 0 }}>{dog.name}</h2>
                      <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", fontSize: 12 }}>
                        {dog.gender ? <p><span style={{ fontWeight: 600 }}>{fieldGender}</span> {dog.gender}</p> : null}
                        {resolvePetAgeLabel(dog) ? <p><span style={{ fontWeight: 600 }}>{fieldAge}</span> {resolvePetAgeLabel(dog)}</p> : null}
                        {dog.breed ? <p style={{ gridColumn: "1 / -1" }}><span style={{ fontWeight: 600 }}>{fieldBreed}</span> {dog.breed}</p> : null}
                        {dog.size ? <p style={{ gridColumn: "1 / -1" }}><span style={{ fontWeight: 600 }}>{fieldSize}</span> {dog.size}</p> : null}
                      </div>
                      {dog.description ? <p style={{ marginTop: 8, fontSize: 11, lineHeight: 1.5, color: "#374151" }}>{dog.description}</p> : null}
                    </div>
                  </article>
                ) : (
                  <article key={index} className="binder-card" style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12 }} />
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KennelBinder2UpSection;
