import { useState, type ChangeEvent } from "react";
import { resolvePetAgeLabel } from "@/lib/pet-age";
import type { PetCardItem } from "@/components/patterns/PetCard";

export type KennelCards2UpSectionLabels = {
  selectDogLabel?: string;
  loadingPets?: string;
  manualEntryPlaceholder?: string;
  printButton?: string;
  scanToAdopt?: string;
  addPhotoPlaceholder?: string;
  defaultNotes?: string;
  dogNameLabel?: string;
  uploadPhotoLabel?: string;
  photoUrlLabel?: string;
  notesLabel?: string;
  dogNamePlaceholder?: string;
  agePlaceholder?: string;
  breedPlaceholder?: string;
  notesPlaceholder?: string;
  pageTitle?: string;
  pageSubtitle?: string;
  cardDetailsLabel?: string;
  card1Label?: string;
  card2Label?: string;
};

type CardState = {
  dogName: string;
  age: string;
  breed: string;
  gender: string;
  size: string;
  notes: string;
  photoUrl: string;
};

const emptyCard = (): CardState => ({
  dogName: "", age: "", breed: "", gender: "", size: "", notes: "", photoUrl: "",
});

const fillFromPet = (pet: PetCardItem, defaultNotes: string): Partial<CardState> => ({
  dogName: pet.name ?? "",
  age: resolvePetAgeLabel(pet) ?? "",
  breed: pet.breed ?? "",
  gender: pet.gender ?? "",
  size: pet.size ?? "",
  photoUrl: pet.imageSrc ?? "",
  notes: pet.description ?? defaultNotes,
});

const PrintCard = ({
  card,
  orgName,
  orgLogoSrc,
  qrSrc,
  scanToAdopt,
  addPhotoPlaceholder,
  dogNamePlaceholder,
  agePlaceholder,
  breedPlaceholder,
  notesPlaceholder,
}: {
  card: CardState;
  orgName: string;
  orgLogoSrc?: string;
  qrSrc: string;
  scanToAdopt: string;
  addPhotoPlaceholder: string;
  dogNamePlaceholder: string;
  agePlaceholder: string;
  breedPlaceholder: string;
  notesPlaceholder: string;
}) => {
  const hasContent = Boolean(card.dogName || card.age || card.breed || card.gender || card.size || card.notes || card.photoUrl);
  if (!hasContent) {
    return (
      <article style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", height: "100%", boxSizing: "border-box" }} />
    );
  }

  return (
    <article style={{ background: "#fff", color: "#000", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box" }}>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "0.42fr 0.58fr", minHeight: 0 }}>
        <div style={{ background: "#f3f4f6", padding: 12, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {card.photoUrl
            ? <img src={card.photoUrl} alt={card.dogName || dogNamePlaceholder} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
            : <span style={{ fontSize: 13, color: "#6b7280", textAlign: "center" }}>{addPhotoPlaceholder}</span>
          }
        </div>
        <div style={{ padding: 12, overflow: "hidden" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2, margin: 0 }}>{card.dogName || dogNamePlaceholder}</h2>
          <p style={{ fontSize: 13, marginTop: 8 }}>
            {[card.age, card.gender, card.size].filter(Boolean).join(" • ") || agePlaceholder}
          </p>
          <p style={{ fontSize: 13, marginTop: 4 }}>{card.breed || breedPlaceholder}</p>
          <p style={{ fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>{card.notes || notesPlaceholder}</p>
        </div>
      </div>
      <div style={{ padding: "8px 12px", borderTop: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          {orgLogoSrc ? (
            <img src={orgLogoSrc} alt={orgName} style={{ height: 36, width: 36, objectFit: "contain", flexShrink: 0 }} />
          ) : null}
          <p style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{orgName}</p>
        </div>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <img src={qrSrc} alt="QR code" style={{ height: 56, width: 56, border: "1px solid #e5e7eb", borderRadius: 4, padding: 4, background: "#fff" }} />
          <p style={{ fontSize: 10, lineHeight: 1.3, marginTop: 4 }}>{scanToAdopt}</p>
        </div>
      </div>
    </article>
  );
};

const CardEditor = ({
  title,
  card,
  pets,
  isLoading,
  onChange,
  onPhotoUpload,
  selectDogLabel,
  loadingPets,
  manualEntryPlaceholder,
  defaultNotes,
  dogNameLabel,
  uploadPhotoLabel,
  photoUrlLabel,
  notesLabel,
}: {
  title: string;
  card: CardState;
  pets: PetCardItem[];
  isLoading: boolean;
  onChange: (updates: Partial<CardState>) => void;
  onPhotoUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  selectDogLabel: string;
  loadingPets: string;
  manualEntryPlaceholder: string;
  defaultNotes: string;
  dogNameLabel: string;
  uploadPhotoLabel: string;
  photoUrlLabel: string;
  notesLabel: string;
}) => {
  const inputStyle = { width: "100%", border: "1px solid #d1d5db", borderRadius: 6, padding: "6px 10px", fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" as const };

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, background: "rgba(255,255,255,0.6)" }}>
      <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>{title}</h3>
      <label style={{ display: "block", marginBottom: 12, fontSize: 13 }}>
        <span style={{ display: "block", marginBottom: 4, color: "#6b7280" }}>{selectDogLabel}</span>
        <select
          disabled={isLoading}
          defaultValue=""
          onChange={(e) => {
            const pet = pets.find((p) => p.id === e.target.value);
            if (pet) onChange(fillFromPet(pet, defaultNotes));
          }}
          style={inputStyle}
        >
          <option value="">{isLoading ? loadingPets : manualEntryPlaceholder}</option>
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>{pet.name}</option>
          ))}
        </select>
      </label>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        {(["dogName", "age", "breed", "gender", "size"] as const).map((key) => (
          <label key={key} style={{ fontSize: 13 }}>
            <span style={{ display: "block", marginBottom: 4, color: "#6b7280", textTransform: "capitalize" }}>{key === "dogName" ? dogNameLabel : key}</span>
            <input value={card[key]} onChange={(e) => onChange({ [key]: e.target.value })} style={inputStyle} />
          </label>
        ))}
        <label style={{ fontSize: 13 }}>
          <span style={{ display: "block", marginBottom: 4, color: "#6b7280" }}>{uploadPhotoLabel}</span>
          <input type="file" accept="image/*" onChange={onPhotoUpload} style={{ ...inputStyle, padding: "4px 8px" }} />
        </label>
      </div>

      <label style={{ display: "block", fontSize: 13, marginBottom: 10 }}>
        <span style={{ display: "block", marginBottom: 4, color: "#6b7280" }}>{photoUrlLabel}</span>
        <input value={card.photoUrl} onChange={(e) => onChange({ photoUrl: e.target.value })} style={inputStyle} />
      </label>

      <label style={{ display: "block", fontSize: 13 }}>
        <span style={{ display: "block", marginBottom: 4, color: "#6b7280" }}>{notesLabel}</span>
        <textarea value={card.notes} onChange={(e) => onChange({ notes: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
      </label>
    </div>
  );
};

type KennelCards2UpSectionProps = {
  pets: PetCardItem[];
  isLoading?: boolean;
  orgName: string;
  orgLogoSrc?: string;
  adoptUrl: string;
  labels?: KennelCards2UpSectionLabels;
};

const KennelCards2UpSection = ({
  pets,
  isLoading = false,
  orgName,
  orgLogoSrc,
  adoptUrl,
  labels = {},
}: KennelCards2UpSectionProps) => {
  const {
    selectDogLabel = "Select Dog (optional)",
    loadingPets = "Loading dogs…",
    manualEntryPlaceholder = "Manual entry / choose dog",
    printButton = "Print Kennel Cards",
    scanToAdopt = "Scan to adopt",
    addPhotoPlaceholder = "Add a dog photo",
    defaultNotes = "Meet me at the event to learn more about my personality.",
    dogNameLabel = "Dog Name",
    uploadPhotoLabel = "Upload Photo",
    photoUrlLabel = "Photo URL (optional)",
    notesLabel = "Notes",
    dogNamePlaceholder = "Dog Name",
    agePlaceholder = "Age • Gender • Size",
    breedPlaceholder = "Breed",
    notesPlaceholder = "Notes",
    pageTitle = "Kennel Cards (2 per page)",
    pageSubtitle = "Fill in card details or load a dog from the manifest, then print both cards on one letter page.",
    cardDetailsLabel = "Card Details",
    card1Label = "Card #1",
    card2Label = "Card #2",
  } = labels;

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(adoptUrl)}`;

  const [cardOne, setCardOne] = useState<CardState>(emptyCard());
  const [cardTwo, setCardTwo] = useState<CardState>(emptyCard());

  const makeUploader = (setCard: (fn: (prev: CardState) => CardState) => void) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const objectUrl = URL.createObjectURL(file);
      setCard((prev) => ({ ...prev, photoUrl: objectUrl }));
    };

  const printCardProps = {
    orgName, orgLogoSrc, qrSrc, scanToAdopt,
    addPhotoPlaceholder, dogNamePlaceholder, agePlaceholder, breedPlaceholder, notesPlaceholder,
  };

  const editorProps = {
    pets, isLoading, selectDogLabel, loadingPets, manualEntryPlaceholder,
    defaultNotes, dogNameLabel, uploadPhotoLabel, photoUrlLabel, notesLabel,
  };

  return (
    <div className="kc-root" style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'Segoe UI', system-ui, Arial, sans-serif" }}>
      <style>{`
        @page { size: letter portrait; margin: 0.25in; }

        @media print {
          body, html { margin: 0; padding: 0; }
          .kc-root { min-height: 0 !important; background: #fff !important; }
          .kc-section { padding: 0 !important; }

          .kc-card-wrap {
            flex: 0 0 5in !important;
            height: 5in !important;
            min-height: 0 !important;
            box-sizing: border-box !important;
          }

          .kc-separator {
            flex: 0 0 0.5in !important;
            height: 0.5in !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
          }

          .kc-sep-line {
            display: block !important;
            height: 0 !important;
            border-top: 1.5px solid #555 !important;
            width: 100% !important;
          }

          .kc-print-page {
            width: 8in !important;
            height: 10.5in !important;
            display: flex !important;
            flex-direction: column !important;
            margin: 0 auto !important;
            padding: 0 !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>

      <header style={{ borderBottom: "1px solid #e5e7eb", background: "#fdf8f3", padding: "24px 16px" }} className="print:hidden">
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{pageTitle}</h1>
          <p style={{ color: "#6b7280", fontSize: 14 }}>{pageSubtitle}</p>
        </div>
      </header>

      <section className="kc-section" style={{ padding: "24px 16px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", display: "grid", gap: 24, gridTemplateColumns: "1.2fr 0.8fr" }} className="print:block">

          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24 }} className="print:hidden">
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{cardDetailsLabel}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <CardEditor title={card1Label} card={cardOne}
                onChange={(u) => setCardOne((p) => ({ ...p, ...u }))}
                onPhotoUpload={makeUploader(setCardOne as (fn: (prev: CardState) => CardState) => void)}
                {...editorProps}
              />
              <CardEditor title={card2Label} card={cardTwo}
                onChange={(u) => setCardTwo((p) => ({ ...p, ...u }))}
                onPhotoUpload={makeUploader(setCardTwo as (fn: (prev: CardState) => CardState) => void)}
                {...editorProps}
              />
            </div>
            <div style={{ marginTop: 20 }}>
              <button type="button" onClick={() => window.print()}
                style={{ background: "hsl(10,42%,58%)", color: "#fff", border: "none", fontWeight: 700, padding: "10px 20px", borderRadius: 6, cursor: "pointer", fontSize: 14 }}>
                {printButton}
              </button>
            </div>
          </div>

          <div className="kc-print-page" style={{ display: "flex", flexDirection: "column" }}>
            <div className="kc-card-wrap" style={{ flex: "1 1 0", minHeight: 0 }}>
              <PrintCard card={cardOne} {...printCardProps} />
            </div>

            <div className="kc-separator" style={{ flexShrink: 0, height: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", margin: "4px 0" }}>
              <div className="kc-sep-line" style={{ borderTop: "1.5px dashed #bbb", width: "100%" }} />
              <div className="kc-sep-line" style={{ borderTop: "1.5px dashed #bbb", width: "100%" }} />
            </div>

            <div className="kc-card-wrap" style={{ flex: "1 1 0", minHeight: 0 }}>
              <PrintCard card={cardTwo} {...printCardProps} />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default KennelCards2UpSection;
