import type { AdoptablePetLocalItem } from "@/components/patterns/AdoptablePetsSection";

export type HiddenAnimalFilter = {
  animalName: string;
};

export type LocalAdoptableManifestItem = {
  id: string;
  name: string;
  alias?: string;
  rescueId: string;
  rescueName: string;
  detailsUrl?: string;
  image?: string;
  images?: string[];
  gender?: string;
  breed?: string;
  age?: string;
  birthDate?: string;
  size?: string;
  temperament?: string;
  goodWithDogs?: boolean;
  goodWithKids?: boolean;
  goodWithCats?: boolean;
  summary?: string;
  description?: string;
  statusLabel?: string;
  featured?: boolean;
  color?: string;
  weightLabel?: string;
  isSpayedNeutered?: boolean;
  isVaccinated?: boolean;
  isMicrochipped?: boolean;
  placementType?: "owner-surrender" | "shelter-transfer" | "stray-hold" | "courtesy-listing";
  urgency?: "low" | "high" | "critical";
};

export type LocalManifestMapOptions = {
  hiddenFilters?: HiddenAnimalFilter[];
  sort?: "name_asc" | "none";
};

export type LocalManifestLoadOptions = LocalManifestMapOptions & {
  manifestUrl?: string;
};

const normalize = (value: string) => value.trim().toLowerCase();

const isHidden = (item: LocalAdoptableManifestItem, hiddenFilters: HiddenAnimalFilter[]) =>
  hiddenFilters.some((rule) => normalize(rule.animalName) === normalize(item.name));

export const mapLocalAdoptableManifest = (
  manifest: LocalAdoptableManifestItem[],
  {
    hiddenFilters = [],
    sort = "name_asc",
  }: LocalManifestMapOptions = {},
): AdoptablePetLocalItem[] => {
  const mapped = manifest
    .filter((item) => !isHidden(item, hiddenFilters))
    .map((item) => {
      const images = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
      const imageSrc = images[0] ?? item.image;
      if (!item.id || !item.name || !imageSrc) return null;

      return {
        id: item.id,
        name: item.name,
        alias: item.alias,
        imageSrc,
        images: images.length ? images : undefined,
        imageAlt: `Meet ${item.name}`,
        gender: item.gender,
        breed: item.breed,
        size: item.size,
        birthDate: item.birthDate,
        ageLabel: item.age,
        temperament: item.temperament,
        goodWithDogs: item.goodWithDogs,
        goodWithKids: item.goodWithKids,
        goodWithCats: item.goodWithCats,
        summary: item.summary,
        description: item.description,
        statusLabel: item.statusLabel,
        featured: item.featured,
        color: item.color,
        weightLabel: item.weightLabel,
        isSpayedNeutered: item.isSpayedNeutered,
        isVaccinated: item.isVaccinated,
        isMicrochipped: item.isMicrochipped,
        placementType: item.placementType,
        urgency: item.urgency,
      };
    })
    .filter(Boolean) as AdoptablePetLocalItem[];

  return sort === "name_asc"
    ? mapped.sort((left, right) => left.name.localeCompare(right.name, undefined, { sensitivity: "base" }))
    : mapped;
};

export const loadLocalAdoptablePets = async ({
  manifestUrl = "/data/featured-animals.json",
  ...mapOptions
}: LocalManifestLoadOptions = {}): Promise<AdoptablePetLocalItem[]> => {
  const response = await fetch(manifestUrl);
  if (!response.ok) {
    throw new Error(`Failed to load adoptable manifest (${response.status})`);
  }

  const payload = (await response.json()) as unknown;
  if (!Array.isArray(payload)) {
    throw new Error("Adoptable manifest payload is not an array.");
  }

  return mapLocalAdoptableManifest(payload as LocalAdoptableManifestItem[], mapOptions);
};
