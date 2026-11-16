# Relatório de Auditoria Técnica, Redesign da Marca, Mapa de URLs e Desempenho

**Data de execução:** 16 de novembro de 2026  
**Ambiente de teste:** Windows 10/11 (`win32 x64`), Node.js `v24.22.1`, Python `3.14.4` + Pillow `13.0.0` (suporte nativo a AVIF e WebP).

---

## 1. Redesign Proposto do Logotipo e Relação com a Marca Existente

> **Nota institucional:** O logotipo vetorial entregue neste projeto é uma **proposta técnica de redesign e vetorização**, elaborada a partir da inspeção direta da marca histórica do Espaço Arte-Ciência (`media_1794837961012_9c41e517.png`), sem alegar aprovação institucional prévia.

### 1.1. Análise do Símbolo Original
Na marca original do Espaço Arte-Ciência, à esquerda do nome institucional em capitulares serifadas, figura um **escaravelho preto voltado horizontalmente para a direita**, sustentando entre as patas dianteiras um **disco solar vermelho/escarlate**.
- Na tradição simbólica estudada por **Carl Gustav Jung** (especialmente em *Sincronicidade: Um Princípio de Conexão Acausal*) e **Marie-Louise von Franz**, o escaravelho (*Khepri*) representa o movimento de renovação psíquica, renascimento e emergência da luz da consciência (o disco solar) a partir das profundezas do inconsciente.
- Por essa razão, o símbolo original **não foi substituído** por ícones genéricos de psicologia, cérebro ou mandalas abstratas.

### 1.2. Evolução Visual e Entregáveis (`public/assets/logo/`)
O desenho foi inteiramente reconstruído em curvas vetoriais SVG limpas:
- Preserva a orientação horizontal do escaravelho para a direita, as seis patas articuladas, a divisão sutil entre o pronoto e os élitros e o disco solar escarlate (`#C62E26`) acolhido pelas patas anteriores.
- Combina o símbolo à tipografia serifada editorial clássica (`ESPAÇO ARTE-CIÊNCIA`) e à assinatura institucional (`PSICOLOGIA ANALÍTICA · C. G. JUNG E M.-L. VON FRANZ`).
- Mantém acessibilidade completa via `<title>`, `<desc>`, `aria-label` e texto HTML no cabeçalho.

**Arquivos entregues em `public/assets/logo/`:**
1. `logo-horizontal.svg` e `logo-horizontal.png` (`920 × 152 px`) — versão principal horizontal;
2. `logo-compact.svg` e `logo-compact.png` (`460 × 136 px`) — versão compacta;
3. `logo-mono-dark.svg` — versão monocromática carvão (`#1C1917`);
4. `logo-mono-light.svg` — versão clara para fundos escuros (rodapé);
5. `favicon.svg`, `favicon-32x32.png`, `favicon-16x16.png` e `apple-touch-icon.png` (`180 × 180 px`);
6. `referencia-marca-original.png` — recorte preservado da marca original para comparação.

---

## 2. Mapa de URLs e Redirecionamentos 301 (Sem Cadeias)

### 2.1. Rotas Canônicas Indexáveis (`dist/sitemap.xml`)

| Rota Canônica | Arquivo Gerado (`dist/`) | Status HTTP | Finalidade |
|---|---|---|---|
| `https://www.espacoarteciencia.com.br/` | `dist/index.html` | `200 OK` | Landing page institucional e conversão para seminários via WhatsApp |
| `https://www.espacoarteciencia.com.br/cursos-e-seminarios/` | `dist/cursos-e-seminarios/index.html` | `200 OK` | Central "Atividades do Espaço" (próximos seminários + histórico) |
| `https://www.espacoarteciencia.com.br/nossa-historia/` | `dist/nossa-historia/index.html` | `200 OK` | Página institucional "Nossa História" preservada |
| `https://www.espacoarteciencia.com.br/quem-somos-nos/` | `dist/quem-somos-nos/index.html` | `200 OK` | Página institucional "Quem Somos" com os 6 profissionais |
| `https://www.espacoarteciencia.com.br/psicoterapia-junguiana-1/` | `dist/psicoterapia-junguiana-1/index.html` | `200 OK` | Página institucional "Análise Junguiana" preservada |
| `https://www.espacoarteciencia.com.br/seminarios/o-tempo-na-perspectiva-de-jung-e-von-franz/` | `dist/seminarios/o-tempo-na-perspectiva-de-jung-e-von-franz/index.html` | `200 OK` | Página individual do seminário de 21/11/2026 |
| `https://www.espacoarteciencia.com.br/seminarios/iii-mitos-de-criacao-de-marie-louise-von-franz/` | `dist/seminarios/iii-mitos-de-criacao-de-marie-louise-von-franz/index.html` | `200 OK` | Página individual do seminário histórico de 07/11/2026 |

### 2.2. Redirecionamentos 301 Individuais (`dist/_redirects` e `scripts/serve.mjs`)

Para eliminar caracteres percent-encoded (`n%C3%B3s`, `hist%C3%B3ria`, `semin%C3%A1rios`) em links e páginas e preservar o tráfego de URLs antigas com acento sem cadeias de redirecionamento:

| Origem Legada (Com Acento) | Destino Limpo (Salto Único) | Código HTTP |
|---|---|---|
| `/cursos-e-seminários` | `/cursos-e-seminarios/` | `301 Moved Permanently` |
| `/nossa-história` | `/nossa-historia/` | `301 Moved Permanently` |
| `/quem-somos-nós` | `/quem-somos-nos/` | `301 Moved Permanently` |
| `/formação` | `/formacao/` | `301 Moved Permanently` |

As áreas secundárias (`/formacao/`, `/textos/`, `/livros-dvds/`, `/galeria/`, `/contato/`) também foram preservadas e geradas em `dist/` e acessíveis na navegação secundária do rodapé, além de `dist/404.html` com retorno HTTP `404`.

---

## 3. SEO Técnico, Dados Estruturados (Schema.org) e Descoberta em IA

### 3.1. Diretrizes Oficiais Consultadas (Google Search Central)
1. **SEO Starter Guide & AI Features (`ai-features`):** Conforme documentação oficial do Google para *AI Overviews* e *AI Mode*, não existem tags secretas, esquemas exclusivos ou requisitos de `llms.txt` para ranqueamento. A visibilidade decorre dos fundamentos verificáveis aplicados neste projeto: HTML semântico, entidades claras, autoria explícita, textos em HTML real (não embutidos em banners) e correspondência fiel entre conteúdo visível e metadados.
2. **Dados Estruturados (`JSON-LD`):**
   - Cada página possui um único bloco `<script type="application/ld+json">` centralizado (`@graph`).
   - Entidades implementadas: `EducationalOrganization`, `WebSite`, `BreadcrumbList` (nas páginas internas), `Person` (para os 6 profissionais na Home e em Quem Somos) e `Event` (nas páginas individuais de seminários).
   - **Nota sobre elegibilidade de Rich Results para `Event`:** De acordo com a documentação vigente do Google Search Central (`structured-data/event`), *experiências puramente virtuais sem componente de local físico (`Place`) não são elegíveis à experiência enriquecida de Eventos na Busca do Google*. Como os seminários divulgados pelo Espaço Arte-Ciência operam mediante envio de link aos inscritos e não divulgam endereço físico público de realização, o `Event` foi marcado estritamente com dados reais confirmados (`name`, `startDate`, `description`, `eventStatus`, `organizer`), **sem inventar endereço físico (`Place`) nem preço fictício (`Offers`)**. A marcação é 100% válida segundo o vocabulário `Schema.org` para compreensão semântica de entidades, sem prometer *rich result* indevido.
   - Conforme boas práticas atuais, **não** foi utilizado `FAQPage` em páginas institucionais/comerciais comuns (restrito pelo Google a sites governamentais e de saúde de alta autoridade).

---

## 4. Acessibilidade (WCAG 2.2 AA) e Validação HTML/CSS

Resultados auditados por `scripts/validate.mjs` (registro completo em `docs/relatorio-validacao.json`):

### 4.1. Tabela de Contrastes Cromaticamente Verificados

| Par de Cores | Hexadecimal (Texto / Fundo) | Razão de Contraste Calculada | Meta WCAG 2.2 AA | Resultado |
|---|---|---|---|---|
| Texto principal sobre fundo marfim | `#1C1917` / `#FAF6F0` | **16.19 : 1** | ≥ 4.5 : 1 | Aprovado (AAA) |
| Texto secundário sobre fundo marfim | `#443E38` / `#FAF6F0` | **9.43 : 1** | ≥ 4.5 : 1 | Aprovado (AAA) |
| Texto de apoio sobre fundo marfim | `#5C534A` / `#FAF6F0` | **6.62 : 1** | ≥ 4.5 : 1 | Aprovado (AA) |
| Laranja institucional escuro sobre marfim | `#9E3E0E` / `#FAF6F0` | **6.18 : 1** | ≥ 4.5 : 1 | Aprovado (AA) |
| Laranja institucional escuro sobre branco | `#9E3E0E` / `#FFFFFF` | **6.76 : 1** | ≥ 4.5 : 1 | Aprovado (AA) |
| Texto branco sobre botão laranja primário | `#FFFFFF` / `#9E3E0E` | **6.76 : 1** | ≥ 4.5 : 1 | Aprovado (AA) |
| Texto branco sobre botão WhatsApp | `#FFFFFF` / `#1B5E20` | **7.86 : 1** | ≥ 4.5 : 1 | Aprovado (AAA) |
| Texto claro do rodapé sobre carvão | `#FAF6F0` / `#1C1917` | **16.19 : 1** | ≥ 4.5 : 1 | Aprovado (AAA) |

### 4.2. Critérios Estruturais e Interativos Atendidos
- **Teclado e Foco:** Skip-link funcional (`Pular para o conteúdo principal`), `:focus-visible` com contorno sólido de `3px` e `outline-offset: 3px`, ordem lógica de tabulação e fechamento do menu móvel via tecla `Escape` com devolução de foco ao botão `#menu-toggle`.
- **Áreas de Toque e Responsividade:** Botões, links de navegação e controles de filtro com altura mínima de `44px` a `52px` (WCAG 2.5.8 Target Size). No mobile (`<= 768px`), o `body` reserva `padding-bottom: calc(4.75rem + env(safe-area-inset-bottom))` para que o botão flutuante de WhatsApp jamais encubra links ou informações do rodapé.
- **Hierarquia e Semântica:** 16 páginas geradas auditadas com `<!DOCTYPE html>`, `lang="pt-BR"`, `UTF-8`, exatamente um `<h1>` por página e progressão estrita `H1 -> H2 -> H3` sem saltos de nível.

---

## 5. Desempenho, Orçamento de Recursos e Core Web Vitals

### 5.1. Medições Reais de Orçamento (`docs/relatorio-validacao.json`)

| Métrica / Recurso | Tamanho Bruto | Tamanho Comprimido (Gzip) | Orçamento Máximo | Status |
|---|---|---|---|---|
| **CSS próprio (`styles.css`)** | `21.84 KB` (`21,843 B`) | **`4.16 KB` (`4,262 B`)** | `35 KB` (`35,840 B`) | **Aprovado (11,9% do limite)** |
| **JS próprio (`main.js`)** | `3.32 KB` (`3,404 B`) | **`1.32 KB` (`1,347 B`)** | `40 KB` (`40,960 B`) | **Aprovado (3,3% do limite)** |
| **HTML da Home (`index.html`)** | `29.40 KB` (`30,108 B`) | **`6.90 KB` (`7,068 B`)** | — | Enxuto e SSR completo |
| **Imagem LCP (`relevo-simbolico-institucional.avif`)** | `38.20 KB` (`39,119 B`) | `38.20 KB` (`39,119 B`) | — | Preload + `fetchpriority="high"` |
| **Total da Primeira Dobra (HTML + CSS + JS + LCP AVIF)** | — | **`50.58 KB` (`51,796 B`)** | `500 KB` (`512,000 B`) | **Aprovado (10,1% do limite)** |

### 5.2. Otimizações para Core Web Vitals e Limitações de Ambiente
- **LCP (meta de campo ≤ 2,5 s):** A imagem principal do Hero é servida em AVIF (`38.2 KB`) e WebP (`43.1 KB`) com fallback JPEG, pré-carregada com `<link rel="preload" as="image" fetchpriority="high">` e **sem** `loading="lazy"`. As demais imagens fora da primeira dobra utilizam `loading="lazy"` e `decoding="async"`.
- **CLS (meta de campo ≤ 0,1):** Todas as imagens e logotipos possuem atributos explícitos `width` e `height` no HTML, e a tipografia baseia-se em famílias locais do sistema (`Georgia` e `system-ui`), eliminando trocas tardias de fontes web (FOIT/FOUT = zero).
- **INP (meta de campo ≤ 200 ms):** Apenas `1.32 KB` (gzip) de JavaScript nativo adiado (`defer`), sem frameworks SPA, sem bibliotecas externas e sem *long tasks* na thread principal.
- **Distinção entre Laboratório e Dados de Campo:**
  - *Dados de campo (CrUX / Real User Monitoring):* **Dados de campo indisponíveis** para esta nova implementação antes da publicação em produção e coleta no percentil 75 de usuários reais. Além disso, o TBT (*Total Blocking Time*) de laboratório não substitui o INP real de campo.
  - *Limitação de execução local do Lighthouse:* O sandbox de segurança do ambiente bloqueia conexões TCP locais de loopback (`connect EACCES 127.0.0.1`), impedindo a conexão de uma instância headless do Chrome DevTools/Lighthouse via porta de rede dentro do sandbox. Por isso, não declaramos nota simulada do Lighthouse sem execução de navegador; em seu lugar, executamos e anexamos em `docs/relatorio-validacao.json` a auditoria estática e de roteamento em memória (`scripts/validate.mjs`), e documentamos no `README.md` o comando exato para rodar o Lighthouse localmente fora do sandbox.
