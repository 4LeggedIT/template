/**
 * Standard Rollup `manualChunks` for every site that needs it (core-governance-standard.md,
 * "Build: chunk size governance"). Goal: every JS chunk stays under Vite's default 500 KB
 * warning limit, which is the CI gate; `chunkSizeWarningLimit` is never raised.
 *
 * Vendor groups are the long-standing standard. App code is split in acyclic layers only,
 * because a circular chunk (A -> B -> A) fails at runtime with
 * "Cannot access X before initialization":
 *
 *   shared     src/components, hooks, contexts, lib, config, types, utils   may import: shared, i18n
 *   data-<f>   src/data/<f>                                                  may import: data, shared, i18n
 *   i18n       src/i18n, src/locales (own chunks)                            may import: i18n, shared
 *
 * A module is assigned to its layer's chunk only if its WHOLE import closure stays inside the
 * layer's allowed set (plus node_modules and non-code assets). Anything that reaches "up"
 * (shared -> data, support -> shared, ...) stays in the main chunk, so dependencies only ever
 * point downward and the chunk graph cannot cycle. Pages and app entry always stay in main.
 */
const norm = (id) => id.replaceAll("\\", "/");
const isCode = (p) => /\.(m?[jt]sx?)$/.test(p.split("?")[0]);

const layerOf = (p) => {
  if (/\/src\/(components|hooks|contexts|lib|config|types|utils)\//.test(p)) return "shared";
  if (/\/src\/data\//.test(p)) return "data";
  if (/\/src\/(i18n|locales)\//.test(p)) return "i18n";
  return null;
};

const ALLOWED = {
  shared: new Set(["shared", "i18n"]),
  data: new Set(["data", "shared", "i18n"]),
  i18n: new Set(["i18n", "shared"]),
};

const pureYes = new Set();
const pureNo = new Set();

/**
 * True when every module reachable from `id` (itself included) only imports modules whose
 * layer its own layer allows. Verified over the whole closure, so a cycle through an impure
 * module can never be mistaken for a pure one; all modules of a passing closure are
 * pure too (their closures are subsets).
 */
const pure = (id, getModuleInfo) => {
  if (pureYes.has(id)) return true;
  if (pureNo.has(id)) return false;
  const seen = new Set([id]);
  const queue = [id];
  let ok = true;
  while (ok && queue.length) {
    const cur = queue.pop();
    const layer = layerOf(norm(cur));
    if (!layer) {
      ok = false;
      break;
    }
    const info = getModuleInfo(cur);
    for (const dep of info ? info.importedIds : []) {
      const dp = norm(dep);
      if (dp.includes("node_modules") || !isCode(dp)) continue;
      const depLayer = layerOf(dp);
      if (!depLayer || !ALLOWED[layer].has(depLayer)) {
        ok = false;
        break;
      }
      if (!seen.has(dep)) {
        seen.add(dep);
        queue.push(dep);
      }
    }
  }
  if (ok) for (const m of seen) pureYes.add(m);
  else pureNo.add(id);
  return ok;
};

export function manualChunks(id, { getModuleInfo } = {}) {
  const p = norm(id);

  if (!p.includes("node_modules")) {
    if (p.includes("/src/locales/")) return "locales";
    if (p.includes("/src/i18n/")) return "i18n";
    if (!getModuleInfo || !isCode(p)) return undefined;
    const layer = layerOf(p);
    if (!layer || !pure(id, getModuleInfo)) return undefined;
    if (layer === "shared") return "shared";
    const data = p.match(/\/src\/data\/([^/.]+)/);
    return data ? `data-${data[1]}` : "data";
  }

  if (p.includes("/react-dom/") || p.includes("/react/")) return "react";
  if (p.includes("/react-router-dom/") || p.includes("/react-router/")) return "router";
  if (p.includes("/framer-motion/")) return "motion";
  if (p.includes("/lucide-react/")) return "icons";
  if (p.includes("/@radix-ui/")) return "radix";
  if (p.includes("/@tanstack/")) return "tanstack";
  // recharts and its whole dependency tree travel together; clsx is included because recharts
  // imports it and the app's own helpers do too. Left to Rollup's default placement, clsx lands in
  // the app's shared chunk and recharts -> shared -> recharts becomes a circular chunk.
  if (/\/(recharts|recharts-scale|victory-vendor|d3-[a-z-]+|internmap|decimal\.js-light|eventemitter3|react-smooth|tiny-invariant|fast-equals|lodash|react-is|clsx)\//.test(p)) return "recharts";
  if (p.includes("/react-i18next/") || p.includes("/i18next")) return "i18n";
  return undefined;
}
