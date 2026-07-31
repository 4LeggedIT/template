import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FlyerLibrarySection, { type FlyerLibraryItem } from "@/components/patterns/FlyerLibrarySection";

const flyers: FlyerLibraryItem[] = [
  { id: "foster-1", src: "https://example.org/foster.jpg", alt: "Foster recruitment flyer", category: "foster" },
  { id: "volunteer-1", src: "https://example.org/volunteer.jpg", alt: "Volunteer recruitment flyer", category: "volunteer" },
];

describe("FlyerLibrarySection", () => {
  it("renders the empty message when there are no flyers", () => {
    render(<FlyerLibrarySection flyers={[]} />);

    expect(screen.getByText("Flyers coming soon.")).toBeInTheDocument();
  });

  it("renders one card per flyer", () => {
    render(<FlyerLibrarySection flyers={flyers} />);

    expect(screen.getByAltText("Foster recruitment flyer")).toBeInTheDocument();
    expect(screen.getByAltText("Volunteer recruitment flyer")).toBeInTheDocument();
  });

  it("filters by category when a pill is clicked", () => {
    render(<FlyerLibrarySection flyers={flyers} />);

    fireEvent.click(screen.getByRole("button", { name: "Foster" }));

    expect(screen.getByAltText("Foster recruitment flyer")).toBeInTheDocument();
    expect(screen.queryByAltText("Volunteer recruitment flyer")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "All" }));

    expect(screen.getByAltText("Volunteer recruitment flyer")).toBeInTheDocument();
  });

  it("locks to a single category and hides filter pills when categoryFilter is set", () => {
    render(<FlyerLibrarySection flyers={flyers} categoryFilter="foster" />);

    expect(screen.getByAltText("Foster recruitment flyer")).toBeInTheDocument();
    expect(screen.queryByAltText("Volunteer recruitment flyer")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "All" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Volunteer" })).not.toBeInTheDocument();
  });

  it("opens the lightbox on click and closes on Escape", () => {
    render(<FlyerLibrarySection flyers={flyers} />);

    fireEvent.click(screen.getByAltText("Foster recruitment flyer"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("cycles between flyers in the lightbox with arrow keys", () => {
    render(<FlyerLibrarySection flyers={flyers} />);

    fireEvent.click(screen.getByAltText("Foster recruitment flyer"));

    fireEvent.keyDown(window, { key: "ArrowRight" });
    const dialogImage = within(screen.getByRole("dialog")).getByRole("img");
    expect(dialogImage).toHaveAttribute("alt", "Volunteer recruitment flyer");
  });

  it("renders the download link using downloadHref/downloadFileName, not a new-tab link", () => {
    const downloadFlyers: FlyerLibraryItem[] = [
      {
        id: "foster-1",
        src: "https://example.org/foster.jpg",
        alt: "Foster recruitment flyer",
        category: "foster",
        downloadHref: "https://example.org/foster-original.jpg",
        downloadFileName: "foster-flyer.jpg",
      },
    ];
    render(<FlyerLibrarySection flyers={downloadFlyers} />);

    fireEvent.click(screen.getByAltText("Foster recruitment flyer"));

    const downloadLink = screen.getByRole("link", { name: /Download flyer/i });
    expect(downloadLink).toHaveAttribute("href", "https://example.org/foster-original.jpg");
    expect(downloadLink).toHaveAttribute("download", "foster-flyer.jpg");
    expect(downloadLink).not.toHaveAttribute("target", "_blank");
  });

  it("allows label overrides", () => {
    render(<FlyerLibrarySection flyers={flyers} labels={{ downloadLabel: "Save flyer" }} />);

    fireEvent.click(screen.getByAltText("Foster recruitment flyer"));

    expect(screen.getByRole("link", { name: /Save flyer/i })).toBeInTheDocument();
  });
});
