import { render, screen } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import ImpactStatsSection, {
  type ImpactStat,
  type ImpactStatsPeriod,
} from "@/components/patterns/ImpactStatsSection";

// recharts measures its ResponsiveContainer via getBoundingClientRect(), which jsdom always
// reports as all-zero — without a real size, recharts renders no chart children at all.
let getBoundingClientRectSpy: ReturnType<typeof vi.spyOn>;

beforeAll(() => {
  getBoundingClientRectSpy = vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
    width: 500,
    height: 300,
    top: 0,
    left: 0,
    bottom: 300,
    right: 500,
    x: 0,
    y: 0,
    toJSON() {},
  });
});

afterAll(() => {
  getBoundingClientRectSpy.mockRestore();
});

const lifetimeStats: ImpactStat[] = [
  { id: "adopted", value: 1240, label: "Dogs Adopted" },
  { id: "fostered", value: 340, label: "Dogs Fostered" },
];

const periods: ImpactStatsPeriod[] = [
  { id: "2025", label: "2025", metrics: { adopted: 410, fostered: 120 } },
  { id: "2026", label: "2026", metrics: { adopted: 480, fostered: 140 } },
];

const periodMetrics = {
  adopted: { label: "Adopted" },
  fostered: { label: "Fostered" },
};

describe("ImpactStatsSection", () => {
  it("renders nothing when there are no lifetime stats and no periods", () => {
    const { container } = render(<ImpactStatsSection lifetimeStats={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders one tile per lifetime stat", () => {
    render(<ImpactStatsSection lifetimeStats={lifetimeStats} />);

    expect(screen.getByText("1240")).toBeInTheDocument();
    expect(screen.getByText("Dogs Adopted")).toBeInTheDocument();
    expect(screen.getByText("340")).toBeInTheDocument();
    expect(screen.getByText("Dogs Fostered")).toBeInTheDocument();
  });

  it("does not render a chart or single-period list when fewer than 2 periods are given", () => {
    render(
      <ImpactStatsSection
        lifetimeStats={[]}
        periods={[periods[0]]}
        periodMetrics={periodMetrics}
      />,
    );

    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(screen.getByText("410")).toBeInTheDocument();
    expect(screen.getByText("Adopted")).toBeInTheDocument();
    expect(document.querySelector(".recharts-wrapper")).not.toBeInTheDocument();
  });

  it("renders a bar chart when 2+ periods are given, and not the single-period list", () => {
    render(
      <ImpactStatsSection lifetimeStats={[]} periods={periods} periodMetrics={periodMetrics} />,
    );

    expect(document.querySelector(".recharts-wrapper")).toBeInTheDocument();
    expect(screen.queryByText("410")).not.toBeInTheDocument();
  });

  it("respects the granularityLabel and chartCaption label override", () => {
    render(
      <ImpactStatsSection
        lifetimeStats={[]}
        periods={periods}
        periodMetrics={periodMetrics}
        granularityLabel="Updated yearly"
        labels={{ chartCaption: "Trend over time" }}
      />,
    );

    expect(screen.getByText("Updated yearly")).toBeInTheDocument();
    expect(screen.getByText("Trend over time")).toBeInTheDocument();
  });

  it("renders the timeframeNote alongside the granularityLabel", () => {
    render(
      <ImpactStatsSection
        lifetimeStats={lifetimeStats}
        granularityLabel="Updated yearly"
        timeframeNote="Since 2024"
      />,
    );

    expect(screen.getByText("Updated yearly")).toBeInTheDocument();
    expect(screen.getByText("Since 2024")).toBeInTheDocument();
  });

  it("renders the CTA only when both ctaHref and ctaLabel are provided", () => {
    const { rerender } = render(<ImpactStatsSection lifetimeStats={lifetimeStats} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();

    rerender(
      <ImpactStatsSection lifetimeStats={lifetimeStats} ctaHref="/donate" ctaLabel="Support Us" />,
    );
    expect(screen.getByRole("link", { name: "Support Us" })).toHaveAttribute("href", "/donate");
  });
});
