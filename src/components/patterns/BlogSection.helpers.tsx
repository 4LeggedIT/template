/**
 * SHARED PATTERN: do not edit in a site repo.
 * Source: github.com/4LeggedIT/internal-tools
 *   4leggedit-websites/templates-sources/patterns/BlogSection.helpers.tsx
 * Change it there, then sync it to every site.
 *
 * Non-component helpers for BlogSection.tsx, kept in their own module so that file exports only
 * components (react-refresh/only-export-components).
 */
import { BookOpen } from "lucide-react";
import type { BlogHighlightItem, BlogPostEntry, BlogCategoryConfig } from "./BlogSection";

const WORDS_PER_MINUTE = 200;

const stripMarkdown = (content: string) =>
  content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*-]/g, " ");

export const estimateReadTime = (content: string) => {
  const words = stripMarkdown(content).trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
};

export const byNewestFirst = (a: BlogPostEntry, b: BlogPostEntry) =>
  a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0;

/** Prefers posts sharing the current post's category, newest first within each group, then falls back to pure recency. */
export const getRelatedBlogPosts = (posts: BlogPostEntry[], currentSlug: string, limit = 2) => {
  const currentCategory = posts.find((post) => post.slug === currentSlug)?.category;
  return posts
    .filter((post) => post.slug !== currentSlug)
    .sort((a, b) => {
      if (currentCategory) {
        const aMatches = a.category === currentCategory;
        const bMatches = b.category === currentCategory;
        if (aMatches !== bMatches) return aMatches ? -1 : 1;
      }
      return byNewestFirst(a, b);
    })
    .slice(0, limit);
};

const getPostSortMs = (post: BlogPostEntry) => {
  const ms = Date.parse(post.publishedAt);
  return Number.isFinite(ms) ? ms : 0;
};

/**
 * Selects every post flagged `highlightOnHome`, newest first, and maps each to the generic
 * shape `HomeHighlightSection` renders. Returns `[]` when nothing is flagged — callers must not
 * fall back to "most recent post"; see the "no auto-pin" governance rule. Uncapped: pass the
 * result straight to `HomeHighlightSection` (it caps at `MAX_HOME_HIGHLIGHT_ITEMS`), or merge
 * with another source module's `get*HighlightItems()` output (sort by `sortMs` descending, then
 * slice) before passing in, when combining more than one content type on the homepage.
 */
export const getBlogHighlightItems = (
  posts: BlogPostEntry[],
  postBasePath?: string,
  labels?: { badgeLabel?: string },
): BlogHighlightItem[] =>
  posts
    .filter((candidate) => candidate.highlightOnHome)
    .sort(byNewestFirst)
    .map((post) => ({
      id: post.id,
      title: post.title,
      summary: post.excerpt,
      href: postBasePath ? `${postBasePath}/${post.slug}` : undefined,
      imageSrc: post.imageSrc,
      imageAlt: post.imageAlt,
      badgeLabel: labels?.badgeLabel ?? (post.category ? formatCategoryLabel(post.category) : "Blog"),
      badgeIcon: <BookOpen className="h-3.5 w-3.5" />,
      sortMs: getPostSortMs(post),
    }));

export const formatCategoryLabel = (value: string) =>
  value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const resolveCategoryLabel = (categories: BlogCategoryConfig[] | undefined, value: string) =>
  categories?.find((option) => option.value === value)?.label ?? formatCategoryLabel(value);

export const resolveCategoryColor = (categories: BlogCategoryConfig[] | undefined, value: string) =>
  categories?.find((option) => option.value === value)?.colorClassName ?? "bg-primary/10 text-primary";
