/**
 * Utilitários e componentes de conversão via WhatsApp, resolução de caminhos relativos e ícones SVG locais.
 * Todas as URLs de WhatsApp usam encodeURIComponent, sem envio automático e sem SDK externo.
 */

export function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Converte um caminho de ativo (/assets/...) em caminho relativo seguro (./assets/..., ../assets/...)
 * para funcionar tanto em servidor HTTP raiz, subdiretório (/dist/) ou protocolo file://.
 */
export function resolveAssetPath(assetPath, basePrefix = ".") {
  if (!assetPath) return "";
  if (assetPath.startsWith("http://") || assetPath.startsWith("https://") || assetPath.startsWith("data:")) {
    return assetPath;
  }
  const clean = assetPath.replace(/^\/+/, "");
  return `${basePrefix}/${clean}`;
}

/**
 * Converte um atributo srcset com múltiplos caminhos (/assets/...) para caminhos relativos.
 */
export function resolveSrcset(srcsetStr, basePrefix = ".") {
  if (!srcsetStr) return "";
  return srcsetStr
    .split(",")
    .map((part) => {
      const trimmed = part.trim();
      const [url, descriptor] = trimmed.split(/\s+/);
      const resolvedUrl = resolveAssetPath(url, basePrefix);
      return descriptor ? `${resolvedUrl} ${descriptor}` : resolvedUrl;
    })
    .join(", ");
}

/**
 * Converte links de navegação interna (/cursos-e-seminarios/, /, etc.) para caminhos relativos
 * compatíveis com servidor web, Live Server (/dist/) e abertura local.
 */
export function resolvePageLink(href, basePrefix = ".") {
  if (!href) return `${basePrefix}/index.html`;
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#")
  ) {
    return href;
  }
  if (href === "/" || href === "/index.html") {
    return `${basePrefix}/index.html`;
  }
  // Verificar se há âncora (ex.: /quem-somos-nos/#profissional-x)
  const [pathPart, hashPart] = href.split("#");
  const cleanDir = pathPart.replace(/^\/+|\/+$/g, "");
  const finalPath = cleanDir.endsWith(".html")
    ? `${basePrefix}/${cleanDir}`
    : `${basePrefix}/${cleanDir}/index.html`;
  return hashPart ? `${finalPath}#${hashPart}` : finalPath;
}

export function formatDatePtBr(isoDate) {
  if (!isoDate) return "Data a confirmar";
  const [year, month, day] = isoDate.split("-").map(Number);
  const meses = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];
  return `${String(day).padStart(2, "0")} de ${meses[month - 1]} de ${year}`;
}

export function formatDateShort(isoDate) {
  if (!isoDate) return "A confirmar";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

/**
 * Avalia de forma independente se a data é futura (em relação à data de referência do build)
 * e se as inscrições/consultas estão abertas.
 */
export function evaluateSeminarState(seminar, referenceDateIso) {
  const isFutureOrToday = seminar.data >= referenceDateIso;
  const situacao = seminar.situacao || "consulta_aberta";
  const isOpenForInquiry =
    isFutureOrToday &&
    (situacao === "inscricoes_abertas" || situacao === "consulta_aberta" || situacao === "programado");
  const isClosedOrPast = !isFutureOrToday || situacao === "realizado" || situacao === "encerrado";

  return {
    isFutureOrToday,
    isOpenForInquiry,
    isClosedOrPast,
    situacao
  };
}

export function buildWhatsAppUrl(baseUrl, message) {
  const cleanBase = baseUrl.replace(/\/$/, "");
  return `${cleanBase}?text=${encodeURIComponent(message)}`;
}

export function buildSeminarWhatsAppUrl(site, seminar, referenceDateIso) {
  const state = evaluateSeminarState(seminar, referenceDateIso);
  const dataFormatada = formatDateShort(seminar.data);
  const template = state.isOpenForInquiry
    ? site.contatos.mensagensPadrao.eventoTemplate
    : site.contatos.mensagensPadrao.eventoPassadoTemplate;

  const msg = template
    .replace("{titulo}", seminar.titulo)
    .replace("{data}", dataFormatada);

  return buildWhatsAppUrl(site.contatos.whatsappPrincipal.urlBase, msg);
}

export function renderWhatsAppIcon(className = "whatsapp-fab__icon") {
  return `<svg class="${className}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`;
}

export function renderScarabMarkSvg(className = "site-brand__mark") {
  return `<svg class="${className}" viewBox="0 0 64 52" width="58" height="46" aria-hidden="true" focusable="false">
    <g transform="translate(2, 0)">
      <g fill="none" stroke="#1C1917" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 15 L6 10 L2 12" />
        <path d="M15 37 L6 42 L2 40" />
        <path d="M26 12 L21 4 L15 3" />
        <path d="M26 40 L21 48 L15 49" />
        <path d="M39 14 L49 9 L57 15" />
        <path d="M39 38 L49 43 L57 37" />
      </g>
      <ellipse cx="25" cy="26" rx="15" ry="13" fill="#1C1917" />
      <path d="M30 14 C28 19, 28 33, 30 38" fill="none" stroke="#FAF6F0" stroke-width="1.3" stroke-linecap="round" />
      <line x1="10.5" y1="26" x2="28.5" y2="26" stroke="#FAF6F0" stroke-width="1.2" stroke-linecap="round" />
      <path d="M38 20 C43 21, 44 31, 38 32 Z" fill="#1C1917" />
      <circle cx="53.5" cy="26" r="6.8" fill="#C62E26" />
    </g>
  </svg>`;
}

export function renderFloatingWhatsApp(site) {
  const href = buildWhatsAppUrl(
    site.contatos.whatsappPrincipal.urlBase,
    site.contatos.mensagensPadrao.geral
  );
  return `<a href="${escapeHtml(href)}" class="whatsapp-fab" target="_blank" rel="noopener noreferrer" aria-label="Conversar com o Espaço Arte-Ciência pelo WhatsApp" data-cta-origin="floating_whatsapp">
    ${renderWhatsAppIcon("whatsapp-fab__icon")}
    <span class="whatsapp-fab__label">WhatsApp</span>
  </a>`;
}
