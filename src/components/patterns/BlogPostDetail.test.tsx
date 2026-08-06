import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import BlogPostDetail from "@/components/patterns/BlogPostDetail";
import type { BlogPostEntry } from "@/components/patterns/BlogSection";

const post: BlogPostEntry = {
  id: "1",
  slug: "rich-content-post",
  title: "A Fully Loaded Post",
  excerpt: "Excerpt.",
  publishedAt: "2026-03-01",
  author: "Jane Volunteer",
  category: "guides",
  content: `## First Heading

A plain paragraph with a [link](https://example.org) and \`inline code\` and **bold text**.

- first item
- second item

> a quoted line

**A bold emphasis paragraph**

\`\`\`js
const x = 1;
\`\`\``,
};

const related: BlogPostEntry[] = [
  {
    id: "2",
    slug: "other-post",
    title: "Another Post",
    excerpt: "Excerpt 2.",
    publishedAt: "2026-02-01",
    content: "Short body.",
    emoji: "🐕",
  },
];

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("BlogPostDetail", () => {
  it("renders the title, category badge, and byline", () => {
    renderWithRouter(<BlogPostDetail post={post} backHref="/blog" />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("A Fully Loaded Post");
    expect(screen.getByText("Guides")).toBeInTheDocument();
    expect(screen.getByText("Jane Volunteer")).toBeInTheDocument();
  });

  it("parses every content block type", () => {
    renderWithRouter(<BlogPostDetail post={post} backHref="/blog" />);

    expect(screen.getByRole("heading", { level: 2, name: "First Heading" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "link" })).toHaveAttribute("href", "https://example.org");
    expect(screen.getByText("inline code")).toBeInTheDocument();
    expect(screen.getByText("bold text")).toBeInTheDocument();
    expect(screen.getByText("first item")).toBeInTheDocument();
    expect(screen.getByText("second item")).toBeInTheDocument();
    expect(screen.getByText("a quoted line")).toBeInTheDocument();
    expect(screen.getByText("A bold emphasis paragraph")).toBeInTheDocument();
    expect(screen.getByText("js")).toBeInTheDocument();
    expect(screen.getByText("const x = 1;")).toBeInTheDocument();
  });

  it("computes read time from content when readTime is omitted", () => {
    renderWithRouter(<BlogPostDetail post={post} backHref="/blog" />);

    expect(screen.getByText("1 min read")).toBeInTheDocument();
  });

  it("renders nothing for the CTA card when cta is omitted, and renders it when provided", () => {
    const { rerender } = render(
      <MemoryRouter>
        <BlogPostDetail post={post} backHref="/blog" />
      </MemoryRouter>,
    );
    expect(screen.queryByText("Ready to get started?")).not.toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <BlogPostDetail
          post={post}
          backHref="/blog"
          cta={{ title: "Ready to get started?", ctaLabel: "Get started", ctaHref: "https://example.org/start" }}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("Ready to get started?")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get started" })).toHaveAttribute("href", "https://example.org/start");
  });

  it("renders related posts, linked when postBasePath is set", () => {
    renderWithRouter(
      <BlogPostDetail post={post} backHref="/blog" relatedPosts={related} postBasePath="/blog" />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Keep reading" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Another Post/ })).toHaveAttribute("href", "/blog/other-post");
  });

  it("renders related posts unlinked when postBasePath is omitted", () => {
    renderWithRouter(<BlogPostDetail post={post} backHref="/blog" relatedPosts={related} />);

    expect(screen.getByText("Another Post")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Another Post/ })).not.toBeInTheDocument();
  });
});
