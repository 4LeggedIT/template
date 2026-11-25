// Site origin is sourced from src/config/site.ts (siteConfig.siteUrl).

export const PRERENDER_EXCLUDE_ROUTES = [];

export const PRERENDER_EXCLUDE_PREFIXES = ["/playground"];

// Concrete slugs for the /examples/blog/:slug dynamic route (see blogExampleData.ts) —
// dynamic routes are excluded from auto-discovery, so slug-based routes list their
// concrete paths here per docs/standards' Blog pattern contract.
export const PRERENDER_EXTRA_ROUTES = [
  "/examples/blog/free-tools-for-social-media",
  "/examples/blog/lunas-journey-home",
  "/examples/blog/volunteer-spotlight-maria",
];
