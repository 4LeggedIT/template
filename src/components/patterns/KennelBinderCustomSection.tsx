import { useEffect, useMemo, useState } from "react";
import KennelBinderPagesSection from "@/components/patterns/KennelBinderPagesSection";
import type { PetCardItem } from "@/components/patterns/PetCard";
import type { PrintableDocConfig } from "@/components/patterns/printable-doc-config";

type KennelBinderCustomSectionProps = {
  config: PrintableDocConfig;
  adoptablePets?: PetCardItem[];
  isLoading?: boolean;
  placementListings?: PetCardItem[];
};

const blankImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 520'%3E%3Crect width='800' height='520' fill='%23f3f4f6'/%3E%3Ctext x='400' y='260' text-anchor='middle' dominant-baseline='middle' font-family='Arial' font-size='34' fill='%236b7280'%3EPet photo%3C/text%3E%3C/svg%3E";

const fieldStyle = {
  border: "1px solid #d1d5db",
  borderRadius: 6,
  fontFamily: "inherit",
  fontSize: 13,
  padding: "8px 10px",
  width: "100%",
};

const labelStyle = { display: "grid", gap: 4, fontSize: 13, fontWeight: 700 } as const;

const blankForm = {
  name: "",
  ageLabelOverride: "",
  breed: "",
  gender: "",
  size: "",
  statusLabel: "",
  weightLabel: "",
  temperament: "",
  summary: "",
  description: "",
  goodWithDogs: false,
  goodWithKids: false,
  goodWithCats: false,
};

const KennelBinderCustomSection = ({
  config,
  adoptablePets = [],
  isLoading = false,
  placementListings = [],
}: KennelBinderCustomSectionProps) => {
  const { orgName, orgTagline, logoSrc, adoptUrl, fosterUrl } = config;

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [presetId, setPresetId] = useState("");
  const [form, setForm] = useState(blankForm);

  const uploadedPhotoUrl = useMemo(() => {
    if (!photoFile) return "";
    return URL.createObjectURL(photoFile);
  }, [photoFile]);

  useEffect(() => {
    return () => {
      if (uploadedPhotoUrl) URL.revokeObjectURL(uploadedPhotoUrl);
    };
  }, [uploadedPhotoUrl]);

  const setValue = (key: keyof typeof form, value: string | boolean) =>
    setForm((current) => ({ ...current, [key]: value }));

  const applyPetPreset = (sourcePet: PetCardItem) => {
    setPhotoFile(null);
    setPhotoUrl(sourcePet.imageSrc);
    setForm({
      name: sourcePet.name ?? "",
      ageLabelOverride: sourcePet.ageLabelOverride ?? sourcePet.ageLabel ?? "",
      breed: [sourcePet.breed, sourcePet.secondaryBreed].filter(Boolean).join(" / "),
      gender: sourcePet.gender ?? "",
      size: sourcePet.size ?? "",
      statusLabel: sourcePet.statusLabel ?? "",
      weightLabel: sourcePet.weightLabel ?? "",
      temperament: sourcePet.temperament ?? "",
      summary: sourcePet.summary ?? "",
      description: sourcePet.description ?? "",
      goodWithDogs: Boolean(sourcePet.goodWithDogs),
      goodWithKids: Boolean(sourcePet.goodWithKids),
      goodWithCats: Boolean(sourcePet.goodWithCats),
    });
  };

  const applyPreset = (id: string) => {
    setPresetId(id);
    if (!id) {
      setPhotoFile(null);
      setPhotoUrl("");
      setForm(blankForm);
      return;
    }

    const [source, petId] = id.split(":");
    const sourcePet =
      source === "adoptable"
        ? adoptablePets.find((item) => item.id === petId)
        : placementListings.find((item) => item.id === petId);

    if (!sourcePet) return;
    applyPetPreset(sourcePet);
  };

  const presetLabel = (pet: PetCardItem, fallback: string) =>
    [pet.name || fallback, pet.statusLabel ? `(${pet.statusLabel})` : null].filter(Boolean).join(" ");

  const pet: PetCardItem = {
    id: "custom-kennel-binder-page",
    name: form.name || "Pet Name",
    imageSrc: uploadedPhotoUrl || photoUrl || blankImage,
    imageAlt: form.name ? `Photo of ${form.name}` : "Pet photo",
    ageLabelOverride: form.ageLabelOverride,
    breed: form.breed,
    gender: form.gender,
    size: form.size,
    statusLabel: form.statusLabel,
    weightLabel: form.weightLabel,
    temperament: form.temperament,
    summary: form.summary,
    description: form.description,
    goodWithDogs: form.goodWithDogs,
    goodWithKids: form.goodWithKids,
    goodWithCats: form.goodWithCats,
  };

  return (
    <div>
      <section style={{ background: "#fdf8f3", borderBottom: "1px solid #e5e7eb", padding: "24px 16px" }} className="print:hidden">
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Create a Kennel Binder Page</h1>
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            Start from an adoptable pet, a placement listing, or a blank manual entry. The preview below prints as one page.
          </p>
        </div>
      </section>

      <section style={{ padding: "24px 16px", background: "#f9fafb" }} className="print:hidden">
        <div style={{ maxWidth: 960, margin: "0 auto", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24 }}>
          <label style={{ ...labelStyle, marginBottom: 18 }}>
            Start from
            <select style={fieldStyle} value={presetId} onChange={(e) => applyPreset(e.target.value)}>
              <option value="">Manual blank entry</option>
              {(adoptablePets.length > 0 || isLoading) && (
                <optgroup label={isLoading ? "Adoptable pets loading..." : "Adoptable pets"}>
                  {adoptablePets.map((adoptablePet, index) => (
                    <option key={adoptablePet.id} value={`adoptable:${adoptablePet.id}`}>
                      {presetLabel(adoptablePet, `Adoptable pet ${index + 1}`)}
                    </option>
                  ))}
                </optgroup>
              )}
              {placementListings.length > 0 && (
                <optgroup label="Placement listings">
                  {placementListings.map((listing, index) => (
                    <option key={listing.id} value={`placement:${listing.id}`}>
                      {presetLabel(listing, `Placement photo ${index + 1}`)}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </label>

          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            <label style={labelStyle}>
              Name
              <input style={fieldStyle} value={form.name} onChange={(e) => setValue("name", e.target.value)} />
            </label>
            <label style={labelStyle}>
              Age
              <input style={fieldStyle} value={form.ageLabelOverride} onChange={(e) => setValue("ageLabelOverride", e.target.value)} placeholder="Example: 2 years" />
            </label>
            <label style={labelStyle}>
              Breed
              <input style={fieldStyle} value={form.breed} onChange={(e) => setValue("breed", e.target.value)} />
            </label>
            <label style={labelStyle}>
              Sex
              <input style={fieldStyle} value={form.gender} onChange={(e) => setValue("gender", e.target.value)} />
            </label>
            <label style={labelStyle}>
              Size
              <input style={fieldStyle} value={form.size} onChange={(e) => setValue("size", e.target.value)} placeholder="Example: Medium" />
            </label>
            <label style={labelStyle}>
              Status
              <input style={fieldStyle} value={form.statusLabel} onChange={(e) => setValue("statusLabel", e.target.value)} placeholder="Example: Available" />
            </label>
            <label style={labelStyle}>
              Weight
              <input style={fieldStyle} value={form.weightLabel} onChange={(e) => setValue("weightLabel", e.target.value)} placeholder="Example: 42 lbs" />
            </label>
            <label style={labelStyle}>
              Temperament
              <input style={fieldStyle} value={form.temperament} onChange={(e) => setValue("temperament", e.target.value)} />
            </label>
            <label style={labelStyle}>
              Upload photo
              <input style={fieldStyle} type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)} />
            </label>
            <label style={labelStyle}>
              Or photo URL
              <input style={fieldStyle} value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
            </label>
          </div>

          <div style={{ display: "flex", gap: 18, marginTop: 14, fontSize: 13, fontWeight: 700 }}>
            <label><input type="checkbox" checked={form.goodWithDogs} onChange={(e) => setValue("goodWithDogs", e.target.checked)} /> Good with dogs</label>
            <label><input type="checkbox" checked={form.goodWithKids} onChange={(e) => setValue("goodWithKids", e.target.checked)} /> Good with kids</label>
            <label><input type="checkbox" checked={form.goodWithCats} onChange={(e) => setValue("goodWithCats", e.target.checked)} /> Good with cats</label>
          </div>

          <label style={{ ...labelStyle, marginTop: 14 }}>
            Short highlight
            <textarea style={{ ...fieldStyle, minHeight: 70 }} value={form.summary} onChange={(e) => setValue("summary", e.target.value)} />
          </label>
          <label style={{ ...labelStyle, marginTop: 14 }}>
            Bio
            <textarea style={{ ...fieldStyle, minHeight: 150 }} value={form.description} onChange={(e) => setValue("description", e.target.value)} />
          </label>
        </div>
      </section>

      <KennelBinderPagesSection
        pets={[pet]}
        orgName={orgName}
        orgLogoSrc={logoSrc}
        orgTagline={orgTagline}
        adoptUrl={adoptUrl}
        fosterUrl={fosterUrl}
        labels={{
          printButton: "Print This Binder Page",
          screenTitle: "Preview & Print",
          screenDescription: "Review the generated binder page below, then print when ready.",
        }}
      />
    </div>
  );
};

export default KennelBinderCustomSection;
