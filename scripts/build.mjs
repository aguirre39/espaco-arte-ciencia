#!/usr/bin/env node
/**
 * Gerador Estático Reprodutível — Espaço Arte-Ciência.
 * Compila templates com caminhos relativos e CSS inline + externo, valida esquemas editoriais,
 * e gera sitemap.xml, robots.txt e _redirects sem caracteres percent-encoded (%C3).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { renderHomePage } from "../src/pages/home.mjs";
import { renderAtividadesPage } from "../src/pages/atividades.mjs";
import { renderSeminarioDetalhePage } from "../src/pages/seminario-detalhe.mjs";
import {
  renderNossaHistoriaPage,
  renderQuemSomosPage,
  renderAnaliseJunguianaPage,
  renderSecondaryAreaPage,
  render404Page
} from "../src/pages/institucionais.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT_DIR, "dist");

function readJson(relPath) {
  const fullPath = path.join(ROOT_DIR, relPath);
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

export function validateSeminarSchema(seminar, filename) {
  const requiredStrings = [
    "id",
    "slug",
    "titulo",
    "resumo",
    "descricao",
    "data",
    "fuso",
    "modalidade",
    "moeda",
    "situacao",
    "prazoInscricao",
    "fonte",
    "dataRevisao"
  ];

  for (const field of requiredStrings) {
    if (typeof seminar[field] !== "string" || seminar[field].trim() === "") {
      throw new Error(`[Schema Error] ${filename}: campo obrigatório '${field}' ausente ou inválido.`);
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(seminar.data)) {
    throw new Error(`[Schema Error] ${filename}: 'data' deve estar no formato ISO YYYY-MM-DD.`);
  }

  if (!Array.isArray(seminar.topicos) || seminar.topicos.length === 0) {
    throw new Error(`[Schema Error] ${filename}: 'topicos' deve ser uma lista não vazia.`);
  }

  if (!Array.isArray(seminar.ministrantes) || seminar.ministrantes.length === 0) {
    throw new Error(`[Schema Error] ${filename}: 'ministrantes' deve ser uma lista não vazia.`);
  }

  if (
    seminar.preco !== null &&
    seminar.preco !== "gratuito" &&
    (typeof seminar.preco !== "number" || seminar.preco <= 0)
  ) {
    throw new Error(
      `[Schema Error] ${filename}: 'preco' deve ser null (sob consulta), "gratuito" ou número positivo. Nunca use 0 para preço desconhecido.`
    );
  }

  if (!seminar.imagem || typeof seminar.imagem.src !== "string") {
    throw new Error(`[Schema Error] ${filename}: objeto 'imagem' inválido.`);
  }
}

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>~])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function writePage(relHtmlPath, htmlContent) {
  const outPath = path.join(DIST_DIR, relHtmlPath);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, htmlContent, "utf8");
}

export function buildSite(options = {}) {
  const site = readJson("src/data/site.json");
  const analistas = readJson("src/data/analistas.json");
  const referenceDateIso = options.referenceDateIso || process.env.BUILD_REFERENCE_DATE || site.dataBaseRevisao;

  const seminariosDir = path.join(ROOT_DIR, "src", "content", "seminarios");
  const seminarFiles = fs
    .readdirSync(seminariosDir)
    .filter((f) => f.endsWith(".json"))
    .sort();

  const seminarios = seminarFiles.map((file) => {
    const data = JSON.parse(fs.readFileSync(path.join(seminariosDir, file), "utf8"));
    validateSeminarSchema(data, file);
    return data;
  });

  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });

  // Copiar ativos públicos (imagens, logos, js)
  copyDirRecursive(path.join(ROOT_DIR, "public", "assets"), path.join(DIST_DIR, "assets"));

  // Empacotar e minificar CSS
  const cssFiles = ["tokens.css", "base.css", "components.css", "utilities.css"];
  const rawCss = cssFiles
    .map((f) => fs.readFileSync(path.join(ROOT_DIR, "src", "styles", f), "utf8"))
    .join("\n");
  const minifiedCss = minifyCss(rawCss);
  const cssOutDir = path.join(DIST_DIR, "assets", "css");
  fs.mkdirSync(cssOutDir, { recursive: true });
  fs.writeFileSync(path.join(cssOutDir, "styles.css"), minifiedCss, "utf8");

  // 1. Página Principal (/) - basePrefix = "."
  const homeHtml = renderHomePage({
    site,
    analistas,
    seminarios,
    referenceDateIso,
    basePrefix: ".",
    inlineCss: minifiedCss
  });
  writePage("index.html", homeHtml);

  // 2. Central Atividades do Espaço (/cursos-e-seminarios/) - basePrefix = ".."
  const atividadesHtml = renderAtividadesPage({
    site,
    analistas,
    seminarios,
    referenceDateIso,
    basePrefix: "..",
    inlineCss: minifiedCss
  });
  writePage(path.join("cursos-e-seminarios", "index.html"), atividadesHtml);

  // 3. Páginas institucionais preservadas - basePrefix = ".."
  const historiaHtml = renderNossaHistoriaPage({
    site,
    analistas,
    basePrefix: "..",
    inlineCss: minifiedCss
  });
  writePage(path.join("nossa-historia", "index.html"), historiaHtml);

  const quemSomosHtml = renderQuemSomosPage({
    site,
    analistas,
    basePrefix: "..",
    inlineCss: minifiedCss
  });
  writePage(path.join("quem-somos-nos", "index.html"), quemSomosHtml);

  const analiseHtml = renderAnaliseJunguianaPage({
    site,
    analistas,
    basePrefix: "..",
    inlineCss: minifiedCss
  });
  writePage(path.join("psicoterapia-junguiana-1", "index.html"), analiseHtml);

  // 4. Páginas individuais de seminários (/seminarios/slug-descritivo/) - basePrefix = "../.."
  for (const seminar of seminarios) {
    const detHtml = renderSeminarioDetalhePage({
      site,
      analistas,
      seminar,
      referenceDateIso,
      basePrefix: "../..",
      inlineCss: minifiedCss
    });
    writePage(path.join("seminarios", seminar.slug, "index.html"), detHtml);
  }

  // 5. Áreas secundárias preservadas - basePrefix = ".."
  for (const area of site.navegacaoSecundaria) {
    const cleanDir = area.href.replace(/^\/|\/$/g, "");
    const secHtml = renderSecondaryAreaPage({
      site,
      analistas,
      area,
      basePrefix: "..",
      inlineCss: minifiedCss
    });
    writePage(path.join(cleanDir, "index.html"), secHtml);
  }

  // 6. Página 404 real - basePrefix = "."
  const notFoundHtml = render404Page({
    site,
    analistas,
    basePrefix: ".",
    inlineCss: minifiedCss
  });
  writePage("404.html", notFoundHtml);

  // 7. Sitemap XML limpo (apenas URLs canônicas sem caracteres %C3)
  const canonicalUrls = [
    { loc: `${site.dominio}/`, lastmod: referenceDateIso },
    { loc: `${site.dominio}/cursos-e-seminarios/`, lastmod: referenceDateIso },
    { loc: `${site.dominio}/nossa-historia/`, lastmod: referenceDateIso },
    { loc: `${site.dominio}/quem-somos-nos/`, lastmod: referenceDateIso },
    { loc: `${site.dominio}/psicoterapia-junguiana-1/`, lastmod: referenceDateIso },
    ...seminarios.map((s) => ({
      loc: `${site.dominio}/seminarios/${s.slug}/`,
      lastmod: s.dataRevisao
    }))
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${canonicalUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;
  fs.writeFileSync(path.join(DIST_DIR, "sitemap.xml"), sitemapXml, "utf8");

  // 8. robots.txt coerente
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${site.dominio}/sitemap.xml
`;
  fs.writeFileSync(path.join(DIST_DIR, "robots.txt"), robotsTxt, "utf8");

  // 9. Redirecionamentos 301 individuais (rotas legadas com acento -> rotas limpas canônicas)
  const redirectsContent = `# Redirecionamentos 301 individuais (sem cadeias) para URLs limpas
/cursos-e-seminários    /cursos-e-seminarios/    301
/cursos-e-seminários/   /cursos-e-seminarios/    301
/nossa-história         /nossa-historia/         301
/nossa-história/        /nossa-historia/         301
/quem-somos-nós         /quem-somos-nos/         301
/quem-somos-nós/        /quem-somos-nos/         301
/formação               /formacao/               301
/formação/              /formacao/               301
`;
  fs.writeFileSync(path.join(DIST_DIR, "_redirects"), redirectsContent, "utf8");

  const headersContent = `/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
`;
  fs.writeFileSync(path.join(DIST_DIR, "_headers"), headersContent, "utf8");

  return {
    referenceDateIso,
    seminariosCount: seminarios.length,
    canonicalCount: canonicalUrls.length,
    cssBytes: Buffer.byteLength(minifiedCss, "utf8")
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const result = buildSite();
  console.log(
    `[Build OK] Data base: ${result.referenceDateIso} | Seminários: ${result.seminariosCount} | Rotas canônicas: ${result.canonicalCount} | CSS: ${result.cssBytes} bytes`
  );
}
