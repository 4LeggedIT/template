import { resolvePetAgeLabel } from "@/lib/pet-age";
import type { PetCardItem } from "@/components/patterns/PetCard";
import PrintPageHeader from "@/components/patterns/PrintPageHeader";

export type KennelBinderPagesSectionLabels = {
  loadingPets?: string;
  printButton?: string;
  scanToAdopt?: string;
  fieldGender?: string;
  fieldAge?: string;
  fieldBreed?: string;
  fieldSize?: string;
  fieldFee?: string;
  fieldGoodWith?: string;
  fieldStatus?: string;
  notesLabel?: string;
  defaultFee?: string;
  adoptHeading?: string;
  adoptDescription?: string;
  fosterHeading?: string;
  fosterDescription?: string;
  screenTitle?: string;
  screenDescription?: string;
};

type KennelBinderPagesSectionProps = {
  pets: PetCardItem[];
  isLoading?: boolean;
  orgName: string;
  orgLogoSrc?: string;
  orgTagline?: string;
  adoptUrl: string;
  fosterUrl: string;
  labels?: KennelBinderPagesSectionLabels;
};

const yesNo = (value: boolean | undefined) => (typeof value === "boolean" ? (value ? "Yes" : "No") : null);

const toParagraphs = (text: string | undefined) =>
  text
    ?.split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean) ?? [];

const getGoodWith = (pet: PetCardItem) =>
  [
    pet.goodWithDogs ? "dogs" : null,
    pet.goodWithKids ? "kids" : null,
    pet.goodWithCats ? "cats" : null,
  ]
    .filter(Boolean)
    .join(", ");

const PawWatermark = ({ style }: { style: React.CSSProperties }) => (
  <div
    aria-hidden="true"
    style={{ pointerEvents: "none", position: "absolute", ...style }}
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
      <span style={{ background: "var(--doc-primary, hsl(10,42%,58%))", borderRadius: "50%", height: "22%", left: "33%", position: "absolute", top: "12%", width: "22%" }} />
      <span style={{ background: "var(--doc-primary, hsl(10,42%,58%))", borderRadius: "50%", height: "22%", left: "7%", position: "absolute", top: "22%", width: "22%" }} />
      <span style={{ background: "var(--doc-primary, hsl(10,42%,58%))", borderRadius: "50%", height: "22%", position: "absolute", right: "7%", top: "22%", width: "22%" }} />
    </div>
  </div>
);

const pagePaws: React.CSSProperties[] = [
  { bottom: "1.0in", right: "0.2in", height: "1.1in", width: "1.1in", opacity: 0.04, transform: "rotate(20deg)" },
  { top: "1.5in", left: "0.1in", height: "0.7in", width: "0.7in", opacity: 0.05, transform: "rotate(-15deg)" },
  { top: "5.5in", right: "0.15in", height: "0.55in", width: "0.55in", opacity: 0.05, transform: "rotate(35deg)" },
  { bottom: "3.8in", left: "0.25in", height: "1.4in", width: "1.4in", opacity: 0.03, transform: "rotate(-28deg)" },
];

type PhotoCollageProps = {
  photos: string[];
  alt: string;
};

const PhotoCollage = ({ photos, alt }: PhotoCollageProps) => {
  if (photos.length === 1) {
    return (
      <img
        src={photos[0]}
        alt={alt}
        style={{ display: "block", height: "100%", objectFit: "contain", width: "100%" }}
      />
    );
  }

  if (photos.length === 2) {
    return (
      <div style={{ display: "grid", gap: 6, gridTemplateColumns: "1fr 1fr", height: "100%", width: "100%" }}>
        {photos.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={i === 0 ? alt : `${alt} photo ${i + 1}`}
            style={{ display: "block", height: "100%", objectFit: "contain", width: "100%" }}
          />
        ))}
      </div>
    );
  }

  // 3 photos: full-width top + two side-by-side below
  return (
    <div style={{ display: "grid", gap: 6, gridTemplateRows: "58% 42%", height: "100%", width: "100%" }}>
      <img
        src={photos[0]}
        alt={alt}
        style={{ display: "block", height: "100%", objectFit: "contain", width: "100%" }}
      />
      <div style={{ display: "grid", gap: 6, gridTemplateColumns: "1fr 1fr", height: "100%" }}>
        {photos.slice(1).map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${alt} photo ${i + 2}`}
            style={{ display: "block", height: "100%", objectFit: "contain", width: "100%" }}
          />
        ))}
      </div>
    </div>
  );
};

const KennelBinderPagesSection = ({
  pets,
  isLoading = false,
  orgName,
  orgLogoSrc,
  orgTagline,
  adoptUrl,
  fosterUrl,
  labels = {},
}: KennelBinderPagesSectionProps) => {
  const {
    loadingPets = "Loading pets...",
    printButton = "Print Kennel Binder Pages",
    scanToAdopt = "Scan to apply",
    fieldGender = "Sex:",
    fieldAge = "Age:",
    fieldBreed = "Breed:",
    fieldSize = "Size:",
    fieldFee = "Adoption fee:",
    fieldGoodWith = "Good with:",
    fieldStatus = "Status:",
    notesLabel = "Notes:",
    defaultFee = "",
    adoptHeading = "Ready to adopt?",
    adoptDescription = "Complete the adoption application so our team can review fit and next steps.",
    fosterHeading = "Can you foster?",
    fosterDescription = "Apply to provide temporary care while pets wait for placement or adoption.",
    screenTitle = "Kennel Binder Pages",
    screenDescription = "Print one full-page profile for each adoptable pet. Each sheet includes key details, photo, notes, and application links.",
  } = labels;

  const adoptQrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(adoptUrl)}`;
  const fosterQrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(fosterUrl)}`;

  return (
    <div className="binder-root" style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Segoe UI', system-ui, Arial, sans-serif" }}>
      <style>{`
        @page { size: letter portrait; margin: 0.42in 0.5in; }
        .kennel-page { page-break-after: always; }
        .kennel-page:last-child { page-break-after: auto; }
        @media print {
          .binder-root { min-height: 0 !important; background: #fff !important; }
          .binder-section { padding: 0 !important; }
          .kennel-page {
            box-shadow: none !important;
            height: 10.15in !important;
            margin: 0 auto !important;
            max-width: none !important;
            page-break-after: always;
            width: 7.5in !important;
          }
          .kennel-photo { max-height: 3.25in !important; }
          .kennel-body { font-size: 9.7pt !important; }
          .kennel-description p { font-size: 9.2pt !important; line-height: 1.5 !important; }
        }
      `}</style>

      <div className="no-print" style={{ borderBottom: "1px solid #e5e7eb", background: "#fff", padding: "16px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{screenTitle}</h1>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 0 }}>{screenDescription}</p>
        </div>
      </div>

      <PrintPageHeader
        buttonLabel={isLoading ? loadingPets : printButton}
        instructions="Print on Letter paper in portrait orientation."
        disabled={isLoading || pets.length === 0}
      />

      <section className="binder-section" style={{ padding: "24px 16px" }}>
        <div style={{ display: "grid", gap: 24 }}>
          {pets.map((pet, index) => {
            const ageLabel = resolvePetAgeLabel(pet);
            const goodWith = getGoodWith(pet);
            const paragraphs = toParagraphs(pet.description);
            const details = [
              ageLabel ? [fieldAge, ageLabel] : null,
              pet.breed ? [fieldBreed, [pet.breed, pet.secondaryBreed].filter(Boolean).join(" / ")] : null,
              pet.gender ? [fieldGender, pet.gender] : null,
              pet.size ? [fieldSize, pet.size] : null,
              defaultFee ? [fieldFee, defaultFee] : null,
              pet.statusLabel ? [fieldStatus, pet.statusLabel] : null,
              goodWith ? [fieldGoodWith, goodWith] : null,
            ].filter(Boolean) as string[][];

            const careNotes = [
              pet.weightLabel ? `Weight: ${pet.weightLabel}` : null,
              pet.temperament ? `Temperament: ${pet.temperament}` : null,
              yesNo(pet.isSpayedNeutered) ? `Spayed/neutered: ${yesNo(pet.isSpayedNeutered)}` : null,
              yesNo(pet.isVaccinated) ? `Vaccinated: ${yesNo(pet.isVaccinated)}` : null,
              yesNo(pet.isMicrochipped) ? `Microchipped: ${yesNo(pet.isMicrochipped)}` : null,
            ].filter((note): note is string => Boolean(note));

            const photos = [pet.imageSrc, ...(pet.images ?? [])].filter(Boolean).slice(0, 3) as string[];

            return (
              <article
                key={pet.id}
                className="kennel-page"
                style={{
                  background: "#fff",
                  boxShadow: "0 3px 16px rgba(0,0,0,0.14)",
                  color: "#111827",
                  margin: "0 auto",
                  maxWidth: "8.5in",
                  minHeight: "10.15in",
                  overflow: "hidden",
                  padding: "0.2in 0.28in",
                  position: "relative",
                  width: "100%",
                }}
              >
                {pagePaws.map((style, i) => (
                  <PawWatermark key={i} style={style} />
                ))}

                <div style={{ display: "grid", gridTemplateColumns: "2.35in 1fr", gap: "0.28in", alignItems: "start", position: "relative", zIndex: 1 }}>
                  <aside>
                    {orgLogoSrc ? (
                      <img src={orgLogoSrc} alt={orgName} style={{ height: 54, width: 54, objectFit: "contain", marginBottom: 8 }} />
                    ) : null}
                    <div style={{ color: "var(--doc-primary, hsl(10,42%,58%))", fontSize: "8.6pt", fontWeight: 800, lineHeight: 1.15 }}>
                      {orgName}
                    </div>
                    {orgTagline ? (
                      <div style={{ color: "#6b7280", fontSize: "7.5pt", fontStyle: "italic", marginBottom: 12 }}>{orgTagline}</div>
                    ) : null}

                    <h2 style={{ fontSize: "18pt", fontWeight: 400, letterSpacing: "0.08em", lineHeight: 1.1, margin: "0 0 10px", textTransform: "uppercase" }}>
                      {pet.name || `Pet ${index + 1}`}
                    </h2>

                    <dl className="kennel-body" style={{ display: "grid", gap: 7, fontSize: "9.5pt", lineHeight: 1.3, margin: 0 }}>
                      {details.map(([label, value]) => (
                        <div key={label}>
                          <dt style={{ display: "inline", fontWeight: 800, fontStyle: "italic" }}>{label}</dt>{" "}
                          <dd style={{ display: "inline", margin: 0 }}>{value}</dd>
                        </div>
                      ))}
                    </dl>

                    <div style={{ marginTop: 24 }}>
                      <div style={{ fontSize: "9.5pt", fontWeight: 800, fontStyle: "italic", marginBottom: 10 }}>{notesLabel}</div>
                      {careNotes.length ? (
                        <ul style={{ margin: 0, paddingLeft: 16, display: "grid", gap: 5, fontSize: "8.8pt", lineHeight: 1.35 }}>
                          {careNotes.map((note) => <li key={note}>{note}</li>)}
                        </ul>
                      ) : (
                        <div style={{ borderBottom: "1px solid #d1d5db", height: 22 }} />
                      )}
                    </div>
                  </aside>

                  <div>
                    <div
                      className="kennel-photo"
                      style={{
                        alignItems: "center",
                        display: "flex",
                        background: "#fff",
                        height: "3.25in",
                        justifyContent: "center",
                        overflow: "hidden",
                        width: "100%",
                      }}
                    >
                      {photos.length > 0 ? (
                        <PhotoCollage photos={photos} alt={pet.imageAlt ?? pet.name ?? "Adoptable pet"} />
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="kennel-description" style={{ marginTop: "0.26in", paddingLeft: "0.15in", paddingRight: "0.15in", position: "relative", zIndex: 1 }}>
                  {pet.summary ? (
                    <p style={{ fontSize: "9.6pt", fontWeight: 700, lineHeight: 1.5, margin: "0 0 12px" }}>{pet.summary}</p>
                  ) : null}
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph} style={{ fontSize: "9.3pt", lineHeight: 1.55, margin: "0 0 12px" }}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                <footer style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr", marginTop: 22, position: "relative", zIndex: 1 }}>
                  {[
                    { heading: adoptHeading, description: adoptDescription, url: adoptUrl, qr: adoptQrSrc },
                    { heading: fosterHeading, description: fosterDescription, url: fosterUrl, qr: fosterQrSrc },
                  ].map((action) => (
                    <div
                      key={action.url}
                      style={{
                        alignItems: "center",
                        border: "1px solid #e5e7eb",
                        display: "grid",
                        gap: 10,
                        gridTemplateColumns: "1fr auto",
                        padding: "8px 10px",
                      }}
                    >
                      <div style={{ color: "#374151", fontSize: "7.7pt", lineHeight: 1.35 }}>
                        <div style={{ color: "#111827", fontSize: "8.5pt", fontWeight: 800 }}>{action.heading}</div>
                        <div>{action.description}</div>
                        <strong style={{ color: "#111827", display: "block", marginTop: 3 }}>{action.url}</strong>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <img src={action.qr} alt={`${action.heading} QR code`} style={{ height: 58, width: 58, border: "1px solid #e5e7eb", padding: 3 }} />
                        <div style={{ fontSize: "6.8pt", fontWeight: 800, marginTop: 2 }}>{scanToAdopt}</div>
                      </div>
                    </div>
                  ))}
                </footer>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default KennelBinderPagesSection;
