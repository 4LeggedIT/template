import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MissingListingsSection, {
  DEFAULT_MISSING_LISTING_EXPIRY_DAYS,
  type MissingListing,
} from "@/components/patterns/MissingListingsSection";

const makeListing = (overrides: Partial<MissingListing> & Pick<MissingListing, "id">): MissingListing => ({
  status: "missing",
  reportedAtISO: "2026-10-20",
  notes: `Notes for ${overrides.id}`,
  ...overrides,
});

const listings: MissingListing[] = [
  makeListing({
    id: "doris",
    name: "Doris",
    area: "Near Oak Tree Dr",
    safetyNote: "Very fearful. Please do not chase.",
    media: [{ src: "/flyer.webp", alt: "Doris flyer" }],
    sightingsAction: { label: "Text a sighting to (555) 555-0100", href: "sms:+15555550100" },
  }),
  makeListing({ id: "home-1", name: "Biscuit", status: "found" }),
  makeListing({ id: "archived-1", name: "Rex", status: "archived" }),
];

describe("MissingListingsSection", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-26T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("prints the posted date from reportedAtISO and links to the original post only when sourceUrl is http(s)", () => {
    render(
      <MissingListingsSection
        dateLocale="en-US"
        listings={[
          makeListing({ id: "linked", reportedAtISO: "2026-10-20", sourceUrl: "https://www.facebook.com/x", sourceName: "Facebook" }),
          makeListing({ id: "unsafe", sourceUrl: "javascript:alert(1)" }),
          makeListing({ id: "none" }),
        ]}
      />,
    );

    expect(screen.getAllByText("October 20, 2026").length).toBeGreaterThan(0);
    const links = screen.getAllByRole("link", { name: /View original post/ });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "https://www.facebook.com/x");
    expect(links[0]).toHaveAttribute("target", "_blank");
    expect(links[0]).toHaveTextContent("View original post (Facebook)");
  });

  describe("expiry", () => {
    const aged = (id: string, reportedAtISO: string, extra: Partial<MissingListing> = {}) =>
      makeListing({ id, reportedAtISO, ...extra });

    it("defaults to 60 days and hides (does not delete) older missing notices", () => {
      expect(DEFAULT_MISSING_LISTING_EXPIRY_DAYS).toBe(60);
      const items = [aged("fresh", "2026-10-20"), aged("edge-visible", "2026-08-28"), aged("edge-expired", "2026-08-27")];
      render(<MissingListingsSection listings={items} />);

      expect(screen.getByText("Notes for fresh")).toBeInTheDocument();
      expect(screen.getByText("Notes for edge-visible")).toBeInTheDocument();
      expect(screen.queryByText("Notes for edge-expired")).not.toBeInTheDocument();
      expect(items).toHaveLength(3);
    });

    it("lets a site change the window with expireAfterDays", () => {
      render(
        <MissingListingsSection
          listings={[aged("six-days", "2026-10-20"), aged("two-days", "2026-10-24")]}
          expireAfterDays={3}
        />,
      );

      expect(screen.queryByText("Notes for six-days")).not.toBeInTheDocument();
      expect(screen.getByText("Notes for two-days")).toBeInTheDocument();
    });

    it("cannot be disabled: a non-positive or invalid expireAfterDays falls back to 60", () => {
      for (const bad of [0, -5, Number.NaN]) {
        const { unmount } = render(
          <MissingListingsSection listings={[aged("old", "2026-06-01")]} expireAfterDays={bad} />,
        );
        expect(screen.queryByText("Notes for old")).not.toBeInTheDocument();
        unmount();
      }
    });

    it("honors a per-notice expiresAt over the window, through the end of that day", () => {
      render(
        <MissingListingsSection
          listings={[
            aged("extended", "2026-06-01", { expiresAt: "2026-10-26" }),
            aged("retired-early", "2026-10-25", { expiresAt: "2026-10-25" }),
          ]}
        />,
      );

      expect(screen.getByText("Notes for extended")).toBeInTheDocument();
      expect(screen.queryByText("Notes for retired-early")).not.toBeInTheDocument();
    });

    it("does not expire found/archived notices that a site opted in to show", () => {
      render(<MissingListingsSection listings={[aged("old-home", "2026-06-01", { status: "found" })]} showFound />);

      expect(screen.getByText("Notes for old-home")).toBeInTheDocument();
    });
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

  it("omits the safety line and optional detail rows when not set (the posted date always shows)", () => {
    render(<MissingListingsSection listings={[makeListing({ id: "bare", name: "Bare" })]} />);

    expect(screen.getByText("Posted:")).toBeInTheDocument();
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
