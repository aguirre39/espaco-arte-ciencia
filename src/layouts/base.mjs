import {
  escapeHtml,
  resolveAssetPath,
  resolvePageLink,
  renderFloatingWhatsApp
} from "../components/whatsapp.mjs";
import { renderHeader } from "../components/header.mjs";
import { renderFooter } from "../components/footer.mjs";

export function buildOrganizationGraph(site, analistas = [], includePersons = false) {
  const orgId = `${site.dominio}/#organization`;
  const websiteId = `${site.dominio}/#website`;

  const graph = [
    {
      "@type": "EducationalOrganization",
      "@id": orgId,
      "name": site.nome,
      "alternateName": site.sigla,
      "description": site.missao,
      "url": `${site.dominio}/`,
      "logo": {
        "@type": "ImageObject",
        "url": `${site.dominio}/assets/logo/logo-horizontal.png`,
        "width": 920,
        "height": 152
      },
      "email": site.contatos.email,
      "telephone": [
        "+55-51-98175-1727",
        "+55-51-99247-7179"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": site.localidade.cidade,
        "addressRegion": site.localidade.uf,
        "addressCountry": "BR"
      },
      "founder": analistas
        .filter((a) => a.cofundadora)
        .map((a) => ({
          "@type": "Person",
          "@id": `${site.dominio}/quem-somos-nos/#${a.slug}`,
          "name": a.nome
        }))
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      "url": `${site.dominio}/`,
      "name": site.nome,
      "inLanguage": site.idioma,
      "publisher": {
        "@id": orgId
      }
    }
  ];

  if (includePersons && analistas.length > 0) {
    for (const a of analistas) {
      graph.push({
        "@type": "Person",
        "@id": `${site.dominio}/quem-somos-nos/#${a.slug}`,
        "name": a.nome,
        "jobTitle": a.papelInstitucional,
        "description": a.sinteseCard,
        "image": `${site.dominio}${a.imagem.src}`,
        "worksFor": {
          "@id": orgId
        }
      });
    }
  }

  return graph;
}

export function buildBreadcrumbSchema(site, breadcrumbs = []) {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;
  return {
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((b, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": b.name,
      "item": b.url.startsWith("http") ? b.url : `${site.dominio}${b.url}`
    }))
  };
}

export function renderBreadcrumbsHtml(breadcrumbs = [], basePrefix = ".") {
  if (!breadcrumbs || breadcrumbs.length <= 1) return "";
  const items = breadcrumbs
    .map((b, idx) => {
      const isLast = idx === breadcrumbs.length - 1;
      if (isLast) {
        return `<li class="breadcrumb__item" aria-current="page"><span>${escapeHtml(b.name)}</span></li>`;
      }
      const resolvedHref = resolvePageLink(b.href || b.url, basePrefix);
      return `<li class="breadcrumb__item"><a href="${escapeHtml(resolvedHref)}">${escapeHtml(b.name)}</a></li>`;
    })
    .join("\n          ");

  return `<nav class="breadcrumb" aria-label="Localização na estrutura do site">
    <div class="container">
      <ol class="breadcrumb__list">
        ${items}
      </ol>
    </div>
  </nav>`;
}

export function renderBaseLayout({
  site,
  title,
  description,
  canonicalPath,
  currentNavPath = "/",
  basePrefix = ".",
  inlineCss = "",
  ogType = "website",
  ogImage = "/assets/images/og-espaco-arte-ciencia.jpg",
  preloadHeroImage = false,
  noindex = false,
  breadcrumbs = [],
  extraJsonLdNodes = [],
  bodyContent
}) {
  const canonicalUrl = canonicalPath.startsWith("http")
    ? canonicalPath
    : `${site.dominio}${canonicalPath}`;
  const ogImageUrl = ogImage.startsWith("http")
    ? ogImage
    : `${site.dominio}${ogImage}`;

  const graphNodes = [...extraJsonLdNodes];
  const breadcrumbNode = buildBreadcrumbSchema(site, breadcrumbs);
  if (breadcrumbNode) {
    graphNodes.push(breadcrumbNode);
  }

  const jsonLdPayload = {
    "@context": "https://schema.org",
    "@graph": graphNodes
  };

  const robotsMeta = noindex
    ? '<meta name="robots" content="noindex, follow" />'
    : '<meta name="robots" content="index, follow, max-image-preview:large" />';

  const preloadHref = resolveAssetPath(
    "/assets/images/institucional/relevo-simbolico-institucional.avif",
    basePrefix
  );
  const preloadLink = preloadHeroImage
    ? `<link rel="preload" as="image" href="${escapeHtml(preloadHref)}" type="image/avif" fetchpriority="high" />`
    : "";

  const faviconSvgHref = resolveAssetPath("/assets/logo/favicon.svg", basePrefix);
  const favicon32Href = resolveAssetPath("/assets/logo/favicon-32x32.png", basePrefix);
  const favicon16Href = resolveAssetPath("/assets/logo/favicon-16x16.png", basePrefix);
  const appleIconHref = resolveAssetPath("/assets/logo/apple-touch-icon.png", basePrefix);
  const cssHref = resolveAssetPath("/assets/css/styles.css", basePrefix);
  const jsHref = resolveAssetPath("/assets/js/main.js", basePrefix);

  const inlineStyleTag = inlineCss
    ? `<style id="eac-inline-styles">${inlineCss}</style>`
    : "";

  return `<!DOCTYPE html>
<html lang="${escapeHtml(site.idioma)}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  ${robotsMeta}
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />

  <!-- Ícones e identidade -->
  <link rel="icon" href="${escapeHtml(faviconSvgHref)}" type="image/svg+xml" />
  <link rel="icon" href="${escapeHtml(favicon32Href)}" sizes="32x32" type="image/png" />
  <link rel="icon" href="${escapeHtml(favicon16Href)}" sizes="16x16" type="image/png" />
  <link rel="apple-touch-icon" href="${escapeHtml(appleIconHref)}" sizes="180x180" />
  <meta name="theme-color" content="#FAF6F0" />

  <!-- Open Graph / Social -->
  <meta property="og:locale" content="pt_BR" />
  <meta property="og:type" content="${escapeHtml(ogType)}" />
  <meta property="og:site_name" content="${escapeHtml(site.nome)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
  <meta property="og:image" content="${escapeHtml(ogImageUrl)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${escapeHtml(site.nome)} - ${escapeHtml(site.slogan)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(ogImageUrl)}" />

  ${preloadLink}
  <link rel="stylesheet" href="${escapeHtml(cssHref)}" />
  ${inlineStyleTag}

  <script type="application/ld+json">${JSON.stringify(jsonLdPayload)}</script>
</head>
<body>
  <a href="#conteudo-principal" class="skip-link">Pular para o conteúdo principal</a>

  ${renderHeader(site, currentNavPath, basePrefix)}
  ${renderBreadcrumbsHtml(breadcrumbs, basePrefix)}

  <main id="conteudo-principal" tabindex="-1">
    ${bodyContent}
  </main>

  ${renderFooter(site, basePrefix)}
  ${renderFloatingWhatsApp(site)}

  <script src="${escapeHtml(jsHref)}" defer></script>
</body>
</html>
`;
}
