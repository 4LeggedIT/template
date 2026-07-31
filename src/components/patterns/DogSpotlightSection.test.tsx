import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DogSpotlightSection, { type DogSpotlightItem } from "@/components/patterns/DogSpotlightSection";

const dogs: DogSpotlightItem[] = [
  {
    id: "molly",
    name: "Molly",
    rescueId: "example-rescue",
    rescueName: "Example Rescue",
    detailsUrl: "https://www.getbuddy.com/pet/molly",
    image: "https://example.org/molly.jpg",
    breed: "German Shepherd Dog, Mixed Breed",
    gender: "Female",
    age: "1 year old",
  },
  {
    id: "dexter",
    name: "Dexter",
    rescueId: "example-rescue",
    rescueName: "Example Rescue",
    image: "https://example.org/dexter.jpg",
    breed: "German Shepherd Dog, Mixed Breed",
    gender: "Male",
    age: "1 year old",
  },
];

describe("DogSpotlightSection", () => {
  it("renders nothing when there are no dogs", () => {
    const { container } = render(<DogSpotlightSection dogs={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders one card per dog with name, breed, and age • gender", () => {
    render(<DogSpotlightSection dogs={dogs} />);

    expect(screen.getByText("Molly")).toBeInTheDocument();
    expect(screen.getByText("Dexter")).toBeInTheDocument();
    expect(screen.getAllByText("German Shepherd Dog, Mixed Breed")).toHaveLength(2);
    expect(screen.getByText("1 year old • Female")).toBeInTheDocument();
    expect(screen.getByText("1 year old • Male")).toBeInTheDocument();
  });

  it("renders a CTA link to detailsUrl only when it is present", () => {
    render(<DogSpotlightSection dogs={dogs} />);

    const mollyLink = screen.getByRole("link", { name: "Meet Molly" });
    expect(mollyLink).toHaveAttribute("href", "https://www.getbuddy.com/pet/molly");
    expect(mollyLink).toHaveAttribute("target", "_blank");

    expect(screen.queryByRole("link", { name: "Meet Dexter" })).not.toBeInTheDocument();
  });

  it("omits age from the meta line when it is not provided, without a stray separator", () => {
    const dogsWithoutAge: DogSpotlightItem[] = [
      {
        id: "king",
        name: "King",
        rescueId: "example-rescue",
        rescueName: "Example Rescue",
        image: "https://example.org/king.jpg",
        breed: "Cattle Dog, Mixed Breed",
        gender: "Male",
      },
    ];

    render(<DogSpotlightSection dogs={dogsWithoutAge} />);

    expect(screen.getByText("Male")).toBeInTheDocument();
    expect(screen.queryByText(/•/)).not.toBeInTheDocument();
  });

  it("supports a custom title, description, and ctaPrefix", () => {
    render(
      <DogSpotlightSection
        dogs={dogs}
        title="Longest Waiting"
        description="These pups need homes most."
        labels={{ ctaPrefix: "Adopt" }}
      />,
    );

    expect(screen.getByText("Longest Waiting")).toBeInTheDocument();
    expect(screen.getByText("These pups need homes most.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Adopt Molly" })).toBeInTheDocument();
  });
});
