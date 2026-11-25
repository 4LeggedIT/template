/**
 * SHARED PATTERN: do not edit in a site repo.
 * Source: github.com/4LeggedIT/internal-tools
 *   4leggedit-websites/templates-sources/patterns/BlogSection.tsx
 * Change it there, then sync it to every site.
 */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import ContentLink from "./ContentLink";
import { byNewestFirst, estimateReadTime, formatCategoryLabel, resolveCategoryColor, resolveCategoryLabel } from "./BlogSection.helpers";

// Structurally identical to HomeHighlightSection.tsx's `HomeHighlightItem` — declared locally
// (rather than imported) so this module has no dependency on the highlight-card pattern.
export type BlogHighlightItem = {
  id: string;
  title: string;
  summary?: string;
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  badgeLabel: string;
  badgeIcon: ReactNode;
  sortMs: number;
};

export type BlogPostEntry = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** YYYY-MM-DD */
  publishedAt: string;
  /** Mini-markdown body — see BlogPostDetail's content grammar. */
  content: string;
  /**
   * Internal record of where this post's content originated — a Facebook/Instagram post URL, an
   * external article URL, etc. Editorial reference only, never rendered on the page. Leave unset
   * when the content has no external source (e.g. an org-authored announcement). Pass an array
   * when one write-up draws on more than one original source post. Mirrors `EventsNewsEntry.source`.
   */
  source?: string | string[];
  author?: string;
  authorRole?: string;
  /** Site-local category key. No badge renders when omitted. */
  category?: string;
  imageSrc?: string;
  imageAlt?: string;
  /** Decorative fallback when no imageSrc is set. */
  emoji?: string;
  /** When set, BlogPostDetail renders a native <video> (poster={imageSrc}) instead of the plain hero image. */
  videoSrc?: string;
  /** Auto-computed from word count (~200wpm) when omitted. */
  readTime?: string;
  /** Preferred pick for showFeatured's hero card when featuredPostId isn't set. */
  featured?: boolean;
  /**
   * Flags this post for `HomeHighlightSection` via `getBlogHighlightItems()`. Optional,
   * backward-compatible — mirrors `EventsNewsBaseEntry.highlightOnHome` exactly, including the
   * "no auto-pin" rule: never default this to `true` just because it's a site's first/only post.
   */
  highlightOnHome?: boolean;
};

export type BlogCategoryConfig = {
  value: string;
  label: string;
  colorClassName?: string;
};

export type BlogSubscribeCta = {
  title?: string;
  description?: string;
  ctaLabel: string;
  href: string;
  /** Defaults to true (external link, opens in a new tab). Set false for an internal route. */
  external?: boolean;
};

export type BlogSectionLabels = {
  filterAllLabel?: string;
  readMoreLabel?: string;
  featuredLabel?: string;
  byLabel?: string;
  emptyMessage?: string;
};

type BlogSectionProps = {
  title?: string;
  description?: string;
  posts: BlogPostEntry[];
  /** Display labels/colors for category pills and badges; auto-derived (title-cased) from `posts` when omitted. */
  categories?: BlogCategoryConfig[];
  /** Locks the section to a single category and hides the filter pills — for embedding a filtered teaser elsewhere. */
  categoryFilter?: string;
  showFilters?: boolean;
  maxPosts?: number;
  /** Renders a hero card above the grid. Unfiltered view only — any active category hides the hero and folds its post back into the grid. */
  showFeatured?: boolean;
  featuredPostId?: string;
  /** Cards link to `${postBasePath}/${slug}`; titles render unlinked when omitted. */
  postBasePath?: string;
  /** Optional "more posts coming / subscribe" block, rendered after the grid. */
  subscribeCta?: BlogSubscribeCta;
  className?: string;
  labels?: BlogSectionLabels;
};


export const CategoryBadge = ({
  value,
  categories,
}: {
  value: string;
  categories?: BlogCategoryConfig[];
}) => (
  <span
    className={cn(
      "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium",
      resolveCategoryColor(categories, value),
    )}
  >
    {resolveCategoryLabel(categories, value)}
  </span>
);

export const PostThumb = ({ post, className }: { post: BlogPostEntry; className?: string }) => {
  if (post.imageSrc) {
    return (
      <img
        src={post.imageSrc}
        alt={post.imageAlt ?? post.title}
        loading="lazy"
        decoding="async"
        className={cn("h-full w-full bg-muted object-contain", className)}
      />
    );
  }
  if (post.emoji) {
    return (
      <div className={cn("flex h-full w-full items-center justify-center bg-muted text-4xl", className)}>
        {post.emoji}
      </div>
    );
  }
  return null;
};

const BlogSection = ({
  title,
  description,
  posts,
  categories,
  categoryFilter,
  showFilters = true,
  maxPosts,
  showFeatured = false,
  featuredPostId,
  postBasePath,
  subscribeCta,
  className,
  labels = {},
}: BlogSectionProps) => {
  const {
    filterAllLabel = "All",
    readMoreLabel = "Read article",
    featuredLabel = "Featured",
    byLabel = "By",
    emptyMessage = "New posts are on the way.",
  } = labels;

  const distinctCategories = useMemo(
    () => [...new Set(posts.map((post) => post.category).filter((value): value is string => Boolean(value)))],
    [posts],
  );

  const categoryOptions = useMemo(() => {
    if (categories) {
      return categories.filter((option) => distinctCategories.includes(option.value));
    }
    return [...distinctCategories]
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({ value, label: formatCategoryLabel(value) }));
  }, [categories, distinctCategories]);

  const [activeFilter, setActiveFilter] = useState<string>("all");

  const sortedPosts = useMemo(() => [...posts].sort(byNewestFirst), [posts]);

  const activeCategory = categoryFilter ?? (activeFilter === "all" ? undefined : activeFilter);

  // The hero is a claim about the whole collection, not about any one category, so it renders only
  // in the unfiltered view. As soon as the reader narrows — a filter pill, or a `categoryFilter`
  // lock — it steps aside and its post rejoins the grid below, competing on recency like any other.
  // Mirrors `EventsNewsSection`, which already hides its featured card while a search is active and
  // folds the pinned entry back into the searched pool.
  const featured = showFeatured && !activeCategory
    ? (featuredPostId
        ? sortedPosts.find((post) => post.id === featuredPostId)
        : (sortedPosts.find((post) => post.featured) ?? sortedPosts[0])) ?? null
    : null;

  const filtered = useMemo(() => {
    const pool = featured ? sortedPosts.filter((post) => post.id !== featured.id) : sortedPosts;
    const base = activeCategory ? pool.filter((post) => post.category === activeCategory) : pool;
    return typeof maxPosts === "number" ? base.slice(0, maxPosts) : base;
  }, [sortedPosts, featured, activeCategory, maxPosts]);

  const showPills = !categoryFilter && showFilters && categoryOptions.length > 1;

  const renderMeta = (post: BlogPostEntry) => (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <span>{post.publishedAt}</span>
      <span aria-hidden="true">&middot;</span>
      <span className="inline-flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {post.readTime ?? estimateReadTime(post.content)}
      </span>
      {post.author ? (
        <>
          <span aria-hidden="true">&middot;</span>
          <span>
            {byLabel} {post.author}
          </span>
        </>
      ) : null}
    </div>
  );

  return (
    <section className={cn("rounded-2xl border border-border bg-card/40 p-6", className)}>
      {title || description ? (
        <div className="mb-6">
          {title ? <h3 className="text-xl font-semibold tracking-tight">{title}</h3> : null}
          {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
        </div>
      ) : null}

      {showPills ? (
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => setActiveFilter("all")}
          >
            {filterAllLabel}
          </Button>
          {categoryOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={activeFilter === option.value ? "default" : "outline"}
              onClick={() => setActiveFilter(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      ) : null}

      {featured ? (
        <div className="mb-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{featuredLabel}</p>
          <Card className="overflow-hidden border-border/80">
            <div
              className={cn(
                "grid gap-0",
                featured.imageSrc || featured.emoji ? "sm:grid-cols-[280px_1fr]" : undefined,
              )}
            >
              {featured.imageSrc || featured.emoji ? (
                postBasePath ? (
                  <Link to={`${postBasePath}/${featured.slug}`} className="block h-48 sm:h-full">
                    <PostThumb post={featured} />
                  </Link>
                ) : (
                  <div className="h-48 sm:h-full">
                    <PostThumb post={featured} />
                  </div>
                )
              ) : null}
              <CardContent className="flex flex-col gap-3 p-6">
                {featured.category ? <CategoryBadge value={featured.category} categories={categories} /> : null}
                <h3 className="text-2xl font-bold tracking-tight">
                  {postBasePath ? (
                    <Link to={`${postBasePath}/${featured.slug}`} className="hover:underline">
                      {featured.title}
                    </Link>
                  ) : (
                    featured.title
                  )}
                </h3>
                <p className="text-muted-foreground">{featured.excerpt}</p>
                {renderMeta(featured)}
                {postBasePath ? (
                  <Button asChild variant="link" className="w-fit px-0">
                    <Link to={`${postBasePath}/${featured.slug}`} className="gap-2">
                      {readMoreLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : null}
              </CardContent>
            </div>
          </Card>
        </div>
      ) : null}

      {filtered.length ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <Card key={post.id} className="group flex flex-col overflow-hidden border-border/80">
              {post.imageSrc || post.emoji ? (
                postBasePath ? (
                  <Link to={`${postBasePath}/${post.slug}`} className="block h-40 overflow-hidden">
                    <PostThumb post={post} className="transition-transform duration-300 group-hover:scale-[1.03]" />
                  </Link>
                ) : (
                  <div className="h-40 overflow-hidden">
                    <PostThumb post={post} className="transition-transform duration-300 group-hover:scale-[1.03]" />
                  </div>
                )
              ) : null}
              <CardContent className="flex flex-1 flex-col gap-3 p-6">
                {post.category ? <CategoryBadge value={post.category} categories={categories} /> : null}
                <h3 className="text-lg font-semibold leading-snug tracking-tight">
                  {postBasePath ? (
                    <Link to={`${postBasePath}/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  ) : (
                    post.title
                  )}
                </h3>
                <p className="flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
                {renderMeta(post)}
                {postBasePath ? (
                  <Button asChild variant="link" className="w-fit px-0">
                    <Link to={`${postBasePath}/${post.slug}`} className="gap-2">
                      {readMoreLabel}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-6 text-sm text-muted-foreground">{emptyMessage}</CardContent>
        </Card>
      )}

      {subscribeCta ? (
        <Card className="mt-8 border-border/80 bg-background/60 text-center">
          <CardContent className="flex flex-col items-center gap-3 py-8">
            {subscribeCta.title ? <h3 className="text-xl font-bold tracking-tight">{subscribeCta.title}</h3> : null}
            {subscribeCta.description ? (
              <p className="max-w-md text-sm text-muted-foreground">{subscribeCta.description}</p>
            ) : null}
            <Button asChild>
              <ContentLink href={subscribeCta.href} external={subscribeCta.external !== false}>
                {subscribeCta.ctaLabel}
              </ContentLink>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
};

export default BlogSection;
