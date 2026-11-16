import {
  escapeHtml,
  buildWhatsAppUrl,
  resolvePageLink,
  resolveAssetPath
} from "./whatsapp.mjs";

export function renderFooter(site, basePrefix = ".") {
  const waPrimaryHref = buildWhatsAppUrl(
    site.contatos.whatsappPrincipal.urlBase,
    site.contatos.mensagensPadrao.geral
  );
  const waSecondaryHref = buildWhatsAppUrl(
    site.contatos.whatsappSecundario.urlBase,
    site.contatos.mensagensPadrao.geral
  );

  const primaryLinks = site.navegacaoPrincipal
    .map((item) => {
      const linkHref = resolvePageLink(item.href, basePrefix);
      return `<li><a href="${escapeHtml(linkHref)}">${escapeHtml(item.rotulo)}</a></li>`;
    })
    .join("\n            ");

  const secondaryLinks = site.navegacaoSecundaria
    .map((item) => {
      const linkHref = resolvePageLink(item.href, basePrefix);
      return `<li><a href="${escapeHtml(linkHref)}">${escapeHtml(item.rotulo)}</a></li>`;
    })
    .join("\n            ");

  const logoLightSrc = resolveAssetPath("/assets/logo/logo-mono-light.svg", basePrefix);

  return `<footer class="site-footer">
    <div class="container">
      <div class="site-footer__grid">
        <div>
          <img src="${escapeHtml(logoLightSrc)}" alt="Espaço Arte-Ciência" width="290" height="48" loading="lazy" decoding="async" style="margin-bottom: 1rem;" />
          <p>${escapeHtml(site.missao)}</p>
          <p><strong>Origem institucional:</strong> Porto Alegre / RS - Brasil.</p>
        </div>

        <nav aria-label="Seções institucionais no rodapé">
          <h2 class="site-footer__heading">Institucional</h2>
          <ul>
            ${primaryLinks}
          </ul>
        </nav>

        <nav aria-label="Demais áreas do Espaço">
          <h2 class="site-footer__heading">Acervo e Formação</h2>
          <ul>
            ${secondaryLinks}
          </ul>
        </nav>

        <div>
          <h2 class="site-footer__heading">Canais de Atendimento</h2>
          <ul>
            <li>
              <strong>WhatsApp principal:</strong><br />
              <a href="${escapeHtml(waPrimaryHref)}" target="_blank" rel="noopener noreferrer" data-cta-origin="footer_whatsapp_primary">${escapeHtml(site.contatos.whatsappPrincipal.rotulo)}</a>
            </li>
            <li>
              <strong>WhatsApp alternativo:</strong><br />
              <a href="${escapeHtml(waSecondaryHref)}" target="_blank" rel="noopener noreferrer" data-cta-origin="footer_whatsapp_secondary">${escapeHtml(site.contatos.whatsappSecundario.rotulo)}</a>
            </li>
            <li>
              <strong>E-mail oficial:</strong><br />
              <a href="mailto:${escapeHtml(site.contatos.email)}">${escapeHtml(site.contatos.email)}</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="site-footer__bottom">
        <p class="mb-0">© ${new Date().getFullYear()} ${escapeHtml(site.nome)}. Todos os direitos reservados sobre textos, fotografias e identidade institucional.</p>
        <p class="mb-0">Informações verificáveis conforme fontes públicas institucionais. Para confirmar horários, valores e inscrições vigentes, consulte pelo WhatsApp.</p>
      </div>
    </div>
  </footer>`;
}
