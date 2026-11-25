import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MediaCarouselSection, { type MediaCarouselItem } from "@/components/patterns/MediaCarouselSection";

const photo = (overrides: Partial<Extract<MediaCarouselItem, { kind: "image" }>> = {}): MediaCarouselItem => ({
  id: "p1",
  kind: "image",
  src: "/photo.webp",
  alt: "A brindle puppy on a blanket",
  ...overrides,
});

const renderCarousel = (items: MediaCarouselItem[]) =>
  render(
    <MemoryRouter>
      <MediaCarouselSection items={items} />
    </MemoryRouter>,
  );

describe("MediaCarouselSection", () => {
  it("renders nothing for an empty item list", () => {
    const { container } = renderCarousel([]);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders an image-only tile with no caption and no link", () => {
    renderCarousel([photo()]);
    expect(screen.getByAltText("A brindle puppy on a blanket")).toBeInTheDocument();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("renders a name without a description", () => {
    renderCarousel([photo({ name: "Bear" })]);
    expect(screen.getByText("Bear")).toBeInTheDocument();
  });

  it("renders a description without a name", () => {
    renderCarousel([photo({ description: "Cared for over three years." })]);
    expect(screen.getByText("Cared for over three years.")).toBeInTheDocument();
  });

  it("renders name and description together", () => {
    renderCarousel([photo({ name: "Bear", description: "Cared for over three years." })]);
    expect(screen.getByText("Bear")).toBeInTheDocument();
    expect(screen.getByText("Cared for over three years.")).toBeInTheDocument();
  });

  it("links a same-page anchor as a plain anchor that does not open a new tab", () => {
    renderCarousel([photo({ href: "#review-carly-w-yelp", name: "Bear" })]);
    const link = screen.getByRole("link", { name: "Bear" });
    expect(link).toHaveAttribute("href", "#review-carly-w-yelp");
    expect(link).not.toHaveAttribute("target");
  });

  it("routes an internal path through the router", () => {
    renderCarousel([photo({ href: "/adopt" })]);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/adopt");
  });

  it("opens an external link in a new tab with a safe rel", () => {
    renderCarousel([photo({ href: "https://example.com/story" })]);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the tile unlinked when the href carries a disallowed scheme", () => {
    renderCarousel([photo({ href: "javascript:alert(1)", name: "Bear" })]);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("Bear")).toBeInTheDocument();
  });

  it("lets several tiles point at the same target", () => {
    renderCarousel([
      photo({ id: "p1", name: "Navy", href: "#review-carly-w-yelp" }),
      photo({ id: "p2", name: "Bear", href: "#review-carly-w-yelp" }),
      photo({ id: "p3", name: "Miley", href: "#review-carly-w-yelp" }),
    ]);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(links.every((l) => l.getAttribute("href") === "#review-carly-w-yelp")).toBe(true);
  });

  it("falls back to alt text for the link's accessible name when unnamed", () => {
    renderCarousel([photo({ href: "#somewhere" })]);
    expect(screen.getByRole("link", { name: "A brindle puppy on a blanket" })).toBeInTheDocument();
  });

  it("does not wrap a video in the link, but does link its caption", () => {
    const video: MediaCarouselItem = {
      id: "v1",
      kind: "video",
      src: "/clip.mp4",
      poster: "/poster.webp",
      alt: "A rescue clip",
      name: "Stormy",
      href: "#review-tessa-s-yelp",
    };
    const { container } = renderCarousel([video]);
    const link = screen.getByRole("link", { name: "Stormy" });
    // Pressing play must not navigate, so the media stays outside the anchor.
    expect(link.querySelector("video")).toBeNull();
    expect(container.querySelector("video")).not.toBeNull();
    expect(link).toHaveTextContent("Stormy");
  });
});
