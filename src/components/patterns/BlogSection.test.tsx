import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import BlogSection, {
  estimateReadTime,
  getAdjacentBlogPosts,
  getBlogHighlightItem,
  getRelatedBlogPosts,
  type BlogPostEntry,
} from "@/components/patterns/BlogSection";

const posts: BlogPostEntry[] = [
  {
    id: "1",
    slug: "guide-post",
    title: "A Practical Guide",
    excerpt: "A guide excerpt.",
    publishedAt: "2026-01-15",
    category: "guides",
    content: "Some words here to make up a short article body for read time math.",
  },
  {
    id: "2",
    slug: "story-post",
    title: "An Adoption Story",
    excerpt: "A story excerpt.",
    publishedAt: "2026-02-01",
    category: "stories",
    imageSrc: "https://example.org/dog.jpg",
    imageAlt: "A happy adopted dog",
    content: "Another short article body for read time math purposes.",
  },
];

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("BlogSection", () => {
  it("renders the empty message when there are no posts", () => {
    renderWithRouter(<BlogSection posts={[]} />);

    expect(screen.getByText("New posts are on the way.")).toBeInTheDocument();
  });

  it("renders one card per post, newest first", () => {
    renderWithRouter(<BlogSection posts={posts} />);

    const titles = screen.getAllByRole("heading", { level: 3 }).map((el) => el.textContent);
    expect(titles).toEqual(["An Adoption Story", "A Practical Guide"]);
  });

  it("filters by category when a pill is clicked", () => {
    renderWithRouter(<BlogSection posts={posts} />);

    fireEvent.click(screen.getByRole("button", { name: "Guides" }));

    expect(screen.getByText("A Practical Guide")).toBeInTheDocument();
    expect(screen.queryByText("An Adoption Story")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "All" }));

    expect(screen.getByText("An Adoption Story")).toBeInTheDocument();
  });

  it("locks to a single category and hides filter pills when categoryFilter is set", () => {
    renderWithRouter(<BlogSection posts={posts} categoryFilter="stories" />);

    expect(screen.getByText("An Adoption Story")).toBeInTheDocument();
    expect(screen.queryByText("A Practical Guide")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "All" })).not.toBeInTheDocument();
  });

  it("falls back to an emoji tile when a post has no imageSrc", () => {
    const [textPost] = [{ ...posts[0], emoji: "🐾" }];
    renderWithRouter(<BlogSection posts={[textPost]} />);

    expect(screen.getByText("🐾")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders a featured hero card, preferring an explicitly flagged post", () => {
    const withFeatured: BlogPostEntry[] = [
      { ...posts[0], featured: true },
      posts[1],
    ];
    renderWithRouter(<BlogSection posts={withFeatured} showFeatured />);

    expect(screen.getByText("Featured")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "A Practical Guide" })).toBeInTheDocument();
  });

  it("links cards to postBasePath when provided, and renders unlinked otherwise", () => {
    const { unmount } = renderWithRouter(<BlogSection posts={posts} postBasePath="/blog" />);
    expect(screen.getByRole("link", { name: "An Adoption Story" })).toHaveAttribute("href", "/blog/story-post");
    unmount();

    renderWithRouter(<BlogSection posts={posts} />);
    expect(screen.queryByRole("link", { name: "An Adoption Story" })).not.toBeInTheDocument();
  });

  it("renders the subscribe CTA only when provided", () => {
    const { rerender } = render(
      <MemoryRouter>
        <BlogSection posts={posts} />
      </MemoryRouter>,
    );
    expect(screen.queryByText("Stay in the loop")).not.toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <BlogSection
          posts={posts}
          subscribeCta={{ title: "Stay in the loop", ctaLabel: "Subscribe", href: "mailto:woof@example.org" }}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("Stay in the loop")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Subscribe" })).toHaveAttribute("href", "mailto:woof@example.org");
  });
});

describe("estimateReadTime", () => {
  it("computes a minimum of 1 minute for short content", () => {
    expect(estimateReadTime("Just a few words.")).toBe("1 min read");
  });

  it("strips markdown syntax before counting words", () => {
    const content = "## Heading\n\n- item one\n- item two\n\n[a link](https://example.org) and `code`.";
    expect(estimateReadTime(content)).toBe("1 min read");
  });
});

describe("getRelatedBlogPosts", () => {
  it("excludes the current slug and sorts newest first", () => {
    const third: BlogPostEntry = { ...posts[0], id: "3", slug: "third-post", publishedAt: "2026-03-01" };
    const related = getRelatedBlogPosts([...posts, third], "story-post");

    expect(related.map((post) => post.slug)).toEqual(["third-post", "guide-post"]);
  });

  it("respects the limit argument", () => {
    const third: BlogPostEntry = { ...posts[0], id: "3", slug: "third-post", publishedAt: "2026-03-01" };
    const related = getRelatedBlogPosts([...posts, third], "story-post", 1);

    expect(related).toHaveLength(1);
  });
});

describe("getAdjacentBlogPosts", () => {
  it("returns the chronologically earlier/later neighbors (oldest first)", () => {
    const third: BlogPostEntry = { ...posts[0], id: "3", slug: "third-post", publishedAt: "2026-03-01" };
    const timeline = [...posts, third]; // guide-post (01-15) < story-post (02-01) < third-post (03-01)

    const result = getAdjacentBlogPosts(timeline, "story-post", "/blog");
    expect(result.previous).toEqual({
      slug: "guide-post",
      title: "A Practical Guide",
      publishedAt: "2026-01-15",
      href: `/blog/${"guide-post"}`,
    });
    expect(result.next).toEqual({
      slug: "third-post",
      title: posts[0].title,
      publishedAt: "2026-03-01",
      href: `/blog/${"third-post"}`,
    });
  });

  it("returns null on the side with no neighbor, at either end of the timeline", () => {
    expect(getAdjacentBlogPosts(posts, "guide-post", "/blog").previous).toBeNull();
    expect(getAdjacentBlogPosts(posts, "story-post", "/blog").next).toBeNull();
  });

  it("returns both sides null when the slug isn't found", () => {
    expect(getAdjacentBlogPosts(posts, "missing-post", "/blog")).toEqual({ previous: null, next: null });
  });
});

describe("getBlogHighlightItem", () => {
  it("returns null when no post is flagged highlightOnHome", () => {
    expect(getBlogHighlightItem(posts, "/blog")).toBeNull();
  });

  it("maps the flagged post to the generic HomeHighlightItem shape", () => {
    const flagged: BlogPostEntry[] = [posts[0], { ...posts[1], highlightOnHome: true }];
    const item = getBlogHighlightItem(flagged, "/blog");

    expect(item).toMatchObject({
      id: "2",
      title: "An Adoption Story",
      summary: "A story excerpt.",
      href: `/blog/${"story-post"}`,
      imageSrc: "https://example.org/dog.jpg",
      imageAlt: "A happy adopted dog",
      badgeLabel: "Stories",
    });
  });

  it("auto-resolves to the most recent when more than one post is flagged", () => {
    const flagged: BlogPostEntry[] = [
      { ...posts[0], highlightOnHome: true },
      { ...posts[1], highlightOnHome: true },
    ];
    expect(getBlogHighlightItem(flagged, "/blog")?.id).toBe("2");
  });

  it("renders no href when postBasePath is omitted", () => {
    const flagged: BlogPostEntry[] = [{ ...posts[0], highlightOnHome: true }];
    expect(getBlogHighlightItem(flagged)?.href).toBeUndefined();
  });
});
