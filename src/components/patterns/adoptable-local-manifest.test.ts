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
    image: "/animals/bravo.jpg",
    detailsUrl: "https://www.petfinder.com/dog/bravo/details/",
    gender: "Male",
    breed: "Shepherd",
    age: "Puppy",
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
});
