# PROMPT MASTER — ESPAÇO ARTE-CIÊNCIA
## Landing page institucional, seminários e conversão pelo WhatsApp
Base de pesquisa: 16 de novembro de 2026. Revalidar agenda e condições na execução.

Atue como programador web sênior, designer de interfaces, especialista em acessibilidade, SEO técnico, descoberta em buscas com IA e marketing digital. Desenvolva uma página principal premium para o Espaço Arte-Ciência, com destaque para seminários e uma página própria “Atividades do Espaço”. Entregue código completo, organizado, responsivo, documentação de manutenção e evidências reais de validação.

O objetivo é apresentar a instituição, explicar sua proposta, valorizar a equipe e conduzir interessados em seminários para uma conversa pelo WhatsApp. Use persuasão ética: clareza, hierarquia visual, informações verificáveis e redução de dúvidas. Não invente depoimentos, inscrições, resultados clínicos, vagas restantes ou urgência.

## 1. Pesquisa obrigatória e fontes de verdade

Leia as páginas antes de implementar:
- Início: https://www.espacoarteciencia.com.br/
- Nossa História: https://www.espacoarteciencia.com.br/nossa-hist%C3%B3ria
- Quem Somos: https://www.espacoarteciencia.com.br/quem-somos-n%C3%B3s
- Análise Junguiana: https://www.espacoarteciencia.com.br/psicoterapia-junguiana-1
- Atividades do Espaço: https://www.espacoarteciencia.com.br/cursos-e-semin%C3%A1rios

Use também as imagens anexadas como referência de identidade visual e para conferir a correspondência entre nomes e fotografias. O arquivo SITE-REFERENCIA.txt contém uma variante sem acento da URL de cursos; confira o destino real antes de definir rotas canônicas.

Registre em docs/fontes.md: URL, data de consulta, fatos utilizados, origem das imagens e divergências. Se uma página falhar, relate a limitação e use apenas material disponível e verificável.

Contexto confirmado:
- A instituição divulga a perspectiva de Carl Gustav Jung e Marie-Louise von Franz.
- Conceição Soares Beltrão, Elisa Freitas Machado e Flora Bojunga Mattos são cofundadoras.
- A história inclui atividades culturais, estudo e expressão artística.
- A página “Quem Somos” apresenta seis profissionais.
- Contatos públicos: (51) 98175-1727, (51) 99247-7179 e eacpoars@espacoarteciencia.com.br.
Não deduza endereço físico ou ano de fundação a partir da referência a quatro décadas de trabalho.

Divergências observadas em 16/11/2026:
- “Quem Somos” inclui Elis Souza; “Análise Junguiana” não a inclui em sua lista. Inclua os seis na apresentação institucional, mas não afirme disponibilidade de atendimento individual sem confirmação.
- A agenda está identificada como 2026, mas os pacotes de preços fazem referência a 2025. Não reaproveite esses valores como oferta vigente.
- Há seminário anunciado para 21/11/2026, “O Tempo na Perspectiva de Jung e Von Franz”. Na execução, confira se ainda é futuro e se as inscrições estão disponíveis. Data futura, sozinha, não comprova vagas.
- Informações ausentes, como horário, modalidade, investimento, certificado e gravação, devem ficar pendentes no cadastro editorial. Para o público, use “Consulte os detalhes pelo WhatsApp”, sem preencher dados fictícios.

## 2. Identidade visual e redesign do logotipo

Preserve o reconhecimento do Espaço Arte-Ciência: laranja, tons quentes, preto/carvão, fundos claros e referências simbólicas presentes na marca original.

Crie uma evolução visual elegante, cultural e acolhedora:
- Fundo branco quente ou marfim, texto carvão e laranja como destaque.
- Use laranja mais escuro para textos ou botões quando necessário para contraste.
- Texturas discretas apenas em áreas decorativas, sem comprometer leitura.
- Títulos com personalidade editorial; corpo com fonte de alta legibilidade.
- Poucas famílias e pesos tipográficos; fontes locais licenciadas ou alternativas do sistema.
- Espaço entre blocos, parágrafos curtos e composição equilibrada.
- Evite mosaicos de grandes blocos laranja, textos claros sobre laranja sem contraste, texto justificado e cabeçalho cobrindo o conteúdo.

Redesenhe o logo a partir da marca original visível nas referências. Preserve o nome “Espaço Arte-Ciência” e interprete seu símbolo somente após inspecioná-lo. Não substitua a identidade por cérebro genérico, símbolo médico, ícone de IA ou mandala sem relação com a referência.

Entregue logo vetorial SVG limpo, versões horizontal e compacta, monocromática, favicon e exportação PNG. Explique a relação entre o desenho proposto e a marca existente. Textos precisam estar corretos; mantenha acessibilidade do nome por texto HTML ou nome acessível. Apresente a proposta de logo como redesign, sem alegar aprovação institucional.

## 3. Arquitetura de informação e manutenção

A página principal deve funcionar como entrada institucional e comercial. “Atividades do Espaço” deve ser a página central da agenda, com acesso destacado na principal.

Rotas:
- / — principal;
- preservar /nossa-história, /quem-somos-nós e /psicoterapia-junguiana-1;
- preservar /cursos-e-seminários como central de atividades;
- novas páginas individuais: /seminarios/slug-descritivo/.

Não altere URLs existentes apenas por estética. Se necessário, documente redirecionamentos 301 individuais, sem cadeias. Preserve o acesso às demais áreas do site, como Formação, Textos, Livros/DVDs, Galeria e Contato, em navegação secundária ou rodapé.

Prefira geração estática com templates e dados estruturados, produzindo HTML, CSS e JavaScript leve. Um gerador simples ou Astro em modo estático é aceitável; justifique a escolha. Não use uma aplicação SPA pesada para conteúdo institucional.

Organize:
- src/data/site.json: contatos, domínio, navegação e configurações;
- src/data/analistas.json: equipe, biografias, imagens e fontes;
- src/content/seminarios/: um arquivo por evento;
- src/components/: cabeçalho, rodapé, cards, CTAs e WhatsApp;
- src/layouts/: templates reutilizáveis;
- src/pages/: rotas;
- src/styles/: tokens, base, componentes e utilitários;
- public/assets/: imagens, logo, fontes e ícones;
- scripts/: geração, validação e otimização;
- docs/: fontes, manutenção e auditoria.

A implementação pode adaptar essa estrutura ao stack, mantendo a separação entre conteúdo, apresentação e comportamento. Não duplique contatos, equipe ou agenda em vários arquivos.

O conteúdo essencial deve estar no HTML gerado, inclusive equipe e eventos. JavaScript deve aprimorar filtros e navegação, sem ser necessário para descobrir informações ou acessar CTAs.

Use esquema de validação para eventos: id, slug, título, resumo, descrição, tópicos, data, horário opcional, fuso, modalidade, local/link público, ministrantes, preço opcional, moeda, situação, prazo de inscrição, imagem, fonte e data de revisão. Diferencie desconhecido de gratuito; não converta campos ausentes em zero.

Use America/Sao_Paulo quando confirmado para a agenda. Não invente hora de início. Defina atualização por build agendado ou rotina documentada, para que o destaque da home não permaneça com evento passado. Estados de data e disponibilidade de inscrições devem ser independentes.

## 4. Estrutura da página principal

1. Cabeçalho compacto:
Logo, links para Atividades do Espaço, Nossa História, Quem Somos e Análise Junguiana, além de CTA “Informações e inscrições”. Menu móvel acessível.

2. Hero:
H1 sugerido: “Seminários e encontros de Psicologia Analítica”.
Texto de apoio autoral sobre a proposta institucional, sem promessas clínicas.
CTA principal: “Consultar seminários pelo WhatsApp”.
CTA secundário: “Ver atividades do Espaço”.
Imagem institucional pertinente e leve; evite carrossel automático e vídeo de fundo.

3. Próximas atividades:
Bloco com destaque visual logo após o hero. Mostrar somente eventos futuros verificados, título, data e informações confirmadas. Cards com “Conhecer o seminário” e CTA contextual de WhatsApp.
Na ausência de programação futura, mostrar “Consulte a próxima programação”, sem inventar eventos.

4. Nossa História:
Resumo original e fiel às fontes, com link para a página completa. Valorize trajetória e proposta cultural; não transforme antigas parcerias em endossos atuais.

5. Quem Somos:
Apresente os seis profissionais com fotos verdadeiras, nomes completos e sínteses de biografia. Evite homogeneizar formações ou atribuir a todos títulos de psicólogo ou médico. Use “Conhecer trajetória” para conteúdo completo.

6. Análise Junguiana:
Explique em linguagem acessível a proposta apresentada pela instituição e diferencie atendimento individual de participação em seminários. Link para a página completa; não prometa cura nem atribua resultados garantidos.

7. Como participar:
Consultar programação → conversar com a equipe → receber as orientações de inscrição. Informar pagamento e acesso apenas conforme procedimento confirmado.

8. Perguntas frequentes:
Responder dúvidas reais sobre público, inscrições, formato, datas e contato, somente com base verificada. Não afirmar certificado, gravação ou ausência de pré-requisitos sem fonte.

9. Encerramento:
Convite sereno para conhecer a programação, CTA de WhatsApp e alternativa de e-mail.

10. Rodapé:
Contatos, navegação secundária, políticas reais e identificação institucional. Não copiar créditos de desenvolvimento como se descrevessem o novo trabalho.

## 5. Fotos reais da equipe

Use todos os seis retratos encontrados em “Quem Somos”. A correspondência observada na fonte é:

| Profissional | Arquivo de origem identificado no CDN oficial |
|---|---|
| Alessandra Gusatto | bca5de_18061fae27fd433c9aaaf84c77c18b0d~mv2.jpg |
| Conceição Soares Beltrão | 478bee_3741ff39f6544bc4a9ae1029973207e8~mv2.jpeg |
| Elisa Freitas Machado | 478bee_ee4f3400405148e49f8b25458cdae70d~mv2.jpg |
| Elis Souza | 478bee_82a7d923a6f64d19af1ffdcd1a1179fc~mv2.jpg |
| Flora Bojunga Mattos | 478bee_6da6b4cdd87a48a0bb657148e4dcf5bf~mv2.jpeg |
| Nathanael Bellini Cabrera | bca5de_108404cf0e624b84aa4ddfff22ef4c35~mv2.jpg |

Os links da página usam https://static.wixstatic.com/media/ seguido do identificador e de parâmetros de transformação. Reextraia as URLs efetivas da fonte e valide os arquivos; não presuma que uma URL reconstruída responde corretamente. Na pesquisa inicial, os vínculos foram identificados, mas a ferramenta não conseguiu recuperar os bytes das fotos.

Baixe as fotos oficiais quando acessíveis e hospede as versões otimizadas no projeto, sem hotlink permanente. Confira cada foto contra as referências anexadas. Se o original não estiver disponível, registre a pendência ou extraia apenas o retrato correspondente do anexo, preservando resolução suficiente.

Não gere novos rostos por IA. Preserve feições, proporções e enquadramento respeitoso. Padronize os cards sem cortar rostos. Use nomes descritivos, alt adequado, dimensões explícitas, srcset/sizes e formatos WebP/AVIF com fallback. Registre origem e direitos informados; publicação no site de origem não significa licença aberta para uso irrestrito.

## 6. Atividades do Espaço e páginas de eventos

A central deve conter:
- Introdução objetiva e agenda em lista ou cards legíveis.
- Próximos seminários em primeiro plano.
- Filtro por ano e tipo apenas se houver conteúdo suficiente.
- Histórico em seção separada, com eventos passados claramente identificados.
- Estados sem resultados e sem programação futura.
- URL própria por seminário quando houver conteúdo confirmado suficiente.

Cada página de seminário deve apresentar título, tema, data, público, proposta, tópicos e ministrantes confirmados, informações práticas e CTA. Não criar páginas vazias só para capturar palavras-chave.

O botão de um evento deve abrir WhatsApp com título e data em uma mensagem editável. Eventos passados não devem oferecer inscrição como vigente.

## 7. Funil e WhatsApp

Topo: explicar proposta e despertar interesse pelo tema.
Meio: apresentar programação, trajetórias e detalhes para decidir.
Fundo: facilitar conversa e inscrição com contexto.

Adote inicialmente o primeiro contato público como principal configurável:
https://wa.me/5551981751727

Mantenha o segundo contato acessível:
https://wa.me/5551992477179

Mensagem geral sugerida:
“Olá! Conheci o Espaço Arte-Ciência e gostaria de informações sobre os próximos seminários.”

Mensagem por evento:
“Olá! Tenho interesse no seminário [título], previsto para [data]. Poderiam informar os detalhes e como me inscrever?”

Gere a query com encodeURIComponent. Não envie automaticamente mensagens.
Implemente botão flutuante de WhatsApp leve, usando link e ícone SVG local, sem carregar SDK de chat. Nome acessível: “Conversar com o Espaço Arte-Ciência pelo WhatsApp”.

No celular, respeite safe-area e reserve espaço para não encobrir conteúdo, links, rodapé ou controles. Evite pulsação contínua, pop-ups e balões intrusivos. CTA flutuante deve coexistir com botões contextuais nas seções.

Se houver analytics configurado, meça whatsapp_click e seminar_view com origem do CTA e id do evento. Clique no WhatsApp é intenção de contato, não inscrição confirmada. Não envie mensagens, nomes ou dados sensíveis para analytics. Não instale rastreadores com IDs inventados.

## 8. SEO técnico e descoberta em IA

Consulte as orientações oficiais vigentes na execução:
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/appearance/structured-data/event
- https://developers.google.com/search/docs/appearance/core-web-vitals

Não trate “SEO GEO 2026” como certificação ou lista de truques. Aplique fundamentos verificáveis: conteúdo útil, entidades consistentes, autoria, fontes, links internos e rastreabilidade. Não prometa primeira posição ou citação por assistentes de IA.

Implemente:
- HTML semântico, lang pt-BR, UTF-8 e hierarquia coerente.
- Title e description únicos e descritivos por página.
- Canonical absoluto para a URL preferida; não apontar todos para a home.
- Open Graph e imagem social pertinente.
- Sitemap apenas com URLs indexáveis, canônicas e HTTP 200.
- robots.txt coerente; proteger staging por autenticação ou mecanismo apropriado e verificar remoção de noindex em produção.
- URLs estáveis, redirecionamentos corretos, página 404 real e links rastreáveis com href.
- Conteúdo principal em texto, não embutido em banners.
- Termos usados naturalmente: seminários de psicologia analítica, seminários junguianos, Carl Gustav Jung, Marie-Louise von Franz e Espaço Arte-Ciência.
- Porto Alegre apenas em contexto factual; “online” só onde confirmado.
- Datas de atualização apenas quando houve revisão efetiva.

Gere JSON-LD centralizado e consistente com o conteúdo visível:
Organization, WebSite, BreadcrumbList nas páginas internas e Person quando pertinente.
Use Event nas páginas individuais com dados reais suficientes. Verifique requisitos atuais de elegibilidade, inclusive restrições a eventos exclusivamente virtuais: validade no Schema.org não garante rich result no Google.
Nunca invente local, oferta, preço, horário, avaliação ou disponibilidade para completar marcação.
Não use FAQPage com expectativa de resultado enriquecido para uma página comercial comum.
Não remova schema.org nem adicione blocos duplicados e contraditórios.

Para descoberta por IA, mantenha resumos objetivos, nomes completos, descrições claras dos eventos e contexto institucional verificável. Não insira instruções escondidas para LLMs, repetição artificial de palavras-chave ou llms.txt como suposto requisito de ranqueamento.

## 9. Acessibilidade e padrões web

Referências:
https://www.w3.org/TR/WCAG22/
https://validator.w3.org/nu/

Meta WCAG 2.2 AA:
- Navegação completa por teclado, foco visível e ordem lógica.
- Skip link e landmarks semânticos.
- Menu móvel com estado expandido e controle correto de foco.
- Contraste mínimo de 4,5:1 para texto comum e 3:1 para texto grande.
- Controles e indicadores com contraste adequado.
- Texto base confortável, entrelinha ampla e largura de leitura controlada.
- Layout utilizável com zoom e em telas pequenas, sem rolagem horizontal indevida.
- Área de toque preferencialmente de 44 × 44 CSS px, respeitando os requisitos e exceções da norma.
- Links descritivos; ícones decorativos ocultos da tecnologia assistiva.
- Respeito a prefers-reduced-motion.
- Não depender exclusivamente de cor.
- Nada de carrossel automático, fontes minúsculas ou animações invasivas.

Valide HTML no Nu Html Checker e CSS com ferramenta apropriada. Corrija erros relevantes. Testes automáticos complementam a revisão manual; não comprovam conformidade completa sozinhos.

## 10. Desempenho e critérios reais de aceite

Buscar nota 100 no Lighthouse em desempenho, acessibilidade, boas práticas e SEO, no mobile e desktop. Apresentar resultados reais e limitações; não declarar nota sem executar teste.

Distinguir Lighthouse de Core Web Vitals de campo.
Metas no percentil 75: LCP ≤ 2,5 s; INP ≤ 200 ms; CLS ≤ 0,1.
Referência: https://web.dev/articles/vitals

- Imagem LCP dimensionada, otimizada e sem lazy loading.
- Lazy loading apenas para imagens fora da primeira dobra.
- Dimensões explícitas para evitar deslocamentos.
- CSS enxuto e JS adiado, sem bibliotecas para interações triviais.
- Fontes limitadas, font-display e preload seletivo.
- Cache e compressão no ambiente de hospedagem.
- Nada de terceiros desnecessários ou bibliotecas inteiras de ícones.
- Orçamento inicial proposto: JS próprio comprimido até 40 KB; CSS comprimido até 35 KB; primeira dobra até 500 KB quando viável. Documentar exceções.
- Não afirmar INP real usando apenas TBT do Lighthouse.
- Sem dados de campo suficientes, registrar “dados de campo indisponíveis”.

## 11. Entregáveis e validação

Entregue:
1. Código completo e build estático reproduzível.
2. Logo redesenhado e ativos reais otimizados.
3. Principal, central de atividades e páginas internas previstas.
4. Dados editoriais separados dos componentes.
5. README com instalação, build e publicação.
6. Guia simples: adicionar seminário, alterar data, encerrar inscrições, trocar foto e modificar WhatsApp.
7. Inventário de fontes, imagens, pendências e divergências.
8. Relatório com testes executados, resultados, ambiente e limitações.
9. Mapa de URLs e redirecionamentos quando houver migração.

Teste mobile, tablet e desktop; menu, teclado, foco, links, CTAs e mensagens de WhatsApp; estados da agenda; caracteres UTF-8; dados estruturados; HTML; responsividade e desempenho.

Garanta que uma edição no cadastro atualize automaticamente home, central e página do evento. Não manter cópias manuais da agenda. Faça testes relevantes de data, situação de inscrições e geração de URLs.

Execute o trabalho completo com os dados disponíveis. Mantenha dúvidas comerciais em registro editorial e use alternativas públicas honestas. Não publique fatos pendentes como confirmados. Entregue uma experiência limpa, rápida, fiel à instituição e simples de atualizar.

