import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TestimonialsSection, {
  splitQuoteParagraphs,
  type TestimonialItem,
} from "@/components/patterns/TestimonialsSection";

const letter: TestimonialItem = {
  id: "letter",
  quote: "Opening paragraph.\n\nA line.\nAnother line.\nA third line.\n\nClosing paragraph.",
  pullQuote: "Opening paragraph.",
  author: "Sam",
  authorMeta: "Foster Family",
  authorHref: "https://example.com",
};

describe("splitQuoteParagraphs", () => {
  it("splits on blank lines and keeps single newlines inside a paragraph", () => {
    expect(splitQuoteParagraphs(letter.quote)).toEqual([
      "Opening paragraph.",
      "A line.\nAnother line.\nA third line.",
      "Closing paragraph.",
    ]);
  });

  it("normalizes CRLF and whitespace around newlines, and collapses 3+ newlines", () => {
    expect(splitQuoteParagraphs("One.  \r\n\r\n  Two.\n\n\n\nThree.\n")).toEqual(["One.", "Two.", "Three."]);
  });
});

describe("TestimonialsSection longform", () => {
  it("renders every paragraph, with a line break per grouped line", () => {
    const { container } = render(<TestimonialsSection testimonials={[letter]} layout="longform" />);

    const quote = container.querySelector("blockquote");
    expect(quote?.querySelectorAll("p")).toHaveLength(3);
    expect(quote?.querySelectorAll("br")).toHaveLength(2);
  });

  it("renders the body without italics or literal quote characters", () => {
    const { container } = render(<TestimonialsSection testimonials={[letter]} layout="longform" />);

    const quote = container.querySelector("blockquote");
    expect(quote?.className).not.toContain("italic");
    expect(quote?.textContent).not.toContain('"');
  });

  it("hides the pull quote from assistive tech because it repeats the body", () => {
    const { container } = render(<TestimonialsSection testimonials={[letter]} layout="longform" />);

    expect(container.querySelector('p[aria-hidden="true"]')?.textContent).toBe("Opening paragraph.");
  });

  it("links the attribution meta and drops an unsafe scheme", () => {
    const { rerender } = render(<TestimonialsSection testimonials={[letter]} layout="longform" />);
    expect(screen.getByRole("link", { name: "Foster Family" })).toHaveAttribute("href", "https://example.com");

    rerender(
      <TestimonialsSection
        testimonials={[{ ...letter, authorHref: "javascript:alert(1)" }]}
        layout="longform"
      />,
    );
    expect(screen.queryByRole("link", { name: "Foster Family" })).not.toBeInTheDocument();
    expect(screen.getByText("Foster Family")).toBeInTheDocument();
  });

  it("ignores featuredStrategy and selects deterministically by featuredIndex", () => {
    const items: TestimonialItem[] = [
      { id: "a", quote: "First letter." },
      { id: "b", quote: "Second letter." },
    ];

    for (let attempt = 0; attempt < 20; attempt += 1) {
      const { container, unmount } = render(
        <TestimonialsSection
          testimonials={items}
          layout="longform"
          featuredIndex={1}
          featuredStrategy="randomOnLoad"
        />,
      );
      expect(container.querySelector("blockquote")?.textContent).toBe("Second letter.");
      unmount();
    }
  });

  it("ignores excerpt in longform but uses it in grid and featured", () => {
    const long: TestimonialItem = { id: "x", quote: "The whole thing.", excerpt: "Short version." };

    const { container: longform } = render(<TestimonialsSection testimonials={[long]} layout="longform" />);
    expect(longform.querySelector("blockquote")?.textContent).toBe("The whole thing.");

    const { container: grid } = render(<TestimonialsSection testimonials={[long]} layout="grid" />);
    expect(grid.textContent).toContain("Short version.");
    expect(grid.textContent).not.toContain("The whole thing.");

    const { container: featured } = render(<TestimonialsSection testimonials={[long]} layout="featured" />);
    expect(featured.textContent).toContain("Short version.");
  });

  it("falls back to the full quote when no excerpt is set", () => {
    const { container } = render(
      <TestimonialsSection testimonials={[{ id: "y", quote: "Only the quote." }]} layout="grid" />,
    );

    expect(container.textContent).toContain("Only the quote.");
  });
});
