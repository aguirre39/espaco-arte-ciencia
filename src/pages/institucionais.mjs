import {
  escapeHtml,
  buildWhatsAppUrl,
  resolvePageLink,
  renderWhatsAppIcon
} from "../components/whatsapp.mjs";
import { renderAnalystCard } from "../components/cards.mjs";
import { renderBaseLayout, buildOrganizationGraph } from "../layouts/base.mjs";

export function renderNossaHistoriaPage({ site, analistas, basePrefix = "..", inlineCss = "" }) {
  const waHref = buildWhatsAppUrl(
    site.contatos.whatsappPrincipal.urlBase,
    site.contatos.mensagensPadrao.geral
  );
  const atividadesHref = resolvePageLink("/cursos-e-seminarios/", basePrefix);
  const quemSomosHref = resolvePageLink("/quem-somos-nos/", basePrefix);

  const quotesHtml = site.citacoes
    .map(
      (c) => `<blockquote class="quote-card">
        <p class="quote-card__text">"${escapeHtml(c.texto)}"</p>
        <cite class="quote-card__cite">${escapeHtml(c.autor)} - ${escapeHtml(c.obra)}</cite>
      </blockquote>`
    )
    .join("\n          ");

  const bodyContent = `
    <section class="hero" aria-labelledby="historia-title">
      <div class="container">
        <span class="hero__badge">Memória e Propósito Institucional</span>
        <h1 id="historia-title" class="hero__title">Nossa História</h1>
        <p class="hero__subtitle">
          Quatro décadas dedicadas ao estudo, à expressão criativa e à divulgação da visão de mundo de Carl Gustav Jung e Marie-Louise von Franz.
        </p>
      </div>
    </section>

    <section class="section section--elevated">
      <div class="container two-col-editorial">
        <div>
          <h2>Fundação e Visão de Mundo</h2>
          <p>
            O <strong>Espaço Arte-Ciência (EAC)</strong> foi fundado por <strong>Conceição Soares Beltrão</strong>, <strong>Elisa Freitas Machado</strong> e <strong>Flora Bojunga Mattos</strong> com o propósito central de compartilhar a produção intelectual e difundir a visão de mundo da Psicologia Analítica de Carl Gustav Jung e Marie-Louise von Franz.
          </p>
          <p>
            Desde a sua origem em Porto Alegre (RS), as atividades da instituição dirigem-se a pessoas interessadas em compreender e vincular suas vidas à participação do inconsciente na ampliação da consciência.
          </p>

          <h2>A Expressão Artística como Instrumento de Autoconhecimento</h2>
          <p>
            Ao longo de sua trajetória, o Espaço Arte-Ciência consolidou palestras, cursos, grupos de estudo e seminários fundamentados na perspectiva junguiana que valoriza a expressão simbólica, conceituada em sentido amplo como "artística", enquanto via legítima de observação psíquica e autoconhecimento.
          </p>
          <p>
            Para acolher e estimular as manifestações do inconsciente, foram estruturados ateliês de artes visuais, canto, dança e outras linguagens sinalizadas pelo trabalho com os sonhos e pela imaginação ativa.
          </p>

          <h2>Marcos Históricos e Continuidade</h2>
          <p>
            Entre os registros históricos de inserção cultural da instituição destaca-se a participação no <strong>Fórum Social Mundial de 2003</strong>, em Porto Alegre, com a realização de oficinas de expressão embasadas na Psicologia Junguiana.
          </p>
          <p>
            Atualmente, o Espaço Arte-Ciência mantém sua programação regular de seminários temáticos, grupos de estudo, clínica analítica e o Programa de Formação de Analista Junguiano, reunindo profissionais no Brasil e no exterior.
          </p>

          <div class="hero__actions mt-8">
            <a href="${escapeHtml(atividadesHref)}" class="btn btn--primary">Ver seminários e atividades</a>
            <a href="${escapeHtml(quemSomosHref)}" class="btn btn--secondary">Conhecer a equipe</a>
            <a href="${escapeHtml(waHref)}" class="btn btn--whatsapp" target="_blank" rel="noopener noreferrer" data-cta-origin="historia_whatsapp">
              ${renderWhatsAppIcon("whatsapp-fab__icon")}
              <span>Conversar pelo WhatsApp</span>
            </a>
          </div>
        </div>

        <aside aria-label="Citações de referência na Psicologia Analítica">
          <h2 style="font-size: var(--text-xl);">Referências que orientam o Espaço</h2>
          ${quotesHtml}
        </aside>
      </div>
    </section>
  `;

  return renderBaseLayout({
    site,
    title: "Nossa História | Espaço Arte-Ciência",
    description:
      "Conheça a história do Espaço Arte-Ciência, fundado por Conceição Soares Beltrão, Elisa Freitas Machado e Flora Bojunga Mattos para difundir a obra de Jung e von Franz.",
    canonicalPath: "/nossa-historia/",
    currentNavPath: "/nossa-historia/",
    basePrefix,
    inlineCss,
    breadcrumbs: [
      { name: "Início", url: "/", href: "/" },
      { name: "Nossa História", url: "/nossa-historia/", href: "/nossa-historia/" }
    ],
    extraJsonLdNodes: buildOrganizationGraph(site, analistas, false),
    bodyContent
  });
}

export function renderQuemSomosPage({ site, analistas, basePrefix = "..", inlineCss = "" }) {
  const cardsHtml = analistas.map((a) => renderAnalystCard(a, basePrefix)).join("\n        ");

  const bodyContent = `
    <section class="hero" aria-labelledby="quem-somos-title">
      <div class="container">
        <span class="hero__badge">Corpo Institucional | Seis Profissionais</span>
        <h1 id="quem-somos-title" class="hero__title">Quem Somos</h1>
        <p class="hero__subtitle">
          Profissionais dedicados ao estudo, à tradução, à clínica e ao ensino da Psicologia Analítica de Carl Gustav Jung e Marie-Louise von Franz.
        </p>
      </div>
    </section>

    <section class="section section--elevated" aria-labelledby="equipe-completa-heading">
      <div class="container">
        <div class="section__header">
          <span class="section__eyebrow">Trajetórias Verificadas</span>
          <h2 id="equipe-completa-heading">Corpo de Analistas e Pesquisadores</h2>
          <p class="section__lead">
            Clique em "Conhecer trajetória" em cada perfil para ler a biografia completa e as áreas de formação.
          </p>
        </div>
        <div class="team-grid">
          ${cardsHtml}
        </div>
      </div>
    </section>
  `;

  return renderBaseLayout({
    site,
    title: "Quem Somos | Equipe do Espaço Arte-Ciência",
    description:
      "Conheça os profissionais do Espaço Arte-Ciência: Conceição Soares Beltrão, Elisa Freitas Machado, Flora Bojunga Mattos, Alessandra Gusatto, Elis Souza e Nathanael Bellini Cabrera.",
    canonicalPath: "/quem-somos-nos/",
    currentNavPath: "/quem-somos-nos/",
    basePrefix,
    inlineCss,
    breadcrumbs: [
      { name: "Início", url: "/", href: "/" },
      { name: "Quem Somos", url: "/quem-somos-nos/", href: "/quem-somos-nos/" }
    ],
    extraJsonLdNodes: buildOrganizationGraph(site, analistas, true),
    bodyContent
  });
}

export function renderAnaliseJunguianaPage({ site, analistas, basePrefix = "..", inlineCss = "" }) {
  const waAnaliseHref = buildWhatsAppUrl(
    site.contatos.whatsappPrincipal.urlBase,
    site.contatos.mensagensPadrao.analiseIndividual
  );
  const quemSomosHref = resolvePageLink("/quem-somos-nos/", basePrefix);
  const atividadesHref = resolvePageLink("/cursos-e-seminarios/", basePrefix);

  const analistasListados = analistas.filter((a) => a.listadaEmAnaliseJunguiana);

  const analistasLinks = analistasListados
    .map((a) => {
      const profileHref = resolvePageLink(`/quem-somos-nos/#profissional-${a.slug}`, basePrefix);
      return `<li><strong><a href="${escapeHtml(profileHref)}">${escapeHtml(a.nome)}</a></strong> - ${escapeHtml(a.papelInstitucional)} (${escapeHtml(a.localidade)})</li>`;
    })
    .join("\n            ");

  const bodyContent = `
    <section class="hero" aria-labelledby="analise-title">
      <div class="container">
        <span class="hero__badge">Clínica Analítica | C. G. Jung e M.-L. von Franz</span>
        <h1 id="analise-title" class="hero__title">Análise Junguiana</h1>
        <p class="hero__subtitle">
          O diálogo entre a consciência do eu e o centro da personalidade total, o Si-mesmo, voltado ao processo de individuação.
        </p>
      </div>
    </section>

    <section class="section section--elevated">
      <div class="container two-col-editorial">
        <div>
          <h2>A Função da Análise Junguiana</h2>
          <p>
            Na perspectiva de <strong>Carl Gustav Jung</strong> e <strong>Marie-Louise von Franz</strong> adotada pelo Espaço Arte-Ciência, a função primordial da Análise Junguiana é favorecer o diálogo entre a consciência do <em>eu</em> e o centro regulador da personalidade total, denominado <strong>Si-mesmo</strong> (<em>Self</em>).
          </p>
          <p>
            Esse trabalho estabelece uma nova relação com a vida interior por meio de três pilares fundamentais:
          </p>
          <ul>
            <li><strong>Análise dos sonhos:</strong> observação cuidadosa das imagens oníricas enquanto expressões autênticas e compensatórias do inconsciente.</li>
            <li><strong>Atitude reflexiva:</strong> atenção ética e simbólica perante os acontecimentos cotidianos, sintomas e sincronismos da própria biografia.</li>
            <li><strong>Imaginação ativa:</strong> método de aproximação consciente e expressiva com as imagens e afetos emergentes da psique.</li>
          </ul>
          <p>
            O desenvolvimento desse percurso analítico auxilia o fluxo vital e mantém-se orientado para o <strong>processo de individuação</strong>, a realização gradual da totalidade singular de cada indivíduo, sem promessas padronizadas ou fórmulas prévias.
          </p>

          <h2>Corpo de Analistas</h2>
          <p>
            Conforme relação apresentada na seção de Análise Junguiana da instituição, integram o corpo clínico:
          </p>
          <ul>
            ${analistasLinks}
          </ul>
          <p style="font-size: var(--text-sm); color: var(--color-text-muted);">
            Para conhecer os seis integrantes da equipe institucional (incluindo Elis Souza, apresentada em <a href="${escapeHtml(quemSomosHref)}">Quem Somos</a>), acesse a página completa da equipe ou consulte a disponibilidade de atendimento pelo WhatsApp.
          </p>

          <div class="hero__actions mt-6">
            <a href="${escapeHtml(waAnaliseHref)}" class="btn btn--whatsapp" target="_blank" rel="noopener noreferrer" data-cta-origin="analise_page_whatsapp">
              ${renderWhatsAppIcon("whatsapp-fab__icon")}
              <span>Solicitar informações pelo WhatsApp</span>
            </a>
            <a href="${escapeHtml(atividadesHref)}" class="btn btn--secondary">
              Conhecer os seminários do Espaço
            </a>
          </div>
        </div>

        <aside aria-label="Citação de Marie-Louise von Franz">
          <blockquote class="quote-card">
            <p class="quote-card__text">"${escapeHtml(site.citacoes[2].texto)}"</p>
            <cite class="quote-card__cite">${escapeHtml(site.citacoes[2].autor)} - ${escapeHtml(site.citacoes[2].obra)}</cite>
          </blockquote>
          <blockquote class="quote-card">
            <p class="quote-card__text">"${escapeHtml(site.citacoes[3].texto)}"</p>
            <cite class="quote-card__cite">${escapeHtml(site.citacoes[3].autor)} - ${escapeHtml(site.citacoes[3].obra)}</cite>
          </blockquote>
        </aside>
      </div>
    </section>
  `;

  return renderBaseLayout({
    site,
    title: "Análise Junguiana | Espaço Arte-Ciência",
    description:
      "Entenda a proposta da Análise Junguiana no Espaço Arte-Ciência: diálogo com o Si-mesmo, análise de sonhos, imaginação ativa e processo de individuação.",
    canonicalPath: "/psicoterapia-junguiana-1/",
    currentNavPath: "/psicoterapia-junguiana-1/",
    basePrefix,
    inlineCss,
    breadcrumbs: [
      { name: "Início", url: "/", href: "/" },
      { name: "Análise Junguiana", url: "/psicoterapia-junguiana-1/", href: "/psicoterapia-junguiana-1/" }
    ],
    extraJsonLdNodes: buildOrganizationGraph(site, analistas, false),
    bodyContent
  });
}

export function renderSecondaryAreaPage({ site, analistas, area, basePrefix = "..", inlineCss = "" }) {
  const waHref = buildWhatsAppUrl(
    site.contatos.whatsappPrincipal.urlBase,
    `Olá! Conheci o Espaço Arte-Ciência pelo site e gostaria de informações sobre a seção ${area.rotulo}.`
  );
  const atividadesHref = resolvePageLink("/cursos-e-seminarios/", basePrefix);
  const homeHref = resolvePageLink("/", basePrefix);

  let specificHtml = `<p>${escapeHtml(area.descricao)}</p>`;
  if (area.rotulo === "Formação") {
    specificHtml = `
      <p>O <strong>Curso de Formação em Psicologia Junguiana</strong> do Espaço Arte-Ciência é voltado a profissionais e acadêmicos de todas as áreas do conhecimento com graduação concluída (bacharelado, licenciatura plena ou validação equivalente), oferecendo modalidades presencial (em Porto Alegre) e a distância.</p>
      <p>De acordo com as diretrizes curriculares divulgadas pela instituição, o percurso formativo articula:</p>
      <ul>
        <li>Participação em Seminários e Cursos do Espaço Arte-Ciência (36 horas por semestre);</li>
        <li>Supervisões Individuais (72 horas por semestre);</li>
        <li>Realização de sessões de Análise Junguiana pessoal ao longo do percurso (mínimo de 24 sessões).</li>
      </ul>
      <p>A coordenação pedagógica dos cursos a distância é conduzida pela cofundadora Elisa Freitas Machado. Para consultar edital, pré-requisitos e abertura de turma, converse com a equipe pelo WhatsApp.</p>
    `;
  } else if (area.rotulo === "Contato") {
    specificHtml = `
      <p>Entre em contato diretamente com a equipe do Espaço Arte-Ciência pelos canais oficiais abaixo para informações sobre seminários, cursos, publicações, Formação ou Análise Junguiana:</p>
      <ul>
        <li><strong>WhatsApp principal:</strong> <a href="${escapeHtml(waHref)}" target="_blank" rel="noopener noreferrer">${escapeHtml(site.contatos.whatsappPrincipal.rotulo)}</a></li>
        <li><strong>WhatsApp alternativo:</strong> <a href="${escapeHtml(site.contatos.whatsappSecundario.urlBase)}" target="_blank" rel="noopener noreferrer">${escapeHtml(site.contatos.whatsappSecundario.rotulo)}</a></li>
        <li><strong>E-mail institucional:</strong> <a href="mailto:${escapeHtml(site.contatos.email)}">${escapeHtml(site.contatos.email)}</a></li>
      </ul>
    `;
  }

  const bodyContent = `
    <section class="hero" aria-labelledby="sec-area-title">
      <div class="container">
        <span class="hero__badge">Espaço Arte-Ciência | Seção Institucional</span>
        <h1 id="sec-area-title" class="hero__title">${escapeHtml(area.rotulo)}</h1>
        <p class="hero__subtitle">${escapeHtml(area.descricao)}</p>
      </div>
    </section>

    <section class="section section--elevated" aria-labelledby="sec-area-sub">
      <div class="container">
        <h2 id="sec-area-sub">Informações sobre ${escapeHtml(area.rotulo)}</h2>
        ${specificHtml}
        <div class="hero__actions mt-6">
          <a href="${escapeHtml(waHref)}" class="btn btn--whatsapp" target="_blank" rel="noopener noreferrer" data-cta-origin="secondary_${escapeHtml(area.rotulo.toLowerCase())}">
            ${renderWhatsAppIcon("whatsapp-fab__icon")}
            <span>Consultar pelo WhatsApp</span>
          </a>
          <a href="${escapeHtml(atividadesHref)}" class="btn btn--secondary">Ver agenda de seminários</a>
          <a href="${escapeHtml(homeHref)}" class="btn btn--ghost">Voltar ao Início</a>
        </div>
      </div>
    </section>
  `;

  return renderBaseLayout({
    site,
    title: `${area.rotulo} | Espaço Arte-Ciência`,
    description: `${area.descricao} Entre em contato com o Espaço Arte-Ciência pelo WhatsApp para mais informações.`,
    canonicalPath: area.href,
    currentNavPath: area.href,
    basePrefix,
    inlineCss,
    breadcrumbs: [
      { name: "Início", url: "/", href: "/" },
      { name: area.rotulo, url: area.href, href: area.href }
    ],
    extraJsonLdNodes: buildOrganizationGraph(site, analistas, false),
    bodyContent
  });
}

export function render404Page({ site, analistas, basePrefix = ".", inlineCss = "" }) {
  const waHref = buildWhatsAppUrl(
    site.contatos.whatsappPrincipal.urlBase,
    site.contatos.mensagensPadrao.geral
  );
  const homeHref = resolvePageLink("/", basePrefix);
  const atividadesHref = resolvePageLink("/cursos-e-seminarios/", basePrefix);

  const bodyContent = `
    <section class="section">
      <div class="container">
        <div class="empty-state">
          <span class="section__eyebrow">Erro 404</span>
          <h1>Página não encontrada</h1>
          <h2 style="font-size: var(--text-xl); font-weight: 400; color: var(--color-text-secondary);">Endereço indisponível ou movido</h2>
          <p>
            O endereço solicitado não foi localizado ou pode ter sido atualizado. Utilize os links abaixo para navegar até os seminários, páginas institucionais ou atendimento pelo WhatsApp.
          </p>
          <div class="hero__actions mt-6" style="justify-content: center;">
            <a href="${escapeHtml(homeHref)}" class="btn btn--primary">Ir para a página inicial</a>
            <a href="${escapeHtml(atividadesHref)}" class="btn btn--secondary">Ver Atividades do Espaço</a>
            <a href="${escapeHtml(waHref)}" class="btn btn--whatsapp" target="_blank" rel="noopener noreferrer" data-cta-origin="404_whatsapp">
              ${renderWhatsAppIcon("whatsapp-fab__icon")}
              <span>Falar pelo WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  `;

  return renderBaseLayout({
    site,
    title: "Página não encontrada (404) | Espaço Arte-Ciência",
    description: "Página não encontrada no site do Espaço Arte-Ciência. Acesse a programação de seminários ou entre em contato pelo WhatsApp.",
    canonicalPath: "/404.html",
    currentNavPath: "",
    basePrefix,
    inlineCss,
    noindex: true,
    extraJsonLdNodes: buildOrganizationGraph(site, analistas, false),
    bodyContent
  });
}
