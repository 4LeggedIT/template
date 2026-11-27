import type { AdoptablePetLocalItem } from "@/components/patterns/AdoptablePetsSection";
import { exampleImages } from "@/data/examples/images";
import { daysAgoISO, yearsAgoISO } from "@/data/examples/dates";
import { resolveText, type ContentLocale, type LocalizedText } from "@/lib/localized-content";

type LocalizedAdoptablePet = {
  id: string;
  name: string;
  imageSrc: string;
  imageAlt: LocalizedText;
  birthDate: string;
  gender: LocalizedText;
  breed: LocalizedText;
  size: LocalizedText;
  goodWithDogs: boolean;
  goodWithKids: boolean;
  urgency?: "low" | "high" | "critical";
  postedAt: string;
  summary: LocalizedText;
};

// Fictional adoptable dogs from the shared example cast (src/data/examples/cast.ts), authored the way a bilingual site
// authors its own listings: `{ en, es }` text, a birth date (so age updates itself) and a computed posted date.
const localPetsSource: LocalizedAdoptablePet[] = [
  {
    id: "juniper",
    name: "Juniper",
    imageSrc: exampleImages.juniper,
    imageAlt: { en: "Juniper, a labrador retriever mix", es: "Juniper, labrador retriever mestizo" },
    birthDate: yearsAgoISO(2, 0),
    gender: { en: "Female", es: "Hembra" },
    breed: { en: "Labrador Retriever Mix", es: "Labrador Retriever mestizo" },
    size: { en: "Medium", es: "Mediano" },
    goodWithDogs: true,
    goodWithKids: true,
    postedAt: daysAgoISO(10),
    summary: {
      en: "Sweet and playful, loves a game of fetch.",
      es: "Dulce y juguetona, le encanta jugar a buscar la pelota.",
    },
  },
  {
    id: "buster",
    name: "Buster",
    imageSrc: exampleImages.buster,
    imageAlt: { en: "Buster, a boxer mix", es: "Buster, boxer mestizo" },
    birthDate: yearsAgoISO(4, 0),
    gender: { en: "Male", es: "Macho" },
    breed: { en: "Boxer Mix", es: "Boxer mestizo" },
    size: { en: "Large", es: "Grande" },
    goodWithDogs: true,
    goodWithKids: false,
    urgency: "high",
    postedAt: daysAgoISO(17),
    summary: {
      en: "Goofy and friendly, happiest around people.",
      es: "Gracioso y amistoso, más feliz rodeado de personas.",
    },
  },
  {
    id: "willow",
    name: "Willow",
    imageSrc: exampleImages.willow,
    imageAlt: { en: "Willow, a border collie mix", es: "Willow, border collie mestiza" },
    birthDate: yearsAgoISO(0, 8),
    gender: { en: "Female", es: "Hembra" },
    breed: { en: "Border Collie Mix", es: "Border Collie mestiza" },
    size: { en: "Medium", es: "Mediano" },
    goodWithDogs: true,
    goodWithKids: true,
    postedAt: daysAgoISO(24),
    summary: {
      en: "Smart and eager to learn, needs an active home.",
      es: "Inteligente y con ganas de aprender, necesita un hogar activo.",
    },
  },
];

export const resolveLocalPets = (locale: ContentLocale): AdoptablePetLocalItem[] =>
  localPetsSource.map((pet) => ({
    id: pet.id,
    name: pet.name,
    imageSrc: pet.imageSrc,
    imageAlt: resolveText(pet.imageAlt, locale),
    birthDate: pet.birthDate,
    gender: resolveText(pet.gender, locale),
    breed: resolveText(pet.breed, locale),
    size: resolveText(pet.size, locale),
    goodWithDogs: pet.goodWithDogs,
    goodWithKids: pet.goodWithKids,
    urgency: pet.urgency,
    postedAt: pet.postedAt,
    summary: resolveText(pet.summary, locale),
  }));
