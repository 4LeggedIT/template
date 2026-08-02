import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SupporterRecognitionSection, {
  type Supporter,
  type SupporterRecognitionCategorySection,
} from "@/components/patterns/SupporterRecognitionSection";

const sections: SupporterRecognitionCategorySection[] = [
  { category: "supporters", title: "Our Supporters" },
  { category: "inMemoryOf", title: "In Loving Memory", description: "Gifts given in honor of a beloved pet." },
];

const supporters: Supporter[] = [
  { id: "zoe", name: "Zoe", category: "supporters" },
  { id: "annette", name: "Annette", category: "supporters" },
  { id: "heather", name: "Heather", category: "supporters", note: "Monthly supporter" },
];

describe("SupporterRecognitionSection", () => {
  it("renders nothing when there are no supporters and no CTA", () => {
    const { container } = render(<SupporterRecognitionSection supporters={[]} sections={sections} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("skips a category section entirely when it has zero matching supporters", () => {
    render(<SupporterRecognitionSection supporters={supporters} sections={sections} />);

    expect(screen.queryByText("In Loving Memory")).not.toBeInTheDocument();
    expect(screen.getByText("Our Supporters")).toBeInTheDocument();
  });

  it("sorts supporters alphabetically within a category regardless of input order", () => {
    render(<SupporterRecognitionSection supporters={supporters} sections={sections} />);

    const names = screen.getAllByText(/^(Zoe|Annette|Heather)$/).map((el) => el.textContent);
    expect(names).toEqual(["Annette", "Heather", "Zoe"]);
  });

  it("renders the optional note under a supporter's name", () => {
    render(<SupporterRecognitionSection supporters={supporters} sections={sections} />);

    expect(screen.getByText("Monthly supporter")).toBeInTheDocument();
  });

  it("renders the CTA card only when ctaHref is provided", () => {
    const { rerender } = render(<SupporterRecognitionSection supporters={supporters} sections={sections} />);
    expect(screen.queryByText("Become a Supporter")).not.toBeInTheDocument();

    rerender(
      <SupporterRecognitionSection
        supporters={supporters}
        sections={sections}
        ctaTitle="Become a Supporter"
        ctaHref="/donate"
        ctaLabel="Donate Today"
      />,
    );
    expect(screen.getByText("Become a Supporter")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Donate Today" })).toHaveAttribute("href", "/donate");
  });
});
