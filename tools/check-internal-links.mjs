import fs from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAppRoutePaths } from "./app-routes.mjs";

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const srcRoot = path.join(projectRoot, "src");
const publicRoot = path.join(projectRoot, "public");

const args = new Set(process.argv.slice(2));
const shouldCheckExternal = args.has("--external") || args.has("--all");
const externalOnly = args.has("--external-only");
const strictExternal = args.has("--strict-external");
const printExternal = args.has("--print-external");
const printInternal = args.has("--print-internal");

const normalizeRoutePath = (routePath) => {
  if (!routePath) return "";
  if (routePath === "/") return "/";
  return routePath.replace(/\/+$/, "");
};

const walk = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name === "dist-ssr") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
};

const extractUrlsFromFile = (content) => {
  const urls = [];

  const jsxHref = /\bhref\s*=\s*["']([^"']+)["']/g;
  const jsxHrefBraceLiteral = /\bhref\s*=\s*{\s*["']([^"']+)["']\s*}/g;
  const jsxTo = /\bto\s*=\s*["']([^"']+)["']/g;
  const jsxToBraceLiteral = /\bto\s*=\s*{\s*["']([^"']+)["']\s*}/g;
  const objectHrefOrPath = /\b(?:href|path|to)\s*:\s*["']([^"']+)["']/g;
  const navigateArg = /\bnavigate\s*\(\s*["']([^"']+)["']/g;
  const locationHref = /\b(?:window\.)?location(?:\.href)?\s*=\s*["']([^"']+)["']/g;
  const rawHttp = /\bhttps?:\/\/[^\s"'`<>]+/g;
  const rawProtocolRelative = /\b\/\/[^\s"'`<>]+/g;

  for (const re of [
    jsxHref,
    jsxHrefBraceLiteral,
    jsxTo,
    jsxToBraceLiteral,
    objectHrefOrPath,
    navigateArg,
    locationHref,
    rawHttp,
    rawProtocolRelative,
  ]) {
    let match;
    while ((match = re.exec(content))) {
      const value = (match[1] ?? match[0])?.trim();
      if (value) urls.push(value);
    }
  }

  return urls;
};

const extractIdsFromFile = (content) => {
  const ids = [];
  const idLiteral = /\bid\s*=\s*["']([A-Za-z][\w-]*)["']/g;
  const idBraceLiteral = /\bid\s*=\s*{\s*["']([A-Za-z][\w-]*)["']\s*}/g;

  for (const re of [idLiteral, idBraceLiteral]) {
    let match;
    while ((match = re.exec(content))) ids.push(match[1]);
  }
  return ids;
};

const isExternal = (url) =>
  /^(https?:)?\/\//i.test(url) ||
  /^mailto:/i.test(url) ||
  /^tel:/i.test(url) ||
  /^sms:/i.test(url) ||
  /^data:/i.test(url);

const toAbsoluteExternalUrl = (url) => (/^\/\//.test(url) ? `https:${url}` : url);

const isProbablyTemplateUrl = (url) => url.includes("${");
const isSvgNamespace = (url) =>
  url === "http://www.w3.org/2000/svg" || url === "https://www.w3.org/2000/svg";

const normalizePath = (url) => {
  const [beforeHash] = url.split("#");
  const [pathname] = beforeHash.split("?");
  return normalizeRoutePath(pathname);
};

const getHash = (url) => {
  const idx = url.indexOf("#");
  return idx === -1 ? "" : url.slice(idx);
};

const likelyPublicAssetPath = (pathname) => {
  const last = pathname.split("/").pop() || "";
  return last.includes(".");
};

const publicAssetExists = (pathname) => {
  if (!pathname.startsWith("/")) return false;
  const onDisk = path.join(publicRoot, pathname.slice(1));
  try {
    return fs.statSync(onDisk).isFile();
  } catch {
    return false;
  }
};

const validateMailto = (url) => {
  const value = url.slice("mailto:".length).trim();
  if (!value) return { ok: false, reason: "empty mailto" };
  if (!value.includes("@")) return { ok: false, reason: "mailto missing @" };
  return { ok: true, reason: null };
};

const validateTelLike = (url, scheme) => {
  const value = url.slice(`${scheme}:`.length).trim();
  if (!value) return { ok: false, reason: `empty ${scheme}` };
  if (!/^[+\d][\d\s().-]*$/.test(value)) return { ok: false, reason: `${scheme} has invalid characters` };
  return { ok: true, reason: null };
};

const checkExternalUrl = async (url) => {
  const absolute = toAbsoluteExternalUrl(url);

  if (isProbablyTemplateUrl(absolute)) return { kind: "skipped", status: null, finalUrl: null, reason: "template url" };
  if (isSvgNamespace(absolute)) return { kind: "skipped", status: null, finalUrl: null, reason: "svg namespace" };
  if (/^data:/i.test(absolute)) return { kind: "skipped", status: null, finalUrl: null, reason: "data url" };

  if (/^mailto:/i.test(absolute)) {
    const v = validateMailto(absolute);
    return v.ok ? { kind: "ok", status: 0, finalUrl: null, reason: null } : { kind: "fail", status: 0, finalUrl: null, reason: v.reason };
  }
  if (/^tel:/i.test(absolute)) {
    const v = validateTelLike(absolute, "tel");
    return v.ok ? { kind: "ok", status: 0, finalUrl: null, reason: null } : { kind: "fail", status: 0, finalUrl: null, reason: v.reason };
  }
  if (/^sms:/i.test(absolute)) {
    const v = validateTelLike(absolute, "sms");
    return v.ok ? { kind: "ok", status: 0, finalUrl: null, reason: null } : { kind: "fail", status: 0, finalUrl: null, reason: v.reason };
  }

  let parsed;
  try {
    parsed = new URL(absolute);
  } catch {
    return { kind: "fail", status: null, finalUrl: null, reason: "invalid url" };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { kind: "skipped", status: null, finalUrl: null, reason: `unsupported protocol ${parsed.protocol}` };
  }

  const timeoutSec = Math.ceil(Number(process.env.LINK_CHECK_TIMEOUT_MS || 15000) / 1000);
  const userAgent = process.env.LINK_CHECK_UA || "template-link-audit/1.0";

  const curlArgsFor = (method, includeHeaders) => {
    const curlArgs = [
      "-sS",
      "-o",
      "/dev/null",
      "-L",
      "--max-time",
      String(timeoutSec),
      "-A",
      userAgent,
      "-w",
      "%{http_code} %{url_effective}",
    ];
    if (includeHeaders) curlArgs.push("-I");
    if (method === "GET") curlArgs.push("-r", "0-0");
    curlArgs.push(absolute);
    return curlArgs;
  };

  const runCurl = async (method) => {
    const includeHeaders = method === "HEAD";
    try {
      const { stdout } = await execFileAsync("curl", curlArgsFor(method, includeHeaders), { cwd: projectRoot });
      const trimmed = String(stdout || "").trim();
      const [codeRaw, ...rest] = trimmed.split(/\s+/);
      const code = Number(codeRaw);
      const effective = rest.join(" ").trim() || null;
      return { ok: Number.isFinite(code) && code > 0, status: code || 0, finalUrl: effective };
    } catch {
      return { ok: false, status: 0, finalUrl: null };
    }
  };

  const head = await runCurl("HEAD");
  if (head.ok && head.status >= 200 && head.status < 400) {
    return { kind: "ok", status: head.status, finalUrl: head.finalUrl, reason: null };
  }

  const shouldTryGet = !head.ok || head.status === 405 || head.status === 403 || head.status === 400;
  if (shouldTryGet) {
    const get = await runCurl("GET");
    if (get.ok && get.status >= 200 && get.status < 400) {
      return { kind: "ok", status: get.status, finalUrl: get.finalUrl, reason: null };
    }
    if (get.status === 401 || get.status === 403 || get.status === 429) {
      return { kind: "blocked", status: get.status, finalUrl: get.finalUrl, reason: "blocked by host" };
    }
    if (get.status === 404) return { kind: "fail", status: get.status, finalUrl: get.finalUrl, reason: "not found" };
    if (get.status >= 500) return { kind: "fail", status: get.status, finalUrl: get.finalUrl, reason: "server error" };
    if (!get.ok) return { kind: "fail", status: get.status, finalUrl: get.finalUrl, reason: "network error" };
    return { kind: "blocked", status: get.status, finalUrl: get.finalUrl, reason: `unexpected status ${get.status}` };
  }

  if (head.status === 401 || head.status === 403 || head.status === 429) {
    return { kind: "blocked", status: head.status, finalUrl: head.finalUrl, reason: "blocked by host" };
  }
  if (head.status === 404) return { kind: "fail", status: head.status, finalUrl: head.finalUrl, reason: "not found" };
  if (head.status >= 500) return { kind: "fail", status: head.status, finalUrl: head.finalUrl, reason: "server error" };
  if (!head.ok) return { kind: "fail", status: head.status, finalUrl: head.finalUrl, reason: "network error" };

  return { kind: "blocked", status: head.status, finalUrl: head.finalUrl, reason: `unexpected status ${head.status}` };
};

const runPool = async (items, concurrency, fn) => {
  if (!items.length) return [];
  const results = new Array(items.length);
  let nextIndex = 0;
  const workers = new Array(Math.min(concurrency, items.length)).fill(null).map(async () => {
    while (true) {
      const i = nextIndex++;
      if (i >= items.length) return;
      results[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return results;
};

const main = async () => {
  if (!fs.existsSync(srcRoot)) {
    console.error(`[links] Missing ${path.relative(projectRoot, srcRoot)}`);
    process.exit(2);
  }

  const files = walk(srcRoot).filter((f) => /\.(ts|tsx)$/.test(f));
  const idSet = new Set();
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    for (const id of extractIdsFromFile(content)) idSet.add(id);
  }

  const internalIssues = [];
  const externalFailures = [];
  const externalBlocked = [];
  const externalSkipped = [];
  const externalRefs = new Map();
  const inboundRouteRefs = new Map();
  const orphanRouteExclusions = new Set(["/oops", "/404"]);

  const routes = externalOnly ? new Set() : new Set((await getAppRoutePaths()).map(normalizeRoutePath));

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const urls = extractUrlsFromFile(content);

    for (const url of urls) {
      if (!url) continue;

      if (isExternal(url)) {
        if (shouldCheckExternal || externalOnly) {
          const abs = toAbsoluteExternalUrl(url);
          const set = externalRefs.get(abs) || new Set();
          set.add(file);
          externalRefs.set(abs, set);
        }
        continue;
      }

      if (url.startsWith("#")) {
        if (externalOnly) continue;
        const id = url.slice(1);
        if (id && !idSet.has(id)) internalIssues.push({ file, url, reason: `unknown hash target id="${id}"` });
        continue;
      }

      if (!url.startsWith("/")) continue;
      if (externalOnly) continue;

      const pathname = normalizePath(url);
      const hash = getHash(url);

      if (likelyPublicAssetPath(pathname)) {
        if (!publicAssetExists(pathname)) {
          internalIssues.push({ file, url, reason: `missing public asset "${pathname}"` });
        }
        continue;
      }

      if (pathname && !routes.has(pathname)) {
        internalIssues.push({ file, url, reason: `unknown route "${pathname}"` });
        continue;
      }

      if (pathname && routes.has(pathname)) {
        inboundRouteRefs.set(pathname, (inboundRouteRefs.get(pathname) || 0) + 1);
      }

      if (hash) {
        const id = hash.slice(1);
        if (id && !idSet.has(id)) internalIssues.push({ file, url, reason: `unknown hash target id="${id}"` });
      }
    }
  }

  if (printExternal) {
    const urls = [...externalRefs.keys()]
      .filter((u) => !isProbablyTemplateUrl(u))
      .filter((u) => !isSvgNamespace(u))
      .filter((u) => !/^data:/i.test(u))
      .sort();
    process.stdout.write(`${urls.join("\n")}${urls.length ? "\n" : ""}`);
    return;
  }

  if (printInternal) {
    process.stdout.write(`${[...routes].sort().join("\n")}${routes.size ? "\n" : ""}`);
    return;
  }

  if ((shouldCheckExternal || externalOnly) && externalRefs.size) {
    const urls = [...externalRefs.keys()].sort();
    const concurrency = Number(process.env.LINK_CHECK_CONCURRENCY || 8);
    console.log(`[links] Checking ${urls.length} external link(s)...`);

    const results = await runPool(urls, concurrency, async (url) => ({ url, ...(await checkExternalUrl(url)) }));
    for (const res of results) {
      const filesForUrl = externalRefs.get(res.url);
      const where = filesForUrl ? [...filesForUrl].map((f) => path.relative(projectRoot, f)) : ["unknown"];
      const entry = { files: where, url: res.url, status: res.status, finalUrl: res.finalUrl, reason: res.reason };

      if (res.kind === "ok") continue;
      if (res.kind === "skipped") externalSkipped.push(entry);
      else if (res.kind === "blocked") externalBlocked.push(entry);
      else externalFailures.push(entry);
    }
  }

  const blockedCountsAsFailure = strictExternal && externalBlocked.length > 0;
  const anyFailures = internalIssues.length > 0 || externalFailures.length > 0 || blockedCountsAsFailure;

  if (anyFailures) {
    if (internalIssues.length) {
      console.error(`[links] Found ${internalIssues.length} broken internal link(s):`);
      for (const issue of internalIssues) {
        console.error(`- ${path.relative(projectRoot, issue.file)}: "${issue.url}" (${issue.reason})`);
      }
    }

    if (externalFailures.length) {
      console.error(`[links] Found ${externalFailures.length} broken external link(s):`);
      for (const issue of externalFailures) {
        console.error(
          `- ${issue.files.join(", ")}: "${issue.url}" (${issue.reason}${issue.status ? `, status ${issue.status}` : ""})`,
        );
      }
    }

    if (blockedCountsAsFailure) {
      console.error(`[links] Found ${externalBlocked.length} external link(s) that blocked the audit (strict mode):`);
      for (const issue of externalBlocked) {
        console.error(
          `- ${issue.files.join(", ")}: "${issue.url}" (${issue.reason}${issue.status ? `, status ${issue.status}` : ""})`,
        );
      }
    } else if ((shouldCheckExternal || externalOnly) && externalBlocked.length) {
      console.warn(`[links] ${externalBlocked.length} external link(s) blocked automated checking (not failing):`);
      for (const issue of externalBlocked.slice(0, 10)) {
        console.warn(
          `- ${issue.files.join(", ")}: "${issue.url}" (${issue.reason}${issue.status ? `, status ${issue.status}` : ""})`,
        );
      }
      if (externalBlocked.length > 10) console.warn(`- ...and ${externalBlocked.length - 10} more`);
    }

    if ((shouldCheckExternal || externalOnly) && externalSkipped.length) {
      console.warn(`[links] ${externalSkipped.length} external url(s) skipped (template/data/svg namespace/etc).`);
    }

    process.exit(1);
  }

  if (!externalOnly) {
    const orphanRoutes = [...routes]
      .filter((route) => !orphanRouteExclusions.has(route))
      .filter((route) => (inboundRouteRefs.get(route) || 0) === 0)
      .sort((a, b) => a.localeCompare(b));

    if (orphanRoutes.length) {
      console.warn(
        `[links] Warning: ${orphanRoutes.length} route(s) have no inbound links (excluding /oops and /404):`,
      );
      for (const route of orphanRoutes) {
        console.warn(`- ${route}`);
      }
    }
  }

  if (shouldCheckExternal || externalOnly) {
    const blockedNote = externalBlocked.length ? `; ${externalBlocked.length} blocked` : "";
    const skippedNote = externalSkipped.length ? `; ${externalSkipped.length} skipped` : "";
    console.log(`[links] OK (internal passed; external passed${blockedNote}${skippedNote})`);
  } else {
    console.log("[links] OK (no obvious broken internal links found)");
  }
};

await main();
