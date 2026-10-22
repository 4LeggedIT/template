import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import FoundListingsSection, { type FoundListing } from "@/components/patterns/FoundListingsSection";

const makeListing = (overrides: Partial<FoundListing> & Pick<FoundListing, "id">): FoundListing => ({
  source: { type: "local" },
  status: "open",
  notes: `Notes for ${overrides.id}`,
  media: [],
  ...overrides,
});

const listings: FoundListing[] = [
  makeListing({
    id: "open-1",
    foundAt: "October 9, 2026",
    location: { crossStreets: "Main St and 1st Ave" },
    pet: { gender: "Male", microchipStatus: "None" },
  }),
  makeListing({ id: "hold-1", status: "hold" }),
  makeListing({ id: "reunited-1", status: "reunited" }),
  makeListing({ id: "archived-1", status: "archived" }),
  makeListing({ id: "external-1", source: { type: "external", name: "Partner", url: "https://example.org/n/1" } }),
];

describe("FoundListingsSection", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("lists open and hold notices by default and hides reunited/archived", () => {
    render(<FoundListingsSection mode="hybrid" listings={listings} />);

    expect(screen.getByText("Notes for open-1")).toBeInTheDocument();
    expect(screen.getByText("Notes for hold-1")).toBeInTheDocument();
    expect(screen.queryByText("Notes for reunited-1")).not.toBeInTheDocument();
    expect(screen.queryByText("Notes for archived-1")).not.toBeInTheDocument();
  });

  it("opts in to reunited and archived notices", () => {
    render(<FoundListingsSection mode="hybrid" listings={listings} showReunited showArchived />);

    expect(screen.getByText("Notes for reunited-1")).toBeInTheDocument();
    expect(screen.getByText("Notes for archived-1")).toBeInTheDocument();
  });

  it("filters by source type unless mode is hybrid", () => {
    render(<FoundListingsSection mode="local" listings={listings} />);

    expect(screen.getByText("Notes for open-1")).toBeInTheDocument();
    expect(screen.queryByText("Notes for external-1")).not.toBeInTheDocument();
  });

  it("renders a generic heading with the structured fields and no notice number", () => {
    render(<FoundListingsSection mode="local" listings={[listings[0]]} labels={{ noticeTitle: "Perro Encontrado" }} />);

    const heading = screen.getByRole("heading", { level: 4, name: "Perro Encontrado" });
    expect(heading.textContent).not.toMatch(/open-1|#/);
    expect(screen.getByText("Male")).toBeInTheDocument();
    expect(screen.getByText("October 9, 2026")).toBeInTheDocument();
    expect(screen.getByText("Main St and 1st Ave")).toBeInTheDocument();
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  it("links to the source only when source.url is set", () => {
    render(<FoundListingsSection mode="hybrid" listings={[listings[0], listings[4]]} />);

    const sourceLinks = screen.getAllByRole("link", { name: /View source listing/ });
    expect(sourceLinks).toHaveLength(1);
    expect(sourceLinks[0]).toHaveAttribute("href", "https://example.org/n/1");
  });

  it("shows the empty message and renders no public-guidance blocks", () => {
    render(<FoundListingsSection mode="local" listings={[]} emptyMessage="Nothing posted." />);

    expect(screen.getByText("Nothing posted.")).toBeInTheDocument();
    expect(screen.queryByText(/Please Keep Them Safe/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/How Reunification Works/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/What to Include/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("shows every image as a carousel, featured first, and opens one full-size in a new tab", () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    render(
      <FoundListingsSection
        mode="local"
        listings={[
          makeListing({
            id: "multi",
            media: [
              { id: "m1", src: "/a.webp", alt: "Photo A" },
              { id: "m2", src: "/b.webp", alt: "Photo B", featured: true, href: "/b-full.webp" },
              { id: "m3", src: "/c.webp", alt: "Photo C" },
            ],
          }),
        ]}
      />,
    );

    expect(screen.getAllByRole("img").map((img) => img.getAttribute("alt"))).toEqual(["Photo B", "Photo A", "Photo C"]);
    expect(screen.getByText("3")).toBeInTheDocument();

    screen.getByRole("button", { name: "Photo B" }).click();
    expect(open).toHaveBeenLastCalledWith("/b-full.webp", "_blank", "noopener,noreferrer");
    screen.getByRole("button", { name: "Photo C" }).click();
    expect(open).toHaveBeenLastCalledWith("/c.webp", "_blank", "noopener,noreferrer");
  });

  it("shows a single image plain, with a generic alt fallback and no carousel count", () => {
    render(
      <FoundListingsSection
        mode="local"
        listings={[makeListing({ id: "solo", media: [{ id: "s1", src: "/s.webp" }] })]}
        labels={{ imageFallbackAltPrefix: "Found notice " }}
      />,
    );

    expect(screen.getByAltText("Found notice solo")).toBeInTheDocument();
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });
});
