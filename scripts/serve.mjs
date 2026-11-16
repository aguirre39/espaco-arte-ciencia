#!/usr/bin/env node
/**
 * Servidor HTTP estático local para desenvolvimento, pré-visualização e auditoria.
 * Serve todas as rotas limpas (/cursos-e-seminarios/, /nossa-historia/, /quem-somos-nos/),
 * redireciona variantes legadas com acento (301 sem cadeias) e entrega página 404 real.
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, "..", "dist");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif"
};

const REDIRECTS_301 = new Map([
  ["/cursos-e-semin%C3%A1rios", "/cursos-e-seminarios/"],
  ["/cursos-e-semin%C3%A1rios/", "/cursos-e-seminarios/"],
  ["/cursos-e-seminários", "/cursos-e-seminarios/"],
  ["/cursos-e-seminários/", "/cursos-e-seminarios/"],
  ["/nossa-hist%C3%B3ria", "/nossa-historia/"],
  ["/nossa-hist%C3%B3ria/", "/nossa-historia/"],
  ["/nossa-história", "/nossa-historia/"],
  ["/nossa-história/", "/nossa-historia/"],
  ["/quem-somos-n%C3%B3s", "/quem-somos-nos/"],
  ["/quem-somos-n%C3%B3s/", "/quem-somos-nos/"],
  ["/quem-somos-nós", "/quem-somos-nos/"],
  ["/quem-somos-nós/", "/quem-somos-nos/"],
  ["/forma%C3%A7%C3%A3o", "/formacao/"],
  ["/forma%C3%A7%C3%A3o/", "/formacao/"],
  ["/formação", "/formacao/"],
  ["/formação/", "/formacao/"]
]);

export function createStaticServer() {
  return http.createServer((req, res) => {
    const rawUrl = (req.url || "/").split("?")[0];

    if (REDIRECTS_301.has(rawUrl)) {
      res.writeHead(301, {
        Location: REDIRECTS_301.get(rawUrl),
        "Cache-Control": "public, max-age=3600"
      });
      res.end();
      return;
    }

    let decodedPath;
    try {
      decodedPath = decodeURIComponent(rawUrl);
    } catch {
      decodedPath = rawUrl;
    }

    if (REDIRECTS_301.has(decodedPath)) {
      res.writeHead(301, {
        Location: REDIRECTS_301.get(decodedPath),
        "Cache-Control": "public, max-age=3600"
      });
      res.end();
      return;
    }

    const safeRel = path.normalize(decodedPath).replace(/^(\.\.(\/|\\|$))+/, "");
    let targetPath = path.join(DIST_DIR, safeRel);

    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
      targetPath = path.join(targetPath, "index.html");
    } else if (!path.extname(targetPath) && fs.existsSync(path.join(targetPath, "index.html"))) {
      targetPath = path.join(targetPath, "index.html");
    }

    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
      const ext = path.extname(targetPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      const cacheHeader = decodedPath.startsWith("/assets/")
        ? "public, max-age=31536000, immutable"
        : "public, max-age=0, must-revalidate";

      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": cacheHeader,
        "X-Content-Type-Options": "nosniff"
      });
      res.end(fs.readFileSync(targetPath));
      return;
    }

    const notFoundPath = path.join(DIST_DIR, "404.html");
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    if (fs.existsSync(notFoundPath)) {
      res.end(fs.readFileSync(notFoundPath));
    } else {
      res.end("404 Not Found");
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const port = Number(process.env.PORT || 4173);
  const server = createStaticServer();
  server.listen(port, "127.0.0.1", () => {
    console.log(`Servidor estático ativo em http://127.0.0.1:${port}`);
  });
}
