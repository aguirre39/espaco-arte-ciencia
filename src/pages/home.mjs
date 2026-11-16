import {
  escapeHtml,
  buildWhatsAppUrl,
  evaluateSeminarState,
  resolvePageLink,
  resolveAssetPath,
  renderWhatsAppIcon
} from "../components/whatsapp.mjs";
import { renderSeminarCard, renderAnalystCard } from "../components/cards.mjs";
import { renderBaseLayout, buildOrganizationGraph } from "../layouts/base.mjs";

export function renderHomePage({
  site,
  analistas,
  seminarios,
  referenceDateIso,
  basePrefix = ".",
  inlineCss = ""
}) {
  const waGeneralHref = buildWhatsAppUrl(
    site.contatos.whatsappPrincipal.urlBase,
    site.contatos.mensagensPadrao.geral
  );
  const waSecondaryHref = buildWhatsAppUrl(
    site.contatos.whatsappSecundario.urlBase,
    site.contatos.mensagensPadrao.geral
  );

  const atividadesHref = resolvePageLink("/cursos-e-seminarios/", basePrefix);
  const historiaHref = resolvePageLink("/nossa-historia/", basePrefix);
  const quemSomosHref = resolvePageLink("/quem-somos-nos/", basePrefix);
  const analiseHref = resolvePageLink("/psicoterapia-junguiana-1/", basePrefix);

  const relevoAvif = resolveAssetPath("/assets/images/institucional/relevo-simbolico-institucional.avif", basePrefix);
  const relevoWebp = resolveAssetPath("/assets/images/institucional/relevo-simbolico-institucional.webp", basePrefix);
  const relevoJpg = resolveAssetPath("/assets/images/institucional/relevo-simbolico-institucional.jpg", basePrefix);

  const jungAvif = resolveAssetPath("/assets/images/institucional/carl-gustav-jung.avif", basePrefix);
  const jungWebp = resolveAssetPath("/assets/images/institucional/carl-gustav-jung.webp", basePrefix);
  const jungJpg = resolveAssetPath("/assets/images/institucional/carl-gustav-jung.jpg", basePrefix);

  const vonFranzAvif = resolveAssetPath("/assets/images/institucional/marie-louise-von-franz.avif", basePrefix);
  const vonFranzWebp = resolveAssetPath("/assets/images/institucional/marie-louise-von-franz.webp", basePrefix);
  const vonFranzJpg = resolveAssetPath("/assets/images/institucional/marie-louise-von-franz.jpg", basePrefix);

  const upcomingSeminars = seminarios
    .filter((s) => evaluateSeminarState(s, referenceDateIso).isOpenForInquiry)
    .sort((a, b) => a.data.localeCompare(b.data));

  const upcomingContent =
    upcomingSeminars.length > 0
      ? `<div class="seminars-grid">
          ${upcomingSeminars.map((s) => renderSeminarCard(s, site, referenceDateIso, basePrefix)).join("\n          ")}
        </div>`
      : `<div class="empty-state">
          <h3>Consulte a próxima programação</h3>
          <p>No momento não há novos encontros com data futura publicada no calendário editorial. Converse com a equipe pelo WhatsApp para receber informações sobre os próximos ciclos e seminários.</p>
          <a href="${escapeHtml(waGeneralHref)}" class="btn btn--whatsapp" target="_blank" rel="noopener noreferrer" data-cta-origin="home_empty_schedule">
            ${renderWhatsAppIcon("whatsapp-fab__icon")}
            <span>Consultar programação pelo WhatsApp</span>
          </a>
        </div>`;

  const teamCardsHtml = analistas.map((a) => renderAnalystCard(a, basePrefix)).join("\n        ");

  const stepsHtml = site.comoParticipar
    .map(
      (step) => `<div class="step-card">
        <span class="step-card__number" aria-hidden="true">${escapeHtml(step.passo)}</span>
        <h3>${escapeHtml(step.titulo)}</h3>
        <p class="mb-0">${escapeHtml(step.descricao)}</p>
      </div>`
    )
    .join("\n        ");

  const faqHtml = site.perguntasFrequentes
    .map(
      (item, idx) => `<details class="faq-item"${idx === 0 ? " open" : ""}>
        <summary>${escapeHtml(item.pergunta)}</summary>
        <div class="faq-item__answer">
          <p class="mb-0">${escapeHtml(item.resposta)}</p>
        </div>
      </details>`
    )
    .join("\n        ");

  const bodyContent = `
    <!-- 2. HERO -->
    <section class="hero" aria-labelledby="hero-heading">
      <div class="container hero__grid">
        <div class="hero__content">
          <span class="hero__badge">Espaço Arte-Ciência | Quatro décadas de trajetória</span>
          <h1 id="hero-heading" class="hero__title">Seminários e encontros de Psicologia Analítica</h1>
          <p class="hero__subtitle">
            Um espaço dedicado a compartilhar a produção intelectual e difundir a visão de mundo de <strong>Carl Gustav Jung</strong> e <strong>Marie-Louise von Franz</strong>, articulando estudo teórico, reflexão simbólica e expressão cultural.
          </p>
          <div class="hero__mission">
            <p class="mb-0">
              <strong>Proposta institucional:</strong> Promovemos seminários temáticos, cursos, grupos de estudo, formação e clínica analítica voltados à compreensão da participação do inconsciente na ampliação da consciência.
            </p>
          </div>
          <div class="hero__actions">
            <a href="${escapeHtml(waGeneralHref)}" class="btn btn--whatsapp" target="_blank" rel="noopener noreferrer" data-cta-origin="hero_primary">
              ${renderWhatsAppIcon("whatsapp-fab__icon")}
              <span>Consultar seminários pelo WhatsApp</span>
            </a>
            <a href="${escapeHtml(atividadesHref)}" class="btn btn--secondary">
              Ver atividades do Espaço
            </a>
          </div>
          <div class="hero__trust">
            <div class="hero__trust-item">
              <svg class="hero__trust-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>40 anos de trajetória em Porto Alegre</span>
            </div>
            <div class="hero__trust-item">
              <svg class="hero__trust-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <span>Estudo direto das Obras Completas</span>
            </div>
            <div class="hero__trust-item">
              <svg class="hero__trust-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Atendimento analítico ético e humano</span>
            </div>
          </div>
        </div>

        <div class="hero__visual">
          <figure class="hero-emblem-card" style="margin: 0;">
            <div class="hero-emblem-card__frame">
              <picture>
                <source type="image/avif" srcset="${escapeHtml(relevoAvif)}" />
                <source type="image/webp" srcset="${escapeHtml(relevoWebp)}" />
                <img
                  src="${escapeHtml(relevoJpg)}"
                  alt="Relevo circular simbólico com inscrições antigas presente na identidade do Espaço Arte-Ciência"
                  width="279"
                  height="250"
                  fetchpriority="high"
                  decoding="async"
                />
              </picture>
            </div>
            <figcaption class="hero-emblem-card__caption">
              Lugar da Psicologia Analítica de C. G. Jung e M.-L. von Franz
            </figcaption>
            <div class="hero-emblem-card__pillars">
              Formação | Análise Junguiana | Seminários | Cursos | Publicações
            </div>
          </figure>
        </div>
      </div>
    </section>

    <!-- 3. PRÓXIMAS ATIVIDADES -->
    <section class="section section--elevated" id="proximas-atividades" aria-labelledby="heading-atividades">
      <div class="container">
        <div class="section__header">
          <span class="section__eyebrow">Agenda Verificada</span>
          <h2 id="heading-atividades">Próximas atividades e seminários</h2>
          <p class="section__lead">
            Confira os encontros programados e converse com a equipe pelo WhatsApp para confirmar disponibilidade de inscrições, horários e detalhes de participação.
          </p>
        </div>

        ${upcomingContent}

        <div class="mt-8" style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between; padding-top: 1.5rem; border-top: 1px solid var(--color-border);">
          <p class="mb-0 text-muted" style="font-size: var(--text-sm);">
            Deseja consultar o histórico de temas já realizados ou verificar o calendário completo?
          </p>
          <a href="${escapeHtml(atividadesHref)}" class="btn btn--ghost btn--sm">
            Acessar central Atividades do Espaço
          </a>
        </div>
      </div>
    </section>

    <!-- 4. NOSSA HISTÓRIA -->
    <section class="section" id="nossa-historia" aria-labelledby="heading-historia">
      <div class="container two-col-editorial">
        <div>
          <span class="section__eyebrow">Trajetória e Cultura Simbólica</span>
          <h2 id="heading-historia">Nossa História</h2>
          <p>
            Fundado pelas analistas junguianas <strong>Conceição Soares Beltrão</strong>, <strong>Elisa Freitas Machado</strong> e <strong>Flora Bojunga Mattos</strong>, o Espaço Arte-Ciência desenvolve há quatro décadas um trabalho contínuo de estudo e difusão da Psicologia Analítica de Carl Gustav Jung e Marie-Louise von Franz, a partir de Porto Alegre (RS).
          </p>
          <p>
            Ao longo de sua trajetória, a instituição estruturou palestras, cursos e seminários voltados a pessoas interessadas em compreender a relação viva entre o inconsciente e a consciência. Na perspectiva cultivada pelo Espaço, a expressão criativa e artística é reconhecida como caminho privilegiado de observação da realidade psíquica e autoconhecimento.
          </p>
          <p>
            Essa diretriz deu origem a ateliês de artes visuais, canto, dança e outras linguagens mobilizadas pelo trabalho com os sonhos, além de registros históricos como a realização de oficinas de expressão fundamentadas na Psicologia Junguiana durante o Fórum Social Mundial de 2003.
          </p>
          <div class="mt-6">
            <a href="${escapeHtml(historiaHref)}" class="btn btn--secondary">
              Ler a história completa do Espaço
            </a>
          </div>
        </div>

        <div>
          <div class="historical-portraits" aria-label="Referências teóricas fundamentais">
            <figure class="historical-figure">
              <picture>
                <source type="image/avif" srcset="${escapeHtml(jungAvif)}" />
                <source type="image/webp" srcset="${escapeHtml(jungWebp)}" />
                <img
                  src="${escapeHtml(jungJpg)}"
                  alt="Retrato de Carl Gustav Jung"
                  width="219"
                  height="412"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <figcaption>Carl Gustav Jung</figcaption>
            </figure>
            <figure class="historical-figure">
              <picture>
                <source type="image/avif" srcset="${escapeHtml(vonFranzAvif)}" />
                <source type="image/webp" srcset="${escapeHtml(vonFranzWebp)}" />
                <img
                  src="${escapeHtml(vonFranzJpg)}"
                  alt="Retrato de Marie-Louise von Franz"
                  width="280"
                  height="373"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <figcaption>Marie-Louise von Franz</figcaption>
            </figure>
          </div>

          <blockquote class="quote-card mt-6">
            <p class="quote-card__text">"${escapeHtml(site.citacoes[1].texto)}"</p>
            <cite class="quote-card__cite">${escapeHtml(site.citacoes[1].autor)} - ${escapeHtml(site.citacoes[1].obra)}</cite>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- 5. QUEM SOMOS -->
    <section class="section section--warm" id="quem-somos" aria-labelledby="heading-equipe">
      <div class="container">
        <div class="section__header">
          <span class="section__eyebrow">Corpo Institucional</span>
          <h2 id="heading-equipe">Quem Somos</h2>
          <p class="section__lead">
            Conheça os seis profissionais apresentados pelo Espaço Arte-Ciência, cujas trajetórias articulam a Psicologia Analítica a campos como literatura, música, artes cênicas, belas artes, tradução, filologia e medicina.
          </p>
        </div>

        <div class="team-grid">
          ${teamCardsHtml}
        </div>

        <div class="mt-8" style="text-align: center;">
          <a href="${escapeHtml(quemSomosHref)}" class="btn btn--secondary">
            Ver página dedicada Quem Somos
          </a>
        </div>
      </div>
    </section>

    <!-- 6. ANÁLISE JUNGUIANA -->
    <section class="section" id="analise-junguiana" aria-labelledby="heading-analise">
      <div class="container">
        <div class="section__header">
          <span class="section__eyebrow">Clínica e Estudo Simbólico</span>
          <h2 id="heading-analise">Análise Junguiana e Seminários: entenda a proposta</h2>
          <p class="section__lead">
            Segundo a visão de C. G. Jung e Marie-Louise von Franz difundida pelo Espaço Arte-Ciência, o trabalho analítico busca favorecer o diálogo entre a consciência do <em>eu</em> e o centro da personalidade total, o <strong>Si-mesmo</strong>, orientando-se para o <strong>processo de individuação</strong>.
          </p>
        </div>

        <div class="comparison-grid">
          <div class="comparison-box comparison-box--highlight">
            <h3>Participação em Seminários e Encontros</h3>
            <p>
              Os seminários são atividades culturais e formativas abertas a estudantes, pesquisadores e interessados em aprofundar temas específicos da obra de Jung e von Franz, como mitos de criação, o tempo psíquico, alquimia, astrologia e expressão simbólica.
            </p>
            <ul>
              <li>Encontros temáticos com datas definidas na agenda anual.</li>
              <li>Espaço de estudo conceitual e reflexão compartilhada.</li>
              <li>Inscrições e informações diretamente pelo WhatsApp institucional.</li>
            </ul>
            <a href="${escapeHtml(atividadesHref)}" class="btn btn--secondary btn--sm mt-4">Conferir agenda de seminários</a>
          </div>

          <div class="comparison-box">
            <h3>Atendimento em Análise Junguiana</h3>
            <p>
              A Análise Junguiana é um processo psicoterapêutico e analítico individual. Fundamenta-se na observação cuidadosa dos sonhos, na atitude reflexiva perante os acontecimentos da vida e na técnica da imaginação ativa, respeitando a singularidade de cada pessoa.
            </p>
            <ul>
              <li>Acompanhamento clínico individualizado e sigiloso.</li>
              <li>Diálogo com o inconsciente voltado ao fluxo vital e à individuação.</li>
              <li>Encaminhamento e consulta de disponibilidade mediante contato prévio.</li>
            </ul>
            <a href="${escapeHtml(analiseHref)}" class="btn btn--ghost btn--sm mt-4">Saiba mais sobre Análise Junguiana</a>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. COMO PARTICIPAR -->
    <section class="section section--elevated" id="como-participar" aria-labelledby="heading-participar">
      <div class="container">
        <div class="section__header">
          <span class="section__eyebrow">Passo a Passo</span>
          <h2 id="heading-participar">Como participar dos seminários</h2>
          <p class="section__lead">
            O atendimento para informações e inscrições é realizado de forma direta e humana pela equipe do Espaço Arte-Ciência.
          </p>
        </div>

        <div class="steps-grid">
          ${stepsHtml}
        </div>

        <div class="notice-box mt-8">
          <strong>Orientação importante sobre prazos e valores:</strong> Conforme diretriz institucional, solicita-se que a inscrição em seminário avulso seja realizada com <strong>antecedência mínima de 48 horas</strong> da data do encontro para o envio do link de participação. Os valores vigentes e modalidades de pagamento são informados no atendimento via WhatsApp.
        </div>
      </div>
    </section>

    <!-- 8. PERGUNTAS FREQUENTES -->
    <section class="section" id="perguntas-frequentes" aria-labelledby="heading-faq">
      <div class="container">
        <div class="section__header">
          <span class="section__eyebrow">Dúvidas Comuns</span>
          <h2 id="heading-faq">Perguntas frequentes</h2>
          <p class="section__lead">
            Respostas objetivas baseadas exclusivamente nas informações verificadas nas páginas oficiais da instituição.
          </p>
        </div>

        <div class="faq-list">
          ${faqHtml}
        </div>
      </div>
    </section>

    <!-- 9. ENCERRAMENTO -->
    <section class="section section--warm" aria-labelledby="heading-encerramento">
      <div class="container">
        <div class="closing-banner">
          <div>
            <span class="section__eyebrow">Atendimento Direto</span>
            <h2 id="heading-encerramento">Converse com o Espaço Arte-Ciência</h2>
            <p class="mb-0">
              Para consultar detalhes sobre o próximo seminário, confirmar valores atualizados ou solicitar informações sobre Formação e Análise Junguiana, entre em contato pelo WhatsApp ou envie um e-mail.
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem; flex-shrink: 0;">
            <a href="${escapeHtml(waGeneralHref)}" class="btn btn--whatsapp" target="_blank" rel="noopener noreferrer" data-cta-origin="closing_whatsapp_primary">
              ${renderWhatsAppIcon("whatsapp-fab__icon")}
              <span>WhatsApp: ${escapeHtml(site.contatos.whatsappPrincipal.rotulo)}</span>
            </a>
            <a href="${escapeHtml(waSecondaryHref)}" class="btn btn--secondary btn--sm" target="_blank" rel="noopener noreferrer" data-cta-origin="closing_whatsapp_secondary">
              <span>Alternativo: ${escapeHtml(site.contatos.whatsappSecundario.rotulo)}</span>
            </a>
            <a href="mailto:${escapeHtml(site.contatos.email)}" class="btn btn--ghost btn--sm">
              <span>E-mail: ${escapeHtml(site.contatos.email)}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  `;

  return renderBaseLayout({
    site,
    title: "Espaço Arte-Ciência | Seminários e Psicologia Analítica de Jung e von Franz",
    description:
      "Seminários, cursos, formação e Análise Junguiana no Espaço Arte-Ciência. Quatro décadas difundindo a visão de mundo de Carl Gustav Jung e Marie-Louise von Franz.",
    canonicalPath: "/",
    currentNavPath: "/",
    basePrefix,
    inlineCss,
    preloadHeroImage: true,
    extraJsonLdNodes: buildOrganizationGraph(site, analistas, true),
    bodyContent
  });
}
