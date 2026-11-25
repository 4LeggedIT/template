import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MediaCarouselTile, { type MediaCarouselTileItem } from "@/components/patterns/MediaCarouselTile";

describe("MediaCarouselTile", () => {
  it("renders a single item with no carousel chrome or count badge", () => {
    const media: MediaCarouselTileItem[] = [{ id: "photo-1", kind: "photo", src: "/photo-1.webp", label: "A dog in a yard" }];

    render(<MediaCarouselTile media={media} />);

    expect(screen.getByAltText("A dog in a yard")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument();
    expect(screen.queryByText("2")).not.toBeInTheDocument();
  });

  it("renders carousel controls and a count badge for more than one item", () => {
    const media: MediaCarouselTileItem[] = [
      { id: "photo-1", kind: "photo", src: "/photo-1.webp", label: "First photo" },
      { id: "photo-2", kind: "photo", src: "/photo-2.webp", label: "Second photo" },
      { id: "photo-3", kind: "photo", src: "/photo-3.webp", label: "Third photo" },
    ];

    render(<MediaCarouselTile media={media} />);

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "First photo" })).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(3);
  });

  it("calls onPhotoClick with the clicked item when provided", () => {
    const onPhotoClick = vi.fn();
    const media: MediaCarouselTileItem[] = [{ id: "photo-1", kind: "photo", src: "/photo-1.webp", label: "A dog in a yard" }];

    render(<MediaCarouselTile media={media} onPhotoClick={onPhotoClick} />);

    screen.getByRole("button", { name: "A dog in a yard" }).click();

    expect(onPhotoClick).toHaveBeenCalledWith(media[0]);
  });

  it("renders a plain image with no click target when onPhotoClick is omitted", () => {
    const media: MediaCarouselTileItem[] = [{ id: "photo-1", kind: "photo", src: "/photo-1.webp", label: "A dog in a yard" }];

    render(<MediaCarouselTile media={media} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByAltText("A dog in a yard")).toBeInTheDocument();
  });
});
