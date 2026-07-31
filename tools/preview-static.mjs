import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const cwd = process.cwd();
const distDir = path.resolve(cwd, "dist");
const preferredPort = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";

const MIME_TYPES = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".gif", "image/gif"],
  [".webp", "image/webp"],
  [".ico", "image/x-icon"],
  [".txt", "text/plain; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

function safeJoin(rootDir, requestPath) {
  const normalized = path.posix.normalize(requestPath);
  const candidate = path.resolve(rootDir, `.${normalized}`);
  if (!candidate.startsWith(rootDir)) {
    return null;
  }
  return candidate;
}

async function getStat(filePath) {
  try {
    return await stat(filePath);
  } catch {
    return null;
  }
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  res.statusCode = 200;
  res.setHeader("Content-Type", MIME_TYPES.get(ext) || "application/octet-stream");
  createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(requestUrl.pathname);
  const basePath = safeJoin(distDir, pathname);

  if (!basePath) {
    res.statusCode = 400;
    res.end("Bad request");
    return;
  }

  const exactStat = await getStat(basePath);
  if (exactStat?.isFile()) {
    sendFile(res, basePath);
    return;
  }

  if (exactStat?.isDirectory()) {
    const indexFile = path.join(basePath, "index.html");
    const indexStat = await getStat(indexFile);
    if (indexStat?.isFile()) {
      sendFile(res, indexFile);
      return;
    }
  }

  if (!pathname.endsWith("/")) {
    const dirPath = safeJoin(distDir, `${pathname}/`);
    if (dirPath) {
      const dirStat = await getStat(dirPath);
      const dirIndexStat = await getStat(path.join(dirPath, "index.html"));
      if (dirStat?.isDirectory() && dirIndexStat?.isFile()) {
        sendFile(res, path.join(dirPath, "index.html"));
        return;
      }
    }
  }

  const notFoundFile = path.join(distDir, "404.html");
  const notFoundStat = await getStat(notFoundFile);
  if (notFoundStat?.isFile()) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    createReadStream(notFoundFile).pipe(res);
    return;
  }

  res.statusCode = 404;
  res.end("Not found");
});

function listenWithFallback(startPort) {
  let currentPort = Number.isFinite(startPort) ? startPort : 4173;

  server.on("error", (error) => {
    if (error && (error.code === "EADDRINUSE" || error.code === "EACCES")) {
      currentPort += 1;
      server.listen(currentPort, host);
      return;
    }

    throw error;
  });

  server.on("listening", () => {
    const address = server.address();
    const resolvedPort = typeof address === "object" && address ? address.port : currentPort;
    console.log(`[preview:nojs] Serving ${distDir}`);
    console.log(`[preview:nojs] http://${host}:${resolvedPort}`);
  });

  server.listen(currentPort, host);
}

listenWithFallback(preferredPort);
