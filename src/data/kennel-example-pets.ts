import type { PetCardItem } from "@/components/patterns/PetCard";
import { yearsAgoISO } from "@/data/examples/dates";
import { exampleImages } from "@/data/examples/images";

export const kennelExamplePets: PetCardItem[] = [
  {
    id: "kennel-1",
    name: "Maple",
    breed: "Mixed Breed",
    gender: "Female",
    birthDate: yearsAgoISO(2, 6),
    size: "Medium",
    imageSrc: exampleImages.maple,
    description: "Affectionate and playful. Loves people and does well on a leash.",
  },
  {
    id: "kennel-2",
    name: "Ranger",
    breed: "Labrador Mix",
    gender: "Male",
    birthDate: yearsAgoISO(4, 6),
    size: "Large",
    imageSrc: exampleImages.ranger,
    description: "Calm indoors and great on walks. Fully vetted and house-trained.",
  },
  {
    id: "kennel-3",
    name: "Poppy",
    breed: "Terrier Mix",
    gender: "Female",
    birthDate: yearsAgoISO(1, 3),
    size: "Small",
    imageSrc: exampleImages.poppy,
    description: "High energy and very friendly. Looking for an active family.",
  },
  {
    id: "kennel-4",
    name: "Buster",
    breed: "German Shepherd Mix",
    gender: "Male",
    birthDate: yearsAgoISO(3),
    size: "Large",
    imageSrc: exampleImages.buster,
    description: "Loyal and intelligent. Knows basic commands and loves fetch.",
  },
];
