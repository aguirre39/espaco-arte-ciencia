# Espaço Arte-Ciência — Landing Page Institucional e Central de Seminários

Implementação estática de alto desempenho, acessível (WCAG 2.2 AA) e orientada à conversão ética via WhatsApp para o **Espaço Arte-Ciência (EAC)** — instituição dedicada há quatro décadas ao estudo e à difusão da Psicologia Analítica de **Carl Gustav Jung** e **Marie-Louise von Franz**.

---

## 1. Justificativa Arquitetural e Stack

Conforme requisito de evitar aplicações SPA pesadas e priorizar geração estática reproduzível com separação estrita entre dados editoriais, apresentação e comportamento, o projeto utiliza:
- **Gerador Estático Zero-Dependência em Node.js (`scripts/build.mjs`):** Compila dados JSON estruturados e templates modulares em HTML5 semântico puro, minifica CSS, gera automaticamente páginas individuais de seminários, `sitemap.xml`, `robots.txt` e regras de redirecionamento HTTP 301 (`_redirects` e `_headers`). Não depende de pacotes externos vulneráveis ou *bundlers* complexos, garantindo reprodutibilidade imediata offline e em qualquer pipeline de CI/CD.
- **Pipeline de Imagens e Ativos em Python + Pillow (`scripts/optimize-assets.py`):** Extrai com precisão de pixel os 6 retratos reais de *Quem Somos* e as imagens históricas dos anexos verificados, gerando versões responsivas em **AVIF**, **WebP** e **JPEG** (fallback), além das exportações PNG do logotipo redesenhado, favicons e imagem Open Graph (`1200 × 630 px`).
- **Aprimoramento Progressivo (`public/assets/js/main.js`):** Todo o conteúdo essencial (agenda de seminários, biografias completas da equipe, perguntas frequentes e todos os CTAs de WhatsApp) está presente no HTML gerado e funciona integralmente mesmo com JavaScript desativado. O script (`1.3 KB` gzip) aprimora o menu móvel acessível, o filtro instantâneo da agenda e a instrumentação ética de eventos.

---

## 2. Estrutura de Diretórios

```text
c:\Espaco-Arte-Ciencia\
├── src/
│   ├── data/
│   │   ├── site.json              # Contatos, domínio, navegação, FAQ e mensagens de WhatsApp
│   │   └── analistas.json         # Os 6 profissionais de Quem Somos, biografias e imagens
│   ├── content/
│   │   └── seminarios/            # Um arquivo JSON por evento (validado por schema)
│   ├── components/
│   │   ├── header.mjs             # Cabeçalho compacto e menu móvel acessível
│   │   ├── footer.mjs             # Rodapé institucional, contatos e navegação secundária
│   │   ├── cards.mjs              # Cards de seminários e de profissionais (sem cortar rostos)
│   │   └── whatsapp.mjs           # Geração de URLs encodeURIComponent, estados de data e FAB
│   ├── layouts/
│   │   └── base.mjs               # Template HTML5, Open Graph, Breadcrumbs e JSON-LD (@graph)
│   ├── pages/
│   │   ├── home.mjs               # Página principal (10 seções na ordem especificada)
│   │   ├── atividades.mjs         # Central "Atividades do Espaço" (/cursos-e-seminários/)
│   │   ├── seminario-detalhe.mjs  # Páginas individuais (/seminarios/slug-descritivo/)
│   │   └── institucionais.mjs     # Nossa História, Quem Somos, Análise Junguiana, 404 e acervo
│   └── styles/
│       ├── tokens.css             # Variáveis de cor (contraste AA/AAA), tipografia e espaçamento
│       ├── base.css               # Reset, skip-link, foco visível e safe-area mobile
│       ├── components.css         # Estilos de cabeçalho, hero, cards, FAQ, rodapé e FAB
│       └── utilities.css          # Utilitários, estados vazios e impressão
├── public/
│   └── assets/
│       ├── images/                # Retratos otimizados (AVIF, WebP, JPG) e Open Graph
│       ├── logo/                  # Logo vetorial SVG (horizontal, compacto, mono, favicon) e PNGs
│       └── js/main.js             # Script leve de aprimoramento progressivo
├── scripts/
│   ├── optimize-assets.py         # Extração e conversão de imagens (AVIF/WebP/JPG) e logos PNG
│   ├── build.mjs                  # Gerador estático e validador de schema de seminários
│   ├── validate.mjs               # Auditoria automatizada (HTML, WCAG AA, JSON-LD, HTTP e orçamento)
│   └── serve.mjs                  # Servidor HTTP estático local com suporte a UTF-8, 301 e 404
├── docs/
│   ├── fontes.md                  # Inventário de fontes, imagens, direitos e divergências
│   ├── manutencao.md              # Guia passo a passo de atualização editorial
│   ├── auditoria.md               # Relatório técnico, redesign do logo, mapa de URLs e métricas
│   └── relatorio-validacao.json   # Evidência estruturada gerada pela suíte de validação
└── dist/                          # Build estático final pronto para publicação
```

---

## 3. Instalação, Build e Validação

### Pré-requisitos
- **Node.js** `>= 18` (testado com Node.js `v24.22.1`)
- **Python** `>= 3.10` com `Pillow >= 10` (apenas caso deseje regerar os recortes e conversões AVIF/WebP a partir das imagens brutas)

### Comandos Principais

1. **Gerar o build estático em `dist/`:**
   ```powershell
   node scripts/build.mjs
   ```

2. **Executar a suíte completa de validação (Schema, HTML5, Contraste WCAG 2.2 AA, JSON-LD, Simulação de Data da Agenda, Sondas HTTP 200/301/404 e Orçamento de Desempenho):**
   ```powershell
   node scripts/validate.mjs
   ```

3. **Regerar ativos de imagem e logotipos (opcional):**
   ```powershell
   python scripts/optimize-assets.py
   ```

4. **Iniciar servidor HTTP local para navegação e testes no navegador (`http://127.0.0.1:4173`):**
   ```powershell
   node scripts/serve.mjs
   ```

---

## 4. Publicação e Atualização Agendada da Agenda

### Publicação Estática
O diretório `dist/` contém todos os arquivos estáticos prontos para publicação em qualquer serviço de hospedagem estática ou CDN (Cloudflare Pages, Netlify, Vercel, Nginx ou Apache):
- O arquivo `dist/_redirects` configura os redirecionamentos `301` individuais sem cadeias (convertendo rotas legadas com acento para as rotas limpas `/cursos-e-seminarios/`, `/nossa-historia/`, `/quem-somos-nos/`).
- O arquivo `dist/_headers` configura cache imutável de 1 ano para `/assets/*` e revalidação imediata para documentos `.html`.
- Antes de publicar em produção, certifique-se de que ambientes de *staging* utilizem proteção por senha/autenticação HTTP e que apenas o domínio oficial sirva as páginas indexáveis.

### Atualização Automática de Eventos Passados
Para garantir que um seminário cuja data já passou deixe automaticamente de aparecer como próximo evento na Home:
- Configure uma rotina agendada (GitHub Actions / Cron diário na hospedagem) que execute `node scripts/build.mjs` definindo a variável de ambiente `BUILD_REFERENCE_DATE` com a data atual em `America/Sao_Paulo` (ex.: `BUILD_REFERENCE_DATE=2026-11-22 node scripts/build.mjs`).
- Veja instruções detalhadas de edição no arquivo [docs/manutencao.md](docs/manutencao.md).
