# Inventário de Fontes, Imagens, Pendências e Divergências

**Data-base de consulta e revalidação:** 16 de novembro de 2026 (`America/Sao_Paulo`).

---

## 1. Páginas Oficiais Consultadas

| Página | URL Canônica Observada | Data de Consulta | Status / Método de Verificação | Fatos Verificados Utilizados |
|---|---|---|---|---|
| **Início** | `https://www.espacoarteciencia.com.br/` | 16/11/2026 | Verificada via índice de busca e capturas anexadas (`media_1794837866754` a `media_1794837873151`) | Nome institucional, subtítulo (*Lugar da Psicologia Analítica de C. G. Jung e M.-L. von Franz*), missão de quatro décadas, eixos (*Formação, Análise Junguiana, Seminários, Cursos, Publicações*), 4 citações (C. G. Jung, M.-L. von Franz e Barbara Hannah) e menu com 10 itens. |
| **Nossa História** | `https://www.espacoarteciencia.com.br/nossa-historia` | 16/11/2026 | Verificada via pesquisa indexada do domínio | Fundação por Conceição Soares Beltrão, Elisa Freitas Machado e Flora Bojunga Mattos; foco na participação do inconsciente na ampliação da consciência; valorização da expressão artística como instrumento de autoconhecimento; ateliês de artes visuais, canto e dança; participação no Fórum Social Mundial de 2003 (Porto Alegre/RS). |
| **Quem Somos** | `https://www.espacoarteciencia.com.br/quem-somos-nos` | 16/11/2026 | Verificada via pesquisa indexada e capturas individuais (`media_1794837889720` a `media_1794837899555`) | Apresentação de seis profissionais: Alessandra Gusatto, Conceição Soares Beltrão, Elisa Freitas Machado, Elis Souza, Flora Bojunga Mattos e Nathanael Bellini Cabrera, com retratos fotográficos e trajetórias completas. |
| **Análise Junguiana** | `https://www.espacoarteciencia.com.br/psicoterapia-junguiana-1` | 16/11/2026 | Verificada via pesquisa indexada do domínio | Definição da função da Análise Junguiana como facilitação do diálogo entre a consciência do *eu* e o *Si-mesmo*; métodos de análise de sonhos, atitude reflexiva e imaginação ativa; meta no processo de individuação; relação nominal de cinco analistas. |
| **Atividades do Espaço** | `https://www.espacoarteciencia.com.br/cursos-e-seminarios` | 16/11/2026 | Verificada via pesquisa indexada do domínio | Programação de seminários de novembro (*07 de novembro: III Mitos de Criação de Marie-Louise von Franz*; *21 de novembro: O Tempo na Perspectiva de Jung e Von Franz*); orientação de inscrição com antecedência mínima de 48h para envio do link; contatos de WhatsApp `(51) 98175-1727` e `(51) 99247-7179` e e-mail `eacpoars@espacoarteciencia.com.br`. |
| **Formação e áreas secundárias** | `https://www.espacoarteciencia.com.br/formacao` (e `/textos`, `/livros-dvds`, `/galeria`, `/contato`) | 16/11/2026 | Verificada via pesquisa indexada do domínio | Curso de Formação em Psicologia Junguiana voltado a graduados de todas as áreas (presencial em Porto Alegre e a distância), com 36h/semestre de seminários/cursos, 72h/semestre de supervisões individuais e mínimo de 24 sessões de Análise Junguiana. |

> **Nota sobre limitações de rede no ambiente de execução:** O sandbox de terminal opera com isolamento de conexões externas diretas; a verificação das páginas e diretrizes oficiais do Google Search Central foi realizada por meio da ferramenta de pesquisa web integrada e das 11 capturas de alta fidelidade anexadas ao projeto.

---

## 2. Inventário de Imagens e Direitos

### 2.1. Retratos Reais da Equipe ("Quem Somos")

Como o ambiente isolado não permite download direto do CDN `https://static.wixstatic.com/media/`, os seis retratos oficiais foram extraídos com precisão de pixel diretamente das capturas anexadas da página *Quem Somos*, sem uso de inteligência artificial generativa, sem alteração de feições e sem corte de rostos:

| Profissional | Identificador no CDN Oficial (`static.wixstatic.com/media/`) | Anexo de Origem Utilizado | Arquivos Gerados no Projeto (`public/assets/images/equipe/`) | Dimensões Nativas Extraídas |
|---|---|---|---|---|
| **Alessandra Gusatto** | `bca5de_18061fae27fd433c9aaaf84c77c18b0d~mv2.jpg` | `media_1794837889720_af940220.jpg` | `alessandra-gusatto.{avif,webp,jpg}` (+ `240w`, `340w`) | `370 × 422 px` |
| **Conceição Soares Beltrão** | `478bee_3741ff39f6544bc4a9ae1029973207e8~mv2.jpeg` | `media_1794837891421_a7227447.jpg` | `conceicao-soares-beltrao.{avif,webp,jpg}` (+ `240w`, `340w`) | `357 × 346 px` |
| **Elisa Freitas Machado** | `478bee_ee4f3400405148e49f8b25458cdae70d~mv2.jpg` | `media_1794837893184_0ce2bee0.jpg` | `elisa-freitas-machado.{avif,webp,jpg}` (+ `240w`, `340w`) | `366 × 286 px` |
| **Elis Souza** | `478bee_82a7d923a6f64d19af1ffdcd1a1179fc~mv2.jpg` | `media_1794837895253_c5a26598.jpg` | `elis-souza.{avif,webp,jpg}` (+ `240w`, `340w`) | `365 × 286 px` |
| **Flora Bojunga Mattos** | `478bee_6da6b4cdd87a48a0bb657148e4dcf5bf~mv2.jpeg` | `media_1794837897176_d9949bf3.jpg` | `flora-bojunga-mattos.{avif,webp,jpg}` (+ `240w`, `340w`) | `346 × 343 px` |
| **Nathanael Bellini Cabrera** | `bca5de_108404cf0e624b84aa4ddfff22ef4c35~mv2.jpg` | `media_1794837899555_46072f08.jpg` | `nathanael-bellini-cabrera.{avif,webp,jpg}` (+ `240w`, `340w`) | `347 × 365 px` |

### 2.2. Imagens Institucionais e Históricas

| Ativo | Anexo de Origem | Arquivos Gerados (`public/assets/images/institucional/`) | Dimensões | Uso |
|---|---|---|---|---|
| **Relevo circular simbólico** | `media_1794837866754_0472de57.jpg` | `relevo-simbolico-institucional.{avif,webp,jpg}` | `279 × 250 px` | Imagem principal (LCP) do Hero e card Open Graph |
| **Retrato de Carl Gustav Jung** | `media_1794837868713_bd648d0a.jpg` | `carl-gustav-jung.{avif,webp,jpg}` | `219 × 412 px` | Seção Nossa História |
| **Retrato de Marie-Louise von Franz** | `media_1794837870512_64249665.jpg` | `marie-louise-von-franz.{avif,webp,jpg}` | `280 × 373 px` | Seção Nossa História e histórico de seminários |
| **Referência da marca original** | `media_1794837961012_9c41e517.png` | `public/assets/logo/referencia-marca-original.png` | `599 × 62 px` | Documentação e base para o redesign vetorial |

**Aviso de direitos autorais e de imagem:** As fotografias dos profissionais e os elementos visuais pertencem ao acervo institucional do Espaço Arte-Ciência e aos respectivos titulares. A publicação no site institucional de origem autoriza apenas a representação da própria instituição e de sua equipe neste projeto, não configurando licença aberta para uso por terceiros.

---

## 3. Divergências Observadas e Tratamento Editorial

1. **Composição de "Quem Somos" vs. "Análise Junguiana" (Elis Souza):**
   - *Fato observado:* A página `Quem Somos` apresenta 6 integrantes (incluindo **Elis Souza**, que concluiu a Formação de Analista Junguiana no EAC em 2025), enquanto a página `Análise Junguiana` lista nominalmente 5 analistas (Alessandra Gusatto, Conceição Soares Beltrão, Elisa Freitas Machado, Flora Bojunga Mattos e Nathanael Bellini Cabrera).
   - *Decisão aplicada:* Todos os 6 integrantes são apresentados na seção e na página `Quem Somos`. Na página `Análise Junguiana`, manteve-se a listagem fiel aos 5 nomes confirmados na fonte daquela seção, acompanhada de nota transparente orientando a consulta via WhatsApp sobre disponibilidade de atendimento individual.

2. **Agenda 2026 com Valores Referenciados a 2025:**
   - *Fato observado:* Na página de origem de `Atividades do Espaço`, a programação é identificada como 2026, mas os valores exibidos (*6 Seminários Semestre 01: R$ 1.890,00; Semestre 02: R$ 1.890,00; Seminário Avulso: R$ 450,00*) faziam referência a pacote de 2025.
   - *Decisão aplicada:* Os valores de 2025 **não** foram publicados como oferta vigente. No cadastro estruturado (`src/content/seminarios/*.json`), o campo `preco` foi mantido como `null` (diferenciando claramente de gratuito ou zero) e na interface pública exibe-se `"Consulte os detalhes pelo WhatsApp"`.

3. **Seminário de 21/11/2026 vs. Seminário de 07/11/2026:**
   - *Fato observado:* Na data de execução (`16/11/2026`), o seminário *"III Mitos de Criação de Marie-Louise von Franz"* (`07/11/2026`) já ocorreu, enquanto o seminário *"O Tempo na Perspectiva de Jung e Von Franz"* (`21/11/2026`) permanece com data futura.
   - *Decisão aplicada:* Apenas o seminário de `21/11/2026` aparece em destaque na Home e no bloco de "Próximos seminários" da central de atividades, com o status `"Programado — consulte disponibilidade de inscrições pelo WhatsApp"` (já que data futura isolada não comprova vagas remanescentes). O seminário de `07/11/2026` é exibido exclusivamente no bloco separado de **Histórico de atividades realizadas**, sem botão de inscrição ativa.

4. **Padronização de URLs Limpas (Sem `%C3` / Acentos):**
   - *Fato observado:* As rotas originais do Wix continham caracteres acentuados que geravam sequências percent-encoded (`quem-somos-n%C3%B3s`, `nossa-hist%C3%B3ria`, `cursos-e-semin%C3%A1rios`) em links, sitemaps e servidores locais.
   - *Decisão aplicada:* Todas as rotas geradas, links internos, `canonical` e `sitemap.xml` utilizam URLs limpas sem acento (`/cursos-e-seminarios/`, `/nossa-historia/`, `/quem-somos-nos/`, `/psicoterapia-junguiana-1/`), enquanto `dist/_redirects` e `scripts/serve.mjs` mantêm redirecionamentos HTTP 301 diretos (sem cadeias) a partir das variantes acentuadas legadas.

5. **Campos Operacionais Pendentes:**
   - Horário de início/término, link de sala virtual, emissão de certificado e gravação não constam publicamente nas páginas de origem e permanecem registrados como `null` no cadastro editorial, orientando o visitante a consultar pelo WhatsApp.
