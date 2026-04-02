import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PetfinderScrollerEmbed from "@/components/patterns/PetfinderScrollerEmbed";
import { normalizePetfinderBaseUrl } from "@/components/patterns/petfinder-url";

describe("normalizePetfinderBaseUrl", () => {
  it("normalizes member URLs to the Petfinder site root", () => {
    expect(
      normalizePetfinderBaseUrl("https://www.petfinder.com/member/us/ca/murrieta/rovers-return-rescue-ca3208/"),
    ).toBe("https://www.petfinder.com/");
  });

  it("falls back to the default Petfinder root for invalid values", () => {
    expect(normalizePetfinderBaseUrl("not-a-url")).toBe("https://www.petfinder.com/");
    expect(normalizePetfinderBaseUrl()).toBe("https://www.petfinder.com/");
  });
});

describe("PetfinderScrollerEmbed", () => {
  it("uses Petfinder root for widget links and keeps member URL for direct rescue link", () => {
    render(
      <PetfinderScrollerEmbed
        title="Test Petfinder"
        organizationIds={["CA3208"]}
        petfinderUrl="https://www.petfinder.com/member/us/ca/murrieta/rovers-return-rescue-ca3208/"
        showScriptTag={false}
      />,
    );

    const scroller = document.querySelector("pet-scroller");
    expect(scroller).not.toBeNull();
    expect(scroller?.getAttribute("petfinderurl")).toBe("https://www.petfinder.com/");

    const link = screen.getByRole("link", { name: "Petfinder" });
    expect(link).toHaveAttribute(
      "href",
      "https://www.petfinder.com/member/us/ca/murrieta/rovers-return-rescue-ca3208/",
    );
  });
});
