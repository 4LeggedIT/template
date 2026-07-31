import { existsSync, readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";

const cwd = process.cwd();
const distDir = path.resolve(cwd, "dist");
const previewScript = path.resolve(cwd, "tools/preview-static.mjs");

if (!existsSync(distDir)) {
  console.error("[qa:smoke:nojs] dist/ not found. Run `npm run build` first.");
  process.exit(1);
}

if (!existsSync(previewScript)) {
  console.error("[qa:smoke:nojs] tools/preview-static.mjs not found.");
  process.exit(1);
}

const sitemapPath = path.resolve(distDir, "sitemap.xml");

function extractRoutesFromSitemap(xml) {
  const locMatches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (!locMatches.length) return ["/"];

  const routes = new Set();
  for (const loc of locMatches) {
    try {
      const url = new URL(loc);
      const pathname = url.pathname || "/";
      routes.add(pathname === "" ? "/" : pathname.replace(/\/+$/, "") || "/");
    } catch {
      routes.add("/");
    }
  }

  return [...routes].sort((left, right) => left.localeCompare(right));
}

function buildTestRoutes() {
  if (!existsSync(sitemapPath)) return ["/"];
  const xml = readFileSync(sitemapPath, "utf8");
  return extractRoutesFromSitemap(xml);
}

async function waitForPreviewUrl(child, timeoutMs = 20_000) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const start = Date.now();

    const onData = (chunk) => {
      const text = String(chunk);
      const match = text.match(/http:\/\/[^\s]+/);
      if (!match) return;
      settled = true;
      cleanup();
      resolve(match[0]);
    };

    const onExit = (code) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error(`preview server exited before ready (code ${code ?? "unknown"})`));
    };

    const timer = setInterval(() => {
      if (Date.now() - start < timeoutMs || settled) return;
      settled = true;
      cleanup();
      reject(new Error(`timed out after ${timeoutMs}ms waiting for preview server URL`));
    }, 100);

    const cleanup = () => {
      clearInterval(timer);
      child.stdout.off("data", onData);
      child.off("exit", onExit);
    };

    child.stdout.on("data", onData);
    child.on("exit", onExit);
  });
}

async function checkRoute(url, route) {
  const routeUrl = `${url}${route}`;
  const routeWithSlash = route === "/" ? routeUrl : `${url}${route}/`;

  const first = await fetch(routeUrl, { redirect: "manual" });
  const second = await fetch(routeWithSlash, { redirect: "manual" });

  return {
    route,
    noSlashStatus: first.status,
    slashStatus: second.status,
    pass: first.status === 200 && second.status === 200,
  };
}

function analyzeRootHtml(html) {
  return {
    hasJavascriptHref: /href="javascript:/i.test(html),
    hasHashHref: /href="#"/i.test(html),
    rootAnchors: (html.match(/href="\/[^"]*"/g) || []).length,
  };
}

async function main() {
  const routes = buildTestRoutes();
  const failures = [];

  const child = spawn(process.execPath, [previewScript], {
    cwd,
    env: {
      ...process.env,
      PORT: "0",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(chunk);
  });

  let baseUrl = "";
  try {
    baseUrl = await waitForPreviewUrl(child);
  } catch (error) {
    console.error(`[qa:smoke:nojs] ${error instanceof Error ? error.message : String(error)}`);
    child.kill("SIGTERM");
    process.exit(1);
  }

  console.log(`[qa:smoke:nojs] Preview: ${baseUrl}`);
  console.log(`[qa:smoke:nojs] Routes from sitemap: ${routes.length}`);

  for (const route of routes) {
    const result = await checkRoute(baseUrl, route);
    if (!result.pass) {
      failures.push(result);
      console.error(
        `[qa:smoke:nojs] FAIL ${route} (no-slash=${result.noSlashStatus}, slash=${result.slashStatus})`,
      );
    }
  }

  const rootResponse = await fetch(`${baseUrl}/`, { redirect: "manual" });
  const rootHtml = await rootResponse.text();
  const rootAnalysis = analyzeRootHtml(rootHtml);

  console.log(`[qa:smoke:nojs] Root anchors (/...): ${rootAnalysis.rootAnchors}`);
  console.log(`[qa:smoke:nojs] href="javascript:" present: ${rootAnalysis.hasJavascriptHref ? "yes" : "no"}`);
  console.log(`[qa:smoke:nojs] href="#" present: ${rootAnalysis.hasHashHref ? "yes" : "no"}`);

  child.kill("SIGTERM");

  if (rootAnalysis.hasJavascriptHref) {
    console.error(`[qa:smoke:nojs] FAIL root HTML contains href="javascript:"`);
    process.exit(1);
  }

  if (failures.length > 0) {
    console.error(`[qa:smoke:nojs] FAIL route checks: ${failures.length}`);
    process.exit(1);
  }

  console.log("[qa:smoke:nojs] PASS");
}

await main();
