import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import PawPlacerEmbed from "@/components/patterns/PawPlacerEmbed";

afterEach(() => {
  document.querySelectorAll('script[src="https://www.pawplacer.com/embed/component"]').forEach((el) => el.remove());
  delete window.embedPawPlacerComponent;
});

describe("PawPlacerEmbed", () => {
  it("injects the PawPlacer embed script once and calls embedPawPlacerComponent with the org id", () => {
    window.embedPawPlacerComponent = vi.fn();

    render(<PawPlacerEmbed organizationId="f2dde60b-b590-419c-8433-3df89bebf641" />);

    expect(window.embedPawPlacerComponent).toHaveBeenCalledWith(
      "pets",
      "f2dde60b-b590-419c-8433-3df89bebf641",
      expect.stringContaining("pawplacer-pets-"),
      undefined,
    );
  });

  it("passes a species filter through as the options argument", () => {
    window.embedPawPlacerComponent = vi.fn();

    render(<PawPlacerEmbed organizationId="f2dde60b-b590-419c-8433-3df89bebf641" species="dog" />);

    expect(window.embedPawPlacerComponent).toHaveBeenCalledWith(
      "pets",
      "f2dde60b-b590-419c-8433-3df89bebf641",
      expect.stringContaining("pawplacer-pets-"),
      { species: "dog" },
    );
  });

  it("defaults the PawPlacer cross-link to the shelters page for the org id", () => {
    render(<PawPlacerEmbed organizationId="f2dde60b-b590-419c-8433-3df89bebf641" showEmbed={false} />);

    expect(screen.getByRole("link", { name: "PawPlacer" })).toHaveAttribute(
      "href",
      "https://www.pawplacer.com/shelters/f2dde60b-b590-419c-8433-3df89bebf641",
    );
  });

  it("renders cross-links to other platforms only when provided", () => {
    render(
      <PawPlacerEmbed
        organizationId="f2dde60b-b590-419c-8433-3df89bebf641"
        showEmbed={false}
        petfinderUrl="https://www.petfinder.com/member/us/ca/example"
        adoptAPetUrl="https://www.adoptapet.com/shelter/example"
      />,
    );

    expect(screen.getByRole("link", { name: "Petfinder" })).toHaveAttribute(
      "href",
      "https://www.petfinder.com/member/us/ca/example",
    );
    expect(screen.getByRole("link", { name: "Adopt-a-Pet" })).toHaveAttribute(
      "href",
      "https://www.adoptapet.com/shelter/example",
    );
    expect(screen.queryByRole("link", { name: "GetBuddy" })).not.toBeInTheDocument();
  });

  it("does not render the embed mount point when showEmbed is false", () => {
    const { container } = render(
      <PawPlacerEmbed organizationId="f2dde60b-b590-419c-8433-3df89bebf641" showEmbed={false} />,
    );

    expect(container.querySelector('[id^="pawplacer-pets-"]')).not.toBeInTheDocument();
  });
});
