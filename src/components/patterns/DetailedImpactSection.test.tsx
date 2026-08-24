import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import DetailedImpactSection, {
  type ImpactCategory,
  type DetailedImpactEntry,
  byNewestFirst,
  countCategoryEntries,
  formatDetailedImpactDateLabel,
  getEntriesForCategory,
  getImpactLifetimeStats,
} from "@/components/patterns/DetailedImpactSection";

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

const categories: ImpactCategory[] = [
  { id: "feeding-supplies", label: "Food & Supplies Distributed" },
  { id: "veterinary-assistance", label: "Veterinary Assistance" },
  { id: "animals-helped", label: "Animals Helped" },
];

const entries: DetailedImpactEntry[] = [
  {
    id: "older-entry",
    title: "Older Update",
    date: "2026-05-01",
    summary: "An earlier logged update.",
    contributions: [{ categoryId: "animals-helped", amount: 2 }],
  },
  {
    id: "feeding-route",
    title: "Feeding Route + Vet Care",
    date: "2026-06-02",
    summary: "General summary of the whole event.",
    relatedHref: "/blog/feeding-route",
    contributions: [
      { categoryId: "feeding-supplies", amount: 40, unit: "meals", note: "Fed 40 along the route." },
      { categoryId: "veterinary-assistance", amount: 3, unit: "dogs", note: "Treated 3 dogs for fleas/ticks." },
    ],
  },
  {
    id: "external-source",
    title: "Externally Sourced Update",
    date: "2026-06-10",
    summary: "Sourced from an external post.",
    relatedHref: "https://facebook.com/example/post",
    contributions: [{ categoryId: "feeding-supplies", amount: 10, unit: "meals" }],
  },
];

describe("DetailedImpactSection", () => {
  it("renders the empty-state message when entries is empty", () => {
    renderWithRouter(<DetailedImpactSection entries={[]} categories={categories} />);

    expect(screen.getByText("No updates shared yet.")).toBeInTheDocument();
  });

  it("renders one card per entry, newest first", () => {
    renderWithRouter(<DetailedImpactSection entries={entries} categories={categories} />);

    const titles = screen.getAllByRole("heading", { level: 3 }).map((el) => el.textContent);
    expect(titles).toEqual(["Externally Sourced Update", "Feeding Route + Vet Care", "Older Update"]);
  });

  it("renders a running total (count of entries, not a sum of amount) and prefers each contribution's note when totalForCategoryId is set", () => {
    renderWithRouter(
      <DetailedImpactSection
        entries={getEntriesForCategory(entries, "feeding-supplies")}
        categories={categories}
        totalForCategoryId="feeding-supplies"
      />,
    );

    expect(screen.getByText("2")).toBeInTheDocument(); // 2 entries touch feeding-supplies, never 40 + 10
    expect(screen.getByText("Fed 40 along the route.")).toBeInTheDocument();
    expect(screen.queryByText("Older Update")).not.toBeInTheDocument();
  });

  it("renders a contribution's +amount badge only when amount is set", () => {
    const withAndWithoutAmount: DetailedImpactEntry[] = [
      {
        id: "no-amount",
        title: "Gave Out Treats",
        date: "2026-06-20",
        summary: "Nothing meaningful to quantify.",
        contributions: [{ categoryId: "animals-helped" }],
      },
    ];
    renderWithRouter(<DetailedImpactSection entries={withAndWithoutAmount} categories={categories} />);

    expect(screen.getByText("Animals Helped")).toBeInTheDocument();
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });

  it("renders relatedHref as an internal Link vs. an external anchor depending on the URL", () => {
    renderWithRouter(<DetailedImpactSection entries={entries} categories={categories} />);

    const links = screen.getAllByRole("link", { name: /Read the full story/ });
    const internal = links.find((link) => link.getAttribute("href") === "/blog/feeding-route");
    const external = links.find((link) => link.getAttribute("href") === "https://facebook.com/example/post");

    expect(internal).toBeDefined();
    expect(external).toBeDefined();
    expect(external).toHaveAttribute("target", "_blank");
    expect(internal).not.toHaveAttribute("target");
  });

  it("links contribution badges to categoryBasePath when set", () => {
    renderWithRouter(<DetailedImpactSection entries={entries} categories={categories} categoryBasePath="/impact" />);

    expect(screen.getAllByRole("link", { name: /Food & Supplies Distributed/ })[0]).toHaveAttribute(
      "href",
      "/impact/feeding-supplies",
    );
  });
});

describe("DetailedImpactSection helpers", () => {
  it("byNewestFirst sorts descending by date", () => {
    const sorted = [...entries].sort(byNewestFirst);
    expect(sorted.map((entry) => entry.id)).toEqual(["external-source", "feeding-route", "older-entry"]);
  });

  it("getEntriesForCategory filters and sorts newest first", () => {
    const result = getEntriesForCategory(entries, "feeding-supplies");
    expect(result.map((entry) => entry.id)).toEqual(["external-source", "feeding-route"]);
  });

  it("formatDetailedImpactDateLabel respects the locale param, mirroring EventBanner's convention", () => {
    const singleDay: DetailedImpactEntry = { ...entries[0], date: "2026-05-01" };
    expect(formatDetailedImpactDateLabel(singleDay)).toBe("May 1, 2026");
    expect(formatDetailedImpactDateLabel(singleDay, "es-US")).toBe("1 de mayo de 2026");
  });

  it("formatDetailedImpactDateLabel formats a multi-day range", () => {
    const multiDay: DetailedImpactEntry = { ...entries[0], date: "2026-06-02", endDate: "2026-06-03" };
    expect(formatDetailedImpactDateLabel(multiDay)).toBe("June 2 – June 3, 2026");
  });

  it("countCategoryEntries counts entries touching the category, never sums amount", () => {
    expect(countCategoryEntries(entries, "feeding-supplies")).toBe(2); // feeding-route + external-source
    expect(countCategoryEntries(entries, "animals-helped")).toBe(1);
    expect(countCategoryEntries(entries, "rescue-partnerships")).toBe(0);
  });

  it("getImpactLifetimeStats omits zero-count categories and formats value/href", () => {
    const stats = getImpactLifetimeStats(entries, categories);

    expect(stats.map((stat) => stat.id)).toEqual(["feeding-supplies", "veterinary-assistance", "animals-helped"]);
    expect(stats.find((stat) => stat.id === "feeding-supplies")).toMatchObject({
      value: "2",
      label: "Food & Supplies Distributed",
      href: "/impact/feeding-supplies",
    });
  });

  it("getImpactLifetimeStats omits a category entirely once its count is zero", () => {
    const noEntries: DetailedImpactEntry[] = [];
    expect(getImpactLifetimeStats(noEntries, categories)).toEqual([]);
  });
});
