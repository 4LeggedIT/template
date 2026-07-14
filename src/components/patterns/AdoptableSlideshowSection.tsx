import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Pause, Play } from "lucide-react";
import { resolvePetAgeLabel } from "@/lib/pet-age";
import type { PetCardItem } from "@/components/patterns/PetCard";

export type AdoptableSlideshowSectionLabels = {
  pageTitle?: string;
  petsAvailableSuffix?: string;
  loadingCount?: string;
  pauseLabel?: string;
  playLabel?: string;
  fullscreenLabel?: string;
  exitFullscreenLabel?: string;
  loadingSlideshow?: string;
  noAvailableLabel?: string;
  noPhotoLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  goodWith?: string;
  goodWithDogs?: string;
  goodWithKids?: string;
  goodWithCats?: string;
  detailsOnProfile?: string;
};

type AdoptableSlideshowSectionProps = {
  pets: PetCardItem[];
  isLoading?: boolean;
  orgName: string;
  orgLogoSrc?: string;
  adoptUrl: string;
  slideIntervalMs?: number;
  labels?: AdoptableSlideshowSectionLabels;
};

const AdoptableSlideshowSection = ({
  pets,
  isLoading = false,
  orgName,
  orgLogoSrc,
  adoptUrl,
  slideIntervalMs = 6000,
  labels = {},
}: AdoptableSlideshowSectionProps) => {
  const {
    pageTitle = "Adoptable Pets Slideshow",
    petsAvailableSuffix = "pets available",
    loadingCount = "Loading…",
    pauseLabel = "Pause",
    playLabel = "Play",
    fullscreenLabel = "Full screen",
    exitFullscreenLabel = "Exit full screen",
    loadingSlideshow = "Loading slideshow…",
    noAvailableLabel = "No adoptable pets found yet.",
    noPhotoLabel = "No photo available",
    previousLabel = "Previous",
    nextLabel = "Next",
    goodWith: goodWithLabel = "Good with:",
    goodWithDogs: goodWithDogsLabel = "Dogs",
    goodWithKids: goodWithKidsLabel = "Kids",
    goodWithCats: goodWithCatsLabel = "Cats",
    detailsOnProfile = "More details on profile page",
  } = labels;

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(adoptUrl)}`;

  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isPlaying || pets.length <= 1) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % pets.length), slideIntervalMs);
    return () => window.clearInterval(timer);
  }, [isPlaying, pets.length, slideIntervalMs]);

  useEffect(() => {
    if (index >= pets.length) setIndex(0);
  }, [index, pets.length]);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const goNext = () => setIndex((i) => (i + 1) % pets.length);
  const goPrev = () => setIndex((i) => (i - 1 + pets.length) % pets.length);
  const toggleFullscreen = async () => {
    if (document.fullscreenElement) { await document.exitFullscreen(); return; }
    await document.documentElement.requestFullscreen();
  };

  const current = pets[index];
  const btnStyle = {
    display: "inline-flex", alignItems: "center", gap: 4,
    border: "1px solid #e5e7eb", borderRadius: 6, padding: "8px 12px",
    fontSize: 13, fontWeight: 500, background: "#fff", cursor: "pointer",
  } as const;

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", flexDirection: "column", fontFamily: "'Segoe UI', system-ui, Arial, sans-serif" }}>
      {!isFullscreen ? (
        <header style={{ borderBottom: "1px solid #e5e7eb", background: "#fdf8f3", padding: "16px" }}>
          <div style={{ maxWidth: 1152, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {orgLogoSrc ? (
                <img src={orgLogoSrc} alt={orgName} style={{ height: 40, width: 40, objectFit: "contain" }} />
              ) : null}
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>{pageTitle}</h1>
                <p style={{ fontSize: 13, color: "#6b7280" }}>
                  {isLoading ? loadingCount : `${pets.length} ${petsAvailableSuffix}`}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button type="button" style={btnStyle} onClick={() => setIsPlaying((v) => !v)}>
                {isPlaying ? <Pause style={{ width: 16, height: 16 }} /> : <Play style={{ width: 16, height: 16 }} />}
                {isPlaying ? pauseLabel : playLabel}
              </button>
              <button type="button" style={btnStyle} onClick={toggleFullscreen}>
                <Maximize2 style={{ width: 16, height: 16 }} />
                {fullscreenLabel}
              </button>
            </div>
          </div>
        </header>
      ) : null}

      <main style={{ flex: 1, padding: isFullscreen ? "8px 16px" : "24px 16px" }}>
        {isFullscreen ? (
          <div style={{ maxWidth: 1152, margin: "0 auto 8px", display: "flex", justifyContent: "flex-end" }}>
            <button type="button" style={{ ...btnStyle, background: "rgba(255,255,255,0.9)" }} onClick={toggleFullscreen}>
              <Minimize2 style={{ width: 16, height: 16 }} />
              {exitFullscreenLabel}
            </button>
          </div>
        ) : null}

        <div style={{ maxWidth: 1152, margin: "0 auto", height: "100%" }}>
          {isLoading ? (
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 48, color: "#6b7280" }}>
              {loadingSlideshow}
            </div>
          ) : !current ? (
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 48, color: "#6b7280" }}>
              {noAvailableLabel}
            </div>
          ) : (
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, background: "#fff", overflow: "hidden", display: "flex", flexDirection: "row" }}>
              <div style={{ flex: "0 0 66.666%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 320 }}>
                {current.imageSrc
                  ? <img src={current.imageSrc} alt={current.name} style={{ height: "100%", width: "100%", objectFit: "cover" }} />
                  : <span style={{ color: "#9ca3af" }}>{noPhotoLabel}</span>
                }
              </div>

              <div style={{ flex: "0 0 33.333%", padding: 24, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "hsl(10,42%,58%)" }}>
                    {orgName}
                  </p>
                  {orgLogoSrc ? (
                    <img src={orgLogoSrc} alt={orgName} style={{ height: 48, width: 48, objectFit: "contain", border: "1px solid #e5e7eb", borderRadius: 6, padding: 4, background: "#fff" }} />
                  ) : null}
                </div>

                <h2 style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.15, margin: 0 }}>{current.name}</h2>
                <p style={{ fontSize: 15, color: "#6b7280", marginTop: 16 }}>
                  {[current.gender, current.breed, resolvePetAgeLabel(current), current.size].filter(Boolean).join(" • ") || detailsOnProfile}
                </p>
                {current.summary ? (
                  <p style={{ fontSize: 14, color: "#374151", marginTop: 12, lineHeight: 1.5 }}>{current.summary}</p>
                ) : null}
                {current.temperament ? (
                  <p style={{ fontSize: 13, color: "#6b7280", fontStyle: "italic", marginTop: 10, lineHeight: 1.5 }}>{current.temperament}</p>
                ) : null}
                {current.description ? (
                  <p style={{ fontSize: 13, color: "#374151", marginTop: 10, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {current.description.split("\n\n")[0]}
                  </p>
                ) : null}
                {(current.goodWithDogs || current.goodWithKids || current.goodWithCats) ? (
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginTop: 10 }}>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>{goodWithLabel}</span>
                    {current.goodWithDogs ? <span style={{ fontSize: 12, background: "#f3f4f6", borderRadius: 999, padding: "2px 10px", color: "#374151" }}>{goodWithDogsLabel}</span> : null}
                    {current.goodWithKids ? <span style={{ fontSize: 12, background: "#f3f4f6", borderRadius: 999, padding: "2px 10px", color: "#374151" }}>{goodWithKidsLabel}</span> : null}
                    {current.goodWithCats ? <span style={{ fontSize: 12, background: "#f3f4f6", borderRadius: 999, padding: "2px 10px", color: "#374151" }}>{goodWithCatsLabel}</span> : null}
                  </div>
                ) : null}

                <div style={{ marginTop: "auto", paddingTop: 24, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
                  <button type="button" style={btnStyle} onClick={goPrev}>
                    <ChevronLeft style={{ width: 16, height: 16 }} />
                    {previousLabel}
                  </button>
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <img src={qrSrc} alt="QR code" style={{ height: 96, width: 96, border: "1px solid #e5e7eb", borderRadius: 6, padding: 4, background: "#fff", objectFit: "contain" }} />
                    <p style={{ marginTop: 4, fontSize: 11, color: "#6b7280" }}>{index + 1} / {pets.length}</p>
                  </div>
                  <button type="button" style={btnStyle} onClick={goNext}>
                    {nextLabel}
                    <ChevronRight style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdoptableSlideshowSection;
