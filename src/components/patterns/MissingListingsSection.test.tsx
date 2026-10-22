import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import MissingListingsSection, { type MissingListing } from "@/components/patterns/MissingListingsSection";

const makeListing = (overrides: Partial<MissingListing> & Pick<MissingListing, "id">): MissingListing => ({
  status: "missing",
  notes: `Notes for ${overrides.id}`,
  ...overrides,
});

const listings: MissingListing[] = [
  makeListing({
    id: "doris",
    name: "Doris",
    reportedAt: "October 20, 2026",
    area: "Near Oak Tree Dr",
    safetyNote: "Very fearful. Please do not chase.",
    media: [{ src: "/flyer.webp", alt: "Doris flyer" }],
    sightingsAction: { label: "Text a sighting to (555) 555-0100", href: "sms:+15555550100" },
  }),
  makeListing({ id: "home-1", name: "Biscuit", status: "found" }),
  makeListing({ id: "archived-1", name: "Rex", status: "archived" }),
];

describe("MissingListingsSection", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("lists only missing notices by default", () => {
    render(<MissingListingsSection listings={listings} />);

    expect(screen.getByText("Notes for doris")).toBeInTheDocument();
    expect(screen.queryByText("Notes for home-1")).not.toBeInTheDocument();
    expect(screen.queryByText("Notes for archived-1")).not.toBeInTheDocument();
  });

  it("opts in to found and archived notices", () => {
    render(<MissingListingsSection listings={listings} showFound showArchived />);

    expect(screen.getByText("Notes for home-1")).toBeInTheDocument();
    expect(screen.getByText("Notes for archived-1")).toBeInTheDocument();
  });

  it("honours an explicit statusFilter", () => {
    render(<MissingListingsSection listings={listings} statusFilter={["found"]} />);

    expect(screen.getByText("Notes for home-1")).toBeInTheDocument();
    expect(screen.queryByText("Notes for doris")).not.toBeInTheDocument();
  });

  it("renders the name heading, or a generic heading for a nameless dog", () => {
    render(
      <MissingListingsSection
        listings={[listings[0], makeListing({ id: "nameless" })]}
        labels={{ noticeTitle: "Perro Perdido" }}
      />,
    );

    expect(screen.getByRole("heading", { level: 4, name: "Doris (Perro Perdido)" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 4, name: "Perro Perdido" })).toBeInTheDocument();
  });

  it("shows the safety line, reported date and last-seen area when set", () => {
    render(<MissingListingsSection listings={[listings[0]]} />);

    expect(screen.getByText("Very fearful. Please do not chase.")).toBeInTheDocument();
    expect(screen.getByText("Posted:")).toBeInTheDocument();
    expect(screen.getByText("October 20, 2026")).toBeInTheDocument();
    expect(screen.getByText("Last seen:")).toBeInTheDocument();
    expect(screen.getByText("Near Oak Tree Dr")).toBeInTheDocument();
  });

  it("omits the safety line and detail rows when not set", () => {
    render(<MissingListingsSection listings={[makeListing({ id: "bare", name: "Bare" })]} />);

    expect(screen.queryByText("Posted:")).not.toBeInTheDocument();
    expect(screen.queryByText("Last seen:")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders the sightings action as a tappable sms link", () => {
    render(<MissingListingsSection listings={[listings[0]]} />);

    const action = screen.getByRole("link", { name: "Text a sighting to (555) 555-0100" });
    expect(action).toHaveAttribute("href", "sms:+15555550100");
  });

  it("drops a sightings action whose scheme is not allowed", () => {
    render(
      <MissingListingsSection
        listings={[
          makeListing({
            id: "bad",
            name: "Bad",
            sightingsAction: { label: "Click me", href: "javascript:alert(1)" },
          }),
        ]}
      />,
    );

    expect(screen.queryByRole("link", { name: "Click me" })).not.toBeInTheDocument();
  });

  it("opens an image full-size in a new tab, with an optional href override", () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    render(
      <MissingListingsSection
        listings={[
          listings[0],
          makeListing({ id: "big", name: "Big", media: [{ src: "/thumb.webp", alt: "Big thumb", href: "/full.webp" }] }),
        ]}
      />,
    );

    screen.getByRole("button", { name: "Doris flyer" }).click();
    expect(open).toHaveBeenLastCalledWith("/flyer.webp", "_blank", "noopener,noreferrer");
    screen.getByRole("button", { name: "Big thumb" }).click();
    expect(open).toHaveBeenLastCalledWith("/full.webp", "_blank", "noopener,noreferrer");
  });

  it("shows several images as a carousel with the featured one first", () => {
    render(
      <MissingListingsSection
        listings={[
          makeListing({
            id: "multi",
            name: "Multi",
            media: [
              { src: "/a.webp", alt: "Photo A" },
              { src: "/b.webp", alt: "Photo B", featured: true },
              { src: "/c.webp", alt: "Photo C" },
            ],
          }),
        ]}
      />,
    );

    expect(screen.getAllByRole("img").map((img) => img.getAttribute("alt"))).toEqual(["Photo B", "Photo A", "Photo C"]);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("shows a single image with no carousel count", () => {
    render(<MissingListingsSection listings={[listings[0]]} />);

    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });

  it("falls back to a generic alt when an image has none", () => {
    render(
      <MissingListingsSection
        listings={[makeListing({ id: "noalt", name: "Rex", media: [{ src: "/r.webp" }] })]}
        labels={{ imageFallbackAltPrefix: "Flyer for " }}
      />,
    );

    expect(screen.getByAltText("Flyer for Rex")).toBeInTheDocument();
  });

  it("shows the empty message when nothing is visible", () => {
    render(<MissingListingsSection listings={[listings[1]]} emptyMessage="Nothing posted." />);

    expect(screen.getByText("Nothing posted.")).toBeInTheDocument();
  });

  it("renders the optional title band only when passed", () => {
    const { rerender } = render(<MissingListingsSection listings={[]} />);
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();

    rerender(<MissingListingsSection listings={[]} title="Lost & Found" description="Dogs we are watching for." />);
    expect(screen.getByRole("heading", { level: 2, name: "Lost & Found" })).toBeInTheDocument();
    expect(screen.getByText("Dogs we are watching for.")).toBeInTheDocument();
  });

  it("renders no source link and no page-level guidance", () => {
    render(<MissingListingsSection listings={[listings[0]]} />);

    expect(screen.queryByText(/view source/i)).not.toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(1); // the sightings action only
  });
});
