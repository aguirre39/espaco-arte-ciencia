import {
  escapeHtml,
  formatDatePtBr,
  evaluateSeminarState,
  buildSeminarWhatsAppUrl,
  resolvePageLink,
  resolveAssetPath,
  resolveSrcset,
  renderWhatsAppIcon
} from "./whatsapp.mjs";

export function renderSeminarCard(seminar, site, referenceDateIso, basePrefix = ".") {
  const state = evaluateSeminarState(seminar, referenceDateIso);
  const waHref = buildSeminarWhatsAppUrl(site, seminar, referenceDateIso);
  const detailHref = resolvePageLink(`/seminarios/${seminar.slug}/`, basePrefix);
  const cardModifier = state.isClosedOrPast ? " seminar-card--past" : "";
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

  const ctaLabel = state.isOpenForInquiry
    ? "Consultar inscrição pelo WhatsApp"
    : "Consultar próximas edições";

  return `<article class="seminar-card${cardModifier}" data-seminar-id="${escapeHtml(seminar.id)}" data-seminar-year="${escapeHtml(seminar.ano)}" data-seminar-type="${escapeHtml(seminar.tipo)}" data-seminar-state="${state.isOpenForInquiry ? "futuro" : "historico"}">
    <div>
      <div class="seminar-card__meta">
        <span class="badge badge--date">
          <time datetime="${escapeHtml(seminar.data)}">${escapeHtml(formatDatePtBr(seminar.data))}</time>
        </span>
        <span class="badge ${statusBadgeClass}">${escapeHtml(seminar.situacaoTextoPublico)}</span>
      </div>

      <h3 class="seminar-card__title">
        <a href="${escapeHtml(detailHref)}" data-seminar-link="${escapeHtml(seminar.id)}">${escapeHtml(seminar.titulo)}</a>
      </h3>

      <p class="seminar-card__summary">${escapeHtml(seminar.resumo)}</p>

      <div class="seminar-card__details">
        <p class="seminar-card__detail-item"><strong>Horário e formato:</strong> ${horarioDisplay} | ${escapeHtml(seminar.modalidadeTextoPublico)}</p>
        <p class="seminar-card__detail-item"><strong>Investimento:</strong> ${precoDisplay}</p>
        <p class="seminar-card__detail-item"><strong>Orientação de inscrição:</strong> ${escapeHtml(seminar.prazoInscricao)}</p>
      </div>
    </div>

    <div class="seminar-card__actions">
      <a href="${escapeHtml(detailHref)}" class="btn btn--secondary" data-seminar-view="${escapeHtml(seminar.id)}">
        Conhecer o seminário
      </a>
      <a href="${escapeHtml(waHref)}" class="btn ${state.isOpenForInquiry ? "btn--whatsapp" : "btn--ghost"}" target="_blank" rel="noopener noreferrer" data-cta-origin="seminar_card" data-seminar-id="${escapeHtml(seminar.id)}">
        ${renderWhatsAppIcon("whatsapp-fab__icon")}
        <span>${escapeHtml(ctaLabel)}</span>
      </a>
    </div>
  </article>`;
}

export function renderAnalystCard(analyst, basePrefix = ".") {
  const img = analyst.imagem;
  const sizesAttr = "(max-width: 640px) 240px, (max-width: 1024px) 280px, 320px";
  const formacaoList = analyst.formacaoAreas
    .map((f) => `<li>${escapeHtml(f)}</li>`)
    .join("\n            ");

  const obsHtml = analyst.observacaoAtendimento
    ? `<p class="mt-4" style="font-size: var(--text-xs); color: var(--color-text-muted);"><em>Nota editorial:</em> ${escapeHtml(analyst.observacaoAtendimento)}</p>`
    : "";

  const srcJpg = resolveAssetPath(img.src, basePrefix);
  const srcsetAvif = resolveSrcset(img.srcsetAvif, basePrefix);
  const srcsetWebp = resolveSrcset(img.srcsetWebp, basePrefix);
  const srcsetJpg = resolveSrcset(img.srcsetJpg, basePrefix);

  return `<article class="analyst-card" id="profissional-${escapeHtml(analyst.slug)}">
    <div class="analyst-card__media">
      <picture>
        <source type="image/avif" srcset="${escapeHtml(srcsetAvif)}" sizes="${sizesAttr}" />
        <source type="image/webp" srcset="${escapeHtml(srcsetWebp)}" sizes="${sizesAttr}" />
        <img
          src="${escapeHtml(srcJpg)}"
          srcset="${escapeHtml(srcsetJpg)}"
          sizes="${sizesAttr}"
          alt="${escapeHtml(img.alt)}"
          width="${img.width}"
          height="${img.height}"
          loading="lazy"
          decoding="async"
        />
      </picture>
    </div>
    <div class="analyst-card__body">
      <span class="analyst-card__role">${escapeHtml(analyst.papelInstitucional)}</span>
      <h3 class="analyst-card__name">${escapeHtml(analyst.nome)}</h3>
      <p class="analyst-card__bio">${escapeHtml(analyst.sinteseCard)}</p>

      <details class="analyst-card__expand" name="analista-trajetoria">
        <summary>Conhecer trajetória</summary>
        <div class="analyst-card__full-bio">
          <p>${escapeHtml(analyst.trajetoriaCompleta)}</p>
          <p class="mb-0"><strong>Destaques de formação e atuação:</strong></p>
          <ul>
            ${formacaoList}
          </ul>
          <p class="mb-0"><strong>Referência geográfica:</strong> ${escapeHtml(analyst.localidade)}</p>
          ${obsHtml}
        </div>
      </details>
    </div>
  </article>`;
}
