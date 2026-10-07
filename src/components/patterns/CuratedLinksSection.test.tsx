import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CuratedLinksSection, { type CuratedLinkItem } from "@/components/patterns/CuratedLinksSection";

const items: CuratedLinkItem[] = [
  {
    id: "a",
    title: "First post",
    href: "https://example.org/a",
    summary: "Why the first post is worth your time.",
    sourceName: "Example Trainer",
  },
  { id: "b", title: "Second post", href: "https://example.org/b", sourceName: "Another Trainer" },
];

describe("CuratedLinksSection", () => {
  it("renders nothing when there are no items", () => {
    const { container } = render(<CuratedLinksSection items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders each item as an external link that opens in a new tab safely", () => {
    render(<CuratedLinksSection items={items} />);
    const link = screen.getByRole("link", { name: /First post/ });
    expect(link).toHaveAttribute("href", "https://example.org/a");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows title, summary and credit", () => {
    render(<CuratedLinksSection items={items} />);
    expect(screen.getByText("First post")).toBeInTheDocument();
    expect(screen.getByText("Why the first post is worth your time.")).toBeInTheDocument();
    expect(screen.getByText("From Example Trainer")).toBeInTheDocument();
  });

  it("announces that the link opens in a new tab, with an overridable label", () => {
    const { unmount } = render(<CuratedLinksSection items={items} />);
    expect(screen.getAllByText("(opens in a new tab)")).toHaveLength(2);
    unmount();
    render(<CuratedLinksSection items={items} labels={{ opensInNewTab: "(se abre en una pestaña nueva)", sourcePrefix: "De" }} />);
    expect(screen.getAllByText("(se abre en una pestaña nueva)")).toHaveLength(2);
    expect(screen.getByText("De Example Trainer")).toBeInTheDocument();
  });

  it("drops items whose href is unsafe or not http(s), instead of rendering them", () => {
    const bad: CuratedLinkItem[] = [
      { id: "js", title: "Script", href: "javascript:alert(1)", sourceName: "X" },
      { id: "mail", title: "Mail", href: "mailto:a@example.org", sourceName: "X" },
      { id: "rel", title: "Relative", href: "/internal", sourceName: "X" },
      { id: "ok", title: "Fine", href: "https://example.org/ok", sourceName: "X" },
    ];
    render(<CuratedLinksSection items={bad} />);
    expect(screen.queryByText("Script")).not.toBeInTheDocument();
    expect(screen.queryByText("Mail")).not.toBeInTheDocument();
    expect(screen.queryByText("Relative")).not.toBeInTheDocument();
    expect(screen.getByText("Fine")).toBeInTheDocument();
  });

  it("renders nothing when every href is dropped", () => {
    const { container } = render(
      <CuratedLinksSection items={[{ id: "js", title: "Script", href: "javascript:alert(1)", sourceName: "X" }]} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("keeps the caller's order", () => {
    render(<CuratedLinksSection items={[...items].reverse()} />);
    const headings = screen.getAllByRole("heading", { level: 4 }).map((el) => el.textContent);
    expect(headings).toEqual(["Second post", "First post"]);
  });

  it("suppresses the heading block when title and description are omitted", () => {
    render(<CuratedLinksSection items={items} />);
    expect(screen.queryByRole("heading", { level: 3 })).not.toBeInTheDocument();
  });

  it("renders title and description when given", () => {
    render(<CuratedLinksSection title="Worth a read" description="Linked at the source." items={items} />);
    expect(screen.getByRole("heading", { level: 3, name: "Worth a read" })).toBeInTheDocument();
    expect(screen.getByText("Linked at the source.")).toBeInTheDocument();
  });

  describe("topic filter pills", () => {
    const topical: CuratedLinkItem[] = [
      { id: "w", title: "Wag post", href: "https://example.org/w", sourceName: "X", topic: "Body language" },
      { id: "c", title: "Crate post", href: "https://example.org/c", sourceName: "X", topic: "Crates" },
      { id: "t", title: "Tail post", href: "https://example.org/t", sourceName: "X", topic: "Body language" },
    ];
    const titles = () => screen.getAllByRole("heading", { level: 4 }).map((el) => el.textContent);

    it("shows All plus one pill per distinct topic, sorted A to Z, with All active", () => {
      render(<CuratedLinksSection items={topical} />);
      const pills = screen.getAllByRole("button").map((el) => el.textContent);
      expect(pills).toEqual(["All", "Body language", "Crates"]);
      expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");
      expect(titles()).toEqual(["Wag post", "Crate post", "Tail post"]);
    });

    it("filters to a topic and restores everything on All, keeping the caller's order", () => {
      render(<CuratedLinksSection items={topical} />);
      fireEvent.click(screen.getByRole("button", { name: "Body language" }));
      expect(titles()).toEqual(["Wag post", "Tail post"]);
      expect(screen.getByRole("button", { name: "Body language" })).toHaveAttribute("aria-pressed", "true");
      fireEvent.click(screen.getByRole("button", { name: "All" }));
      expect(titles()).toEqual(["Wag post", "Crate post", "Tail post"]);
    });

    it("renders no pill row for a single topic, no topics, or showFilters={false}", () => {
      const { unmount } = render(<CuratedLinksSection items={[topical[0], topical[2]]} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      unmount();
      const none = render(<CuratedLinksSection items={items} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      none.unmount();
      render(<CuratedLinksSection items={topical} showFilters={false} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      expect(titles()).toHaveLength(3);
    });

    it("localizes the All pill", () => {
      render(<CuratedLinksSection items={topical} labels={{ allLabel: "Todos" }} />);
      expect(screen.getByRole("button", { name: "Todos" })).toBeInTheDocument();
    });

    it("never builds a pill from an item that was dropped for an unsafe href", () => {
      render(
        <CuratedLinksSection
          items={[...topical.slice(0, 1), { id: "x", title: "Bad", href: "javascript:alert(1)", sourceName: "X", topic: "Hidden" }]}
        />,
      );
      expect(screen.queryByRole("button", { name: "Hidden" })).not.toBeInTheDocument();
    });
  });
});
