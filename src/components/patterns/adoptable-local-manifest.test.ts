import { describe, expect, it } from "vitest";
import { mapLocalAdoptableManifest, type LocalAdoptableManifestItem } from "./adoptable-local-manifest";

const base: LocalAdoptableManifestItem[] = [
  {
    id: "dog-1",
    name: "Alpha",
    rescueId: "rescue-a",
    rescueName: "Rescue A",
    image: "/animals/alpha.jpg",
    detailsUrl: "https://www.petfinder.com/dog/alpha/details/",
    gender: "Female",
    breed: "Mixed",
    age: "Young",
    birthDate: "2024-03-15",
    size: "Medium",
    temperament: "Calm and gentle",
    goodWithDogs: true,
    goodWithKids: true,
    goodWithCats: false,
  },
  {
    id: "cat-1",
    name: "Whiskers",
    rescueId: "rescue-a",
    rescueName: "Rescue A",
    image: "/animals/whiskers.jpg",
    detailsUrl: "https://www.petfinder.com/cat/whiskers/details/",
    gender: "Male",
    breed: "Tabby",
    age: "Adult",
  },
  {
    id: "dog-2",
    name: "Bravo",
    rescueId: "rescue-b",
    rescueName: "Rescue B",
    images: ["/animals/bravo-1.jpg", "/animals/bravo-2.jpg"],
    image: "/animals/bravo-1.jpg",
    detailsUrl: "https://www.petfinder.com/dog/bravo/details/",
    gender: "Male",
    breed: "Shepherd",
    age: "Puppy",
    goodWithDogs: true,
    goodWithKids: false,
    goodWithCats: true,
  },
];

describe("mapLocalAdoptableManifest", () => {
  it("maps manifest fields into AdoptablePetLocalItem fields", () => {
    const withAlias = [{ ...base[0], alias: "AJ" }, ...base.slice(1)];
    const output = mapLocalAdoptableManifest(base, { sort: "none" });
    expect(output[0]).toMatchObject({
      id: "dog-1",
      name: "Alpha",
      imageSrc: "/animals/alpha.jpg",
      gender: "Female",
      ageLabel: "Young",
      breed: "Mixed",
      size: "Medium",
      birthDate: "2024-03-15",
      temperament: "Calm and gentle",
      goodWithDogs: true,
      goodWithKids: true,
      goodWithCats: false,
    });
    const outputWithAlias = mapLocalAdoptableManifest(withAlias, { sort: "none" });
    expect(outputWithAlias[0]?.alias).toBe("AJ");
  });

  it("keeps cat records", () => {
    const output = mapLocalAdoptableManifest(base);
    expect(output.map((pet) => pet.id)).toEqual(["dog-1", "dog-2", "cat-1"]);
  });

  it("applies hidden filters", () => {
    const output = mapLocalAdoptableManifest(base, {
      hiddenFilters: [{ animalName: "Bravo" }],
    });
    expect(output.map((pet) => pet.id)).toEqual(["dog-1", "cat-1"]);
  });

  it("uses images[] array as primary source and sets imageSrc to first image", () => {
    const output = mapLocalAdoptableManifest(base, { sort: "none" });
    const bravo = output.find((p) => p.id === "dog-2");
    expect(bravo?.imageSrc).toBe("/animals/bravo-1.jpg");
    expect(bravo?.images).toEqual(["/animals/bravo-1.jpg", "/animals/bravo-2.jpg"]);
  });

  it("falls back to image field when images[] is absent", () => {
    const output = mapLocalAdoptableManifest(base, { sort: "none" });
    const alpha = output.find((p) => p.id === "dog-1");
    expect(alpha?.imageSrc).toBe("/animals/alpha.jpg");
    expect(alpha?.images).toBeUndefined();
  });

  it("maps goodWith* boolean fields correctly", () => {
    const output = mapLocalAdoptableManifest(base, { sort: "none" });
    const bravo = output.find((p) => p.id === "dog-2");
    expect(bravo?.goodWithDogs).toBe(true);
    expect(bravo?.goodWithKids).toBe(false);
    expect(bravo?.goodWithCats).toBe(true);
  });

  it("leaves goodWith* fields undefined when not specified in manifest", () => {
    const output = mapLocalAdoptableManifest(base, { sort: "none" });
    const whiskers = output.find((p) => p.id === "cat-1");
    expect(whiskers?.goodWithDogs).toBeUndefined();
    expect(whiskers?.goodWithKids).toBeUndefined();
    expect(whiskers?.goodWithCats).toBeUndefined();
  });
});
