// Site origin is sourced from src/config/site.ts (siteConfig.siteUrl).

export const PRERENDER_EXCLUDE_ROUTES = [];

export const PRERENDER_EXCLUDE_PREFIXES = ["/playground"];

// Concrete slugs for the /examples/blog/:slug dynamic route (see blogExampleData.ts) —
// dynamic routes are excluded from auto-discovery, so slug-based routes list their
// concrete paths here per docs/standards' Blog pattern contract.
export const PRERENDER_EXTRA_ROUTES = [
  "/examples/blog/simple-social-media-routine",
  "/examples/blog/maples-journey-home",
  "/examples/blog/volunteer-spotlight-maria",
];

// CSP rollout: true emits an enforcing Content-Security-Policy header,
// false (default) keeps Content-Security-Policy-Report-Only. Rollback: flip and push.
export const ENFORCE_CSP = true;

// Extra CSP allowances beyond what the patterns declare. The template's examples use local assets and the
// fleet media host only, so there are none; a site that needs one adds it here with a comment saying why.
export const EXTRA_CSP_REQUIREMENTS = {};
