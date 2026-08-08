# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 4leggedIT Platform Context

This is **the 4leggedIT platform's reference template** — the canonical, brand-neutral baseline that every client rescue site is built from, and the live documentation site for every shared pattern.

- **Claude memory** — `~/.claude/projects/-Users-davids-Documents-Git/memory/` — persisted facts about the platform, active branches, and governance decisions.
- **Governance docs** — `internal-tools/4leggedit-websites/docs/governance/` — canonical rules for MVP0/MVP2/MVP3 compliance, module sync, branch naming, and tooling.
- **Module source of truth** — `internal-tools/4leggedit-websites/templates-sources/`. Every shared pattern in `src/components/patterns/` (except `SiteHeader.tsx`/`SiteFooter.tsx`/`SiteLayout.tsx`, which are infrastructure and exempt from the "travels verbatim" rule) must match its upstream copy — change there first, then sync down.
- **Sync flow** — `internal-tools/templates-sources/` → **this repo** → client sites (`the-comeback-pack`, `feedingperrisstrays`, `roversreturndogrescue`, etc.). This repo is the middle of that chain: it receives pattern changes from `internal-tools` and is the source client sites copy from.
- **Active branch:** verify with `git branch --show-current` — do not trust this file, branches get merged/deleted between sessions.

## About This Project

The standardized website baseline for animal-rescue client sites — every `/standards/*` page is both documentation and a live, working example of a shared pattern (`AdoptablePetsSection`, `EventsNewsSection`, `CommunityPartnersSection`, etc.). The home page and site chrome (header, footer) intentionally carry 4leggedIT's own brand identity, since this site is 4leggedIT's own platform showcase — client sites replace that branding with their own; the pattern components themselves stay brand-neutral.

## Commands

```bash
# Development
npm run dev                  # local dev server

# Build & Preview
npm run build                # links:check → vite build → SSR build → prerender → dist/
npm run preview              # serve dist/ with Vite
npm run preview:nojs         # serve dist/ with JS disabled (fallback QA)
npm run preview:nojs:build   # build + preview:nojs in one step

# QA
npm run links:check          # internal link audit (tools/check-internal-links.mjs)
npm run qa:smoke:nojs        # route-crawling no-JS smoke test
npm run qa:smoke:nojs:build  # build + qa:smoke:nojs in one step

# Lint / typecheck
npm run lint                 # ESLint
npm run typecheck            # tsc -b --force
```

## Architecture

### Routing
`src/AppRoutes.tsx` — most routes are nested under the shared `SiteLayout`/`AppShell` wrapper (header + footer). The three `/tools/*` print/kiosk-display routes are mounted as siblings outside that wrapper, since they're self-contained full-viewport pages with their own `@media print` rules.

### Pattern documentation pages
`src/pages/standards/*StandardPage.tsx` — one page per shared pattern at `/standards/<pattern>`, each with a live example plus a "Standard" card of governance rules. A pattern with multiple genuinely distinct modes (e.g. Adoptable Pets: local/petfinder/adopt-a-pet/getbuddy/pawplacer/hybrid) gets an overview page plus one dedicated subpage per mode, rather than one overloaded page.

### i18n
`src/i18n/index.ts` (i18next + react-i18next) covers all page-level text — site chrome (nav, footer, home page, error pages) and every `/standards/*` pattern page (headings, prose, breadcrumbs, "Standard" rule lists) — via `src/locales/{en,es}/*.json`, one namespace per page. Shared pattern components (`src/components/patterns/*`) intentionally stay single-language/plain-`string` props — never add i18n directly to a shared component. Page-local example data that needs to vary by language (e.g. `src/data/adoptable-pets.ts`) is authored as `LocalizedText` and resolved to plain strings at the page level via `resolveText`/`toContentLocale` (`src/lib/localized-content.ts`) before being passed into the shared component — the same pattern real bilingual client sites use for their own content data. Some example data (e.g. `src/pages/examples/eventsNewsExampleData.ts`) is deliberately left English-only and documented as such, to demonstrate the plain-string shape a typical non-bilingual client site authors — see that file's own comment and the Events & News page's "Localization (bilingual sites)" section.

### Static assets
- `public/` — allowlist-only: favicons, `robots.txt`, `_headers`, `_redirects`, `.well-known/security.txt`, OG image
- `src/assets/` — images imported by components (Vite handles hashing), including the 4leggedIT logo used in the header/footer

## Tools (Synced from internal-tools)

Generator tools synced from `internal-tools/4leggedit-websites/templates-sources/tools/`:

| Tool | Notes |
|---|---|
| `gen-favicon.mjs` | Reads `src/assets/logo.png` |
| `gen-og-image.mjs` | Reads `tools/og-image-config.json` |
| `gen-document-pdf.mjs` | Renders a print `/documents/<slug>` page to PDF and writes `public/documents/<slug>.pdf` (the Resources-page download); needs dev/preview server running |
| `optimize-images.mjs` | WebP conversion + resize; requires `sharp` + `svgo` |

**Important:** Generator tools are synced verbatim from upstream. Do not edit locally. Update in `internal-tools/` first, then propagate.

Build-infrastructure tools (`build.mjs`, `app-routes.mjs`, `check-internal-links.mjs`, `preview-static.mjs`, `smoke-nojs.mjs`) are site-specific and maintained here directly.

## Notes for Contributors

1. **SEO:** Every page component uses `<SEOHead>` with `title`, `description`, and `canonicalPath`. Org-identity JSON-LD (`Organization`/`NonprofitOrganization`/`LocalBusiness`, configurable via `siteConfig.organization.type`) is emitted automatically at the app-shell level via `lib/organizationJsonLd.ts` + `<StructuredData>` (wired in `App.tsx`/`entry-server.tsx`) — no per-page action needed. See `internal-tools/4leggedit-websites/docs/governance/module-wiring-contracts.md`'s `lib/organizationJsonLd.ts` contract.
2. **Never invent facts:** any example data representing a real organization must be sourced from that organization's real, public listings, with a clear non-affiliation disclosure (see the Adoptable Pets pattern pages).
3. **Patterns travel verbatim:** if changing a shared pattern component's behavior, change it in `internal-tools/templates-sources/patterns/` first, then sync here — never diverge this repo's copy from upstream (except the infrastructure exemptions noted above).
