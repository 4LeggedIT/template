import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Placeholder from "@/components/patterns/Placeholder";
import PlaceholderSection from "@/components/patterns/PlaceholderSection";

describe("Placeholder", () => {
  it("renders the drafted text with a visible default badge and note", () => {
    render(
      <p>
        <Placeholder note="Awaiting confirmation">Visits follow your pet's routine.</Placeholder>
      </p>,
    );

    expect(screen.getByText("Visits follow your pet's routine.")).toBeInTheDocument();
    const badge = screen.getByText("draft");
    expect(badge).toBeVisible();
    expect(badge).toHaveAttribute("title", "Awaiting confirmation");
  });

  it("accepts a localized label", () => {
    render(<Placeholder label="borrador">Texto redactado.</Placeholder>);

    expect(screen.getByText("borrador")).toBeInTheDocument();
  });

  it("renders inline so it can sit inside a paragraph", () => {
    const { container } = render(<Placeholder>Inline copy.</Placeholder>);

    expect(container.querySelector('[data-placeholder="true"]')?.tagName).toBe("SPAN");
  });
});

describe("PlaceholderSection", () => {
  it("renders the public line, the ask and the badge together", () => {
    render(
      <PlaceholderSection title="Our story" publicText="Our story is coming soon." why="Question 20">
        <p>Only you can write this part.</p>
      </PlaceholderSection>,
    );

    expect(screen.getByRole("heading", { name: "Our story" })).toBeInTheDocument();
    expect(screen.getByText("Our story is coming soon.")).toBeInTheDocument();
    expect(screen.getByText("Only you can write this part.")).toBeInTheDocument();
    expect(screen.getByText("We need your part")).toBeInTheDocument();
    expect(screen.getByText("Question 20")).toBeInTheDocument();
  });
});
