# 4leggedIT – Web Platform Overview

**Maintained by:** 4leggedIT  
**Website:** https://www.4leggedit.com  
**Contact:**  
- Email: woof@4leggedit.com

---

## Purpose

This project is part of the **4leggedIT** web platform, designed to help rescue and animal-serving organizations build, manage, and own their websites using practical, portable tools (without vendor lock-in).

The goal is not to add complexity. The goal is to make websites easier to maintain, easier to hand off, and easier for the public to trust.

---

## Mission & Vision

4leggedIT exists to reduce friction for rescue organizations through clear, sustainable, ownership-friendly technology.

We focus on:

- clarity over complexity
- continuity through volunteer turnover
- portability (no single-tool dependency)
- trust and transparency for the public

Learn more: https://www.4leggedit.com/mission

---

## Who This Is For

- Animal rescues, foster-based organizations, sanctuaries, and animal-serving nonprofits (or nonprofit-like volunteer teams)
- Organizations without dedicated technical staff who need systems that are understandable and sustainable
- Contributors who want to support rescue work with practical, Git-backed web infrastructure and documentation

---

## What This Project Is / Is Not

**This project is:**
- A website repository aligned with the 4leggedIT template standards
- A Git-backed source of truth that supports continuity and portability
- A public-facing communication tool that should remain clear, reliable, and easy to maintain

**This project is not:**
- A proprietary lock-in product
- A replacement for adoption platforms, donation processors, or rescue management systems
- A place to store secrets, private credentials, or sensitive operational information

---

## How We Work (Plain Language)

This repository follows a shared template so improvements can be reused across websites while keeping each organization’s content and identity independent.

That means we aim for:

- clear navigation and readable pages
- reliable publishing/build workflows
- mobile-friendly and no-JavaScript-friendly fallbacks for important actions
- documented patterns that can be reviewed and reused
- routine dependency security maintenance as part of normal upkeep

---

## Learn More / Resources

If you want the technical details, examples, or implementation standards, use these references:

- **Template website (public docs):** https://template.4leggedit.com/docs
- **Template website (live examples):** https://template.4leggedit.com/examples
- **Template repository (source):** https://github.com/4LeggedIT/template
- **4leggedIT website:** https://www.4leggedit.com

These resources explain the current standards (including form fallbacks, FAQ patterns, no-JS checks, and migration guidance).

---

## For Contributors (Quick Start)

You do not need to know every standard to get started.

Typical local workflow:

- `npm clean-install --progress=false`
- `npm run build`
- `npm run preview`

If you are reviewing fallback behavior, also use:

- `npm run preview:nojs` (when available in this repo)

For detailed contributor guidance, validation checklists, and standards, use the template docs/resources listed above.

---

## Ownership & Portability (Important)

4leggedIT is built around a simple rule: organizations should be able to keep operating if any one tool changes or disappears.

In practice, that means we prefer:

- Git-backed history and rollback
- clear build/deploy paths
- vendor-neutral patterns where possible
- account ownership/control staying with the organization (for rescue-specific infrastructure)

---

## Transparency Note

This repository is part of a broader effort to document and share practical web patterns that help rescues and animal-serving organizations operate sustainably.

As standards evolve, the template documentation and examples are the primary source of truth for implementation details.
