// Governance check: module-wiring-contracts.md "Recurrence display" rule (~L101) — any page
// rendering the shared EventsNewsDetail pattern must, for recurring events, (1) resolve the
// occurrence (live next, or a requested `?date=` occurrence) via getNextOccurrence() — directly,
// or via the shared resolveEventOccurrence() (components/patterns/EventsNewsSection.tsx), which
// wraps it — and (2) render a recurrence badge/summary built from describeRecurrence() — both
// from lib/event-recurrence.ts — never just the frozen seed date. Resolution may happen in the
// page itself (calling getNextOccurrence()/resolveEventOccurrence() directly — the common case
// since resolveEventOccurrence() was added) or in a src/data/*.ts accessor the page calls through
// (feedingperrisstrays' getEffectiveEvent(), used for its non-detail-page listing helpers) — this
// check follows local imports from src/data and src/lib to find getNextOccurrence() either way,
// so every valid pattern in the fleet passes. resolveEventOccurrence() itself is checked only as
// a direct page-level call (not followed transitively), since it lives under components/patterns/
// alongside many unrelated exports — treating any import of that file as proof of resolution would
// make the check pass for pages that import it for something else (e.g. getAdjacentEntries) but
// never actually resolve an occurrence.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const srcRoot = path.join(projectRoot, "src");

const walk = (dir) => {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name === "dist-ssr") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) files.push(full);
  }
  return files;
};

const readSafe = (file) => {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
};

const IMPORT_RE = /from\s+["']([^"']+)["']/g;

const resolveSpecifier = (fromFile, specifier) => {
  let base;
  if (specifier.startsWith("@/")) {
    base = path.join(srcRoot, specifier.slice(2));
  } else if (specifier.startsWith(".")) {
    base = path.resolve(path.dirname(fromFile), specifier);
  } else {
    return null; // external package
  }
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts"), path.join(base, "index.tsx")]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
};

// Detail pages: any page under src/pages that renders the shared EventsNewsDetail pattern —
// found by import, not filename, since the wrapper file is named differently per site
// (NewsEntry.tsx, EventDetail.tsx, EventsNewsExampleEventDetailPage.tsx, ...).
// A page can opt out with a `check-event-recurrence-ignore: <reason>` comment anywhere in the
// file — for pages that provably only ever render kind:"news" entries (no `recurrence` field
// exists on that type), not as a general bypass.
const IGNORE_RE = /check-event-recurrence-ignore:\s*(.+)/;

const pageFiles = walk(path.join(srcRoot, "pages"));
const detailPages = pageFiles.filter((file) => {
  const content = readSafe(file);
  if (IGNORE_RE.test(content)) return false;
  return /from\s+["'][^"']*\/EventsNewsDetail["']/.test(content) && /<EventsNewsDetail\b/.test(content);
});

if (detailPages.length === 0) {
  console.log("check-event-recurrence: no event/news detail page found (module not in use here) — skipping.");
  process.exit(0);
}

// Checks whether `fnRe` (a function-call regex) is reachable from a detail page — directly in
// the page, or transitively through its src/data/src/lib imports (the entry-fetching layer).
// Only that layer is followed, to avoid false positives from unrelated usage elsewhere in the
// app (e.g. getNextOccurrence()/describeRecurrence() calls inside EventBanner.tsx).
const findInResolutionChain = (pageFile, fnRe) => {
  const visited = new Set([pageFile]);
  const queue = [pageFile];
  if (fnRe.test(readSafe(pageFile))) return true;

  while (queue.length > 0) {
    const current = queue.shift();
    const content = readSafe(current);
    let match;
    IMPORT_RE.lastIndex = 0;
    while ((match = IMPORT_RE.exec(content))) {
      const resolved = resolveSpecifier(current, match[1]);
      if (!resolved || visited.has(resolved)) continue;
      const rel = path.relative(srcRoot, resolved);
      if (!rel.startsWith(`data${path.sep}`) && !rel.startsWith(`lib${path.sep}`)) continue;
      visited.add(resolved);
      if (fnRe.test(readSafe(resolved))) return true;
      queue.push(resolved);
    }
  }
  return false;
};

const GET_NEXT_OCCURRENCE_RE = /\bgetNextOccurrence\s*\(/;
const RESOLVE_EVENT_OCCURRENCE_RE = /\bresolveEventOccurrence\s*\(/;
const DESCRIBE_RECURRENCE_RE = /\bdescribeRecurrence\s*\(/;

const dateViolations = [];
const badgeViolations = [];

for (const pageFile of detailPages) {
  // resolveEventOccurrence() is checked as a direct call in the page only (not followed into
  // src/data|src/lib transitively, since it isn't defined there) — see the file-header comment.
  const pageSource = readSafe(pageFile);
  const resolvesDirectly = RESOLVE_EVENT_OCCURRENCE_RE.test(pageSource);
  if (!resolvesDirectly && !findInResolutionChain(pageFile, GET_NEXT_OCCURRENCE_RE)) dateViolations.push(pageFile);
  if (!findInResolutionChain(pageFile, DESCRIBE_RECURRENCE_RE)) badgeViolations.push(pageFile);
}

if (dateViolations.length > 0 || badgeViolations.length > 0) {
  console.error("check-event-recurrence: FAILED\n");
  console.error('Per module-wiring-contracts.md\'s "Recurrence display" rule, a recurring event\'s detail');
  console.error("page must show a live next-occurrence date plus a recurrence badge/summary — never just");
  console.error("the frozen seed date:\n");

  if (dateViolations.length > 0) {
    console.error(
      "Missing live-date resolution — these page(s) render <EventsNewsDetail> but never call\n" +
        "getNextOccurrence() (directly, or via an imported src/data or src/lib module):",
    );
    for (const file of dateViolations) console.error(`  - ${path.relative(projectRoot, file)}`);
    console.error(
      "  Fix: resolve the entry through getNextOccurrence() from @/lib/event-recurrence before\n" +
        "  passing it to <EventsNewsDetail>, or confirm the entry-fetching accessor already does this.\n" +
        "  Reference: fosterpawsnetwork/src/pages/NewsEntry.tsx (page-level resolveEntry()) or\n" +
        "  feedingperrisstrays/src/data/events.ts's getEffectiveEvent() (data-layer resolution).\n",
    );
  }

  if (badgeViolations.length > 0) {
    console.error(
      "Missing recurrence badge/summary — these page(s) never call describeRecurrence() (directly,\n" +
        "or via an imported src/data or src/lib module) to build the recurrence sentence:",
    );
    for (const file of badgeViolations) console.error(`  - ${path.relative(projectRoot, file)}`);
    console.error(
      "  Fix: build a summary from describeRecurrence() (returns no text itself — interpolate your\n" +
        "  own sentence) and fold it into entry.dateLabel (e.g. `${dateText} · ${recurrenceSummary}`).\n" +
        "  Reference: fosterpawsnetwork/src/pages/NewsEntry.tsx (English) or\n" +
        "  the-comeback-pack/src/pages/NewsEntry.tsx (i18n, via the \"news\" namespace's `recurrence.*` keys).",
    );
  }

  process.exit(1);
}

console.log(`check-event-recurrence: OK (${detailPages.length} detail page(s) checked)`);
