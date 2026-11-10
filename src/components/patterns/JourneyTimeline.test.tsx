import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
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

  it("renders partnerLinks as new-tab credit links", () => {
    render(
      <JourneyTimeline
        stages={[
          {
            label: "Pulled with a partner",
            description: "A partner rescue covered the vetting.",
            partnerLinks: [{ label: "Partner Rescue", href: "https://example.org/partner" }],
          },
        ]}
      />,
    );

    const link = screen.getByRole("link", { name: "Partner Rescue" });
    expect(link).toHaveAttribute("href", "https://example.org/partner");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders an internal relatedLinks href as a client-side link, not a new tab", () => {
    render(
      <MemoryRouter>
        <JourneyTimeline
          stages={[
            {
              label: "Announced",
              description: "We put the offer out.",
              relatedLinks: [{ label: "Read the full offer", href: "/news/the-offer" }],
            },
          ]}
        />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: "Read the full offer" });
    expect(link).toHaveAttribute("href", "/news/the-offer");
    expect(link).not.toHaveAttribute("target");
  });

  it("renders an external relatedLinks href in a new tab", () => {
    render(
      <MemoryRouter>
        <JourneyTimeline
          stages={[
            {
              label: "Covered elsewhere",
              description: "A local outlet picked up the story.",
              relatedLinks: [{ label: "Read the coverage", href: "https://example.org/story" }],
            },
          ]}
        />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: "Read the coverage" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});

describe("JourneyTimeline embedUrl", () => {
  const embedStages: JourneyTimelineStage[] = [
    { label: "Rescued", description: "Stored copy A.", embedUrl: "https://www.facebook.com/reel/1" },
    { label: "Today", description: "Stored copy B." },
  ];

  it("shows the Facebook post link instead of the stored copy for a stage with embedUrl", () => {
    render(<JourneyTimeline stages={embedStages} />);
    expect(screen.queryByText("Stored copy A.")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View on Facebook/ })).toHaveAttribute("href", "https://www.facebook.com/reel/1");
    expect(screen.getByText("Stored copy B.")).toBeInTheDocument();
  });

  it("drops a stage whose embedUrl is on knownUnavailableEmbeds, keeping the others", () => {
    render(<JourneyTimeline stages={embedStages} knownUnavailableEmbeds={new Set(["https://www.facebook.com/reel/1"])} />);
    expect(screen.queryByText("Rescued")).not.toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
  });
});
