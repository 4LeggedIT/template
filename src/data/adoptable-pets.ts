import type { AdoptablePetLocalItem } from "@/components/patterns/AdoptablePetsSection";

export const localPets: AdoptablePetLocalItem[] = [
  {
    id: "local-1",
    name: "Hazel",
    alias: "Hazey",
    imageSrc: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494256997604-768d1f608cac?auto=format&fit=crop&w=1200&q=80",
    ],
    birthDate: "2024-01-15",
    gender: "Female",
    breed: "Mixed Breed",
    size: "Medium",
    temperament: "Affectionate and playful indoors, calm on walks.",
    goodWithDogs: true,
    goodWithKids: true,
    goodWithCats: false,
    summary: "Affectionate, crate-trained, and people-friendly.",
    statusLabel: "Available",
  },
  {
    id: "local-2",
    name: "Biscuit",
    imageSrc: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80",
    birthDate: "2022-06-01",
    gender: "Male",
    breed: "Labrador Mix",
    size: "Large",
    temperament: "Energetic and loyal. Needs an active home.",
    goodWithDogs: true,
    goodWithKids: true,
    goodWithCats: false,
    summary: "Big heart, loves fetch, does great with kids.",
  },
];
