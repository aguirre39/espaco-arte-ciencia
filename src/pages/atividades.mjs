import {
  escapeHtml,
  buildWhatsAppUrl,
  evaluateSeminarState,
  renderWhatsAppIcon
} from "../components/whatsapp.mjs";
import { renderSeminarCard } from "../components/cards.mjs";
import { renderBaseLayout, buildOrganizationGraph } from "../layouts/base.mjs";

export function renderAtividadesPage({
  site,
  analistas,
  seminarios,
  referenceDateIso,
  basePrefix = "..",
  inlineCss = ""
}) {
  const waGeneralHref = buildWhatsAppUrl(
    site.contatos.whatsappPrincipal.urlBase,
    site.contatos.mensagensPadrao.geral
  );

  const upcomingSeminars = seminarios
    .filter((s) => evaluateSeminarState(s, referenceDateIso).isOpenForInquiry)
    .sort((a, b) => a.data.localeCompare(b.data));

  const pastSeminars = seminarios
    .filter((s) => evaluateSeminarState(s, referenceDateIso).isClosedOrPast)
    .sort((a, b) => b.data.localeCompare(a.data));

  const upcomingHtml =
    upcomingSeminars.length > 0
      ? `<div class="seminars-grid">
          ${upcomingSeminars.map((s) => renderSeminarCard(s, site, referenceDateIso, basePrefix)).join("\n          ")}
        </div>`
      : `<div class="empty-state">
          <h3>Consulte a próxima programação</h3>
          <p>Não há seminários futuros publicados no momento. Entre em contato pelo WhatsApp para receber informações sobre as próximas datas e ciclos de estudo.</p>
          <a href="${escapeHtml(waGeneralHref)}" class="btn btn--whatsapp" target="_blank" rel="noopener noreferrer" data-cta-origin="atividades_empty_upcoming">
            ${renderWhatsAppIcon("whatsapp-fab__icon")}
            <span>Consultar próximas datas pelo WhatsApp</span>
          </a>
        </div>`;

  const pastHtml =
    pastSeminars.length > 0
      ? `<div class="seminars-grid">
          ${pastSeminars.map((s) => renderSeminarCard(s, site, referenceDateIso, basePrefix)).join("\n          ")}
        </div>`
      : `<p class="text-muted">Nenhum evento anterior registrado neste ciclo.</p>`;

  const bodyContent = `
    <section class="hero" aria-labelledby="atividades-heading">
      <div class="container">
        <span class="hero__badge">Agenda Central | Ciclo 2026</span>
        <h1 id="atividades-heading" class="hero__title">Atividades do Espaço: Cursos e Seminários</h1>
        <p class="hero__subtitle">
          Programação de seminários temáticos, ciclos de leitura e encontros dedicados ao pensamento de Carl Gustav Jung e Marie-Louise von Franz.
        </p>
        <div class="notice-box">
          <strong>Como funcionam as inscrições e informações práticas:</strong> Os detalhes atualizados de cada encontro (horário, formato de transmissão, disponibilidade de vagas e valores vigentes) são confirmados diretamente pelo WhatsApp oficial. Para seminários avulsos com envio de link, solicita-se inscrição com antecedência mínima de <strong>48 horas</strong>.
        </div>
      </div>
    </section>

    <section class="section section--elevated" aria-labelledby="proximos-seminarios-heading">
      <div class="container">
        <div class="filter-bar" role="region" aria-label="Filtrar atividades exibidas">
          <span style="font-size: var(--text-sm); font-weight: 700; color: var(--color-text-primary);">Exibir:</span>
          <button type="button" class="filter-btn" data-activity-filter="todos" aria-pressed="true">Todas as atividades (${seminarios.length})</button>
          <button type="button" class="filter-btn" data-activity-filter="futuro" aria-pressed="false">Próximos seminários (${upcomingSeminars.length})</button>
          <button type="button" class="filter-btn" data-activity-filter="historico" aria-pressed="false">Realizados / Histórico (${pastSeminars.length})</button>
        </div>

        <div class="section__header">
          <span class="section__eyebrow">Em Primeiro Plano</span>
          <h2 id="proximos-seminarios-heading">Próximos seminários programados</h2>
          <p class="section__lead">
            Encontros com data futura confirmada no calendário institucional (fuso horário: ${escapeHtml(site.fusoPadrao)}).
          </p>
        </div>

        <div id="filter-empty-state" class="empty-state" hidden>
          <h3>Nenhuma atividade encontrada para o filtro selecionado</h3>
          <p>Altere o filtro acima ou consulte a equipe pelo WhatsApp sobre novos encontros.</p>
        </div>

        ${upcomingHtml}
      </div>
    </section>

    <section class="section section--warm" id="historico-atividades" aria-labelledby="historico-heading">
      <div class="container">
        <div class="section__header">
          <span class="section__eyebrow">Memória de Estudos</span>
          <h2 id="historico-heading">Histórico de atividades realizadas</h2>
          <p class="section__lead">
            Registro de seminários já realizados pela instituição. Eventos passados não possuem inscrições abertas, mas você pode consultar a equipe sobre futuras edições e temas correlatos.
          </p>
        </div>

        ${pastHtml}
      </div>
    </section>

    <section class="section" aria-labelledby="cta-agenda-heading">
      <div class="container">
        <div class="closing-banner">
          <div>
            <span class="section__eyebrow">Atendimento Direto</span>
            <h2 id="cta-agenda-heading">Deseja receber orientações de inscrição?</h2>
            <p class="mb-0">
              Converse com a equipe do Espaço Arte-Ciência pelo WhatsApp para confirmar valores vigentes de seminários avulsos ou ciclos semestrais.
            </p>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
            <a href="${escapeHtml(waGeneralHref)}" class="btn btn--whatsapp" target="_blank" rel="noopener noreferrer" data-cta-origin="atividades_closing_whatsapp">
              ${renderWhatsAppIcon("whatsapp-fab__icon")}
              <span>Conversar pelo WhatsApp</span>
            </a>
            <a href="mailto:${escapeHtml(site.contatos.email)}" class="btn btn--secondary">
              Enviar e-mail
            </a>
          </div>
        </div>
      </div>
    </section>
  `;

  return renderBaseLayout({
    site,
    title: "Atividades do Espaço: Cursos e Seminários | Espaço Arte-Ciência",
    description:
      "Agenda de seminários e cursos de Psicologia Analítica no Espaço Arte-Ciência. Confira os próximos encontros sobre Carl Gustav Jung e Marie-Louise von Franz.",
    canonicalPath: "/cursos-e-seminarios/",
    currentNavPath: "/cursos-e-seminarios/",
    basePrefix,
    inlineCss,
    breadcrumbs: [
      { name: "Início", url: "/", href: "/" },
      { name: "Atividades do Espaço", url: "/cursos-e-seminarios/", href: "/cursos-e-seminarios/" }
    ],
    extraJsonLdNodes: buildOrganizationGraph(site, analistas, false),
    bodyContent
  });
}
