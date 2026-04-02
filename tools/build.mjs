import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build as viteBuild } from "vite";
import { getAppRoutePaths } from "./app-routes.mjs";
import {
  PRERENDER_EXCLUDE_PREFIXES,
  PRERENDER_EXCLUDE_ROUTES,
  PRERENDER_EXTRA_ROUTES,
} from "./site-build-config.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function formatDateISO(date) {
  return date.toISOString().slice(0, 10);
}

function normalizeOrigin(origin) {
  return origin.replace(/\/+$/, "");
}

async function getSiteOriginFromSiteConfig() {
  const { siteUrl } = await getSiteDefaultsFromSiteConfig();
  return normalizeOrigin(siteUrl);
}

function extractStringField(source, fieldName) {
  const match = source.match(new RegExp(`\\b${fieldName}\\s*:\\s*(['"])(.*?)\\1`));
  return match?.[2] ?? null;
}

function ensureLeadingSlash(assetPath) {
  if (!assetPath) return null;
  return assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
}

function htmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function getSiteDefaultsFromSiteConfig() {
  const siteConfigPath = path.join(rootDir, "src/config/site.ts");
  const source = await fs.readFile(siteConfigPath, "utf-8");

  const siteUrl = extractStringField(source, "siteUrl");
  if (!siteUrl) {
    throw new Error(`[build] Could not read siteUrl from ${siteConfigPath}`);
  }

  let url;
  try {
    url = new URL(siteUrl);
  } catch {
    throw new Error(`[build] Invalid siteUrl in ${siteConfigPath}: "${siteUrl}"`);
  }

  return {
    siteUrl: normalizeOrigin(url.toString()),
    siteName: extractStringField(source, "siteName") ?? "Website",
    defaultTitle: extractStringField(source, "defaultTitle") ?? extractStringField(source, "siteName") ?? "Website",
    defaultDescription: extractStringField(source, "defaultDescription") ?? "",
    faviconPngUrl: ensureLeadingSlash(extractStringField(source, "faviconPngUrl") ?? "/favicon.png"),
    faviconIcoUrl: ensureLeadingSlash(extractStringField(source, "faviconIcoUrl") ?? "/favicon.ico"),
    ogImageUrl: ensureLeadingSlash(extractStringField(source, "ogImageUrl") ?? "/og-image.jpg"),
  };
}

function buildDefaultHeadMetaBlock(siteDefaults) {
  const rootUrl = `${siteDefaults.siteUrl}/`;
  const ogImageAbs = `${siteDefaults.siteUrl}${siteDefaults.ogImageUrl}`;

  return [
    "<!-- codex-default-meta:start -->",
    `<title>${htmlEscape(siteDefaults.defaultTitle)}</title>`,
    `<meta name="title" content="${htmlEscape(siteDefaults.defaultTitle)}" />`,
    `<meta name="description" content="${htmlEscape(siteDefaults.defaultDescription)}" />`,
    `<meta name="author" content="${htmlEscape(siteDefaults.siteName)}" />`,
    '<meta name="robots" content="index,follow" />',
    '<meta property="og:type" content="website" />',
    `<meta property="og:url" content="${htmlEscape(rootUrl)}" />`,
    `<meta property="og:title" content="${htmlEscape(siteDefaults.defaultTitle)}" />`,
    `<meta property="og:description" content="${htmlEscape(siteDefaults.defaultDescription)}" />`,
    `<meta property="og:image" content="${htmlEscape(ogImageAbs)}" />`,
    `<meta property="og:site_name" content="${htmlEscape(siteDefaults.siteName)}" />`,
    '<meta property="og:locale" content="en_US" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${htmlEscape(siteDefaults.defaultTitle)}" />`,
    `<meta name="twitter:description" content="${htmlEscape(siteDefaults.defaultDescription)}" />`,
    `<meta name="twitter:image" content="${htmlEscape(ogImageAbs)}" />`,
    `<link rel="canonical" href="${htmlEscape(rootUrl)}" />`,
    `<link rel="icon" type="image/png" href="${htmlEscape(siteDefaults.faviconPngUrl)}" />`,
    `<link rel="icon" href="${htmlEscape(siteDefaults.faviconIcoUrl)}" />`,
    `<link rel="apple-touch-icon" href="${htmlEscape(siteDefaults.faviconPngUrl)}" />`,
    "<!-- codex-default-meta:end -->",
  ].join("\n    ");
}

async function writeIndexDefaultMeta(siteDefaults) {
  const indexPath = path.join(rootDir, "dist/index.html");
  let html = await fs.readFile(indexPath, "utf-8");
  const block = buildDefaultHeadMetaBlock(siteDefaults);

  if (html.includes("<!--codex-default-meta-->")) {
    html = html.replace("<!--codex-default-meta-->", block);
  } else if (html.match(/<!-- codex-default-meta:start -->[\s\S]*?<!-- codex-default-meta:end -->/)) {
    html = html.replace(/<!-- codex-default-meta:start -->[\s\S]*?<!-- codex-default-meta:end -->/, block);
  } else if (html.includes("<!--app-head-->")) {
    html = html.replace("<!--app-head-->", `${block}\n    <!--app-head-->`);
  } else {
    html = html.replace("</head>", `    ${block}\n  </head>`);
  }

  await fs.writeFile(indexPath, html, "utf-8");
}

function isAbsoluteRoute(route) {
  return route === "/" || route.startsWith("/");
}

function normalizeRoute(route) {
  if (route === "/") return "/";
  return route.replace(/\/+$/, "");
}

function validateRouteList(name, value) {
  if (!Array.isArray(value)) {
    throw new Error(`[build] ${name} must be an array`);
  }

  for (const item of value) {
    if (typeof item !== "string") {
      throw new Error(`[build] ${name} must contain only strings`);
    }
    if (!item) {
      throw new Error(`[build] ${name} contains an empty route`);
    }
    if (!isAbsoluteRoute(item)) {
      throw new Error(`[build] ${name} route must be absolute (/...): "${item}"`);
    }
    if (item !== "/" && item.endsWith("/")) {
      throw new Error(`[build] ${name} route must not end with "/": "${item}"`);
    }
  }
}

function validatePrefixList(name, value) {
  if (!Array.isArray(value)) {
    throw new Error(`[build] ${name} must be an array`);
  }
  for (const item of value) {
    if (typeof item !== "string") {
      throw new Error(`[build] ${name} must contain only strings`);
    }
    if (!item || !item.startsWith("/")) {
      throw new Error(`[build] ${name} prefix must be absolute (/...): "${item}"`);
    }
    if (item !== "/" && item.endsWith("/")) {
      throw new Error(`[build] ${name} prefix must not end with "/": "${item}"`);
    }
  }
}

async function getPrerenderRoutes() {
  validateRouteList("PRERENDER_EXCLUDE_ROUTES", PRERENDER_EXCLUDE_ROUTES);
  validatePrefixList("PRERENDER_EXCLUDE_PREFIXES", PRERENDER_EXCLUDE_PREFIXES);
  validateRouteList("PRERENDER_EXTRA_ROUTES", PRERENDER_EXTRA_ROUTES);

  const excludeRoutes = new Set(PRERENDER_EXCLUDE_ROUTES.map(normalizeRoute));
  const excludePrefixes = PRERENDER_EXCLUDE_PREFIXES.map(normalizeRoute);
  const extraRoutes = PRERENDER_EXTRA_ROUTES.map(normalizeRoute);

  const appRoutes = (await getAppRoutePaths()).map(normalizeRoute);

  const computed = appRoutes.filter((route) => {
    if (!isAbsoluteRoute(route)) return false;
    if (route.includes(":")) return false;
    if (excludeRoutes.has(route)) return false;
    if (excludePrefixes.some((prefix) => route === prefix || route.startsWith(`${prefix}/`))) return false;
    return true;
  });

  const merged = [...new Set([...computed, ...extraRoutes])].sort((a, b) => a.localeCompare(b));

  for (const route of extraRoutes) {
    if (!isAbsoluteRoute(route)) {
      throw new Error(`[build] PRERENDER_EXTRA_ROUTES contains non-absolute route: "${route}"`);
    }
  }

  console.log(`[build] prerender routes (${merged.length}): ${merged.join(", ")}`);

  return merged;
}

async function writeSitemap(prerenderRoutes, siteOrigin) {
  const lastmod = formatDateISO(new Date());
  const sitemapRoutes = prerenderRoutes.filter((route) => route !== "/oops");

  const urlEntries = sitemapRoutes.map((route) => {
    const loc = `${siteOrigin}${route === "/" ? "/" : route}`;
    return [
      "  <url>",
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      "    <changefreq>weekly</changefreq>",
      route === "/" ? "    <priority>1.0</priority>" : "    <priority>0.7</priority>",
      "  </url>",
    ].join("\n");
  }).join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlEntries,
    "</urlset>",
    "",
  ].join("\n");

  await fs.writeFile(path.join(rootDir, "dist/sitemap.xml"), xml, "utf-8");
}

async function writeRobotsTxt(siteOrigin) {
  const robotsPath = path.join(rootDir, "dist/robots.txt");
  let existing;
  try {
    existing = await fs.readFile(robotsPath, "utf-8");
  } catch {
    return;
  }

  const lines = existing
    .split(/\r?\n/)
    .filter((line) => !/^Sitemap:\s*/i.test(line));
  while (lines.length && lines[lines.length - 1] === "") lines.pop();
  lines.push(`Sitemap: ${siteOrigin}/sitemap.xml`, "");
  await fs.writeFile(robotsPath, lines.join("\n"), "utf-8");
}

function injectHead(template, headHtml) {
  if (!headHtml) return template;
  return template.replace("</head>", `${headHtml}\n</head>`);
}

function injectApp(template, appHtml) {
  return template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

function normalizeHeadTags(html) {
  const headMatch = html.match(/<head>[\s\S]*?<\/head>/i);
  if (!headMatch) return html;

  let head = headMatch[0];
  let seenTitle = false;
  let seenDescription = false;
  let seenCanonical = false;

  head = head.replace(/<title\b[^>]*>[\s\S]*?<\/title>\s*/gi, (tag) => {
    if (seenTitle) return "";
    seenTitle = true;
    return tag;
  });

  head = head.replace(/<meta\b[^>]*name=["']description["'][^>]*>\s*/gi, (tag) => {
    if (seenDescription) return "";
    seenDescription = true;
    return tag;
  });

  head = head.replace(/<link\b[^>]*rel=["']canonical["'][^>]*>\s*/gi, (tag) => {
    if (seenCanonical) return "";
    seenCanonical = true;
    return tag;
  });

  return html.replace(/<head>[\s\S]*?<\/head>/i, head);
}

async function buildSsr({ mode }) {
  const outDir = path.join(rootDir, "dist-ssr");
  await fs.rm(outDir, { recursive: true, force: true });

  await viteBuild({
    root: rootDir,
    mode,
    build: {
      ssr: "src/entry-server.tsx",
      outDir: "dist-ssr",
      rollupOptions: {
        input: "src/entry-server.tsx",
      },
    },
    logLevel: "error",
  });

  const files = await fs.readdir(outDir);
  const entry = files.find((f) => f.includes("entry-server") && f.endsWith(".js"));
  if (!entry) {
    throw new Error("SSR build did not output an entry-server JS file");
  }

  return path.join(outDir, entry);
}

async function main() {
  const modeArgIndex = process.argv.indexOf("--mode");
  const mode = modeArgIndex >= 0 ? process.argv[modeArgIndex + 1] : undefined;
  const prerenderRoutes = await getPrerenderRoutes();
  const siteDefaults = await getSiteDefaultsFromSiteConfig();
  const siteOrigin = siteDefaults.siteUrl;

  await viteBuild({ root: rootDir, mode });
  await writeSitemap(prerenderRoutes, siteOrigin);
  await writeRobotsTxt(siteOrigin);
  const ssrEntry = await buildSsr({ mode });

  const mod = await import(pathToFileURL(ssrEntry).href);
  if (typeof mod.render !== "function") {
    throw new Error("SSR entry must export a render(url) function");
  }

  const distDir = path.join(rootDir, "dist");
  const template = await fs.readFile(path.join(distDir, "index.html"), "utf-8");

  for (const route of prerenderRoutes) {
    const { appHtml, headHtml } = await mod.render(route);
    const html = normalizeHeadTags(injectApp(injectHead(template, headHtml), appHtml));

    if (route === "/") {
      await fs.writeFile(path.join(distDir, "index.html"), html, "utf-8");
      continue;
    }

    const outDir = path.join(distDir, route.replace(/^\//, ""));
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, "index.html"), html, "utf-8");
  }

  const notFound = await mod.render("/__not-found__");
  await fs.writeFile(
    path.join(distDir, "404.html"),
    normalizeHeadTags(injectApp(injectHead(template, notFound.headHtml), notFound.appHtml)),
    "utf-8"
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
