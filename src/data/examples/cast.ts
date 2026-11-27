import { exampleImages } from "./images";

/**
 * The fixed example cast. Every `/standards/*` page that shows a dog uses these names, breeds and photos, so
 * the same dog never changes between pages. Fictional: no real animal, adopter or rescue.
 */
export const exampleCast = {
  juniper: { id: "juniper", name: "Juniper", image: exampleImages.juniper, breed: "Labrador Retriever, Mixed Breed", gender: "Female", age: "2 years old" },
  buster: { id: "buster", name: "Buster", image: exampleImages.buster, breed: "Boxer, Mixed Breed", gender: "Male", age: "4 years old" },
  willow: { id: "willow", name: "Willow", image: exampleImages.willow, breed: "Border Collie, Mixed Breed", gender: "Female", age: "8 months old" },
  atlas: { id: "atlas", name: "Atlas", image: exampleImages.atlas, breed: "Great Pyrenees, Mixed Breed", gender: "Male", age: "3 years old" },
  maple: { id: "maple", name: "Maple", image: exampleImages.maple, breed: "Cocker Spaniel Mix", gender: "Female", age: "2 years old" },
  ranger: { id: "ranger", name: "Ranger", image: exampleImages.ranger, breed: "Terrier Mix", gender: "Male", age: "4 years old" },
  poppy: { id: "poppy", name: "Poppy", image: exampleImages.poppy, breed: "Bichon Mix", gender: "Female", age: "1 year old" },
  biscuit: { id: "biscuit", name: "Biscuit", image: exampleImages.biscuit, breed: "Beagle", gender: "Male", age: "3 years old" },
} as const;

export const EXAMPLE_RESCUE = { rescueId: "example-rescue", rescueName: "Example Rescue" } as const;
