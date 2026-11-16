import {
  escapeHtml,
  formatDatePtBr,
  evaluateSeminarState,
  buildSeminarWhatsAppUrl,
  buildWhatsAppUrl,
  resolvePageLink,
  renderWhatsAppIcon
} from "../components/whatsapp.mjs";
import { renderBaseLayout, buildOrganizationGraph } from "../layouts/base.mjs";

export function renderSeminarioDetalhePage({
  site,
  analistas,
  seminar,
  referenceDateIso,
  basePrefix = "../..",
  inlineCss = ""
}) {
  const state = evaluateSeminarState(seminar, referenceDateIso);
  const waEventHref = buildSeminarWhatsAppUrl(site, seminar, referenceDateIso);
  const waSecondaryHref = buildWhatsAppUrl(
    site.contatos.whatsappSecundario.urlBase,
    `Olá! Gostaria de informações sobre o seminário ${seminar.titulo} (${seminar.data}).`
  );
  const backToAtividadesHref = resolvePageLink("/cursos-e-seminarios/", basePrefix);

  const statusBadgeClass = state.isOpenForInquiry ? "badge--open" : "badge--past";

  const horarioDisplay = seminar.horario
    ? `${escapeHtml(seminar.horario)} (${escapeHtml(seminar.fuso)})`
    : "Consulte os detalhes pelo WhatsApp";

  const precoDisplay =
    typeof seminar.preco === "number"
      ? `R$ ${seminar.preco.toFixed(2).replace(".", ",")}`
      : seminar.preco === "gratuito"
      ? "Gratuito"
      : escapeHtml(seminar.precoTextoPublico || "Consulte os detalhes pelo WhatsApp");

  const topicosList = seminar.topicos
    .map((t) => `<li>${escapeHtml(t)}</li>`)
    .join("\n              ");

  const ministrantesList = seminar.ministrantes
    .map((m) => `<li>${escapeHtml(m)}</li>`)
    .join("\n              ");

  const primaryCtaLabel = state.isOpenForInquiry
    ? "Consultar detalhes e inscrição pelo WhatsApp"
    : "Consultar próximas edições pelo WhatsApp";

  const eventSchema = {
    "@type": "Event",
    "@id": `${site.dominio}/seminarios/${seminar.slug}/#event`,
    "name": seminar.titulo,
    "description": seminar.resumo,
    "startDate": seminar.data,
    "eventStatus": "https://schema.org/EventScheduled",
    "inLanguage": site.idioma,
    "url": `${site.dominio}/seminarios/${seminar.slug}/`,
    "image": [`${site.dominio}${seminar.imagem.src}`],
    "organizer": {
      "@id": `${site.dominio}/#organization`
    }
  };

  const bodyContent = `
    <article class="section" aria-labelledby="seminar-title">
      <div class="container">
        <div class="two-col-editorial">
          <div>
            <div class="seminar-card__meta">
              <span class="badge badge--date">
                <time datetime="${escapeHtml(seminar.data)}">${escapeHtml(formatDatePtBr(seminar.data))}</time>
              </span>
              <span class="badge ${statusBadgeClass}">${escapeHtml(seminar.situacaoTextoPublico)}</span>
            </div>

            <h1 id="seminar-title">${escapeHtml(seminar.titulo)}</h1>
            <p class="section__lead" style="margin-bottom: var(--space-6);">
              ${escapeHtml(seminar.resumo)}
            </p>

            <h2>Proposta e Contextualização</h2>
            <p>${escapeHtml(seminar.descricao)}</p>

            <h2>Eixos e Tópicos de Estudo</h2>
            <ul>
              ${topicosList}
            </ul>

            <h2>Público de Interesse</h2>
            <p>${escapeHtml(seminar.publicoAlvo)}</p>

            <h2>Ministrantes e Coordenação</h2>
            <ul>
              ${ministrantesList}
            </ul>

            <div class="notice-box mt-6">
              <strong>Transparência editorial:</strong> Detalhes operacionais como horário exato de início, formato de acesso, certificado, gravação e valores vigentes são confirmados diretamente no atendimento pelo WhatsApp institucional.
            </div>
          </div>

          <aside aria-label="Ficha prática e inscrição">
            <div class="seminar-card" style="position: sticky; top: calc(var(--header-height) + 1.5rem);">
              <div>
                <h2 style="font-size: var(--text-xl); margin-bottom: var(--space-3);">Informações Práticas</h2>
                <div class="seminar-card__details">
                  <p class="seminar-card__detail-item"><strong>Data:</strong> <time datetime="${escapeHtml(seminar.data)}">${escapeHtml(formatDatePtBr(seminar.data))}</time></p>
                  <p class="seminar-card__detail-item"><strong>Fuso horário de referência:</strong> ${escapeHtml(seminar.fuso)}</p>
                  <p class="seminar-card__detail-item"><strong>Horário:</strong> ${horarioDisplay}</p>
                  <p class="seminar-card__detail-item"><strong>Modalidade / Acesso:</strong> ${escapeHtml(seminar.modalidadeTextoPublico)}</p>
                  <p class="seminar-card__detail-item"><strong>Investimento:</strong> ${precoDisplay}</p>
                  <p class="seminar-card__detail-item"><strong>Prazo e procedimento:</strong> ${escapeHtml(seminar.prazoInscricao)}</p>
                  <p class="seminar-card__detail-item"><strong>Situação:</strong> ${escapeHtml(seminar.situacaoTextoPublico)}</p>
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <a href="${escapeHtml(waEventHref)}" class="btn ${state.isOpenForInquiry ? "btn--whatsapp" : "btn--secondary"}" target="_blank" rel="noopener noreferrer" data-cta-origin="seminar_detail_primary" data-seminar-id="${escapeHtml(seminar.id)}">
                  ${renderWhatsAppIcon("whatsapp-fab__icon")}
                  <span>${escapeHtml(primaryCtaLabel)}</span>
                </a>
                <a href="${escapeHtml(waSecondaryHref)}" class="btn btn--ghost btn--sm" target="_blank" rel="noopener noreferrer" data-cta-origin="seminar_detail_secondary" data-seminar-id="${escapeHtml(seminar.id)}">
                  <span>WhatsApp alternativo: ${escapeHtml(site.contatos.whatsappSecundario.rotulo)}</span>
                </a>
                <a href="mailto:${escapeHtml(site.contatos.email)}?subject=${encodeURIComponent("Seminário: " + seminar.titulo)}" class="btn btn--ghost btn--sm">
                  <span>Consultar por e-mail</span>
                </a>
                <a href="${escapeHtml(backToAtividadesHref)}" class="btn btn--secondary btn--sm">
                  Voltar para Atividades do Espaço
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  `;

  return renderBaseLayout({
    site,
    title: `${seminar.titulo} (${formatDatePtBr(seminar.data)}) | Espaço Arte-Ciência`,
    description: `${seminar.resumo} Confira data (${formatDatePtBr(seminar.data)}) e consulte orientações de inscrição pelo WhatsApp do Espaço Arte-Ciência.`,
    canonicalPath: `/seminarios/${seminar.slug}/`,
    currentNavPath: "/cursos-e-seminarios/",
    basePrefix,
    inlineCss,
    ogType: "article",
    breadcrumbs: [
      { name: "Início", url: "/", href: "/" },
      { name: "Atividades do Espaço", url: "/cursos-e-seminarios/", href: "/cursos-e-seminarios/" },
      { name: seminar.titulo, url: `/seminarios/${seminar.slug}/`, href: `/seminarios/${seminar.slug}/` }
    ],
    extraJsonLdNodes: [...buildOrganizationGraph(site, analistas, false), eventSchema],
    bodyContent
  });
}
