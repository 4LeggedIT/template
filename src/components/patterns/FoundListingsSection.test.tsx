import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import FoundListingsSection, {
  DEFAULT_FOUND_LISTING_EXPIRY_DAYS,
  type FoundListing,
} from "@/components/patterns/FoundListingsSection";

const makeListing = (overrides: Partial<FoundListing> & Pick<FoundListing, "id">): FoundListing => ({
  source: { type: "local" },
  status: "open",
  foundAtISO: "2026-10-20",
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
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-26T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
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

  it("prints the posted date from foundAtISO and only links http(s) sources", () => {
    render(
      <FoundListingsSection
        mode="hybrid"
        dateLocale="en-US"
        listings={[
          makeListing({ id: "linked", source: { type: "local", name: "Facebook", url: "https://www.facebook.com/x" } }),
          makeListing({ id: "unsafe", source: { type: "local", url: "javascript:alert(1)" } }),
        ]}
      />,
    );

    expect(screen.getAllByText("October 20, 2026")).toHaveLength(2);
    const links = screen.getAllByRole("link", { name: /View source listing/ });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "https://www.facebook.com/x");
  });

  describe("expiry", () => {
    const aged = (id: string, foundAtISO: string, extra: Partial<FoundListing> = {}) =>
      makeListing({ id, foundAtISO, ...extra });

    it("defaults to 30 days and hides (does not delete) older open/hold notices", () => {
      expect(DEFAULT_FOUND_LISTING_EXPIRY_DAYS).toBe(30);
      const items = [
        aged("fresh", "2026-10-20"),
        aged("edge-visible", "2026-09-27"),
        aged("edge-expired", "2026-09-26"),
        aged("old-hold", "2026-08-01", { status: "hold" }),
      ];
      render(<FoundListingsSection mode="local" listings={items} />);

      expect(screen.getByText("Notes for fresh")).toBeInTheDocument();
      expect(screen.getByText("Notes for edge-visible")).toBeInTheDocument();
      expect(screen.queryByText("Notes for edge-expired")).not.toBeInTheDocument();
      expect(screen.queryByText("Notes for old-hold")).not.toBeInTheDocument();
      expect(items).toHaveLength(4);
    });

    it("lets a site change the window with expireAfterDays", () => {
      const items = [aged("six-days", "2026-10-20"), aged("two-days", "2026-10-24")];
      render(<FoundListingsSection mode="local" listings={items} expireAfterDays={3} />);

      expect(screen.queryByText("Notes for six-days")).not.toBeInTheDocument();
      expect(screen.getByText("Notes for two-days")).toBeInTheDocument();
    });

    it("cannot be disabled: a non-positive or invalid expireAfterDays falls back to 30", () => {
      for (const bad of [0, -5, Number.NaN]) {
        const { unmount } = render(
          <FoundListingsSection mode="local" listings={[aged("old", "2026-08-01")]} expireAfterDays={bad} />,
        );
        expect(screen.queryByText("Notes for old")).not.toBeInTheDocument();
        unmount();
      }
    });

    it("honors a per-notice expiresAt over the window, through the end of that day", () => {
      const items = [
        aged("extended", "2026-08-01", { expiresAt: "2026-10-26" }),
        aged("retired-early", "2026-10-25", { expiresAt: "2026-10-25" }),
      ];
      render(<FoundListingsSection mode="local" listings={items} />);

      expect(screen.getByText("Notes for extended")).toBeInTheDocument();
      expect(screen.queryByText("Notes for retired-early")).not.toBeInTheDocument();
    });

    it("does not expire reunited/archived notices that a site opted in to show", () => {
      render(
        <FoundListingsSection
          mode="local"
          listings={[aged("old-reunited", "2026-08-01", { status: "reunited" })]}
          showReunited
        />,
      );

      expect(screen.getByText("Notes for old-reunited")).toBeInTheDocument();
    });
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
