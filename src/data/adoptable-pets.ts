import type { AdoptablePetLocalItem } from "@/components/patterns/AdoptablePetsSection";
import { resolveText, type ContentLocale, type LocalizedText } from "@/lib/localized-content";

type LocalizedAdoptablePet = {
  id: string;
  name: string;
  imageSrc: string;
  ageLabel: LocalizedText;
  gender: LocalizedText;
  breed: LocalizedText;
  summary: LocalizedText;
};

// Real, currently-listed animals from Animal Friends of the Valleys (Wildomar, CA), used only to
// demonstrate the local-listings mode with a real-world data shape. This template and 4leggedIT are
// not affiliated with Animal Friends of the Valleys — see https://www.petfinder.com/member/us/ca/wildomar/animal-friends-of-the-valleys-ca542/
const localPetsSource: LocalizedAdoptablePet[] = [
  {
    id: "afv-malcom",
    name: "Malcom",
    imageSrc:
      "https://media.adoptapet.com/image/upload/d_Fallback-Photo_Dog-v3.png/c_auto,g_auto,w_800,ar_27:28,dpr_2/f_auto,q_auto/1324356919",
    ageLabel: { en: "Adult", es: "Adulto" },
    gender: { en: "Male", es: "Macho" },
    breed: { en: "German Shepherd Dog", es: "Pastor Alemán" },
    summary: {
      en: "See Animal Friends of the Valleys' current listing for full details.",
      es: "Consulte el listado actual de Animal Friends of the Valleys para más detalles.",
    },
  },
  {
    id: "afv-toby",
    name: "Toby",
    imageSrc:
      "https://media.adoptapet.com/image/upload/d_Fallback-Photo_Dog-v3.png/c_auto,g_auto,w_800,ar_27:28,dpr_2/f_auto,q_auto/1324356910",
    ageLabel: { en: "Adult", es: "Adulto" },
    gender: { en: "Male", es: "Macho" },
    breed: { en: "Shepherd (Unknown Type)", es: "Pastor (Tipo Desconocido)" },
    summary: {
      en: "See Animal Friends of the Valleys' current listing for full details.",
      es: "Consulte el listado actual de Animal Friends of the Valleys para más detalles.",
    },
  },
  {
    id: "afv-raiya",
    name: "Raiya",
    imageSrc:
      "https://media.adoptapet.com/image/upload/d_Fallback-Photo_Dog-v3.png/c_auto,g_auto,w_800,ar_27:28,dpr_2/f_auto,q_auto/1324356886",
    ageLabel: { en: "Adult", es: "Adulta" },
    gender: { en: "Female", es: "Hembra" },
    breed: { en: "American Pit Bull Terrier", es: "American Pit Bull Terrier" },
    summary: {
      en: "See Animal Friends of the Valleys' current listing for full details.",
      es: "Consulte el listado actual de Animal Friends of the Valleys para más detalles.",
    },
  },
  {
    id: "afv-luna",
    name: "Luna",
    imageSrc:
      "https://media.adoptapet.com/image/upload/d_Fallback-Photo_Dog-v3.png/c_auto,g_auto,w_800,ar_27:28,dpr_2/f_auto,q_auto/1324356877",
    ageLabel: { en: "Adult", es: "Adulta" },
    gender: { en: "Female", es: "Hembra" },
    breed: { en: "Husky", es: "Husky" },
    summary: {
      en: "See Animal Friends of the Valleys' current listing for full details.",
      es: "Consulte el listado actual de Animal Friends of the Valleys para más detalles.",
    },
  },
];

export const resolveLocalPets = (locale: ContentLocale): AdoptablePetLocalItem[] =>
  localPetsSource.map((pet) => ({
    id: pet.id,
    name: pet.name,
    imageSrc: pet.imageSrc,
    ageLabel: resolveText(pet.ageLabel, locale),
    gender: resolveText(pet.gender, locale),
    breed: resolveText(pet.breed, locale),
    summary: resolveText(pet.summary, locale),
  }));
