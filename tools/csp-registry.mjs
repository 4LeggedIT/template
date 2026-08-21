/**
 * Single source of truth for which third-party origins each shared pattern
 * component needs allowed in Content-Security-Policy. Consumed by
 * gen-csp-headers.mjs (build-time CSP generation) and check-csp-registry.mjs
 * (governance check that new patterns register their needs).
 *
 * Rule: any shared pattern in templates-sources/patterns/ that loads a
 * third-party <script src>, <iframe src>, fetch()/XHR call, or <img src>
 * MUST have an entry here in the same change. Plain <a href> links (maps,
 * calendar, share links) never need an entry — CSP doesn't restrict
 * top-level navigation. See docs/governance/csp-registry-governance.md.
 *
 * Plain JS (not .ts): this file is imported directly by plain-Node build
 * scripts (tools/build.mjs) that don't run through a TypeScript loader —
 * same reason tools/build.mjs itself reads src/config/site.ts as text
 * instead of importing it.
 */

// Always-on, independent of which patterns a site uses — fonts are loaded
// via a <link> in index.html, not from a pattern component.
//
// Cloudflare Web Analytics (static.cloudflareinsights.com/beacon.min.js +
// its cloudflareinsights.com/cdn-cgi/rum connect) is auto-injected by
// Cloudflare Pages itself at the CDN edge on every deploy — it's not
// referenced anywhere in our source, so no pattern-usage scan could ever
// find it. Confirmed live via browser console on template.4leggedit.com
// after the first real CSP deploy, 2026-08-15.
export const cspBaseline = {
  fontSrc: ["https://fonts.gstatic.com"],
  styleSrc: ["https://fonts.googleapis.com"],
  scriptSrc: ["https://static.cloudflareinsights.com"],
  connectSrc: ["https://cloudflareinsights.com", "https://static.cloudflareinsights.com"],
};

// FIXED 2026-08-15 (not here — no static registry entry can cover this):
// the site's own <StructuredData> component renders an inline
// <script type="application/ld+json"> block, and Chrome enforces script-src
// against it despite it not being executable code (a known CSP/JSON-LD
// quirk). gen-csp-headers.mjs's collectJsonLdHashes() now hashes every
// route's actual prerendered JSON-LD content after the build's prerender
// step and adds each as a 'sha256-...' script-src source — computed fresh
// per build, not hand-maintained, same "generate, don't hand-maintain"
// convention as everything else in this registry. Requires
// tools/build.mjs to call writeCspHeaders(rootDir) LAST, after prerendering
// writes every route's HTML — not right after the Vite client build.

// Keyed by pattern component name — must match the .tsx filename (minus
// extension) in components/patterns/.
export const patternCspRequirements = {
  PetfinderScrollerEmbed: {
    // DEFAULT_SCRIPT_SRC / DEFAULT_API_BASE / DEFAULT_S3_URL in the component
    scriptSrc: ["https://www.petfinder.com"],
    connectSrc: ["https://psl.petfinder.com"],
    imgSrc: ["https://dbw3zep4prcju.cloudfront.net"],
  },
  KennelBinderPagesSection: { imgSrc: ["https://api.qrserver.com"] },
  AdoptableSlideshowSection: { imgSrc: ["https://api.qrserver.com"] },
  KennelBinder2UpSection: { imgSrc: ["https://api.qrserver.com"] },
  KennelBinderCoverSection: { imgSrc: ["https://api.qrserver.com"] },
  KennelCards2UpSection: { imgSrc: ["https://api.qrserver.com"] },
  BusinessCardGenericSection: { imgSrc: ["https://api.qrserver.com"] },
  BusinessCardTeamSection: { imgSrc: ["https://api.qrserver.com"] },
  AdoptAPetEmbed: {
    // buildScrollerSrcDoc()'s injected <script>/<img> — rendered inside an
    // iframe via srcDoc, which inherits the parent document's CSP
    scriptSrc: ["https://images.adoptapet.com"],
    imgSrc: ["https://images.adoptapet.com"],
  },
  PawPlacerEmbed: {
    // PAWPLACER_SCRIPT_SRC, injected the same way Petfinder's bundle is
    scriptSrc: ["https://www.pawplacer.com"],
  },
  AdoptablePetsSection: {
    // Builds the GetBuddy embed URL (www.getbuddy.com/embed/...) fed into a
    // child <GetBuddyEmbed>'s iframe — GetBuddyEmbed.tsx itself takes the
    // URL as a plain prop and hardcodes no domain of its own.
    frameSrc: ["https://www.getbuddy.com"],
  },
  FormEmbedModal: {
    // Provider-agnostic iframe — the two real providers in use fleet-wide today.
    // Never add accounts.google.com here: Google itself refuses to complete
    // sign-in inside a third-party iframe (an anti-phishing restriction, not a
    // CSP/cookie issue), so sign-in-gated Google Forms use requiresGoogleAccount
    // to bypass the iframe/modal entirely and open as a plain new-tab link instead.
    frameSrc: ["https://form.jotform.com", "https://docs.google.com"],
  },
  EventsNewsSection: {
    // getFacebookVideoEmbedSrc() -> facebook.com/plugins/video.php iframe
    frameSrc: ["https://www.facebook.com"],
  },
  PayPalDonateButton: {
    // DONATE_SDK_SRC = paypalobjects.com/donate/sdk/donate-sdk.js
    scriptSrc: ["https://www.paypalobjects.com"],
    imgSrc: ["https://www.paypalobjects.com"],
    connectSrc: ["https://www.paypal.com"],
    frameSrc: ["https://www.paypal.com"],
  },
  ZeffyDonateEmbed: {
    // ZEFFY_EMBED_SCRIPT_SRC, populates [data-zeffy-embed]; frameSrc covers
    // both the no-JS-safe fallback iframe and the script's own embedded form.
    scriptSrc: ["https://www.zeffy.com"],
    frameSrc: ["https://www.zeffy.com"],
  },
};
