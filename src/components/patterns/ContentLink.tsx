/**
 * SHARED PATTERN: do not edit in a site repo.
 * Source: github.com/4LeggedIT/internal-tools
 *   4leggedit-websites/templates-sources/patterns/ContentLink.tsx
 * Change it there, then sync it to every site.
 */
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { isInternalPath, safeContentUrl, safeMediaUrl } from "@/lib/safe-url";

export type ContentLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  /** Content- or props-authored URL. Validated before it reaches an href. */
  href: string | undefined | null;
  /**
   * `true` forces a new-tab <a>, `false` forces a router <Link>, omitted infers
   * from the value (same-site path -> Link, anything else -> new-tab <a>).
   */
  external?: boolean;
  /** Accept the site's own inlined raster `data:image/` URLs (image links only). */
  imageLink?: boolean;
  /**
   * What to render when the URL is missing or unsafe. `"nothing"` (default)
   * renders no link at all; `"children"` renders the children unlinked (use
   * this for an image wrapped in a link).
   */
  whenUnsafe?: "nothing" | "children";
  children?: ReactNode;
};

/**
 * The single sink for props-authored links in shared patterns. It routes the
 * value through safeContentUrl() so a `javascript:` (or other executable)
 * scheme, or a `//host` value dressed as a local path, never becomes an href.
 * Works as the child of `<Button asChild>`.
 */
const ContentLink = forwardRef<HTMLAnchorElement, ContentLinkProps>(function ContentLink(
  { href, external, imageLink, whenUnsafe = "nothing", children, ...rest },
  ref,
) {
  const safe = imageLink ? safeMediaUrl(href) : safeContentUrl(href);
  if (!safe) return whenUnsafe === "children" ? <>{children}</> : null;

  const useRouterLink = external === undefined ? isInternalPath(safe) : !external;
  if (useRouterLink && !imageLink) {
    return (
      <Link ref={ref} to={safe} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a ref={ref} target="_blank" rel="noopener noreferrer" {...rest} href={safe}>
      {children}
    </a>
  );
});

export default ContentLink;
