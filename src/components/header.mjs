import {
  escapeHtml,
  buildWhatsAppUrl,
  resolvePageLink,
  renderScarabMarkSvg,
  renderWhatsAppIcon
} from "./whatsapp.mjs";

export function renderHeader(site, currentPath = "/", basePrefix = ".") {
  const waHref = buildWhatsAppUrl(
    site.contatos.whatsappPrincipal.urlBase,
    site.contatos.mensagensPadrao.geral
  );

  const navItems = site.navegacaoPrincipal
    .map((item) => {
      const isCurrent =
        currentPath === item.href ||
        (item.href !== "/" && currentPath.startsWith(item.href.replace(/\/$/, "")));
      const ariaCurrent = isCurrent ? ' aria-current="page"' : "";
      const linkHref = resolvePageLink(item.href, basePrefix);
      return `<li class="site-nav__item"><a href="${escapeHtml(linkHref)}" class="site-nav__link"${ariaCurrent}>${escapeHtml(item.rotulo)}</a></li>`;
    })
    .join("\n          ");

  const homeHref = resolvePageLink("/", basePrefix);

  return `<header class="site-header">
    <div class="container site-header__inner">
      <a href="${escapeHtml(homeHref)}" class="site-brand" aria-label="Espaço Arte-Ciência - Página inicial">
        ${renderScarabMarkSvg("site-brand__mark")}
        <span class="site-brand__text">
          <span class="site-brand__name">ESPAÇO ARTE-CIÊNCIA</span>
          <span class="site-brand__tagline">Psicologia Analítica | Jung e von Franz</span>
        </span>
      </a>

      <button type="button" class="menu-toggle" id="menu-toggle" aria-expanded="false" aria-controls="primary-navigation">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        <span>Menu</span>
      </button>

      <nav class="site-nav" id="primary-navigation" aria-label="Navegação principal">
        <ul class="site-nav__list">
          ${navItems}
        </ul>
        <a href="${escapeHtml(waHref)}" class="btn btn--whatsapp btn--sm" target="_blank" rel="noopener noreferrer" data-cta-origin="header_cta">
          ${renderWhatsAppIcon("whatsapp-fab__icon")}
          <span>Informações e inscrições</span>
        </a>
      </nav>
    </div>
  </header>`;
}
