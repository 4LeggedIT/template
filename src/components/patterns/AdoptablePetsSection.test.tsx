import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AdoptablePetsSection from "@/components/patterns/AdoptablePetsSection";

const localPets = [
  { id: "2", name: "Zeus", imageSrc: "https://example.org/zeus.jpg" },
  { id: "1", name: "alejandro", imageSrc: "https://example.org/alejandro.jpg" },
];

describe("AdoptablePetsSection local listings", () => {
  it("sorts local pets by name ascending by default", () => {
    render(<AdoptablePetsSection mode="local" localPets={localPets} />);

    const names = screen.getAllByRole("heading", { level: 5 }).map((node) => node.textContent);
    expect(names).toEqual(["alejandro", "Zeus"]);
  });

  it("can preserve source ordering when localSort is none", () => {
    render(<AdoptablePetsSection mode="local" localPets={localPets} localSort="none" />);

    const names = screen.getAllByRole("heading", { level: 5 }).map((node) => node.textContent);
    expect(names).toEqual(["Zeus", "alejandro"]);
  });

  it("uses object-contain by default and allows per-pet override", () => {
    render(
      <AdoptablePetsSection
        mode="local"
        localPets={[
          { id: "1", name: "Nora", imageSrc: "https://example.org/nora.jpg" },
          { id: "2", name: "Ben", imageSrc: "https://example.org/ben.jpg", imageFit: "cover" },
        ]}
      />,
    );

    const containImage = screen.getByAltText("Meet Nora");
    const coverImage = screen.getByAltText("Meet Ben");

    expect(containImage).toHaveClass("object-contain");
    expect(containImage).toHaveClass("bg-muted");
    expect(coverImage).toHaveClass("object-cover");
  });

  it("defaults description summaries to About and allows an override label", () => {
    const { rerender } = render(
      <AdoptablePetsSection
        mode="local"
        localPets={[{ id: "1", name: "Nora", imageSrc: "https://example.org/nora.jpg", description: "Friendly dog" }]}
      />,
    );

    expect(screen.getByText("About Nora")).toBeInTheDocument();

    rerender(
      <AdoptablePetsSection
        mode="local"
        localPets={[{ id: "1", name: "Nora", imageSrc: "https://example.org/nora.jpg", description: "Friendly dog" }]}
        localDescriptionSummaryLabel="Meet"
      />,
    );

    expect(screen.getByText("Meet Nora")).toBeInTheDocument();
  });

  it("renders section-level footer CTA and does not render per-card apply buttons", () => {
    render(
      <AdoptablePetsSection
        mode="local"
        localPets={[{ id: "1", name: "Nora", imageSrc: "https://example.org/nora.jpg" }]}
        ctas={[{ label: "Adoption Process", href: "https://example.org/adopt", external: true }]}
        footerCta={{ label: "Apply to Adopt", href: "https://example.org/adopt", external: true }}
      />,
    );

    expect(screen.getByRole("link", { name: "Apply to Adopt" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Apply to adopt/i })).not.toBeInTheDocument();
  });

  it("renders GetBuddy embed with organization id and species", () => {
    render(
      <AdoptablePetsSection
        mode="getbuddy"
        getBuddy={{ organizationId: "698df87638deec858362b42b", species: "dog" }}
      />,
    );

    const iframe = screen.getByTitle("GetBuddy Listings");
    expect(iframe).toHaveAttribute("src", "https://www.getbuddy.com/embed/698df87638deec858362b42b?species=dog");
  });
});
