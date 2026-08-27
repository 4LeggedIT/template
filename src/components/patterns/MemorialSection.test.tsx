import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MemorialSection, { type MemorialEntry } from "@/components/patterns/MemorialSection";

describe("MemorialSection", () => {
  it("renders the empty-state message when there are no entries", () => {
    render(<MemorialSection entries={[]} emptyMessage="Check back soon." />);

    expect(screen.getByText("Check back soon.")).toBeInTheDocument();
  });

  it("renders every field when present", () => {
    const entries: MemorialEntry[] = [
      {
        id: "sweet-hops",
        name: "Sweet Hops",
        photos: ["/sweet-hops.webp"],
        dates: "January 2026 – May 2026",
        message: ["He was cared for, comforted, and loved."],
        badge: "Our founding rescue",
        closingLine: "Our fight continues.",
        externalHref: { label: "Read David's Reflection", href: "https://example.com/post" },
      },
    ];

    render(<MemorialSection entries={entries} />);

    expect(screen.getByText("Sweet Hops")).toBeInTheDocument();
    expect(screen.getByText("Our founding rescue")).toBeInTheDocument();
    expect(screen.getByText("January 2026 – May 2026")).toBeInTheDocument();
    expect(screen.getByText("He was cared for, comforted, and loved.")).toBeInTheDocument();
    expect(screen.getByText("Our fight continues.")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Read David's Reflection" });
    expect(link).toHaveAttribute("href", "https://example.com/post");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("omits absent optional fields without rendering empty markup", () => {
    const entries: MemorialEntry[] = [
      {
        id: "shelby",
        name: "Shelby",
        photos: ["/shelby.webp"],
        message: ["Some dogs leave paw prints on the floor."],
      },
    ];

    render(<MemorialSection entries={entries} />);

    expect(screen.getByText("Shelby")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders a paw-icon fallback when photos is empty", () => {
    const entries: MemorialEntry[] = [
      { id: "bear", name: "Bear", photos: [], message: ["Remembered for making us laugh."] },
    ];

    const { container } = render(<MemorialSection entries={entries} />);

    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
