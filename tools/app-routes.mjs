import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const normalizeRoutePath = (routePath) => {
  if (!routePath) return "";
  const normalized = routePath === "/" ? "/" : routePath.replace(/\/+$/, "");
  if (normalized === "/" || normalized.startsWith("/")) return normalized;
  return `/${normalized}`;
};

export async function getAppRoutePaths() {
  const srcRoot = path.join(rootDir, "src");
  const candidates = [
    path.join(srcRoot, "routes.tsx"),
    path.join(srcRoot, "routes.ts"),
    path.join(srcRoot, "AppRoutes.tsx"),
    path.join(srcRoot, "App.tsx"),
  ];

  let routesFile = null;
  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      routesFile = candidate;
      break;
    } catch {
      // continue
    }
  }

  if (!routesFile) {
    throw new Error(
      `[routes] Missing route file (checked: ${candidates.map((p) => path.relative(rootDir, p)).join(", ")})`,
    );
  }

  const content = await fs.readFile(routesFile, "utf8");
  const routePathRegex = /<Route\b[^>]*\bpath\s*=\s*(?:{\s*)?["'`]([^"'`]+)["'`](?:\s*})?[^>]*>/g;
  const routeObjectPathRegex = /\bpath\s*:\s*["'`]([^"'`]+)["'`]/g;

  const routes = new Set();
  let match;
  while ((match = routePathRegex.exec(content))) {
    const raw = match[1]?.trim();
    if (!raw || raw === "*") continue;
    routes.add(normalizeRoutePath(raw));
  }

  while ((match = routeObjectPathRegex.exec(content))) {
    const raw = match[1]?.trim();
    if (!raw || raw === "*") continue;
    routes.add(normalizeRoutePath(raw));
  }

  return [...routes].sort();
}
