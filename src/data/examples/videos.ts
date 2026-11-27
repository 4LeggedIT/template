import { mediaUrl } from "@/lib/media-host";

/** Sample clips: slideshows of the example dogs, hosted on the fleet R2 bucket (`template` prefix). String literals only. */
export const exampleVideos = {
  meetTheDogs: mediaUrl("template", "gallery/meet-the-dogs-2026-11-26.mp4"),
  moreDogs: mediaUrl("template", "gallery/more-dogs-2026-11-26.mp4"),
} as const;

/** Poster for each clip: a full-frame still of its first dog. */
export const exampleVideoKeys: Record<string, { prefix: string; path: string }> = {
  [exampleVideos.meetTheDogs]: { prefix: "template", path: "gallery/meet-the-dogs-2026-11-26.mp4" },
  [exampleVideos.moreDogs]: { prefix: "template", path: "gallery/more-dogs-2026-11-26.mp4" },
};
