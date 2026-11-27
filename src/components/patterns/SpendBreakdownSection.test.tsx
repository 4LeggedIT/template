import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SpendBreakdownSection, {
  type SpendCategory,
} from "@/components/patterns/SpendBreakdownSection";

const realCategories: SpendCategory[] = [
  { id: "animalCare", label: "Animal Care", amount: 25995 },
  { id: "rescueOperations", label: "Rescue Operations", amount: 18024 },
  { id: "administrative", label: "Administrative", amount: 5232 },
];

describe("SpendBreakdownSection", () => {
  it("renders nothing when categories is empty", () => {
    const { container } = render(
      <SpendBreakdownSection categories={[]} periodLabel="Fiscal Year 2025" />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders one tile per category with formatted currency amounts", () => {
    render(<SpendBreakdownSection categories={realCategories} periodLabel="Fiscal Year 2025" />);

    expect(screen.getByText("$25,995")).toBeInTheDocument();
    expect(screen.getByText("Animal Care")).toBeInTheDocument();
    expect(screen.getByText("$18,024")).toBeInTheDocument();
    expect(screen.getByText("Rescue Operations")).toBeInTheDocument();
    expect(screen.getByText("$5,232")).toBeInTheDocument();
    expect(screen.getByText("Administrative")).toBeInTheDocument();
  });

  it("computes and displays the total as the sum of all category amounts", () => {
    render(<SpendBreakdownSection categories={realCategories} periodLabel="Fiscal Year 2025" />);

    expect(screen.getByText("$49,251")).toBeInTheDocument();
    expect(screen.getByText("Total Expenses")).toBeInTheDocument();
  });

  it("always renders the periodLabel badge", () => {
    render(<SpendBreakdownSection categories={realCategories} periodLabel="Fiscal Year 2025" />);

    expect(screen.getByText("Fiscal Year 2025")).toBeInTheDocument();
  });

  it("renders costPerOutcome only when provided", () => {
    const { rerender } = render(
      <SpendBreakdownSection categories={realCategories} periodLabel="Fiscal Year 2025" />,
    );
    expect(screen.queryByText("per dog rescued")).not.toBeInTheDocument();

    rerender(
      <SpendBreakdownSection
        categories={realCategories}
        periodLabel="Fiscal Year 2025"
        costPerOutcome={{ amountLabel: "$298", outcomeLabel: "per dog rescued" }}
      />,
    );
    expect(screen.getByText("$298")).toBeInTheDocument();
    expect(screen.getByText("per dog rescued")).toBeInTheDocument();
  });

  it("renders the source link only when sourceHref is provided, using the label override", () => {
    const { rerender } = render(
      <SpendBreakdownSection categories={realCategories} periodLabel="Fiscal Year 2025" />,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();

    rerender(
      <SpendBreakdownSection
        categories={realCategories}
        periodLabel="Fiscal Year 2025"
        sourceHref="https://projects.propublica.org/nonprofits/organizations/000000000"
        labels={{ sourceLabel: "See our Form 990-EZ" }}
      />,
    );
    const link = screen.getByRole("link", { name: "See our Form 990-EZ" });
    expect(link).toHaveAttribute("href", "https://projects.propublica.org/nonprofits/organizations/000000000");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("respects the totalLabel override", () => {
    render(
      <SpendBreakdownSection
        categories={realCategories}
        periodLabel="Fiscal Year 2025"
        labels={{ totalLabel: "Total Spent This Year" }}
      />,
    );

    expect(screen.getByText("Total Spent This Year")).toBeInTheDocument();
  });
});
