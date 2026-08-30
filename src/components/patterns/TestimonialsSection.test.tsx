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

describe("TestimonialsSection translation disclosure", () => {
  const translated: TestimonialItem = {
    id: "translated",
    quote: "Traduccion mostrada al lector.",
    author: "Natalie",
    authorMeta: "Adoptante",
    sourceLocale: "en",
    translationNote: "Traducido del original en ingles.",
  };

  it.each(["longform", "featured", "grid"] as const)("renders the note in the %s footer", (layout) => {
    render(<TestimonialsSection testimonials={[translated]} layout={layout} />);
    expect(screen.getByRole("note")).toHaveTextContent("Traducido del original en ingles.");
  });

  it("renders nothing when the item carries no note", () => {
    const { translationNote: _omitted, ...untranslated } = translated;
    render(<TestimonialsSection testimonials={[untranslated]} layout="longform" />);
    expect(screen.queryByRole("note")).toBeNull();
  });

  it("discloses only the translated items in a mixed grid", () => {
    // The direction is the call site's to decide, and it is not always en -> es:
    // a Spanish-authored quote read in English is equally a translation.
    const fromSpanish: TestimonialItem = {
      id: "from-spanish",
      quote: "Translation shown to the reader.",
      author: "Mateo",
      sourceLocale: "es",
      translationNote: "Translated from the original Spanish.",
    };
    const original: TestimonialItem = { id: "original", quote: "The author's own words.", author: "Sam" };
    render(<TestimonialsSection testimonials={[translated, fromSpanish, original]} layout="grid" columns={3} />);

    const notes = screen.getAllByRole("note").map((node) => node.textContent);
    expect(notes).toEqual(["Traducido del original en ingles.", "Translated from the original Spanish."]);
  });

  it("renders the note even when the item has no attribution to sit under", () => {
    render(
      <TestimonialsSection
        testimonials={[{ id: "anon", quote: "Sin atribucion.", translationNote: "Traducido del original en ingles." }]}
        layout="longform"
      />,
    );
    expect(screen.getByRole("note")).toBeInTheDocument();
  });
});

describe("star rating", () => {
  const rated: TestimonialItem = {
    id: "rated",
    quote: "Four solid stars.",
    author: "Carly",
    rating: 4,
  };

  it.each(["longform", "featured", "grid"] as const)("renders the rating in the %s layout", (layout) => {
    render(<TestimonialsSection testimonials={[rated]} layout={layout} />);
    expect(screen.getByText("Rated 4 out of 5 stars")).toBeInTheDocument();
  });

  it("fills to the rating and leaves the remainder empty", () => {
    render(<TestimonialsSection testimonials={[rated]} layout="longform" />);
    // Glyphs are aria-hidden, so assert on the rendered text rather than a role.
    expect(screen.getByText("★★★★")).toBeInTheDocument();
    expect(screen.getByText("☆")).toBeInTheDocument();
  });

  it("hides the glyphs from assistive tech and announces the rating once", () => {
    const { container } = render(<TestimonialsSection testimonials={[rated]} layout="longform" />);
    expect(container.querySelector('[aria-hidden="true"].tracking-\\[0\\.15em\\]')).not.toBeNull();
    expect(screen.getAllByText(/out of 5 stars/)).toHaveLength(1);
  });

  it("renders nothing when the item carries no rating", () => {
    const { rating: _omitted, ...unrated } = rated;
    render(<TestimonialsSection testimonials={[unrated]} layout="longform" />);
    expect(screen.queryByText(/out of 5 stars/)).toBeNull();
    expect(screen.queryByText(/★/)).toBeNull();
  });

  it("renders the rating even when the item has no attribution to sit under", () => {
    render(
      <TestimonialsSection testimonials={[{ id: "anon", quote: "No name.", rating: 5 }]} layout="longform" />,
    );
    expect(screen.getByText("Rated 5 out of 5 stars")).toBeInTheDocument();
  });

  it("substitutes {rating} into a call-site label override", () => {
    render(
      <TestimonialsSection
        testimonials={[rated]}
        layout="longform"
        labels={{ ratingLabel: "Valoracion: {rating} de 5 estrellas" }}
      />,
    );
    expect(screen.getByText("Valoracion: 4 de 5 estrellas")).toBeInTheDocument();
  });

  it("rates only the items that carry a rating in a mixed grid", () => {
    const unrated: TestimonialItem = { id: "unrated", quote: "No stars here.", author: "Sam" };
    render(<TestimonialsSection testimonials={[rated, unrated]} layout="grid" columns={2} />);
    expect(screen.getAllByText(/out of 5 stars/)).toHaveLength(1);
  });
});

describe("author title", () => {
  const titled: TestimonialItem = {
    id: "titled",
    quote: "A letter about the work.",
    author: "Sandra Murray",
    authorTitle: "Founder and CEO",
    authorMeta: "Rovers Return Dog Rescue",
    authorHref: "https://example.org",
  };

  it.each(["longform", "featured", "grid"] as const)("renders the title in %s", (layout) => {
    render(<TestimonialsSection testimonials={[titled]} layout={layout} />);
    expect(screen.getByText("Founder and CEO")).toBeInTheDocument();
  });

  it.each(["longform", "featured", "grid"] as const)(
    "orders the title between the name and the meta in %s",
    (layout) => {
      const { container } = render(<TestimonialsSection testimonials={[titled]} layout={layout} />);
      const attribution = container.textContent ?? "";
      expect(attribution.indexOf("Sandra Murray")).toBeLessThan(attribution.indexOf("Founder and CEO"));
      expect(attribution.indexOf("Founder and CEO")).toBeLessThan(
        attribution.indexOf("Rovers Return Dog Rescue"),
      );
    },
  );

  it("leaves an item without a title unchanged", () => {
    const { authorTitle: _omitted, ...untitled } = titled;
    render(<TestimonialsSection testimonials={[untitled]} layout="longform" />);
    expect(screen.queryByText("Founder and CEO")).toBeNull();
    expect(screen.getByText("Sandra Murray")).toBeInTheDocument();
  });

  it("renders the attribution block for a title-only item", () => {
    render(
      <TestimonialsSection
        testimonials={[{ id: "anon", quote: "No name.", authorTitle: "Founder and CEO" }]}
        layout="longform"
      />,
    );
    expect(screen.getByText("Founder and CEO")).toBeInTheDocument();
  });

  it("links the meta and never the title", () => {
    render(<TestimonialsSection testimonials={[titled]} layout="longform" />);
    expect(screen.getByRole("link", { name: "Rovers Return Dog Rescue" })).toHaveAttribute(
      "href",
      "https://example.org",
    );
    expect(screen.queryByRole("link", { name: "Founder and CEO" })).not.toBeInTheDocument();
  });
});
