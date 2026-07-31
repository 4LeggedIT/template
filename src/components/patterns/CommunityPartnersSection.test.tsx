import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CommunityPartnersSection, {
  type CommunityPartner,
  type CommunityPartnersCategorySection,
} from "@/components/patterns/CommunityPartnersSection";

const sections: CommunityPartnersCategorySection[] = [
  { category: "rescuePartners", title: "Rescue & Field-Based Partners" },
  { category: "businessPartners", title: "Community Business Partners", description: "No endorsement implied." },
];

const partners: CommunityPartner[] = [
  { id: "zephyr-rescue", name: "Zephyr Rescue", category: "rescuePartners", description: "Fellow rescue." },
  { id: "acme-rescue", name: "Acme Rescue", category: "rescuePartners", description: "Fellow rescue." },
  {
    id: "grilled-cheese",
    name: "Grilled Cheese Co.",
    category: "businessPartners",
    description: "Free sandwiches for new fosters.",
    url: "https://example.com",
  },
];

describe("CommunityPartnersSection", () => {
  it("renders nothing when there are no partners and no CTA", () => {
    const { container } = render(<CommunityPartnersSection partners={[]} sections={sections} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("skips a category section entirely when it has zero matching partners", () => {
    render(
      <CommunityPartnersSection
        partners={partners.filter((p) => p.category === "businessPartners")}
        sections={sections}
      />,
    );

    expect(screen.queryByText("Rescue & Field-Based Partners")).not.toBeInTheDocument();
    expect(screen.getByText("Community Business Partners")).toBeInTheDocument();
  });

  it("sorts partners alphabetically within a category regardless of input order", () => {
    render(<CommunityPartnersSection partners={partners} sections={sections} />);

    const names = screen.getAllByText(/Rescue$/).map((el) => el.textContent);
    expect(names).toEqual(["Acme Rescue", "Zephyr Rescue"]);
  });

  it("renders a Visit Website link only when url is set, using the label override", () => {
    render(
      <CommunityPartnersSection
        partners={partners}
        sections={sections}
        labels={{ visitLabel: "See Site" }}
      />,
    );

    const link = screen.getByRole("link", { name: "See Site" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(screen.queryAllByRole("link", { name: "See Site" })).toHaveLength(1);
  });

  it("links the logo to the partner's url and omits the redundant Visit Website text link", () => {
    const withLogoAndUrl: CommunityPartner[] = [
      {
        id: "logo-and-link-co",
        name: "Logo And Link Co.",
        category: "businessPartners",
        description: "Has both a logo and a url.",
        logoSrc: "https://example.com/logo.png",
        url: "https://example.com",
      },
    ];

    render(<CommunityPartnersSection partners={withLogoAndUrl} sections={sections} />);

    const img = screen.getByAltText("Logo And Link Co.");
    expect(img.closest("a")).toHaveAttribute("href", "https://example.com");
    expect(screen.queryByText("Visit Website")).not.toBeInTheDocument();
  });

  it("wraps the logo in a background container only when logoBackgroundClassName is set", () => {
    const withBackground: CommunityPartner[] = [
      {
        id: "dark-logo-co",
        name: "Dark Logo Co.",
        category: "businessPartners",
        description: "Needs a dark backing for its light-colored mark.",
        logoSrc: "https://example.com/logo.png",
        logoBackgroundClassName: "bg-slate-900",
      },
    ];

    render(<CommunityPartnersSection partners={withBackground} sections={sections} />);

    const img = screen.getByAltText("Dark Logo Co.");
    expect(img.parentElement).toHaveClass("bg-slate-900");
  });

  it("renders the CTA card only when ctaHref is provided", () => {
    const { rerender } = render(<CommunityPartnersSection partners={partners} sections={sections} />);
    expect(screen.queryByText("Want to Partner?")).not.toBeInTheDocument();

    rerender(
      <CommunityPartnersSection
        partners={partners}
        sections={sections}
        ctaTitle="Want to Partner?"
        ctaHref="/contact"
        ctaLabel="Reach Out"
      />,
    );
    expect(screen.getByText("Want to Partner?")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Reach Out" })).toHaveAttribute("href", "/contact");
  });
});
