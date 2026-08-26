import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CategoryBadge,
  estimateReadTime,
  type BlogCategoryConfig,
  type BlogPostEntry,
} from "@/components/patterns/BlogSection";
import { cn } from "@/lib/utils";
import { safeContentUrl } from "@/lib/safe-url";

export type BlogPostDetailLabels = {
  backLabel?: string;
  keepReadingLabel?: string;
  readMoreLabel?: string;
};

type BlogPostDetailCta = {
  title?: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
  /** Defaults to true (external link, opens in a new tab). Set false for an internal route. */
  external?: boolean;
};

type BlogPostDetailProps = {
  post: BlogPostEntry;
  backHref: string;
  categories?: BlogCategoryConfig[];
  /** Page-resolved related posts, e.g. via `getRelatedBlogPosts(posts, post.slug)`. */
  relatedPosts?: BlogPostEntry[];
  /** Required for related-post cards to link out; they render unlinked when omitted. */
  postBasePath?: string;
  /** Optional closing CTA card. Renders nothing when omitted. */
  cta?: BlogPostDetailCta;
  className?: string;
  labels?: BlogPostDetailLabels;
};

// Content grammar (ported from 4leggedit's original BlogArticle.tsx parser):
// "## " headings, "### " subheadings, "> " blockquotes, "- " list items, full-line
// "**bold**" emphasis paragraphs, plain paragraphs, fenced ``` code blocks (optional
// language), and inline `code`, [text](url) links, and **bold**.

type BlogContentBlockType = "heading" | "subheading" | "paragraph" | "list" | "emphasis" | "blockquote" | "codeblock";

type BlogContentBlock = {
  type: BlogContentBlockType;
  content: string;
  items?: string[];
  language?: string;
};

const parseBlogContent = (content: string): BlogContentBlock[] => {
  const blocks: BlogContentBlock[] = [];
  const lines = content.split("\n");
  let currentList: string[] = [];
  let currentBlockquote: string[] = [];
  let currentCodeBlock: string[] = [];
  let codeBlockLanguage = "";
  let inCodeBlock = false;

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push({ type: "list", content: "", items: [...currentList] });
      currentList = [];
    }
  };

  const flushBlockquote = () => {
    if (currentBlockquote.length > 0) {
      blocks.push({ type: "blockquote", content: currentBlockquote.join("\n") });
      currentBlockquote = [];
    }
  };

  const flushCodeBlock = () => {
    if (currentCodeBlock.length > 0) {
      blocks.push({ type: "codeblock", content: currentCodeBlock.join("\n"), language: codeBlockLanguage });
      currentCodeBlock = [];
      codeBlockLanguage = "";
    }
  };

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        flushCodeBlock();
        inCodeBlock = false;
      } else {
        flushList();
        flushBlockquote();
        inCodeBlock = true;
        codeBlockLanguage = line.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      currentCodeBlock.push(line);
      continue;
    }

    if (line.startsWith("### ")) {
      flushList();
      flushBlockquote();
      blocks.push({ type: "subheading", content: line.replace("### ", "") });
    } else if (line.startsWith("## ")) {
      flushList();
      flushBlockquote();
      blocks.push({ type: "heading", content: line.replace("## ", "") });
    } else if (line.startsWith("> ")) {
      flushList();
      currentBlockquote.push(line.replace(/^>\s?/, ""));
    } else if (line.startsWith("- ")) {
      flushBlockquote();
      currentList.push(line.replace("- ", ""));
    } else if (line.startsWith("**") && line.endsWith("**") && !line.slice(2, -2).includes("**")) {
      flushList();
      flushBlockquote();
      blocks.push({ type: "emphasis", content: line.replace(/\*\*/g, "") });
    } else if (line.trim() !== "") {
      flushList();
      flushBlockquote();
      blocks.push({ type: "paragraph", content: line });
    } else {
      flushList();
      flushBlockquote();
    }
  }

  flushList();
  flushBlockquote();
  if (inCodeBlock) flushCodeBlock();

  return blocks;
};

const inlineMarkdownRegex = /(`[^`]+`)|(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)/g;

const renderInlineMarkdown = (text: string): Array<string | JSX.Element> => {
  const parts: Array<string | JSX.Element> = [];
  const regex = new RegExp(inlineMarkdownRegex.source, "g");
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));

    if (match[1]) {
      parts.push(
        <code
          key={`code-${keyIndex++}`}
          className="rounded bg-secondary/80 px-1.5 py-0.5 font-mono text-[0.9em] text-primary"
        >
          {match[1].slice(1, -1)}
        </code>,
      );
    } else if (match[2]) {
      const href = safeContentUrl(match[4]);
      parts.push(
        href ? (
          <a
            key={`link-${keyIndex++}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
          >
            {match[3]}
          </a>
        ) : (
          match[3]
        ),
      );
    } else if (match[5]) {
      parts.push(
        <strong key={`bold-${keyIndex++}`} className="font-semibold text-foreground">
          {match[6]}
        </strong>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length > 0 ? parts : [text];
};

const renderBlogContentBlock = (block: BlogContentBlock, index: number) => {
  switch (block.type) {
    case "heading":
      return (
        <h2
          key={index}
          className="mb-4 mt-10 flex items-center gap-3 text-2xl font-bold tracking-tight md:text-3xl"
        >
          <span className="h-8 w-1 flex-shrink-0 rounded-full bg-primary" />
          {block.content}
        </h2>
      );
    case "subheading":
      return (
        <h3 key={index} className="mb-3 mt-8 text-xl font-bold tracking-tight">
          {block.content}
        </h3>
      );
    case "list":
      return (
        <ul key={index} className="mb-6 space-y-2 pl-1">
          {block.items?.map((item, itemIndex) => (
            <li key={itemIndex} className="flex items-start gap-3 text-muted-foreground">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span>{renderInlineMarkdown(item)}</span>
            </li>
          ))}
        </ul>
      );
    case "emphasis":
      return (
        <p key={index} className="mb-6 text-lg font-medium leading-relaxed text-foreground">
          {renderInlineMarkdown(block.content)}
        </p>
      );
    case "blockquote":
      return (
        <blockquote key={index} className="my-8 rounded-r-xl border-l-4 border-primary bg-primary/5 py-4 pl-6">
          <p className="italic leading-relaxed text-foreground">{renderInlineMarkdown(block.content)}</p>
        </blockquote>
      );
    case "codeblock":
      return (
        <div key={index} className="my-8 overflow-hidden rounded-2xl">
          {block.language ? (
            <div className="bg-foreground/90 px-4 py-2 font-mono text-sm text-background">{block.language}</div>
          ) : null}
          <pre className="overflow-x-auto bg-foreground/95 p-6 text-background">
            <code className="font-mono text-sm leading-relaxed">{block.content}</code>
          </pre>
        </div>
      );
    default:
      return (
        <p key={index} className="mb-6 leading-relaxed text-muted-foreground">
          {renderInlineMarkdown(block.content)}
        </p>
      );
  }
};

const RelatedPostCard = ({
  post,
  postBasePath,
  categories,
  readMoreLabel,
}: {
  post: BlogPostEntry;
  postBasePath?: string;
  categories?: BlogCategoryConfig[];
  readMoreLabel: string;
}) => {
  const body = (
    <>
      {post.emoji ? <div className="flex-shrink-0 text-3xl">{post.emoji}</div> : null}
      <div>
        {post.category ? (
          <div className="mb-2">
            <CategoryBadge value={post.category} categories={categories} />
          </div>
        ) : null}
        <h3 className="mb-2 text-lg font-bold tracking-tight transition-colors group-hover:text-primary">
          {post.title}
        </h3>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
          {readMoreLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </>
  );

  const className = "group flex gap-4 rounded-2xl border border-border/80 bg-card p-6 transition-shadow hover:shadow-md";

  if (!postBasePath) {
    return <div className={className}>{body}</div>;
  }

  return (
    <Link to={`${postBasePath}/${post.slug}`} className={className}>
      {body}
    </Link>
  );
};

const BlogPostDetail = ({
  post,
  backHref,
  categories,
  relatedPosts = [],
  postBasePath,
  cta,
  className,
  labels = {},
}: BlogPostDetailProps) => {
  const {
    backLabel = "Back to blog",
    keepReadingLabel = "Keep reading",
    readMoreLabel = "Read",
  } = labels;

  const blocks = parseBlogContent(post.content);
  const readTime = post.readTime ?? estimateReadTime(post.content);

  return (
    <article className={cn("mx-auto max-w-3xl", className)}>
      <Link
        to={backHref}
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <header className="mb-8">
        {post.category ? (
          <div className="mb-4">
            <CategoryBadge value={post.category} categories={categories} />
          </div>
        ) : null}
        <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          {post.title} {post.emoji ? <span className="inline-block">{post.emoji}</span> : null}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {post.publishedAt}
          </span>
          {post.author ? (
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {post.author}
              {post.authorRole ? <span className="text-muted-foreground/70"> &middot; {post.authorRole}</span> : null}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {readTime}
          </span>
        </div>
      </header>

      {post.videoSrc ? (
        <div className="mb-8 flex justify-center">
          <video
            controls
            playsInline
            preload="metadata"
            poster={post.imageSrc}
            className="block max-h-[520px] w-auto max-w-full rounded-2xl"
          >
            <source src={post.videoSrc} type="video/mp4" />
          </video>
        </div>
      ) : post.imageSrc ? (
        <div className="mb-8 overflow-hidden rounded-2xl">
          <img src={post.imageSrc} alt={post.imageAlt ?? post.title} className="h-auto w-full object-cover" />
        </div>
      ) : null}

      <div>{blocks.map((block, index) => renderBlogContentBlock(block, index))}</div>

      {cta ? (
        <Card className="mt-12 border-border/80 bg-card text-center">
          <CardContent className="flex flex-col items-center gap-3 py-10">
            {cta.title ? <h2 className="text-2xl font-bold tracking-tight">{cta.title}</h2> : null}
            {cta.description ? <p className="max-w-md text-muted-foreground">{cta.description}</p> : null}
            <Button asChild size="lg">
              {cta.external === false ? (
                <Link to={cta.ctaHref}>{cta.ctaLabel}</Link>
              ) : (
                <a href={cta.ctaHref} target="_blank" rel="noopener noreferrer">
                  {cta.ctaLabel}
                </a>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {relatedPosts.length ? (
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">{keepReadingLabel}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {relatedPosts.map((relatedPost) => (
              <RelatedPostCard
                key={relatedPost.id}
                post={relatedPost}
                postBasePath={postBasePath}
                categories={categories}
                readMoreLabel={readMoreLabel}
              />
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
};

export default BlogPostDetail;
