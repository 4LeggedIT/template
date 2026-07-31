import type { AdoptablePetLocalItem } from "@/components/patterns/AdoptablePetsSection";

// Real, currently-listed animals from Animal Friends of the Valleys (Wildomar, CA), used only to
// demonstrate the local-listings mode with a real-world data shape. This template and 4leggedIT are
// not affiliated with Animal Friends of the Valleys — see https://www.petfinder.com/member/us/ca/wildomar/animal-friends-of-the-valleys-ca542/
export const localPets: AdoptablePetLocalItem[] = [
  {
    id: "afv-malcom",
    name: "Malcom",
    imageSrc:
      "https://media.adoptapet.com/image/upload/d_Fallback-Photo_Dog-v3.png/c_auto,g_auto,w_800,ar_27:28,dpr_2/f_auto,q_auto/1324356919",
    ageLabel: "Adult",
    gender: "Male",
    breed: "German Shepherd Dog",
    summary: "See Animal Friends of the Valleys' current listing for full details.",
  },
  {
    id: "afv-toby",
    name: "Toby",
    imageSrc:
      "https://media.adoptapet.com/image/upload/d_Fallback-Photo_Dog-v3.png/c_auto,g_auto,w_800,ar_27:28,dpr_2/f_auto,q_auto/1324356910",
    ageLabel: "Adult",
    gender: "Male",
    breed: "Shepherd (Unknown Type)",
    summary: "See Animal Friends of the Valleys' current listing for full details.",
  },
  {
    id: "afv-raiya",
    name: "Raiya",
    imageSrc:
      "https://media.adoptapet.com/image/upload/d_Fallback-Photo_Dog-v3.png/c_auto,g_auto,w_800,ar_27:28,dpr_2/f_auto,q_auto/1324356886",
    ageLabel: "Adult",
    gender: "Female",
    breed: "American Pit Bull Terrier",
    summary: "See Animal Friends of the Valleys' current listing for full details.",
  },
  {
    id: "afv-luna",
    name: "Luna",
    imageSrc:
      "https://media.adoptapet.com/image/upload/d_Fallback-Photo_Dog-v3.png/c_auto,g_auto,w_800,ar_27:28,dpr_2/f_auto,q_auto/1324356877",
    ageLabel: "Adult",
    gender: "Female",
    breed: "Husky",
    summary: "See Animal Friends of the Valleys' current listing for full details.",
  },
];
