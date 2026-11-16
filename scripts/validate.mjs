#!/usr/bin/env node
/**
 * Suite de Validação Técnica, Acessibilidade (WCAG 2.2 AA), SEO, JSON-LD, Resolução de Ativos Relativos,
 * Ausência de Caracteres Estranhos (%C3), Testes de Agenda e Sonda HTTP — Espaço Arte-Ciência.
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { buildSite } from "./build.mjs";
import { createStaticServer } from "./serve.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT_DIR, "dist");

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16)
  ];
}

function relativeLuminance([r, g, b]) {
  const srgb = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

function walkHtmlFiles(dir, fileList = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtmlFiles(fullPath, fileList);
    } else if (entry.name.endsWith(".html")) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function gzipSize(buffer) {
  return zlib.gzipSync(buffer, { level: 9 }).length;
}

async function probeRoute(server, routePath) {
  return new Promise((resolve) => {
    const req = { url: routePath, method: "GET", headers: {} };
    const headers = {};
    let status = 200;
    let bodyBuf = Buffer.alloc(0);

    const res = {
      writeHead(code, hdrs = {}) {
        status = code;
        for (const [k, v] of Object.entries(hdrs)) {
          headers[k.toLowerCase()] = v;
        }
      },
      end(chunk) {
        if (chunk) {
          bodyBuf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));
        }
        resolve({ status, headers, bodyLength: bodyBuf.length });
      }
    };

    server.emit("request", req, res);
  });
}

async function runHttpProbes(errors) {
  const server = createStaticServer();
  const results = [];

  const checks = [
    { path: "/", expectedStatus: 200 },
    { path: "/cursos-e-seminarios/", expectedStatus: 200 },
    { path: "/nossa-historia/", expectedStatus: 200 },
    { path: "/quem-somos-nos/", expectedStatus: 200 },
    { path: "/psicoterapia-junguiana-1/", expectedStatus: 200 },
    { path: "/seminarios/o-tempo-na-perspectiva-de-jung-e-von-franz/", expectedStatus: 200 },
    { path: "/seminarios/iii-mitos-de-criacao-de-marie-louise-von-franz/", expectedStatus: 200 },
    { path: "/sitemap.xml", expectedStatus: 200 },
    { path: "/robots.txt", expectedStatus: 200 },
    { path: "/cursos-e-semin%C3%A1rios", expectedStatus: 301, expectedLocation: "/cursos-e-seminarios/" },
    { path: "/nossa-hist%C3%B3ria", expectedStatus: 301, expectedLocation: "/nossa-historia/" },
    { path: "/quem-somos-n%C3%B3s", expectedStatus: 301, expectedLocation: "/quem-somos-nos/" },
    { path: "/rota-inexistente-teste-404", expectedStatus: 404 }
  ];

  for (const c of checks) {
    const res = await probeRoute(server, c.path);
    const location = res.headers["location"] || null;
    const statusOk = res.status === c.expectedStatus;
    const locOk = !c.expectedLocation || location === c.expectedLocation;
    const passed = statusOk && locOk;

    results.push({
      path: c.path,
      status: res.status,
      expectedStatus: c.expectedStatus,
      location,
      contentType: res.headers["content-type"] || null,
      bodyBytes: res.bodyLength,
      passed
    });

    if (!passed) {
      errors.push(
        `HTTP probe falhou em ${c.path}: status=${res.status} (esperado ${c.expectedStatus}), location=${location}`
      );
    }
  }

  return results;
}

async function runValidation() {
  const errors = [];
  const report = {
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: `${process.platform} ${process.arch}`,
    contrastChecks: [],
    pagesChecked: [],
    agendaSimulationTests: [],
    httpProbes: [],
    budgets: {}
  };

  // 1. Teste de simulação de data futura (2026-11-25) -> deve ocultar evento de 21/11/2026 da home
  buildSite({ referenceDateIso: "2026-11-25" });
  const homeFutureHtml = fs.readFileSync(path.join(DIST_DIR, "index.html"), "utf8");
  const hasEmptyStateWhenPast = homeFutureHtml.includes("Consulte a próxima programação");
  const stillShowsPastSeminarOnHome = homeFutureHtml.includes('data-seminar-id="sem-2026-11-21-tempo-jung-von-franz"');
  if (!hasEmptyStateWhenPast || stillShowsPastSeminarOnHome) {
    errors.push("Falha no teste de expiração automática da agenda na Home para data 2026-11-25.");
  }
  report.agendaSimulationTests.push({
    referenceDate: "2026-11-25",
    homeShowsEmptySchedulePrompt: hasEmptyStateWhenPast,
    pastSeminarExcludedFromHome: !stillShowsPastSeminarOnHome,
    passed: hasEmptyStateWhenPast && !stillShowsPastSeminarOnHome
  });

  // 2. Restaurar build na data base oficial (2026-11-16)
  buildSite({ referenceDateIso: "2026-11-16" });
  const homeBaseHtml = fs.readFileSync(path.join(DIST_DIR, "index.html"), "utf8");
  const showsUpcomingOnBaseDate = homeBaseHtml.includes("O Tempo na Perspectiva de Jung e Von Franz");
  const excludesNov07FromHome = !homeBaseHtml.includes("III Mitos de Criação de Marie-Louise von Franz");
  if (!showsUpcomingOnBaseDate || !excludesNov07FromHome) {
    errors.push("Falha na filtragem de eventos futuros vs. passados na Home na data base 2026-11-16.");
  }
  report.agendaSimulationTests.push({
    referenceDate: "2026-11-16",
    upcomingNov21ShownOnHome: showsUpcomingOnBaseDate,
    pastNov07ExcludedFromHome: excludesNov07FromHome,
    passed: showsUpcomingOnBaseDate && excludesNov07FromHome
  });

  // 3. Validar sitemap.xml sem %C3
  const sitemapContent = fs.readFileSync(path.join(DIST_DIR, "sitemap.xml"), "utf8");
  if (/%C3/i.test(sitemapContent)) {
    errors.push("sitemap.xml contém caracteres percent-encoded (%C3).");
  }

  // 4. Validar contrastes WCAG 2.2 AA
  const pairs = [
    { name: "Texto principal (#1C1917) sobre fundo marfim (#FAF6F0)", fg: "#1C1917", bg: "#FAF6F0", min: 4.5 },
    { name: "Texto secundário (#443E38) sobre fundo marfim (#FAF6F0)", fg: "#443E38", bg: "#FAF6F0", min: 4.5 },
    { name: "Texto apoio (#5C534A) sobre fundo marfim (#FAF6F0)", fg: "#5C534A", bg: "#FAF6F0", min: 4.5 },
    { name: "Destaque/Link laranja escuro (#9E3E0E) sobre marfim (#FAF6F0)", fg: "#9E3E0E", bg: "#FAF6F0", min: 4.5 },
    { name: "Destaque/Link laranja escuro (#9E3E0E) sobre branco (#FFFFFF)", fg: "#9E3E0E", bg: "#FFFFFF", min: 4.5 },
    { name: "Botão primário branco (#FFFFFF) sobre laranja escuro (#9E3E0E)", fg: "#FFFFFF", bg: "#9E3E0E", min: 4.5 },
    { name: "Botão WhatsApp branco (#FFFFFF) sobre verde escuro (#1B5E20)", fg: "#FFFFFF", bg: "#1B5E20", min: 4.5 },
    { name: "Rodapé texto claro (#FAF6F0) sobre carvão (#1C1917)", fg: "#FAF6F0", bg: "#1C1917", min: 4.5 }
  ];

  for (const p of pairs) {
    const ratio = contrastRatio(p.fg, p.bg);
    const passed = ratio >= p.min;
    report.contrastChecks.push({ ...p, ratio, passed });
    if (!passed) {
      errors.push(`Contraste insuficiente em '${p.name}': ${ratio}:1 (mínimo ${p.min}:1)`);
    }
  }

  // 5. Auditar todas as páginas HTML geradas
  const htmlFiles = walkHtmlFiles(DIST_DIR);

  for (const file of htmlFiles) {
    const rel = path.relative(DIST_DIR, file).replace(/\\/g, "/");
    const pageDir = path.dirname(file);
    const html = fs.readFileSync(file, "utf8");

    if (!html.startsWith("<!DOCTYPE html>")) {
      errors.push(`${rel}: Doctype HTML5 ausente.`);
    }
    if (!html.includes('<html lang="pt-BR">')) {
      errors.push(`${rel}: atributo lang="pt-BR" ausente.`);
    }
    if (!html.includes('<meta charset="UTF-8" />')) {
      errors.push(`${rel}: meta charset UTF-8 ausente.`);
    }

    // Garantir que não existem rotas ou links internos com %C3 (ex.: quem-somos-n%C3%B3s, nossa-hist%C3%B3ria, cursos-e-semin%C3%A1rios)
    if (/(quem-somos-n%C3%B3s|nossa-hist%C3%B3ria|cursos-e-semin%C3%A1rios|\/forma%C3%A7%C3%A3o)/i.test(html)) {
      errors.push(`${rel}: encontrados caminhos de URL com caracteres percent-encoded (ex.: quem-somos-n%C3%B3s) na página.`);
    }

    // Garantir que o CSS inline e o CSS externo relativo estão presentes e resolvem em disco
    if (!html.includes('<style id="eac-inline-styles">')) {
      errors.push(`${rel}: bloco <style id="eac-inline-styles"> ausente.`);
    }
    const cssLinkMatch = html.match(/<link rel="stylesheet" href="([^"]+)" \/>/);
    if (!cssLinkMatch) {
      errors.push(`${rel}: tag <link rel="stylesheet"> ausente.`);
    } else {
      const resolvedCssPath = path.resolve(pageDir, cssLinkMatch[1]);
      if (!fs.existsSync(resolvedCssPath)) {
        errors.push(`${rel}: arquivo CSS relativo não encontrado em disco (${cssLinkMatch[1]} -> ${resolvedCssPath}).`);
      }
    }

    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    const descMatch = html.match(/<meta name="description" content="([^"]+)" \/>/);
    const canonMatch = html.match(/<link rel="canonical" href="([^"]+)" \/>/);
    const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];

    if (!titleMatch || !titleMatch[1].trim()) {
      errors.push(`${rel}: <title> ausente ou vazio.`);
    }
    if (!descMatch || !descMatch[1].trim()) {
      errors.push(`${rel}: meta description ausente ou vazia.`);
    }
    if (!canonMatch || !canonMatch[1].startsWith("https://www.espacoarteciencia.com.br/")) {
      errors.push(`${rel}: canonical absoluto inválido.`);
    }
    if (h1Matches.length !== 1) {
      errors.push(`${rel}: esperado exatamente 1 <h1>, encontrados ${h1Matches.length}.`);
    }

    const headings = [...html.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
    for (let i = 1; i < headings.length; i++) {
      if (headings[i] - headings[i - 1] > 1) {
        errors.push(`${rel}: salto na hierarquia de cabeçalhos de H${headings[i - 1]} para H${headings[i]}.`);
      }
    }

    // Verificar todas as tags <img> (alt, width, height e existência do arquivo relativo em disco)
    const imgTags = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
    for (const imgTag of imgTags) {
      if (!/\balt="[^"]*"/.test(imgTag)) {
        errors.push(`${rel}: <img> sem atributo alt: ${imgTag}`);
      }
      if (!/\bwidth="\d+"/.test(imgTag) || !/\bheight="\d+"/.test(imgTag)) {
        errors.push(`${rel}: <img> sem dimensões explícitas width/height: ${imgTag}`);
      }
      const srcMatch = imgTag.match(/\bsrc="([^"]+)"/);
      if (srcMatch && !srcMatch[1].startsWith("http")) {
        const resolvedImg = path.resolve(pageDir, srcMatch[1]);
        if (!fs.existsSync(resolvedImg)) {
          errors.push(`${rel}: imagem relativa não encontrada em disco (${srcMatch[1]}).`);
        }
      }
    }

    // Verificar se todos os links internos <a href="..."> resolvem em disco
    const aHrefMatches = [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map((m) => m[1]);
    for (const href of aHrefMatches) {
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#")
      ) {
        continue;
      }
      const cleanHref = href.split("#")[0].split("?")[0];
      const resolvedTarget = path.resolve(pageDir, cleanHref);
      if (!fs.existsSync(resolvedTarget)) {
        errors.push(`${rel}: link interno quebrado (${href} -> ${resolvedTarget}).`);
      }
    }

    if (!html.includes('class="skip-link"')) {
      errors.push(`${rel}: skip-link ausente.`);
    }
    if (!html.includes('aria-label="Conversar com o Espaço Arte-Ciência pelo WhatsApp"')) {
      errors.push(`${rel}: botão flutuante de WhatsApp sem o nome acessível exigido.`);
    }

    const jsonLdMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    if (jsonLdMatches.length !== 1) {
      errors.push(`${rel}: deve conter exatamente 1 bloco JSON-LD centralizado.`);
    } else {
      try {
        const parsed = JSON.parse(jsonLdMatches[0][1]);
        if (parsed["@context"] !== "https://schema.org" || !Array.isArray(parsed["@graph"])) {
          errors.push(`${rel}: estrutura JSON-LD @graph inválida.`);
        }
      } catch (e) {
        errors.push(`${rel}: JSON-LD malformado (${e.message}).`);
      }
    }

    report.pagesChecked.push({
      file: rel,
      title: titleMatch ? titleMatch[1] : null,
      canonical: canonMatch ? canonMatch[1] : null,
      h1Count: h1Matches.length,
      imgCount: imgTags.length
    });
  }

  // 6. Sondas HTTP (200, 301 e 404)
  report.httpProbes = await runHttpProbes(errors);

  // 7. Verificar orçamento de desempenho
  const cssBuf = fs.readFileSync(path.join(DIST_DIR, "assets", "css", "styles.css"));
  const jsBuf = fs.readFileSync(path.join(DIST_DIR, "assets", "js", "main.js"));
  const htmlHomeBuf = fs.readFileSync(path.join(DIST_DIR, "index.html"));
  const lcpAvifBuf = fs.readFileSync(
    path.join(DIST_DIR, "assets", "images", "institucional", "relevo-simbolico-institucional.avif")
  );
  const lcpJpgBuf = fs.readFileSync(
    path.join(DIST_DIR, "assets", "images", "institucional", "relevo-simbolico-institucional.jpg")
  );

  const cssGzip = gzipSize(cssBuf);
  const jsGzip = gzipSize(jsBuf);
  const htmlGzip = gzipSize(htmlHomeBuf);
  const firstFoldTotalAvif = htmlGzip + jsGzip + lcpAvifBuf.length;
  const firstFoldTotalJpg = htmlGzip + jsGzip + lcpJpgBuf.length;

  report.budgets = {
    cssRawBytes: cssBuf.length,
    cssGzipBytes: cssGzip,
    cssBudgetMaxBytes: 35 * 1024,
    jsRawBytes: jsBuf.length,
    jsGzipBytes: jsGzip,
    jsBudgetMaxBytes: 40 * 1024,
    homeHtmlRawBytes: htmlHomeBuf.length,
    homeHtmlGzipBytes: htmlGzip,
    lcpImageAvifBytes: lcpAvifBuf.length,
    lcpImageJpgBytes: lcpJpgBuf.length,
    firstFoldTransferAvifBytes: firstFoldTotalAvif,
    firstFoldTransferJpgBytes: firstFoldTotalJpg,
    firstFoldBudgetMaxBytes: 500 * 1024
  };

  if (cssGzip > 35 * 1024) {
    errors.push(`CSS comprimido (${cssGzip} B) excedeu o orçamento de 35 KB.`);
  }
  if (jsGzip > 40 * 1024) {
    errors.push(`JS comprimido (${jsGzip} B) excedeu o orçamento de 40 KB.`);
  }
  if (firstFoldTotalJpg > 500 * 1024) {
    errors.push(`Primeira dobra (${firstFoldTotalJpg} B) excedeu o orçamento de 500 KB.`);
  }

  const docsDir = path.join(ROOT_DIR, "docs");
  fs.mkdirSync(docsDir, { recursive: true });
  fs.writeFileSync(
    path.join(docsDir, "relatorio-validacao.json"),
    JSON.stringify({ status: errors.length === 0 ? "PASS" : "FAIL", errors, ...report }, null, 2),
    "utf8"
  );

  if (errors.length > 0) {
    console.error("[Validação FALHOU]:\n" + errors.map((e) => " - " + e).join("\n"));
    process.exit(1);
  }

  console.log(
    `[Validação OK] ${report.pagesChecked.length} páginas verificadas | 0 erros de caminho relativo ou %C3 | ${report.httpProbes.length} sondas HTTP | CSS gzip: ${cssGzip} B | JS gzip: ${jsGzip} B`
  );
}

runValidation();
