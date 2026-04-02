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
  gender?: string;
  breed?: string;
  age?: string;
  size?: string;
  summary?: string;
  description?: string;
  statusLabel?: string;
  featured?: boolean;
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
    .filter((item) => item.id && item.name && item.image)
    .map((item) => ({
      id: item.id,
      name: item.name,
      alias: item.alias,
      imageSrc: item.image as string,
      imageAlt: `Meet ${item.name}`,
      gender: item.gender,
      breed: item.breed,
      size: item.size,
      ageLabel: item.age,
      summary: item.summary,
      description: item.description,
      statusLabel: item.statusLabel,
      featured: item.featured,
    }));

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
