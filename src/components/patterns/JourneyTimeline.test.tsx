import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import JourneyTimeline, { type JourneyTimelineStage } from "@/components/patterns/JourneyTimeline";

const stages: JourneyTimelineStage[] = [
  {
    label: "Rescued",
    date: "July 17, 2026",
    description: "Found and brought into care.",
    imageSrc: "https://example.org/rescued.jpg",
  },
  {
    label: "Today",
    description: "Thriving and looking for a home.",
  },
];

describe("JourneyTimeline", () => {
  it("renders nothing when there are no stages", () => {
    const { container } = render(<JourneyTimeline stages={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders one entry per stage with label, date, and description", () => {
    render(<JourneyTimeline stages={stages} />);

    expect(screen.getByText("Rescued")).toBeInTheDocument();
    expect(screen.getByText("July 17, 2026")).toBeInTheDocument();
    expect(screen.getByText("Found and brought into care.")).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Thriving and looking for a home.")).toBeInTheDocument();
  });

  it("renders a stage image only when imageSrc is present", () => {
    render(<JourneyTimeline stages={stages} />);

    const rescuedImage = screen.getByAltText("Rescued");
    expect(rescuedImage).toHaveAttribute("src", "https://example.org/rescued.jpg");

    expect(screen.queryByAltText("Today")).not.toBeInTheDocument();
  });

  it("falls back to the stage label as alt text when imageAlt is not provided", () => {
    render(<JourneyTimeline stages={stages} />);

    expect(screen.getByAltText("Rescued")).toBeInTheDocument();
  });
});
